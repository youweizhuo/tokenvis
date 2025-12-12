import { useMemo } from "react";

import { layoutToFlow, SpanInput } from "./layout";

type Options = {
  pixelsPerMicrosecond?: number;
  laneHeight?: number;
};

export function useTraceLayout(spans: SpanInput[], options: Options = {}) {
  return useMemo(() => layoutToFlow(spans, options), [spans, options]);
}

