export const runtime = 'edge';
import { Flex, Box, Text, Image } from "@chakra-ui/react";
import { games } from "@/app/data/games";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const game = games[slug as keyof typeof games];
  if (!game) return {};

  return {
    title: `${game.title} | Almond Games`,
    description: game.description,
  };
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  const game = games[slug as keyof typeof games];
  if (!game) return notFound();
  const Content = game.Content;
  return (


    <Flex mx={120}>
      <Box flex="0.6" mt={6} display="flex" justifyContent="flex-end">
        <Box textAlign="center">
          {/* 丸アイコン */}
          <Box
            w="50px"
            h="50px"
            borderRadius="full"
            bg="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mx="auto"
          >
            <Box
              as="svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              w="28px"
              h="28px"
              color="#DBB7C9"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </Box>
          </Box>

          {/* 数字ラベル */}
          <Box
            fontSize="sm"
            color="#DBB7C9"
          >
            12
          </Box>
          <Box
            mt={4}
            w="50px"
            h="50px"
            borderRadius="full"
            bg="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mx="auto"
          >
            <Box
              as="svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              w="28px"
              h="28px"
              color="#DBB7C9"   // ← 色
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
              />
            </Box>

          </Box>

          {/* 数字ラベル */}
          <Box
            fontSize="sm"
            color="#DBB7C9"
          >
            12
          </Box>
        </Box>
      </Box>



      <Box flex="6" bg="white" m={5} mr={0}
        p={6}
        borderRadius="md" >
        <h1>{game.title}</h1>
      </Box>

      {/* 右エリア（サイドバー） */}
      <Box flex="3">
        <Box
          m={5}
          p={3}
          px={6}

          bg="#fac4d4ff"
          borderRadius="md"

          display="flex"
          alignItems="center"
          gap={4}
        >
          {/* 左の丸角画像 */}
          <Box
            w="70px"
            h="66px"
            borderRadius="md"
            overflow="hidden"
            flexShrink={0}
            bg="#FFF"
            display="flex" justifyContent="center" alignItems="center"
          >
            <Image
              src="/images/icons/wakarase-tap1.webp"
              alt="icon"
              w="90%"
              h="90%"
              objectFit="cover"
            />
          </Box>
          <Text fontSize="xl" fontWeight="bold" color="white">
            全画面ページへ
          </Text>
        </Box>

        <Content />
      </Box>
    </Flex>
  );
}
