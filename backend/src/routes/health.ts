import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "Intelligent Bistro API",
    timestamp: new Date().toISOString(),
  });
});

export default router;
