// createAdmin.js
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri); // ลบ { useUnifiedTopology: true } ออก

// ข้อมูลบัญชี Admin
const adminUsername = 'admin04';
const adminPassword = 'admin04'; // เปลี่ยนรหัสผ่านที่นี่
const isAdmin = true; // ระบุสถานะ Admin

async function createAdmin() {
  try {
    await client.connect();
    const database = client.db("users");
    const collection = database.collection("users");

    // ตรวจสอบว่าผู้ใช้ Admin นี้มีอยู่แล้วหรือไม่
    const existingAdmin = await collection.findOne({ username: adminUsername });
    if (existingAdmin) {
      console.log('Admin account already exists.');
      return;
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // เพิ่มบัญชี Admin ลงในฐานข้อมูล
    const result = await collection.insertOne({
      username: adminUsername,
      password: hashedPassword,
      role: 'admin' // กำหนดบทบาทเป็น Admin
    });

    console.log('Admin account created:', result.insertedId);
  } catch (error) {
    console.error('Error creating admin account:', error);
  } finally {
    await client.close();
  }
}

createAdmin();
