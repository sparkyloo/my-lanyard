import "./Signup.css";
import { Link } from "react-router-dom";
import { FlexCol } from "../../components/FlexCol";
import { FlexRow } from "../../components/FlexRow";
import { H1, Span } from "../../components/Text";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useInput } from "../../hooks/input";
import { useForm } from "../../hooks/form";

export function SignupPage() {
  const [first] = useInput();
  const [last] = useInput();
  const [email] = useInput();
  const [password] = useInput();

  const button = useForm((dispatch) => {
    //
  });

  return (
    <FlexCol gap={2} minWidth={40} maxWidth={48} margin={{ x: "auto" }}>
      <H1 text="center">Get Started</H1>
      <FlexCol gap={1}>
        <Input
          label="First Name"
          placeholder="Jane"
          direction="column"
          {...first}
        />
        <Input
          label="Last Name"
          placeholder="Doe"
          direction="column"
          {...last}
        />
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
          <Span>Already have an account?</Span>
          <Link to="/login">Click here</Link>
        </FlexRow>
      </FlexCol>
    </FlexCol>
  );
}
