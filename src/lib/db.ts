import clientPromise from './mongodb';
import { Db } from 'mongodb';

const DB_NAME = 'bm4u';

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

export async function getOrdersCollection() {
  const db = await getDb();
  return db.collection('orders');
}

export async function getProductsCollection() {
  const db = await getDb();
  return db.collection('products');
}

export async function getPostsCollection() {
  const db = await getDb();
  return db.collection('posts');
}

export async function getSettingsCollection() {
  const db = await getDb();
  return db.collection('settings');
}
