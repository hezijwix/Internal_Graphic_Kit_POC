// DOM Template Rendering Engine - Replaces Canvas-based rendering
// Simple, direct DOM manipulation for hardware-accelerated performance

// Main render function - make globally accessible
window.renderTemplate = function() {
    const container = document.getElementById('template-container');
    if (!container) {
        console.error('Template container not found');
        return;
    }
    
    // Update background color
    container.style.backgroundColor = window.templateState.backgroundColor;
    
    // Update all text elements
    updateTextElements();
    
    // Update visibility states
    updateElementVisibility();
    
    // Update icons
    updateIcons();
    
    // Apply debug mode if enabled
    if (window.templateState.debugMode) {
        // Debug overlay functionality can be added here
        console.log('Debug mode active');
    }
};

// Update text content for all elements
function updateTextElements() {
    // Top title
    const topTitle = document.getElementById('top-title');
    if (topTitle && window.templateState.topTitle) {
        topTitle.textContent = window.templateState.topTitle;
        topTitle.style.color = window.templateState.textColor;
    }
    
    // Main title with line breaking
    const mainTitle = document.getElementById('main-title');
    if (mainTitle && window.templateState.mainTitle) {
        const lines = breakMainTitleIntoLines(window.templateState.mainTitle);
        
        if (lines.line2) {
            mainTitle.innerHTML = `
                <span class="line" id="main-line1">${lines.line1}</span>
                <span class="line" id="main-line2">${lines.line2}</span>
            `;
            mainTitle.classList.add('two-lines');
        } else {
            mainTitle.innerHTML = `<span class="line" id="main-line1">${lines.line1}</span>`;
            mainTitle.classList.remove('two-lines');
        }
        mainTitle.style.color = window.templateState.textColor;
    }
    
    // Subtitle 1
    const subtitle1 = document.getElementById('subtitle1');
    if (subtitle1 && window.templateState.subtitle1) {
        subtitle1.textContent = window.templateState.subtitle1;
        subtitle1.style.color = window.templateState.textColor;
    }
    
    // Subtitle 2
    const subtitle2 = document.getElementById('subtitle2');
    if (subtitle2 && window.templateState.subtitle2) {
        subtitle2.textContent = window.templateState.subtitle2;
        subtitle2.style.color = window.templateState.textColor;
    }
    
    // Logo
    const logo = document.getElementById('logo');
    if (logo) {
        logo.style.color = window.templateState.textColor;
    }
}

// Update element visibility
function updateElementVisibility() {
    // Logo visibility
    const logo = document.getElementById('logo');
    if (logo) {
        logo.style.display = window.templateState.showLogo ? 'block' : 'none';
        logo.style.opacity = window.templateState.showLogo ? '1' : '0';
    }
    
    // Subtitle 1 visibility
    const subtitle1 = document.getElementById('subtitle1');
    if (subtitle1) {
        const shouldShow = window.templateState.showSubtitle1 && 
                          window.templateState.subtitle1 && 
                          window.templateState.subtitle1.trim().length > 0;
        subtitle1.style.display = shouldShow ? 'block' : 'none';
        subtitle1.style.opacity = shouldShow ? '1' : '0';
    }
    
    // Subtitle 2 visibility
    const subtitle2 = document.getElementById('subtitle2');
    if (subtitle2) {
        const shouldShow = window.templateState.showSubtitle2 && 
                          window.templateState.subtitle2 && 
                          window.templateState.subtitle2.trim().length > 0;
        subtitle2.style.display = shouldShow ? 'block' : 'none';
        subtitle2.style.opacity = shouldShow ? '1' : '0';
    }
    
    // Icons visibility
    const icons = document.getElementById('icons');
    if (icons) {
        const shouldShow = window.templateState.showIcons && window.templateState.iconCount > 0;
        icons.style.display = shouldShow ? 'flex' : 'none';
        icons.style.opacity = shouldShow ? '1' : '0';
    }
}

