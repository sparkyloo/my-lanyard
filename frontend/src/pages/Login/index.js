import "./Login.css";
import { Link } from "react-router-dom";
import { FlexCol } from "../../components/FlexCol";
import { FlexRow } from "../../components/FlexRow";
import { H1, Span } from "../../components/Text";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useInput } from "../../hooks/input";
import { useForm } from "../../hooks/form";

export function LoginPage() {
  const [email] = useInput();
  const [password] = useInput();

  const button = useForm((dispatch) => {
    //
  });

  return (
    <FlexCol gap={2} minWidth={40} maxWidth={48} margin={{ x: "auto" }}>
      <H1 text="center">Welcome Back</H1>
      <FlexCol gap={1}>
        <Input
          type="email"
          label="Email"
          placeholder="user@example.com"
          direction="column"
          {...email}
        />
        <Input
          type="password"
          label="Password"
          placeholder="secret"
          direction="column"
          {...password}
        />
      </FlexCol>
      <FlexCol gap={1.5} align="end">
        <Button {...button} width="full">
          Submit
        </Button>
        <FlexRow gap={0.5} fontSize={4} fontWeight={1}>
          <Span>Need an account?</Span>
          <Link to="/signup">Click here</Link>
        </FlexRow>
      </FlexCol>
    </FlexCol>
  );
}
