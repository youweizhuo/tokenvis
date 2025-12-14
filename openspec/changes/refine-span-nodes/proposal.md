# Change: Refine Span Node Styling and Left Pane Cleanup

## Why

Current span nodes have a white fill and overly rounded corners that don't match modern timeline tools like Chrome DevTools and Perfetto. Additionally, when zooming, node width shrinks causing text to wrap to multiple lines (changing node height). The left pane has placeholder controls and a minimap toggle that should be removed. Timeline zero alignment with the first span is also misaligned.

## What Changes

- **Span node gradient fill**: Replace white fill with OKLCH gradient from border color to a lighter tint
- **Span node shape**: Change from `rounded-full` to subtle `rounded-sm` for a rectangular timeline bar appearance
- **Text overflow handling**: Use `text-ellipsis` and `overflow-hidden` with `whitespace-nowrap` to truncate long text with dots instead of wrapping
- **Fixed node height**: Ensure node height doesn't change regardless of content or zoom level
- **Timeline zero alignment**: Align the timeline "0 ms" marker with x=0 where the first span starts
- **Left pane cleanup**: Remove placeholder Time Range slider and Style Preset buttons; remove Minimap toggle entirely

## Impact

- Affected specs: `visualization`
- Affected code:
    - `components/span-node.tsx` - Node styling changes
    - `components/trace-canvas.tsx` - Timeline alignment
    - `components/trace-viewer.tsx` - Left pane cleanup
    - `lib/canvas-config.ts` - Node styling configuration

