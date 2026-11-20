# 개발 가이드

## 워크스페이스

| 패키지 | 역할 |
|---|---|
| `@snb/domain` | 타입(`Sword`, `Order`, `CustomsConfig`), 관세 계산 `estimateCustoms`, 소지허가 판단, 금액·길이 표시 형식 |
| `@snb/mocks` | 299점 시드 데이터(`seed.ts`의 16점과 `catalog/`의 283점)와 시드 묶음(`/seed-bundle`), 메모리 DB(`createDbWithSeed`, 서버·테스트용 `createDb`), MSW 핸들러, 브라우저(`/browser`)·Node(`/node`) 진입점 |
| `@snb/sword-art` | 도검 부조 `SwordRelief`, 칼날 로고 `BladeMark` |
| `@snb/shop` | 쇼핑몰 (포트 3000) |
| `@snb/admin` | 어드민 (포트 3001, `basePath: '/admin'`) |

패키지는 빌드하지 않고 TypeScript 소스를 그대로 내보냅니다. 두 앱은 `next.config.ts`의 `transpilePackages`로 읽습니다.

## 쇼핑몰과 어드민을 한 주소로 (multi-zones)

- 어드민은 `basePath: '/admin'`으로 빌드하고, 쇼핑몰이 `/admin` 요청을 어드민 앱으로 넘깁니다(`apps/shop/next.config.ts`의 rewrites). 그래서 두 앱이 **같은 출처(origin)** 에서 열립니다.
- 넘길 주소는 빌드할 때 `ADMIN_ORIGIN`으로 정합니다. 기본값은 개발 `http://localhost:3001`, 프로덕션 `https://swordnblade-admin-ryushin01.vercel.app`입니다.
- `pnpm dev`로 두 앱을 함께 띄우고 `http://localhost:3000/admin`으로 엽니다. 어드민만 따로 열려면 `http://localhost:3001/admin`입니다.
- 쇼핑몰과 어드민 사이의 이동은 다른 앱으로 넘어가므로 `next/link`가 아닌 일반 `a` 링크를 씁니다.

## FSD 구조

두 앱 모두 Feature-Sliced Design v2.1을 따릅니다.

- Next.js 규칙에 맞춰 계층 이름을 `_app`, `_pages`로 씁니다. `src/app/`의 라우트 파일은 `_pages`와 `_app`을 다시 내보내기만 합니다.
- 슬라이스는 자기보다 아래 계층만, 공개 API(`index.ts`)로만 가져옵니다.
- 한 페이지에서만 쓰는 코드는 그 페이지 슬라이스에 둡니다. 두 곳 이상에서 쓰게 되면 `features`·`widgets`로 올립니다. (예: 배송 국가 선택은 상세와 장바구니에서 써서 `features/choose-destination`)
- `pnpm lint`가 Steiger로 규칙을 검사합니다. `_app`·`_pages` 이름 경고(`fsd/typo-in-layer-name`)만 끕니다.

## Mock API

