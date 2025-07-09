# Bug 006: Main Title Max Size Issue

## Description
Main title max size should be larger than current 180px to create more visual impact.

## Current Behavior
- Maximum font size is limited to 180px
- May not provide sufficient visual hierarchy
- Title appears smaller than intended for short text

## Expected Behavior
- Increase maximum font size to provide better visual impact
- Suggested new max size: 240px or higher
- Maintain auto-sizing functionality for longer text
- Ensure proper scaling within 230px margins

## Location
- File: `index.html`
- Functions: `getMainTitleDimensions()` (line 444), `renderMainTitle()` (line 669)
- Parameter: `maxFontSize = 180`

## Priority
High

## Status
Open

## Solution Approach
1. Increase `maxFontSize` parameter (suggest 240px)
2. Test auto-sizing behavior with new max size
3. Verify layout maintains proper proportions
4. Ensure line breaking still works correctly