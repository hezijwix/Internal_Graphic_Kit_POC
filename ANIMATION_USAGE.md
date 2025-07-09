# GSAP Animation System - Motion Designer Guide

## Overview
The animation system provides a 5-second timeline at 30fps with sequential element animations using opacity and Y position (10% offset = 108px).

## How to Use

### 1. Animation Controls (Bottom Bar)
- **Play/Pause Button**: Start/stop the animation
- **Reset Button**: Reset animation to beginning
- **Timeline Scrubber**: Scrub through the 5-second timeline
- **Ease Input**: Enter custom GSAP ease strings
- **Apply Button**: Apply custom ease to all animations

### 2. Animation Sequence
Elements animate in this order:
1. **Logo** (if visible)
2. **Top Title** (if not empty)
3. **Main Title** (if not empty)
4. **Subtitle 1** (if visible and not empty)
5. **Subtitle 2** (if visible and not empty)
6. **Icons** (if count > 0)

### 3. Timing Calculation
- **Total Duration**: 5 seconds
- **Stagger Delay**: `5 / elementCount` seconds
- **Animation Duration**: `min(1.5, staggerDelay * 0.8)` seconds per element

**Examples:**
- 2 elements: 2.5s between animations
- 4 elements: 1.25s between animations
- 6 elements: ~0.83s between animations

### 4. Custom Ease Strings
You can use any GSAP ease string in the Ease input field:

**Common Eases:**
- `power2.out` (default)
- `power3.inOut`
- `back.out(1.7)`
- `elastic.out(1, 0.3)`
- `bounce.out`
- `sine.inOut`

**Custom Cubic Bezier:**
- `"cubic-bezier(0.25, 0.46, 0.45, 0.94)"`

### 5. Element Properties
Each element animates with:
- **Opacity**: 0 → 1
- **Y Position**: +108px offset → final position
- **X Position**: Always centered (no animation)

### 6. Dynamic Adjustment
The system automatically adjusts for:
- Different numbers of active elements
- Empty text fields (skipped)
- Hidden elements (not animated)
- Main title height variations

## Technical Details

### Animation State
```javascript
window.animationState = {
  'logo-element': { opacity: 0.5, y: 540, offsetY: 54, isAnimating: true },
  'main-title-element': { opacity: 0, y: 648, offsetY: 108, isAnimating: true }
}
```

### Element IDs
- Logo: `logo-element`
- Top Title: `top-title-element`
- Main Title: `main-title-element`
- Subtitle 1: `subtitle1-element`
- Subtitle 2: `subtitle2-element`
- Icons: `icons-element`

### Console Commands
```javascript
// Play animation
window.GSAPTimelineController.play();

// Pause animation
window.GSAPTimelineController.pause();

// Reset animation
window.GSAPTimelineController.reset();

// Scrub to specific time (0-5 seconds)
window.GSAPTimelineController.scrubTo(2.5);

// Set custom ease
window.GSAPTimelineController.setCustomEase('back.out(1.7)');

// Get animation info
window.GSAPTimelineController.getAnimationInfo();
```

## Workflow for Motion Designer

1. **Set Template Content**: Use the left panel to configure text and elements
2. **Play Animation**: Click the Play button to see the current sequence
3. **Adjust Timing**: Use the timeline scrubber to find specific moments
4. **Apply Custom Ease**: Enter your preferred GSAP ease string and click Apply
5. **Fine-tune**: Repeat until you achieve the desired motion feel

## Next Steps
- More animation properties (scale, rotation, etc.)
- Individual element timing controls
- Animation preset library
- Export animation settings