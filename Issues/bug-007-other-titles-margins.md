# Bug 007: Other Titles Margin Compliance Issue

## Description
Other titles (Top Title, Subtitle1, Subtitle2) need to properly respect the 230px left/right margins for consistency.

## Current Behavior
- Some titles may not fully respect the 230px margin constraints
- Auto-sizing logic may not be consistent across all text elements
- Different margin calculations between title elements

## Expected Behavior
- All text elements should respect 230px left and right margins
- Consistent auto-sizing behavior across all titles
- Uniform margin enforcement for visual alignment
- Text should break or resize when exceeding margin boundaries

## Location
- File: `index.html`
- Functions: 
  - `renderTopTitle()` (line 639)
  - `renderSubtitle1()` (line 786) 
  - `renderSubtitle2()` (line 809)
- Issue: Margin calculation and enforcement

## Priority
High

## Status
Open

## Solution Approach
1. Verify all titles use `canvas.width - (leftRightMargins * 2)`
2. Ensure consistent margin variable usage
3. Test with long text in all fields
4. Standardize auto-sizing logic across all elements