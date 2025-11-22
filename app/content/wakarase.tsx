import { Box, Heading, Text, List, Stack} from "@chakra-ui/react";

export default function WakaraseContent() {
  return (
    <Box
      m={5}
      p={6}
      borderRadius="md"
      bg="white"
    >
      {/* タイトルのアクセントライン */}
      <Box borderLeft="4px solid #ffc9d9ff" pl={4} mb={4}>
        <Heading size="lg" color="gray.800">
          メスガキわからせタップ
        </Heading>
        <Text fontSize="sm" color="#90757D" mt={1}>
          Tap to Shock // ドS連打ゲーム
        </Text>
      </Box>

      {/* 説明セクション */}
      <Stack spacing={3} mb={6}>
        <Heading size="md" color="gray.800">
          ゲーム説明
        </Heading>
        <Text color="gray.600" lineHeight="1.8">
          メスガキをテンポよくタップしてわからせる爽快ゲーム。
          タップするたびに反応が変化し、連打コンボで気持ちよくスコアが伸びます。
        </Text>
      </Stack>

      {/* ルールセクション */}
      <Stack spacing={4}>
        <Heading size="md" color="gray.700">
          ルール
        </Heading>

        <List.Root mt={2} gap={3} variant="plain">
          <List.Item fontSize="md" color="gray.700">
            制限時間内にできるだけ連打する
          </List.Item>
          <List.Item fontSize="md" color="gray.700">
            タップが続くとコンボが発生しスコアUP
          </List.Item>
          <List.Item fontSize="md" color="gray.700">
            反応が変わる演出を楽しみながら高得点を目指す
          </List.Item>
        </List.Root>
      </Stack>
    </Box>
  );
}
