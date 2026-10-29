import { NextResponse } from 'next/server';
import { getOrdersCollection, getProductsCollection, getDb } from '@/lib/db';

export async function GET() {
  const start = Date.now();
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    const pingMs = Date.now() - start;

    const ordersCol = await getOrdersCollection();
    const productsCol = await getProductsCollection();

    const [orders, products] = await Promise.all([
      ordersCol.find({}).sort({ createdAt: -1 }).toArray(),
      productsCol.find({}).toArray(),
    ]);

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => {
      // include revenue if not cancelled
      if (o.status !== 'Cancelled') {
        return sum + (Number(o.total) || 0);
      }
      return sum;
    }, 0);

    const awaitingPayment = orders.filter(o => o.status === 'Awaiting Payment').length;
    const paymentVerified = orders.filter(o => o.status === 'Payment Verified').length;
    const completedOrders = orders.filter(o => o.status === 'Completed').length;
    const lowStockProducts = products.filter(p => Number(p.stock) <= 3).length;

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        awaitingPayment,
        paymentVerified,
        completedOrders,
        totalProducts: products.length,
        lowStockProducts,
        pingMs,
        dbStatus: 'Connected',
      },
      recentOrders: orders.slice(0, 8),
    });
  } catch (err: any) {
    console.error('Dashboard stats error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message,
        stats: {
          totalRevenue: 0,
          totalOrders: 0,
          awaitingPayment: 0,
          paymentVerified: 0,
          completedOrders: 0,
          totalProducts: 0,
          lowStockProducts: 0,
          pingMs: 0,
          dbStatus: 'Error',
        },
        recentOrders: [],
      },
      { status: 500 }
    );
  }
}
