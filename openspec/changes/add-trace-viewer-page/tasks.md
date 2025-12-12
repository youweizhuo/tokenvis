## 1. Implementation
- [x] 1.1 Compose the root page with header, status states (loading, error, empty), and the React Flow canvas backed by `useTraceLayout`.
- [x] 1.2 Load the kitchen-sink trace via data layer APIs/loader; surface errors and seed instructions when missing.
- [x] 1.3 Add minimal UI controls (refresh/reseed link) and labels so the viewer is understandable on first run.

## 2. Validation
- [x] 2.1 Run lint/tests.
- [x] 2.2 Start dev server and verify `/` renders the seeded example without errors.
- [x] 2.3 Run `openspec validate add-trace-viewer-page --strict`.
