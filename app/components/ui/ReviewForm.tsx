"use client";

import {
  Box,
  Heading,
  Textarea,
  Button,
  VStack,
  RatingGroup,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toaster } from "@/app/components/ui/toaster";
import { ReviewUI } from "@/types/ui/review";

type ReviewFormProps = {
  animeId: string;
  onSubmitted?: () => void;
};

export default function ReviewForm({ animeId, onSubmitted }: ReviewFormProps) {
  const supabase = createClient();
  const router = useRouter();

  const [alreadyPosted, setAlreadyPosted] = useState(false);
  const [score, setScore] = useState(3);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ 自分のレビューがあるか確認
  useEffect(() => {
    let cancelled = false;

    async function checkMyReview() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const res = await fetch(`/api/reviews?anime_id=${animeId}`);
      if (!res.ok) return;

      const text = await res.text();
      if (!text) return;

      let json: { data: ReviewUI[] } | null = null;
      try {
        json = JSON.parse(text);
      } catch {
        return;
      }

      if (!json?.data || cancelled) return;

      const mine = json.data.find(
        (r) => r.user_id === user.id
      );

      if (mine) {
        setAlreadyPosted(true);
      }
    }

    checkMyReview();

    return () => {
      cancelled = true;
    };
  }, [animeId, supabase]);

  // ✅ 投稿処理
  const handleSubmit = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toaster.create({
        title: "ログインが必要です",
        type: "warning",
      });
      router.push(`/login?next=/anime/detail/${animeId}`);
      return;
    }

    if (!comment.trim()) {
      toaster.create({
        title: "コメントを入力してください",
        type: "warning",
      });
      return;
    }

    if (comment.length > 500) {
      toaster.create({
        title: "コメントは500文字以内です",
        type: "warning",
      });
      return;
    }

    setLoading(true);

    const promise = fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        anime_id: Number(animeId),
        score,
        comment,
      }),
    }).then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "投稿に失敗しました");
      }

      setComment("");
      setScore(3);
      setAlreadyPosted(true);
      onSubmitted?.();
    });

    toaster.promise(promise, {
      loading: { title: "投稿中…" },
      success: { title: "投稿完了!" },
      error: (err) => ({
        title: "エラー",
        description:
          err instanceof Error ? err.message : "不明なエラー",
      }),
    });

    promise.finally(() => setLoading(false));
  };

  return (
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

      <VStack align="stretch" gap={4}>
        <RatingGroup.Root
          value={score}
          onValueChange={(d) => setScore(d.value)}
          count={5}
          size="lg"
          readOnly={alreadyPosted}
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
          placeholder={
            alreadyPosted
              ? "投稿済みのため編集できません"
              : "コメントを書く（500文字以内）"
          }
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={alreadyPosted || loading}
          textAlign="center"
        />

        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          disabled={alreadyPosted || loading}
          loading={loading}
        >
          {alreadyPosted ? "投稿済みです" : "投稿"}
        </Button>
      </VStack>
    </Box>
  );
}
