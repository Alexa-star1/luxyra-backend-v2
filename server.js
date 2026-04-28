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
    const order = req.body;

    // Basic validation
    if (!order.name || !order.address || !order.product) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const docRef = await db.collection("orders").add({
      ...order,
      status: "NEW",
      createdAt: new Date()
    });

    console.log("📦 Order saved:", docRef.id);

    res.json({
      success: true,
      orderId: docRef.id
    });

  } catch (err) {
    console.error("❌ Firebase Error:", err);
    res.status(500).json({ error: "Failed to save order" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
