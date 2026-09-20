import { beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create({
    binary: { version: '4.4.29' }
  });
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongo) {
    await mongo.stop();
  }
});
