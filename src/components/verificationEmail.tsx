import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";
import Link from "next/link";

export default function VerificationEmail(otp: string) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Please activate your account</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here&apos;s your verification code: {otp}</Preview>
      <Section
        style={{
          fontFamily: "Helvetica, Arial, sans-serif",
          margin: "0px",
          padding: "0px",
          backgroundColor: "#ffffff",
        }}
      >
        <Row>
          <Section
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "0px",
              borderSpacing: "0px",
              fontFamily: "Arial, Helvetica, sans-serif",
              backgroundColor: "rgb(239, 239, 239)",
            }}
          >
            <Row
              style={{
                padding: "1rem 2rem",
                verticalAlign: "top",
                width: "100%",
              }}
            >
              <Section
                style={{
                  maxWidth: "600px",
                  borderCollapse: "collapse",
                  border: "0px",
                  borderSpacing: "0px",
                  textAlign: "left",
                }}
              >
                <Row style={{ padding: "40px 0px 0px" }}>
                  <div
                    style={{
                      padding: "20px",
                      backgroundColor: "rgb(255, 255, 255)",
                    }}
                  >
                    <div style={{ color: "rgb(0, 0, 0)", textAlign: "left" }}>
                      <Heading as="h1" style={{ margin: "1rem 0" }}>
                        Final step...
                      </Heading>
                      <Text style={{ paddingBottom: "16px" }}>
                        Use the below otp to verify your email address.
                        <Text style={{ fontWeight: "bold" }}>{otp}</Text>
                      </Text>

                      <Text style={{ paddingBottom: "16px" }}>
                        If you didn’t ask to verify this address, you can ignore
                        this email.
                      </Text>
                      <Text style={{ paddingBottom: "16px" }}>
                        Thanks,
                        <br />
                        True Feedback Team
                      </Text>
                    </div>
                  </div>
                  <div
                    style={{
                      paddingTop: "20px",
                      color: "rgb(153, 153, 153)",
                      textAlign: "center",
                    }}
                  >
                    <Text style={{ paddingBottom: "16px" }}>
                      Made with ♥ by Sohail
                    </Text>
                  </div>
                </Row>
              </Section>
            </Row>
          </Section>
        </Row>
      </Section>
    </Html>
  );
}
