import Link from "next/link";
import { Dumbbell, Music } from "lucide-react";

export default function HobbyPage() {
    return (
        <main className="min-h-screen bggray500 text-gray-900 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <header>
                    <h1 className="text-3xl font-bold">취미 대시보드</h1>
                    <p className="text-gray-500 mt-2">
                        운동과 기타 연습을 기록하는 개인 대시보드
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        href="/hobby/fitness"
                        className="rounded-xl border bg-white p-6 hover:bg-blue-50"
                        >
                        <Dumbbell className="text-blue-500 mb-4" />
                        <h2 className="text-xl font-bold">운동</h2>
                        <p className="text-sm text-gray-500 mt-2">
                            운동 루틴, 중량, 회복 상태를 기록
                        </p>
                    </Link>

                    <Link
                        href="/hobby/guitar"
                        className="rounded-xl border bg-white p-6 hover:bg-red-50"
                    >
                        <Music className="text-red-500 mb-4" />
                        <h2 className="text-xl font-bold">기타 연습</h2>
                        <p className="text-sm text-gray-500 mt-2">
                            연습곡, 목표 BPM, 진행도를 관리
                        </p>
                    </Link>
                </div>
            </div>
        </main>
    );
}