// routes/groqEnhance.ts
import express from "express"
import Groq from "groq-sdk"

const router = express.Router()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

router.post("/increase", async (req, res) => {
  try {
    const { text } = req.body
    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "No text provided" })
    }

    // Call Groq API
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // pick model depending on speed/quality
      messages: [
        {
          role: "system",
          content:
            "You are a helpful text editor. Increase the length of the provided text. JUST RETURN THE EXTENDED TEXT, DONT RETURN ANY THING ELSE",
        },
        { role: "user", content: text },
      ],
    })

    const enhanced =
      response.choices[0]?.message?.content?.trim() || text

    return res.json({ enhanced })
  } catch (err) {
    console.error("Groq API failed:", err)
    return res.status(500).json({ error: "Failed to enhance text" })
  }
})

router.post("/", async (req, res) => {
  try {
    const { text } = req.body
    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "No text provided" })
    }

    // Call Groq API
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // pick model depending on speed/quality
      messages: [
        {
          role: "system",
          content:
            "You are a helpful text editor. Improve clarity, grammar, and style of the provided text without changing its meaning. JUST RETURN THE ENHANCED TEXT, DONT RETURN ANY THING ELSE",
        },
        { role: "user", content: text },
      ],
    })

    const enhanced =
      response.choices[0]?.message?.content?.trim() || text

    return res.json({ enhanced })
  } catch (err) {
    console.error("Groq API failed:", err)
    return res.status(500).json({ error: "Failed to enhance text" })
  }
})

export default router
