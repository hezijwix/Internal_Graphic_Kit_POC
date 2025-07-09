# Bug 004: Main Title Max Lines Issue

## Description
Main title should have maximum 2 lines of text to maintain layout consistency and readability.

## Current Behavior
- Main title can potentially break into more than 2 lines with very long text
- No explicit limit on number of lines
- Layout calculations assume 2 lines but don't enforce it

## Expected Behavior
- Main title should never exceed 2 lines of text
- Very long text should be truncated or auto-sized to fit within 2 lines
- Line breaking algorithm should distribute text optimally across 2 lines

## Location
- File: `index.html`
- Functions: `getMainTitleDimensions()` (line 442), `renderMainTitle()` (line 661)
- Logic: Line breaking and layout calculation

## Priority
High

## Status
Open

## Solution Approach
1. Add explicit 2-line limit check
2. Improve line breaking algorithm for better text distribution
3. Handle edge cases with very long text
4. Ensure auto-sizing works within 2-line constraint