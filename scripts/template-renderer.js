// Template Rendering Engine

// Function to calculate main title dimensions dynamically
function getMainTitleDimensions() {
    // Check if main title is empty
    if (!templateState.mainTitle || templateState.mainTitle.trim().length === 0) {
        return {
            fontSize: 0,
            lineHeight: 0,
            totalHeight: 0,
            numLines: 0
        };
    }
    
    // Auto-sizing parameters (same as in renderMainTitle)
    const maxFontSize = 240; // Increased from 180px for better visual impact
    const minFontSize = 120;
    const leftRightMargins = 230; // 230px margins on each side
    const maxCanvasWidth = canvas.width - (leftRightMargins * 2); // 460px total margins
    // Using auto kerning - no manual letter spacing needed
    const fontSizeStep = 5;
    
    // Split title into lines - MAXIMUM 2 LINES ENFORCED (same logic as renderMainTitle)
    const title = templateState.mainTitle.toUpperCase();
    
    // Smart line breaking with 2-line maximum
    let line1, line2;
    const words = title.split(' ');
    
    if (words.length === 1) {
        // Single word - keep on one line
        line1 = title;
        line2 = '';
    } else if (words.length === 2) {
        // Two words - one per line for better balance
        line1 = words[0];
        line2 = words[1];
    } else {
        // Multiple words - smart breaking with 2-line limit
        if (title.includes('PRODUCT')) {
            // Split after "PRODUCT" for the default case
            const productIndex = words.indexOf('PRODUCT');
            if (productIndex >= 0 && words.length > productIndex + 1) {
                line1 = words.slice(0, productIndex + 1).join(' ');
                line2 = words.slice(productIndex + 1).join(' ');
            } else {
                // Fallback to even split
                line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
                line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
            }
        } else {
            // For other titles, split roughly in half
            line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
            line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
        }
    }
    
    // Ensure we never have more than 2 lines by combining excess into line2
    if (line2 && line2.split(' ').length > 5) {
        // If line2 has too many words, combine some back to line1
        const allWords = title.split(' ');
        const midPoint = Math.floor(allWords.length / 2);
        line1 = allWords.slice(0, midPoint).join(' ');
        line2 = allWords.slice(midPoint).join(' ');
    }
    
    // Calculate font size (same logic as renderMainTitle)
    let fontSize = maxFontSize;
    
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
    const lineHeight = fontSize * 0.88; // Exact 0.88 line height from Figma
    const numLines = line2 ? 2 : 1;
    
    return {
        fontSize: fontSize,
        lineHeight: lineHeight,
        totalHeight: numLines * lineHeight,
        numLines: numLines
    };
}

// Precise rendering function matching Figma design - make globally accessible
window.renderTemplate = function() {
    if (!canvas || !ctx) {
        console.error('Canvas or context not available');
        return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set background
    ctx.fillStyle = templateState.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set text color
    ctx.fillStyle = templateState.textColor;
    ctx.textAlign = 'center';
    
    // Calculate vertical center and element positions
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Get dynamic main title dimensions
    const mainTitleDims = getMainTitleDimensions();
    
    // Helper function to check if text content is empty or whitespace only
    function isTextEmpty(text) {
        return !text || text.trim().length === 0;
    }
    
    // Collect all visible elements with consistent 26px margins
    const elements = [];
    
    // Logo (if shown)
    if (templateState.showLogo) {
        elements.push({
            type: 'logo',
            height: 58,
            marginBottom: 26 // Consistent 26px gap
        });
    }
    
    // Top title (only if not empty)
    if (!isTextEmpty(templateState.topTitle)) {
        elements.push({
            type: 'topTitle',
            height: 64 * 0.82, // 64px with 0.82 line height
            marginBottom: 26 // Consistent 26px gap
        });
    }
    
    // Main title (only if not empty - dynamic height based on actual font size)
    if (!isTextEmpty(templateState.mainTitle)) {
        elements.push({
            type: 'mainTitle',
            height: mainTitleDims.totalHeight,
            marginBottom: 26 // Consistent 26px gap
        });
    }
    
    // Subtitle 1 (if shown and not empty)
    if (templateState.showSubtitle1 && !isTextEmpty(templateState.subtitle1)) {
        elements.push({
            type: 'subtitle1',
            height: 75 * 0.82, // 75px with 0.82 line height
            marginBottom: 26 // Consistent 26px gap
        });
    }
    
    // Subtitle 2 (if shown and not empty)
    if (templateState.showSubtitle2 && !isTextEmpty(templateState.subtitle2)) {
        elements.push({
            type: 'subtitle2',
            height: 40 * 0.82, // 40px with 0.82 line height
            marginBottom: 26 // Consistent 26px gap
        });
    }
    
    // Icons (if iconCount > 0)
    if (templateState.iconCount > 0) {
        elements.push({
            type: 'icons',
            height: 57,
            marginBottom: 26
        });
    }
    
    // Ensure the last element has no bottom margin
    if (elements.length > 0) {
        elements[elements.length - 1].marginBottom = 0;
    }
    
    // Calculate total height
    const totalHeight = elements.reduce((sum, el) => sum + el.height + el.marginBottom, 0);
    
    // Start Y position for vertical centering
    let currentY = centerY - totalHeight / 2;
    
    // Render each element with simplified opacity animation
    elements.forEach(element => {
        currentY += element.height / 2; // Move to vertical center of current element
        
        // Get animation state for this element
        const elementType = element.type;
        const animationState = window.animationState && window.animationState[elementType];
        
        // Apply opacity and Y position animation
        let renderOpacity = 1;
        let renderYOffset = 0;
        if (animationState) {
            renderOpacity = animationState.opacity;
            renderYOffset = animationState.yOffset || 0;
        }
        
        // Debug logging for Y offset application
        if (renderYOffset !== 0) {
            console.log(`Rendering ${elementType}: opacity=${renderOpacity.toFixed(3)}, yOffset=${renderYOffset.toFixed(1)}px, originalY=${currentY.toFixed(1)}px`);
        }
        
        // Apply opacity to canvas context
        ctx.save();
        ctx.globalAlpha = renderOpacity;
        
        // Calculate animated Y position
        const animatedY = currentY + renderYOffset;
        
        // Render element at animated position
        if (element.type === 'logo' && templateState.showLogo) {
            renderLogo(centerX, animatedY);
        } else if (element.type === 'topTitle') {
            renderTopTitle(centerX, animatedY);
        } else if (element.type === 'mainTitle') {
            renderMainTitle(centerX, animatedY);
        } else if (element.type === 'subtitle1') {
            renderSubtitle1(centerX, animatedY);
        } else if (element.type === 'subtitle2') {
            renderSubtitle2(centerX, animatedY);
        } else if (element.type === 'icons') {
            renderIcons(centerX, animatedY);
        }
        
        // Restore canvas context
        ctx.restore();
        
        currentY += element.height / 2 + element.marginBottom; // Move to next element
    });
    
    // Render debug overlay if debug mode is enabled
    if (templateState.debugMode) {
        renderDebugOverlay(elements, centerX, centerY, totalHeight);
    }
}