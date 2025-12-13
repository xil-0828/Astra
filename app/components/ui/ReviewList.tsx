"use client";

import {
  Box,
  Text,
  VStack,
  RatingGroup,
  Heading,
} from "@chakra-ui/react";
import { ReviewUI } from "@/types/ui/review";

type Props = {
  reviews: ReviewUI[];
};

export default function ReviewList({ reviews }: Props) {
  return (
    <Box>
      <Heading fontSize="xl" mb={3}>
        みんなの口コミ
      </Heading>

      {reviews.length === 0 && (
        <Text color="gray.500">まだレビューがありません。</Text>
      )}

      <VStack>
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
  );
}
