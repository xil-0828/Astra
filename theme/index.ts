// theme/index.ts
import { createSystem, defaultConfig } from "@chakra-ui/react";
import { colors } from "./colors";
import { textStyles } from "./typography";
import { semanticTokens } from "./semanticTokens"
import { inputRecipe } from "./recipes/input";
const theme = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors,
    },
    semanticTokens, 
    textStyles,
    recipes: {
      input: inputRecipe, // ← ★ここ
    },
  },
});

export default theme;
