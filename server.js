const express = require("express");
const cors = require("cors");
require("dotenv").config();
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

// Połączenie z OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Endpoint proxy
app.post("/api/ask", async (req, res) => {
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

// START – WAŻNE!
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Secure proxy działa na porcie", PORT);
});
