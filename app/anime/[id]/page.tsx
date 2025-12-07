"use client";

import {
  Box,
  Heading,
  Text,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReviewForm from "@/app/components/ui/ReviewForm";
import ReviewList from "@/app/components/ui/ReviewList";

export default function AnimeDetailPage() {
  const params = useParams();
  const id = params.id;

  const [anime, setAnime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);

  // ⭐ 映画.com 配信状況
  const [eigaData, setEigaData] = useState<any>(null);
  const [eigaLoading, setEigaLoading] = useState(true);

  // ⭐ Supabase からレビュー取得
  async function loadReviews() {
    const res = await fetch(`/api/reviews?anime_id=${id}`);
    const json = await res.json();
    setReviews(json.data || []);
  }

  // ⭐ 映画.com の配信状況取得（遅くて OK）
  async function loadEigaData(title: string) {
    setEigaLoading(true);

    const res = await fetch("/api/SupabaseEigacom", {
      method: "POST",
      body: JSON.stringify({ title }),
    });

    const json = await res.json();
    setEigaData(json);
    setEigaLoading(false);
  }

  // ⭐ アニメ情報
  useEffect(() => {
    async function load() {
      if (!id) return;

      // ① Jikan API（最優先）
      const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
      const json = await res.json();
      setAnime(json.data);
      setLoading(false);

      // ② レビュー読み込み
      loadReviews();

      // ③ 配信状況は少し遅れて実行（UIをブロックしない）
      const title = json.data.title_japanese || json.data.title;

      setTimeout(() => {
        loadEigaData(title);
      }, 500); // ← 0.5秒遅らせてページ表示を優先
    }

    load();
  }, [id]);

  if (loading) return <Box p={5}>読み込み中...</Box>;

  return (
    <Box px={5} py={5} textAlign="center">
      {/* ---- タイトル ---- */}
      <Heading fontSize="2xl" mb={3}>
        {anime?.title_japanese || anime?.title}
      </Heading>

      <Box display="flex" justifyContent="center">
        <Image
          src={
            anime.images?.webp?.large_image_url ||
            anime.images?.jpg?.large_image_url
          }
          alt={anime.title}
          w="320px"
          borderRadius="12px"
          mb={4}
        />
      </Box>

      <Text fontSize="md" whiteSpace="pre-wrap" mb={8}>
        {anime.synopsis || "説明文がありません。"}
      </Text>

      {/* ⭐ 映画.com 配信状況表示ブロック */}
      <Box
        mb={8}
        p={4}
        border="1px solid #ccc"
        borderRadius="12px"
        bg="white"
      >
        <Heading size="md" mb={2}>
          配信状況
        </Heading>

        {eigaLoading && (
          <Box display="flex" justifyContent="center" py={3}>
            <Spinner />
            <Text ml={2}>配信状況を読み込み中...</Text>
          </Box>
        )}

        {!eigaLoading && eigaData?.items?.length === 0 && (
          <Text>現在配信情報は見つかりません。</Text>
        )}

        {!eigaLoading &&
          eigaData?.items?.map((item: any, i: number) => (
            <Box
              key={i}
              mb={2}
              p={2}
              border="1px solid #ddd"
              borderRadius="8px"
              textAlign="left"
            >
              <Text fontWeight="bold">{item.service}</Text>
              <Text fontSize="sm" color="gray.600">
                {item.releaseStr}
              </Text>
            </Box>
          ))}
      </Box>

      {/* ⭐ 口コミフォーム */}
      <ReviewForm animeId={id as string} onSubmitted={loadReviews} />

      {/* ⭐ レビュー一覧 */}
      <ReviewList reviews={reviews} />
    </Box>
  );
}
