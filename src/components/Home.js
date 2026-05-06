import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  // 1. 랜덤 문구 배열
  const messages = [
    "지각... 안 하겠지?😴",
    "오늘은 제발 늦지 마🙏",
    "지각 멈춰~!🚫",
    "또 늦어?⏰",
    "아들아, 학교 가야지!📚",
    "딸~ 학교 가야지!📚"
  ];

  // 2. 랜덤 문구 선택
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{randomMessage}</h2>
      <p>지각을 예측하고 더 이상 뛰지 마세요.</p>
      <Link to="/predict">
        <button className="button">지각 예측 시작하기</button>
      </Link>
    </div>
  );
}

export default Home;
