// Debug Overlay Component

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
    ctx.fillRect(10, 10, 200, 120);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    const debugInfo = [
        'DEBUG MODE',
        `Canvas: ${canvas.width}x${canvas.height}`,
        `Margins: ${leftMargin}px | ${canvas.width - rightMargin}px`,
        `Available: ${rightMargin - leftMargin}px`,
        `Total Height: ${Math.round(totalHeight)}px`,
        `Elements: ${elements.length}`,
        `Center: ${centerX}, ${centerY}`
    ];
    
    debugInfo.forEach((line, index) => {
        ctx.fillText(line, 15, 15 + index * 15);
    });
    
    // Restore canvas state
    ctx.restore();
}