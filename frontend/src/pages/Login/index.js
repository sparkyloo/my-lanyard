import "./Login.css";
import { Link } from "react-router-dom";
import { FlexCol } from "../../components/FlexCol";
import { FlexRow } from "../../components/FlexRow";
import { H1, Span } from "../../components/Text";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useLogin } from "../../state";
import { TopBar } from "../../components/TopBar";
import { ErrorList } from "../../components/ErrorList";

export function LoginPage() {
  const {
    emailInput,
    passwordInput,
    isPending,
    submitButton,
    errorList,
    dismissError,
  } = useLogin();

  return (
    <>
      <TopBar />
      <FlexCol gap={2} minWidth={40} maxWidth={48} margin={{ x: "auto" }}>
        <H1 text="center">Welcome Back</H1>
        <FlexCol gap={1}>
          <Input
            type="email"
            label="Email"
            placeholder="user@example.com"
            direction="column"
            disabled={isPending}
            {...emailInput}
          />
          <Input
            type="password"
            label="Password"
            placeholder="secret"
            direction="column"
            disabled={isPending}
            {...passwordInput}
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
            <Span>Need an account?</Span>
            <Link to="/signup">Click here</Link>
          </FlexRow>
        </FlexCol>
        <ErrorList errors={errorList} dismissError={dismissError} />
      </FlexCol>
    </>
  );
}
