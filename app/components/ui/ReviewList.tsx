"use client";

import { useEffect, useState } from "react";
import ReviewThumbnail from "./ReviewThumnail";
import { Box, HStack } from "@chakra-ui/react";

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
  const [result, setResult] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/anime?q=ブル");
      const json = await res.json();
      setResult(json.data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <Box
      w="100%"
      overflowX="auto"
      css={{
    scrollbarWidth: "none", // Firefox
    "&::-webkit-scrollbar": {
      display: "none", // Chrome / Safari
    },
  }}
    >
      <HStack>
        {/* ローディング */}
        {loading &&
          [...Array(10)].map((_, i) => (
            <Box key={i} mr={4} display="inline-block">
              <ReviewThumbnail isLoading />
            </Box>
          ))}

        {/* 本番データ */}
        {!loading &&
          result.map((anime) => (
            <Box key={anime.mal_id} mr={4} display="inline-block">
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
      </HStack>
    </Box>
  );
}
