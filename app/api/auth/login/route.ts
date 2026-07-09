import { signIn } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 안전하게 텍스트로 읽고 검사
    const text = await request.text();
    if (!text) {
      return NextResponse.json({ error: '요청 바디가 비어있습니다. JSON을 보내주세요.' }, { status: 400 });
    }

    let body;
    try {
      body = JSON.parse(text);
    } catch (e) {
      return NextResponse.json({ error: '유효하지 않은 JSON입니다.' }, { status: 400 });
    }

    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: '이메일과 비밀번호를 입력해주세요.' }, { status: 400 });
    }

    const result = await signIn(email, password);

    if (!result.success) {
      // signIn에서 전달한 에러 메시지/상태를 클라이언트에 전달
      return NextResponse.json(
        { error: result.error?.message ?? '로그인에 실패했습니다.' },
        { status: result.error?.status ?? 400 }
      );
    }

    return NextResponse.json(
      { message: '로그인 성공!', user: result.user, session: result.session },
      { status: 200 }
    );
  } catch (error) {
    console.error('로그인 API 오류:', error);
    return NextResponse.json({ error: '로그인 중 오류가 발생했습니다.' }, { status: 500 });
  }
}