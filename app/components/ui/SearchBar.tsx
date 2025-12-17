"use client";

import { Input, InputGroup, Kbd } from "@chakra-ui/react"
import { LuSearch } from "react-icons/lu"
type Props = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
};

export default function SearchBar({ value, onChange, onSearch }: Props) {
  const handleChange = (v: string) => {
    // ① 50文字上限
    if (v.length > 50) return;

    // ② 制御文字を除去
    const cleaned = v.replace(/[\u0000-\u001F\u007F]/g, "");

    onChange(cleaned);
  };

  return (
    <InputGroup
      w="265px"
      h="40px"
      flex="1"
      startElement={
        <LuSearch
          size={24}
          strokeWidth={1}
          color="color.text.secondary"
        />
      }
    >
      <Input
        textStyle="sm.light"
        placeholder="Search to Types"
        css={{
          "--focus-color": "var(--chakra-colors-brand-primary)",
        }}
        _placeholder={{
          fontSize: "14px",
          color: "color.text.secondary",
        }}
      />
    </InputGroup>

  );
}
