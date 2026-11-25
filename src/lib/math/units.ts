/**
 * Exact unit conversion constants and helpers for Imperial <-> Metric modes.
 * Pure TypeScript with zero external dependencies.
 */

export type UnitSystem = 'imperial' | 'metric';

export const FEET_PER_METER = 3.280839895013123;
export const METERS_PER_FOOT = 0.3048;
export const INCHES_PER_FOOT = 12;
export const CM_PER_INCH = 2.54;
export const MM_PER_INCH = 25.4;
export const SQ_FEET_PER_SQ_METER = 10.763910416709722;
export const SQ_METERS_PER_SQ_FOOT = 0.09290304;
export const CU_FEET_PER_CU_YARD = 27;
export const CU_FEET_PER_CU_METER = 35.31466672148859;
export const CU_METERS_PER_CU_FOOT = 0.028316846592;
export const LITERS_PER_CU_METER = 1000;
export const LITERS_PER_CU_FOOT = 28.316846592;
export const LITERS_PER_US_GALLON = 3.785411784;
export const SQ_FEET_PER_GALLON_TO_SQ_METER_PER_LITER =
  SQ_METERS_PER_SQ_FOOT / LITERS_PER_US_GALLON;
export const LB_PER_KG = 2.2046226218487757;
export const KG_PER_LB = 0.45359237;
export const LB_PER_US_TON = 2000;
export const KG_PER_METRIC_TONNE = 1000;
export const LB_PER_CU_YD_TO_KG_PER_CU_M = 0.5932764212577829;

export function feetToMeters(ft: number): number {
  return ft * METERS_PER_FOOT;
}

export function metersToFeet(m: number): number {
  return m * FEET_PER_METER;
}

export function inchesToCm(inches: number): number {
  return inches * CM_PER_INCH;
}

export function cmToInches(cm: number): number {
  return cm / CM_PER_INCH;
}

export function inchesToMm(inches: number): number {
  return inches * MM_PER_INCH;
}

export function mmToInches(mm: number): number {
  return mm / MM_PER_INCH;
}

export function sqFeetToSqMeters(sqFt: number): number {
  return sqFt * SQ_METERS_PER_SQ_FOOT;
}

export function sqMetersToSqFeet(sqM: number): number {
  return sqM * SQ_FEET_PER_SQ_METER;
}

export function cuFeetToCuMeters(cuFt: number): number {
  return cuFt * CU_METERS_PER_CU_FOOT;
}

export function cuMetersToCuFeet(cuM: number): number {
  return cuM * CU_FEET_PER_CU_METER;
}

export function cuFeetToCuYards(cuFt: number): number {
  return cuFt / CU_FEET_PER_CU_YARD;
}

export function cuYardsToCuFeet(cuYd: number): number {
  return cuYd * CU_FEET_PER_CU_YARD;
}

export function gallonsToLiters(gal: number): number {
  return gal * LITERS_PER_US_GALLON;
}

export function litersToGallons(liters: number): number {
  return liters / LITERS_PER_US_GALLON;
}

export function lbToKg(lb: number): number {
  return lb * KG_PER_LB;
}

export function kgToLb(kg: number): number {
  return kg * LB_PER_KG;
}
