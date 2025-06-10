import React, { useState } from 'react';
import Modal from './Modal'; // Modal 컴포넌트 import

// Firestore 관련 코드
//import { db } from './firebase'; // 실제 연동 시 Firebase import 해야함
//import { doc, getDoc, setDoc } from '.firebase/firestore';

function Predict() {
  // 설문조사 상태
  const [survey, setSurvey] = useState({
    location_user: '',
    location_school: '',
    transport_mode: '',
    semester_elective: '0',
    semester_major: '0',
    first_class_by_day: '',
    num_late_arrivals: '',
    avg_sleep_duration: '',
    has_part_time: '',
    part_time_affects: '',
  });

  const [firstClassByDay, setFirstClassByDay] = useState({
    mon: '',
    tue: '',
    wed: '',
    thur: '',
    fri: '',
  });

  // 고유 ID 생성 및 중복 방지
  const [uniqueId, setUniqueId] = useState(null); // 고유 ID 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal 상태
  const [modalType, setModalType] = useState(''); // 'fetch' 또는 'save'에 따라 다른 팝업 띄우기

  // Firestore에서 데이터 불러오기
  const fetchData = async (id) => {
    // 주석으로 firestore 연동 코드 추가
    // const docRef = doc(db, 'surveys', id);
    // const docSnap = await getDoc(docRef);
    // if (docSnap.exists()) {
    //   setSurvey(docSnap.data());
    alert(`고유 ID ${id}의 데이터를 불러왔습니다.`);
    // } else {
    //   alert('ID에 해당하는 데이터가 없습니다.');
    // }
  };

  // Firestore에 데이터 저장
  const saveData = async () => {
    // 주석으로 firestore 연동 코드 추가
    // await setDoc(doc(db, 'surveys', uniqueId), survey);
  };

  // Modal에서 확인 버튼 클릭 시
  const handleModalConfirm = async (id) => {
    setIsModalOpen(false);

    if (modalType === 'fetch') {
      await fetchData(id); // 고유 ID로 데이터 불러오기
    } else if (modalType === 'save') {
      generateUniqueId(); // 팝업에서 확인 클릭 시 고유 ID 생성
      alert(`설문 데이터가 고유 ID ${id}로 저장되었습니다.\n현재 이 팝업을 캡처하여 고유 ID를 보관하여 주십시오.`); // 알림 한 번만 띄움
      await saveData(id); // 데이터 저장
    }
  };

  // Modal 열기
  const openModal = (type) => {
    setModalType(type); // 'fetch' 또는 'save'
    setIsModalOpen(true);
  };

  // Modal 닫기
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // 고유 ID 생성 함수
  const generateUniqueId = () => {
    const id = (Date.now() + Math.random().toString(36).substring(2, 12)).slice(0, 10);
    setUniqueId(id);
  };

  // 우편번호 찾기
  const handlePostcode = (setSurveyField) => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data) {
          let addr = '';
          if (data.userSelectedType === 'R') {
            addr = data.roadAddress;
          } else {
            addr = data.jibunAddress;
          }
          setSurveyField(addr);
        },
      }).open();
    } else {
      alert('Daum 우편번호 서비스 로드 오류');
    }
  };

  // 입력 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSurvey((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 첫 수업 교시 입력 변경 핸들러
  const handleFirstClassChange = (e) => {
    const { name, value } = e.target;
    setFirstClassByDay((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 고유 ID가 없으면 알림 띄우고, 저장 버튼을 눌러 ID를 생성하도록 유도
    if (!uniqueId) {
      alert('고유 ID가 생성되지 않았습니다. 저장 버튼을 눌러주세요.');
      return; // 예측 시작을 하지 않음
    }
    // 고유 ID가 있으면 예측 진행
    alert(`예측이 시작됩니다. 고유 ID: ${uniqueId}`);
  };

  // 인라인 스타일
  const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '2rem',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: '1rem',
  };

  const sectionStyle = {
    flex: 1,
    minWidth: 350,
  };

  const labelStyle = { fontWeight: 'bold', marginTop: '1rem', display: 'block' };
  const selectStyle = { width: '100%', padding: '6px', marginTop: '6px' };
  const inputStyle = { width: '100%', padding: '6px', marginTop: '6px' };
  const buttonStyle = {
    marginTop: 20,
    padding: '12px 24px',
    fontSize: 16,
    backgroundColor: '#424242', // 불러오기, 예측 시작 버튼 색상 여기 있다!!!!!!!!!!!!!!!!!!!!!!!!!!!
    color: 'white',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 1000, margin: '0 auto' }}>
      <h2>지각 예측을 위한 정보를 입력해 주세요.</h2>

      {/* 상단 버튼 영역 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={() => openModal('fetch')} // "정보 불러오기" 팝업
          style={buttonStyle}
        >
          정보 불러오기
        </button>
        <button
          type="button"
          onClick={() => {
            openModal('save'); // 저장 팝업 열기
          }}
          style={{
            ...buttonStyle,
            backgroundColor: '#d62e25', // 저장 버튼 색상 여기 있음!!!!!!!!!!!!!!!!
          }}
        >
          저장
        </button>
      </div>

      <div style={containerStyle}>
        {/* 왼쪽 섹션: 위치 정보 및 설문 항목 */}
        <section style={sectionStyle}>
          {/* 현재 거주지 위치 */}
          <label style={labelStyle}>현재 거주지 위치</label>
          <input type="text" value={survey.location_user} readOnly style={inputStyle} />
          <button
            type="button"
            onClick={() => handlePostcode((addr) => setSurvey((prev) => ({ ...prev, location_user: addr })))}
            style={{ marginTop: 6 }}
          >
            우편번호 찾기
          </button>

          {/* 학교 위치 */}
          <label style={labelStyle}>학교 위치</label>
          <input type="text" value={survey.location_school} readOnly style={inputStyle} />
          <button
            type="button"
            onClick={() => handlePostcode((addr) => setSurvey((prev) => ({ ...prev, location_school: addr })))}
            style={{ marginTop: 6 }}
          >
            우편번호 찾기
          </button>

          {/* 등교 시 이용하는 교통수단 */}
          <label style={labelStyle}>등교 시 이용하는 교통수단</label>
          <select name="transport_mode" value={survey.transport_mode} onChange={handleChange} style={selectStyle} required>
            <option value="">선택해 주세요</option>
            <option value="0">도보</option>
            <option value="1">자차(오토바이, 자동차)</option>
            <option value="2">자전거</option>
            <option value="3">대중교통(셔틀버스 포함)</option>
          </select>

          {/* 현재 수강 중인 교양 과목 수 */}
          <label style={labelStyle}>현재 수강 중인 교양 과목 수</label>
          <select name="semester_elective" value={survey.semester_elective} onChange={handleChange} style={selectStyle}>
            {[...Array(11).keys()].map((n) => (
              <option key={n} value={n}>
                {n}개
              </option>
            ))}
          </select>

          {/* 현재 수강 중인 전공 과목 수 */}
          <label style={labelStyle}>현재 수강 중인 전공 과목 수</label>
          <select name="semester_major" value={survey.semester_major} onChange={handleChange} style={selectStyle}>
            {[...Array(11).keys()].map((n) => (
              <option key={n} value={n}>
                {n}개
              </option>
            ))}
          </select>
        </section>

        {/* 오른쪽 섹션 */}
        <section style={sectionStyle}>
           {/* 요일 별 첫 수업 교시 (표) */}
          <div style={{ marginTop: '1rem' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 6 }}>요일 별 첫 수업 교시</label>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['월', '화', '수', '목', '금'].map((day, i) => (
                    <th
                      key={i}
                      style={{
                        border: '1px solid #ccc',
                        padding: '6px',
                        backgroundColor: '#f5f5f5',
                      }}
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {['mon', 'tue', 'wed', 'thur', 'fri'].map((key) => (
                    <td key={key} style={{ border: '1px solid #ccc', padding: '6px', textAlign: 'center' }}>
                      <select
                        value={firstClassByDay[key]}
                        onChange={(e) =>
                          setFirstClassByDay((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        style={{ width: '100%', padding: '4px' }}
                      >
                        <option value="">선택</option>
                        <option value="0">공강</option>
                        {[...Array(9).keys()].map((n) => (
                          <option key={n + 1} value={n + 1}>
                            {n + 1}교시
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <label style={labelStyle}>직전 학기 총 지각 횟수</label>
          <select name="num_late_arrivals" value={survey.num_late_arrivals} onChange={handleChange} style={selectStyle} required>
            <option value="">선택해 주세요</option>
            <option value="0">0회</option>
            <option value="1">1~4회</option>
            <option value="2">5~8회</option>
            <option value="3">9~12회</option>
            <option value="4">13~16회</option>
            <option value="5">17~20회</option>
            <option value="6">21회 이상</option>
          </select>

          <label style={labelStyle}>평균 수면 시간</label>
          <select name="avg_sleep_duration" value={survey.avg_sleep_duration} onChange={handleChange} style={selectStyle} required>
            <option value="">선택해 주세요</option>
            <option value="2">2~4시간</option>
            <option value="4">4~6시간</option>
            <option value="6">6~8시간</option>
            <option value="8">8~10시간</option>
            <option value="10">10시간 이상</option>
          </select>

          <label style={labelStyle}>현재 알바를 하십니까?</label>
          <select name="has_part_time" value={survey.has_part_time} onChange={handleChange} style={selectStyle} required>
            <option value="">선택해 주세요</option>
            <option value="1">예</option>
            <option value="0">아니오</option>
          </select>

          <label style={labelStyle}>알바가 본인의 지각에 영향을 미친다고 생각하십니까?</label>
          <select name="part_time_affects" value={survey.part_time_affects} onChange={handleChange} style={selectStyle} required>
            <option value="">선택해 주세요</option>
            <option value="1">예</option>
            <option value="0">아니오</option>
          </select>
        </section>
      </div>

      {/* 예측 시작 버튼 */}
      <button type="submit" style={buttonStyle}>
        예측 시작
      </button>

      {/* Modal 컴포넌트 */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        modalType={modalType} // modalType에 따라 다른 팝업 띄우기
        title={modalType === 'fetch' ? '데이터 불러오기' : '데이터 저장'}
        message={
          modalType === 'fetch'
            ? '고유 ID를 입력하여 설문 데이터를 불러올 수 있습니다.'
            : '데이터를 저장하시겠습니까?'
        }
        uniqueId={uniqueId}
        setUniqueId={setUniqueId}
      />
    </form>
  );
}

export default Predict;
