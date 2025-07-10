// DOM Text Rendering Components - Replaces Canvas text rendering
// Simple DOM manipulation for hardware-accelerated text

// No text cache needed for DOM - browser handles optimization
// This maintains compatibility with existing text-renderer.js interface

// Render functions for each text element (now just DOM updates)
window.renderTopTitle = function(x, y) {
    const element = document.getElementById('top-title');
    if (!element) return;
    
    // Check if rectangle test mode is enabled
    if (window.templateState && window.templateState.rectangleTestMode) {
        renderTopTitleRectangle(element);
        return;
    }
    
    // Update content and position (CSS handles positioning)
    element.textContent = window.templateState.topTitle || '';
    element.style.color = window.templateState.textColor || '#ffffff';
    
    // Show/hide based on content
    const hasContent = window.templateState.topTitle && window.templateState.topTitle.trim().length > 0;
    element.style.display = hasContent ? 'block' : 'none';
    element.style.opacity = hasContent ? '1' : '0';
};

window.renderMainTitle = function(x, y) {
    const element = document.getElementById('main-title');
    if (!element) return;
    
    // Check if rectangle test mode is enabled
    if (window.templateState && window.templateState.rectangleTestMode) {
        renderMainTitleRectangle(element);
        return;
    }
    
    const title = window.templateState.mainTitle || '';
    if (!title.trim()) {
        element.style.display = 'none';
        element.style.opacity = '0';
        return;
    }
    
    // Break into lines using the same logic as Canvas version
    const lines = window.breakMainTitleIntoLines(title);
    
    if (lines.line2) {
        element.innerHTML = `
            <span class="line" id="main-line1">${lines.line1}</span>
            <span class="line" id="main-line2">${lines.line2}</span>
        `;
        element.classList.add('two-lines');
    } else {
        element.innerHTML = `<span class="line" id="main-line1">${lines.line1}</span>`;
        element.classList.remove('two-lines');
    }
    
    element.style.color = window.templateState.textColor || '#ffffff';
    element.style.display = 'block';
    element.style.opacity = '1';
};

window.renderSubtitle1 = function(x, y) {
    const element = document.getElementById('subtitle1');
    if (!element) return;
    
    // Check visibility settings
    if (!window.templateState.showSubtitle1) {
        element.style.display = 'none';
        element.style.opacity = '0';
        return;
    }
    
    // Check if rectangle test mode is enabled
    if (window.templateState && window.templateState.rectangleTestMode) {
        renderSubtitle1Rectangle(element);
        return;
    }
    
    // Update content
    element.textContent = window.templateState.subtitle1 || '';
    element.style.color = window.templateState.textColor || '#ffffff';
    
    // Show/hide based on content
    const hasContent = window.templateState.subtitle1 && window.templateState.subtitle1.trim().length > 0;
    element.style.display = hasContent ? 'block' : 'none';
    element.style.opacity = hasContent ? '1' : '0';
};

window.renderSubtitle2 = function(x, y) {
    const element = document.getElementById('subtitle2');
    if (!element) return;
    
    // Check visibility settings
    if (!window.templateState.showSubtitle2) {
        element.style.display = 'none';
        element.style.opacity = '0';
        return;
    }
    
    // Check if rectangle test mode is enabled
    if (window.templateState && window.templateState.rectangleTestMode) {
        renderSubtitle2Rectangle(element);
        return;
    }
    
    // Update content
    element.textContent = window.templateState.subtitle2 || '';
    element.style.color = window.templateState.textColor || '#ffffff';
    
    // Show/hide based on content
    const hasContent = window.templateState.subtitle2 && window.templateState.subtitle2.trim().length > 0;
    element.style.display = hasContent ? 'block' : 'none';
    element.style.opacity = hasContent ? '1' : '0';
};

// Rectangle test mode functions for debugging (replaces text with colored rectangles)
function renderTopTitleRectangle(element) {
    element.innerHTML = '';
    element.style.backgroundColor = '#FF6B6B';
    element.style.width = '300px';
    element.style.height = '52px';
    element.style.display = 'block';
    element.style.opacity = '1';
    element.style.margin = '0 auto';
    element.style.borderRadius = '4px';
}

