// 플레이 화면 스크린샷 캡처 (개발 확인용).
// 실행: npm run dev (별도 터미널) → npm run shot
//
// 환경변수:
//   BASE_URL  기본 http://127.0.0.1:5174
//   OUT       저장 폴더 기본 ./screenshots
//   CHROME    크로미움 경로 (미지정 시 /opt/pw-browsers에서 자동 탐색)
import { chromium } from 'playwright-core';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:5174';
const OUT = process.env.OUT ?? './screenshots';

// 사전 설치된 Chromium 자동 탐색 (PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers)
function findChrome() {
  if (process.env.CHROME && existsSync(process.env.CHROME)) return process.env.CHROME;
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH ?? '/opt/pw-browsers';
  if (existsSync(root)) {
    const dir = readdirSync(root).find((d) => d.startsWith('chromium-'));
    if (dir) {
      const p = join(root, dir, 'chrome-linux', 'chrome');
      if (existsSync(p)) return p;
    }
  }
  return undefined; // playwright-core 기본값에 위임
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const executablePath = findChrome();
  const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1180, height: 1000 } });
  const go = async (p) => {
    await page.goto(BASE_URL + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
  };
  const shot = async (name) => {
    await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: true });
    console.log('saved', name);
  };

  // 홈
  await go('/');
  await shot('home');

  // 카드 도감 + 뒤집기
  await go('/codex');
  await shot('codex');
  const cards = page.locator('button[aria-label$="카드 뒤집기"]');
  await cards.nth(0).click();
  await cards.nth(3).click();
  await page.waitForTimeout(700);
  await shot('codex_flip');

  // 인출 퀴즈: 백지 인출 → 확신도 → 보기 → 피드백
  await go('/quiz');
  await page.getByPlaceholder('예: 호기심? 손실 회피?').fill('손실 회피인 것 같다');
  await page.getByRole('button', { name: /확실/ }).click();
  await shot('quiz_recall');
  await page.getByRole('button', { name: '보기 확인하기' }).click();
  await page.waitForTimeout(400);
  await page.locator('button.min-h-\\[56px\\]').first().click();
  await page.waitForTimeout(500);
  await shot('quiz_feedback');

  // 9섹션 빌더: 배치 → 채점
  await go('/builder');
  await shot('builder');
  const hand = ['숫자로', '고민 건드리기', '사회적 증거', '프레이밍', '권위', '참조점', '권위', '손실 회피', '손실 회피'];
  for (let i = 0; i < hand.length; i++) {
    await page.getByRole('button', { name: new RegExp(hand[i]) }).first().click();
    const place = page.getByRole('button', { name: /여기에 카드 배치/ });
    if ((await place.count()) > 0) {
      await place.first().click();
      await page.waitForTimeout(120);
    }
  }
  await shot('builder_filled');
  await page.getByRole('button', { name: '카피 완성' }).click();
  await page.waitForTimeout(500);
  await shot('builder_result');

  await browser.close();
  console.log(`\n완료 → ${OUT}/`);
}

main().catch((err) => {
  console.error('스크린샷 실패:', err.message);
  process.exit(1);
});
