"use client";

import {
  Box,
  HStack,
  Text,
  Button,
} from "@chakra-ui/react";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <Box
      as="header"
      w="100%"
      px="20px"
      py="20px"
      bg="bg.base"
      borderBottom="1px solid"
      borderColor="border.default"
    >
      <HStack justify="space-between" align="center">
        {/* 左：キャッチコピー */}
        <Text textStyle="xs.light">
          アニメの評価・感想を共有するレビューサイト
        </Text>

        {/* 右：検索 + ログイン */}
        <HStack gap={3}>
          <SearchBar />

          <Button
            bg="brand.primary"
            color="bg.base"
            size="sm"
            fontWeight={400}
            borderRadius="4px"
            _hover={{ opacity: 0.9 }}
          >
            Login
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}
