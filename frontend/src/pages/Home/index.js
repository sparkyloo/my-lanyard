import "./Home.css";
import { Link } from "react-router-dom";
import { TopBar } from "../../components/TopBar";
import { FlexCol } from "../../components/FlexCol";
import { H1, Span } from "../../components/Text";

export function HomePage() {
  return (
    <>
      <TopBar />
      <FlexCol
        align="center"
        justify="center"
        gap={2}
        margin={{
          y: 4,
          x: "auto",
        }}
      >
        <H1>Welcome to My Lanyard</H1>
        <Span>
          Sign up now for an account to create new items and use explore and use
          the existing system assets.
        </Span>
      </FlexCol>
    </>
  );
}
