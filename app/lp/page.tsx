export const dynamic = "force-static";

export default function LpPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        color: "white",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 600, padding: 24 }}>
        <h1 style={{ fontSize: 40, marginBottom: 16 }}>
          Astra
        </h1>

        <p style={{ fontSize: 18, lineHeight: 1.6, marginBottom: 24 }}>
          アニメの感想を、気軽に書いて共有できる
          <br />
          シンプルな口コミ・レビューサービス。
        </p>

        <a
          href="/auth/login"
          style={{
            display: "inline-block",
            padding: "12px 20px",
            background: "#38bdf8",
            color: "#020617",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          使ってみる
        </a>
      </div>
    </main>
  );
}
