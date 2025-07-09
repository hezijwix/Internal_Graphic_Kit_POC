// Main Application Logic and State Management

// Template state - make globally accessible
window.templateState = {
    topTitle: 'Top Title',
    mainTitle: 'THIS IS MAIN TITLE',
    subtitle1: 'Subtitle 1',
    subtitle2: 'Subtitle 2',
    showLogo: true,
    showSubtitle1: true,
    showSubtitle2: true,
    backgroundColor: '#000000',
    textColor: '#ffffff',
    iconCount: 4,
    iconStyle: 'arrow',
    debugMode: false,
    customIcon: {
        data: null, // Will store the loaded image/SVG element
        filename: null,
        type: null, // 'png', 'gif', 'svg'
        originalWidth: 0,
        originalHeight: 0
    },
    showIcons: true
};

// Initialize canvas and context after DOM is ready
function initializeCanvas() {
    window.canvas = document.getElementById('template-canvas');
    window.ctx = window.canvas.getContext('2d');
    
    // Set canvas size to internal resolution
    window.canvas.width = 1920;
    window.canvas.height = 1080;
}

// Canvas scaling
function scaleCanvas() {
    const container = document.querySelector('.canvas-container');
    const canvasArea = document.querySelector('.canvas-area');
    
    // Get the actual available space in the canvas area (account for 20px padding on each side)
    const availableWidth = canvasArea.offsetWidth - 40; // 20px padding left + 20px padding right
    const availableHeight = canvasArea.offsetHeight - 40; // 20px padding top + 20px padding bottom
    const aspectRatio = 1920 / 1080;
    
    // Calculate scaling to fit within available space
    let newWidth, newHeight;
    
    // Scale by width first
    newWidth = availableWidth;
    newHeight = newWidth / aspectRatio;
    
    // If height exceeds available space, scale by height instead
    if (newHeight > availableHeight) {
        newHeight = availableHeight;
        newWidth = newHeight * aspectRatio;
    }
    
    // Ensure minimum size constraints
    if (newWidth < 100) newWidth = 100;
    if (newHeight < 100) newHeight = 100;
    
    // Update the canvas display size to maintain aspect ratio
    canvas.style.width = newWidth + 'px';
    canvas.style.height = newHeight + 'px';
}

// Resizable divider functionality
const divider = document.getElementById('divider');
const leftPanel = document.querySelector('.left-panel');
const canvasArea = document.querySelector('.canvas-area');
let isDragging = false;

divider.addEventListener('mousedown', (e) => {
    isDragging = true;
    divider.classList.add('dragging');
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
});

function handleDrag(e) {
    if (!isDragging) return;
    
    const containerWidth = document.querySelector('.main-container').offsetWidth;
    const newLeftWidth = (e.clientX / containerWidth) * 100;
    
    if (newLeftWidth >= 20 && newLeftWidth <= 50) {
        leftPanel.style.width = newLeftWidth + '%';
        
        // Immediate canvas scaling for smooth real-time feedback during drag
        scaleCanvas();
    }
}

function stopDrag() {
    isDragging = false;
    divider.classList.remove('dragging');
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
    
    // Ensure final scale after drag ends
    scaleCanvas();
}

// Font loading detection for all weights
async function waitForFonts() {
    try {
        // Check if fonts are loaded
        await document.fonts.ready;
        
        // Load all font weights used in the application
        const fontPromises = [
            // Regular weight (400) - used for description
            new FontFace('WixMadefor Display', 'url(./Fonts/Wix_Madefor_Display/static/WixMadeforDisplay-Regular.ttf)', {
                weight: '400'
            }).load(),
            
            // Bold weight (700) - used for brand name and subtitle
            new FontFace('WixMadefor Display', 'url(./Fonts/Wix_Madefor_Display/static/WixMadeforDisplay-Bold.ttf)', {
                weight: '700'
            }).load(),
            
            // ExtraBold weight (800) - used for main title
            new FontFace('WixMadefor Display', 'url(./Fonts/Wix_Madefor_Display/static/WixMadeforDisplay-ExtraBold.ttf)', {
                weight: '800'
            }).load()
        ];
        
        // Wait for all fonts to load
        const loadedFonts = await Promise.all(fontPromises);
        
        // Add all fonts to the document
        loadedFonts.forEach(font => {
            document.fonts.add(font);
        });
        
        return true;
    } catch (error) {
        console.warn('Font loading failed:', error);
        return false;
    }
}

// Debounced resize handler for better performance
let resizeTimeout;
function debouncedResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        scaleCanvas();
        renderTemplate();
    }, 100);
}

// Initialize application
window.addEventListener('resize', debouncedResize);
window.addEventListener('load', async () => {
    // Initialize canvas first
    initializeCanvas();
    
    // Wait for fonts to load before rendering
    await waitForFonts();
    
    // Initialize panel controls (event handlers)
    if (typeof initializePanelControls === 'function') {
        initializePanelControls();
    }
    
    scaleCanvas();
    renderTemplate();
});