- 브라우저: 첫 API 요청 전에 `startMockApi`가 시드 JSON(쇼핑몰 `/mock-seed.json`, 어드민 `/admin/mock-seed.json`)을 받아 DB를 만들고 MSW 워커를 켭니다(`shared/api/client.ts`). 두 앱이 같은 워커(`/mockServiceWorker.js`)와 같은 localStorage 키(`snb-db-v1`)를 써서 데이터를 함께 씁니다. 새로고침해도 남고, 저장소를 못 쓰는 환경에서는 메모리로만 동작합니다.
- 시드 JSON은 정적 라우트(`src/app/mock-seed.json/route.ts`)가 빌드할 때 `SEED_BUNDLE`(시드 버전·도검·주문·도검이 들어온 버전 표)로 만듭니다. 그래서 도검 목록이 화면 자바스크립트에 들어가지 않고, 도검을 더해도 화면 JS가 커지지 않습니다(1.4.0). 서버 렌더링·Node Mock 서버·테스트는 모듈에서 바로 읽습니다.
- 화면 코드(클라이언트 컴포넌트와 그것이 불러오는 모듈)는 `@snb/mocks` 묶음을 값으로 불러오지 않습니다(도검 목록 전체가 따라 들어옴). 타입만 불러오거나(`import type`), `@snb/mocks/admin-account`처럼 하위 경로를 씁니다. 다시 들어오면 번들 크기 검사(490 kB)가 실패합니다.
- Mock DB는 읽고 쓸 때마다 저장소를 다시 읽어, 다른 앱이 바꾼 값을 바로 봅니다. 저장된 값이 없으면 지금 메모리 상태를 유지합니다(시드로 되돌리지 않음).
- 시드 버전 11(1.1.0)에서 도검 34점(단검·대검 보충, 게임 속 검의 실제 원형, 판타지·게임 분류)을 더했습니다. 예전 데이터에는 뒤에 붙이고, 이미 있는 도검의 판매 정보(이름·가격·재고·할인)는 그대로 둡니다. 새로 더한 id는 `catalog/index.ts`의 `CATALOG_V11_IDS`이고, `db.ts`가 이를 버전 11에 들어온 도검으로 적습니다.
- 시드 버전 12(1.2.0)에서 게임·작품 속 검 10점(`CATALOG_V12_IDS`, 원작 이름 그대로 본뜬 비공식 팬 재현품)을 더하고, 원작의 합체검으로 바꾼 창작품 삼합 대검을 뺐습니다(`REMOVED_SEED_IDS`, 예전 데이터에서도 지움).
- 시드 버전 13(1.3.0)에서 Fate 시리즈 12점과 다른 작품의 검 15점(`CATALOG_V13_IDS`)을 더했습니다. 게임·작품 속 검은 작품별 파일(`catalog/fiction*.ts`)에 두고 `fiction-kit.ts`의 `fiction()`으로 적습니다.
- 시드 버전 14(1.5.0)에서 「가공의 도검」 3단계 1차 16점(`CATALOG_V14_IDS`, `catalog/fiction-works-2.ts`)을 더했습니다. 남은 작품도 묶음마다 시드 버전을 하나씩 올리고 새 id를 그 버전에 등록합니다(`seed-bundle.ts`의 `ADDED_IN`).
- 어드민만 따로 열리면 루트에 워커가 없으므로 `/admin/mockServiceWorker.js`를 `/admin` 범위로 등록합니다(`Service-Worker-Allowed` 헤더). 이때는 데이터가 쇼핑몰과 공유되지 않습니다.
- 테스트: `NEXT_PUBLIC_API_MOCKING=off`로 브라우저 워커를 끄고 `createMockServer()`(MSW Node)를 씁니다.
- 주문 금액은 클라이언트가 보낸 값을 쓰지 않고 Mock 서버가 주문 시각의 판매가(할인 적용)와 `estimateCustoms`로 다시 계산합니다. 재고 부족(409), 입력 오류(422)도 서버에서 판단합니다.
- 주문 수량은 도검마다 1~5 정수입니다(`MAX_ORDER_QUANTITY`, 아니면 422). 같은 도검이 여러 줄이면 합쳐서 재고를 확인하고 뺍니다. 재고가 모자라거나 판매가 끝난 도검이 있으면 409에 `code: 'out-of-stock'`과 도검(`swordId`)·남은 재고(`stock`)를 담아, 주문서가 화면 언어로 어느 도검인지 알리고 장바구니로 안내합니다.
- 상품 등록·수정 모두 주소(slug)가 다른 상품과 겹치면 409(`fields.slug`)입니다. 주문번호의 날짜(`SNB-YYYYMMDD-NNNN`)는 한국 시간입니다.

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/api/swords?category=` | 상품 목록 |
| GET | `/api/swords/:slug` | 상품 상세 (slug 또는 id) |
| POST · PUT · DELETE | `/api/swords`, `/api/swords/:id` | 상품 등록·수정·삭제 |
| GET · PUT | `/api/customs-config` | 관세·환율 설정 |
| GET · POST | `/api/orders` | 주문 목록·주문 |
| GET · PATCH | `/api/orders/:id` | 주문 상세(주문한 기기의 주문 키 `X-Order-Key`·주문한 회원·어드민만)·상태 변경 |
| POST | `/api/orders/lookup` | 비회원 주문 조회: 주문번호와 주문할 때 쓴 이메일이 맞으면 `{ id, accessKey }`, 틀리면 무엇이 틀렸는지 밝히지 않고 404 |
| GET | `/api/stats` | 대시보드 통계 |
| POST · GET | `/api/images`, `/api/images/:id` | 사진 올리기(이미지만, 5MB 이하, IndexedDB에 저장)·받기 |
| POST | `/api/auth/signup`, `/api/auth/login`, `/api/auth/logout` | 회원가입·로그인·로그아웃. 성공하면 `{ token, user }` |
| GET | `/api/auth/me`, `/api/me/orders` | 로그인한 회원과 그 회원의 주문(`Authorization: Bearer <token>`, 없으면 401) |
| GET · PUT | `/api/me/wishlist` | 회원의 찜 목록(로그인 필요) |
| POST | `/api/me/orders/:id/cancel` | 회원의 출고 전 주문 취소, 재고 복구 |
| GET · POST | `/api/swords/:slug/reviews` | 후기 목록·등록(구매한 회원만, 한 도검에 한 번) |
| PUT | `/api/me/profile` | 프로필 사진 바꾸기·지우기 |
| POST | `/api/admin/login`, `/api/admin/logout` | 어드민 데모 로그인 |
| GET | `/api/users` | 어드민 회원 목록(회원별 주문 수, 비밀번호 해시 제외) |

어드민은 로그인 화면에 공개한 데모 계정으로 들어가며, 브라우저의 Mock API가 어드민 전용 API에 토큰을 요구합니다(단위 테스트는 `requireAdmin` 없이 돌립니다). 토큰과 데이터가 모두 브라우저 안에 있어 실제 보안은 아닙니다. 실제 서비스라면 서버에서 권한을 확인해야 합니다.

주문번호(`SNB-날짜-순번`)는 짐작하기 쉬워 그것만으로는 주문 확인(받는 분 이름·주소·연락처)을 열지 않습니다. 주문할 때 응답에만 실리는 주문 키를 그 기기에 남겨(`snb-order-keys-v1`, 최근 30개, 저장소를 쓸 수 없으면 새로고침 전까지 메모리) 주문 확인을 열 때 보내고, 주문한 회원과 어드민은 키 없이 엽니다. 다른 기기에서는 비회원 주문 조회(`/orders/lookup`)로 주문번호와 이메일을 넣어 키를 받습니다. 주문 키가 생기기 전 주문은 예전처럼 엽니다(비회원 주문 조회로 찾아도 키를 붙이지 않아, 그 주문을 열던 기기가 막히지 않음). 다른 응답(목록·내 주문·상태 변경)에는 키를 싣지 않습니다.

로그인 세션은 회원 30일, 어드민 1일이 지나면 무효이고, 새로 로그인할 때 만료된 세션을 지웁니다. 만료를 두기 전에 저장된 어드민 토큰(문자열)은 무효라 한 번 다시 로그인합니다.

회원 비밀번호는 Mock DB에 SHA-256 해시로만 두고, 로그인 실패는 어느 칸이 틀렸는지 밝히지 않습니다. 실제 서비스라면 서버에서 느린 해시(bcrypt·Argon2)와 HttpOnly 쿠키 세션을 써야 합니다. 로그인 뒤 돌아갈 주소(`?next=`)는 `/`로 시작하는 사이트 안 주소만 따릅니다.

## 브라우저 저장값

- 장바구니·찜·최근 본 도검·로그인 토큰은 zustand `persist`로 localStorage에 둡니다. 서버 렌더와 어긋나지 않게 마운트 뒤에 불러옵니다(`skipHydration`, `useStoreHydrated`).
- 저장값이 깨져 있어도 화면이 멈추지 않게 불러올 때 모양을 확인합니다. 장바구니 배송 국가는 관세 표에 있는 국가만 받고, 계산할 때도 표에 없는 국가면 대한민국으로 계산합니다(`resolveDestination`).
- 다른 탭이 같은 키를 바꾸면 `storage` 이벤트로 그 저장소를 다시 불러옵니다(`shared/lib/sync-across-tabs.ts`). 이벤트는 바로 도착하므로, 탭을 오가며 바꿔도 나중에 저장한 탭이 앞 탭의 변경을 지우지 않습니다(두 탭이 같은 순간에 저장하는 경합까지 막지는 않음). 다른 탭이 저장소를 비우면 로그아웃 상태가 됩니다. 어드민 로그인 토큰도 같은 방식으로 다른 탭의 로그아웃을 따릅니다.
- 다른 탭(어드민·쇼핑몰)이 Mock 데이터(`snb-db-v1`)를 바꾸면 두 앱 모두 띄워 둔 쿼리를 다시 받아, 이미 열린 탭도 바뀐 가격·재고·관세율·주문을 바로 보여 줍니다.
- 담은 뒤 품절되거나 재고가 줄면 장바구니가 줄마다 알리고, 고치기 전에는 주문서로 가는 링크 대신 안내를 보여 줍니다(`useCartQuote`의 `stockIssue`·`blocked`).

## 오류 화면

화면을 그리다 오류가 나면 쇼핑몰은 머리글·바닥글 안에 404와 같은 모양의 오류 화면(`_app/error`, 한국어·영어)을, 어드민은 관리 메뉴 안에 Ant Design `Result`를 보여 줍니다. 다시 시도(Next 16.4 `retry()`)와 첫 화면으로 가는 링크가 있고, 쇼핑몰은 오류를 `reportError`로 모니터링에 보냅니다. 루트 레이아웃까지 실패하면 `global-error`가 문서를 직접 그립니다.

## 할인

- 상품의 `discount`(`{ rate, startsAt?, endsAt? }`)로 정합니다. 날짜는 한국 시간 날짜(`YYYY-MM-DD`)이고, 시작일 0시부터 종료일 23:59:59까지 할인합니다. 둘 다 생략할 수 있습니다.
- 판매가는 `@snb/domain`의 `priceOf(sword, now)`로 계산합니다. 할인율은 1~90 정수, 할인가는 100원 단위 반올림입니다. 쇼핑몰의 가격 정렬·할인 거르기(`?sale=1`)·장바구니·관세 계산이 모두 같은 함수를 씁니다.
- 주문하면 Mock 서버가 그 시각의 할인가로 금액을 다시 계산하고, 할인한 줄에는 정가(`listPrice`)를 함께 남깁니다. 주문서는 고객이 본 결제 금액(`expectedTotal`)을 함께 보내고, 서버 계산과 다르면(할인 종료, 가격·관세율 변경) 주문하지 않고 409(`code: 'price-changed'`, 새 `total`)를 돌려줍니다. 주문서는 가격과 관세율을 새로 받아 바뀐 금액을 보여 주고, 고객이 다시 결제하면 주문합니다.
- 상품을 저장할 때 할인 값이 맞지 않으면 422(`fields.discount`)입니다. 날짜는 형식만이 아니라 달력에 있는 날인지(2월 30일, 평년 2월 29일 거절)도 봅니다.
- '지금'은 서버가 그린 HTML과 hydrate 결과가 같도록 처음에는 next-intl `now`(요청 시각)를 쓰고, 그 뒤에는 브라우저 시계를 분 단위로 씁니다(`shared/lib/use-now.ts`). 자정에 할인이 시작되거나 끝나도 새로고침 없이 바뀝니다.
- 줄 그은 정가(`del`)는 화면 낭독기가 읽지 않는 경우가 많아 '정가'·'할인가'를 숨긴 글자로 붙이고, 할인율도 글자로 보여 줍니다(색만으로 알리지 않음).
- 시드 버전 10에서 시드 도검 8점에 할인을 넣었습니다(1점은 시작 전). 예전 데이터에는 할인이 없을 때만 채우고, 어드민에서 정하거나 지운 할인은 그대로 둡니다.

## 테스트

| 종류 | 위치 | 명령 |
|---|---|---|
| 단위 | `packages/*/src/*.test.ts` | `pnpm test` (커버리지와 하한까지: `pnpm test:coverage`) |
| 컴포넌트 | 컴포넌트 옆 `*.test.tsx` | `pnpm test` |
| 스토리 | 컴포넌트 옆 `*.stories.tsx` | `pnpm test:storybook` (보기: `pnpm --filter @snb/shop storybook`) |
| E2E | `apps/*/e2e` | `pnpm build` 후 `pnpm --filter @snb/shop e2e` |

E2E는 `next start`(프로덕션 빌드)를 띄워 데스크톱·모바일(Pixel 7) 두 화면에서 실행합니다. 쇼핑몰은 3101, 어드민은 3102 포트를 씁니다(`E2E_PORT`로 바꿀 수 있음). `E2E_BASE_URL`을 주면 로컬 서버를 띄우지 않고 그 주소(배포된 사이트)를 검사합니다. 매 페이지에서 axe(WCAG 2.2 AA 태그)를 돌리고, 쇼핑몰은 가로 넘침도 검사합니다. 쇼핑몰 E2E는 어드민 서버도 함께 띄워 두 앱의 데이터 공유를 검사하므로, 쇼핑몰을 `ADMIN_ORIGIN=http://localhost:3102`로 빌드해야 합니다.

