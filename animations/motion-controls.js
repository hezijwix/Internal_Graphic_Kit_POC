// Motion Controls Interface
// Provides UI controls for animation playback and custom GSAP ease input

window.MotionControls = {
    isInitialized: false,
    
    // Initialize motion controls
    init: function() {
        if (this.isInitialized) return;
        
        this.createMotionControlsUI();
        this.setupEventListeners();
        this.isInitialized = true;
        
        console.log('Motion Controls initialized');
    },
    
    // Create motion controls UI
    createMotionControlsUI: function() {
        // Find the bottom bar to add animation controls
        const bottomBar = document.querySelector('.bottom-bar .export-controls');
        if (!bottomBar) {
            console.error('Bottom bar not found');
            return;
        }
        
        // Create animation controls container
        const animationControls = document.createElement('div');
        animationControls.className = 'animation-controls';
        animationControls.style.cssText = `
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 0 20px;
            border-right: 1px solid #333;
            margin-right: 20px;
        `;
        
        // Play/Pause button
        const playButton = document.createElement('button');
        playButton.id = 'animation-play-btn';
        playButton.className = 'button secondary';
        playButton.innerHTML = '<span class="button-icon">▶</span>Play';
        playButton.style.cssText = `
            min-width: 80px;
            padding: 8px 16px;
            font-size: 14px;
        `;
        
        // Reset button
        const resetButton = document.createElement('button');
        resetButton.id = 'animation-reset-btn';
        resetButton.className = 'button secondary';
        resetButton.innerHTML = '<span class="button-icon">⏹</span>Reset';
        resetButton.style.cssText = `
            min-width: 80px;
            padding: 8px 16px;
            font-size: 14px;
        `;
        
        // Timeline scrubber
        const scrubberContainer = document.createElement('div');
        scrubberContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 200px;
        `;
        
        const scrubberLabel = document.createElement('label');
        scrubberLabel.textContent = 'Timeline:';
        scrubberLabel.style.cssText = `
            font-size: 12px;
            color: #ccc;
            white-space: nowrap;
        `;
        
        const timelineScrubber = document.createElement('input');
        timelineScrubber.type = 'range';
        timelineScrubber.id = 'timeline-scrubber';
        timelineScrubber.min = '0';
        timelineScrubber.max = '10'; // Set to cover full animation duration
        timelineScrubber.step = '0.1';
        timelineScrubber.value = '0';
        timelineScrubber.style.cssText = `
            flex: 1;
            min-width: 120px;
        `;
        
        const timeDisplay = document.createElement('span');
        timeDisplay.id = 'time-display';
        timeDisplay.textContent = '0.0s';
        timeDisplay.style.cssText = `
            font-size: 12px;
            color: #ccc;
            min-width: 35px;
            text-align: right;
        `;
        
        scrubberContainer.appendChild(scrubberLabel);
        scrubberContainer.appendChild(timelineScrubber);
        scrubberContainer.appendChild(timeDisplay);
        
        // Assemble all controls (removed ease controls)
        animationControls.appendChild(playButton);
        animationControls.appendChild(resetButton);
        animationControls.appendChild(scrubberContainer);
        
        // Insert animation controls at the beginning of bottom bar
        bottomBar.insertBefore(animationControls, bottomBar.firstChild);
        
        console.log('Motion controls UI created');
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Play/Pause button
        const playButton = document.getElementById('animation-play-btn');
        if (playButton) {
            playButton.addEventListener('click', this.togglePlayPause.bind(this));
        }
        
        // Reset button
        const resetButton = document.getElementById('animation-reset-btn');
        if (resetButton) {
            resetButton.addEventListener('click', this.resetAnimation.bind(this));
        }
        
        // Timeline scrubber
        const timelineScrubber = document.getElementById('timeline-scrubber');
        if (timelineScrubber) {
            timelineScrubber.addEventListener('input', this.onScrubberChange.bind(this));
        }
    },
    
    // Toggle play/pause
    togglePlayPause: function() {
        const controller = window.GSAPTimelineController;
        const playButton = document.getElementById('animation-play-btn');
        
        // Check if timeline exists and is playing
        const isPlaying = controller.timeline && !controller.timeline.paused();
        
        if (isPlaying) {
            controller.pause();
            playButton.innerHTML = '<span class="button-icon">▶</span>Play';
        } else {
            controller.play();
            playButton.innerHTML = '<span class="button-icon">⏸</span>Pause';
        }
    },
    
    // Update play button state when animation starts
    setPlayingState: function() {
        const playButton = document.getElementById('animation-play-btn');
        if (playButton) {
            playButton.innerHTML = '<span class="button-icon">⏸</span>Pause';
        }
    },
    
    // Reset animation
    resetAnimation: function() {
        const controller = window.GSAPTimelineController;
        controller.reset();
        
        // Update UI
        const playButton = document.getElementById('animation-play-btn');
        playButton.innerHTML = '<span class="button-icon">▶</span>Play';
        
        console.log('Animation reset via controls');
    },
    
    // Handle scrubber change
    onScrubberChange: function(e) {
        const time = parseFloat(e.target.value);
        const controller = window.GSAPTimelineController;
        
        if (controller.scrubTo) {
            controller.scrubTo(time);
        }
        
        // Update time display
        const timeDisplay = document.getElementById('time-display');
        if (timeDisplay) {
            timeDisplay.textContent = time.toFixed(1) + 's';
        }
    },
    
    // Update progress from timeline
    updateProgress: function(currentTime, progress) {
        const timelineScrubber = document.getElementById('timeline-scrubber');
        const timeDisplay = document.getElementById('time-display');
        
        // Only update scrubber if user is not actively dragging it
        if (timelineScrubber && !timelineScrubber.matches(':active')) {
            timelineScrubber.value = currentTime.toString();
        }
        
        if (timeDisplay) {
            timeDisplay.textContent = currentTime.toFixed(1) + 's';
        }
    },
    
    // Animation complete callback
    onAnimationComplete: function() {
        const playButton = document.getElementById('animation-play-btn');
        if (playButton) {
            playButton.innerHTML = '<span class="button-icon">▶</span>Play';
        }
    }
};

// Initialize when page loads
window.addEventListener('load', function() {
    // Wait a bit for other components to initialize
    setTimeout(() => {
        window.MotionControls.init();
    }, 100);
});