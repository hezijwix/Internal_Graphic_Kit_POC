// Element Detection System for GSAP Animations
// Detects active elements in the template and calculates their positions

window.AnimationElementDetector = {
    // Get all active elements that should be animated
    getActiveElements: function() {
        const activeElements = [];
        
        // Helper function to check if text content is empty
        function isTextEmpty(text) {
            return !text || text.trim().length === 0;
        }
        
        // Logo (if shown)
        if (window.templateState.showLogo) {
            activeElements.push({
                type: 'logo',
                id: 'logo-element',
                height: 58,
                marginBottom: 26
            });
        }
        
        // Top title (only if not empty)
        if (!isTextEmpty(window.templateState.topTitle)) {
            activeElements.push({
                type: 'topTitle',
                id: 'top-title-element',
                height: 64 * 0.82,
                marginBottom: 26
            });
        }
        
        // Main title (only if not empty)
        if (!isTextEmpty(window.templateState.mainTitle)) {
            // Get dynamic main title dimensions
            const mainTitleDims = this.getMainTitleDimensions();
            activeElements.push({
                type: 'mainTitle',
                id: 'main-title-element',
                height: mainTitleDims.totalHeight,
                marginBottom: 26
            });
        }
        
        // Subtitle 1 (if shown and not empty)
        if (window.templateState.showSubtitle1 && !isTextEmpty(window.templateState.subtitle1)) {
            activeElements.push({
                type: 'subtitle1',
                id: 'subtitle1-element',
                height: 75 * 0.82,
                marginBottom: 26
            });
        }
        
        // Subtitle 2 (if shown and not empty)
        if (window.templateState.showSubtitle2 && !isTextEmpty(window.templateState.subtitle2)) {
            activeElements.push({
                type: 'subtitle2',
                id: 'subtitle2-element',
                height: 40 * 0.82,
                marginBottom: 26
            });
        }
        
        // Icons (if iconCount > 0)
        if (window.templateState.iconCount > 0) {
            activeElements.push({
                type: 'icons',
                id: 'icons-element',
                height: 57,
                marginBottom: 26
            });
        }
        
        // Ensure the last element has no bottom margin
        if (activeElements.length > 0) {
            activeElements[activeElements.length - 1].marginBottom = 0;
        }
        
        return activeElements;
    },
    
    // Calculate element positions for animation
    calculateElementPositions: function(elements) {
        const canvas = window.canvas;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Calculate total height
        const totalHeight = elements.reduce((sum, el) => sum + el.height + el.marginBottom, 0);
        
        // Start Y position for vertical centering
        let currentY = centerY - totalHeight / 2;
        
        const elementPositions = [];
        
        elements.forEach((element, index) => {
            const elementCenterY = currentY + element.height / 2;
            
            elementPositions.push({
                ...element,
                x: centerX,
                y: elementCenterY,
                finalY: elementCenterY,
                startY: elementCenterY + 108, // 10% of 1080px canvas height
                index: index
            });
            
            currentY += element.height + element.marginBottom;
        });
        
        return elementPositions;
    },
    
    // Get main title dimensions (copied from template-renderer.js)
    getMainTitleDimensions: function() {
        if (!window.templateState.mainTitle || window.templateState.mainTitle.trim().length === 0) {
            return {
                fontSize: 0,
                lineHeight: 0,
                totalHeight: 0,
                numLines: 0
            };
        }
        
        const maxFontSize = 240;
        const minFontSize = 120;
        const leftRightMargins = 230;
        const maxCanvasWidth = window.canvas.width - (leftRightMargins * 2);
        const fontSizeStep = 5;
        
        const title = window.templateState.mainTitle.toUpperCase();
        const words = title.split(' ');
        
        let line1, line2;
        if (words.length === 1) {
            line1 = title;
            line2 = '';
        } else if (words.length === 2) {
            line1 = words[0];
            line2 = words[1];
        } else {
            if (title.includes('PRODUCT')) {
                const productIndex = words.indexOf('PRODUCT');
                if (productIndex >= 0 && words.length > productIndex + 1) {
                    line1 = words.slice(0, productIndex + 1).join(' ');
                    line2 = words.slice(productIndex + 1).join(' ');
                } else {
                    line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
                    line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
                }
            } else {
                line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
                line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
            }
        }
        
        let fontSize = maxFontSize;
        const ctx = window.ctx;
        
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
        const lineHeight = fontSize * 0.88;
        const numLines = line2 ? 2 : 1;
        
        return {
            fontSize: fontSize,
            lineHeight: lineHeight,
            totalHeight: numLines * lineHeight,
            numLines: numLines
        };
    }
};