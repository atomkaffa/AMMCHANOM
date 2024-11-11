const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const { MongoClient, MongoCryptAzureKMSRequestError } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();
const adminUsers = ['admin04', 'adminUser1']; // เพิ่มรายชื่อ Admin ที่ได้รับอนุญาต
const uri = process.env.MONGO_URI;
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const saltRounds = process.env.SALT_ROUNDS;



// Enable CORS for Frontend to connect
app.use(cors());
app.use(express.json());

app.use(bodyParser.json());

//Register
app.post("/register", async(req, res) => {
  const {username, password} = req.body;
  const client = new MongoClient(uri, {useUnifiedTopology: true});
  try{
    await client.connect();
    const database = client.db("users");
    const collection = database.collection("users");

    const hashedPassword = await bcrypt.hash(password, parseInt(saltRounds));
    const user = await collection.insertOne({
      username: username, 
      password: hashedPassword,
    });
    res.json({
      success: true,
      message: "Register successful",
    });
  } catch (error){
    res.json({
      success: false,
      message: "Register failed",
    });
  } finally {
    await client.close();
  }
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  try {
      await client.connect();
      const database = client.db("users");
      const collection = database.collection("users");

      const user = await collection.findOne({ username: username });

      if (user) {
          const match = await bcrypt.compare(password, user.password);
          if (match) {
              res.json({
                  success: true,
                  message: "Login successful",
              });
          } else {
              res.json({
                  success: false,
                  message: "Login failed",
              });
          }
      } else {
          res.json({
              success: false,
              message: "Login failed",
          });
      }
  } catch(error) {
    res.json({
      success: false,
      message: "Login failed",
    });
  }finally {
    await client.close();
  }
});


// Serve static files including images
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname)));


