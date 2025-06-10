import { getCoordsFromAddress } from './locationUtils';
import { convertAddressToGridXY } from './gridUtils';

const SERVICE_KEY = '기상청_API_키'; // 실 서비스키로 바꿔주세요

// ⏰ 현재 시각 기준으로 예보 가능한 시간 계산
function getForecastTime() {
  const now = new Date();

  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hour = now.getHours();
  const minute = now.getMinutes();

  let baseHour = hour;
  if (minute < 45) baseHour -= 1;
  if (baseHour < 0) {
    baseHour = 23;
    now.setDate(now.getDate() - 1);
  }

  const baseDate = `${yyyy}${mm}${dd}`;
  const baseTime = `${String(baseHour).padStart(2, '0')}30`;

  return { baseDate, baseTime };
}

// ☁️ PTY + SKY → 맑음/흐림/비/눈 분류
function classifyWeather(pty, sky) {
  if (pty === 1 || pty === 2 || pty === 4) return '비';
  if (pty === 3) return '눈';
  if (pty === 0) {
    if (sky === 1) return '맑음';
    return '흐림';
  }
  return '알 수 없음';
}

// 📦 날씨 데이터 가져오기
export async function fetchWeatherData(address) {
  try {
    const coords = await getCoordsFromAddress(address);
    if (!coords) throw new Error('주소 → 좌표 변환 실패');

    const { nx, ny } = convertAddressToGridXY(coords.latitude, coords.longitude);
    const { baseDate, baseTime } = getForecastTime();

    const url = `https://apis.data.go.kr/1360000/VILageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${SERVICE_KEY}&numOfRows=60&pageNo=1&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

    const response = await fetch(url);
    const result = await response.json();

    if (!result.response || result.response.header.resultCode !== "00") {
      console.error('기상청 응답 오류', result.response?.header?.resultMsg);
      return null;
    }

    const items = result.response.body.items.item;

    let temperature = null;
    let pty = null;
    let sky = null;

    for (const item of items) {
      if (item.category === 'T1H') {
        temperature = parseFloat(item.fcstValue);
      } else if (item.category === 'PTY') {
        pty = parseInt(item.fcstValue, 10);
      } else if (item.category === 'SKY') {
        sky = parseInt(item.fcstValue, 10);
      }
    }

    const weatherDesc = classifyWeather(pty, sky);

    return {
      temperature,       // ℃
      weatherCode: pty,  // PTY (0~4)
      skyCode: sky,      // SKY (1~4)
      weatherDesc,       // "맑음", "흐림", "비", "눈"
    };
  } catch (err) {
    console.error('[날씨 데이터 fetch 실패]', err);
    return null;
  }
}
