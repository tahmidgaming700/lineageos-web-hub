/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import romTrioHeroImg from '../assets/images/rom_trio_hero_1793989327269.jpg';
import pixelPhoneImg from '../assets/images/phone_google_pixel_1793989329322.jpg';
import pocoPhoneImg from '../assets/images/phone_xiaomi_poco_1793989328738.jpg';
import oneplusPhoneImg from '../assets/images/phone_oneplus_pro_1793989329822.jpg';
import samsungPhoneImg from '../assets/images/phone_samsung_galaxy_1793989329389.jpg';

export const HERO_ROM_TRIO_IMAGE = romTrioHeroImg;
export const PIXEL_PHONE_IMAGE = pixelPhoneImg;
export const POCO_PHONE_IMAGE = pocoPhoneImg;
export const ONEPLUS_PHONE_IMAGE = oneplusPhoneImg;
export const SAMSUNG_PHONE_IMAGE = samsungPhoneImg;

/**
 * Returns authentic real studio photography for a given device codename or OEM
 */
export function getDevicePhoto(codename?: string, oem?: string): string {
  const code = (codename || '').toLowerCase();
  const brand = (oem || '').toLowerCase();

  // 1. Exact or family matching by codename
  // Google Pixel family
  if (
    code.includes('akita') ||
    code.includes('shiba') ||
    code.includes('husky') ||
    code.includes('lynx') ||
    code.includes('panther') ||
    code.includes('cheetah') ||
    code.includes('bluejay') ||
    code.includes('oriole') ||
    code.includes('raven') ||
    code.includes('barbet') ||
    code.includes('redfin') ||
    code.includes('bramble') ||
    code.includes('sunfish') ||
    code.includes('flame') ||
    code.includes('coral')
  ) {
    return PIXEL_PHONE_IMAGE;
  }

  // Xiaomi / POCO / Redmi family
  if (
    code.includes('alioth') ||
    code.includes('vayu') ||
    code.includes('surya') ||
    code.includes('sweet') ||
    code.includes('mondrian') ||
    code.includes('marble') ||
    code.includes('beryllium') ||
    code.includes('dipper') ||
    code.includes('raphael') ||
    code.includes('davinci') ||
    code.includes('mido') ||
    code.includes('munch') ||
    code.includes('lisa') ||
    code.includes('curtana')
  ) {
    return POCO_PHONE_IMAGE;
  }

  // OnePlus family
  if (
    code.includes('aston') ||
    code.includes('salami') ||
    code.includes('lemonade') ||
    code.includes('lemonadep') ||
    code.includes('instantnoodle') ||
    code.includes('instantnoodlep') ||
    code.includes('kebab') ||
    code.includes('guacamole') ||
    code.includes('enchilada') ||
    code.includes('faye') ||
    code.includes('cheeseburger') ||
    code.includes('dumpling') ||
    code.includes('bacon')
  ) {
    return ONEPLUS_PHONE_IMAGE;
  }

  // Samsung Galaxy family
  if (
    code.includes('a52') ||
    code.includes('a72') ||
    code.includes('beyond') ||
    code.includes('starlte') ||
    code.includes('star2lte') ||
    code.includes('d1') ||
    code.includes('d2s') ||
    code.includes('crownlte') ||
    code.includes('r8q') ||
    code.includes('o1s') ||
    code.includes('t2s')
  ) {
    return SAMSUNG_PHONE_IMAGE;
  }

  // 2. Fallback by brand / OEM
  if (brand.includes('google')) return PIXEL_PHONE_IMAGE;
  if (brand.includes('xiaomi') || brand.includes('poco') || brand.includes('redmi')) return POCO_PHONE_IMAGE;
  if (brand.includes('oneplus')) return ONEPLUS_PHONE_IMAGE;
  if (brand.includes('samsung')) return SAMSUNG_PHONE_IMAGE;

  // Default to Pixel flagship studio image
  return PIXEL_PHONE_IMAGE;
}
