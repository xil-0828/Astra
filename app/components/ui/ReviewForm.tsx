"use client";

import {
  Box,
  Heading,
  Textarea,
  Button,
  VStack,
  RatingGroup,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type ReviewFormProps = {
  animeId: string;          // ← これがポイント
  onSubmitted?: () => void;
};

export default function ReviewForm({ animeId, onSubmitted }: ReviewFormProps) {
  const supabase = createClient();
  const router = useRouter();

  const [score, setScore] = useState(3);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/login?next=/anime/detail/${animeId}`);
      return;
    }

    if (!comment.trim()) return;

    await fetch("/api/reviews", {
      method: "POST",
      body: JSON.stringify({
        anime_id: Number(animeId),
        score,
        comment,
      }),
    });

    setComment("");
    setScore(3);

    onSubmitted?.();
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

      <VStack>
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
  );
}
