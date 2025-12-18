"use client";

import {
  Box,
  HStack,
  Text,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import SearchBar from "./SearchBar";

export default function Header() {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (!search.trim()) return;
    console.log("search:", search);
  };

  return (
    <Box
      as="header"
      w="100%"
      pl="20px"
      pr="60px"
      py="20px"
    >
      <HStack justify="space-between" align="center">
        {/* 左：キャッチコピー */}
        <Text textStyle="xs" fontWeight="light">
          アニメの評価・感想を共有するレビューサイト
        </Text>

        {/* 右：検索 + ログイン */}
        <HStack gap={3}>
          <SearchBar
            value={search}
            onChange={setSearch}
            onSearch={handleSearch}
          />

          <Button
            w="71px"
            h="40px"
            bg="brand.primary"
            color="bg.base"
            textStyle="sm"
            fontWeight="normal"
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
