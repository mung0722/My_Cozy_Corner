import Link from "next/link";

export default function Homepage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold">My Cozy Corner</h1>
            <p className="text-gray-500 mt-2">
              운동과 기타 연습을 기록하는 개인 대시보드
            </p>
        </header>

        <Link
          href="/hobby"
          className="inline-flex rounded-lg bg-gray-900 px-4 py-2 text-white"
        >
          취미 대시보드로 이동
        </Link>
      </div>
    </main>
  );
}
