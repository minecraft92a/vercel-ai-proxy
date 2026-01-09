import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());

// Allow Janitor AI requests from anywhere
app.use(cors());

const VERCEL_API = "https://ai-gateway.vercel.sh/v1/ai/chat/completions";
const VERCEL_KEY = process.env.VERCEL_KEY; // Your real Vercel API key

app.post("/v1/chat/completions", async (req, res) => {
  try {
    // Forward request to Vercel AI
    const response = await fetch(VERCEL_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${VERCEL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    // Send JSON response with CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Vercel AI Proxy running...");
});
