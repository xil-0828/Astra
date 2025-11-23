"use client";

import { useEffect, useState } from "react";
import ReviewThumbnail from "./ReviewThumnail";

type Anime = {
  mal_id: number;
  title: string;
  synopsis: string | null;
  images: {
    jpg: { image_url: string };
    webp: { image_url: string };
  };
};

export default function TestJikan() {
  const [result, setResult] = useState<Anime[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/anime?q=bleach");
      const json = await res.json();
      setResult(json.data);
    }

    load();
  }, []);

  return (
    <>
      {result.map((anime) => (
        <ReviewThumbnail
          key={anime.mal_id}
          image={
            anime.images.webp?.image_url ||
            anime.images.jpg?.image_url ||
            ""
          }
          title={anime.title}
          description={anime.synopsis || ""}
        />
      ))}
    </>
  );
}
