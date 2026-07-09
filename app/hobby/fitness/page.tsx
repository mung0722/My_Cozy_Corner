'use client';

import { Calendar, Dumbbell } from "lucide-react";
import FitnessChart from "./chart";

export default function FitnessPage(){
    return(
        <main className="min-h-screen bg-gray-50 text-gray-900 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <header>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Dumbbell className="text-blue-500" />
                        헬스
                    </h1>
                    <p className="text-gray-500 mt-2">
                        운동 기록, 중량 성장, 리커버리 상태를 관리
                    </p>
                </header>

                {/* 나중에 운동 부위, 종목, 세트, 무게, 횟수 입력 폼이 들어갈 영역 */}
                <section className="rounded-xl border bg-white p-5">
                    <h2 className="font-bold flex item-center gap-2">
                        <Calendar size={18} />
                        운동 입력
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">
                        운동 기록 입력 폼이 들어갈 자리
                    </p>
                </section>

                {/* 헬스 차트도 별도 파일로 분리해서 불러옴 */}
                <FitnessChart />
            </div>
        </main>
    );
}