// 로그아웃 API 엔드포인트
// POST /api/auth/logout 으로 요청이 오면 현재 세션을 삭제하고 로그아웃합니다

import { signOut } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const result = await signOut();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error?.message ?? '로그아웃에 실패했습니다.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: '로그아웃에 성공했습니다.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('로그아웃 API 오류:', error);
    return NextResponse.json(
      { error: '로그아웃 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
