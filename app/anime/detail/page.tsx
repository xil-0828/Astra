"use client";

import { useSearchParams } from "next/navigation";
import {
  Box,
  Heading,
  Text,
  Image,
  Input,
  Textarea,
  Button,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function AnimeDetailPage() {
  const params = useSearchParams();
  const raw = params.get("data");

  if (!raw) return <Box textAlign="center">データがありません</Box>;

  const anime = JSON.parse(raw);

  const [name, setName] = useState("");
  const [score, setScore] = useState(10);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);

  const storageKey = `reviews_${anime.mal_id}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setReviews(JSON.parse(saved));
  }, []);

  const handleSubmit = () => {
    if (!comment.trim()) return;

    const newReview = {
      name: name || "名無しさん",
      score,
      comment,
      date: new Date().toISOString(),
    };

    const updated = [...reviews, newReview];
    setReviews(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setComment("");
  };

  return (
    <Box px={5} py={5} textAlign="center"> {/* ⭐ 全体中央寄せ */}
      {/* ---- アニメ情報 ---- */}
      <Heading fontSize="2xl" mb={3}>
        {anime.title_japanese || anime.title}
      </Heading>

      <Box display="flex" justifyContent="center" w="100%">
        <Image
          src={
            anime.images?.webp?.large_image_url ||
            anime.images?.jpg?.large_image_url
          }
          alt={anime.title}
          w="300px"
          borderRadius="12px"
          mb={4}
        />
      </Box>

      <Text fontSize="md" whiteSpace="pre-wrap" mb={8}>
        {anime.synopsis || "説明文がありません。"}
      </Text>

      {/* ---- 口コミ入力フォーム ---- */}
      <Box
        p={4}
        border="1px solid #ddd"
        borderRadius="12px"
        mb={6}
        w="100%"
        maxW="500px"
        mx="auto"
        textAlign="center"          // ⭐ 中央寄せ
      >
        <Heading fontSize="lg" mb={3}>
          口コミを書く
        </Heading>

        <VStack align="center" spacing={3} w="100%">
          <Input
            placeholder="ニックネーム（任意）"
            value={name}
            onChange={(e) => setName(e.target.value)}
            textAlign="center"
          />

          <Input
            type="number"
            min={0}
            max={10}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            placeholder="点数（0〜10）"
            textAlign="center"
          />

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

      {/* ---- 口コミ一覧 ---- */}
      <Box>
        <Heading fontSize="xl" mb={3}>
          みんなの口コミ
        </Heading>

        {reviews.length === 0 && (
          <Text color="gray.500">まだレビューがありません。</Text>
        )}

        {/* ⭐ 全部中央寄せのレビューカード */}
        <VStack align="center" spacing={4} w="100%">
          {reviews.map((r, idx) => (
            <Box
              key={idx}
              p={3}
              border="1px solid #ccc"
              borderRadius="8px"
              w="100%"
              maxW="500px"
              textAlign="center"        // ⭐ コメント全体中央
            >
              {/* 名前＋スコア */}
              <HStack justify="center" gap={5} mb={2}>
                <Text fontWeight="bold">{r.name}</Text>
                <Text>⭐ {r.score}</Text>
              </HStack>

              {/* コメント */}
              <Text mt={2}>{r.comment}</Text>

              {/* 日付 */}
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
