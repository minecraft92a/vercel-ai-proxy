import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const VERCEL_API = "https://ai-gateway.vercel.sh/v1/ai/chat/completions";
const VERCEL_KEY = process.env.VERCEL_KEY;

app.post("/v1/chat/completions", async (req, res) => {
  try {
    const response = await fetch(VERCEL_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${VERCEL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const text = await response.text(); // read as text first
    let data;
    try {
      data = JSON.parse(text); // parse JSON safely
    } catch (err) {
      // if JSON parsing fails, return raw text
      return res.status(response.status).json({
        error: "Invalid JSON from Vercel AI",
        raw: text
      });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Vercel AI Proxy running...");
});
