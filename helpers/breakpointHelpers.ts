export const getMaxWidthMediaQuery = (breakpoint: number) : string =>
  `@media (max-width: ${breakpoint}px)`;

export const getMinWidthMediaQuery = (breakpoint: number): string =>
  // Since both the min and max width queries are inclusive, we add 1 to the breakpoint here so that
  // the min and max queries are consistent for a screen with width equal to the breakpoint.
  `@media (min-width: ${breakpoint + 1}px)`;

export const getInBetweenWidthMediaQuery = (
  minBreakpoint: number,
  maxBreakpoint: number
): string =>
  `@media (min-width: ${
    minBreakpoint + 1
  }px) and (max-width: ${maxBreakpoint}px)`;
