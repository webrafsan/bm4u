import { NextResponse } from 'next/server';

export async function GET() {
  const result: any = {
    time: new Date().toISOString(),
    node: process.version,
    env_keys: Object.keys(process.env).filter(k => k.includes('MONGO') || k.includes('TELEGRAM')),
    telegramTokenLength: process.env.TELEGRAM_BOT_TOKEN?.length || 0,
    telegramChatId: process.env.TELEGRAM_CHAT_ID || 'missing',
  };

  try {
    const { MongoClient } = await import('mongodb');
    result.mongoModuleLoaded = true;

    const uri = process.env.MONGODB_URI || 'none';
    result.mongoUriPrefix = uri.slice(0, 25);
    result.mongoUriHasSpaces = uri.includes(' ');
    result.mongoUriLength = uri.length;

    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 3000 });
    result.clientConstructed = true;

    await client.connect();
    result.clientConnected = true;

    const db = client.db('bm4u');
    const count = await db.collection('products').countDocuments();
    result.productsCount = count;
  } catch (err: any) {
    result.error = {
      message: err?.message,
      name: err?.name,
      code: err?.code,
      stack: err?.stack,
    };
  }

  return NextResponse.json(result);
}
