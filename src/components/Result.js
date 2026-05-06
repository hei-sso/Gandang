import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const { userId, probability, predictedClass, congested: stateCongested, duration: stateDuration } = location.state || {};

  const [congested, setCongested] = useState(stateCongested ?? null);
  const [duration, setDuration] = useState(stateDuration ?? null);

  useEffect(() => {
    // fallback: state에 없으면 Firestore에서 다시 가져옴
    const fetchAdditionalData = async () => {
      if (userId && (congested === null || duration === null)) {
        try {
          const db = getFirestore();
          const ref = doc(db, 'survey', userId);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const data = snap.data();
            if (congested === null) setCongested(typeof data.congested === 'number' ? data.congested : 0);
            if (duration === null) setDuration(typeof data.duration === 'number' ? data.duration : null);
          }
        } catch (err) {
          console.error('추가 데이터 불러오기 실패:', err);
        }
      }
    };
    fetchAdditionalData();
  }, [userId, congested, duration]);

  if (probability === undefined || congested === null) {
    return <p>결과를 불러오는 중입니다...</p>;
  }

  const percentage = (probability * 100).toFixed(2);
  const congestionLabels = ['매우 원활', '원활', '보통', '혼잡', '매우 혼잡'];
  const validCongested = congested >= 0 && congested <= 4 ? congested : 0;
  const congestionPercent = (validCongested / 4) * 100;
  const durationMinutes = duration !== null ? Math.round(duration / 60) : null;
  const isLate = (probability >= 0.5); // 50% 이상일 때 글씨 빨간색

  return (
    <div style={{ padding: '2rem', maxWidth: 600, margin: 'auto' }}>
      <h1>지각 확률</h1>
      <h2 style={{ color: isLate ? 'red' : 'green', fontWeight: 'bold' }}>
        {percentage}%
      </h2>

      <div style={{ margin: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: 8, textAlign: 'center' }}>
          <strong>
            혼잡도: {congestionLabels[validCongested]} / 예상 소요시간:{' '}
            {durationMinutes !== null ? `${durationMinutes}분` : '정보 없음'}
          </strong>
        </div>
        <br />
        <div style={{
          height: 30,
          width: 400,
          borderRadius: 20,
          background: 'linear-gradient(to right, #4caf50, #ffeb3b, #f44336)',
          position: 'relative',
        }}>
          {[1, 2, 3, 4].map((pos) => (
            <div
              key={pos}
              style={{
                position: 'absolute',
                top: 0,
                left: `${(pos / 5) * 100}%`,
                width: 2,
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.15)',
                transform: 'translateX(-1px)',
              }}
            />
          ))}
          <div
            style={{
              position: 'absolute',
              top: -27,
              left: `calc(${congestionPercent}% - 8px)`,
              fontSize: 20,
              color: '#000',
              userSelect: 'none',
            }}
          >
            ▼
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate('/predict')}  // 여기를 수정
        style={{
          marginTop: 20,
          padding: '12px 24px',
          fontSize: 16,
          backgroundColor: '#424242',
          color: 'white',
          border: 'none',
          borderRadius: 5,
          cursor: 'pointer',
        }}
      >
        다시 예측하기
      </button>
    </div>
  );
}

export default Result;
