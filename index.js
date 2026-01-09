import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const VERCEL_API = "https://ai-gateway.vercel.sh/v1/ai/chat/completions";
const VERCEL_KEY = process.env.VERCEL_KEY; // Your real Vercel API key

app.post("/v1/chat/completions", async (req, res) => {
  try {
    // Forward Janitor request to Vercel AI
    const response = await fetch(VERCEL_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${VERCEL_KEY}`, // always use real key
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data); // return to Janitor in same format
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Accept any dummy API key from Janitor
app.listen(process.env.PORT || 3000, () => {
  console.log("Vercel AI Proxy running...");
});
