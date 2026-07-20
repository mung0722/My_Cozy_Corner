// 브라우저에서 실행되는 React 기능(버튼 클릭, 데이터 변경)을 사용하겠다고 선언
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js 웹 라우팅 훅
import { supabase } from "@/lib/supabase"; // 브라우저용 Supabase 클라이언트

/*
    1) 사용자가 이메일/비밀번호 입력 후 폼 제출
    2) 클라이언트에서 /api/auth/login 엔드포인트로 POST 요청 (서버에서 Supabase로 인증)
    3) 서버가 성공 시 session 객체를 JSON으로 반환
        - 예: {message: '로그인 성공!', user:{...}, session: { access_token, refresh_token, ...}}
    4) 클라이언트는 반환된 session의 access_token_refresh_token을 supabase-js에 setSession으로 설정
        -> supabase-js가 로컬에 세션을 저장하고 이후 supabase.auth.getUser()/getSession()으로 접근 가능

    보안 참고:
        - 프로덕션에서는 서버에서 Httplonly 쿠키로 세션을 설정하는 방법을 권장
        (클라이언트에서 토큰을 직접 저장하면 XSS 공격에 취약)
            -> 해당 부분은 스킬이 좀 더 늘어난 후 추후 제작 사이트에서 적용 예정
*/
export default function LoginPage(){
    const router = useRouter();

    // 폼 상태 (useState로 관리)
    const [email, setEmail] = useState(""); // 입력된 이메일
    const [password, setPassword] = useState(""); // 입력된 비밀번호
    const [loading, setLoading] = useState(false); // 제출 중 로딩 상태 (버튼 비활성화 등)
    const [errorMsg, setErrorMsg] = useState<string | null >(null); // 에러 메시지 표시용

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // 폼의 기본 새로고침 동작 막기
        setErrorMsg(null); // 이전 에러메시지 초기화
        setLoading(true);

        try{
            // 1) 서버 엔드포인트에 로그인 요청 보냄
            //  - 서버는 Supabase와 통신하여 로기은 처리하고 session을 반환해야 함
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            // 2) 서버 응답 JSON 파싱
            const json = await res.json();

            // 3) 서버에서 실패 응답을 주면 사용자에게 알림
            if (!res.ok){
                setErrorMsg(json?.error ?? "로그인에 실패했습니다.");
                setLoading(false);
                return;
            }

            // 4) 서버가 반환된 session 객체 확인
            //      서버 구현 예시(성공 시) : { message: '로그인 성공!', user: {...}, session: { access_token, refresh_token, ... } }
            const session = json.session;
            if(!session?.access_token){
                // session 또는 access_token이 없으면 다음 단계로 진행할 수 없음
                setErrorMsg("서버에서 세션을 받지 못했습니다.");
                setLoading(false);
                return;
            };

            // 5) supabase-js 클라이언트 세션을 설정
            //      supabase.auth.setSession({ access_toke, refresh_token })
            //          -> 이렇게 하면 supabase-js가 브라우저(LocalStorage)에 세션을 저장하고
            //              이후 supabase.auth.getUser() 같은 호출로 현재 사용자 정보를 가져올 수 있음.
            const { error : setErr } = await supabase.auth.setSession({
                access_token: session.access_token,
                refresh_token: session.refresh_token,
            });

            if (setErr) {
                // 세션 설정 중 에러 발생 가능 (예: 토큰 포맷 문제 등)
                console.error("Supabase setSession error:", setErr);
                setErrorMsg("클라이언트 세션 설정에 실패했습니다.");
                setLoading(false);
                return;
            }

            // 6) 모든 작업 성공: 원하는 페이지로 이동
            // 예: /hobby (대시보드)
            router.push("/hobby");
        } catch(err){
            // 네트워크 오류 등 예외 처리
            console.error("로그인 예외:", err);
            setErrorMsg("로그인 중 오류가 발생했습니다.");
        } finally{
            setLoading(false);
        }
    };

    // UI 렌더링
    return(
        <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-semibold mb-4 text-gray-900">로그인</h1>

                {/* 에러 메시지 영역: 에러가 있을 때만 보여줌 */}
                {errorMsg && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                        {errorMsg}
                    </div>
                )}

                {/* 로그인 폼 */}
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    {/* 주석: required 속성으로 브라우저 레벨의 빈값 방지 가능 */}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-900">비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 border rounded text-gray-900 placeholder-gray-300"
                            placeholder="password"
                        />
                    </div>

                    {/* 제출 버튼: 로딩 중에는 비활성화 */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60 font-medium hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
                        disabled={loading}
                    >
                        {loading ? "로그인 중..." : "로그인"}
                    </button>
                </form>

                <p className="mt-4 text-sm text-gray-700">
                    계정이 없으시면 회원가입을 진행하세요.{" "}
                    <a href="/signup" className="text-blue-600 underline">
                        회원가입
                    </a>
                </p>
            </div>
        </main>
    );
}