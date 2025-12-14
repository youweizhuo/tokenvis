# Tasks

## 1. Update span node styling

- [x] 1.1 Add OKLCH gradient helper to `lib/palette.ts` that generates light gradient from agent color
- [x] 1.2 Update `SpanNode` to use gradient background instead of white fill
- [x] 1.3 Change border-radius from `rounded-full` to `rounded-sm` for rectangular appearance
- [x] 1.4 Add fixed height with `overflow-hidden`, `whitespace-nowrap`, and `text-ellipsis` for text truncation
- [x] 1.5 Remove multi-line text wrapping behavior

## 2. Fix timeline zero alignment

- [x] 2.1 Review timeline tick generation in `trace-canvas.tsx`
- [x] 2.2 Ensure "0 ms" tick aligns with x=0 where first span can start
- [x] 2.3 Verify alignment at different zoom levels

## 3. Clean up left pane

- [x] 3.1 Remove Time Range placeholder slider and text from `trace-viewer.tsx`
- [x] 3.2 Remove Style Preset buttons from `trace-viewer.tsx`
- [x] 3.3 Remove Minimap toggle checkbox from `trace-viewer.tsx`
- [x] 3.4 Remove `showMinimap` state variable since it's no longer used

## 4. Validation

- [x] 4.1 Verify span nodes render with gradient fill and rectangular shape
- [x] 4.2 Verify text truncates with ellipsis when node is too narrow
- [x] 4.3 Verify node height stays fixed during zoom
- [x] 4.4 Verify timeline "0 ms" aligns with x=0
- [x] 4.5 Verify left pane only shows agent filters
