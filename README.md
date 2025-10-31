# Next.js GPT Chat

Next.js 14(App Router)와 OpenAI SDK로 구현한 간단한 GPT 웹 채팅입니다.

## 주요 기능

- OpenAI Chat Completions 기반 서버 API (`/api/chat`)
- 홈 화면(`/`)에서 바로 대화 가능한 간단한 채팅 UI

## 빠른 시작

1) 의존성 설치
```bash
npm install
```

2) 환경 변수 설정
프로젝트 루트의 `.env` 파일에 OpenAI API 키를 넣어주세요.
```
OPENAI_API_KEY=sk-...
```

3) 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속 후 곧바로 채팅을 시작할 수 있습니다.

## API

- 엔드포인트: `POST /api/chat`
- 요청 바디 예시
```json
{
  "messages": [
    { "role": "system", "content": "You are a helpful assistant." },
    { "role": "user", "content": "Hello!" }
  ],
  "model": "gpt-4o-mini",
  "temperature": 0.7
}
```
- 응답: OpenAI Chat Completions 원본 응답과 동일 구조(`choices[0].message.content` 사용)

## 폴더 구조

```
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # OpenAI 호출 API
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # 채팅 UI
├── public/
│   └── bigLog.png
├── utils/
│   └── logger.ts
├── types/
│   └── kakao.d.ts            # (이전 실험 잔존 타입, 미사용)
└── package.json
```

## 커스터마이징

- 모델/온도 변경: `app/page.tsx`의 `fetch('/api/chat', { body })` 부분 또는
  서버 `app/api/chat/route.ts`에서 `model`, `temperature` 값을 변경하세요.
- 스트리밍 응답: 필요 시 서버 라우트를 스트리밍 방식으로 변환해 확장 가능합니다.

## 배포

Vercel 배포 시 `Project Settings > Environment Variables`에 `OPENAI_API_KEY`를 등록하세요.
