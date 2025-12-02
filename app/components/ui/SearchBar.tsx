"use client";

import { HStack, Input, Button } from "@chakra-ui/react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
};

export default function SearchBar({ value, onChange, onSearch }: Props) {
  return (
    <HStack mb={4} w="100%">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="作品名で検索"
        fontSize="md"
      />
      <Button onClick={onSearch} colorScheme="blue">
        検索
      </Button>
    </HStack>
  );
}