스토리 테스트는 모든 스토리를 실제 브라우저(Chromium)에서 렌더링하고 axe를 돌립니다. 접근성 위반이 하나라도 있으면 실패합니다(`a11y: { test: 'error' }`).

## 코드 스타일

- ESLint(`eslint.config.mjs`): Next.js 권장 규칙(Core Web Vitals, TypeScript, jsx-a11y, React Hooks)과 import 정렬. 순서는 react → next → 외부 패키지 → `@snb/` → `@/` → 상대 경로 → `import type` → CSS입니다. `pnpm lint`는 ESLint와 Steiger를 함께 돌립니다.
- Prettier(`.prettierrc.json`): 작은따옴표, 한 줄 120자. 문서(`*.md`)는 표를 손으로 맞춰 두어 제외합니다.
- husky: 커밋 전에 바뀐 파일에 ESLint·Prettier(lint-staged), 전체 타입 검사, 단위 테스트를 실행합니다.
- TypeScript는 6.0으로 고정합니다. typescript-eslint가 아직 7.0을 지원하지 않습니다.

## 언어 (next-intl)

- 쇼핑몰만 한국어와 영어를 지원합니다. 한국어는 지금 주소(`/`), 영어는 `/en` 아래입니다(`localePrefix: 'as-needed'`). 브라우저 언어로 자동 이동하지 않습니다.
- `src/proxy.ts`(Next 16의 미들웨어)가 언어 경로를 처리합니다. `/admin`, `/storybook`, `/api`, 정적 파일은 건드리지 않습니다.
- 라우트는 `src/app/[locale]/` 아래에 있고, 화면 글은 `shared/i18n/messages/{ko,en}.json`에 있습니다. 앱 안 이동에는 `next/link` 대신 `@/shared/i18n`의 `Link`·`useRouter`를 씁니다(`/en`을 알아서 붙임).
- 도검의 영어 글은 `packages/mocks/src/seed-en.ts`에 있고 `Sword.translations.en`으로 붙습니다. 화면은 `localizeForLocale`로 바꿔 보여 주며, 예전에 저장된 Mock 데이터에 번역이 없으면 Mock DB가 읽을 때 같은 id의 시드 번역을 채우고, 그것도 없으면(어드민에서 새로 만든 도검) 한국어 원문을 씁니다. 주문 영수증의 영어 이름은 주문할 때 남긴 `nameEn`을 쓰고, 남기기 전 주문은 Mock API가 돌려줄 때 지금 도검 목록에서 채웁니다. 어드민 상품 수정 화면의 "영어(English)" 카드에서 영어 글을 고칩니다. 모두 비우면 `translations`를 빈 객체로 저장해, 시드 번역으로 되돌아가지 않고 한국어 원문을 보여 줍니다.
- 금액은 한국어 `1,234원`, 영어 `₩1,234`로, 국가 이름·주문 상태·허가 안내도 언어에 맞춥니다(`@snb/domain`의 `i18n.ts`).
- 머리글의 언어 링크는 지금 주소와 검색 조건을 그대로 두고 언어만 바꿉니다. 링크 글자는 그 언어로 쓰고 `lang`·`hrefLang`을 붙입니다. 페이지마다 `hreflang` 대체 주소를 알립니다.
- 시드 도검 상세, 장바구니, 주문서는 언어마다 정적으로 만듭니다(`setRequestLocale`).
- 테스트는 `renderWithProviders(ui, { locale })`로 번역을 감싸고, Storybook은 도구 막대에서 언어를 바꿉니다.

