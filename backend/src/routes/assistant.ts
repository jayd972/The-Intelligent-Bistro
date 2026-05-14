import { Router } from "express";
import { AssistantRequest } from "../types";
import { aiParse } from "../services/aiParser";
import { fallbackParse } from "../services/fallbackParser";

const router = Router();

const useAI = !!process.env.OPENAI_API_KEY;

router.post("/", async (req, res) => {
  const { message } = req.body as AssistantRequest;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  try {
    const result = useAI
      ? await aiParse(message.trim())
      : fallbackParse(message.trim());

    console.log(
      `[${useAI ? "AI" : "Fallback"}] "${message.trim()}" → ${result.actions.length} action(s)`
    );

    res.json(result);
  } catch (error) {
    console.error("Assistant error:", error);

    // If AI fails, fall back to the keyword parser
    if (useAI) {
      console.log("AI parser failed, falling back to keyword parser");
      try {
        const fallbackResult = fallbackParse(message.trim());
        res.json(fallbackResult);
        return;
      } catch (fallbackError) {
        console.error("Fallback parser also failed:", fallbackError);
      }
    }

    res.status(500).json({
      error: "Failed to process your request. Please try again.",
    });
  }
});

export default router;
