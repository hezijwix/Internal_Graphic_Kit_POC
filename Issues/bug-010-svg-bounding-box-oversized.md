# Bug 010 - SVG Logo Bounding Box Oversized

## Issue Description
The Wix logo SVG has a bounding box that appears much larger than the actual visible graphics. The blue debug bounding box shows dimensions that don't match the visual content.

## Current Behavior
- Debug overlay shows logo bounding box as ~129px × 85px  
- Visual inspection reveals the bounding box extends far beyond the actual "WI" letters
- SVG appears to have extra whitespace or invisible elements

## Expected Behavior
- Bounding box should tightly wrap around the visible "WI" graphics
- No unnecessary whitespace in the SVG viewBox
- Debug overlay should accurately represent the visual content area

## Technical Details
- **Original SVG**: `viewBox="0 0 961.81 383.67"` (includes full "WIX" + whitespace)
- **Processed SVG**: Cropped to `viewBox="0 0 586.06 383.67"` (just "WI" portion)
- **Cache dimensions**: Updated to `586.06 × 383.67`
- **Debug calculation**: Uses aspect ratio `586.06 / 383.67`

## Attempted Solutions
1. **Programmatic SVG optimization**: Modified `loadWixLogo()` to crop viewBox and remove "X" path
2. **Updated cache dimensions**: Changed `originalWidth` from `961.81` to `586.06`
3. **Updated debug overlay**: Fixed aspect ratio calculation
4. **Regex replacements**: Attempted to remove duplicate content and extra paths

## Root Cause Analysis Needed
The SVG likely contains:
- Hidden or invisible elements extending the bounds
- Incorrect viewBox that doesn't match actual content
- Extra whitespace or padding within the graphic paths themselves
- Potential issues with how the SVG was exported from the design tool

## Recommended Solution
**Option 1 (Preferred)**: Re-export SVG from Adobe Illustrator
- Open current `wix.svg` in Illustrator
- Select and delete the "X" character (keep only "WI")
- Use "Object → Artboard → Fit to Selected Art" to crop artboard
- Export with minimal settings (no extra whitespace)

**Option 2**: Manual SVG cleanup
- Analyze the actual path coordinates to find content bounds
- Manually adjust viewBox to match true content dimensions
- Remove any invisible or duplicate elements

## Priority
Medium - Visual debugging tool accuracy issue, doesn't affect end user functionality

## Files Affected
- `graphic_assets/wix.svg` (source file)
- `template/components/icon-renderer.js` (processing logic)
- `template/components/debug-overlay.js` (visualization)

## Notes
This issue affects the accuracy of the debug visualization but doesn't impact the actual logo rendering for end users. The logo displays correctly; only the debug bounding box is oversized. 