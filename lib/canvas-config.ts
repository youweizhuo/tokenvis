/**
 * Centralized canvas configuration for trace visualization.
 *
 * All layout constants are defined here with typed defaults and
 * optional override capability, eliminating hardcoded magic numbers.
 */

/** Layout constants for the trace canvas */
export interface CanvasLayoutConfig {
  /** Height of the timeline header in pixels */
  headerOffset: number;
  /** Width of the location label gutter in pixels */
  gutterWidth: number;
  /** Height of each swimlane in pixels */
  laneHeight: number;
  /** Pixels per microsecond for time-to-position conversion */
  pixelsPerMicrosecond: number;
}

/** Zoom configuration for the canvas viewport */
export interface CanvasZoomConfig {
  /** Minimum zoom level (0.25 = 25%) */
  minZoom: number;
  /** Maximum zoom level (2.5 = 250%) */
  maxZoom: number;
  /** Padding ratio for fitView (0.2 = 20% padding) */
  fitViewPadding: number;
}

/** World/viewport extent configuration */
export interface CanvasExtentConfig {
  /** Multiplier for world width relative to trace duration */
  worldWidthMultiplier: number;
  /** Minimum world width in pixels */
  minWorldWidth: number;
}

/** Node rendering configuration */
export interface CanvasNodeConfig {
  /** Minimum node width in pixels */
  nodeMinWidth: number;
  /** Top margin within each lane in pixels */
  laneTopMargin: number;
  /** Node height as ratio of lane height (0.8 = 80%) */
  nodeHeightRatio: number;
  /** Minimum node height in pixels */
  nodeMinHeight: number;
}

/** Timeline rendering configuration */
export interface CanvasTimelineConfig {
  /** Target number of timeline ticks */
  desiredTimelineTicks: number;
}

/** Background rendering configuration */
export interface CanvasBackgroundConfig {
  /** Gap between background dots in pixels */
  backgroundGap: number;
}

/** Complete canvas configuration */
export interface CanvasConfig {
  layout: CanvasLayoutConfig;
  zoom: CanvasZoomConfig;
  extent: CanvasExtentConfig;
  node: CanvasNodeConfig;
  timeline: CanvasTimelineConfig;
  background: CanvasBackgroundConfig;
}

/** Default canvas configuration values */
export const defaultCanvasConfig: CanvasConfig = {
  layout: {
    headerOffset: 40,
    gutterWidth: 120,
    laneHeight: 80,
    pixelsPerMicrosecond: 0.0001,
  },
  zoom: {
    minZoom: 0.25,
    maxZoom: 2.5,
    fitViewPadding: 0.2,
  },
  extent: {
    worldWidthMultiplier: 10,
    minWorldWidth: 4000,
  },
  node: {
    nodeMinWidth: 12,
    laneTopMargin: 4,
    nodeHeightRatio: 0.8,
    nodeMinHeight: 40,
  },
  timeline: {
    desiredTimelineTicks: 7,
  },
  background: {
    backgroundGap: 16,
  },
};

/**
 * Merge partial config with defaults.
 * @param overrides Partial configuration to merge with defaults
 * @returns Complete canvas configuration
 */
export function mergeCanvasConfig(
  overrides: Partial<{
    layout?: Partial<CanvasLayoutConfig>;
    zoom?: Partial<CanvasZoomConfig>;
    extent?: Partial<CanvasExtentConfig>;
    node?: Partial<CanvasNodeConfig>;
    timeline?: Partial<CanvasTimelineConfig>;
    background?: Partial<CanvasBackgroundConfig>;
  }> = {}
): CanvasConfig {
  return {
    layout: { ...defaultCanvasConfig.layout, ...overrides.layout },
    zoom: { ...defaultCanvasConfig.zoom, ...overrides.zoom },
    extent: { ...defaultCanvasConfig.extent, ...overrides.extent },
    node: { ...defaultCanvasConfig.node, ...overrides.node },
    timeline: { ...defaultCanvasConfig.timeline, ...overrides.timeline },
    background: { ...defaultCanvasConfig.background, ...overrides.background },
  };
}
