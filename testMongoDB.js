const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGO_URI;

async function testConnection() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("ordersDB"); // ตรวจสอบชื่อฐานข้อมูล
    const collection = database.collection("orders");

    const orders = await collection.find({}).toArray();
    console.log("Orders fetched successfully:", orders);
  } catch (error) {
    console.error("Error connecting to MongoDB or fetching orders:", error);
  } finally {
    await client.close();
  }
}

testConnection();
