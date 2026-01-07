# GandangGandang 간당간당

<div align="center">
  <img src="https://github.com/hei-sso/Gandang/blob/main/src/assets/logo.png" alt="GandangGandang Logo" width="300" />
</div>
<br>

## 개요
간당간당은 학생들의 학교 지각 가능성을 예측하는 웹 애플리케이션입니다.
과거 지각 횟수, 날씨 정보, 기타 외부 요인 등을 활용하여 학생들의 시간 관리 및 출석 개선을 돕습니다.

## 주요 기능
- TensorFlow 기반 AI 모델로 학생 지각 예측
- 날씨(OpenWeatherMap API) 및 교통(Kakao API, TMAP API) 데이터 통합
- Firestore를 통한 데이터 저장 및 관리
- 직관적인 웹 인터페이스

## 배포
[간당간당 웹사이트 바로가기](https://gandang-8low.web.app/)

## Developer Notes (참고용)
> 개발 중 기록해둔 명령어 모음

### npm 명령어 모음
```bash
npm start                      # 개발 모드에서 앱 실행
npm run build                  # 프로덕션용 빌드
npm install firebase           # Firebase 설치
npm install -g firebase-tools  # Firebase 명령줄 도구(CLI Tools)를 설치(global)
```

### firebase 명령어 모음
```bash
firebase login                   # Firebase 로그인
firebase init                    # 프로젝트 초기화
firebase deploy --only hosting   # Hosting만 배포
firebase deploy --only database  # Database만 배포
firebase deploy                  # 전체 배포
```
