import { Button, Card, Image, Text } from "@chakra-ui/react";

export default function ReviewThumnail() {
  return (
    <Card.Root w="100%" p="0" overflow="hidden">
      <Image
        src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc"
        alt="Green double couch with wooden legs"
      />

      <Card.Body>
        <Card.Title>Living room Sofa</Card.Title>

        <Card.Description>
          This sofa is perfect for modern tropical spaces, baroque inspired
          spaces.
        </Card.Description>

        <Text textStyle="2xl" fontWeight="medium" letterSpacing="tight" mt="2">
          $450
        </Text>
      </Card.Body>

      <Card.Footer >
        <Button variant="solid">Buy now</Button>
        <Button variant="ghost">Add to cart</Button>
      </Card.Footer>
    </Card.Root>
  );
}
