// Text Rendering Components

// Helper functions for consistent text measurements
function setTextMeasurementContext(fontWeight, fontSize) {
    ctx.save();
    ctx.font = `${fontWeight} ${fontSize}px "WixMadefor Display"`;
    ctx.fontKerning = 'auto';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
}

// Helper function to calculate vertical center offset for better text centering
function getVerticalCenterOffset(fontSize) {
    // Use alphabetic baseline and calculate proper vertical centering
    // This accounts for font metrics to achieve true visual centering
    const metrics = ctx.measureText('Mg'); // Use letters with ascenders and descenders
    const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.75; // Reduced from 0.8 to 0.75
    const descent = metrics.actualBoundingBoxDescent || fontSize * 0.25; // Increased from 0.2 to 0.25
    
    // Calculate the true visual center offset with adjustment for better centering
    const baseOffset = (ascent - descent) / 2;
    
    // Apply a small downward adjustment to improve visual centering
    // This moves text slightly lower in the container for better balance
    const adjustmentFactor = fontSize * 0.05; // Small adjustment proportional to font size
    
    return baseOffset - adjustmentFactor;
}

function restoreTextMeasurementContext() {
    ctx.restore();
}

function calculateOptimalFontSize(text, maxWidth, maxFontSize, minFontSize, fontWeight, stepSize) {
    let fontSize = maxFontSize;
    
    while (fontSize >= minFontSize) {
        setTextMeasurementContext(fontWeight, fontSize);
        const textWidth = ctx.measureText(text).width;
        restoreTextMeasurementContext();
        
        if (textWidth <= maxWidth) {
            return fontSize;
        }
        fontSize -= stepSize;
    }
    
    return minFontSize;
}

function calculateOptimalFontSizeFor2Lines(line1, line2, maxWidth, maxFontSize, minFontSize, fontWeight, stepSize) {
    let fontSize = maxFontSize;
    
    while (fontSize >= minFontSize) {
        setTextMeasurementContext(fontWeight, fontSize);
        const line1Width = ctx.measureText(line1).width;
        const line2Width = line2 ? ctx.measureText(line2).width : 0;
        const maxLineWidth = Math.max(line1Width, line2Width);
        restoreTextMeasurementContext();
        
        if (maxLineWidth <= maxWidth) {
            return fontSize;
        }
        fontSize -= stepSize;
    }
    
    return minFontSize;
}

function breakMainTitleIntoLines(title) {
    const upperTitle = title.toUpperCase();
    const words = upperTitle.split(' ');
    
    if (words.length === 1) {
        // Single word - keep on one line
        return { line1: upperTitle, line2: '' };
    } else if (words.length === 2) {
        // Two words - one per line for better balance
        return { line1: words[0], line2: words[1] };
    } else {
        // Multiple words - smart breaking with 2-line limit
        if (upperTitle.includes('PRODUCT')) {
            // Split after "PRODUCT" for the default case
            const productIndex = words.indexOf('PRODUCT');
            if (productIndex >= 0 && words.length > productIndex + 1) {
                return {
                    line1: words.slice(0, productIndex + 1).join(' '),
                    line2: words.slice(productIndex + 1).join(' ')
                };
            } else {
                // Fallback to even split
                return {
                    line1: words.slice(0, Math.ceil(words.length / 2)).join(' '),
                    line2: words.slice(Math.ceil(words.length / 2)).join(' ')
                };
            }
        } else {
            // For other titles, split roughly in half
            return {
                line1: words.slice(0, Math.ceil(words.length / 2)).join(' '),
                line2: words.slice(Math.ceil(words.length / 2)).join(' ')
            };
        }
    }
}

window.renderTopTitle = function(x, y) {
    ctx.fillStyle = templateState.textColor;
    
    // Auto-sizing with 230px margins using shared function
    const leftRightMargins = 230; // 230px margins on each side
    const maxWidth = canvas.width - (leftRightMargins * 2); // 460px total margins
    
    const fontSize = calculateOptimalFontSize(
        templateState.topTitle,
        maxWidth,
        64, // maxFontSize
        30, // minFontSize
        '700', // fontWeight
        3 // stepSize
    );
    
    // Set final context state and render with proper vertical centering
    setTextMeasurementContext('700', fontSize);
    ctx.fillStyle = templateState.textColor;
    const verticalOffset = getVerticalCenterOffset(fontSize);
    ctx.fillText(templateState.topTitle, x, y + verticalOffset);
    restoreTextMeasurementContext();
}

