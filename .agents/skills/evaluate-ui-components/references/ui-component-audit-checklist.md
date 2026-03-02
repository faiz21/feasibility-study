# UI Component Audit Checklist

Use this checklist during component review. Mark each item as `pass`, `needs-work`, or `n/a`.

## 1) Spacing and Padding
- Outer margin matches neighboring section rhythm.
- Internal padding follows token scale (no random pixel values).
- Vertical spacing between text blocks is consistent.
- Related controls use consistent gaps.
- Dense/compact variants still preserve readability.

## 2) Alignment and Layout
- Content aligns to a clear grid or alignment axis.
- Mixed elements (icon/text/button) are optically aligned.
- Card/list rows have consistent start and end alignment.
- No accidental off-by-1 visual shifts across similar components.

## 3) Typography and Hierarchy
- Heading/body/caption sizes follow design scale.
- Line-height supports readability at all sizes.
- Weight and color encode hierarchy consistently.
- Truncation/wrapping behavior is intentional.

## 4) Visual Consistency
- Border radius, shadows, and stroke weight match system.
- Colors come from approved tokens.
- For report/client-themed surfaces, standardized tokens are present and used (`core UI`, `status`, `report semantic` token groups).
- Interactive states (hover/focus/active/disabled) are coherent.
- Empty/loading/error states align with the component family.

## 5) Responsiveness
- Layout remains balanced at mobile, tablet, and desktop widths.
- Spacing scales intentionally across breakpoints.
- Tap targets remain usable on touch screens.
- No overflow/cropping at common viewport sizes.

## 6) Accessibility-Related UI Quality
- Text/background contrast appears compliant.
- Focus indicators are visible and not clipped.
- Click/tap targets are large enough.
- State changes are perceivable without color-only cues.

## 7) Implementation Hygiene
- Uses tokens/utilities instead of hard-coded arbitrary values.
- Variant styles are centralized and not duplicated excessively.
- Storybook stories cover key states and density/size variants.
- Fix recommendations avoid API-breaking changes unless required.
