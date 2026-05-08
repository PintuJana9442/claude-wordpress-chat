require("dotenv").config();

const express = require("express");
const cors = require("cors");

const Anthropic = require("@anthropic-ai/sdk");

const app = express();

app.use(express.json());

/*
|--------------------------------------------------------------------------
| Allowed Origins
|--------------------------------------------------------------------------
*/

const allowedOrigins = [
  "https://staging-0056-vinceboomdk-overa.wpcomstaging.com",
  "https://rustplaats.com",
  "http://localhost:3000"
];

/*
|--------------------------------------------------------------------------
| CORS Configuration
|--------------------------------------------------------------------------
*/

app.use(cors({
  origin: function (origin, callback) {

    // Allow requests with no origin
    // (Postman, mobile apps, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS blocked"));
    }
  }
}));

/*
|--------------------------------------------------------------------------
| Anthropic Client
|--------------------------------------------------------------------------
*/

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/*
|--------------------------------------------------------------------------
| Health Check Route
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.send("Claude chatbot backend running...");
});

/*
|--------------------------------------------------------------------------
| Chat Route
|--------------------------------------------------------------------------
*/

app.post("/chat", async (req, res) => {

  try {

    const userMessage = req.body.message;

    // Validation
    if (!userMessage || userMessage.trim() === "") {

      return res.status(400).json({
        success: false,
        error: "Message is required"
      });
    }

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

    const reply =
      response?.content?.[0]?.text ||
      "No response generated";

    res.json({
      success: true,
      reply: reply
    });

  } catch (error) {

    console.error("Claude API Error:", error);

    res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
});

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});