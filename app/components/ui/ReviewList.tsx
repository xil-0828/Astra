"use client";

import { useEffect, useState } from "react";
import ReviewThumbnail from "./ReviewThumnail";
import { SimpleGrid, HStack, Input, Button, Box } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

type Anime = {
  mal_id: number;
  title: string;
  title_japanese: string | null;
  synopsis: string | null;
  images: {
    jpg: { image_url: string };
    webp: { image_url: string };
  };
};

export default function TestJikan() {
  const router = useRouter();
  const [query, setQuery] = useState("ブル");
  const [input, setInput] = useState("ブル");
  const [result, setResult] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAnime(q: string) {
    setLoading(true);
    const res = await fetch(`/api/anime?q=${q}`);
    const json = await res.json();
    setResult(json.data);
    setLoading(false);
  }

  useEffect(() => {
    loadAnime(query);
  }, []);

  const handleSearch = () => {
    setQuery(input);
    loadAnime(input);
  };

  // ⭐ クリックしたらデータごと渡す！
  const goDetail = (anime: Anime) => {
    const encoded = encodeURIComponent(JSON.stringify(anime));
    router.push(`/anime/detail?data=${encoded}`);
  };

  return (
    <Box w="100%" px={3} py={3}>
      <HStack mb={4}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="作品名で検索"
          fontSize="md"
        />
        <Button onClick={handleSearch} colorScheme="blue">
          検索
        </Button>
      </HStack>

      <SimpleGrid
        w="100%"
        gap={6}
        columns={{ base: 1, sm: 2, md: 3, lg: 3 }}
        placeItems="center"
      >
        {loading &&
          [...Array(6)].map((_, i) => <ReviewThumbnail key={i} isLoading />)}

        {!loading &&
          result.map((anime) => (
            <Box key={anime.mal_id} onClick={() => goDetail(anime)}>
              <ReviewThumbnail
                image={
                  anime.images.webp?.image_url ||
                  anime.images.jpg?.image_url ||
                  ""
                }
                title={anime.title_japanese || anime.title}
              />
            </Box>
          ))}
      </SimpleGrid>
    </Box>
  );
}
