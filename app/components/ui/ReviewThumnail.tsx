import Image from "next/image";
import { Card, Text, Box, HStack, VStack, Skeleton, SkeletonText } from "@chakra-ui/react";

type Props = {
  image?: string;
  title?: string;
  episodes?: number;
  score?: number;
  rank?: number;
  members?: number;
  genres?: string[];
  status?: string;
  isLoading?: boolean; // ← 追加
};

export default function ReviewThumnail({
  image,
  title,
  episodes = 0,
  score = 0,
  rank = 0,
  members = 0,
  genres = [],
  status = "放送終了",
  isLoading = false,
}: Props) {
  return (
    <Card.Root w="sm" variant="subtle" bg="white">
      <HStack align="flex-start" spacing={5}>
        {/* 画像 Skeleton */}
        <Box w="150px" h="220px" position="relative" flexShrink={0}>
          {isLoading ? (
            <Skeleton w="150px" h="220px" borderRadius="12px" />
          ) : (
            <Image
              src={image ?? "/placeholder.png"}
              alt={title ?? ""}
              fill
              style={{
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
          )}
        </Box>

        {/* テキスト Skeleton */}
        <VStack align="start" spacing={1} flex="1">
          {isLoading ? (
            <>
              <Skeleton w="80px" h="12px" />
              <Skeleton w="120px" h="12px" />
              <Skeleton w="200px" h="20px" mt={2} />
              <Skeleton w="160px" h="12px" mt={2} />
              <Skeleton w="100px" h="12px" />
            </>
          ) : (
            <>
              <Text color="gray.600" fontSize="sm">
                {status}
              </Text>

              <Text color="gray.600" fontSize="sm">
                {episodes} エピソード
              </Text>

              <Text fontWeight="bold" fontSize="xl" mt={2}>
                {title}
              </Text>

              <HStack spacing={4} mt={1}>
                <VStack align="start" spacing={0}>
                  <Text fontSize="lg">⭐ {score}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {members.toLocaleString()} 人のユーザー
                  </Text>
                </VStack>

                <VStack align="start" spacing={0}>
                  <Text fontSize="lg">#{rank}</Text>
                  <Text fontSize="xs" color="gray.500">
                    ランキング
                  </Text>
                </VStack>
              </HStack>

              <HStack spacing={4} mt={2}>
                {genres.map((g) => (
                  <Text key={g} fontSize="sm">
                    {g}
                  </Text>
                ))}
              </HStack>
            </>
          )}
        </VStack>
      </HStack>
    </Card.Root>
  );
}