## 서버 렌더링

- 상품 목록과 상세는 서버가 시드 데이터로 먼저 그립니다. 첫 화면과 검색 엔진에 내용이 바로 보이고, 자바스크립트 없이도 읽을 수 있습니다(E2E로 확인).
- 브라우저에서는 TanStack Query의 `initialData`로 받아 바로 보여 준 뒤, `initialDataUpdatedAt: 0`이라 곧바로 Mock API에서 다시 받아 어드민에서 바꾼 값으로 바꿉니다.
- 시드 도검 상세는 빌드할 때 정적으로 만듭니다(`generateStaticParams`). 어드민에서 새로 만든 도검은 브라우저에서 불러옵니다. 시드에 없는 주소는 서버 HTML이 빈 화면이라 `noindex`로 색인을 막습니다(응답은 200, 브라우저에서 찾지 못하면 '찾는 도검이 벽에 없습니다').
- 찾기·정렬은 GET 폼(`next/form`)이라 결과가 주소(`?q=&sort=`)에 남습니다.

## 도검별 공유 이미지

`apps/shop/public/og/swords/<slug>.jpg`(1200×630)는 부조 그림의 SVG 필터 때문에 실제 브라우저로 그려 저장합니다. 시드 도검이 바뀌면 프로덕션 서버를 띄우고 `node scripts/generate-og.mjs http://localhost:3101`을 `apps/shop`에서 실행합니다. 새로 더한 도검만 만들 때는 `--missing`을 붙입니다(이미 있는 이미지는 그대로). 파일이 빠지면 단위 테스트가 실패합니다.

