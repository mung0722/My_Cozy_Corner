// 지금은 차트 자리만 만들어둠
// 나중에 Recharts를 연결하면 이 컴포넌트 안에 LineChart 코드 넣기
export default function GuitarChart() {
    return (
        <section className="rounded-xl border bg-white p-5">
            <h2 className="font-bold">BPM 성장 차트</h2>
            <p className="text-sm text-gray-500 mt-2">
                나중에 날짜별 BPM 기록 그래프가 들어갈 영역
            </p>
        </section>
    );
}