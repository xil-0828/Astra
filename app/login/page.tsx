'use client';
import GoogleLoginButton from "../components/auth/GoogleLoginButton";

export default function LoginPage() {
  return (
    <div style={{ padding: 40 }}>
      <GoogleLoginButton />
      <hr style={{ margin: "20px 0" }} />
    </div>
  );
}