## 성능 (Lighthouse, 모바일)

| 화면 | 성능 | FCP·LCP | TBT | CLS | 받는 양 |
|---|---|---|---|---|---|
| 도검의 벽 | 100 | 1.24초 | 52ms | 0 | 749 KB |
| 쌍수도 상세 | 100 | 1.00초 | 53ms | 0 | 718 KB |
| 우치가타나 상세(영어) | 100 | 0.97초 | 50ms | 0 | 729 KB |
| 장바구니 | 100 | 0.93초 | 38ms | 0 | 706 KB |
| 도검 연표 | 100 | 1.05초 | 12ms | 0.001 | 782 KB |

운영 주소(https://swordnblade-ryushin01.vercel.app, 0.15.1)에서 2026-11-16에 3회씩 잰 중앙값이고, 접근성·권장 사항·SEO는 모든 화면 100점입니다. 어드민은 검색 노출을 막아(noindex) SEO 점수가 낮은 것이 정상입니다.

- 글꼴: 한글 KoPub바탕은 화면 글자 파일과 나머지 조각으로 나눠 받습니다(README '웹 폰트'). 예전에 한글 웹 글꼴(Noto Serif KR) 조각 10여 개(약 700 KB)를 그대로 받을 때는 성능 62~70, FCP 4~5초였습니다. 0.17.0에서 쓰지 않는 Spectral 700과 한국어 화면의 Pirata One 미리 받기를 빼, 한국어 화면이 받는 글꼴이 7개 261 KB → 5개 237.5 KB가 되었습니다(로컬 측정). 1.4.0에서 도검 설명·이야기에만 쓰인 글자를 상세 글자 파일(55.4 kB)로 나눠 화면 글자 파일이 155.5 → 117.7 kB가 되었고, 상세 글자 파일은 도검 상세만 받습니다(E2E로 확인).
- 상호작용: 도검의 벽 카드 → 상세 hero 전환에서 가장 긴 프레임이 CPU 4배 감속 기준 1,437ms였다가, 0.17.0의 SSGOI 복제 패치로 146ms(동작 줄이기 1,404 → 180ms)가 되었습니다. 긴 애니메이션 프레임(LoAF)과 CPU 프로파일로 잽니다.
- 메모리: 벽↔상세 hero 왕복 22회, 연표↔상세 fade 10회, 동작 줄이기 10회 뒤 GC해도 DOM 노드·이벤트 리스너 수가 그대로였습니다(2026-11-16). 잴 때는 `waitForFunction`이 요소를 돌려받지 않게 합니다(돌려받은 핸들이 떠난 화면을 붙잡아 누수처럼 보임).
- Mock DB: 저장한 뒤에는 요청마다 localStorage(약 270 KB)를 다시 읽지만 한 번에 1ms 안팎이라, 요청마다 일부러 둔 지연(250ms)보다 훨씬 작습니다.

## 접근성 점검 (KWCAG 2.2)

axe를 통과해도 KWCAG 준수는 아니므로 다음을 직접 확인했습니다.

| 항목 | 처리 |
|---|---|
| 5.1.1 대체 텍스트 | 상세 부조는 `role="img"`와 설명, 목록 부조는 이름·가격 글자가 있어 장식으로 숨김 |
| 5.3.1 표 구성 | 장바구니 표에 `caption`, `th scope` |
| 5.4.1 색 무관 인식 | 주문 상태·허가 여부를 색 점과 글자로 함께 표시 |
| 5.4.3 명도 대비 | 쇼핑몰 글자색 5.35:1 이상. 어드민은 Ant Design 기본값 중 대비가 모자란 토큰(primary, 보조 글자)을 진하게 바꿈 |
| 6.1.1 키보드 | 가로로 넘치는 어드민 표는 초점을 받는 영역(`ScrollRegion`)으로 감쌈. ColorPicker는 버튼을 트리거로 써서 레이블과 연결 |
| 6.1.2 초점 이동 | 장바구니 줄 삭제·찜 해제로 버튼이 사라지면 다음 항목의 같은 버튼, 모두 지우면 빈 목록 안내로 초점을 옮김(`useRemovalFocus`). 내 주문 취소는 확인 버튼 → 처음 버튼·목록 제목으로 |
| 6.1.3 조작 가능 | 링크·버튼 높이 44px(`min-h-11`), 오류 요약 링크 24px 이상 |
| 6.4.1 반복 영역 건너뛰기 | 두 앱 모두 "본문 바로가기" |
| 6.4.2 제목 | 화면마다 제목. 404는 "이 자리에는 아무것도 새겨져 있지 않습니다 · Sword & Blade"(없는 주소를 받는 `[...rest]` 페이지의 메타데이터) |
| 7.1.1 기본 언어 | `lang="ko"`, 영문 이름에 `lang="en"` |
| 7.3.1 오류 정정 | 오류 요약(초점 이동, 칸으로 가는 링크), `aria-invalid`, `aria-describedby`. 후기 폼은 틀린 칸(별점 묶음·내용)에 오류를 잇고 그 칸으로 초점 |
| 상태 메시지 | 갤러리 위치·결제 예정 금액·결제 완료·찾기 결과 수는 `role="status"`(polite). 암시 값과 겹치는 `aria-live`·`aria-atomic`은 쓰지 않음 |
| 7.3.4 반복 입력 | 주문서에 `autocomplete` |
| 6.2.2 정지 | `prefers-reduced-motion`에서 전환 효과를 끔 |

### 화면낭독기 구조

Playwright로 접근성 트리(화면낭독기가 읽는 구조)를 뽑아 확인했습니다. 랜드마크(banner, navigation, search, main, contentinfo), 페이지마다 h1 하나와 h2 영역, 모든 입력의 이름, 부조 그림의 설명이 맞게 읽힙니다.

VoiceOver로 직접 들어 보는 점검은 사람이 해야 합니다. 다음을 확인합니다.

- 첫 화면에서 Tab 한 번에 "본문 바로가기"가 읽히고, 누르면 본문으로 이동하는가
- 로터(VO+U)의 제목·랜드마크 목록만으로 화면 구조를 알 수 있는가
- 찾기 결과 수, 장바구니 담기 알림, 결제 예정 금액이 바뀔 때 읽히는가
- 주문서 오류 요약으로 초점이 옮겨지고, 링크를 누르면 해당 칸으로 가는가
- 어드민 표(상품·주문)의 머리글이 칸마다 함께 읽히는가

## 품질 예산

- **접근성 린트:** `eslint-config-next`는 jsx-a11y 규칙을 몇 개만 켭니다. 루트 `eslint.config.mjs`에서 이미 등록된 플러그인의 recommended 규칙을 모두 켭니다. 가로 스크롤용 `role="region"` + `tabIndex={0}`은 허용합니다.
- **번들 크기:** `pnpm --filter @snb/shop size`가 쇼핑몰 전체 JS 490 kB, CSS 12 kB(gzip)를 넘으면 실패합니다. 기준은 `apps/shop/.size-limit.json`에 있습니다. 0.12.0에서 화면 전환(SSGOI, 약 31 kB)을 넣으며 520 kB에서, 1.1.0에서 도검 34점(브라우저 Mock API가 쓰는 시드 데이터, 약 18 kB)을 더하며 550 kB에서 575 kB로 올렸습니다. 1.4.0에서 시드를 화면 묶음 밖(시드 JSON)으로 옮겨 571 → 463 kB가 되었고, 도검 목록이 다시 화면 묶음에 들어오면 알 수 있게 490 kB로 낮췄습니다. CSS에는 한글 글꼴의 unicode-range(글자 목록)가 들어 있어 도검 설명의 새 글자가 늘면 조금씩 커집니다. 슬라이스 공개 API(`index.ts`)로 내보낸 모듈은 그 슬라이스를 가져오는 화면 묶음마다 들어가므로, 한 화면에서만 쓰는 컴포넌트는 그 페이지 슬라이스에 두고, 화면에 들어가는 공통 모듈에는 다른 곳에서만 쓰는 코드(예: 할인 입력 검증 `discount-validation.ts`)를 섞지 않습니다.
- **화면 전환(SSGOI):** 제공자는 `_app/transitions/page-transitions.tsx`, 규칙은 `config.ts`, 경계(`RouteBoundary`)는 루트 레이아웃의 `main` 안에 둡니다.
  - 경계는 Suspense 없이 직접 만듭니다. `@ssgoi/react/nextjs`의 `SsgoiRouteBoundary`는 Suspense를 품어, 자바스크립트 없이 열면 비동기로 그리는 화면이 숨은 채로 남고, 경계 안에서 `notFound()`가 스트리밍 뒤에 나면 404 대신 200이 됩니다(이 앱은 `cacheComponents`를 쓰지 않아 `usePathname`이 멈추지 않음).
  - 404 화면도 경계 안에 둡니다. 경계 밖에 두면 앱 안에서 없는 주소로 이동할 때 떠나는 화면이 지워지지 않고 남습니다.
  - 언어 바꾸기는 `<a>`로 문서를 새로 받습니다. 클라이언트 이동이면 루트 레이아웃과 함께 제공자가 다시 만들어지며 떠나는 화면이 남습니다. 같은 이유로 규칙에서 언어 접두어를 떼는 middleware를 쓰지 않고 `/en/...`을 규칙에 그대로 적습니다.
  - 스크롤은 규칙이 정합니다. 쌍 규칙(`from`·`to`)은 새로 가는 화면을 맨 위에서 열고, 뒤로 가면 보던 자리로 돌려놓습니다. `on` 규칙은 범위 안끼리 오갈 때 두 화면 모두 처음 위치로 돌아가므로 쓰지 않습니다.
  - SSGOI는 `prefers-reduced-motion`을 스스로 읽지 않습니다. 동작 줄이기면 같은 규칙에 전환만 한 프레임 안에 끝나는 설정(`reducedConfig`)으로 바꿉니다. 규칙을 비우면 맞는 규칙이 없어 들어오는 화면이 늘 맨 위로 가므로, 뒤로 가도 보던 자리를 잃습니다.
  - `patches/@ssgoi__core@7.5.0.patch`: SSGOI 7.5.0은 문서의 첫 화면을 맨 위로 보내, 새로고침 때 브라우저가 되살린 위치를 지웁니다. 첫 화면에서는 위치를 옮기지 않고 기록만 하며, 화면이 열린 직후의 스크롤(늦은 복원, 머리글 높이 변화에 따른 스크롤 고정)도 바로 기록하게 고쳤습니다(`dist/internal.js`와 같은 내용을 `internal.cjs`에도). 또 hero 전환은 카드 부조를 복제하면서 요소마다 계산된 스타일 전부(약 560개)를 인라인으로 옮겨 적는데, 부조 SVG는 요소가 120~250개라 카드를 누르면 화면이 멈췄습니다(CPU 4배 감속에서 1.4초). 복제할 때 SVG 하위 요소는 옮기지 않게 고쳤습니다(`dist/index.js`, `index.cjs`의 `bt`). 최상위 svg에 옮긴 값을 상속하고 하위 요소는 자기 속성을 그대로 지녀 그림은 같습니다(픽셀 비교). SSGOI를 올릴 때는 업스트림이 고쳤는지 확인해 패치를 지우거나, 새 버전에 맞게 `pnpm patch @ssgoi/core`로 다시 만듭니다. E2E '새로고침해도 보던 자리를 지키고…'와 '카드 부조를 복제할 때…'가 두 동작을 검사합니다.
  - SSGOI는 화면이 열린 직후 10프레임 동안의 스크롤을 기록하지 않습니다(스크롤 복원 중의 움직임을 사용자의 스크롤로 착각하지 않으려는 것). E2E에서 스크롤 위치를 검사할 때는 사람이 스크롤하듯 그 뒤에 움직입니다(`waitForFrames`).
  - hero는 같은 키를 가진 첫 DOM 요소에서 출발합니다. 한 화면에 같은 도검 카드가 두 번 나오면(함께 볼 도검과 최근 본 도검) 아래쪽 카드는 출발점으로 쓰지 않습니다(`SwordTile`의 `heroSource={false}`).
  - E2E의 접근성 검사는 전환이 끝난 뒤(`waitForPageTransition`) 합니다. 전환 중에는 두 화면이 겹치고 투명도가 바뀝니다.
- **Lighthouse:** `pnpm --filter @snb/shop lhci`가 첫 화면·도검 상세·연표·영문 상세를 데스크톱 기준 3번씩 재서 성능 90·접근성 100·권장 사항 95·SEO 90점, LCP 2.5초·TBT 200ms·CLS 0.1 이하인지 확인합니다. 기준은 `apps/shop/lighthouserc.json`에 있습니다. 로컬에서는 canonical이 배포 주소를 가리켜 SEO가 92점으로 나옵니다.

두 검사 모두 프로덕션 빌드가 먼저 있어야 하며, CI는 E2E 뒤에 돌립니다.

## 모니터링

쇼핑몰(`apps/shop`)은 `instrumentation-client.ts`에서 `_app/monitoring`을 켜고, Sentry와 web-vitals는 나중에 따로 받습니다. Sentry는 페이지를 다 받은 뒤(load) 브라우저가 한가할 때 받고, load가 10초 안에 오지 않으면 그때 바로 받습니다.

| 환경 변수 | 내용 |
| --- | --- |
| `NEXT_PUBLIC_SENTRY_DSN` | 있으면 처리하지 못한 오류와 나쁜(poor) Web Vitals를 Sentry로 보냅니다. 없으면 Sentry를 번들에 넣지 않고, 개발 모드에서 Web Vitals를 콘솔에만 찍습니다 |

- Sentry에는 오류 내용만 보내고 사용자 정보·쿠키·헤더·쿼리 문자열, 방문 기록(세션), 이동·클릭 기록(브레드크럼), 콘솔 기록은 모으지 않습니다. 오류에 붙는 콜백 인수와 Error가 아닌 일반 객체로 거부된 Promise의 필드 값(`extra.__serialized__`), 주소의 `#` 뒤도 보내기 전에 지웁니다. Sentry를 받기 전에 난 오류는 최대 20개까지 모아 두었다가 처리되지 않은 오류로 보냅니다.
- 쓰는 함수만 `sentry.ts`에서 다시 내보내 약 31 kB(gzip)로 받습니다. 모듈 전체를 불러오면 리플레이·피드백까지 들어가 140 kB가 됩니다.
- 브라우저 오류만 모읍니다. 서버에서 난 오류는 Vercel 로그로 확인합니다.
