import { createSystem, defaultConfig } from "@chakra-ui/react";

const theme = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          primary:   { value: "#9BCEF8" },
          secondary: { value: "#F0F4FB" },
        },

        bg: {
          base: { value: "#FFFFFF" },
        },

        text: {
          primary:   { value: "#000000" },
          secondary: { value: "#8F96A1" },
        },

        border: {
          default: { value: "#D6DEEA" },
        },

        rating: {
          star: { value: "#FFEE2D" },
        },
      },
    },
  },
});

export default theme;
