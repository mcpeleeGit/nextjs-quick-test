# 카카오톡 롤링페이퍼 공유 테스트

Next.js를 사용한 카카오톡 공유 기능 테스트 프로젝트입니다.

## 기능

- 롤링페이퍼 카카오톡 공유 기능 테스트
- 사용자명과 메시지 수 설정 가능
- 실제 카카오톡 공유 시뮬레이션

## 설치 및 실행

1. 의존성 설치:
```bash
npm install
```

2. 개발 서버 실행:
```bash
npm run dev
```

3. 브라우저에서 `http://localhost:3000` 접속

## 카카오톡 공유 설정

실제 카카오톡 공유를 사용하려면:

1. [카카오 개발자 콘솔](https://developers.kakao.com/)에서 앱 등록
2. JavaScript 키 발급
3. `utils/kakao.ts` 파일의 `YOUR_KAKAO_APP_KEY` 부분을 발급받은 키로 교체

## 프로젝트 구조

```
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── rolling-paper/
│       └── [userName]/
│           └── page.tsx
├── components/
│   └── RollingPaperShare.tsx
├── types/
│   └── kakao.d.ts
├── utils/
│   ├── kakao.ts
│   └── logger.ts
└── public/
    └── bigLog.png
```

## 사용법

1. 메인 페이지에서 사용자명과 메시지 수를 설정
2. "카카오톡으로 공유하기" 버튼 클릭
3. 카카오톡 공유 창이 열림 (카카오 앱 키가 설정된 경우)
