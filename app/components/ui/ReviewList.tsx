import ReviewThumnail from "./ReviewThumnail";
import { SimpleGrid } from "@chakra-ui/react";

export default function ReviewList() {
  const dummy = Array.from({ length: 8 });

  return (
    <SimpleGrid
      columns={{ base: 1, sm: 1, md: 2, lg: 3 }}
      placeItems="center"
      px={{ base: 40, md: 10, lg: 40}}
      gap={30}
      mt={10}
    >
      {dummy.map((_, i) => (
        <ReviewThumnail key={i} />
      ))}
    </SimpleGrid>
  );
}
