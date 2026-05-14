import { Router } from "express";
import { menuItems } from "../data/menu";
import { MenuCategory } from "../types";

const router = Router();

const validCategories: MenuCategory[] = ["mains", "sides", "drinks", "desserts"];

router.get("/", (req, res) => {
  const { category } = req.query;

  if (category) {
    const cat = (category as string).toLowerCase() as MenuCategory;

    if (!validCategories.includes(cat)) {
      res.status(400).json({
        error: `Invalid category. Must be one of: ${validCategories.join(", ")}`,
      });
      return;
    }

    const filtered = menuItems.filter((item) => item.category === cat);
    res.json({ items: filtered, total: filtered.length });
    return;
  }

  res.json({ items: menuItems, total: menuItems.length });
});

export default router;
