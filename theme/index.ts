import { createSystem, defaultConfig } from "@chakra-ui/react";

const theme = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50:  { value: "#e3f9ff" },
          100: { value: "#c8efff" },
          200: { value: "#9ce4ff" },
          300: { value: "#6fd8ff" },
          400: { value: "#45ccff" },
          500: { value: "#1fbfff" },
          600: { value: "#009bdb" },
          700: { value: "#0077a8" },
          800: { value: "#005275" },
          900: { value: "#002e42" },
        },
      },
    },
  },
});

export default theme;