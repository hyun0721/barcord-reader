# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
expo start                    # Start dev server
expo run:ios                  # Build & run on iOS simulator
expo run:android              # Build & run on Android emulator
expo run:ios --device         # Run on connected iOS device

# EAS Build (production)
eas build --platform ios --profile preview
eas build --platform android --profile preview
```

No linting or test commands are configured.

## Architecture

**Stack:** React Native + Expo 54, TypeScript (strict), Expo Router (file-based tabs), Zustand + AsyncStorage, NativeWind (Tailwind CSS), New Architecture enabled.

**Screens** (`app/`): Two tabs — `index.tsx` (scan) and `history.tsx` (history list). `_layout.tsx` sets up tab navigation and calls `loadHistory()` on mount.

**State** (`store/scanStore.ts`): Zustand store with AsyncStorage sync. Records are prepended and capped at 100. `addScan` / `clearHistory` are async. History is keyed at `@scan_history`.

**Barcode scanning** (`components/BarcodeScanner.tsx`): Uses `expo-camera`. A `cooldownRef` prevents duplicate scans within 2 seconds. Auto-captures a photo on scan.

**Result flow**: Scan → `addScan()` in store → `ResultCard` shown in modal with actions (copy value, copy image, save to gallery).

**Utilities:**
- `utils/barcodeParser.ts` — detects content type (url/email/phone/text)
- `utils/barcodeFormats.ts` — metadata for 12 supported barcode formats
- `constants/theme.ts` — shared design tokens (COLORS, TYPE_COLORS, RADIUS, SPACING)

**iOS image clipboard:** Uses `expo-file-system` + `expo-clipboard` with base64 encoding. This was a known bug (fixed in PR #6) — avoid using clipboard image APIs that skip the base64 path on iOS.

**Path alias:** `@/` maps to the project root (configured in `tsconfig.json`).
