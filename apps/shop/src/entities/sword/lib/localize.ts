import { type Locale, localizeSword, type OrderLine, type Sword } from '@snb/domain';

/**
 * 도검을 화면 언어로 바꿉니다.
 * - 번역이 생기기 전에 저장된 Mock 데이터는 Mock DB가 읽을 때 시드 번역을 채우므로, 화면 묶음에 번역 보정표를 싣지 않습니다.
 * - 어드민에서 영어 글을 비우면 translations가 빈 객체로 저장되므로 한국어 원문을 보여 줍니다.
 */
export const localizeForLocale = (sword: Sword, locale: Locale): Sword => localizeSword(sword, locale);

/**
 * 주문 줄의 화면 언어 이름. 영어 화면은 주문할 때 남긴 영어 이름(nameEn)을 쓰고, 없으면 저장된 이름을 씁니다.
 * 예전 주문의 영어 이름은 Mock API가 돌려줄 때 채우므로, 화면이 시드 목록을 따로 불러오지 않습니다.
 */
export const orderLineName = (line: Pick<OrderLine, 'name' | 'nameEn'>, locale: Locale): string =>
  locale === 'en' ? (line.nameEn ?? line.name) : line.name;