// Update icons based on current settings
function updateIcons() {
    const iconsContainer = document.getElementById('icons');
    if (!iconsContainer) return;
    
    // Clear existing icons
    iconsContainer.innerHTML = '';
    
    // Create icons based on iconCount
    for (let i = 0; i < window.templateState.iconCount; i++) {
        const icon = document.createElement('div');
        icon.className = 'icon';
        icon.setAttribute('data-style', window.templateState.iconStyle);
        
        // Apply icon styling based on type
        switch (window.templateState.iconStyle) {
            case 'arrow':
                icon.style.background = '#666';
                icon.style.borderRadius = '8px';
                break;
            case 'circle':
                icon.style.background = '#666';
                icon.style.borderRadius = '50%';
                break;
            case 'square':
                icon.style.background = '#666';
                icon.style.borderRadius = '0';
                break;
            case 'custom':
                if (window.templateState.customIcon.data) {
                    // Handle custom icon - implementation can be added here
                    icon.style.background = '#999';
                    icon.style.borderRadius = '4px';
                } else {
                    icon.style.background = '#666';
                    icon.style.borderRadius = '8px';
                }
                break;
            default:
                icon.style.background = '#666';
                icon.style.borderRadius = '8px';
        }
        
        iconsContainer.appendChild(icon);
    }
}

// Main title line breaking logic (same as original)
function breakMainTitleIntoLines(title) {
    const upperTitle = title.toUpperCase();
    const words = upperTitle.split(' ');
    
    if (words.length === 1) {
        return { line1: upperTitle, line2: '' };
    } else if (words.length === 2) {
        return { line1: words[0], line2: words[1] };
    } else {
        if (upperTitle.includes('PRODUCT')) {
            const productIndex = words.indexOf('PRODUCT');
            if (productIndex >= 0 && words.length > productIndex + 1) {
                return {
                    line1: words.slice(0, productIndex + 1).join(' '),
                    line2: words.slice(productIndex + 1).join(' ')
                };
            }
        }
        return {
            line1: words.slice(0, Math.ceil(words.length / 2)).join(' '),
            line2: words.slice(Math.ceil(words.length / 2)).join(' ')
        };
    }
}

// Text validation function - make globally accessible for controls
window.isTextWithinMargins = function(text, elementType) {
    // For DOM version, we can be more lenient since text auto-sizes via CSS
    // This maintains compatibility with existing control validation
    if (!text || text.trim().length === 0) return true;
    
    // Basic length checks to prevent extremely long text
    switch (elementType) {
        case 'topTitle':
            return text.length <= 50;
        case 'mainTitle':
            return text.length <= 100;
        case 'subtitle1':
            return text.length <= 60;
        case 'subtitle2':
            return text.length <= 80;
        default:
            return true;
    }
};

// Rectangle test mode functions for compatibility
window.enableRectangleTestMode = function(enabled) {
    const elements = document.querySelectorAll('.template-element');
    elements.forEach(element => {
        if (enabled) {
            // Replace with colored rectangles
            const originalContent = element.innerHTML;
            element.setAttribute('data-original-content', originalContent);
            element.innerHTML = '';
            element.style.backgroundColor = getElementTestColor(element.id);
            element.style.border = '2px solid #fff';
            element.style.borderRadius = '4px';
        } else {
            // Restore original content
            const originalContent = element.getAttribute('data-original-content');
            if (originalContent) {
                element.innerHTML = originalContent;
                element.removeAttribute('data-original-content');
            }
            element.style.backgroundColor = 'transparent';
            element.style.border = 'none';
            element.style.borderRadius = '0';
        }
    });
};

// Get test colors for rectangle mode
function getElementTestColor(elementId) {
    const colors = {
        'logo': '#0070f3',
        'top-title': '#ff6b6b',
        'main-title': '#4ecdc4',
        'subtitle1': '#ffe66d',
        'subtitle2': '#a8e6cf',
        'icons': '#666666'
    };
    return colors[elementId] || '#999999';
}

// Initialize DOM template when called
window.initializeDOMTemplate = function() {
    console.log('Initializing DOM template renderer');
    
    // Set initial state
    if (window.templateState) {
        renderTemplate();
        console.log('DOM template initialized with current state');
    } else {
        console.warn('Template state not available during DOM initialization');
    }
};

// Make functions globally available for debugging
window.updateTextElements = updateTextElements;
window.updateElementVisibility = updateElementVisibility;
window.updateIcons = updateIcons;
window.breakMainTitleIntoLines = breakMainTitleIntoLines;