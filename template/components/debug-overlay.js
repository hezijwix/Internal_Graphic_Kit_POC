// Debug Overlay Component

// Helper function to get text metrics for debug visualization
function getTextDebugInfo(text, fontWeight, fontSize, x, y) {
    ctx.save();
    ctx.font = `${fontWeight} ${fontSize}px "WixMadefor Display"`;
    ctx.fontKerning = 'auto';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    
    const metrics = ctx.measureText(text);
    const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.75;
    const descent = metrics.actualBoundingBoxDescent || fontSize * 0.25;
    const width = metrics.width;
    
    // Calculate vertical center offset (same as in text-renderer.js)
    const baseOffset = (ascent - descent) / 2;
    const adjustmentFactor = fontSize * 0.05;
    const verticalOffset = baseOffset - adjustmentFactor;
    
    ctx.restore();
    
    return {
        width: width,
        ascent: ascent,
        descent: descent,
        actualY: y + verticalOffset, // Where text will actually be rendered
        baselineY: y + verticalOffset, // Baseline position
        topY: y + verticalOffset - ascent, // Top of text
        bottomY: y + verticalOffset + descent, // Bottom of text
        verticalOffset: verticalOffset
    };
}

// Function to draw text bounding boxes
function drawTextBoundingBox(textInfo, x, text, color = '#ff00ff') {
    ctx.save();
    
    // Draw text bounding box
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([2, 2]);
    
    // Draw the actual text bounds
    ctx.strokeRect(
        x - textInfo.width / 2,
        textInfo.topY,
        textInfo.width,
        textInfo.ascent + textInfo.descent
    );
    
    // Draw baseline line
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 1;
    ctx.setLineDash([1, 1]);
    ctx.beginPath();
    ctx.moveTo(x - textInfo.width / 2 - 10, textInfo.baselineY);
    ctx.lineTo(x + textInfo.width / 2 + 10, textInfo.baselineY);
    ctx.stroke();
    
    // Draw center cross at actual render position
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    const crossSize = 8;
    ctx.beginPath();
    ctx.moveTo(x - crossSize, textInfo.actualY);
    ctx.lineTo(x + crossSize, textInfo.actualY);
    ctx.moveTo(x, textInfo.actualY - crossSize);
    ctx.lineTo(x, textInfo.actualY + crossSize);
    ctx.stroke();
    
    // Draw text label
    ctx.fillStyle = color;
    ctx.font = '10px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(
        `${text.substring(0, 15)}${text.length > 15 ? '...' : ''} (${Math.round(textInfo.width)}px)`,
        x + textInfo.width / 2 + 5,
        textInfo.topY
    );
    
    ctx.restore();
}

