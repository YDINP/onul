import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 mt-auto py-4 px-4">
      <div className="max-w-md mx-auto flex flex-col items-center gap-2 text-sm text-white/40">
        <nav className="flex gap-4">
          <Link
            href="/about"
            className="hover:text-white/70 transition-colors"
          >
            소개
          </Link>
          <Link
            href="/privacy"
            className="hover:text-white/70 transition-colors"
          >
            개인정보처리방침
          </Link>
        </nav>
        <p>© 2026 오늘의 한 판</p>
      </div>
    </footer>
  );
}
