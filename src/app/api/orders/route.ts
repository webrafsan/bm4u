import { NextRequest, NextResponse } from 'next/server';
import { getOrdersCollection, getProductsCollection } from '@/lib/db';
import { OrderRecord, OrderStatus } from '@/types';
import { notifyNewOrder } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { customer, items, total, cryptoWallet, txid, orderNotes } = body;

    if (!customer?.email || !customer?.telegram) {
      return NextResponse.json(
        { success: false, error: 'Email and Telegram username are required.' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order must contain at least one item.' },
        { status: 400 }
      );
    }

    // Generate readable random order ID: BM-XXXXXX
    const orderId = body.orderId || `BM-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: OrderRecord = {
      orderId,
      customer: {
        fullName: customer.fullName || '',
        email: customer.email.trim(),
        telegram: customer.telegram.trim(),
        paymentMethod: customer.paymentMethod || 'crypto',
        selectedCrypto: customer.selectedCrypto || cryptoWallet?.symbol || 'USDT',
        txid: (txid || customer.txid || '').trim(),
        orderNotes: customer.orderNotes || orderNotes || '',
      },
      cryptoWallet: cryptoWallet || undefined,
      txid: (txid || customer.txid || '').trim(),
      items,
      total: Number(total) || items.reduce((acc: number, it: any) => acc + (it.product.price * it.quantity), 0),
      status: (txid ? 'Payment Verified' : 'Awaiting Payment') as OrderStatus,
      deliveryCredentials: '',
      adminNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. Always trigger automated Telegram notification immediately
    try {
      await notifyNewOrder(newOrder);
      console.log('[BM4U] Telegram alert dispatched for order:', newOrder.orderId);
    } catch (tgErr) {
      console.error('[BM4U] Telegram notification error:', tgErr);
    }

    // 2. Persist to MongoDB
    let insertedId: any = undefined;
    try {
      const ordersCol = await getOrdersCollection();
      const insertResult = await ordersCol.insertOne(newOrder);
      insertedId = insertResult.insertedId;

      const productsCol = await getProductsCollection();
      for (const item of items) {
        if (item.product?.id) {
          await productsCol.updateOne(
            { id: item.product.id },
            { $inc: { stock: -Math.max(1, item.quantity || 1) } }
          );
        }
      }
    } catch (dbErr) {
      console.error('[BM4U] Database order insert notice:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      orderId: newOrder.orderId,
      order: { ...newOrder, _id: insertedId },
    }, { status: 201 });
  } catch (err: any) {
    console.error('Create order error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const ordersCol = await getOrdersCollection();
    const { searchParams } = new URL(req.url);

    const status = searchParams.get('status');
    const search = searchParams.get('search')?.trim();
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    const query: any = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { 'customer.telegram': { $regex: search, $options: 'i' } },
        { txid: { $regex: search, $options: 'i' } },
      ];
    }

    const orders = await ordersCol
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err: any) {
    console.error('Fetch orders error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
