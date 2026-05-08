require("dotenv").config();

const express = require("express");
const cors = require("cors");

const Anthropic = require("@anthropic-ai/sdk");

const app = express();

app.use(express.json());

app.use(cors({
  origin: [
    "https://staging-0056-vinceboomdk-overa.wpcomstaging.com/",
    "https://rustplaats.com/"
  ]
}));

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post("/chat", async (req, res) => {

  try {

    const userMessage = req.body.message;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    res.json({
      success: true,
      reply: response.content[0].text
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server running...");
});