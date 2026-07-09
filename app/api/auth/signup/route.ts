// 회원가입 APY 엔드포인트

// Post /api/auth/signup 으로 요청이오면
// 새로운 사용자 계정을 만든다.

import { signUp } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// Post 요청 처리 함수
// 클리이언트에서 이메일과 비밀번호를 보내면 계정을 생성
export async function POST(request: NextRequest) {
    try {
        const text = await request.text();
        if (!text) {
            return NextResponse.json(
                { error: '요청 바디가 비어있습니다. JSON을 보내주세요.' },
                { status: 400 }
            );
        }

        let body;
        try {
            body = JSON.parse(text);
        } catch (error) {
            return NextResponse.json(
                { error: '유효하지 않은 JSON입니다.' },
                { status: 400 }
            );
        }

        const { email, password } = body;

        // 이메일과 비밀번호가 있는지 확인
        if (!email || !password) {
            return NextResponse.json(
                { error: '이메일과 비밀번호를 입력해주세요' },
                { status: 400}
            );
        }

        // 인증 함수(lib/auth.ts)에서 회원가입 실행
        const result = await signUp(email, password);

        // 회원가입 실패 시
        if(!result.success){
            return NextResponse.json(
                {error: result.error },
                { status: 400}
            );
        }

        // 회원가입 성공 시 사용자 정보 반환
        return NextResponse.json(
            {
                message: '회원가입 성공',
                user: result.user,
            },
            {status: 201}
        );
    } catch (error) {
        // 예상치 못한 오류가 발생했을 때
        console.error('회원가입 API 오류: ', error);
        return NextResponse.json(
            { error: '회원가입 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}