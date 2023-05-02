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
        <H1>Page Not Found</H1>
        <Link to="/">
          <Span>return to home page</Span>
        </Link>
      </FlexCol>
    </>
  );
}