// Debug overlay rendering function
window.renderDebugOverlay = function(elements, centerX, centerY, totalHeight) {
    // Save current canvas state
    ctx.save();
    
    // Draw margin lines (230px from each edge)
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    const leftMargin = 230;
    const rightMargin = canvas.width - 230;
    
    // Left margin line
    ctx.beginPath();
    ctx.moveTo(leftMargin, 0);
    ctx.lineTo(leftMargin, canvas.height);
    ctx.stroke();
    
    // Right margin line
    ctx.beginPath();
    ctx.moveTo(rightMargin, 0);
    ctx.lineTo(rightMargin, canvas.height);
    ctx.stroke();
    
    // Draw center lines
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    
    // Vertical center line
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();
    
    // Horizontal center line
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();
    
    // Draw element boxes and spacing
    ctx.setLineDash([]);
    let currentY = centerY - totalHeight / 2;
    
    elements.forEach((element, index) => {
        // Element colors
        const colors = {
            logo: 'rgba(0, 100, 255, 0.2)',
            topTitle: 'rgba(0, 255, 0, 0.2)',
            mainTitle: 'rgba(128, 0, 255, 0.2)',
            subtitle1: 'rgba(255, 165, 0, 0.2)',
            subtitle2: 'rgba(255, 255, 0, 0.2)',
            icons: 'rgba(128, 128, 128, 0.2)'
        };
        
        const elementCenterY = currentY + element.height / 2;
        
        // Draw element box
        ctx.fillStyle = colors[element.type] || 'rgba(200, 200, 200, 0.2)';
        ctx.fillRect(
            leftMargin,
            currentY,
            rightMargin - leftMargin,
            element.height
        );
        
        // Draw element border
        ctx.strokeStyle = colors[element.type]?.replace('0.2', '0.8') || 'rgba(200, 200, 200, 0.8)';
        ctx.lineWidth = 1;
        ctx.strokeRect(
            leftMargin,
            currentY,
            rightMargin - leftMargin,
            element.height
        );
        
        // Draw element center line (horizontal line through middle of element)
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(leftMargin, elementCenterY);
        ctx.lineTo(rightMargin, elementCenterY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw text bounding boxes for text elements using actual calculated font sizes
        if (element.type === 'topTitle' && templateState.topTitle) {
            // Calculate actual font size used by renderTopTitle
            const leftRightMargins = 230;
            const maxWidth = canvas.width - (leftRightMargins * 2);
            const fontSize = window.calculateOptimalFontSize(templateState.topTitle, maxWidth, 64, 30, '700', 3);
            
            const textInfo = getTextDebugInfo(templateState.topTitle, '700', fontSize, centerX, elementCenterY);
            drawTextBoundingBox(textInfo, centerX, templateState.topTitle, '#00ff00');
        } else if (element.type === 'mainTitle' && templateState.mainTitle) {
            // Calculate actual font size used by renderMainTitle
            const leftRightMargins = 230;
            const maxCanvasWidth = canvas.width - (leftRightMargins * 2);
            const lines = window.breakMainTitleIntoLines(templateState.mainTitle);
            const fontSize = window.calculateOptimalFontSizeFor2Lines(lines.line1, lines.line2, maxCanvasWidth, 240, 120, '800', 5);
            const lineHeight = fontSize * 0.88;
            
            if (lines.line2) {
                const textInfo1 = getTextDebugInfo(lines.line1, '800', fontSize, centerX, elementCenterY - lineHeight / 2);
                const textInfo2 = getTextDebugInfo(lines.line2, '800', fontSize, centerX, elementCenterY + lineHeight / 2);
                
                drawTextBoundingBox(textInfo1, centerX, lines.line1, '#8000ff');
                drawTextBoundingBox(textInfo2, centerX, lines.line2, '#8000ff');
            } else {
                const textInfo = getTextDebugInfo(lines.line1, '800', fontSize, centerX, elementCenterY);
                drawTextBoundingBox(textInfo, centerX, lines.line1, '#8000ff');
            }
        } else if (element.type === 'subtitle1' && templateState.showSubtitle1 && templateState.subtitle1) {
            // Calculate actual font size used by renderSubtitle1
            const leftRightMargins = 230;
            const maxWidth = canvas.width - (leftRightMargins * 2);
            const fontSize = window.calculateOptimalFontSize(templateState.subtitle1, maxWidth, 75, 30, '700', 5);
            
            const textInfo = getTextDebugInfo(templateState.subtitle1, '700', fontSize, centerX, elementCenterY);
            drawTextBoundingBox(textInfo, centerX, templateState.subtitle1, '#ffa500');
        } else if (element.type === 'subtitle2' && templateState.showSubtitle2 && templateState.subtitle2) {
            // Calculate actual font size used by renderSubtitle2
            const leftRightMargins = 230;
            const maxWidth = canvas.width - (leftRightMargins * 2);
            const fontSize = window.calculateOptimalFontSize(templateState.subtitle2, maxWidth, 40, 20, '400', 2);
            
            const textInfo = getTextDebugInfo(templateState.subtitle2, '400', fontSize, centerX, elementCenterY);
            drawTextBoundingBox(textInfo, centerX, templateState.subtitle2, '#ffff00');
        }
        
        // Draw element label
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(
            `${element.type} (${Math.round(element.height)}px)`,
            leftMargin + 5,
            currentY + 5
        );
        
        currentY += element.height;
        
        // Draw spacing line if not the last element
        if (element.marginBottom > 0) {
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2;
            ctx.setLineDash([3, 3]);
            
            const spacingY = currentY + element.marginBottom / 2;
            ctx.beginPath();
            ctx.moveTo(leftMargin, spacingY);
            ctx.lineTo(rightMargin, spacingY);
            ctx.stroke();
            
            // Spacing label
            ctx.fillStyle = '#00ffff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(
                `${element.marginBottom}px`,
                centerX,
                spacingY - 5
            );
            
            ctx.setLineDash([]);
        }
        
        currentY += element.marginBottom;
    });
    
    // Draw debug info panel
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(10, 10, 280, 180);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    const debugInfo = [
        'DEBUG MODE - Text Bounding Boxes',
        `Canvas: ${canvas.width}x${canvas.height}`,
        `Margins: ${leftMargin}px | ${canvas.width - rightMargin}px`,
        `Available: ${rightMargin - leftMargin}px`,
        `Total Height: ${Math.round(totalHeight)}px`,
        `Elements: ${elements.length}`,
        `Center: ${centerX}, ${centerY}`,
        '',
        'Legend:',
        '• White dashed lines = element centers',
        '• Colored boxes = text bounding boxes',
        '• Red lines = text baselines',
        '• Yellow crosses = actual render points'
    ];
    
    debugInfo.forEach((line, index) => {
        ctx.fillText(line, 15, 15 + index * 12);
    });
    
    // Restore canvas state
    ctx.restore();
}