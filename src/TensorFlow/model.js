import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase'; // 파이어베이스 초기화
import * as tf from '@tensorflow/tfjs';

async function predictWithSurvey(uid) {
  // 1. 개인 설문 데이터 로드
  const surveySnap = await getDoc(doc(db, `users/${uid}/survey`));
  if (!surveySnap.exists()) {
    console.error('설문 응답 없음');
    return;
  }
  const survey = surveySnap.data();

  // 2. 입력 벡터 구성 (정제 필요)
  const inputVector = [
    survey.age,
    survey.sleepTime === '2AM' ? 2 : 0, // 문자열 → 숫자 변환
    survey.commuteTime,
    survey.breakfast ? 1 : 0
  ];

  const inputTensor = tf.tensor2d([inputVector]);

  // 3. 모델 로드 및 예측
  const model = await tf.loadLayersModel('/tfjs_model/model.json');
  const prediction = model.predict(inputTensor);
  prediction.print(); // 또는 결과값 반환
}
