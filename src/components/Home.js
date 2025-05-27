import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container">
      <h2>지각... 안 하겠지?😴</h2>
      <p>지각을 예측하고 더 이상 뛰지 마세요.</p>
      <Link to="/predict">
        <button className="button">지각 예측 시작하기</button>
      </Link>
    </div>
  );
}

export default Home;