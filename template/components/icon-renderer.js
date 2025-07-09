// Icon Rendering Component

// Wix logo cache
let wixLogoCache = {
    loaded: false,
    image: null,
    originalWidth: 586.06,  // Updated to match optimized SVG (cropped to just "WI")
    originalHeight: 383.67
};

// Load Wix logo SVG
async function loadWixLogo() {
    if (wixLogoCache.loaded && wixLogoCache.image) {
        return wixLogoCache.image;
    }

    try {
        const response = await fetch('./graphic_assets/wix.svg');
        let svgText = await response.text();
        
        // Optimize the SVG by cropping the viewBox to remove extra whitespace
        // The original SVG has viewBox="0 0 961.81 383.67" but only "WI" content goes from 0-586
        // Remove the X character path and adjust viewBox for tighter bounds
        svgText = svgText
            // Replace the large viewBox with a cropped one that just contains "WI"
            .replace(/viewBox="0 0 961\.81 383\.67"/, 'viewBox="0 0 586.06 383.67"')
            // Remove the "X" character path (starts with M632.05)
            .replace(/<path d="M632\.05[^"]*"\/>/g, '')
            // Remove duplicate group content
            .replace(/<g>\s*<path d="M0,\.09[^<]*<path d="M632\.05[^<]*<path d="M586\.06[^<]*<\/g>/g, '');
        
        const img = new Image();
        const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);
        
        return new Promise((resolve, reject) => {
            img.onload = function() {
                wixLogoCache.image = img;
                wixLogoCache.loaded = true;
                URL.revokeObjectURL(url);
                resolve(img);
            };
            
            img.onerror = function() {
                console.error('Failed to load Wix logo');
                URL.revokeObjectURL(url);
                reject(new Error('Failed to load Wix logo'));
            };
            
            img.src = url;
        });
    } catch (error) {
        console.error('Error loading Wix logo:', error);
        throw error;
    }
}

window.renderLogo = function(x, y) {
    // Logo height should match the allocated div height exactly
    const logoHeight = 58; // Match the expected height in template-renderer.js
    
    if (wixLogoCache.loaded && wixLogoCache.image) {
        // Use the same scaling strategy as bottom icons for consistent sizing
        const img = wixLogoCache.image;
        
        // Calculate scaling to fit height (same as bottom icons)
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        let drawWidth, drawHeight;
        
        if (aspectRatio > 1) {
            // Wide image - scale by height
            drawHeight = logoHeight;
            drawWidth = logoHeight * aspectRatio;
        } else {
            // Tall or square image - scale by height
            drawHeight = logoHeight;
            drawWidth = logoHeight * aspectRatio;
        }
        
        // Draw the scaled logo centered (same as bottom icons)
        ctx.save();
        
        // Set color filter for the logo to match text color
        if (templateState.textColor !== '#000000') {
            // Apply color filter for non-black text colors
            ctx.globalCompositeOperation = 'source-over';
        }
        
        ctx.drawImage(
            img,
            x - drawWidth / 2,
            y - drawHeight / 2,
            drawWidth,
            drawHeight
        );
        
        // Apply text color as overlay if needed
        if (templateState.textColor !== '#000000') {
            ctx.globalCompositeOperation = 'source-atop';
            ctx.fillStyle = templateState.textColor;
            ctx.fillRect(
                x - drawWidth / 2,
                y - drawHeight / 2,
                drawWidth,
                drawHeight
            );
        }
        
        ctx.restore();
    } else {
        // Show loading placeholder or try to load the logo
        if (!wixLogoCache.loaded) {
            loadWixLogo().then(() => {
                // Re-render the template once the logo is loaded
                if (typeof window.renderTemplate === 'function') {
                    window.renderTemplate();
                }
            }).catch(() => {
                // Fallback to simple text if loading fails
                drawLogoFallback(x, y, logoHeight, logoHeight);
            });
        }
        
        // Draw placeholder while loading
        drawLogoFallback(x, y, logoHeight, logoHeight);
    }
}

// Fallback logo rendering function
function drawLogoFallback(x, y, width, height) {
    ctx.save();
    ctx.fillStyle = templateState.textColor;
    
    // Draw "WIX" text as fallback (no border frame) - larger font
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('WIX', x, y);
    
    ctx.restore();
}

// Initialize logo loading when the component loads
loadWixLogo().catch(error => {
    console.warn('Could not preload Wix logo:', error);
});

