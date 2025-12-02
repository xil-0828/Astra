"use client";

import {
  Box,
  Heading,
  Text,
  Image,
  Input,
  Textarea,
  Button,
  VStack,
  RatingGroup,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
export default function AnimeDetailPage() {
  const params = useParams();
  const id = params.id;

  const supabase = createClient();
  const router = useRouter();

  const [anime, setAnime] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ⭐ 口コミ入力
  const [name, setName] = useState("");
  const [score, setScore] = useState(3);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);

  const storageKey = `reviews_${id}`;

  // ⭐ アニメ API 取得
  useEffect(() => {
    async function load() {
      const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
      const json = await res.json();
      setAnime(json.data);
      setLoading(false);
    }
    load();

    // ローカルレビュー読み込み
    const saved = localStorage.getItem(storageKey);
    if (saved) setReviews(JSON.parse(saved));
  }, [id]);

  // ⭐ 口コミ投稿
  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/login?next=/anime/detail/${id}`);
      return;
    }

    if (!comment.trim()) return;

    const newReview = {
      name: name || user.user_metadata?.full_name || "名無しさん",
      score,
      comment,
      date: new Date().toISOString(),
      user_id: user.id,
    };

    const updated = [...reviews, newReview];
    setReviews(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    setComment("");
  };

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

      {/* ---- 口コミフォーム ---- */}
      <Box
        p={4}
        border="1px solid #ddd"
        borderRadius="12px"
        mb={6}
        maxW="500px"
        mx="auto"
      >
        <Heading fontSize="lg" mb={3}>
          口コミを書く
        </Heading>

        <VStack spacing={3}>
          <Input
            placeholder="ニックネーム（任意）"
            value={name}
            onChange={(e) => setName(e.target.value)}
            textAlign="center"
          />

          {/* ⭐ 評価（ハート系） */}
          <RatingGroup.Root
            value={score}
            onValueChange={(v) => setScore(v)}
            count={5}
            size="lg"
          >
            <RatingGroup.HiddenInput />
            <RatingGroup.Control>
              {Array.from({ length: 5 }).map((_, i) => (
                <RatingGroup.Item key={i} index={i + 1}>
                  <RatingGroup.ItemIndicator />
                </RatingGroup.Item>
              ))}
            </RatingGroup.Control>
          </RatingGroup.Root>

          <Textarea
            placeholder="コメントを書く"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            textAlign="center"
          />

          <Button colorScheme="blue" onClick={handleSubmit}>
            投稿
          </Button>
        </VStack>
      </Box>

      {/* ---- レビュー一覧 ---- */}
      <Box>
        <Heading fontSize="xl" mb={3}>
          みんなの口コミ
        </Heading>

        {reviews.length === 0 && (
          <Text color="gray.500">まだレビューがありません。</Text>
        )}

        <VStack spacing={4}>
          {reviews.map((r, idx) => (
            <Box
              key={idx}
              p={3}
              border="1px solid #ccc"
              borderRadius="8px"
              maxW="500px"
              w="100%"
            >
              <Text fontWeight="bold">{r.name}</Text>

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
                {new Date(r.date).toLocaleString()}
              </Text>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}
