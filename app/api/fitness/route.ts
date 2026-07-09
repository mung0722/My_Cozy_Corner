// Next.js에서 요청과 응답을 처리하기 위한 객체를 가져옴
import { NextRequest, NextResponse } from "next/server";
// Supabase 클라이언트를 가져옴
import { supabaseAdmin } from "@/lib/supabase-admin";

// Post 요청이 들어왔을 때 실행되는 API함수
export async function POST(req:NextRequest) {
    try {
        // 1. 토큰 확인

        // 요청 헤더에서 Authorization 값을 가져옴
        // 헤더가 없으면 빈 문자열("")을 사용.
        const authHeader = req.headers.get("authorization") || "";

        // "Bearer " 문자열을 제거하여 순수 JWT 토큰만 추출
        // trim()은 앞뒤 공백 제거
        const token = authHeader.replace("Bearer ", "").trim();
        // 토큰이 존재하지 않으면 인증 실패(401) 반환
        if (!token) {
            return NextResponse.json({error : "Authorization token required" }, { status:401 });
        }

        // 2. 토큰으로 사용자 확인

        // 전달 받은 토큰을 이용하여 현재 로그인한 사용자 정보를 조회
        const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);

        // 토큰이 유효하지 않거나 사용자 정보를 가져오지 못한 경우
        if(userError || !userData?.user) {
            console.error("토큰 검증 실패:", userError);

            // 인증 실패(401) 반환
            return NextResponse.json({ error: "Invalid token" }, {status: 401});
        }

        // 이후 사용할 사용자 객체 저장
        const user = userData.user;

        // 3. 요청 바디 파싱 및 검증

        // 요청 Body(JSON)를 객체 형태로 변환
        const body = await req.json();

        // body에서 필요한 값들을 구조 분해 할당으로 추출
        const {
            date,
            part,
            exercise_name,
            weight,
            reps,
            set_number,
            memo,
            practice_minutes,
        } = body;

        // 운동 이름과 운동 부위는 필수 입력값
        if (!exercise_name || !part) {
            return NextResponse.json({ error : "exercise_name and part are required" }, {status:400});
        }

        // DB에 저장할 하나의 레코드 객체 생성
        const record = {
            //현재 로그인한 사용자의 ID 저장
            user_id: user.id,
            //날짜가 전달되지 않았다면 오늘 날짜를 사용 (YYYY-MM-DD 형식)
            date: date || new Date().toISOString().slice(0, 10),
            // 운동 부위
            part,
            // 운동 이름
            exercise_name,
            // 값이 null 또는 undefined이면 기본값 사용
            weight: weight ?? 0,
            reps: reps ?? 0,
            set_number: set_number ?? 1,

            // 메모와 운동 시간은 없어도 되므로 null 허용
            memo: memo ?? null,
            practice_minutes: practice_minutes ?? null,
        };

        // 4. DB에 삽입

        // fitness_records 테이블에 record 객체를 삽입
        // insert()는 배열 형태로 데이터를 전달해야 함
        const { data, error } = await supabaseAdmin.from("fitness_records").insert([record]);

        // DB 삽입 중 오류가 발생한 경우
        if (error){
            console.error("DB insert error: ", error);

            // 서버 오류(500) 반환
            return NextResponse.json({ error: error.message}, {status:500});
        }

        // 저장 성공 시 생성된 데이터를 반환하고 상태코드 201(Created) 반환
        return NextResponse.json({ data }, { status: 201});
    } catch(err) {
        // try 블록에서 처리되지 않은 예외 발생 시 실행
        console.error("API error:", err);

        // 서버 오류(500) 반환
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// GET 요청이 들어왔을 때 실행되는 API 함수
export async function GET(req:NextRequest) {
    try{
        // 요청 헤더에서 Authorization 값을 가져옴.
        // 헤더가 없으면 빈 문자열("")을 사용.
        const authHeader = req.headers.get("authorization") || "";

        // "Bearer " 문자열을 제거하여 순수 JWT 토큰만 추출
        //trim()은 앞뒤 공백 제거
        const token = authHeader.replace("Bearer ", "").trim();

        // 토큰이 존재하지 않으면 인증 실패(401) 반환
        if (!token) return NextResponse.json({ error: "Authorization token required" }, {status:401});

        // 전달받은 토큰을 이용하여 현재 로그인한 사용자 정보를 조회
        const { data:userData, error: userError } = await supabaseAdmin.auth.getUser(token);

        // 토큰이 유효하지 않거나 사용자 정보를 가져오지 못한 경우
        if (userError || !userData?.user) return NextResponse.json({ error: "Invalid totke" }, { status:401});

        // 이후 사용할 사용자 객체 저장
        const user = userData.user;

        // fitness_records 테이블에서 데이터를 조회
        const { data, error } = await supabaseAdmin
            .from("fitness_records") // 조회할 테이블 지정
            .select("*") // 모든 컬럼 조회
            .eq("user_id", user.id) // user_id가 현재 로그인한 사용자의 ID와 같은 데이터만 조회
            .order("date", { ascending: false}); // date 기준 내림차순 정렬(최신 날짜가 먼저)

        // DB 조회 중 오류가 발생한 경우
        if (error){
            console.error("DB select error: ", error);

            // 서버 오류(500) 반환
            return NextResponse.json({ error: error.message }, {status:500});
        }

        // 조회 성공 시 데이터를 반환하고 상태코드 200(OK) 반환
        return NextResponse.json({ data }, { status:200 });
    }catch(err){
        // try 블록에서 처리되지 않은 예외 발생 시 실행
        console.error("API error:", err);

        // 서버 오류(500) 반환
        return NextResponse.json({ error: "Server error" }, {status:500});
    }
}