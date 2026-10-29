import { NextRequest, NextResponse } from 'next/server';
import { getOrdersCollection } from '@/lib/db';
import { notifyTxidSubmitted } from '@/lib/telegram';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const ordersCol = await getOrdersCollection();

    const order = await ordersCol.findOne({
      orderId: { $regex: new RegExp(`^${orderId.trim()}$`, 'i') },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (err: any) {
    console.error('Get order error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const body = await req.json();
    const ordersCol = await getOrdersCollection();

    const allowedFields = ['status', 'txid', 'deliveryCredentials', 'adminNotes'];
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    }

    // Also update customer.txid if txid is provided
    if (body.txid) {
      updateData['customer.txid'] = body.txid;
      // If order was awaiting payment, advance to Payment Verified
      if (!body.status) {
        updateData.status = 'Payment Verified';
      }
    }

    const updated = await ordersCol.findOneAndUpdate(
      { orderId: { $regex: new RegExp(`^${orderId.trim()}$`, 'i') } },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Trigger instant Telegram alert if TXID was submitted
    if (body.txid) {
      notifyTxidSubmitted(orderId.trim(), body.txid, updated.customer?.telegram).catch(err =>
        console.error('Telegram TXID notification error:', err)
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      data: updated,
    });
  } catch (err: any) {
    console.error('Update order error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const ordersCol = await getOrdersCollection();

    const result = await ordersCol.deleteOne({
      orderId: { $regex: new RegExp(`^${orderId.trim()}$`, 'i') },
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Order deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
