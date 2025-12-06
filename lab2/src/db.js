import { MongoClient } from "mongodb";

let client;
let db;

export async function getDb({ uri, dbName }) {
  if (db) return db;

  client = new MongoClient(uri);
  await client.connect(); // Atlas 连接示例：MongoClient(URI) + connect() :contentReference[oaicite:3]{index=3}
  db = client.db(dbName);
  return db;
}

export async function closeDb() {
  if (client) await client.close();
  client = null;
  db = null;
}
