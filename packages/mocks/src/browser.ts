import { setupWorker } from 'msw/browser';

import { createDbWithSeed, type SeedBundle } from './db';
import { createHandlers } from './handlers';
import { createIndexedDbImageStore } from './image-store';

let started: Promise<unknown> | null = null;

/**
 * 브라우저에서 Mock API를 켭니다. 여러 번 불러도 한 번만 시작합니다.
 * 데이터는 localStorage(storageKey)에 남아 새로고침해도 유지됩니다.
 */
export function startMockApi(options: {
  storageKey: string;
  /**
   * 시드 JSON 주소(앱의 /mock-seed.json 라우트, 어드민은 /admin/mock-seed.json).
   * 카탈로그 코드를 화면 묶음에 싣지 않으려고 시드는 시작할 때 받아 옵니다.
   */
  seedUrl: string;
  latency?: number;
  serviceWorkerUrl?: string;
  /** 워커가 맡을 범위. 기본은 워커 파일이 있는 폴더 */
  /** 시작을 기다리는 최대 시간(ms) */
  startTimeout?: number;
  serviceWorkerScope?: string;
}) {
  if (!started) {
    const start = loadSeed(options.seedUrl).then((seed) => {
      const db = createDbWithSeed(seed, { storageKey: options.storageKey });
      const worker = setupWorker(
        ...createHandlers(db, {
          latency: options.latency ?? 250,
          images: createIndexedDbImageStore(),
          requireAdmin: true,
        }),
      );
      return worker.start({
        onUnhandledFrame: 'bypass',
        quiet: true,
        serviceWorker: {
          url: options.serviceWorkerUrl ?? '/mockServiceWorker.js',
          options: options.serviceWorkerScope ? { scope: options.serviceWorkerScope } : undefined,
        },
      });
    });
    // 시드를 받지 못했거나 시작이 실패하면 withStartTimeout이 started를 비워, 다음 요청에서 시드부터 다시 받습니다.
    started = withStartTimeout(start, options.startTimeout ?? START_TIMEOUT);
  }
  return started;
}

/** 시드 JSON을 받습니다. 응답이 실패하면 오류로 알려 화면이 다시 시도할 수 있게 합니다. */
async function loadSeed(url: string): Promise<SeedBundle> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Mock API 시드를 받지 못했습니다(${response.status}).`);
  return (await response.json()) as SeedBundle;
}

/** 시드를 받고 서비스 워커를 시작하기까지 기다리는 최대 시간 */
const START_TIMEOUT = 10_000;
const RELOAD_FLAG = '__snb_mock_reload__';

/**
 * 페이지가 새로 열리는 도중 등록이 끊기면 서비스 워커 시작이 끝나지 않아 화면이 '불러오는 중'에 머물 수 있습니다.
 * 제한 시간을 넘기면 한 번만 새로고침해 다시 시작하고, 그래도 안 되면 오류로 알려 화면이 다시 시도할 수 있게 합니다.
 */
function withStartTimeout<T>(start: Promise<T>, timeout: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const limit = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      started = null;
      // 새로고침은 한 번만 합니다. 표시를 남기지 못하는 환경(세션 저장소 사용 불가)에서는 새로고침이 반복될 수 있어 하지 않습니다.
      const firstTimeout = safeSession(() => sessionStorage.getItem(RELOAD_FLAG)) === null;
      const marked =
        firstTimeout &&
        safeSession(() => {
          sessionStorage.setItem(RELOAD_FLAG, '1');
          return sessionStorage.getItem(RELOAD_FLAG);
        }) === '1';
      if (marked) window.location.reload();
      // 새로고침이 일어나지 않아도 화면이 다시 불러오기를 보여 줄 수 있게 언제나 실패로 알립니다.
      reject(new Error('Mock API를 시작하지 못했습니다.'));
    }, timeout);
  });
  return Promise.race([start, limit]).then(
    (value) => {
      clearTimeout(timer);
      safeSession(() => sessionStorage.removeItem(RELOAD_FLAG));
      return value;
    },
    (error: unknown) => {
      // 먼저 실패했으면 타이머를 멈추고, 다음 요청에서 다시 시작하도록 비웁니다. 새로고침 표시는 성공할 때까지 둡니다.
      clearTimeout(timer);
      started = null;
      throw error;
    },
  );
}

function safeSession<T>(read: () => T): T | null {
  try {
    return read();
  } catch {
    return null;
  }
}