function renderMainTitleRectangle(element) {
    element.innerHTML = '';
    element.style.backgroundColor = '#4ECDC4';
    element.style.width = '600px';
    element.style.height = '150px';
    element.style.display = 'block';
    element.style.opacity = '1';
    element.style.margin = '0 auto';
    element.style.borderRadius = '4px';
}

function renderSubtitle1Rectangle(element) {
    element.innerHTML = '';
    element.style.backgroundColor = '#FFE66D';
    element.style.width = '350px';
    element.style.height = '61px';
    element.style.display = 'block';
    element.style.opacity = '1';
    element.style.margin = '0 auto';
    element.style.borderRadius = '4px';
}

function renderSubtitle2Rectangle(element) {
    element.innerHTML = '';
    element.style.backgroundColor = '#A8E6CF';
    element.style.width = '250px';
    element.style.height = '33px';
    element.style.display = 'block';
    element.style.opacity = '1';
    element.style.margin = '0 auto';
    element.style.borderRadius = '4px';
}

// Logo rendering function for compatibility
window.renderLogo = function(x, y) {
    const element = document.getElementById('logo');
    if (!element) return;
    
    // Check visibility settings
    if (!window.templateState.showLogo) {
        element.style.display = 'none';
        element.style.opacity = '0';
        return;
    }
    
    // Check if rectangle test mode is enabled
    if (window.templateState && window.templateState.rectangleTestMode) {
        element.innerHTML = '';
        element.style.backgroundColor = '#0070F3';
        element.style.width = '120px';
        element.style.height = '47px';
        element.style.margin = '0 auto';
        element.style.borderRadius = '4px';
    } else {
        element.innerHTML = 'WIX';
        element.style.backgroundColor = 'transparent';
        element.style.width = 'auto';
        element.style.height = 'auto';
        element.style.margin = '0';
        element.style.borderRadius = '0';
    }
    
    element.style.color = window.templateState.textColor || '#ffffff';
    element.style.display = 'block';
    element.style.opacity = '1';
};

// Text cache functions for compatibility (no-ops in DOM version)
window.textImageCache = {
    topTitle: null,
    mainTitle: { line1: null, line2: null },
    subtitle1: null,
    subtitle2: null
};

window.preRenderTextElement = function(text, fontWeight, fontSize, color) {
    // No pre-rendering needed for DOM - return null
    return null;
};

window.updateTextCache = function() {
    // No cache updates needed for DOM - browser handles optimization
    console.log('Text cache update called (no-op in DOM version)');
};

// Helper functions for compatibility
window.setTextMeasurementContext = function(fontWeight, fontSize) {
    // No context setting needed for DOM
};

window.restoreTextMeasurementContext = function() {
    // No context restoration needed for DOM
};

window.getVerticalCenterOffset = function(fontSize) {
    // DOM handles vertical centering automatically
    return 0;
};

window.applyTextAnimationOptimizations = function() {
    // DOM elements already have hardware acceleration via CSS
};

// Font size calculation functions (simplified for DOM)
window.calculateOptimalFontSize = function(text, maxWidth, maxFontSize, minFontSize, fontWeight, stepSize) {
    // DOM handles font sizing via CSS - return the max size for compatibility
    return maxFontSize;
};

window.calculateOptimalFontSizeFor2Lines = function(line1, line2, maxWidth, maxFontSize, minFontSize, fontWeight, stepSize) {
    // DOM handles font sizing via CSS - return the max size for compatibility
    return maxFontSize;
};

// Initialize DOM text rendering
window.initializeDOMTextRenderer = function() {
    console.log('DOM text renderer initialized - hardware accelerated');
    
    // Apply hardware acceleration to all text elements
    const textElements = document.querySelectorAll('.template-element');
    textElements.forEach(element => {
        element.style.willChange = 'transform';
        element.style.transform = 'translate3d(-50%, 0, 0)';
        element.style.backfaceVisibility = 'hidden';
    });
    
    console.log(`Applied hardware acceleration to ${textElements.length} text elements`);
};

// Make functions available globally for debugging
window.renderTopTitleRectangle = renderTopTitleRectangle;
window.renderMainTitleRectangle = renderMainTitleRectangle;
window.renderSubtitle1Rectangle = renderSubtitle1Rectangle;
window.renderSubtitle2Rectangle = renderSubtitle2Rectangle;