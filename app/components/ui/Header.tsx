

import { Box, Flex, Text, HStack } from "@chakra-ui/react";
import HeaderAuthButtons from "./HeaderAuthButtons";

export default async function Header() {
  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="100"
      bg="white"
    >
      <Flex
        align="center"
        justify="space-between"
        px="20"
        py="3"
        mx="auto"
        w="100%"
      >
        {/* 左側：ロゴ */}
        <Text fontSize="xl" fontWeight="bold" color="#4c4849ff">
          Astra
        </Text>

        {/* 右側：ログイン/ログアウトボタン */}
        <HStack>
          <HeaderAuthButtons />
        </HStack>
      </Flex>
    </Box>
  );
}
