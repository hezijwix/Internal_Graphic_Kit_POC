// Icon Rendering Component

window.renderLogo = function(x, y) {
    // Draw oval border
    ctx.strokeStyle = templateState.textColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x, y, 62, 29, 0, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw default icon placeholder (star shape)
    ctx.fillStyle = templateState.textColor;
    ctx.strokeStyle = templateState.textColor;
    ctx.lineWidth = 2;
    
    // Draw a simple star icon as placeholder
    const starSize = 15;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const angle = (i * 144 - 90) * Math.PI / 180;
        const outerX = x + Math.cos(angle) * starSize;
        const outerY = y + Math.sin(angle) * starSize;
        
        if (i === 0) {
            ctx.moveTo(outerX, outerY);
        } else {
            ctx.lineTo(outerX, outerY);
        }
        
        const innerAngle = ((i + 0.5) * 144 - 90) * Math.PI / 180;
        const innerX = x + Math.cos(innerAngle) * (starSize * 0.4);
        const innerY = y + Math.sin(innerAngle) * (starSize * 0.4);
        ctx.lineTo(innerX, innerY);
    }
    ctx.closePath();
    ctx.fill();
}

window.renderIcons = function(x, y) {
    const iconSize = 57;
    
    // Calculate the width of the longest text line to base icon distribution on
    let maxTextWidth = 0;
    
    // Check top title width
    ctx.font = '700 64px "WixMadefor Display"'; // Bold weight
    maxTextWidth = Math.max(maxTextWidth, ctx.measureText(templateState.topTitle).width);
    
    // Check main title lines width with letter spacing
    ctx.font = '800 180px "WixMadefor Display"'; // ExtraBold weight
    const title = templateState.mainTitle.toUpperCase();
    let line1, line2;
    
    if (title.includes('PRODUCT')) {
        const words = title.split(' ');
        const productIndex = words.indexOf('PRODUCT');
        if (productIndex >= 0 && words.length > productIndex + 1) {
            line1 = words.slice(0, productIndex + 1).join(' ');
            line2 = words.slice(productIndex + 1).join(' ');
        } else {
            line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
            line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
        }
    } else {
        const words = title.split(' ');
        if (words.length > 1) {
            line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
            line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
        } else {
            line1 = title;
            line2 = '';
        }
    }
    
    // Calculate width with auto kerning
    maxTextWidth = Math.max(maxTextWidth, ctx.measureText(line1).width);
    if (line2) {
        maxTextWidth = Math.max(maxTextWidth, ctx.measureText(line2).width);
    }
    
    // Check subtitle1 width if shown
    if (templateState.showSubtitle1) {
        ctx.font = '700 75px "WixMadefor Display"'; // Bold weight
        maxTextWidth = Math.max(maxTextWidth, ctx.measureText(templateState.subtitle1).width);
    }
    
    // Check subtitle2 width if shown
    if (templateState.showSubtitle2) {
        ctx.font = '400 40px "WixMadefor Display"'; // Regular weight
        maxTextWidth = Math.max(maxTextWidth, ctx.measureText(templateState.subtitle2).width);
    }
    
    // Calculate icon spacing based on longest text line width
    const iconSpacing = Math.min(260, maxTextWidth / (templateState.iconCount + 1));
    const totalIconWidth = (templateState.iconCount - 1) * iconSpacing;
    const startX = x - totalIconWidth / 2;
    
    ctx.strokeStyle = templateState.textColor;
    ctx.lineWidth = 2;
    
    for (let i = 0; i < templateState.iconCount; i++) {
        const iconCenterX = startX + (i * iconSpacing);
        const iconCenterY = y;
        
        // Draw different icon styles based on template state
        if (templateState.iconStyle === 'arrow') {
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
}