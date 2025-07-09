// Simplified GSAP Timeline Controller - Opacity + Y Animation
// 10-frame intervals between elements with configurable settings

// Animation Settings - Easy to modify for future changes
window.animationSettings = {
    opacity: {
        duration: 3,
        ease: "power1.out"
    },
    yMovement: {
        duration: 3,
        ease: "circ.out",
        offsetPercent: 0.3 // 30% of element height for more visible movement
    },
    timing: {
        frameInterval: 10, // frames
        fps: 30
    }
};

window.GSAPTimelineController = {
    timeline: null,
    animationElements: [],
    
    // Initialize the animation system
    init: function() {
        // Set GSAP ticker to 30fps
        gsap.ticker.fps(30);
        
        // Initialize animation state
        window.animationState = {};
        
        console.log('Simplified GSAP Timeline Controller initialized at 30fps');
        
        // Initialize all elements to opacity 0
        this.initializeElementStates();
    },
    
    // Get Y offset percentage for specific element types
    getYOffsetPercent: function(elementType) {
        // Main title gets reduced movement (10%), others get full movement (30%)
        return elementType === 'mainTitle' ? 0.1 : 0.3;
    },

    // Initialize element states to final state (for editing)
    initializeElementStates: function() {
        const activeElements = this.getActiveElementsInOrder();
        
        console.log('Detected active elements:', activeElements);
        
        // Initialize animation state object
        window.animationState = {};
        
        // Set all elements to final state (opacity 1, Y offset 0) for editing
        activeElements.forEach(elementType => {
            window.animationState[elementType] = {
                opacity: 1,
                yOffset: 0, // Final position
                isAnimating: false
            };
            
            console.log(`- ${elementType}: initialized to final state (opacity: 1, yOffset: 0)`);
        });
        
        // Trigger initial render to show final design
        this.triggerRender();
        
        console.log(`Initialized ${activeElements.length} elements in final state for editing`);
        console.log('Initial animation state:', window.animationState);
    },
    
    // Show final design state (all elements visible at final position)
    showFinalState: function() {
        const activeElements = this.getActiveElementsInOrder();
        
        console.log('Showing final design state for editing');
        
        // Set all elements to final state
        activeElements.forEach(elementType => {
            if (!window.animationState[elementType]) {
                window.animationState[elementType] = {};
            }
            
            window.animationState[elementType].opacity = 1;
            window.animationState[elementType].yOffset = 0;
            window.animationState[elementType].isAnimating = false;
        });
        
        // Trigger render to show final design
        this.triggerRender();
        
        console.log('Final design state active - ready for editing');
    },
    
    // Build simple opacity animation sequence
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
        
        // Don't reset animation state - use existing initialized state
        if (!window.animationState) {
            window.animationState = {};
        }
        
        // Get active elements in order
        const activeElements = this.getActiveElementsInOrder();
        
        if (activeElements.length === 0) {
            console.warn('No active elements found for animation');
            return;
        }
        
        this.animationElements = activeElements;
        
        // Calculate frame interval using settings
        const frameInterval = window.animationSettings.timing.frameInterval / window.animationSettings.timing.fps;
        
        console.log(`Building animation sequence for ${activeElements.length} elements:`);
        console.log(`- Frame interval: ${frameInterval.toFixed(3)}s between elements`);
        console.log(`- Animation duration: ${window.animationSettings.opacity.duration}s per element`);
        console.log(`- Opacity ease: ${window.animationSettings.opacity.ease}`);
        console.log(`- Y movement: 10% for mainTitle, 30% for other elements`);
        console.log(`- Y movement ease: ${window.animationSettings.yMovement.ease}`);
        
        // Store reference to this for callbacks
        const self = this;
        
        // Create animation for each element
        activeElements.forEach((elementType, index) => {
            // Calculate Y offset for this element using element-specific percentage
            const elementHeight = this.getElementHeight(elementType);
            const offsetPercent = this.getYOffsetPercent(elementType);
            const yOffset = elementHeight * offsetPercent;
            
            // Ensure element state exists with proper Y offset
            if (!window.animationState[elementType]) {
                window.animationState[elementType] = {
                    opacity: 0,
                    yOffset: yOffset,
                    isAnimating: false
                };
            } else {
                // Update existing state to ensure Y offset is correct
                window.animationState[elementType].yOffset = yOffset;
                window.animationState[elementType].opacity = 0;
                window.animationState[elementType].isAnimating = false;
            }
            
            console.log(`Element ${elementType}: height=${elementHeight.toFixed(1)}px, offset=${(offsetPercent*100).toFixed(0)}%, yOffset=${yOffset.toFixed(1)}px, initialState:`, window.animationState[elementType]);
            
            // Add opacity animation to timeline
            this.timeline.fromTo(window.animationState[elementType], 
                {
                    opacity: 0
                },
                {
                    opacity: 1,
                    duration: window.animationSettings.opacity.duration,
                    ease: window.animationSettings.opacity.ease,
                    onStart: function() {
                        console.log(`Opacity animation started for ${elementType} (${yOffset.toFixed(1)}px rise)`);
                        window.animationState[elementType].isAnimating = true;
                        self.triggerRender();
                    },
                    onUpdate: function() {
                        self.triggerRender();
                    },
                    onComplete: function() {
                        console.log(`Opacity animation completed for ${elementType}`);
                        window.animationState[elementType].isAnimating = false;
                        self.triggerRender();
                    }
                }, 
                index * frameInterval
            );
            
            // Add Y movement animation to timeline (same timing, different ease)
            this.timeline.fromTo(window.animationState[elementType], 
                {
                    yOffset: yOffset
                },
                {
                    yOffset: 0,
                    duration: window.animationSettings.yMovement.duration,
                    ease: window.animationSettings.yMovement.ease,
                    onStart: function() {
                        console.log(`Y movement animation started for ${elementType}: ${yOffset.toFixed(1)}px → 0px`);
                    },
                    onUpdate: function() {
                        self.triggerRender();
                    },
                    onComplete: function() {
                        console.log(`Y movement animation completed for ${elementType}`);
                    }
                }, 
                index * frameInterval
            );
            
            console.log(`- ${elementType}: starts at ${(index * frameInterval).toFixed(3)}s, rises ${yOffset.toFixed(1)}px`);
        });
        
        console.log('Animation sequence built successfully');
    },
    
    // Get element height for Y offset calculation
    getElementHeight: function(elementType) {
        switch(elementType) {
            case 'logo': 
                return 58;
            case 'topTitle': 
                return 64 * 0.82; // 52.48px
            case 'mainTitle': 
                // Get dynamic main title height
                return this.getMainTitleDimensions().totalHeight;
            case 'subtitle1': 
                return 75 * 0.82; // 61.5px
            case 'subtitle2': 
                return 40 * 0.82; // 32.8px
            case 'icons': 
                return 57;
            default: 
                return 50; // Fallback
        }
    },
    
    // Get main title dimensions (copied from template-renderer.js)
    getMainTitleDimensions: function() {
        if (!window.templateState.mainTitle || window.templateState.mainTitle.trim().length === 0) {
            return { totalHeight: 0 };
        }
        
        const maxFontSize = 240;
        const minFontSize = 120;
        const leftRightMargins = 230;
        const maxCanvasWidth = window.canvas.width - (leftRightMargins * 2);
        const fontSizeStep = 5;
        
        const title = window.templateState.mainTitle.toUpperCase();
        const words = title.split(' ');
        
        let line1, line2;
        if (words.length === 1) {
            line1 = title;
            line2 = '';
        } else if (words.length === 2) {
            line1 = words[0];
            line2 = words[1];
        } else {
            if (title.includes('PRODUCT')) {
                const productIndex = words.indexOf('PRODUCT');
                if (productIndex >= 0 && words.length > productIndex + 1) {
                    line1 = words.slice(0, productIndex + 1).join(' ');
                    line2 = words.slice(productIndex + 1).join(' ');
                } else {
                    line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
                    line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
                }
            } else {
                line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
                line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
            }
        }
        
        let fontSize = maxFontSize;
        const ctx = window.ctx;
        
        while (fontSize >= minFontSize) {
            ctx.font = `800 ${fontSize}px "WixMadefor Display"`;
            
            const line1Width = ctx.measureText(line1).width;
            const line2Width = line2 ? ctx.measureText(line2).width : 0;
            const maxLineWidth = Math.max(line1Width, line2Width);
            
            if (maxLineWidth <= maxCanvasWidth) {
                break;
            }
            fontSize -= fontSizeStep;
        }
        
        fontSize = Math.max(fontSize, minFontSize);
        const lineHeight = fontSize * 0.88;
        const numLines = line2 ? 2 : 1;
        
        return {
            totalHeight: numLines * lineHeight
        };
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
            activeElements.push('logo');
        }
        
        // 2. Top title (only if not empty)
        if (!isTextEmpty(window.templateState.topTitle)) {
            activeElements.push('topTitle');
        }
        
        // 3. Main title (only if not empty)
        if (!isTextEmpty(window.templateState.mainTitle)) {
            activeElements.push('mainTitle');
        }
        
        // 4. Subtitle 1 (if shown and not empty)
        if (window.templateState.showSubtitle1 && !isTextEmpty(window.templateState.subtitle1)) {
            activeElements.push('subtitle1');
        }
        
        // 5. Subtitle 2 (if shown and not empty)
        if (window.templateState.showSubtitle2 && !isTextEmpty(window.templateState.subtitle2)) {
            activeElements.push('subtitle2');
        }
        
        // 6. Icons (if iconCount > 0)
        if (window.templateState.iconCount > 0) {
            activeElements.push('icons');
        }
        
        return activeElements;
    },
    
    // Trigger canvas re-render
    triggerRender: function() {
        if (typeof window.renderTemplate === 'function') {
            window.renderTemplate();
        }
    },
    
    // Play animation (single run with auto-return to final state)
    play: function() {
        console.log('Starting preview animation...');
        
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
        
        console.log('Setting elements to start state for animation');
        
        activeElements.forEach(elementType => {
            const elementHeight = this.getElementHeight(elementType);
            const offsetPercent = this.getYOffsetPercent(elementType);
            const yOffset = elementHeight * offsetPercent;
            
            if (!window.animationState[elementType]) {
                window.animationState[elementType] = {};
            }
            
            window.animationState[elementType].opacity = 0;
            window.animationState[elementType].yOffset = yOffset;
            window.animationState[elementType].isAnimating = false;
            
            console.log(`- ${elementType}: set to start state (opacity: 0, yOffset: ${yOffset.toFixed(1)}px)`);
        });
        
        // Trigger render to show start state
        this.triggerRender();
    },
    
    // Pause animation
    pause: function() {
        if (this.timeline) {
            this.timeline.pause();
            console.log('Animation paused');
        }
    },
    
    // Resume animation
    resume: function() {
        if (this.timeline) {
            this.timeline.resume();
            console.log('Animation resumed');
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
        
        console.log('Animation reset - returned to final state for editing');
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
            timeline: this.timeline ? 'initialized' : 'not initialized',
            timelineState: this.timeline ? (this.timeline.paused() ? 'paused' : 'playing') : 'none'
        };
    },
    
    // Debug method to check system status
    debug: function() {
        console.log('=== GSAP Animation System Debug ===');
        console.log('GSAP loaded:', typeof gsap !== 'undefined');
        console.log('Template state:', window.templateState);
        console.log('Animation state:', window.animationState);
        console.log('Timeline:', this.timeline);
        console.log('Active elements:', this.getActiveElementsInOrder());
        console.log('Animation info:', this.getAnimationInfo());
        console.log('RenderTemplate available:', typeof window.renderTemplate === 'function');
        console.log('================================');
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
                console.log('Animation system initialized - showing final design for editing');
            } else {
                console.error('Template state not available');
            }
        }, 100);
    } else {
        console.error('GSAP not loaded');
    }
});