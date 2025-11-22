

import { Box, Grid, Text, Stack, AspectRatio } from "@chakra-ui/react";




export default function Page() {
  return (
    <Box px={{ base: 6, md: 16 }} pt={{ base: 4, md: 10 }}>
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
        gap={10}
      >
      </Grid>
    </Box>
  );
}
