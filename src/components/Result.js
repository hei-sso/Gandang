import React, { useEffect, useState } from 'react';

function Result() {
  const [probability, setProbability] = useState(null);

  useEffect(() => {
    // 랜덤 데이터 생성
    const randomProbability = Math.random(); // 0~1 사이의 무작위 확률
    setProbability(randomProbability);
  }, []);

  if (probability === null) {
    return <p>로딩 중...</p>; // 상태 초기화 전 표시
  }

  const percentage = (probability * 100).toFixed(2);

  const buttonStyle = {
    marginTop: 20,
    padding: '12px 24px',
    fontSize: 16,
    backgroundColor: '#424242', // 다시 예측하기 버튼 색상 여기 있다!!!!!!!!!!!!!!!!!!!!!!!!!!!
    color: 'white',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>지각 확률</h1>
      {probability >= 0.6 ? (
        <h2 style={{ color: 'red', fontWeight: 'bold' }}>{percentage}%</h2>
      ) : (
        <h2 style={{ color: 'green', fontWeight: 'bold' }}>{percentage}%</h2>
      )}
      <button onClick={() => window.location.reload()} style={buttonStyle}>
        다시 예측하기
      </button>
    </div>
  );
}

export default Result;
