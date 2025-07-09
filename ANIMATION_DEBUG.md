# Animation System Debug Guide

## Console Commands for Testing

Open the browser console (F12) and use these commands to debug the animation system:

### 1. Check System Status
```javascript
window.GSAPTimelineController.debug();
```

### 2. Manual Animation Test
```javascript
// Test the animation manually
window.GSAPTimelineController.play();
```

### 3. Check Animation State
```javascript
// Check current animation state
console.log(window.animationState);
```

### 4. Check Template State
```javascript
// Check template configuration
console.log(window.templateState);
```

### 5. Check Active Elements
```javascript
// See which elements are detected
console.log(window.GSAPTimelineController.getActiveElementsInOrder());
```

### 6. Test Individual Element
```javascript
// Test animating a single element
gsap.to(window.animationState.logo, {
    duration: 1,
    opacity: 1,
    ease: "circ.out",
    onUpdate: () => window.renderTemplate()
});
```

### 7. Reset System
```javascript
// Reset the animation system
window.GSAPTimelineController.reset();
```

### 8. Force Render
```javascript
// Force a canvas render
window.renderTemplate();
```

## Expected Behavior

1. **On Page Load**: All elements should be hidden (opacity 0)
2. **Click Play**: Elements should fade in sequentially with 10-frame intervals (0.333s between elements)
3. **Console Logs**: Should show animation start/complete messages
4. **Debug Command**: Should show all system components as available
5. **Timeline**: Running at 30fps with smooth scrubbing

## Common Issues

- **No elements detected**: Check if templateState is properly initialized
- **Animation not starting**: Check if GSAP is loaded and timeline is created
- **Elements not hiding**: Check if renderTemplate is being called
- **Timeline not working**: Check if motion controls are properly connected

## Quick Fix Commands

```javascript
// If elements aren't hidden initially:
window.GSAPTimelineController.initializeElementStates();

// If animation controls aren't working:
window.MotionControls.init();

// If renderTemplate isn't working:
window.renderTemplate();
```