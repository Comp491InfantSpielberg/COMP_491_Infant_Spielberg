const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/", async (req, res) => {
  const { prompt } = req.body;
  
  try {
    const response = await axios.post(
      "https://api.luma.ai/generate-video",
      {
        prompt: prompt,
      },
      {
        headers: {
          "Authorization": `Bearer luma_api_key`,
          "Content-Type": "application/json",
        }
      }
    );

    const videoUrl = response.data.videoUrl;

    res.status(200).json({ videoUrl });
  } catch (error) {
    console.error("Error generating video:", error);
    res.status(500).json({ error: "Error generating video" });
  }
});

module.exports = router;
