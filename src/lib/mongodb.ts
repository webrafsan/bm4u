import { MongoClient } from 'mongodb';

const DIRECT_REPLICA_URI = 'mongodb://hirafsan1_db_user:qN8Xp5iY9Z0eflD2@ac-wzh7atb-shard-00-00.vfhwhh0.mongodb.net:27017,ac-wzh7atb-shard-00-01.vfhwhh0.mongodb.net:27017,ac-wzh7atb-shard-00-02.vfhwhh0.mongodb.net:27017/bm4u?ssl=true&replicaSet=atlas-qzp4vq-shard-0&authSource=admin&retryWrites=true&w=majority';

function resolveMongoUri(): string {
  let envUri = process.env.MONGODB_URI || process.env.MONGODB_SRV_URI;
  if (!envUri) return DIRECT_REPLICA_URI;

  // Fix any spaces or corruption introduced by copy-pasting in control panels (e.g. 'ac wzh7atb')
  envUri = envUri.replace(/ac\s+wzh7atb/g, 'ac-wzh7atb').replace(/\s+/g, '');

  // If it is an SRV uri (mongodb+srv://), querySrv fails on many shared host environments.
  // DIRECT_REPLICA_URI connects directly to Atlas shards without DNS SRV lookup.
  if (envUri.startsWith('mongodb+srv://')) {
    return DIRECT_REPLICA_URI;
  }

  return envUri;
}

const uri = resolveMongoUri();
const options = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
  family: 4,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
