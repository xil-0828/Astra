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
import { AnimeDetailUI } from "@/types/ui/anime_detail";
import { ReviewUI } from "@/types/ui/review";
import { EigaComResponseUI } from "@/types/ui/eigacom";
export default function AnimeDetailPage() {
  const params = useParams();
  const id = params.id as string;

  // ★★★ any をやめる ★★★
  const [anime, setAnime] = useState<AnimeDetailUI | null>(null);
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState<ReviewUI[]>([]);

  const [eigaData, setEigaData] = useState<EigaComResponseUI | null>(null);

  const [eigaLoading, setEigaLoading] = useState(true);

  // ⭐ Supabase レビュー取得
  async function loadReviews() {
    const res = await fetch(`/api/reviews?anime_id=${id}`);
    const json: { data: ReviewUI[] } = await res.json();
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

  // ⭐ アニメ情報 API（server 側で整形済み）
  useEffect(() => {
    async function load() {
      if (!id) return;

      // ★★★ 新しい API ★★★
      const res = await fetch(`/api/detail_jikan/${id}`);
      const json: { data: AnimeDetailUI } = await res.json();

      setAnime(json.data);
      setLoading(false);

      // レビュー（遅延）
      setTimeout(() => {
        loadReviews();
      }, 300);

      // 配信状況（遅延）
      setTimeout(() => {
        loadEigaData(json.data.title);
      }, 500);
    }

    load();
  }, [id]);

  if (loading || !anime) {
    return <Box p={5}>読み込み中...</Box>;
  }

  return (
    <Box px={5} py={5} textAlign="center">

      {/* タイトル */}
      <Heading fontSize="2xl" mb={3}>
        {anime.title}
      </Heading>

      {/* 画像 */}
      <Box display="flex" justifyContent="center">
        <Image
          src={anime.imageUrl}
          alt={anime.title}
          w="320px"
          borderRadius="12px"
          mb={4}
        />
      </Box>

      {/* 説明文 */}
      <Text fontSize="md" whiteSpace="pre-wrap" mb={8}>
        {anime.synopsis}
      </Text>

      {/* 基本情報 */}
      <Box mb={6} textAlign="left">
        <Text>制作：{anime.meta.studios.join(" / ")}</Text>
        <Text>エピソード：{anime.hero.episodesText}</Text>
        <Text>放送状況：{anime.hero.statusLabel}</Text>
        <Text>放送年：{anime.meta.yearText}</Text>
        <Text>尺：{anime.meta.durationText}</Text>
      </Box>

      {/* 公式PV */}
      {anime.trailer.youtubeId && (
        <Box my={5}>
          <Heading size="md" mb={2}>公式PV</Heading>
          <iframe
            width="320"
            height="180"
            src={`https://www.youtube.com/embed/${anime.trailer.youtubeId}`}
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
          eigaData?.items.map((item, i) => (
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

      {/* 口コミ */}
      <ReviewForm animeId={id} onSubmitted={loadReviews} />
      <ReviewList reviews={reviews} />
    </Box>
  );
}
