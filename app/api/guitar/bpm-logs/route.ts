// app/api/guitar/bpm-logs/route.ts

// Next.js에서 요청과 응답을 처리하기 위한 객체를 가져옴
import { NextRequest, NextResponse } from "next/server";

// Supabase 클라이언트를 가져옴
import { supabaseAdmin } from "@/lib/supabase-admin";

// POST 요청이 들어왔을 때 실행되는 API 함수
export async function POST(req: NextRequest) {
  try {
    // 요청 헤더에서 Authorization 값을 가져옴.
    // 헤더가 없으면 빈 문자열("")을 사용.
    const authHeader = req.headers.get("authorization") || "";

    // "Bearer " 문자열을 제거하여 순수 JWT 토큰만 추출
    // trim()은 앞뒤 공백 제거
    const token = authHeader.replace("Bearer ", "").trim();

    // 토큰이 존재하지 않으면 인증 실패(401) 반환
    if (!token) return NextResponse.json({ error: "Authorization token required" }, { status: 401 });

    // 전달받은 토큰을 이용하여 현재 로그인한 사용자 정보를 조회
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);

    // 토큰이 유효하지 않거나 사용자 정보를 가져오지 못한 경우
    if (userError || !userData?.user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // 이후 사용할 사용자 객체 저장
    const user = userData.user;

    // 요청 Body(JSON)를 객체 형태로 변환
    const body = await req.json();

    // Body에서 필요한 값들을 구조 분해 할당으로 추출
    const { song_id, date, achieved_bpm } = body;

    // 곡 ID와 달성 BPM은 필수 입력값
    if (!song_id || !achieved_bpm) return NextResponse.json({ error: "song_id and achieved_bpm required" }, { status: 400 });

    // DB에 저장할 하나의 레코드 객체 생성
    const log = {
      // 현재 로그인한 사용자의 ID 저장
      user_id: user.id,

      // 어떤 곡의 기록인지 저장
      song_id,

      // 날짜가 전달되지 않았다면 오늘 날짜를 사용 (YYYY-MM-DD 형식)
      date: date || new Date().toISOString().slice(0, 10),

      // 실제로 달성한 BPM 저장
      achieved_bpm,
    };

    // guitar_bpm_logs 테이블에 log 객체를 삽입
    // insert()는 배열 형태로 데이터를 전달해야 함
    const { data, error } = await supabaseAdmin.from("guitar_bpm_logs").insert([log]);

    // DB 삽입 중 오류가 발생한 경우
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // 저장 성공 시 생성된 데이터를 반환하고 상태코드 201(Created) 반환
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    // try 블록에서 처리되지 않은 예외 발생 시 실행
    console.error("API error:", err);

    // 서버 오류(500) 반환
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET 요청이 들어왔을 때 실행되는 API 함수
export async function GET(req: NextRequest) {
  try {
    // 요청 헤더에서 Authorization 값을 가져옴.
    // 헤더가 없으면 빈 문자열("")을 사용.
    const authHeader = req.headers.get("authorization") || "";

    // "Bearer " 문자열을 제거하여 순수 JWT 토큰만 추출
    // trim()은 앞뒤 공백 제거
    const token = authHeader.replace("Bearer ", "").trim();

    // 토큰이 존재하지 않으면 인증 실패(401) 반환
    if (!token) return NextResponse.json({ error: "Authorization token required" }, { status: 401 });

    // 전달받은 토큰을 이용하여 현재 로그인한 사용자 정보를 조회
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);

    // 토큰이 유효하지 않거나 사용자 정보를 가져오지 못한 경우
    if (userError || !userData?.user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // 이후 사용할 사용자 객체 저장
    const user = userData.user;

    // 요청 URL 객체 생성
    const url = new URL(req.url);

    // URL의 쿼리스트링에서 song_id 값을 가져옴.
    // 예: /api/guitar/bpm-logs?song_id=3
    const songId = url.searchParams.get("song_id");

    // guitar_bpm_logs 테이블에서 현재 로그인한 사용자의 데이터만 조회하는 기본 쿼리 생성
    let query = supabaseAdmin.from("guitar_bpm_logs").select("*").eq("user_id", user.id);

    // song_id가 전달되었다면 해당 곡의 기록만 조회하도록 조건 추가
    if (songId) query = query.eq("song_id", songId);

    // 날짜 기준 내림차순(최신순)으로 정렬하여 조회
    const { data, error } = await query.order("date", { ascending: false });

    // DB 조회 중 오류가 발생한 경우
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // 조회 성공 시 데이터를 반환하고 상태코드 200(OK) 반환
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    // try 블록에서 처리되지 않은 예외 발생 시 실행
    console.error("API error:", err);

    // 서버 오류(500) 반환
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}