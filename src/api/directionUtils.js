import { getCoordsFromAddress } from './locationUtils';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export async function getDistanceFromSurvey(userId) {
  const REST_API_KEY = process.env.REACT_APP_Kakao_API_KEY;
  const docRef = doc(db, "survey", userId);

  try {
    // 사용자 문서 가져오기
    const surveySnap = await getDoc(docRef);
    if (!surveySnap.exists()) {
      console.error(`[Firestore 오류] survey 컬렉션에 '${userId}' 문서(ID) 없음`);
      return null;
    }

    const data = surveySnap.data();
    const origin = data.location_user;
    const destination = data.location_school;

    if (!origin || !destination) {
      console.error(`[데이터 오류] 문서 '${userId}'에 'location_user' 또는 'location_school' 필드가 존재하지 않거나 값이 비어 있습니다.`);
      return null;
    }

    // 주소 → 좌표 변환
    const originCoord = await getCoordsFromAddress(origin);
    const destinationCoord = await getCoordsFromAddress(destination);

    if (!originCoord || !destinationCoord) {
      console.error(`[좌표 변환 실패] 주소 → 좌표 변환에 실패했습니다. 원본 주소: 사용자='${origin}', 학교='${destination}'`);
      return null;
    }

    // Kakao 길찾기 API 요청
    const url = `https://apis-navi.kakaomobility.com/v1/directions?origin=${originCoord.longitude},${originCoord.latitude}&destination=${destinationCoord.longitude},${destinationCoord.latitude}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: REST_API_KEY,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      console.error(`[Kakao 길찾기 API 오류] 상태 코드: ${response.status} ${response.statusText}`);
      return null;
    }

    const kakaoData = await response.json();
    const distanceMeters = kakaoData.routes?.[0]?.summary?.distance;

    if (!distanceMeters) {
      console.error(`[길찾기 응답 오류] Kakao 응답에서 'distance' 정보가 없습니다.`);
      return null;
    }

    const distance_km = parseFloat((distanceMeters / 1000).toFixed(2));

    // 🔥 사용자 문서에 distance_km 필드로 저장
    await updateDoc(docRef, {
      distance_km
    });

    // console.log(`[성공] 사용자 '${userId}'의 거리 ${distance_km}km를 Firestore에 저장했습니다.`);
    return distance_km;
  } catch (error) {
    console.error(`[예외 발생] 거리 계산 중 에러 발생: ${error.message}`);
    return null;
  }
}
