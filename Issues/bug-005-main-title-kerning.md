# Bug 005: Main Title Kerning Issue

## Description
Main title kerning is broken and needs to use proper auto kerning instead of manual letter spacing.

## Current Behavior
- Uses manual letter spacing simulation with `renderTextWithLetterSpacing()`
- Applies -6px letter spacing manually character by character
- Doesn't use native font kerning properly
- Results in unnatural character spacing

## Expected Behavior
- Should use `ctx.fontKerning = 'auto'` for proper kerning
- Native font kerning should handle character spacing
- Should maintain professional typography appearance
- Letter spacing should work with auto kerning, not replace it

## Location
- File: `index.html`
- Function: `renderMainTitle()` (line 661)
- Helper: `renderTextWithLetterSpacing()` (line 754)
- Issue: Manual character-by-character rendering

## Priority
High

## Status
Open

## Solution Approach
1. Remove manual letter spacing simulation
2. Use native `ctx.fillText()` with proper font settings
3. Enable `ctx.fontKerning = 'auto'` 
4. Test with different text combinations to ensure proper kerning