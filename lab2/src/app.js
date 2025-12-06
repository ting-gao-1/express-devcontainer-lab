import express from "express";
import dotenv from "dotenv";
import { getDb } from "./db.js";
import { buildRoutes } from "./routes.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

async function main() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || "mydb";
  const colName = process.env.COLLECTION_NAME || "items";

  if (!uri) {
    throw new Error("Missing MONGODB_URI in .env");
  }

  const db = await getDb({ uri, dbName });
  const collection = db.collection(colName);

  app.get("/", (req, res) => res.send("API is running"));
  app.use("/api/items", buildRoutes({ collection }));

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log(`CRUD base: http://localhost:${PORT}/api/items`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
