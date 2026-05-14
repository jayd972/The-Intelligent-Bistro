import { MenuItem } from "../types";

export const menuItems: MenuItem[] = [
  // ─── Mains ───────────────────────────────────────────────

  {
    id: "m1",
    name: "Classic Smash Burger",
    description:
      "Double smashed beef patties with American cheese, pickles, onions, and bistro sauce on a brioche bun.",
    price: 12.99,
    category: "mains",
    image: "burger",
    popular: true,
    availableModifiers: ["extra cheese", "no pickles", "add bacon"],
  },
  {
    id: "m2",
    name: "Spicy Chicken Sandwich",
    description:
      "Crispy fried chicken breast with spicy mayo, jalapeños, and slaw on a toasted bun.",
    price: 11.99,
    category: "mains",
    image: "chicken-sandwich",
    popular: true,
    availableModifiers: ["extra spicy", "mild", "add avocado"],
  },
  {
    id: "m3",
    name: "Grilled Salmon Bowl",
    description:
      "Herb-crusted Atlantic salmon over jasmine rice with roasted vegetables and lemon dill sauce.",
    price: 16.99,
    category: "mains",
    image: "salmon",
    availableModifiers: ["no sauce", "extra vegetables", "brown rice"],
  },
  {
    id: "m4",
    name: "Truffle Mushroom Pasta",
    description:
      "Penne in a creamy truffle mushroom sauce with Parmesan and fresh herbs.",
    price: 14.99,
    category: "mains",
    image: "pasta",
    popular: true,
    availableModifiers: ["add chicken", "gluten-free pasta", "extra truffle"],
  },
  {
    id: "m5",
    name: "BBQ Pulled Pork Tacos",
    description:
      "Three soft tortillas filled with slow-smoked pulled pork, tangy slaw, and chipotle BBQ drizzle.",
    price: 13.49,
    category: "mains",
    image: "tacos",
    availableModifiers: ["extra pork", "corn tortilla", "flour tortilla"],
  },

  // ─── Sides ───────────────────────────────────────────────

  {
    id: "s1",
    name: "Truffle Parmesan Fries",
    description:
      "Hand-cut fries tossed in truffle oil, Parmesan, and fresh parsley.",
    price: 6.99,
    category: "sides",
    image: "fries",
    popular: true,
    availableModifiers: ["extra truffle", "add cheese sauce"],
  },
  {
    id: "s2",
    name: "Caesar Side Salad",
    description:
      "Crisp romaine with house-made Caesar dressing, croutons, and shaved Parmesan.",
    price: 5.99,
    category: "sides",
    image: "salad",
    availableModifiers: ["no croutons", "add chicken"],
  },
  {
    id: "s3",
    name: "Onion Rings",
    description:
      "Beer-battered thick-cut onion rings served with smoky aioli.",
    price: 5.49,
    category: "sides",
    image: "onion-rings",
    availableModifiers: ["extra aioli"],
  },
  {
    id: "s4",
    name: "Sweet Potato Wedges",
    description:
      "Roasted sweet potato wedges with a honey-sriracha dipping sauce.",
    price: 5.99,
    category: "sides",
    image: "sweet-potato",
    availableModifiers: ["no sauce", "extra sauce"],
  },
  {
    id: "s5",
    name: "Mac & Cheese Bites",
    description:
      "Crispy fried mac and cheese bites with a chipotle ranch dip.",
    price: 6.49,
    category: "sides",
    image: "mac-cheese",
    availableModifiers: ["add jalapeños", "extra dip"],
  },

  // ─── Drinks ──────────────────────────────────────────────

  {
    id: "d1",
    name: "Fresh Lemonade",
    description: "House-squeezed lemonade with a hint of mint.",
    price: 4.49,
    category: "drinks",
    image: "lemonade",
    popular: true,
    availableSizes: ["small", "medium", "large"],
    availableModifiers: ["add strawberry", "add ginger"],
  },
  {
    id: "d2",
    name: "Iced Tea",
    description: "Cold-brewed black tea served over ice with lemon.",
    price: 3.99,
    category: "drinks",
    image: "iced-tea",
    availableSizes: ["small", "medium", "large"],
    availableModifiers: ["sweetened", "unsweetened", "add peach"],
  },
  {
    id: "d3",
    name: "Craft Root Beer",
    description: "Small-batch artisan root beer with vanilla notes.",
    price: 4.99,
    category: "drinks",
    image: "root-beer",
    availableSizes: ["small", "large"],
  },
  {
    id: "d4",
    name: "Sparkling Water",
    description: "Chilled sparkling mineral water with lime.",
    price: 2.99,
    category: "drinks",
    image: "sparkling-water",
    availableSizes: ["small", "large"],
  },

  // ─── Desserts ────────────────────────────────────────────

  {
    id: "x1",
    name: "Salted Caramel Brownie",
    description:
      "Rich dark chocolate brownie topped with salted caramel and a scoop of vanilla ice cream.",
    price: 7.99,
    category: "desserts",
    image: "brownie",
    popular: true,
    availableModifiers: ["no ice cream", "extra caramel"],
  },
  {
    id: "x2",
    name: "New York Cheesecake",
    description:
      "Classic creamy cheesecake with a graham cracker crust and fresh berry compote.",
    price: 7.49,
    category: "desserts",
    image: "cheesecake",
    availableModifiers: ["add whipped cream", "no berries"],
  },
  {
    id: "x3",
    name: "Churros",
    description:
      "Warm cinnamon-sugar churros served with chocolate and dulce de leche dipping sauces.",
    price: 6.49,
    category: "desserts",
    image: "churros",
    availableModifiers: ["extra chocolate sauce"],
  },
  {
    id: "x4",
    name: "Mango Sorbet",
    description: "Refreshing tropical mango sorbet — dairy-free and light.",
    price: 5.49,
    category: "desserts",
    image: "sorbet",
    availableModifiers: ["add coconut flakes"],
  },
];
