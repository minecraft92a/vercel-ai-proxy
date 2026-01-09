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
    // Make sure body is valid JSON
    const body = req.body;

    if (!body || !body.model || !body.messages) {
      return res.status(400).json({ error: "Invalid request format. Must include model and messages." });
    }

    const response = await fetch(VERCEL_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${VERCEL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();

    // Try parsing JSON, otherwise return error
    try {
      const data = JSON.parse(text);
      return res.json(data);
    } catch {
      return res.status(response.status).json({
        error: "Invalid JSON from Vercel AI",
        raw: text
      });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Vercel AI Proxy running...");
});
