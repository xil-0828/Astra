'use client';

export const dynamic = "force-dynamic";
export const revalidate = 0;

import GoogleLoginButton from "../components/auth/GoogleLoginButton";

export default function LoginPage() {
  return (
    <div style={{ padding: 40 }}>
      <GoogleLoginButton />
      <hr style={{ margin: "20px 0" }} />
    </div>
  );
}
