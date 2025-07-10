// Simplified DOM GSAP Timeline Controller - Direct Element Animation
// Replaces complex Canvas-based animation with hardware-accelerated DOM animation

// Animation Settings - Same as original for consistency
window.animationSettings = {
    opacity: {
        duration: 2,
        ease: "power1.out"
    },
    yMovement: {
        duration: 2,
        ease: "power2.out",
        offsetPercent: 0.3 // 30% of element height for more visible movement
    },
    timing: {
        frameInterval: 10, // frames
        fps: 60
    }
};

window.GSAPTimelineController = {
    timeline: null,
    animationElements: [],
    
    // Initialize the animation system for DOM
    init: function() {
        // Set GSAP ticker to 60fps
        gsap.ticker.fps(60);
        
        console.log('DOM GSAP Timeline Controller initialized at 60fps');
        
        // Initialize all elements to final state for editing
        this.showFinalState();
    },
    
    // Get Y offset percentage for specific element types
    getYOffsetPercent: function(elementType) {
        // Main title gets reduced movement (10%), others get full movement (30%)
        return elementType === 'mainTitle' ? 0.1 : 0.3;
    },

    // Show final design state (all elements visible at final position)
    showFinalState: function() {
        const activeElements = this.getActiveElementsInOrder();
        
        console.log('Showing final design state for editing');
        
        // Set all elements to final state using GSAP
        activeElements.forEach(elementData => {
            const element = document.getElementById(elementData.id);
            if (element && element.style.display !== 'none') {
                gsap.set(element, {
                    opacity: 1,
                    y: 0
                });
            }
        });
        
        // Trigger template render to ensure content is updated
        if (typeof window.renderTemplate === 'function') {
            window.renderTemplate();
        }
        
        console.log('Final design state active - ready for editing');
    },
    
    // Build animation sequence for DOM elements
    buildAnimationSequence: function() {
        // Clear existing animations
        if (this.timeline) {
            this.timeline.kill();
        }
        
        // Create new timeline for single animation run
        this.timeline = gsap.timeline({
            onComplete: () => {
                console.log('Animation complete - returning to final state');
                this.showFinalState();
            }
        });
        
        // Get active elements in order
        const activeElements = this.getActiveElementsInOrder();
        
        if (activeElements.length === 0) {
            console.warn('No active elements found for animation');
            return;
        }
        
        this.animationElements = activeElements;
        
        // Calculate frame interval using settings
        const frameInterval = window.animationSettings.timing.frameInterval / window.animationSettings.timing.fps;
        
        console.log(`Building DOM animation sequence for ${activeElements.length} elements:`);
        console.log(`- Frame interval: ${frameInterval.toFixed(3)}s between elements`);
        console.log(`- Animation duration: ${window.animationSettings.opacity.duration}s per element`);
        console.log(`- Hardware acceleration: enabled via will-change: transform`);
        
        // Create animation for each element
        activeElements.forEach((elementData, index) => {
            const element = document.getElementById(elementData.id);
            if (!element || element.style.display === 'none') return;
            
            // Calculate Y offset for this element using element-specific percentage
            const elementHeight = this.getElementHeight(elementData.type);
            const offsetPercent = this.getYOffsetPercent(elementData.type);
            const yOffset = elementHeight * offsetPercent;
            
            console.log(`${elementData.type}: height=${elementHeight.toFixed(1)}px, offset=${(offsetPercent*100).toFixed(0)}%, yOffset=${yOffset.toFixed(1)}px`);
            
            // Add opacity animation to timeline
            this.timeline.fromTo(element, 
                {
                    opacity: 0
                },
                {
                    opacity: 1,
                    duration: window.animationSettings.opacity.duration,
                    ease: window.animationSettings.opacity.ease,
                    onStart: function() {
                        console.log(`Opacity animation started for ${elementData.type}`);
                    },
                    onComplete: function() {
                        console.log(`Opacity animation completed for ${elementData.type}`);
                    }
                }, 
                index * frameInterval
            );
            
            // Add Y movement animation to timeline (same timing, different ease)
            this.timeline.fromTo(element, 
                {
                    y: yOffset
                },
                {
                    y: 0,
                    duration: window.animationSettings.yMovement.duration,
                    ease: window.animationSettings.yMovement.ease,
                    onStart: function() {
                        console.log(`Y movement animation started for ${elementData.type}: ${yOffset.toFixed(1)}px → 0px`);
                    },
                    onComplete: function() {
                        console.log(`Y movement animation completed for ${elementData.type}`);
                    }
                }, 
                index * frameInterval
            );
        });
        
        console.log('DOM animation sequence built successfully');
    },
    
    // Get element height for Y offset calculation
    getElementHeight: function(elementType) {
        switch(elementType) {
            case 'logo': 
                return 58;
            case 'topTitle': 
                return 64; // Simplified - CSS handles precise sizing
            case 'mainTitle': 
                return 180; // Simplified - CSS handles line height
            case 'subtitle1': 
                return 75;
            case 'subtitle2': 
                return 40;
            case 'icons': 
                return 57;
            default: 
                return 50; // Fallback
        }
    },
    
    // Get active elements in the correct order
    getActiveElementsInOrder: function() {
        const activeElements = [];
        
        // Helper function to check if text content is empty
        function isTextEmpty(text) {
            return !text || text.trim().length === 0;
        }
        
        // Check each element in order: logo → top title → main title → subtitle1 → subtitle2 → icons
        
        // 1. Logo (if shown)
        if (window.templateState.showLogo) {
            activeElements.push({ id: 'logo', type: 'logo' });
        }
        
        // 2. Top title (only if not empty)
        if (!isTextEmpty(window.templateState.topTitle)) {
            activeElements.push({ id: 'top-title', type: 'topTitle' });
        }
        
        // 3. Main title (only if not empty)
        if (!isTextEmpty(window.templateState.mainTitle)) {
            activeElements.push({ id: 'main-title', type: 'mainTitle' });
        }
        
        // 4. Subtitle 1 (if shown and not empty)
        if (window.templateState.showSubtitle1 && !isTextEmpty(window.templateState.subtitle1)) {
            activeElements.push({ id: 'subtitle1', type: 'subtitle1' });
        }
        
        // 5. Subtitle 2 (if shown and not empty)
        if (window.templateState.showSubtitle2 && !isTextEmpty(window.templateState.subtitle2)) {
            activeElements.push({ id: 'subtitle2', type: 'subtitle2' });
        }
        
        // 6. Icons (if iconCount > 0)
        if (window.templateState.iconCount > 0) {
            activeElements.push({ id: 'icons', type: 'icons' });
        }
        
        return activeElements;
    },
    
    // Play animation (single run with auto-return to final state)
    play: function() {
        console.log('Starting DOM preview animation...');
        
        // First, set all elements to start state (hidden with Y offset)
        this.setStartState();
        
        // Build and play animation sequence
        this.buildAnimationSequence();
        
        // Start progress tracking
        this.startProgressTracking();
    },
    
    // Set all elements to start state (for animation beginning)
    setStartState: function() {
        const activeElements = this.getActiveElementsInOrder();
        
        console.log('Setting DOM elements to start state for animation');
        
        activeElements.forEach(elementData => {
            const element = document.getElementById(elementData.id);
            if (element && element.style.display !== 'none') {
                const elementHeight = this.getElementHeight(elementData.type);
                const offsetPercent = this.getYOffsetPercent(elementData.type);
                const yOffset = elementHeight * offsetPercent;
                
                gsap.set(element, {
                    opacity: 0,
                    y: yOffset
                });
                
                console.log(`- ${elementData.type}: set to start state (opacity: 0, y: ${yOffset.toFixed(1)}px)`);
            }
        });
    },
    
    // Pause animation
    pause: function() {
        if (this.timeline) {
            this.timeline.pause();
            console.log('DOM animation paused');
        }
    },
    
    // Resume animation
    resume: function() {
        if (this.timeline) {
            this.timeline.resume();
            console.log('DOM animation resumed');
        }
    },
    
    // Reset animation - return to final state for editing
    reset: function() {
        if (this.timeline) {
            this.timeline.kill();
            this.timeline = null;
        }
        
        // Stop progress tracking
        this.stopProgressTracking();
        
        // Return to final state for editing
        this.showFinalState();
        
        // Reset timeline scrubber
        const timelineScrubber = document.getElementById('timeline-scrubber');
        const timeDisplay = document.getElementById('time-display');
        if (timelineScrubber) timelineScrubber.value = '0';
        if (timeDisplay) timeDisplay.textContent = '0.0s';
        
        console.log('DOM animation reset - returned to final state for editing');
    },
    
    // Scrub to specific time
    scrubTo: function(time) {
        if (this.timeline) {
            // Calculate the total duration of the animation
            const totalDuration = this.timeline.duration();
            
            // Normalize time to progress (0-1)
            const progress = Math.max(0, Math.min(1, time / totalDuration));
            
            // Set timeline progress
            this.timeline.progress(progress);
            
            console.log(`Scrubbed to ${time.toFixed(1)}s (${(progress * 100).toFixed(1)}%)`);
        }
    },
    
    // Start progress tracking
    startProgressTracking: function() {
        if (this.timeline) {
            const self = this;
            this.timeline.eventCallback("onUpdate", function() {
                self.updateTimelineProgress();
            });
        }
    },
    
    // Stop progress tracking
    stopProgressTracking: function() {
        if (this.timeline) {
            this.timeline.eventCallback("onUpdate", null);
        }
    },
    
    // Update timeline progress
    updateTimelineProgress: function() {
        if (this.timeline) {
            const currentTime = this.timeline.time();
            const progress = this.timeline.progress();
            
            // Update motion controls
            if (window.MotionControls && window.MotionControls.updateProgress) {
                window.MotionControls.updateProgress(currentTime, progress);
            }
        }
    },
    
    // Get current animation info
    getAnimationInfo: function() {
        return {
            elementCount: this.animationElements.length,
            elements: this.animationElements,
            frameInterval: window.animationSettings.timing.frameInterval / window.animationSettings.timing.fps,
            duration: window.animationSettings.opacity.duration,
            ease: window.animationSettings.opacity.ease,
            yMovement: {
                mainTitle: '10%',
                otherElements: '30%',
                ease: window.animationSettings.yMovement.ease
            },
            optimizations: {
                hardwareAcceleration: 'enabled (will-change: transform)',
                directDOMAnimation: 'enabled',
                noCanvasRendering: 'true'
            },
            timeline: this.timeline ? 'initialized' : 'not initialized',
            timelineState: this.timeline ? (this.timeline.paused() ? 'paused' : 'playing') : 'none'
        };
    },
    
    // Debug method to check system status
    debug: function() {
        console.log('=== DOM GSAP Animation System Debug ===');
        console.log('GSAP loaded:', typeof gsap !== 'undefined');
        console.log('Template state:', window.templateState);
        console.log('Timeline:', this.timeline);
        console.log('Active elements:', this.getActiveElementsInOrder());
        console.log('Animation info:', this.getAnimationInfo());
        console.log('RenderTemplate available:', typeof window.renderTemplate === 'function');
        console.log('DOM container:', document.getElementById('template-container'));
        console.log('====================================');
    }
};

// Initialize when page loads
window.addEventListener('load', function() {
    // Wait for GSAP to be available
    if (typeof gsap !== 'undefined') {
        // Wait for template state to be available
        setTimeout(() => {
            if (window.templateState) {
                window.GSAPTimelineController.init();
                console.log('DOM animation system initialized - showing final design for editing');
            } else {
                console.error('Template state not available');
            }
        }, 100);
    } else {
        console.error('GSAP not loaded');
    }
});

// Make available for debugging
window.DOMGSAPController = window.GSAPTimelineController;