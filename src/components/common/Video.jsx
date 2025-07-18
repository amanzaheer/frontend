import { Container, FullContainer } from "..";
import LazyIframe from "./LazyIframe";

export default function Video({ video, className }) {
  return (
    <FullContainer>
      <Container className="mt-16">
        <LazyIframe
          className={`w-full rounded-xl h-96 lg:h-[600px]`}
          url={video}
        />
      </Container>
    </FullContainer>
  );
}