let products = [
  { id: 1, name: "ชานมไข่มุกครีมชีส", price: 60, type: "beverage", sweetness: 100, image: "images/ชานมไข่มุกครีมชีส.jpg"},
  { id: 2, name: "บราวน์ชูการ์ไข่มุกครีมชีส", price: 60, type: "beverage", sweetness: 100, image: "images/บราวน์ชูการ์ไข่มุกครีมชีส.jpg"},
  { id: 3, name: "แตงโมครีมชีส", price: 30, type: "beverage", sweetness: 100, image: "images/แตงโมครีมชีส.jpg"},
  { id: 4, name: "ชาไทยไข่มุก", price: 50, type: "beverage", sweetness: 100, image: "images/ชาไทยไข่มุก.jpg" },
  { id: 5, name: "ชาเขียวไข่มุก", price: 50, type: "beverage", sweetness: 100, image: "images/ชาเขียวไข่มุก.jpg" },
  { id: 6, name: "ชาเขียวโอริโอ้", price: 55, type: "beverage", sweetness: 100, image: "images/ชาเขียวโอริโอ้.jpg" },
  { id: 7, name: "ชานมพีช", price: 45, type: "beverage", sweetness: 100, image: "images/ชานมพีช.jpg" },
  { id: 8, name: "ชาเสาวรส", price: 50, type: "beverage", sweetness: 100, image: "images/ชาเสาวรส.jpg" },
  { id: 9, name: "ชาสับปะรด", price: 50, type: "beverage", sweetness: 100, image: "images/ชาสับปะรด.jpg" },
  { id: 10, name: "ชาเกรปฟรุต", price: 50, type: "beverage", sweetness: 100, image: "images/ชาเกรปฟรุต.jpg"},
  { id: 11, name: "ชากีวี่", price: 50, type: "beverage", sweetness: 100, image: "images/ชากีวี่.jpg"},
  { id: 12, name: "น้ำผึ้งมะนาว", price: 50, type: "beverage", sweetness: 100, image: "images/น้ำผึ้งมะนาว.jpg"},
  { id: 13, name: "สตอเบอร์รี่สมูทตี้", price: 55, type: "beverage", sweetness: 100, image: "images/สตอเบอร์รี่สมูทตี้.jpg" },
  { id: 14, name: "มิกซ์เบอร์รี่สมูทตี้", price: 55, type: "beverage", sweetness: 100, image: "images/มิกซ์เบอร์รี่สมูทตี้.jpg" },
  { id: 15, name: "นมเผือกปั่น", price: 55, type: "beverage", sweetness: 100, image: "images/นมเผือกปั่น.jpg" },
  { id: 16, name: "อะโวคาโดสมูทตี้", price: 55, type: "beverage", sweetness: 100, image: "images/อะโวคาโดสมูทตี้.jpg" },
  { id: 17, name: "มะนาวโซดา", price: 45, type: "beverage", sweetness: 100, image: "images/มะนาวโซดา.jpg" },
  { id: 18, name: "บลูฮาวายโซดา", price: 45, type: "beverage", sweetness: 100, image: "images/บลูฮาวายโซดา.jpg" },
  { id: 19, name: "ฝรั่งไส้แดงโซดา", price: 45, type: "beverage", sweetness: 100, image: "images/ฝรั่งไส้แดงโซดา.jpg" },
  { id: 20, name: "เบอร์รี่โซดา", price: 45, type: "beverage", sweetness: 100, image: "images/เบอร์รี่โซดา.jpg" },
  { id: 21, name: "มะนาวขิงโซดา", price: 55, type: "beverage", sweetness: 100, image: "images/มะนาวขิงโซดา.jpg" },
  { id: 22, name: "สับปะรดปั่น", price: 55, type: "beverage", sweetness: 100, image: "images/สับปะรดปั่น.jpg" },
  { id: 23, name: "ช็อคโกแลตปั่น", price: 60, type: "beverage", sweetness: 100, image: "images/ช็อคโกแลตปั่น.jpg",promotion: "buy1get1" },
  { id: 24, name: "มันม่วงสมูทตี้", price: 55, type: "beverage", sweetness: 100, image: "images/มันม่วงสมูทตี้.jpg"},
  { id: 25, name: "เผือกนมสด", price: 40, type: "beverage", sweetness: 100, image: "images/เผือกนมสด.jpg" },
  { id: 26, name: "ผลไม้รวม", price: 40, type: "beverage", sweetness: 100, image: "images/ผลไม้รวม.jpg" },
  { id: 27, name: "นมสดปั่น", price: 40, type: "beverage", sweetness: 100, image: "images/นมสดปั่น.jpg" },
 
  
];

let orders = [];

// Add this route for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // Serve index.html
});

// Get menu items
app.get('/menu', (req, res) => {
  res.json(products);
});

// Place order
app.post('/order', (req, res) => {
  const newOrder = req.body;
  orders.push(newOrder);
  res.status(201).json({ message: "Order placed successfully!", order: newOrder });
});

// server.js
app.post('/order', (req, res) => {
  const newOrder = { ...req.body, status: 'in progress' }; // กำหนดสถานะเริ่มต้นเป็น in progress
  orders.push(newOrder);
  res.status(201).json({ message: "Order placed successfully!", order: newOrder });
});

// Endpoint สำหรับพนักงานเพื่อดูคำสั่งซื้อทั้งหมด
app.get('/orders', (req, res) => {
  res.json(orders);
});
// ตรวจสอบว่าเป็น Admin หรือไม่
function isAdmin(username) {
  return adminUsers.includes(username);
}

