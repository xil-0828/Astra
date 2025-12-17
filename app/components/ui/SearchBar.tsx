"use client";

import { Input, InputGroup } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
};

export default function SearchBar({ value, onChange, onSearch }: Props) {
  const handleChange = (v: string) => {
    if (v.length > 50) return;
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
          color="var(--chakra-colors-text-secondary)"
        />
      }
    >
      <Input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        name="search"
        textStyle="sm.light"
        placeholder="Search to Types"
        css={{
          "--focus-color": "var(--chakra-colors-brand-primary)",
        }}
        _placeholder={{
          fontSize: "14px",
          color: "colors.text.secondary",
        }}
      />
    </InputGroup>
  );
}
