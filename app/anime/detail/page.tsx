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
  RatingGroup,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client"; // ← ☆ここ重要☆
import { useRouter } from "next/navigation";

export default function AnimeDetailPage() {
  const supabase = createClient(); // ← ☆毎回これを作る
  const router = useRouter();

  const params = useSearchParams();
  const raw = params.get("data");

  if (!raw) return <Box textAlign="center">データがありません</Box>;

  const anime = JSON.parse(raw);

  const [name, setName] = useState("");
  const [score, setScore] = useState(3);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);

  const storageKey = `reviews_${anime.mal_id}`;

  // ローカルストレージ読み込み
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setReviews(JSON.parse(saved));
  }, []);

  // ⭐ 投稿処理（ログイン必須）
  const handleSubmit = async () => {
    // Supabase Auth のログイン状態チェック
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
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

  return (
    <Box px={5} py={5} textAlign="center">
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

      {/* ---- 口コミフォーム ---- */}
      <Box
        p={4}
        border="1px solid #ddd"
        borderRadius="12px"
        mb={6}
        w="100%"
        maxW="500px"
        mx="auto"
        textAlign="center"
      >
        <Heading fontSize="lg" mb={3}>
          口コミを書く
        </Heading>

        <VStack align="center" spacing={3}>
          <Input
            placeholder="ニックネーム（任意）"
            value={name}
            onChange={(e) => setName(e.target.value)}
            textAlign="center"
          />

          {/* ハート評価 */}
          <RatingGroup.Root
            value={score}
            onValueChange={setScore}
            count={5}
            size="lg"
          >
            <RatingGroup.HiddenInput />
            <RatingGroup.Control>
              {Array.from({ length: 5 }).map((_, index) => (
                <RatingGroup.Item key={index} index={index + 1}>
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

      {/* ---- 口コミ一覧 ---- */}
      <Box>
        <Heading fontSize="xl" mb={3}>
          みんなの口コミ
        </Heading>

        {reviews.length === 0 && (
          <Text color="gray.500">まだレビューがありません。</Text>
        )}

        <VStack align="center" spacing={4}>
          {reviews.map((r, idx) => (
            <Box
              key={idx}
              p={3}
              border="1px solid #ccc"
              borderRadius="8px"
              w="100%"
              maxW="500px"
              textAlign="center"
            >
              <Text fontWeight="bold">{r.name}</Text>

              <RatingGroup.Root value={r.score} readOnly count={5}>
                <RatingGroup.Control>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <RatingGroup.Item key={index} index={index + 1}>
                      <RatingGroup.ItemIndicator  />
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