// Helper function to calculate the actual width of the main title
function getMainTitleWidth() {
    const leftRightMargins = 230;
    const maxWidth = canvas.width - (leftRightMargins * 2);
    
    // Calculate main title width using actual font size and line breaking
    if (templateState.mainTitle && templateState.mainTitle.trim()) {
        const lines = window.breakMainTitleIntoLines(templateState.mainTitle);
        const mainTitleFontSize = window.calculateOptimalFontSizeFor2Lines(
            lines.line1, lines.line2, maxWidth, 240, 120, '800', 5
        );
        
        window.setTextMeasurementContext('800', mainTitleFontSize);
        let maxLineWidth = ctx.measureText(lines.line1).width;
        if (lines.line2) {
            maxLineWidth = Math.max(maxLineWidth, ctx.measureText(lines.line2).width);
        }
        window.restoreTextMeasurementContext();
        
        return maxLineWidth;
    }
    
    // Fallback if no main title
    return 400; // Default reasonable width
}

// Helper function to calculate the actual width of an icon
function getActualIconWidth(iconSize) {
    if (templateState.iconStyle === 'custom' && templateState.customIcon.data) {
        const customIcon = templateState.customIcon;
        const aspectRatio = customIcon.originalWidth / customIcon.originalHeight;
        
        if (aspectRatio > 1) {
            // Wide image - scaled width is iconSize * aspectRatio
            return iconSize * aspectRatio;
        } else {
            // Tall or square image - scaled width is iconSize * aspectRatio
            return iconSize * aspectRatio;
        }
    } else {
        // Built-in icons (arrow, dot, star) use the full iconSize as width
        return iconSize;
    }
}

window.renderIcons = function(x, y) {
    // If iconCount is 0, don't render any icons
    if (templateState.iconCount === 0) {
        return;
    }
    
    const iconSize = 57;
    
    // Get the actual width of the main title
    const mainTitleWidth = getMainTitleWidth();
    
    // If we have only 1 icon, center it
    if (templateState.iconCount === 1) {
        const iconCenterX = x;
        const iconCenterY = y;
        drawSingleIcon(iconCenterX, iconCenterY, iconSize);
        return;
    }
    
    // For multiple icons, calculate the actual icon width
    const actualIconWidth = getActualIconWidth(iconSize);
    const halfIconWidth = actualIconWidth / 2;
    
    // Calculate the available space for distribution (main title width minus edge icon padding)
    const availableWidth = mainTitleWidth - actualIconWidth; // Subtract full icon width to account for both edge insets
    
    // Calculate spacing between icon centers in the available space
    const iconSpacing = availableWidth / (templateState.iconCount - 1);
    
    // Start position: left edge of main title + half icon width (to keep bounding box inside)
    const startX = (x - mainTitleWidth / 2) + halfIconWidth;
    
    ctx.strokeStyle = templateState.textColor;
    ctx.fillStyle = templateState.textColor;
    ctx.lineWidth = 2;
    
    for (let i = 0; i < templateState.iconCount; i++) {
        const iconCenterX = startX + (i * iconSpacing);
        const iconCenterY = y;
        drawSingleIcon(iconCenterX, iconCenterY, iconSize);
    }
}

