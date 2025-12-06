import express from "express";
import { ObjectId } from "mongodb";

export function buildRoutes({ collection }) {
  const router = express.Router();

  // GET all
  router.get("/", async (req, res) => {
    const docs = await collection.find({}).limit(100).toArray();
    res.json(docs);
  });

  // GET by id
  router.get("/:id", async (req, res) => {
    try {
      const _id = new ObjectId(req.params.id);
      const doc = await collection.findOne({ _id });
      if (!doc) return res.status(404).json({ message: "Not found" });
      res.json(doc);
    } catch {
      res.status(400).json({ message: "Invalid id" });
    }
  });

  // POST create
  router.post("/", async (req, res) => {
    const payload = req.body;
    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ message: "Body required" });
    }
    const result = await collection.insertOne(payload); // insertOne 属于 Node Driver CRUD 方法 :contentReference[oaicite:4]{index=4}
    res.status(201).json({ insertedId: result.insertedId });
  });

  // PUT update (replace fields)
  router.put("/:id", async (req, res) => {
    try {
      const _id = new ObjectId(req.params.id);
      const payload = req.body;
      if (!payload || Object.keys(payload).length === 0) {
        return res.status(400).json({ message: "Body required" });
      }
      const result = await collection.updateOne(
        { _id },
        { $set: payload }
      );
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Not found" });
      }
      res.json({ matched: result.matchedCount, modified: result.modifiedCount });
    } catch {
      res.status(400).json({ message: "Invalid id" });
    }
  });

  // DELETE
  router.delete("/:id", async (req, res) => {
    try {
      const _id = new ObjectId(req.params.id);
      const result = await collection.deleteOne({ _id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Not found" });
      }
      res.json({ deleted: result.deletedCount });
    } catch {
      res.status(400).json({ message: "Invalid id" });
    }
  });

  return router;
}
