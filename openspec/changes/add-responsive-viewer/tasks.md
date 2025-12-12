## 1. Implementation
- [x] 1.1 Build a responsive three-panel layout shell: left (collapsible controls), center canvas, right (collapsible details).
- [x] 1.2 Left panel: show trace name, TokenVis brand, agent filters, style presets, time range selector; make it hide/show via toggle.
- [x] 1.3 Center: host existing React Flow canvas without obstruction.
- [x] 1.4 Right panel: appears on node click to show span details; collapsible/closable.
- [x] 1.5 Add mobile behavior (stack/slide) with toggles for both side panels.

## 2. Validation
- [x] 2.1 Run lint/tests.
- [x] 2.2 Manual check desktop and narrow viewport: panels toggle; canvas remains usable; node selection populates details panel.
- [x] 2.3 Run `openspec validate add-responsive-viewer --strict`.
