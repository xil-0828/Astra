"use client";

import {
  Box,
  Heading,
  Text,
  Image,
  VStack,
  RatingGroup,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReviewForm from "@/app/components/ui/ReviewForm";

export default function AnimeDetailPage() {
  const params = useParams();
  const id = params.id;

  const [anime, setAnime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);

  // ⭐ Supabase からレビュー取得
  async function loadReviews() {
    const res = await fetch(`/api/reviews?anime_id=${id}`);
    const json = await res.json();
    setReviews(json.data || []);
  }

  // ⭐ アニメ情報 + レビュー読み込み
  useEffect(() => {
    async function load() {
      // アニメ API
      const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
      const json = await res.json();
      setAnime(json.data);
      setLoading(false);

      // reviews 取得
      await loadReviews();
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

      {/* ⭐ 切り出した口コミフォーム */}
      <ReviewForm animeId={id} onSubmitted={loadReviews} />

      {/* ⭐ レビュー一覧 */}
      <Box>
        <Heading fontSize="xl" mb={3}>
          みんなの口コミ
        </Heading>

        {reviews.length === 0 && (
          <Text color="gray.500">まだレビューがありません。</Text>
        )}

        <VStack spacing={4}>
          {reviews.map((r) => (
            <Box
              key={r.id}
              p={3}
              border="1px solid #ccc"
              borderRadius="8px"
              maxW="500px"
              w="100%"
            >
              <Text fontWeight="bold">{r.user_id}</Text>

              <RatingGroup.Root value={r.score} readOnly count={5}>
                <RatingGroup.Control>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <RatingGroup.Item key={i} index={i + 1}>
                      <RatingGroup.ItemIndicator />
                    </RatingGroup.Item>
                  ))}
                </RatingGroup.Control>
              </RatingGroup.Root>

              <Text mt={2}>{r.comment}</Text>

              <Text fontSize="xs" color="gray.500" mt={2}>
                {new Date(r.created_at).toLocaleString()}
              </Text>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}
