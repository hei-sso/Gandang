<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=wave&color=F0A39D&section=header&text=간당간당&fontColor=000000&animation=fadaIn"/>
</div>
<br>

## `npm 명령어 모음`

### `npm start`

개발 모드에서 앱을 실행시킵니다.\
[http://localhost:3000](http://localhost:3000)로 브라우저에서 열립니다.

변경을 하면 페이지가 새로 고쳐집니다.\
또한 콘솔에서 오류를 확인할 수 있습니다.

### `npm run build`

앱을 build 폴더에 프로덕션 용도로 빌드합니다.\
React가 프로덕션 모드로 올바르게 번들링되고, 최상의 성능을 위해 빌드가 최적화됩니다.

빌드는 최소화(minify) 되어 있으며, 파일 이름에는 해시값이 포함됩니다.\
자세한 내용은 배포 관련 문서[deployment](https://facebook.github.io/create-react-app/docs/deployment)를 참고하세요.

### `npm install firebase`

Firebase를 설치합니다.

### `npm install -g firebase-tools`

Firebase 명령줄 도구(CLI Tools)를 설치(global)합니다.

## `firebase 명령어 모음`

### `firebase login`

Firebase에 로그인합니다.\
Firebase CLI를 사용하기 위해 Google 계정으로 인증을 수행합니다.\
로그인 후 현재 계정이 연결된 Firebase 프로젝트에 접근할 수 있게 됩니다.

### `firebase init`

Firebase CLI를 초기화하고 프로젝트를 설정합니다.\
Hosting, Firestore, Authentication, Functions 등 원하는 Firebase 서비스들을 선택하여 프로젝트에 연결할 수 있습니다.\
초기화 후 .firebaserc, firebase.json 등의 설정 파일이 생성됩니다.

### `firebase deploy --only hosting`

Firebase Hosting만 선택적으로 배포합니다.\
앱 전체가 아닌 정적 웹 자산(HTML, CSS, JS 등) 만 배포할 때 사용합니다.\
프론트엔드 코드만 바뀐 경우 빠르게 업데이트할 수 있으며, 콘솔에 미리보기(previews) URL도 제공됩니다.

### `firebase deploy --only database`

Firestore의 규칙/데이터만 배포합니다.\
보안 규칙 또는 초기 데이터 세팅을 업데이트할 때 사용되며, 다른 서비스(Hosting 등)는 건드리지 않습니다.

### `firebase deploy`

build 폴더 안의 정적 파일들을 Firebase에 업로드합니다.\
업로드 후, 누구나 접속할 수 있는 웹사이트로 호스팅됩니다.

성공적으로 배포되면, 명령어 실행 후 배포된 URL이 콘솔에 출력됩니다.\
이제 실제 사용자가 브라우저에서 앱을 사용할 수 있습니다!