window.renderMainTitle = function(x, y) {
    ctx.fillStyle = templateState.textColor;
    
    // Auto-sizing parameters
    const maxFontSize = 240;
    const minFontSize = 120;
    const leftRightMargins = 230;
    const maxCanvasWidth = canvas.width - (leftRightMargins * 2);
    const fontSizeStep = 5;
    
    // Break title into lines using shared function
    const lines = breakMainTitleIntoLines(templateState.mainTitle);
    
    // Calculate optimal font size using shared function
    const fontSize = calculateOptimalFontSizeFor2Lines(
        lines.line1,
        lines.line2,
        maxCanvasWidth,
        maxFontSize,
        minFontSize,
        '800',
        fontSizeStep
    );
    
    // Calculate line height based on final font size
    const lineHeight = fontSize * 0.88;
    
    // Set final context state and render with proper vertical centering
    setTextMeasurementContext('800', fontSize);
    ctx.fillStyle = templateState.textColor;
    const verticalOffset = getVerticalCenterOffset(fontSize);
    
    // Render the lines with proper vertical centering
    if (lines.line2) {
        ctx.fillText(lines.line1, x, y - lineHeight / 2 + verticalOffset);
        ctx.fillText(lines.line2, x, y + lineHeight / 2 + verticalOffset);
    } else {
        ctx.fillText(lines.line1, x, y + verticalOffset);
    }
    
    restoreTextMeasurementContext();
}

window.renderSubtitle1 = function(x, y) {
    if (!templateState.showSubtitle1) return;
    
    // Auto-sizing for subtitle1 with 230px margins using shared function
    const leftRightMargins = 230;
    const maxWidth = canvas.width - (leftRightMargins * 2);
    
    const fontSize = calculateOptimalFontSize(
        templateState.subtitle1,
        maxWidth,
        75, // maxFontSize
        30, // minFontSize
        '700', // fontWeight
        5 // stepSize
    );
    
    // Set final context state and render with proper vertical centering
    setTextMeasurementContext('700', fontSize);
    ctx.fillStyle = templateState.textColor;
    const verticalOffset = getVerticalCenterOffset(fontSize);
    ctx.fillText(templateState.subtitle1, x, y + verticalOffset);
    restoreTextMeasurementContext();
}

window.renderSubtitle2 = function(x, y) {
    if (!templateState.showSubtitle2) return;
    
    // Auto-sizing for subtitle2 with 230px margins using shared function
    const leftRightMargins = 230;
    const maxWidth = canvas.width - (leftRightMargins * 2);
    
    const fontSize = calculateOptimalFontSize(
        templateState.subtitle2,
        maxWidth,
        40, // maxFontSize
        20, // minFontSize
        '400', // fontWeight
        2 // stepSize
    );
    
    // Set final context state and render with proper vertical centering
    setTextMeasurementContext('400', fontSize);
    ctx.fillStyle = templateState.textColor;
    const verticalOffset = getVerticalCenterOffset(fontSize);
    ctx.fillText(templateState.subtitle2, x, y + verticalOffset);
    restoreTextMeasurementContext();
}

// Function to validate if text fits within 230px margins - make globally accessible
window.isTextWithinMargins = function(text, elementType) {
    if (!text || text.trim().length === 0) return true;
    
    const leftRightMargins = 230;
    const maxWidth = canvas.width - (leftRightMargins * 2);
    
    // Set appropriate font and size limits based on element type
    let maxFontSize, minFontSize, fontWeight;
    
    switch (elementType) {
        case 'topTitle':
            maxFontSize = 64;
            minFontSize = 30;
            fontWeight = '700';
            break;
        case 'mainTitle':
            maxFontSize = 240;
            minFontSize = 120;
            fontWeight = '800';
            break;
        case 'subtitle1':
            maxFontSize = 75;
            minFontSize = 30;
            fontWeight = '700';
            break;
        case 'subtitle2':
            maxFontSize = 40;
            minFontSize = 20;
            fontWeight = '400';
            break;
        default:
            return true;
    }
    
    // Special handling for main title (can break into 2 lines)
    if (elementType === 'mainTitle') {
        // Use shared line breaking function
        const lines = breakMainTitleIntoLines(text);
        
        // Check both lines at minimum font size using shared helper
        setTextMeasurementContext(fontWeight, minFontSize);
        const line1Width = ctx.measureText(lines.line1).width;
        const line2Width = lines.line2 ? ctx.measureText(lines.line2).width : 0;
        const maxLineWidth = Math.max(line1Width, line2Width);
        restoreTextMeasurementContext();
        
        return maxLineWidth <= maxWidth;
    } else {
        // For other elements, check at minimum font size using shared helper
        setTextMeasurementContext(fontWeight, minFontSize);
        const textWidth = ctx.measureText(text).width;
        restoreTextMeasurementContext();
        
        return textWidth <= maxWidth;
    }
}