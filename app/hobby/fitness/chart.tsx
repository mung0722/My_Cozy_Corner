import { LineChart } from "lucide-react";

// 이 컴포넌트는 헬스 그래프 영역만 담당합니다.
// page.tsx가 너무 길어지는 것을 막기 위해 차트 부분을 따로 분리한 것입니다.
export default function FitnessChart() {
  return (
    <section className="rounded-xl border bg-white p-5">
      <h2 className="font-bold flex items-center gap-2">
        <LineChart size={18} />
        중량 성장 그래프
      </h2>
      <p className="text-sm text-gray-500 mt-2">
        나중에 Recharts로 점진적 과부하 그래프를 넣을 영역입니다.
      </p>
    </section>
  );
}