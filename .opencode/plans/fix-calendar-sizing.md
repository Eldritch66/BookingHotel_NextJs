# Fix Calendar Sizing - Scale All Elements

## Problem
Calendar cells (`--cell-size`) are 28px which is too small. Currently only the popover container was widened, creating empty space. Need to scale ALL calendar elements proportionally.

## Changes

### File: `components/ui/calendar.tsx`

| # | Line | Change | Reason |
|---|------|--------|--------|
| 1 | 34 | `p-2 [--cell-size:--spacing(7)]` → `p-4 [--cell-size:--spacing(11)]` | Cell 28px → 44px, more padding |
| 2 | 49 | `gap-4` → `gap-6` | More space between months |
| 3 | 52 | `gap-4` → `gap-5` | More space within month sections |
| 4 | 54 | `gap-1` → `gap-2` | Nav buttons spacing |
| 5 | 72 | `text-sm` → `text-base` | Month dropdown font bigger |
| 6 | 86 | `text-sm` → `text-base` | Caption label bigger |
| 7 | 87 | `text-sm` → `text-base`, `[&>svg]:size-3.5` → `[&>svg]:size-4` | Dropdown caption bigger |
| 8 | 93 | `text-[0.8rem]` → `text-sm` | Weekday header bigger |
| 9 | 96 | `mt-2` → `mt-3` | More row spacing |
| 10 | 102 | `text-[0.8rem]` → `text-sm` | Week number bigger |
| 11 | 113 | `after:w-4` → `after:w-8` | Range connector wider (proportional) |
| 12 | 118 | `after:w-4` → `after:w-8` | Range connector wider (proportional) |
| 13 | 150,155,161 | `size-4` → `size-5` | Chevron icons bigger |
| 14 | 213 | Add `text-base` before `font-normal`, `[&>span]:text-xs` → `[&>span]:text-sm` | Day numbers bigger |

### File: `app/_components/DateRangePicker.tsx`

| # | Line | Change | Reason |
|---|------|--------|--------|
| 1 | ~52 | `min-w-[600px]` → `min-w-[800px]` | Popover wide enough for 2 large months |

## Verification
Run `npx tsc --noEmit` then `npx next build`
