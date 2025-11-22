

import { Box, Grid, Text, Stack, AspectRatio } from "@chakra-ui/react";
import NextImage from "next/image";
import NextLink from "next/link";
import { games } from "@/app/data/games";
import { mplus1 } from "@/app/layout";

const items = Object.values(games);

export default function Page() {
  return (
    <Box px={{ base: 6, md: 16 }} pt={{ base: 4, md: 10 }}>
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
        gap={10}
      >
        {items.map((item) => (
          <NextLink key={item.slug} href={`/games/${item.slug}`} style={{ width: "100%" }}>
            <Box cursor="pointer" w="100%">
              <AspectRatio ratio={400 / 350} w="100%">
                <Box
                  position="relative"
                  overflow="hidden"
                  borderRadius="15px"
                  transition="all 0.25s ease"
                  boxShadow="0 2px 6px rgba(0,0,0,0.08)"
                  _hover={{
                    transform: "translate(-6px, -6px)",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
                  }}
                >
                  <NextImage
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Box>
              </AspectRatio>

              <Stack pt={2} gap={0.5}>
                <Text className={mplus1.className} fontSize="lg" fontWeight="semibold">
                  {item.title}
                </Text>
                <Text
                  className={mplus1.className}
                  fontSize="xs"
                  color="gray.500"
                  mt="-5px"
                  letterSpacing="-0.2px"
                >
                  {item.date}
                </Text>
              </Stack>
            </Box>
          </NextLink>
        ))}
      </Grid>
    </Box>
  );
}
