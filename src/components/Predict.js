import React, { useRef } from 'react';

function Predict() {
  // 첫 번째 주소
  const postcodeRef1 = useRef(null);
  const addressRef1 = useRef(null);
  const detailAddressRef1 = useRef(null);
  const extraAddressRef1 = useRef(null);

  // 두 번째 주소
  const postcodeRef2 = useRef(null);
  const addressRef2 = useRef(null);
  const detailAddressRef2 = useRef(null);
  const extraAddressRef2 = useRef(null);

  const handlePostcode = (postcodeRef, addressRef, detailAddressRef, extraAddressRef) => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data) {
          let addr = '';
          let extraAddr = '';

          if (data.userSelectedType === 'R') {
            addr = data.roadAddress;
          } else {
            addr = data.jibunAddress;
          }

          if (data.userSelectedType === 'R') {
            if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
              extraAddr += data.bname;
            }
            if (data.buildingName !== '' && data.apartment === 'Y') {
              extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            if (extraAddr !== '') {
              extraAddr = ' (' + extraAddr + ')';
            }
            extraAddressRef.current.value = extraAddr;
          } else {
            extraAddressRef.current.value = '';
          }

          postcodeRef.current.value = data.zonecode;
          addressRef.current.value = addr;
          detailAddressRef.current.focus();
        }
      }).open();
    } else {
      alert("Daum 우편번호 서비스 로드 오류");
    }
  };

  return (
    <div className="container">
      <h2>지각 예측을 위한 정보를 입력해주세요</h2>

      {/* 거주지 및 출발지 주소 입력 */}
      <div>
        <h4>현재 거주지 및 출발지 주소</h4>
        <input type="text" ref={postcodeRef1} placeholder="우편번호" readOnly />
        <button onClick={() => handlePostcode(postcodeRef1, addressRef1, detailAddressRef1, extraAddressRef1)}>우편번호 찾기</button>
        <br />
        <input type="text" ref={addressRef1} placeholder="주소" readOnly /><br />
        <input type="text" ref={detailAddressRef1} placeholder="상세주소" /><br />
        <input type="text" ref={extraAddressRef1} placeholder="참고항목" readOnly />
      </div>

      <br />

      {/* 학교 및 회사 주소 입력 */}
      <div>
        <h4>학교 및 회사 주소</h4>
        <input type="text" ref={postcodeRef2} placeholder="우편번호" readOnly />
        <button onClick={() => handlePostcode(postcodeRef2, addressRef2, detailAddressRef2, extraAddressRef2)}>우편번호 찾기</button>
        <br />
        <input type="text" ref={addressRef2} placeholder="주소" readOnly /><br />
        <input type="text" ref={detailAddressRef2} placeholder="상세주소" /><br />
        <input type="text" ref={extraAddressRef2} placeholder="참고항목" readOnly />
      </div>

      <br />
      <button className="button">예측 시작</button>
    </div>
  );
}

export default Predict;