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
  useEffect(() => {
  async function checkMyReview() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const res = await fetch(`/api/reviews?anime_id=${animeId}`);
    const json = await res.json();

    const mine = json.data.find((r: any) => r.user_id === user.id);

    if (mine) {
      setAlreadyPosted(true);
    }
  }

  checkMyReview();
}, );


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

  // 投稿処理（1回だけ）
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
      const data = await res.json().catch(() => null);
      throw new Error(data?.error ?? "投稿に失敗しました");
    }

    // 成功後の処理
    setComment("");
    setScore(3);
    onSubmitted?.();
  });

  // トーストは promise 自体を渡す
  toaster.promise(promise, {
    loading: { title: "投稿中…", description: "少々お待ちください" },
    success: { title: "投稿完了!", description: "レビューが追加されました" },
    error: (err) => ({
      title: "エラーが発生しました",
      description: err instanceof Error ? err.message : "不明なエラーが発生しました",
    }),
  });
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

      <VStack align="stretch">
        <RatingGroup.Root
          value={score}
          onValueChange={(details) => setScore(details.value)}
          count={5}
          size="lg"
          readOnly={alreadyPosted}
        >
          <RatingGroup.HiddenInput />
          <RatingGroup.Control >
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
          textAlign="center"
          disabled={alreadyPosted}
        />

        <Button
  colorScheme="blue"
  onClick={handleSubmit}
  disabled={alreadyPosted}   // ← 追加
>
  {alreadyPosted ? "投稿済みです" : "投稿"}
</Button>
      </VStack>
    </Box>
  );
}
