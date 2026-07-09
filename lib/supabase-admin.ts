// Supabase Javascript 라이브러리에서 createClient 함수를 가져옴
import { createClient } from "@supabase/supabase-js";

// .env 파일에 저장된 Supabase 프로젝트 URL을 가져옴
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// .env 파일에 저장된 Service Role Key(관리자 권한)을 가져옴
const supabaseAdminKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// URL 또는 관리자 키가 존재하지 않으면 서버 실행을 중단하고 에러 발생
if (!supabaseUrl || !supabaseAdminKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY 또는 NEXT_PUBLIC_SUPABASE_URL가 설정되지 않았습니다.");
}

// Supabase 관리자(Admin) 클라이언트를 생성
// Service Rold Key를 사용하기 때문에 모든 데이터에 접근 가능한 권한을 가짐
// 반드시 서버(API Route, Server Action 등)에서만 사용해야 함
export const supabaseAdmin = createClient(supabaseUrl, supabaseAdminKey);