import { getCoordsFromAddress } from './locationUtils';

export async function getDistanceFromKakao(origin, destination) {
  const REST_API_KEY = "Kakao_API_키 입력";

  try {
    // 주소 → 좌표 변환
    const originCoord = await getCoordsFromAddress(origin);
    const destinationCoord = await getCoordsFromAddress(destination);

    if (!originCoord || !destinationCoord) {
      throw new Error("좌표 변환 실패");
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
      console.error("[길찾기 API 오류]", response.status, response.statusText);
      return null;
    }

    const data = await response.json();

    const distanceMeters = data.routes?.[0]?.summary?.distance;

    if (!distanceMeters) {
      console.error("[길찾기 응답 오류] distance 없음");
      return null;
    }

    // 거리 km로 변환
    return (distanceMeters / 1000).toFixed(2);
  } catch (error) {
    console.error("[길찾기 거리 계산 실패]", error.message);
    return null;
  }
}