// Helper function to draw a single icon based on the current icon style
function drawSingleIcon(iconCenterX, iconCenterY, iconSize) {
    if (templateState.iconStyle === 'custom' && templateState.customIcon.data) {
        drawCustomIcon(iconCenterX, iconCenterY, iconSize);
    } else if (templateState.iconStyle === 'arrow') {
        // Draw circular border
        ctx.beginPath();
        ctx.arc(iconCenterX, iconCenterY, iconSize / 2, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Draw arrow pointing left
        ctx.beginPath();
        ctx.moveTo(iconCenterX + 10, iconCenterY - 8);
        ctx.lineTo(iconCenterX - 5, iconCenterY);
        ctx.lineTo(iconCenterX + 10, iconCenterY + 8);
        ctx.stroke();
        
        // Draw arrow tail
        ctx.beginPath();
        ctx.moveTo(iconCenterX - 5, iconCenterY);
        ctx.lineTo(iconCenterX + 15, iconCenterY);
        ctx.stroke();
        
    } else if (templateState.iconStyle === 'dot') {
        // Draw filled circle
        ctx.beginPath();
        ctx.arc(iconCenterX, iconCenterY, iconSize / 4, 0, 2 * Math.PI);
        ctx.fill();
        
    } else if (templateState.iconStyle === 'star') {
        // Draw star shape
        const starSize = iconSize / 4;
        ctx.beginPath();
        for (let j = 0; j < 5; j++) {
            const angle = (j * 144 - 90) * Math.PI / 180;
            const outerX = iconCenterX + Math.cos(angle) * starSize;
            const outerY = iconCenterY + Math.sin(angle) * starSize;
            
            if (j === 0) {
                ctx.moveTo(outerX, outerY);
            } else {
                ctx.lineTo(outerX, outerY);
            }
            
            const innerAngle = ((j + 0.5) * 144 - 90) * Math.PI / 180;
            const innerX = iconCenterX + Math.cos(innerAngle) * (starSize * 0.4);
            const innerY = iconCenterY + Math.sin(innerAngle) * (starSize * 0.4);
            ctx.lineTo(innerX, innerY);
        }
        ctx.closePath();
        ctx.fill();
    }
}

// Helper function to draw custom uploaded icons
function drawCustomIcon(iconCenterX, iconCenterY, iconSize) {
    const customIcon = templateState.customIcon;
    if (!customIcon.data) return;
    
    ctx.save();
    
    try {
        if (customIcon.type === 'svg') {
            drawSVGIcon(iconCenterX, iconCenterY, iconSize, customIcon);
        } else {
            drawImageIcon(iconCenterX, iconCenterY, iconSize, customIcon);
        }
    } catch (error) {
        console.error('Error drawing custom icon:', error);
        // Fallback to a placeholder
        drawIconPlaceholder(iconCenterX, iconCenterY, iconSize);
    }
    
    ctx.restore();
}

// Draw SVG custom icon
function drawSVGIcon(iconCenterX, iconCenterY, iconSize, customIcon) {
    // Check if we have a cached image element for this SVG
    if (!customIcon.cachedImage) {
        // Create and cache the image element
        const img = new Image();
        const svgBlob = new Blob([customIcon.data], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = function() {
            // Cache the loaded image
            customIcon.cachedImage = img;
            // Re-render the template now that the image is loaded
            if (typeof window.renderTemplate === 'function') {
                window.renderTemplate();
            }
            URL.revokeObjectURL(url);
        };
        
        img.onerror = function() {
            console.error('Failed to load SVG image');
            URL.revokeObjectURL(url);
            // Draw placeholder on error
            drawIconPlaceholder(iconCenterX, iconCenterY, iconSize);
        };
        
        img.src = url;
        
        // Draw placeholder while loading
        drawIconPlaceholder(iconCenterX, iconCenterY, iconSize);
        return;
    }
    
    // Use the cached image
    const img = customIcon.cachedImage;
    
    // Calculate scaling to fit height
    const aspectRatio = customIcon.originalWidth / customIcon.originalHeight;
    let drawWidth, drawHeight;
    
    if (aspectRatio > 1) {
        // Wide image - scale by height
        drawHeight = iconSize;
        drawWidth = iconSize * aspectRatio;
    } else {
        // Tall or square image - scale by height
        drawHeight = iconSize;
        drawWidth = iconSize * aspectRatio;
    }
    
    // Draw the scaled image centered
    ctx.drawImage(
        img,
        iconCenterX - drawWidth / 2,
        iconCenterY - drawHeight / 2,
        drawWidth,
        drawHeight
    );
}

// Draw image custom icon (PNG/GIF)
function drawImageIcon(iconCenterX, iconCenterY, iconSize, customIcon) {
    const img = customIcon.data;
    
    // Calculate scaling to fit height
    const aspectRatio = customIcon.originalWidth / customIcon.originalHeight;
    let drawWidth, drawHeight;
    
    if (aspectRatio > 1) {
        // Wide image - scale by height
        drawHeight = iconSize;
        drawWidth = iconSize * aspectRatio;
    } else {
        // Tall or square image - scale by height
        drawHeight = iconSize;
        drawWidth = iconSize * aspectRatio;
    }
    
    // Draw the scaled image centered
    ctx.drawImage(
        img,
        iconCenterX - drawWidth / 2,
        iconCenterY - drawHeight / 2,
        drawWidth,
        drawHeight
    );
}

// Fallback placeholder for failed custom icons
function drawIconPlaceholder(iconCenterX, iconCenterY, iconSize) {
    ctx.strokeStyle = templateState.textColor;
    ctx.lineWidth = 2;
    
    // Draw a simple rectangle placeholder
    const halfSize = iconSize / 2;
    ctx.strokeRect(
        iconCenterX - halfSize,
        iconCenterY - halfSize,
        iconSize,
        iconSize
    );
    
    // Draw an X inside
    ctx.beginPath();
    ctx.moveTo(iconCenterX - halfSize * 0.6, iconCenterY - halfSize * 0.6);
    ctx.lineTo(iconCenterX + halfSize * 0.6, iconCenterY + halfSize * 0.6);
    ctx.moveTo(iconCenterX + halfSize * 0.6, iconCenterY - halfSize * 0.6);
    ctx.lineTo(iconCenterX - halfSize * 0.6, iconCenterY + halfSize * 0.6);
    ctx.stroke();
}