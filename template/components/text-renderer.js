// Text Rendering Components

// Helper functions for consistent text measurements
window.setTextMeasurementContext = function(fontWeight, fontSize) {
    ctx.save();
    ctx.font = `${fontWeight} ${fontSize}px "WixMadefor Display"`;
    ctx.fontKerning = 'auto';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
}

// Helper function to calculate vertical center offset for better text centering
window.getVerticalCenterOffset = function(fontSize) {
    // Use alphabetic baseline and calculate proper vertical centering
    // This accounts for font metrics to achieve true visual centering
    const metrics = ctx.measureText('Mg'); // Use letters with ascenders and descenders
    
    // Use optimized values found through testing for perfect vertical centering
    const ascentMultiplier = 0.90;
    const descentMultiplier = 0.15;
    const additionalOffset = 0.000;
    
    // Always use our optimized multipliers for consistent centering
    const ascent = fontSize * ascentMultiplier;
    const descent = fontSize * descentMultiplier;
    
    // Calculate the true visual center offset
    // With textBaseline='alphabetic', we need to offset by (ascent - descent) / 2
    // to place the visual center of the text at the target y position
    const baseOffset = (ascent - descent) / 2;
    
    // Add any additional fine-tuning offset
    return baseOffset + (fontSize * additionalOffset);
}

window.restoreTextMeasurementContext = function() {
    ctx.restore();
}

window.calculateOptimalFontSize = function(text, maxWidth, maxFontSize, minFontSize, fontWeight, stepSize) {
    let fontSize = maxFontSize;
    
    while (fontSize >= minFontSize) {
        window.setTextMeasurementContext(fontWeight, fontSize);
        const textWidth = ctx.measureText(text).width;
        window.restoreTextMeasurementContext();
        
        if (textWidth <= maxWidth) {
            return fontSize;
        }
        fontSize -= stepSize;
    }
    
    return minFontSize;
}

window.calculateOptimalFontSizeFor2Lines = function(line1, line2, maxWidth, maxFontSize, minFontSize, fontWeight, stepSize) {
    let fontSize = maxFontSize;
    
    while (fontSize >= minFontSize) {
        window.setTextMeasurementContext(fontWeight, fontSize);
        const line1Width = ctx.measureText(line1).width;
        const line2Width = line2 ? ctx.measureText(line2).width : 0;
        const maxLineWidth = Math.max(line1Width, line2Width);
        window.restoreTextMeasurementContext();
        
        if (maxLineWidth <= maxWidth) {
            return fontSize;
        }
        fontSize -= stepSize;
    }
    
    return minFontSize;
}

window.breakMainTitleIntoLines = function(title) {
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
    
    const fontSize = window.calculateOptimalFontSize(
        templateState.topTitle,
        maxWidth,
        64, // maxFontSize
        30, // minFontSize
        '700', // fontWeight
        3 // stepSize
    );
    
    // Set final context state and render with proper vertical centering
    window.setTextMeasurementContext('700', fontSize);
    ctx.fillStyle = templateState.textColor;
    const verticalOffset = window.getVerticalCenterOffset(fontSize);
    ctx.fillText(templateState.topTitle, x, y + verticalOffset);
    window.restoreTextMeasurementContext();
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
    const lines = window.breakMainTitleIntoLines(templateState.mainTitle);
    
    // Calculate optimal font size using shared function
    const fontSize = window.calculateOptimalFontSizeFor2Lines(
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
    window.setTextMeasurementContext('800', fontSize);
    ctx.fillStyle = templateState.textColor;
    const verticalOffset = window.getVerticalCenterOffset(fontSize);
    
    // Render the lines with proper vertical centering
    if (lines.line2) {
        ctx.fillText(lines.line1, x, y - lineHeight / 2 + verticalOffset);
        ctx.fillText(lines.line2, x, y + lineHeight / 2 + verticalOffset);
    } else {
        ctx.fillText(lines.line1, x, y + verticalOffset);
    }
    
    window.restoreTextMeasurementContext();
}

window.renderSubtitle1 = function(x, y) {
    if (!templateState.showSubtitle1) return;
    
    // Auto-sizing for subtitle1 with 230px margins using shared function
    const leftRightMargins = 230;
    const maxWidth = canvas.width - (leftRightMargins * 2);
    
    const fontSize = window.calculateOptimalFontSize(
        templateState.subtitle1,
        maxWidth,
        75, // maxFontSize
        30, // minFontSize
        '700', // fontWeight
        5 // stepSize
    );
    
    // Set final context state and render with proper vertical centering
    window.setTextMeasurementContext('700', fontSize);
    ctx.fillStyle = templateState.textColor;
    const verticalOffset = window.getVerticalCenterOffset(fontSize);
    ctx.fillText(templateState.subtitle1, x, y + verticalOffset);
    window.restoreTextMeasurementContext();
}

window.renderSubtitle2 = function(x, y) {
    if (!templateState.showSubtitle2) return;
    
    // Auto-sizing for subtitle2 with 230px margins using shared function
    const leftRightMargins = 230;
    const maxWidth = canvas.width - (leftRightMargins * 2);
    
    const fontSize = window.calculateOptimalFontSize(
        templateState.subtitle2,
        maxWidth,
        40, // maxFontSize
        20, // minFontSize
        '400', // fontWeight
        2 // stepSize
    );
    
    // Set final context state and render with proper vertical centering
    window.setTextMeasurementContext('400', fontSize);
    ctx.fillStyle = templateState.textColor;
    const verticalOffset = window.getVerticalCenterOffset(fontSize);
    ctx.fillText(templateState.subtitle2, x, y + verticalOffset);
    window.restoreTextMeasurementContext();
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
        const lines = window.breakMainTitleIntoLines(text);
        
        // Check both lines at minimum font size using shared helper
        window.setTextMeasurementContext(fontWeight, minFontSize);
        const line1Width = ctx.measureText(lines.line1).width;
        const line2Width = lines.line2 ? ctx.measureText(lines.line2).width : 0;
        const maxLineWidth = Math.max(line1Width, line2Width);
        window.restoreTextMeasurementContext();
        
        return maxLineWidth <= maxWidth;
    } else {
        // For other elements, check at minimum font size using shared helper
        window.setTextMeasurementContext(fontWeight, minFontSize);
        const textWidth = ctx.measureText(text).width;
        window.restoreTextMeasurementContext();
        
        return textWidth <= maxWidth;
    }
}