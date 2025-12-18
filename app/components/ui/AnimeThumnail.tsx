import Image from "next/image";
import { Box, Text, HStack, VStack, Skeleton } from "@chakra-ui/react";
import { AnimeSearchUI } from "@/types/ui/anime_search";
import { LuStar } from "react-icons/lu";
import { Icon } from "@chakra-ui/react";
type Props = {
  anime?: AnimeSearchUI;
  isLoading?: boolean;
};

export default function AnimeThumnail({
  anime,
  isLoading = false,
}: Props) {
  if (!anime && !isLoading) return null;

  const {
    title = "",
    imageUrl,
    episodes = 0,
    genres = [],
  } = anime ?? {};

  return (
    <Box w="100%" bg="white">
      <HStack align="center" gap={3}>
        {/* Image */}
        <Box
          w="163px"
          h="230px"
          position="relative"
          flexShrink={0}
          borderRadius="lg"
          overflow="hidden"
        >
          {isLoading ? (
            <Skeleton w="100%" h="100%" borderRadius="lg" />
          ) : (
            <Image
              src={imageUrl || "/placeholder.png"}
              alt={title}
              fill
              style={{ objectFit: "cover" }}
            />
          )}
        </Box>

        {/* Body */}
        <VStack
          w="153px"
          justify="center"
          align="flex-start"
          gap={2}
          flexShrink={0}
          alignSelf="stretch"
        >
          {isLoading ? (
            <AnimeThumbnailTextSkeleton />
          ) : (
            <>
              <Box
                display="flex"
                pl="8px"
                alignItems="center"
              >
                <Text textStyle="xs" fontWeight="light" color="brand.primary">放送中</Text>
              </Box>
              {/* エピソード数 */}
              <Text textStyle="xs" fontWeight="light" color="text.primary">
                {episodes} episodes
              </Text>


              {/* タイトル */}
              <Text
                textStyle="md"
                fontWeight="light"
              >
                {title}
              </Text>

              {/* 評価 */}
              <HStack gap={1}>
                <Icon
                  as={LuStar}
                  boxSize={5}
                  color="rating.star"
                  fill="rating.star"
                  strokeWidth={1}
                />
                <Text fontStyle="md" fontWeight="light" color="text.primary">4.5</Text>
                <Text
                  w="125px"
                  h="12px"
                  fontSize="10px"
                  fontWeight={300}
                  lineHeight="16px"
                  color="color.text.primary"
                  overflow="hidden"
                >
                  155 users
                </Text>
              </HStack>

              {/* ハッシュタグ */}
              <HStack gap={1} wrap="wrap">
                {genres.map((g) => (
                  <Text key={g} fontSize="10px" color="text.primary" fontWeight="light" lineHeight="16px">
                    {g}
                  </Text>
                ))}
              </HStack>
            </>
          )}
        </VStack>
      </HStack>
    </Box>
  );
}

/* ---------- Skeleton（テキストのみ） ---------- */

function AnimeThumbnailTextSkeleton() {
  return (
    <>
      <Skeleton w="70px" h="10px" />
      <Skeleton w="100%" h="14px" />
      <Skeleton w="90%" h="14px" />
      <Skeleton w="120px" h="10px" />
    </>
  );
}
