import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getCoordsFromAddress } from "./locationUtils";

const API_KEY = process.env.REACT_APP_Tmap_API_KEY;

// 평균 속도 기반 혼잡도 추정 (0~4)
function estimateCongestionFromAvgSpeed(avgSpeed) {
  if (avgSpeed >= 60) return 0; // 매우 원활
  if (avgSpeed >= 40) return 1; // 원활
  if (avgSpeed >= 25) return 2; // 보통
  if (avgSpeed >= 10) return 3; // 혼잡
  return 4;                     // 매우 혼잡
}

// Tmap 경로 요청 → 혼잡도 계산 → Firestore 저장
export async function fetchAndSaveTrafficData(userId, originAddress, destAddress) {
  try {
    const origin = await getCoordsFromAddress(originAddress);
    const dest = await getCoordsFromAddress(destAddress);
    if (!origin || !dest) throw new Error("좌표 변환 실패");

    const url = "https://apis.openapi.sk.com/tmap/routes?version=1";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        appKey: API_KEY,
      },
      body: JSON.stringify({
        startX: origin.longitude,
        startY: origin.latitude,
        endX: dest.longitude,
        endY: dest.latitude,
        reqCoordType: "WGS84GEO",
        resCoordType: "WGS84GEO",
        startName: "출발지",
        endName: "도착지",
        searchOption: "0",
        trafficInfo: "Y",
      }),
    });

    const data = await response.json();
    // console.log("[📦 Tmap 응답 데이터]", data);

    const summary = data.features?.[0]?.properties;
    if (!summary) throw new Error("요약 정보 없음");

    const duration = summary.totalTime;       // 초
    const distance_m = summary.totalDistance; // m
    const speed = duration > 0 ? (distance_m / duration) * 3.6 : 0; // km/h

    const congested = estimateCongestionFromAvgSpeed(speed);

    const trafficData = {
      duration,
      distance_m,
      speed,
      congested,
    };

    await saveTrafficData(userId, trafficData);

  } catch (err) {
    console.error("[❌ Tmap fetch 실패]", err);
  }
}

// Firestore 저장
export async function saveTrafficData(userId, trafficData) {
  try {
    const db = getFirestore();
    await setDoc(doc(db, "survey", userId), { ...trafficData }, { merge: true });
    // console.log(`[✅ Firestore 저장 완료] ${userId}`, trafficData);
  } catch (err) {
    console.error("[❌ Firestore 저장 실패]", err);
  }
}
