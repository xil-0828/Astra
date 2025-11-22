"use client";

import { Box, Flex, Text, Image } from "@chakra-ui/react";

export default function Header() {
  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="100"
      bg="white"
    >
      <Flex
        direction="column"
        align="center"
        py="4"
        px="4"
      >
        <Image src="/images/ui/logo.svg" alt="Almond" width="220px" />
        <Text fontSize="xs" color="#FC8FAC" mt="1">
          無料でエロゲができるサイト
        </Text>
      </Flex>
    </Box>
  );
}
