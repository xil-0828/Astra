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

  // ⭐ Supabase レビュー取得
  async function loadReviews() {
    const res = await fetch(`/api/reviews?anime_id=${id}`);
    const json = await res.json();
    setReviews(json.data || []);
  }

  // ⭐ 映画.com の配信状況
  async function loadEigaData(title: string) {
    setEigaLoading(true);
    const res = await fetch("/api/supabase_eigacom", {
      method: "POST",
      body: JSON.stringify({ title }),
    });
    const json = await res.json();
    setEigaData(json);
    setEigaLoading(false);
  }

  // ⭐ アニメ情報 API（サーバー側で整形済み）
  useEffect(() => {
    async function load() {
      if (!id) return;

      // ⭐ ① Jikan API → 最優先
      const res = await fetch(`/api/detail_jikan/${id}`);
      const animeData = await res.json();

      setAnime(animeData);
      setLoading(false);

      // ⭐ ② レビューは少し遅れて読み込み（体感が速くなる）
      setTimeout(() => {
        loadReviews();
      }, 300); // ← 300ms が自然（調整可）

      // ⭐ ③ 配信状況も Jikan の後
      const title = animeData.title_japanese || animeData.title;
      setTimeout(() => loadEigaData(title), 500);
    }

    load();
  }, [id]);

  if (loading) return <Box p={5}>読み込み中...</Box>;

  return (
    <Box px={5} py={5} textAlign="center">

      {/* タイトル */}
      <Heading fontSize="2xl" mb={3}>
        {anime.title_japanese || anime.title}
      </Heading>

      {/* 画像 */}
      <Box display="flex" justifyContent="center">
        <Image
          src={anime.image}
          alt={anime.title}
          w="320px"
          borderRadius="12px"
          mb={4}
        />
      </Box>

      {/* 説明文 */}
      <Text fontSize="md" whiteSpace="pre-wrap" mb={8}>
        {anime.synopsis || "説明文がありません。"}
      </Text>
      {/* 基本情報 */}
      <Box mb={6} textAlign="left">
        <Text>形式：{anime.type || "不明"}</Text>
        <Text>制作：{anime.studios?.join(" / ") || "不明"}</Text>
        <Text>エピソード：{anime.episodes || "不明"} 話</Text>
        <Text>
          放送期間：
          {anime.aired_from
            ? `${anime.aired_from} ～ ${anime.aired_to || "放送中"}`
            : "不明"}
        </Text>
      </Box>

      {anime.youtube_id && (
        <Box my={5}>
          <Heading size="md" mb={2}>公式PV</Heading>
          <iframe
            width="320"
            height="180"
            src={`https://www.youtube.com/embed/${anime.youtube_id}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: "12px" }}
          />
        </Box>
      )}

      {/* ⭐ 配信状況 */}
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

      {/* 口コミフォーム */}
      <ReviewForm animeId={id as string} onSubmitted={loadReviews} />

      {/* 口コミ一覧 */}
      <ReviewList reviews={reviews} />
    </Box>
  );
}
