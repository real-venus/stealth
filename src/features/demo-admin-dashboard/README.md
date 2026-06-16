# Demo Admin Dashboard

This folder contains the isolated demo-admin dashboard slice for maintainers who need to populate and review fake demo UI data. It intentionally avoids production mail flows, live network calls, real user records, and route/app-shell integration.

## Responsive width notes

| Width         | Breakpoint | Layout rule                                           | Review expectation                                               |
| ------------- | ---------- | ----------------------------------------------------- | ---------------------------------------------------------------- |
| 768px–1023px  | Tablet     | One-column data cards with controls stacked first     | No horizontal scrolling; touch controls remain above data cards. |
| 1024px–1439px | Laptop     | Two-column data cards plus a compact review rail      | Cards balance across two columns and width notes stay visible.   |
| 1440px+       | Desktop    | Three-column data cards plus an expanded review panel | Maintainers can scan data areas and layout checks side by side.  |

## Layout checks

- Controls precede data cards on tablet widths.
- Laptop widths use a two-up card grid without requiring unrelated app-shell changes.
- Desktop widths keep responsive review notes visible next to the card grid.

## Validation

Run the local responsive helper test:

```bash
npx vitest run src/features/demo-admin-dashboard/__tests__/layout.test.ts
```

The fixture data in `fixtures/demoData.ts` is deterministic, fake, and safe for public repository review.
