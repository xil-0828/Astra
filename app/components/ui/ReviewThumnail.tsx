import { Button, Card, Image, Text } from "@chakra-ui/react";
type Props = {
  image: string;
  title: string;
  description: string;
};
export default function ReviewThumbnail({ image, title, description }: Props) {
  return (
    <Card.Root w="100%" p="0" overflow="hidden">
      <Image src={image} alt={title} />

      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Description>{description}</Card.Description>
      </Card.Body>

      <Card.Footer>
        <Button variant="solid">Buy now</Button>
        <Button variant="ghost">Add to cart</Button>
      </Card.Footer>
    </Card.Root>
  );
}