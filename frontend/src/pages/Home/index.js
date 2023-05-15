import "./Home.css";
import { TopBar } from "../../components/TopBar";
import { FlexCol } from "../../components/FlexCol";
import { H1, Span } from "../../components/Text";
import { useUserEdit } from "../../state";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { ErrorList } from "../../components/ErrorList";
import { FlexRow } from "../../components/FlexRow";

export function HomePage() {
  const {
    session,
    first,
    last,
    email,
    currentPassword,
    changedPassword,
    confirmPassword,
    errorList,
    dismissError,
    saveInfoChange,
    savePasswordChange,
    isPending,
  } = useUserEdit();

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
        {!session ? (
          <>
            <H1>Welcome to My Lanyard</H1>
            <Span>
              Sign up now for an account to create new items or use the existing
              system assets.
            </Span>
          </>
        ) : (
          <>
            <H1>Welcome Back!</H1>
            <FlexCol gap={2}>
              <FlexRow gap={2}>
                <FlexCol gap={2} minWidth={40} maxWidth={48}>
                  <FlexCol gap={1}>
                    <Input
                      type="email"
                      label="Email"
                      placeholder="user@example.com"
                      direction="column"
                      disabled={isPending}
                      {...email}
                    />
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
                  </FlexCol>
                  <Button {...saveInfoChange} disabled={isPending} width="full">
                    Save Info
                  </Button>
                </FlexCol>
                <FlexCol gap={2} minWidth={40} maxWidth={48}>
                  <FlexCol gap={1}>
                    <Input
                      type="password"
                      label="Current Password"
                      placeholder="secret"
                      direction="column"
                      disabled={isPending}
                      {...currentPassword}
                    />
                    <Input
                      type="password"
                      label="Changed Password"
                      placeholder="secret"
                      direction="column"
                      disabled={isPending}
                      {...changedPassword}
                    />
                    <Input
                      type="password"
                      label="Confirm Password"
                      placeholder="secret"
                      direction="column"
                      disabled={isPending}
                      {...confirmPassword}
                    />
                  </FlexCol>
                  <Button
                    {...savePasswordChange}
                    width="full"
                    disabled={
                      isPending ||
                      !currentPassword.value ||
                      !changedPassword.value ||
                      !confirmPassword.value
                    }
                  >
                    Change Password
                  </Button>
                </FlexCol>
              </FlexRow>
              <ErrorList errors={errorList} dismissError={dismissError} />
            </FlexCol>
          </>
        )}
      </FlexCol>
    </>
  );
}
