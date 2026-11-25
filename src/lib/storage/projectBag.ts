import { safeCeil } from '../math/rounding';
import type { UnitSystem } from '../math/units';

export type EstimatorType =
  | 'paint'
  | 'concrete'
  | 'mulch'
  | 'tile'
  | 'fence'
  | 'gravel';

export interface ProjectZoneItem {
  id: string;
  estimator: EstimatorType;
  zoneName: string;
  unitSystem: UnitSystem;
  dimensionsSummary: string;
  primaryQuantityLabel: string;
  /** Exact unrounded material quantity used to re-aggregate combined zones */
  exactMetrics: {
    // Paint
    gallonsExact?: number;
    litersExact?: number;
    // Concrete
    orderCuFt?: number;
    bagYieldFt3?: number;
    // Mulch
    mulchOrderCuFt?: number;
    // Tile
    baseTilesWithWaste?: number;
    piecesPerBox?: number;
    // Fence
    posts?: number;
    rails?: number;
    pickets?: number;
    fenceConcreteBags?: number;
    // Gravel
    gravelOrderCuYd?: number;
    gravelUsTons?: number;
  };
  estimatedCost: number;
  enabled: boolean;
  createdAt: string;
}

export interface ProjectBagState {
  version: 1;
  unitSystem: UnitSystem;
  items: ProjectZoneItem[];
}

const STORAGE_KEY = 'homecalc_pro_project_bag_v1';
export const PROJECT_BAG_EVENT = 'homecalc:project-bag-updated';

const DEFAULT_STATE: ProjectBagState = {
  version: 1,
  unitSystem: 'imperial',
  items: [],
};

function canUseStorage(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
}

function isValidItem(raw: unknown): raw is ProjectZoneItem {
  if (typeof raw !== 'object' || raw === null) return false;
  const obj = raw as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.estimator === 'string' &&
    typeof obj.zoneName === 'string' &&
    typeof obj.dimensionsSummary === 'string' &&
    typeof obj.primaryQuantityLabel === 'string' &&
    typeof obj.enabled === 'boolean' &&
    typeof obj.exactMetrics === 'object' &&
    obj.exactMetrics !== null
  );
}

export function loadProjectBag(): ProjectBagState {
  if (!canUseStorage()) {
    return { ...DEFAULT_STATE, items: [] };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE, items: [] };
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return { ...DEFAULT_STATE, items: [] };
    }
    const obj = parsed as Record<string, unknown>;
    if (obj.version !== 1) {
      return { ...DEFAULT_STATE, items: [] };
    }
    const unitSystem: UnitSystem =
      obj.unitSystem === 'metric' ? 'metric' : 'imperial';
    const items = Array.isArray(obj.items) ? obj.items.filter(isValidItem) : [];
    return { version: 1, unitSystem, items };
  } catch {
    return { ...DEFAULT_STATE, items: [] };
  }
}

export function saveProjectBag(state: ProjectBagState): boolean {
  if (!canUseStorage()) return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(PROJECT_BAG_EVENT, { detail: state }));
    return true;
  } catch {
    // Storage full or blocked in private browsing
    return false;
  }
}

