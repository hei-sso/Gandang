import React, { useState } from 'react';

// Modal 컴포넌트
function Modal({ isOpen, onClose, onConfirm, modalType, title, message, uniqueId, setUniqueId }) {
  const [inputId, setInputId] = useState(uniqueId || ''); // 고유 ID 상태

  const handleConfirm = () => {
    if (modalType === 'fetch' && inputId.trim() === '') {
      alert('고유 ID를 입력해주세요.');
      return;
    }

    // 확인 버튼의 기능을 modalType에 맞게 분기
    if (modalType === 'fetch') {
      onConfirm(inputId); // 고유 ID로 Firestore에서 데이터 불러오기
    }

    if (modalType === 'save') {
      const newUniqueId = generateUniqueId();
      setUniqueId(newUniqueId); // 고유 ID 생성
      onConfirm(newUniqueId); // Firestore에 데이터 저장
    }

    onClose(); // 팝업 닫기
  };

  const generateUniqueId = () => {
    const id = (Date.now() + Math.random().toString(36).substring(2, 12)).slice(0, 10);
    return id;
  };

  if (!isOpen) return null;

  const renderModalContent = () => {
    switch (modalType) {
      case 'fetch':
        return (
          <>
            <h3>{title}</h3>
            <p>{message}</p>
            <input
              type="text"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              placeholder="고유 ID를 입력해 주세요"
              style={inputStyle}
            />
          </>
        );
      case 'save':
        return (
          <>
            <h3>{title}</h3>
            <p>{message}</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        {renderModalContent()}
        <div style={modalButtonContainer}>
          <button onClick={handleConfirm} style={modalButtonStyle}>
            확인
          </button>
          <button onClick={onClose} style={modalButtonStyle}>취소</button>
        </div>
      </div>
    </div>
  );
}

// 인라인 스타일
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '8px',
  width: '400px',
  textAlign: 'center',
};

const modalButtonContainer = {
  marginTop: '1rem',
};

const modalButtonStyle = {
  padding: '10px 20px',
  margin: '0 10px',
  backgroundColor: '#424242',  //모달 버튼 색상 여기 있음!!!!!!!!!!!!!!!!!
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const inputStyle = {
  padding: '8px',
  width: '100%',
  marginTop: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
};

export default Modal;
