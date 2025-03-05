/*
(c) @xditya
*/

import { MongoClient } from "mongo";

import config from "$env";

console.log("Connecting to MongoDB...");
const client = new MongoClient();
const MONGO_URL = new URL(config.MONGO_URL);
if (!MONGO_URL.searchParams.has("authMechanism")) {
  MONGO_URL.searchParams.set("authMechanism", "SCRAM-SHA-1");
}
try {
  await client.connect(MONGO_URL.href);
} catch (err) {
  console.error("Error connecting to MongoDB", err);
  throw err;
}
const db = client.database("CSMS");

interface OrderDetails {
  hash: string;
  items: { [key: string]: number };
  timestamp: string;
  status: "Placed" | "Done";
  totalCost: number;
}

interface OrderDocument {
  email: string;
  orders: { [hash: string]: OrderDetails[] };
}

const orders = db.collection<OrderDocument>("vending_orders");

async function getOrderByHash(email: string, hash: string) {
  const result = await orders.findOne({
    email,
    [`orders.${hash}`]: { $exists: true },
  });

  if (!result || !result.orders[hash]) {
    return null;
  }

  return result.orders[hash][0];
}

async function updateOrderStatus(
  email: string,
  hash: string,
  status: "Placed" | "Done"
) {
  await orders.updateOne(
    {
      email,
      [`orders.${hash}`]: { $exists: true },
    },
    {
      $set: {
        [`orders.${hash}.0.status`]: status,
      },
    }
  );
}

export { getOrderByHash, updateOrderStatus };
