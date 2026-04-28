const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 Firebase setup
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.get("/", (req, res) => {
  res.send("Backend + Firebase running 🚀");
});

app.post("/order", async (req, res) => {
  try {
    const order = req.body;

    const docRef = await db.collection("orders").add({
      ...order,
      createdAt: new Date()
    });

    console.log("📦 Order saved:", docRef.id);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save order" });
  }
});

app.listen(3000, () => console.log("Server running"));
