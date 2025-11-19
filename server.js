import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// 🚧 Anty-spam / anty-bot
const limiter = rateLimit({
  windowMs: 20 * 1000,
  max: 6,
});
app.use(limiter);

// 🔐 Połączenie do OpenAI — BEZPIECZNE
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 💬 Prosty endpoint testowy
app.post("/api/chat", async (req, res) => {
  try {
    const userMsg = req.body.message;

    const completion = await client.chat.completions.create({
      model: "gpt-5.1",
      messages: [
        {
          role: "system",
          content: "Jesteś asystentem testowym. Pełną wersję Mentora dodamy później."
        },
        {
          role: "user",
          content: userMsg
        }
      ]
    });

    res.send({ reply: completion.choices[0].message.content });

  } catch (error) {
    console.error("Błąd:", error);
    res.status(500).send({ error: "Błąd serwera proxy" });
  }
});

// Start
app.listen(3000, () =>
  console.log("Secure proxy działa na porcie 3000")
);

