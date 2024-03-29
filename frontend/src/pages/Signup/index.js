import "./Signup.css";
import { Link } from "react-router-dom";
import { TopBar } from "../../components/TopBar";
import { FlexCol } from "../../components/FlexCol";
import { FlexRow } from "../../components/FlexRow";
import { H1, Span } from "../../components/Text";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { ErrorList } from "../../components/ErrorList";
import { useSignup } from "../../state";

export function SignupPage() {
  const {
    first,
    last,
    email,
    password,
    errorList,
    dismissError,
    submitButton,
    isPending,
  } = useSignup();

  return (
    <>
      <TopBar />
      <FlexCol gap={2} minWidth={40} maxWidth={48} margin={{ x: "auto" }}>
        <H1 text="center">Get Started</H1>
        <FlexCol gap={1}>
          <Input
            label="First Name"
            placeholder="Jane"
            direction="column"
            disabled={isPending}
            {...first}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            direction="column"
            disabled={isPending}
            {...last}
          />
          <Input
            type="email"
            label="Email"
            placeholder="user@example.com"
            direction="column"
            disabled={isPending}
            {...email}
          />
          <Input
            type="password"
            label="Password"
            placeholder="secret"
            direction="column"
            disabled={isPending}
            {...password}
          />
        </FlexCol>
        <FlexCol gap={1.5} align="end">
          <Button
            handleEnterKey
            {...submitButton}
            disabled={isPending}
            width="full"
          >
            Submit
          </Button>
          <FlexRow gap={0.5} fontSize={4} fontWeight={1}>
            <Span>Already have an account?</Span>
            <Link to="/login">Click here</Link>
          </FlexRow>
        </FlexCol>
        <ErrorList errors={errorList} dismissError={dismissError} />
      </FlexCol>
    </>
  );
}
