// theme/index.ts
import { createSystem, defaultConfig } from "@chakra-ui/react";
import { colors } from "./colors";
import { semanticTokens } from "./semanticTokens"
import { inputRecipe } from "./recipes/input";
const theme = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors,
    },
    semanticTokens,
    recipes: {
      input: inputRecipe,
    },
  },
});

export default theme;
