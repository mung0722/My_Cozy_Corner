//supabase 클라이언트 초기화 파일
// 이 파일은 앱 전체에서 supabase에 접속할 때 사용하는 설정 파일이다.
// 한번 만들고 나서는 다른 파일에서 import해서 쓰면 된다.

import {createClient } from '@supabase/supabase-js';

// 1. 환경 변수에서 Supabase URL과 API 키를 가져온다.
// (.env.local 파일에 이 변수들이 정의된다.)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 2. 환경 변수가 제대로 설정되지 않았으면 에러를 표시
// 이런 방식을 활용해야 문제를 빨리 발견 가능
if (!supabaseUrl || !supabaseKey){
    throw new Error(
        ' Supabase 설정 오류 \n' +
        'NEXT_PUBLIC_SUPABASE_URL 또는 NEXT_PUBLIC_SUPABASE_ANON_KEY가 설정되지 않았습니다.\n' +
        '.env.local 파일을 확인해주세요.'
    );
}

// 3. Supabase 클라이언트 생성
// 이 객체를 사용해서 Supabase 데이터베이스와 통신한다.
export const supabase = createClient(supabaseUrl, supabaseKey);