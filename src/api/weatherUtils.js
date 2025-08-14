import { getCoordsFromAddress } from './locationUtils'; // 주소 → 위도/경도 변환
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const API_KEY = process.env.Visual_Crossing_API_KEY;

/**
 * 사용자의 주소를 기반으로 Visual Crossing API에서 오늘 날씨 및 온도 조회 후 Firestore에 저장
 * @param {string} address - 사용자의 주소 (도로명 주소 또는 지번 주소)
 * @param {string} userId - Firestore에 저장할 문서 ID (고유 ID)
 */
export async function fetchDailyWeatherData(address, userId) {
  try {
    const coords = await getCoordsFromAddress(address);
    if (!coords) throw new Error('주소를 좌표로 변환할 수 없습니다.');

    const location = `${coords.latitude},${coords.longitude}`;
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/today?unitGroup=metric&include=current&key=${API_KEY}&contentType=json`;

    const response = await fetch(url);
    const data = await response.json();

    const current = data.currentConditions;
    const temperature = current?.temp ?? null;
    const condition = current?.conditions ?? null;
    const weather = classifyWeather(condition);

    // Firestore에 저장
    const db = getFirestore();
    await setDoc(
      doc(db, 'survey', userId),
      { temperature, weather },
      { merge: true }
    );

    // console.log(`[Firestore 저장 완료] 사용자 ${userId}`, { temperature, weather });
    return { temperature, weather };
  } catch (error) {
    console.error('[날씨 API 호출 실패]', error);
    return null;
  }
}

/**
 * 문자열 날씨 조건을 숫자 코드로 변환
 * Clear → 0, Cloud → 1, Rain/Thunder → 2, Snow → 3
 * @param {string} condition - Visual Crossing에서 내려주는 날씨 문자열
 * @returns {number} 날씨 코드
 */
function classifyWeather(condition) {
  if (!condition) return -1;

  const lower = condition.toLowerCase();

  if (lower.includes('clear')) return 0; // 맑음
  if (lower.includes('cloud') || lower.includes('overcast')) return 1; // 흐림
  if (lower.includes('rain') || lower.includes('thunder')) return 2; // 비/뇌우
  if (lower.includes('snow')) return 3; // 눈

  return -1; // 분류 불가
}
