/**
 * Static image mapping for menu items.
 * React Native requires static `require()` calls for local images,
 * so each menu item's `image` key maps to a bundled asset.
 */

import { ImageSourcePropType } from "react-native";

export const menuImages: Record<string, ImageSourcePropType> = {
  burger: require("../assets/images/menu/burger.jpg"),
  "chicken-sandwich": require("../assets/images/menu/chicken-sandwich.jpg"),
  salmon: require("../assets/images/menu/salmon.jpg"),
  pasta: require("../assets/images/menu/pasta.jpg"),
  tacos: require("../assets/images/menu/tacos.jpg"),
  fries: require("../assets/images/menu/fries.jpg"),
  salad: require("../assets/images/menu/salad.jpg"),
  "onion-rings": require("../assets/images/menu/onion-rings.jpg"),
  "sweet-potato": require("../assets/images/menu/sweet-potato.jpg"),
  "mac-cheese": require("../assets/images/menu/mac-cheese.jpg"),
  lemonade: require("../assets/images/menu/lemonade.jpg"),
  "iced-tea": require("../assets/images/menu/iced-tea.jpg"),
  "root-beer": require("../assets/images/menu/root-beer.jpg"),
  "sparkling-water": require("../assets/images/menu/sparkling-water.jpg"),
  brownie: require("../assets/images/menu/brownie.jpg"),
  cheesecake: require("../assets/images/menu/cheesecake.jpg"),
  churros: require("../assets/images/menu/churros.jpg"),
  sorbet: require("../assets/images/menu/sorbet.jpg"),
};
