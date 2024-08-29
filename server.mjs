import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

app.get("/api/random-image", async (req, res) => {
  try {
    const topicId = "film";
    //const collectionId = "948920";
    const response = await fetch(
      `https://api.unsplash.com/photos/random?client_id=${UNSPLASH_ACCESS_KEY}&orientation=landscape&topics=${topicId}`
    );
    const data = await response.json();
    res.json({ imageUrl: data.urls.regular });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch image from Unsplash" });
  }
});

app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
