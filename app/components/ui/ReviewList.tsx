"use client";

import { useEffect, useState } from "react";
import ReviewThumbnail from "./ReviewThumnail";
import { SimpleGrid } from "@chakra-ui/react";

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
      const res = await fetch("/api/anime?q=black");
      const json = await res.json();
      setResult(json.data);
      setLoading(false); // ← 読み込み完了
    }

    load();
  }, []);

  return (
    <SimpleGrid
      columns={{ base: 1, md: 2, lg:3 }}
      placeItems="center"
      w="100%"
      gap={6}
    >
      {/* ⭐ ローディング中は Skeleton のダミーを表示 */}
      {loading &&
        [...Array(6)].map((_, i) => (
          <ReviewThumbnail key={i} isLoading />
        ))}

      {/* ⭐ データ来たら本物のカードを表示 */}
      {!loading &&
        result.map((anime) => (
          <ReviewThumbnail
            key={anime.mal_id}
            image={
              anime.images.webp?.image_url ||
              anime.images.jpg?.image_url ||
              ""
            }
            title={anime.title_japanese || anime.title}
          />
        ))}
    </SimpleGrid>
  );
}