export function addZoneToBag(
  item: Omit<ProjectZoneItem, 'id' | 'enabled' | 'createdAt'>
): ProjectBagState {
  const current = loadProjectBag();
  const nextItem: ProjectZoneItem = {
    ...item,
    id: `${item.estimator}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    enabled: true,
    createdAt: new Date().toISOString(),
  };
  const nextState: ProjectBagState = {
    ...current,
    items: [...current.items, nextItem],
  };
  saveProjectBag(nextState);
  return nextState;
}

export function toggleZoneInBag(id: string): ProjectBagState {
  const current = loadProjectBag();
  const nextState: ProjectBagState = {
    ...current,
    items: current.items.map((item) =>
      item.id === id ? { ...item, enabled: !item.enabled } : item
    ),
  };
  saveProjectBag(nextState);
  return nextState;
}

export function removeZoneFromBag(id: string): ProjectBagState {
  const current = loadProjectBag();
  const nextState: ProjectBagState = {
    ...current,
    items: current.items.filter((item) => item.id !== id),
  };
  saveProjectBag(nextState);
  return nextState;
}

export function clearProjectBag(): ProjectBagState {
  const current = loadProjectBag();
  const nextState: ProjectBagState = {
    ...current,
    items: [],
  };
  saveProjectBag(nextState);
  return nextState;
}

export function setStoredUnitSystem(unitSystem: UnitSystem): ProjectBagState {
  const current = loadProjectBag();
  const nextState: ProjectBagState = {
    ...current,
    unitSystem,
  };
  saveProjectBag(nextState);
  return nextState;
}

export interface AggregatedMaterialLine {
  estimator: EstimatorType;
  title: string;
  zoneCount: number;
  combinedSummary: string;
  individualSumNote?: string;
}

/**
 * Re-aggregates exact material quantities across enabled zones by estimator type
 * so multi-zone projects minimize rounding waste.
 */
export function aggregateProjectMaterials(
  items: ProjectZoneItem[]
): AggregatedMaterialLine[] {
  const active = items.filter((i) => i.enabled);
  const lines: AggregatedMaterialLine[] = [];

  const paintItems = active.filter((i) => i.estimator === 'paint');
  if (paintItems.length > 0) {
    const totalGal = paintItems.reduce(
      (sum, i) => sum + (i.exactMetrics.gallonsExact ?? 0),
      0
    );
    const totalL = paintItems.reduce(
      (sum, i) => sum + (i.exactMetrics.litersExact ?? 0),
      0
    );
    const combinedGal = safeCeil(totalGal);
    const sumIndividualGal = paintItems.reduce(
      (sum, i) => sum + safeCeil(i.exactMetrics.gallonsExact ?? 0),
      0
    );
    lines.push({
      estimator: 'paint',
      title: 'Paint (Combined Zones)',
      zoneCount: paintItems.length,
      combinedSummary: `${combinedGal} gal (${safeCeil(totalL)} L) — exact ${totalGal.toFixed(2)} gal`,
      individualSumNote:
        sumIndividualGal > combinedGal
          ? `Saves ${sumIndividualGal - combinedGal} gal vs. buying per-room`
          : undefined,
    });
  }

  const concItems = active.filter((i) => i.estimator === 'concrete');
  if (concItems.length > 0) {
    const totalCuFt = concItems.reduce(
      (sum, i) => sum + (i.exactMetrics.orderCuFt ?? 0),
      0
    );
    const combinedBags80 = safeCeil(totalCuFt / 0.6);
    lines.push({
      estimator: 'concrete',
      title: 'Concrete (Combined Zones)',
      zoneCount: concItems.length,
      combinedSummary: `${combinedBags80} × 80 lb bags (${(totalCuFt / 27).toFixed(2)} cu yd / ${totalCuFt.toFixed(1)} cu ft)`,
    });
  }

  const mulchItems = active.filter((i) => i.estimator === 'mulch');
  if (mulchItems.length > 0) {
    const totalCuFt = mulchItems.reduce(
      (sum, i) => sum + (i.exactMetrics.mulchOrderCuFt ?? 0),
      0
    );
    lines.push({
      estimator: 'mulch',
      title: 'Mulch (Combined Beds)',
      zoneCount: mulchItems.length,
      combinedSummary: `${(totalCuFt / 27).toFixed(2)} cu yd (${safeCeil(totalCuFt / 2)} × 2 cu ft bags)`,
    });
  }

  const tileItems = active.filter((i) => i.estimator === 'tile');
  if (tileItems.length > 0) {
    const totalTiles = safeCeil(
      tileItems.reduce(
        (sum, i) => sum + (i.exactMetrics.baseTilesWithWaste ?? 0),
        0
      )
    );
    const totalBoxes = tileItems.reduce(
      (sum, i) =>
        sum +
        safeCeil(
          (i.exactMetrics.baseTilesWithWaste ?? 0) /
            Math.max(1, i.exactMetrics.piecesPerBox ?? 1)
        ),
      0
    );
    lines.push({
      estimator: 'tile',
      title: 'Tile (Combined Areas)',
      zoneCount: tileItems.length,
      combinedSummary: `${totalTiles} tiles (${totalBoxes} boxes)`,
    });
  }

  const fenceItems = active.filter((i) => i.estimator === 'fence');
  if (fenceItems.length > 0) {
    const posts = fenceItems.reduce((s, i) => s + (i.exactMetrics.posts ?? 0), 0);
    const rails = fenceItems.reduce((s, i) => s + (i.exactMetrics.rails ?? 0), 0);
    const pickets = fenceItems.reduce(
      (s, i) => s + (i.exactMetrics.pickets ?? 0),
      0
    );
    const bags = fenceItems.reduce(
      (s, i) => s + (i.exactMetrics.fenceConcreteBags ?? 0),
      0
    );
    lines.push({
      estimator: 'fence',
      title: 'Fencing (Combined Runs)',
      zoneCount: fenceItems.length,
      combinedSummary: `${posts} posts · ${rails} rails · ${pickets} pickets · ${bags} concrete bags`,
    });
  }

  const gravelItems = active.filter((i) => i.estimator === 'gravel');
  if (gravelItems.length > 0) {
    const totalYd = gravelItems.reduce(
      (s, i) => s + (i.exactMetrics.gravelOrderCuYd ?? 0),
      0
    );
    const totalTons = gravelItems.reduce(
      (s, i) => s + (i.exactMetrics.gravelUsTons ?? 0),
      0
    );
    lines.push({
      estimator: 'gravel',
      title: 'Gravel (Combined Areas)',
      zoneCount: gravelItems.length,
      combinedSummary: `${totalTons.toFixed(2)} US tons (${totalYd.toFixed(2)} cu yd)`,
    });
  }

  return lines;
}
