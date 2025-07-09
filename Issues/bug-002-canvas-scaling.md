# Bug 002: Canvas Scaling Issue

## Description
The canvas doesn't grow back when scaling up the browser after shrinking it - doesn't maintain the "fit" feature.

## Current Behavior
- When browser window is shrunk, canvas scales down correctly
- When browser window is enlarged again, canvas doesn't scale back up
- Canvas remains at the smaller size even with larger available space
- "Fit" feature is not maintained during resize operations

## Expected Behavior
- Canvas should scale up when browser window is enlarged
- Canvas should maintain proper aspect ratio during all resize operations
- "Fit" feature should work bidirectionally (both shrinking and growing)

## Location
- File: `index.html`
- Function: `scaleCanvas()` (line 400-416)
- Event listener: `window.addEventListener('resize', scaleCanvas)` (line 826)

## Priority
High

## Status
Partially Fixed

## Update Log
### 2024 - Basic Scaling Fixed
- ✅ Fixed basic canvas scaling to fit the div properly
- ✅ Canvas now scales both up and down with browser window resize
- ✅ Maintains proper aspect ratio during resize operations
- ✅ "Fit" feature works bidirectionally

### 2024 - Smooth Scaling Issue
- ❌ **New Issue**: Smooth canvas scaling during divider drag doesn't work
- **Current**: Canvas only scales when mouse is released after dragging divider
- **Expected**: Canvas should scale smoothly in real-time during divider drag
- **Location**: `handleDrag()` function (line 381-396)
- **Status**: Needs further investigation and fix