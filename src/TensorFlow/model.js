import { getFirestore, doc, getDoc } from 'firebase/firestore';
import * as tf from '@tensorflow/tfjs';

const bestThreshold = 0.25;

// 학습 시 사용된 스케일링 기준 값
const distanceMin = 0.0;
const distanceMax = 100.0;

const tempMean = 27.61;
const tempStd = 16.88;

export async function predictWithSurvey(userId) {
  try {
    console.log(`[예측 시작] 사용자 ID: ${userId}`);

    const db = getFirestore();
    const ref = doc(db, 'survey', userId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      throw new Error('해당 사용자 데이터가 존재하지 않습니다.');
    }

    const survey = snap.data();
    console.log('가져온 사용자 데이터:', survey);

    // One-hot 인코딩 함수
    function oneHotDropFirst(val, depth) {
      const vec = new Array(depth - 1).fill(0);
      if (val == null || val < 0) {
        // unknown 처리 필요하면 여기에
      } else if (val > 0 && val < depth) {
        vec[val - 1] = 1;  // 0번째 카테고리 drop
      }
      // val === 0 이면 모두 0 (첫 카테고리)
      return vec;
    }

    // 스케일링 처리
    const distanceScaled = Math.max(0, Math.min(1, (survey.distance_km - distanceMin) / (distanceMax - distanceMin)));
    const temperatureScaled = (survey.temperature - tempMean) / tempStd;

    // 모델 입력 벡터 구성
    const features = [
      survey.avg_sleep_duration || 0,
      survey.congested ?? 0,
      distanceScaled,
      survey.first_class_mon ? 1 : 0,
      survey.first_class_tue ? 1 : 0,
      survey.first_class_wed ? 1 : 0,
      survey.first_class_thur ? 1 : 0,
      survey.first_class_fri ? 1 : 0,
      survey.has_part_time ? 1 : 0,
      survey.part_time_affects ? 1 : 0,
      survey.semester_elective || 0,
      survey.semester_major || 0,
      temperatureScaled,
      ...oneHotDropFirst(survey.transport_mode, 4),  // 3개 벡터
      ...oneHotDropFirst(survey.weather, 5),          // 4개 벡터
    ];

    console.log('모델 입력 벡터:', features);

    const model = await tf.loadGraphModel('/tfjs_model/model.json');
    console.log('모델 로드 완료');

    const inputTensor = tf.tensor2d([features]); // (1, 20)
    const output = model.predict(inputTensor);  // 단일 텐서 그대로 전달
    const predictionProb = (await output.data())[0];

    inputTensor.dispose();
    output.dispose();

    console.log(`예측 확률: ${predictionProb}`);

    const isLate = predictionProb >= bestThreshold;
    console.log(`결과: ${isLate ? '지각 예상' : '정상 도착 예상'} (threshold: ${bestThreshold})`);

    return {
      probability: predictionProb,
      predictedClass: isLate ? 1 : 0,
      congested: survey.congested,
      distance_km: survey.distance_km,
    };
  } catch (err) {
    console.error('[예측 실패]', err);
    throw err;
  }
}
