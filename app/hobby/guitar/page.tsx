// 브라우저에서 실행되는 React 기능(버튼 클릭, 데이터 변경)을 사용하겠다고 선언
"use client";
// React에서 화면을 바꾸기 위해 꼭 필요한 useState함수를 가져옴
import { useState } from "react";
// 화면을 꾸며줄 lucide-react 라이브러리 아이콘을 가져옴
import {Music, Plus, Trash2, Video} from "lucide-react";
// 같은 폴더 안에 있는 chart.tsx 파일을 불러옴
import GuitarChart from "./chart";

// Song 타입은 '곡 하나가 어떤 모양의 데이터인지'를 미리 정해두는 역할
// 이렇게 타입을 만들어두면 song.title, song.progress 등을 안전하게 사용가능
type Song = {
    id: number;
    title: string;
    target_bpm: number;
    youtube_url: string;
    progress: number;
};

export default function GuitarPage() {
    // songs는 등록된 곡 목록
    // setSongs는 곡을 추가/삭제/수정할 때 사용하는 함수
    const [songs, setSongs] = useState<Song[]>([
        {
            id: 1,
            title: "Canon Rock",
            target_bpm: 200,
            youtube_url: 'https://www.youtube.com/watch?v=3slG_msTYjk&list=RD3slG_msTYjk&start_radio=1',
            progress:20,
        },
    ]);

    // 아래 state들은 입력폰에 적는 값을 임시로 저장
    const [newTitle, setNewTitle] = useState("");
    const [newBpm, setNewBpm] = useState("");
    const [newUrl, setNewUrl] = useState("");
    const[newProgress, setNewProgress] = useState(0);

    // 곡 추가 버튼을 눌렀을 때 실행된느 함수
    const haldleAddSong = (e:any) => {
        // form은 기본적으로 새로고침을 하려고 하기 때문에 그 동작을 막는다.
        e.preventDefault();

        if(!newTitle) {
            alert("곡 제목을 입력해주세요.");
            return;
        }

        // 입력값들을 모아서 새로운 곡 객체 만들기
        const newSong: Song = {
            id: Date.now(), // 현재 시간을 숫자로 만들어서 id로 사용
            title: newTitle,
            target_bpm: newBpm ? parseInt(newBpm) : 0,
            youtube_url: newUrl,
            progress: newProgress,
        };

        // 기존 songs 배열 뒤에 newSong을 추가
        // ...songs는 기존 배열을 펼쳐서 새로운 배열에 넣는 역할
        setSongs([...songs, newSong]);

        // 곡 추가 후 입력창을 비움
        setNewTitle("");
        setNewBpm("");
        setNewUrl("");
        setNewProgress(0); // 추가가 완료되면 드롭다운 선택창도 다시 0%로 초기화
    };

    // 특정 곡을 삭제하는 함수
    const handleDeleteSong = (id: number) => {
        // filter 함수는 조건에 맞는 데이터만 남기는 기능
        // '내가 클릭한 곡의 id가 아닌 것들만 남겨라' -> 즉 클릭한 곡만 목록에 보여주기
        setSongs(songs.filter((song) => song.id !== id));
    }

    // 특정 곡의 진행도를 바꾸는 함수
    const handleUpdateProgress = (id: number, newProgressValue: number) => {
        setSongs(
            songs.map((song) => 
                song.id === id ? {...song, progress: newProgressValue} : song
        )
        )
    };

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <header>
                    <h1 className="text-3xl font-bold flex items-baseline gap-2">
                        <Music className="text-red-500"/>
                        기타 연습 기록
                    </h1>
                    <p className="text-gray-500 mt-2">
                        연습곡, 목표 BPM, 진행도를 관리
                    </p>
                </header>

                {/* 곡을 추가하는 입력 폼 */}
                <form
                    // onSubmit 이벤트는 form이 제출될 때 실행되는 함수
                    onSubmit={haldleAddSong}
                    className="bg-white p-4 rounded-xl border grid grid-cols-1 md:grid-cols-5 gap-3 items-end"
                >   {/* 곡 제목 입력창 */}
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)} // 입력창에 보여줄 실제 값을 newTitle 상자 안의 텍스트임
                        placeholder="곡 제목"
                        className="w-full p-2 border rounded-lg text-sm bg-white"/>

                    {/* 목표 BPM 입력창 */}
                    <input
                        type="number"
                        value={newBpm}
                        onChange={(e) => setNewBpm(e.target.value)}
                        placeholder="목표 BPM"
                        className="w-full p-2 border rounded-lg text-sm bg-white"/>

                    {/* 유튜브 URL 입력창 */}
                    <input
                        type="text"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        placeholder="유튜브 URL"
                        className="w-full p-2 border rounded-lg text-sm bg-white"/>

                    {/* 진행도 선택창 */}
                    <select
                        value={newProgress}
                        onChange={(e) => setNewProgress(Number(e.target.value))}
                        className="w-full p-2 border rounded-lg text-sm bg-white"
                    >
                        <option value="0">0% (시작)</option>
                        <option value="20">20% (인트로)</option>
                        <option value="40">40% (전반부)</option>
                        <option value="50">50% (절반 완수)</option>
                        <option value="60">60% (후반부)</option>
                        <option value="80">80% (솔로/종반)</option>
                        <option value="100">100% (완곡!)</option>
                    </select>

                    <button
                        type="submit"
                        className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors"
                        >
                            <Plus size={16}/>
                            곡 추가
                        </button>
                </form>

                {/* 차트 컴포넌트는 따로 분리해서 불러오기 */}
                <GuitarChart />

                {/* 곡 목록을 보여주는 영역 */}
                <section className="space-y-3">
                    <h2 className="font-semibold text-gray-600 text-sm">
                        연습 레퍼토리 목록 ({songs.length}곡)
                    </h2>

                    {songs.map((song) => (
                        <div
                            key={song.id}
                            className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-all"
                        >
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800">{song.title}</h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        목표 BPM: <span className="font-semibold text-red-500">{song.target_bpm} BPM</span>
                                    </p>

                                    <select
                                        value={song.progress}
                                        onChange={(e) =>
                                            handleUpdateProgress(song.id, Number(e.target.value))
                                        }
                                        className="text-xs font-bold rounded-full px-2.5 py-1 bg-gray-100 mt-2"
                                    >
                                        <option value="0">0% (시작)</option>
                                        <option value="20">20% (인트로)</option>
                                        <option value="40">40% (전반부)</option>
                                        <option value="50">50% (절반 완수)</option>
                                        <option value="60">60% (후반부)</option>
                                        <option value="80">80% (솔로/종반)</option>
                                        <option value="100">100% 🎉</option>
                                    </select>

                                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-3">
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
                        </div>
                    ))}
                </section>
            </div>
        </main>
    )

}