// server.js
app.post('/admin-login', async (req, res) => {
  const { username, password } = req.body;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("users");
    const collection = database.collection("users");

    const user = await collection.findOne({ username: username });

    if (user && await bcrypt.compare(password, user.password) && user.role === 'admin') {
      res.json({ success: true, message: "Admin Login successful", username });
    } else {
      res.json({ success: false, message: "Login failed" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.json({ success: false, message: "Login failed" });
  } finally {
    await client.close();
  }
});
function isAdmin(user) {
  return user && user.role === 'admin';
}
// Route สำหรับดึงคำสั่งซื้อทั้งหมด (เฉพาะ Admin)
app.get('/admin/orders', (req, res) => {
  const username = req.query.username;
  if (isAdmin(username)) {
    res.json(orders); // ส่งคืนรายการคำสั่งซื้อทั้งหมดสำหรับ Admin
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
});


// Route สำหรับอัปเดตสถานะคำสั่งซื้อโดย Admin
app.put('/admin/order/status', (req, res) => {
  const { orderId, status } = req.body;
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = status; // Update order status
    res.json({ message: 'Order status updated', order });
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});


mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

app.use(cors());
app.use(bodyParser.json());

// สร้าง Schema สำหรับคำสั่งซื้อ
const orderSchema = new mongoose.Schema({
  username: String,
  items: Array,
  totalPrice: Number,
  status: String,
  orderDate: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);

// API สำหรับบันทึกคำสั่งซื้อใหม่
app.post('/order', async (req, res) => {
  const { username, items, totalPrice } = req.body;
  const newOrder = new Order({
    username,
    items,
    totalPrice,
    status: "in progress", // กำหนดสถานะเริ่มต้น
  });

  try {
    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Order placed successfully!", orderId: savedOrder._id });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ message: 'Error saving order' });
  }
});

// - API สำหรับดึงคำสั่งซื้อทั้งหมด
app.get('/orders', async (req, res) => {
  const { username } = req.query;
  try {
    const query = username ? { username } : {};
    const orders = await Order.find(query);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});
const { ObjectId } = require('mongodb'); // เพิ่มส่วนนี้ในต้นไฟล์
// API สำหรับอัปเดตสถานะคำสั่งซื้อ
app.put('/order/status', async (req, res) => {
  const { orderId, status } = req.body;
  try {
    const result = await Order.updateOne({ _id: orderId }, { $set: { status } });
    if (result.modifiedCount > 0) {
      res.json({ message: 'Order status updated successfully' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});


// Endpoint สำหรับดึงคำสั่งซื้อทั้งหมด (สำหรับ Admin)
// ดึงคำสั่งซื้อทั้งหมดจาก MongoDB
app.get('/admin/orders', async (req, res) => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const database = client.db("ordersDB");
    const collection = database.collection("orders");

    const orders = await collection.find({}).toArray();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: 'Error fetching orders' });
  } finally {
    await client.close();
  }
});

// Endpoint สำหรับอัปเดตสถานะคำสั่งซื้อ
app.put('/admin/order/status', async (req, res) => {
  const { orderId, status } = req.body;
  try {
    await client.connect();
    const database = client.db("ordersDB");
    const collection = database.collection("orders");

    // อัปเดตสถานะคำสั่งซื้อ
    const result = await collection.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status: status } }
    );

    if (result.matchedCount > 0) {
      res.json({ message: 'Order status updated successfully' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: 'Error updating order status', error });
  } finally {
    await client.close();
  }
});

// server.js
app.get('/orders', (req, res) => {
  const username = req.query.username; // ดึง username จาก query parameter
  if (username) {
    // กรองคำสั่งซื้อที่เป็นของ username นั้น ๆ
    const userOrders = orders.filter(order => order.username === username);
    res.json(userOrders);
  } else {
    // ถ้าไม่มี username ให้ส่งคำสั่งซื้อทั้งหมด (สำหรับพนักงาน)
    res.json(orders);
  }
});
// Fetch all orders (for employees/admin)
app.get('/orders', (req, res) => {
  res.json(orders);
});

// Serve order.html
app.get('/order', (req, res) => {
  res.sendFile(path.join(__dirname)); // Serve order.html
});

// Start server
app.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000');
});
function filterMenu() {
  const minPrice = document.getElementById("minPrice").value;
  const maxPrice = document.getElementById("maxPrice").value;
  fetchMenu(minPrice, maxPrice); // เรียกใช้ฟังก์ชันดึงเมนูพร้อมพารามิเตอร์ราคา
}

