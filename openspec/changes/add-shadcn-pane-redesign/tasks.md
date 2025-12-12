## 1. Implementation
- [ ] 1.1 Install/ensure Shadcn UI dependencies and theme tokens; align Tailwind config with pastel palette.
- [ ] 1.2 Rebuild left controls panel using Shadcn components (Sheet/Drawer on mobile, Card/List/Accordion, Buttons, Select/Inputs, Sliders for time range, Badges for agents).
- [ ] 1.3 Rebuild right details panel with Shadcn (Sheet/Drawer on mobile, Card for node details, Tabs/Accordion for metadata).
- [ ] 1.4 Update canvas toolbar/legend/timeline badges to use Shadcn Buttons/Badges/Tooltip; keep canvas unobstructed.
- [ ] 1.5 Wire responsive behavior: desktop collapsible sidebars, mobile slide-in sheets with toggles.

## 2. Validation
- [ ] 2.1 Run lint/tests.
- [ ] 2.2 Manual check desktop and mobile widths: panels toggle via Shadcn sheets/drawers; canvas remains central; controls usable.
- [ ] 2.3 Run `openspec validate add-shadcn-pane-redesign --strict`.
