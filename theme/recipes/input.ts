import { defineRecipe } from "@chakra-ui/react"

export const inputRecipe = defineRecipe({
  variants: {
    variant: {
      search: {
        borderWidth: "1px",
        borderColor: "border", // semanticTokens を参照
        focusVisibleRing: "inside",
      },
    },
  },
})
