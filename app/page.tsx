// 브라우저에서 실행되는 React 기능(버튼 클릭, 데이터 변경)을 사용하겠다고 Next.js에 알려주는 선언문
'use client';
// React에서 화면을 바꾸기 위해 꼭 필요한 useState 함수를 가져옴
import { useState } from "react";
// 화면을 예쁘게 꾸며줄 lucide-react 라이브러리의 아이콘들을 가져옴
import { Dumbbell, Music, LineChart, Calendar, Plus, Trash2, Video } from 'lucide-react';

// 메인 대시보드 페이지 전체를 구성하는 대표 함수(컴포넌트)
export default function Home(){
  // ==============================
  // 상태 관리 상자(state) 정의 구역
  // ==============================
  // 현재 어떤 서브 탭이 켜져 있는지 기억하는 상자. (기본값 'guitar')
  //activeTab에는 현재 'guitar'값이 들어있고 setActiveTab은 이 값을 바꿀 때 사용하는 함수
  const [activeTab, setActiveTab] = useState('guitar');
  // 사용자가 등록한 일렉기타 곡들을 리스트 형태로 저장하는 상자
  // 공부할 때 화면에 미리 하나가 보여야 편하므로 캐논락 데이터를 기본으로
  const [songs, setSongs] = useState([
    {id: 1, title: 'Canon Rock (캐논락)', target_bpm: 200, youtube_url: 'https://www.youtube.com/watch?v=3slG_msTYjk&list=RD3slG_msTYjk&start_radio=1', progress: 20}
  ]);

  // Input에 타이핑하는 내용을 실시간으로 저장하는 임시 상자들
  const [newTitle, setNewTitle] = useState(''); // 곡 제목 입력값 저장
  const [newBpm, setNewBpm] = useState(''); // 목표 BPM 입력값 저장
  const [newUrl, setNewUrl] = useState(''); // 유튜브 링크 입력값 저장
  const [newProgress, setNewProgress] = useState(0); // 달성도 입력값 저장 (기본값 0)

  // ==============================
  // 기능(함수) 정의 구역
  // ==============================

  // '곡 추가' 버튼을 눌렀을 때 실행되는 함수
  const handleAddSong = (e: any) => {
    // 폼이 제출될 때 페이지가 새로고침 되는 브라우저의 기본 성질을 막아줌
    e.preventDefault();

    // 필수 입력값(곡 제목이 PK여서)인 곡 제목이 비어있으면 경고창을 띄우고 함수 종료 
  if (!newTitle) return alert('곡 제목을 입력해주세요!');

  // 내가 새로 입력한 데이터를 묶어서 하나의 객체(object) 덩어리로 만듦
  const newSong ={
    id: Date.now(), //중복되지 않는 고유한 ID를 만들기 위해 현재 시간(밀리초)를 사용용
    title: newTitle,
    target_bpm: newBpm ? parseInt(newBpm) : 0, //글자 형태로 들어온 숫자를 int로 변경
    youtube_url: newUrl,
    progress: parseInt(newProgress.toString()) // 선택된 달성도를 숫자로 바꿔서 묶어줌
  };

  // 기존 songs 배열 뒤에 새곡을 붙여서 전체 리스트 상자 업데이트
  // ...songs 문법은 '기존에 있던 곡들을 그대로 펼쳐놓아라'라는 뜻
  setSongs([...songs, newSong]);

  // 곡을 성공적으로 추가했으니 다음 입력을 위해 입력창 안의 글자들을 깨끗하게 비우기
  setNewTitle('');
  setNewBpm('');
  setNewUrl('');
  setNewProgress(0); // 추가가 완료되면 드롭다운 선택창도 다시 0%으로 초기화
  };

  // [휴지통 아이콘]을 눌렀을 때 특정 곡을 지워주는 함수
  const handleDeleteSong = (id: any) => {
    // filter 함수는 조건에 맞는 데이터만 남기는 기능
    // '내가 클락헌 곡의 id가 아닌 것들만 남겨라' => 즉, 클릭한 곡만 목록에서 제외시키는 원리
    setSongs(songs.filter(song => song.id !== id));
  };

  // 특정 곡의 진행도를 실시간으로 업데이트해 주는 함수
  const handleUpdateProgress = (id: any, newProgressValue: number) => {
    setSongs(
      songs.map((song) => 
        song.id === id ? { ...song, progress: newProgressValue} : song)
    );
  }
  
  // ==============================
  // html, jsx 구역
  // ==============================
  return (
    // Tailwind CSS 클래스명을 사용해 배경색, 여백을 디자인. (min-h-screen: 화면 높이 100% 채우기)
    <main className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* 상단 타이틀 헤더 */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">나만의 사이트</h1>
          <h1 className="text-gray-500 mt-2">오늘의 성장을 기록하고 관리하는 공간</h1>
        </header>

        {/* 탭 내비게이션 버튼 구역 */}
        <div className="flex space-x-2 bg-gray-200 p-1.5 rounded-xl mb-8 w-fit">
          {/* 헬스 버튼 */}
          <button
            onClick={() => setActiveTab('fitness')} // 클릭하면 activeTab 상자 내용물을 'fitness'로 교체합니다.
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              // activeTab이 fitness일 때만 흰색 배경과 파란 글씨 스타일을 적용합니다. (삼항 연산자 조건문)
              activeTab === 'fitness' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Dumbbell size={18} />
            <span>헬스 (Fitness)</span>
          </button>

          {/* 일렉기타 버튼 */}
          <button
            onClick={() => setActiveTab('guitar')} // 클릭하면 activeTab 상자 내용물을 'guitar'로 교체합니다.
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              // activeTab이 guitar일 때만 흰색 배경과 빨간 글씨 스타일을 적용합니다.
              activeTab === 'guitar' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Music size={18} />
            <span>일렉기타 (Guitar)</span>
          </button>
        </div>

        {/* 대시보드 본문 구역 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {/* [1] 헬스 탭 화문 분기 */}
          {/* activeTab 상자가 'fitness'일때만 아래 괄호()안의 HTML 태그들이 화면에 보임 */}
          {activeTab === 'fitness' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Dumbbell className="text-blue-500"/> 점진적 과부하 기록실
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border p-4 rounded-xl bg-gray-50">
                  <p className="font-semibold text-gray-700 flex items-center gap-2"><Calendar size={16}/>운동 입력 폼</p>
                  <p className="text-sm text-gray-400 mt-2">다음 단계에서 운동 부위, 무게 횟수 입력 창을 만들 예정입니다. </p>
                </div>
                <div className="border p-4 rounded-xl bg-gray-50">
                  <p className="font-semibold text-gray-700 flex items-center gap-2"><LineChart size={16}/> 중량 성장 그래프</p>
                  <p className="text-sm text-gray-400 mt-2">여기에 Recharts 그래프가 들어갑니다.</p>
                </div>
              </div>
            </div>
          )}

          {/* [2] 일렉기타 탭 화면 분기 */}
          {/* activeTab 상자가 'guitar'일 때만 아래 괄호() 안의 HTML 태그들이 화면에 보임 */}
          {activeTab === 'guitar' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Music className="text-red-500" /> 연주 레퍼토리 관리
              </h2>

              {/* 곡 등록 form 입력창 */}
              {/* 버튼을 누르거나 엔터를 치면 handleAddSong 함수가 실행되도록 연결 */}
              <form onSubmit={handleAddSong} className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                {/* 제목 입력 필드 */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">곡 제목</label>
                  <input
                    type="text"
                    value={newTitle} //입력창에 보여줄 실제 값은 newTitle 상자 안의 텍스트임.
                    onChange={(e) => setNewTitle(e.target.value)} // 실시간 상자 값 업데이트
                    placeholder="예: Canon Rock"
                    className="w-full p-2 border rounded-lg text-sm bg-white"/>
                </div>
                {/* BPM 입력 필드 */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">목표 BPM</label>
                  <input
                    type="number"
                    value={newBpm} // newBpm 상자의 값 연동
                    onChange={(e) => setNewBpm(e.target.value)} // 실시간 상자 값 업데이트
                    placeholder="예: 200"
                    className="w-full p-2 border rounded-lg text-sm bg-white" />
                </div>
                {/* 유튜브 URL 입력 필드 */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">유튜브 링크</label>
                  <input
                    type="url"
                    value={newUrl} // newUrl 상자의 값 연동
                    onChange={(e) => setNewUrl(e.target.value)} // 실시간 상자 값 업데이트
                    placeholder="예: https://..."
                    className="w-full p-2 border rounded-lg text-sm bg-white"/>
                </div>
                {/* 완성도 입력 필드 */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">완곡 정도</label>
                  <select value={newProgress} onChange={(e) => setNewProgress(parseInt(e.target.value))}
                    className="w-full p-2 border rounded-lg text-sm bg-white font-medium">
                      <option value="0">0% (시작)</option>
                      <option value="20">20% (인트로)</option>
                      <option value="40">40% (전반부)</option>
                      <option value="50">50% (절반 완수)</option>
                      <option value="60">60% (후반부)</option>
                      <option value="80">80% (솔로/종반)</option>
                      <option value="100">100% (완곡!)</option>
                  </select>
                </div>
                {/* 추가 제출 버튼 */}
                <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors">
                  <Plus size={16}/> 곡 추가
                </button>
              </form>

              {/* 등록된 곡 리스트 출력 구역 */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-600 text-sm">내 연습 레퍼토리 목록 ({songs.length})</h3>
                {/* 만약 songs 배열의 개수가 0개라면 비어잇따는 안내 문구를 보여줍니다.(조건문) */}
                {songs.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-6">등록된 곡이 없습니다. 새 곡을 추가하세요.</p>
                ) : (
                  // songs 배열에 저장된 곡 개수만큼 map 함수가 반복해서 카드를 생성
                  songs.map((song) => (
                    // React에서 반복문(map)을 쓸 때는 가상의 카드를 식별하기 위해 고유한 key가 반드시 필요
                    <div key={song.id} className="p-4 border border-gray-100 rounded-xl flex justify-between items-center bg-gray-50/50 hover:bg-gray-50 transition-all">
                      <div>
                        {/* 곡 제목 출력 */}
                        <h4 className="font-bold text-gray-800 text-base">{song.title}</h4>
                        {/* 목표 BPM이 0보다 크게 입력되었을 때만 속도 텍스트를 화면에 보여줍니다. */}
                        {song.target_bpm > 0 && (
                          <p className="text-xs text-gray-500 mt-1">목표 속도: <span className="font-semibold text-red-500">{song.target_bpm} BPM</span></p>
                        )}

                        {/* 게이지 바 형태로 시각화된 완곡 진행도 그래프 */}
                        <div className="w-full max-w-xs pt-2">
                          <span className="flex justify-between text-[10px] text-gray-400 font-medium mb-1">연습 진행도</span>
                            <select
                              value={song.progress || 0}
                              onChange={(e: any) => handleUpdateProgress(song.id, parseInt(e.target.value))}
                              className={`text-xs font-bold rounded-full px-2.5 py-1 appearance-none cursor-pointer text-center transition-all focus:outline-none ${
                                song.progress === 100
                                 ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                 : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              >
                                <option value="0">0% (시작)</option>
                                <option value="20">20% (인트로)</option>
                                <option value="40">40% (전반부)</option>
                                <option value="50">50% (절반 완수)</option>
                                <option value="60">60% (후반부)</option>
                                <option value="80">80% (솔로/종반)</option>
                                <option value="100">100% 🎉</option>
                              </select>
                          </div>
                          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                song.progress === 100 ? 'bg-green-500' : 'bg-red-500'
                              }`}
                              style={{width: `${song.progress || 0}%`}}
                              ></div>
                          </div>
                        </div>
                      
                      <div className="flex items-center space-x-2">
                        {/* 유튜브 URL이 비어있지 않고 입력되어 잇을 때만 빨간색 아이콘을 노출 */}
                        {song.youtube_url && (
                          <a
                            href={song.youtube_url} // 등록한 링크 주소로 연결
                            target="_blank" // 새 탭으로
                            rel="noopener noreferrer" // 보안과 성능 향상을 위한 안전장치 속성
                            className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"
                            title="유튜브 모범연주 보기"
                          >
                            <Video size={24} /> {/* 유튜브 아이콘 출력 */}
                          </a>
                        )}
                      {/* 삭제 버튼을 누르면 해당 곡의 고유 id를 전달하며 handleDeleteSong 함수 시행*/}
                      <button
                        onClick={() => handleDeleteSong(song.id)}
                        className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title="곡 삭제"
                        >
                          <Trash2 size={18} />
                        </button>
                    </div>
                    </div>
                  ))
                )}
            </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}