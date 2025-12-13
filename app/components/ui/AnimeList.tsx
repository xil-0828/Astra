"use client";

import { useEffect, useState } from "react";
import ReviewThumbnail from "./AnimeThumnail";
import SearchBar from "./SearchBar";
import { SimpleGrid, Box } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import { AnimeSearchUI } from "@/types/ui/anime_search";

export default function AnimeList() {
  const router = useRouter();

  const [query, setQuery] = useState("ブル");
  const [input, setInput] = useState("ブル");
  const [result, setResult] = useState<AnimeSearchUI[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAnime(q: string) {
    setLoading(true);
    const res = await fetch(`/api/jikan?q=${q}`);
    const json: { data: AnimeSearchUI[] } = await res.json();
    setResult(json.data);
    setLoading(false);
  }

  useEffect(() => {
    loadAnime(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    setQuery(input);
    loadAnime(input);
  };

  const goDetail = (anime: AnimeSearchUI) => {
    router.push(`/anime/${anime.id}`);
  };

  return (
    <Box w="100%" px={3} py={3}>
      {/* 🔍 検索バー */}
      <SearchBar
        value={input}
        onChange={setInput}
        onSearch={handleSearch}
      />

      <SimpleGrid
        w="100%"
        gap={6}
        columns={{ base: 1, sm: 2, md: 3, lg: 3 }}
        placeItems="center"
      >
        {loading &&
          [...Array(6)].map((_, i) => (
            <ReviewThumbnail key={i} isLoading />
          ))}

        {!loading &&
          result.map((anime) => (
            <Box
              key={anime.id}
              cursor="pointer"
              onClick={() => goDetail(anime)}
            >
              <ReviewThumbnail
                image={anime.imageUrl}
                title={anime.title}
              />
            </Box>
          ))}
      </SimpleGrid>
    </Box>
  );
}
