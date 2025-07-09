# Bug 008: Empty Textbox Hidden Element Issue

## Description
Empty textbox in the side panel should behave as hidden element in the layout calculation.

## Current Behavior
- Empty text fields still reserve space in layout
- Elements with only whitespace are treated as visible
- Layout doesn't adjust when fields are empty
- May cause unnecessary spacing gaps

## Expected Behavior
- Empty or whitespace-only text fields should be treated as hidden
- Layout should recalculate to skip empty elements
- Maintain proper 26px spacing between visible elements only
- Dynamic layout adjustment based on content presence

## Location
- File: `index.html`
- Function: `renderTemplate()` (line 503)
- Logic: Element visibility and layout calculation
- Elements affected: Top Title, Main Title, Subtitle1, Subtitle2

## Priority
High

## Status
Open

## Solution Approach
1. Add text content validation (empty/whitespace check)
2. Update layout calculation to skip empty elements
3. Modify element visibility logic in `renderTemplate()`
4. Ensure proper spacing between remaining visible elements