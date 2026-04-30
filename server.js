const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// 🔥 Firebase Setup (SAFE using env variables)
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
});

const db = admin.firestore();

// ✅ Test route
app.get("/", (req, res) => {
  res.send("LUXYRA Backend + Firebase running 🚀");
});

// 🔥 Save Order API
app.post("/order", async (req, res) => {
  try {
    const { name, address, phone, product } = req.body;

    // 🔥 VALIDATION
    if (!name || !address || !phone || !product) {
      return res.status(400).json({ error: "Missing fields" });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    const docRef = await db.collection("orders").add({
      ...req.body,
      status: "NEW",
      createdAt: new Date()
    });

    res.json({ success: true, orderId: docRef.id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
})


app.get("/orders/:phone", async (req, res) => {
  const orders = await db.collection("orders")
    .find({ phone: req.params.phone })
    .toArray();

  res.json(orders);
});
✅ Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
