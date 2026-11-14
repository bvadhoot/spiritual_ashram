import type { Paksha, RashiInfo } from "./types";

export const TITHI_NAMES = [
  "Pratipada",
  "Dwitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashthi",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dwadashi",
  "Trayodashi",
  "Chaturdashi",
] as const;

export const TITHI_NAMES_TE = [
  "ప్రతిపద",
  "ద్వితీయ",
  "తృతీయ",
  "చతుర్థి",
  "పంచమి",
  "షష్ఠి",
  "సప్తమి",
  "అష్టమి",
  "నవమి",
  "దశమి",
  "ఏకాదశి",
  "ద్వాదశి",
  "త్రయోదశి",
  "చతుర్దశి",
] as const;

export const NAKSHATRA_NAMES = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
] as const;

export const NAKSHATRA_NAMES_TE = [
  "అశ్విని",
  "భరణి",
  "కృత్తిక",
  "రోహిణి",
  "మృగశిర",
  "ఆర్ద్ర",
  "పునర్వసు",
  "పుష్యమి",
  "ఆశ్లేష",
  "మఘ",
  "పూర్వ ఫల్గుణి",
  "ఉత్తర ఫల్గుణి",
  "హస్త",
  "చిత్త",
  "స్వాతి",
  "విశాఖ",
  "అనూరాధ",
  "జ్యేష్ఠ",
  "మూల",
  "పూర్వాషాఢ",
  "ఉత్తరాషాఢ",
  "శ్రవణం",
  "ధనిష్ఠ",
  "శతభిష",
  "పూర్వాభాద్ర",
  "ఉత్తరాభాద్ర",
  "రేవతి",
] as const;

export const RASHI_NAMES = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

export const RASHI_NAMES_TE = [
  "మేషం",
  "వృషభం",
  "మిథునం",
  "కర్కాటకం",
  "సింహం",
  "కన్య",
  "తులా",
  "వృశ్చికం",
  "ధనుస్సు",
  "మకరం",
  "కుంభం",
  "మీనం",
] as const;

export function tithiLabel(number: number, paksha: Paksha) {
  const index = Math.max(1, Math.min(15, number)) - 1;
  const isPurnima = number === 15 && paksha === "Shukla";
  const isAmavasya = number === 15 && paksha === "Krishna";

  return {
    name: isPurnima
      ? "Purnima"
      : isAmavasya
        ? "Amavasya"
        : TITHI_NAMES[index],
    nameTe: isPurnima
      ? "పూర్ణిమ"
      : isAmavasya
        ? "అమావాస్య"
        : TITHI_NAMES_TE[index],
    pakshaTe: paksha === "Shukla" ? "శుక్ల పక్షం" : "కృష్ణ పక్షం",
  };
}

export function nakshatraLabel(index: number) {
  const safe = ((index % 27) + 27) % 27;
  return {
    name: NAKSHATRA_NAMES[safe],
    nameTe: NAKSHATRA_NAMES_TE[safe],
  };
}

export function rashiInfo(index: number): RashiInfo {
  const safe = ((index % 12) + 12) % 12;
  return {
    name: RASHI_NAMES[safe],
    nameTe: RASHI_NAMES_TE[safe],
    index: safe,
  };
}
