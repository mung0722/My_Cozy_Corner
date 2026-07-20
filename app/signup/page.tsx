"use client";

/*
    - 회원 가입 페이지
        - 이메일, 비밀번호 입력
        - /api/auth/signup 엔드포인트에 POST
        - 성공 시 로그인 페이지로 이동
*/

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage(){
    const router = useRouter();

    // 폼 상태
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState(""); // 비밀번호 확인
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // 회원가입 폼 제출
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // 새로고침 방지
        setErrorMsg(null);
        setSuccessMsg(null);
        setLoading(true);

        // 1) 클아이언트 측 유효성 검사
        // 비밀번호가 일치하는지 확인
        if(password !== passwordConfirm){
            setErrorMsg("비밀번호가 일치하지 않습니다.");
            setLoading(false);
            return;
        }

        // 비밀번호 최소 길이 확인
        if(password.length < 6){
            setErrorMsg("비밀번호는 최소 6자 이상이어야 합니다.");
            setLoading(false);
            return;
        }

        try {
            // 2) 섭 회원가입 엔드포인트에 POST 요청
                // 서버(/api/auth/signup)는 supabase에 새 계정을 만들고 응답함
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type" : "application/json" },
                body: JSON.stringify({email, password}),
            });

            // 3) 서버 응답 JSON 파싱
            const json = await res.json();
            
            // 4) 서버에서 실패 응답이 오면 에러 표시
            if(!res.ok){
                // 서버가 실패 응답이 오면 에러 표시
                // 예: "email rate limit exceeded" (Supabase에서 같은 이메일로 너무 많이 시도)
                setErrorMsg(
                    typeof json.error === "string"
                        ? json.error
                        : json.error?.message ?? "회원가입에 실패했습니다."
                );
                setLoading(false);
                return;
            }

            // 5) 회원가입 성공 시 성공 메시지 표시
            setSuccessMsg(
                "회원가입 성공! 로그인 페이지로 이동합니다."
            );

            // 6) 2초 후 로그인 페이지로 이동
            // (사용자가 성공 메시지를 잠깐이나마 볼 수 있도록)
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        }catch (err){
            // 네트워크 오류 등 예외 처리
            console.error("회원가입 예외:", err);
            setErrorMsg("회원가입 중 오류가 발생했습니다.");
        } finally{
            setLoading(false);
        }
    };

    // UI 렌더링
    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
                {/* 제목 */}
                <h1 className="text-2xl font-semibold mb-4 text-gray-900">회원가입</h1>

                {/* 에러 메시지 표시 */}
                {errorMsg && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                        {errorMsg}
                    </div>
                )}

                {/* 성공 메시지 표시 */}
                {successMsg && (
                    <div className="mb-4 text-sm text-green-600 bg-green-50 p-2 rounded">
                        {successMsg}
                    </div>
                )}

                {/* 회원가입 폼 */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 이메일 입력 */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-900">이메일</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-2 border rounded text-gray-900 placeholder-gray-300"
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* 비밀번호 입력 */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-900">
                            비밀번호
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 border rounded text-gray-900 placeholder-gray-300"
                            placeholder="비밀번호 (최소 6자)"
                        />
                    </div>

                    {/* 비밀번호 확인 입력 */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-900">
                            비밀번호 확인
                        </label>
                        <input
                            type="password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            required
                            className="w-full p-2 border rounded text-gray-900 placeholder-gray-300"
                            placeholder="비빌번호 재입력"
                        />
                    </div>

                    {/* 제출 버튼 */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60 font-medium hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
                        disabled={loading}
                        >
                            {loading ? "회원가입 중..." : "회원가입"}
                    </button>
                </form>
                

                {/* 로그인 페이지 링크 */}
                <p className="mt-4 text-sm text-gray-700">
                    이미 계정이 있으신가요?{"  "}
                    <a href="/login" className="text-blue-600 underline font-medium">로그인</a>
                </p>
            </div>

        </main>
    )
}