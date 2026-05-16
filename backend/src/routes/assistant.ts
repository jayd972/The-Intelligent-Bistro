import { Router } from "express";
import { AssistantRequest } from "../types";
import { aiParse } from "../services/aiParser";
import { fallbackParse } from "../services/fallbackParser";
import fs from "fs";
import path from "path";

const LOG_FILE = path.join(__dirname, "../../debug.log");
function log(msg: string) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(LOG_FILE, line);
  console.log(msg);
}

const router = Router();

router.post("/", async (req, res) => {
  const { message } = req.body as AssistantRequest;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  const useAI = !!process.env.OPENAI_API_KEY;
  log(`━━━ New request ━━━`);
  log(`Message: "${message.trim()}"`);
  log(`OPENAI_API_KEY present: ${useAI}`);
  log(`Key prefix: ${process.env.OPENAI_API_KEY?.substring(0, 12)}...`);
  log(`Parser: ${useAI ? "AI (gpt-4o-mini)" : "Fallback (regex)"}`);

  try {
    const result = useAI
      ? await aiParse(message.trim())
      : fallbackParse(message.trim());

    log(`SUCCESS [${useAI ? "AI" : "Fallback"}] => ${result.actions.length} action(s), intent: ${result.intent}`);
    log(`Response: "${result.assistantMessage.substring(0, 100)}"`);

    res.json(result);
  } catch (error: any) {
    log(`FAILED AI parser: ${error?.message || error}`);
    log(`Error type: ${error?.constructor?.name}`);
    if (error?.status) log(`HTTP status: ${error.status}`);

    if (useAI) {
      log(`Falling back to keyword parser...`);
      try {
        const fallbackResult = fallbackParse(message.trim());
        log(`SUCCESS [Fallback] => ${fallbackResult.actions.length} action(s)`);
        res.json(fallbackResult);
        return;
      } catch (fallbackError: any) {
        log(`Fallback parser also failed: ${fallbackError?.message}`);
      }
    }

    res.status(500).json({
      error: "Failed to process your request. Please try again.",
    });
  }
});

export default router;
