"use client";

// app/offline/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// OFFLINE FALLBACK — Shown by the service worker when the user is offline
// and the page isn't in the cache
// ─────────────────────────────────────────────────────────────────────────────

export default function OfflinePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 100%)",
        color: "#fff",
        fontFamily: "inherit",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "2rem",
          boxShadow: "0 0 40px rgba(124,58,237,0.4)",
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
          <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
      </div>

      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          marginBottom: "0.75rem",
          background: "linear-gradient(135deg, #a78bfa, #818cf8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        You&apos;re offline
      </h1>

      <p
        style={{
          color: "rgba(255,255,255,0.6)",
          maxWidth: 320,
          lineHeight: 1.6,
          marginBottom: "2rem",
          fontSize: "1rem",
        }}
      >
        No internet connection detected. Check your network and try again —
        your cached habits will still be available.
      </p>

      <button
        onClick={() => window.location.reload()}
        style={{
          padding: "0.75rem 2rem",
          borderRadius: "9999px",
          border: "none",
          background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
          color: "#fff",
          fontSize: "1rem",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
          (e.target as HTMLButtonElement).style.boxShadow =
            "0 8px 30px rgba(124,58,237,0.6)";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.transform = "translateY(0)";
          (e.target as HTMLButtonElement).style.boxShadow =
            "0 4px 20px rgba(124,58,237,0.4)";
        }}
      >
        Try again
      </button>
    </div>
  );
}
