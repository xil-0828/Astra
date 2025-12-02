import Image from "next/image";
import { Card, Text, Box, HStack, VStack, Skeleton } from "@chakra-ui/react";

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

export default function AnimeThumnail({
  image,
  title,
  episodes = 0,
  score = 4.5,
  rank = 0,
  members = 0,
  genres = [],
  status = "放送終了",
  isLoading = false,
}: Props) {
  return (
    <Card.Root w="sm" variant="subtle" bg="white" fontWeight={300}>
      <HStack align="center" gap={5}>
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
        <VStack align="start" flex="1">
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
              <Text fontSize="sm" ml={1}>
                {status}
              </Text>

              <Text fontSize="13px">
                {episodes} episodes
              </Text>

              <Text  fontSize="md" mt={1}>
                {title}
              </Text>

              <HStack mt={1} align="end">
                <VStack align="start">
                  <Text fontSize="sm">★ {score}</Text>
                </VStack>

                <VStack align="start">
                  <Text fontSize="xs">{rank} users</Text>
                </VStack>
              </HStack>
              <HStack mt={1}>
                <Text fontSize="xs">
                    #SF
                </Text>
                <Text fontSize="xs">
                    #ドラマ
                </Text>
              </HStack>


            </>
          )}
        </VStack>
      </HStack>
    </Card.Root>
  );
}
