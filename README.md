# 요구해요

팀과 개발 문서를 한 곳에서, 빠르고 깔끔하게 😎

## 🚀 핵심 목표

* 개발 표준 정의서 관리
* 요구 사항 정의서 관리

## 🛠️ 기술 스택

<p>
  <img src="https://skillicons.dev/icons?i=nuxt,nest,postgresql,redis,nodejs,pnpm,ubuntu" alt="Nuxt, NestJS, PostgreSQL, Redis, Node.js, pnpm, Ubuntu" />
</p>

## 🗂️ 프로젝트 구조

API와 Web을 하나의 모노레포에서 관리해요.

```text
apps/
├── api/    # NestJS API (port 4000)
└── web/    # Nuxt 4 (port 3000)
```

## 📋 시작하기 전에

아래 환경이 필요해요.

* Node.js 18 이상
* pnpm 9

pnpm은 Corepack을 활성화한 뒤 사용해주세요.

```bash
corepack enable
```

## ✨ 시작하기

### 1) 의존성을 설치해요

루트 디렉터리에서 아래 명령어를 실행해주세요.

```bash
pnpm install
```

### 2) 환경변수를 준비해요

`.env.example`을 복사해서 루트에 `.env` 파일을 만들어주세요.

macOS와 Linux에서는 아래 명령어를 사용해요.

```bash
cp .env.example .env
```

Windows에서는 아래 명령어를 사용해주세요.

```bash
copy .env.example .env
```

`.env.example`에는 로컬 개발에 필요한 기본값이 설정되어 있어요.

별도 설정이 필요하지 않다면 그대로 사용할 수 있어요. 환경에 맞게 변경해야 하는 값이 있다면 복사한 `.env`에서 수정해주세요.

### 3) 개발 서버를 실행해요

```bash
pnpm dev
```

API와 Web이 함께 실행돼요.

| 서비스               | URL                          |
| ----------------- | ---------------------------- |
| Web               | `http://localhost:3000`      |
| API               | `http://localhost:4000`      |
| API Docs (Scalar) | `http://localhost:4000/docs` |

API와 Web 로그를 따로 확인하고 싶다면 `api#dev` 또는 `web#dev`를 선택하면 돼요.

## 🔐 환경변수

루트의 `.env` 하나를 API와 Web이 함께 사용해요.

기본 로컬 개발 환경은 아래와 같아요.

```dotenv
# API
API_PORT=4000

# Nuxt
NUXT_PORT=3000
NUXT_PUBLIC_API_BASE=/api
NUXT_API_PROXY_TARGET=http://127.0.0.1:4000
```

각 환경변수는 아래 역할을 해요.

| 변수                      | 설명                 | 기본값                     |
| ----------------------- | ------------------ | ----------------------- |
| `API_PORT`              | NestJS 포트          | `4000`                  |
| `NUXT_PORT`             | Nuxt 개발 서버 포트      | `3000`                  |
| `NUXT_PUBLIC_API_BASE`  | 클라이언트 API Base URL | `/api`                  |
| `NUXT_API_PROXY_TARGET` | Nuxt → API 프록시 대상  | `http://127.0.0.1:4000` |

`.env.example`에는 위 기본값이 들어 있어요.

처음 프로젝트를 실행할 때 `.env`로 복사해서 사용해주세요. 다른 포트나 API 주소가 필요하다면 `.env`에서 원하는 값으로 변경하면 돼요.

## ⌨️ 명령어

자주 사용하는 명령어예요.

```bash
pnpm dev          # 개발 서버 실행
pnpm build        # 전체 빌드
pnpm test         # Unit Test
pnpm test:e2e     # E2E Test
pnpm lint         # ESLint
pnpm format       # Prettier
```

필요하다면 API와 Web을 따로 실행할 수도 있어요.

```bash
pnpm --filter api dev
pnpm --filter web dev
```

## ⚙️ API

API는 NestJS로 구성되어 있어요.

```text
src/
├── controllers/
├── services/
├── modules/
└── config/       # OpenAPI, Scalar UI
```

기본 설정은 아래와 같아요.

* TypeScript는 `commonjs`와 `moduleResolution: node`를 사용해요.
* 환경변수는 `@nestjs/config`를 통해 루트의 `../../.env`를 불러와요.
* API 문서는 Scalar UI로 제공해요.
* 개발 서버를 실행한 뒤 `/docs`에서 API 문서를 확인할 수 있어요.

NestJS의 프로젝트 설정에 맞춰 `commonjs`와 `moduleResolution: node`를 사용해주세요.

## 🌐 Web

Web은 Nuxt 4로 구성되어 있어요.

개발 환경에서는 `/api/**` 요청을 NestJS로 프록시해요.

덕분에 로컬 개발에서는 별도의 CORS 설정 없이 API를 호출할 수 있어요.

루트의 `.env`는 아래 방식으로 불러와요.

```bash
nuxt dev --dotenv ../../.env
```

API를 호출할 때는 URL을 직접 작성하지 않고 Runtime Config의 `apiBase`를 사용해주세요.

```ts
const {
  public: { apiBase },
} = useRuntimeConfig()

await $fetch(`${apiBase}/`)
```

환경에 따라 API 주소가 달라져도 애플리케이션 코드를 수정하지 않아도 돼요.

## 💻 IDE 설정

처음 프로젝트를 받았다면 한 번 확인해주세요.

이 프로젝트는 **TypeScript 5.9 Workspace 버전**을 사용해요.

IDE가 프로젝트의 Workspace 버전이 아닌 다른 TypeScript 버전을 사용하면 `moduleResolution: node`와 관련된 deprecation 경고가 나타날 수 있어요.

VS Code에서는 아래와 같이 설정해주세요.

1. `Ctrl+Shift+P`를 열어요.
2. **TypeScript: Select TypeScript Version**을 선택해요.
3. **Use Workspace Version**을 선택해요.
4. **TypeScript: Restart TS Server**를 실행해요.

`.vscode/settings.json`에도 Workspace TypeScript를 사용하도록 설정되어 있어요.

처음 Clone한 뒤 한 번만 확인하면 돼요.

## 🎨 코드 스타일

API와 Web 모두 같은 코드 스타일을 사용해요.

### Prettier

```text
semi: false
singleQuote: true
```

### ESLint

루트의 `eslint.config.mjs` 하나를 API와 Web이 함께 사용해요.

프로젝트별로 별도의 ESLint 설정을 만들지 않아요.

### 함수 작성 규칙

헬퍼 함수는 화살표 함수로 작성해주세요.

```ts
const createUser = () => {
  // ...
}
```

`main.ts`의 `bootstrap` 진입 함수만 `function` 선언을 허용해요.

그 외 함수는 화살표 함수로 작성해주세요.