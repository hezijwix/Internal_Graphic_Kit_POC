// Panel Controls Event Handlers

// Initialize all event listeners for the control panel
function initializePanelControls() {
    // Check if required global variables are available
    if (typeof window.templateState === 'undefined') {
        console.error('templateState not available');
        return;
    }
    if (typeof window.renderTemplate === 'undefined') {
        console.error('renderTemplate not available');
        return;
    }
    
    console.log('Panel controls initialized successfully');
    
    // Text input event listeners
    document.getElementById('top-title').addEventListener('input', function(e) {
        window.templateState.topTitle = e.target.value;
        window.renderTemplate();
    });

    document.getElementById('main-title').addEventListener('input', function(e) {
        window.templateState.mainTitle = e.target.value;
        window.renderTemplate();
    });

    document.getElementById('subtitle1').addEventListener('input', function(e) {
        window.templateState.subtitle1 = e.target.value;
        window.renderTemplate();
    });

    document.getElementById('subtitle2').addEventListener('input', function(e) {
        window.templateState.subtitle2 = e.target.value;
        window.renderTemplate();
    });

    // Toggle switches
    document.getElementById('logo-toggle').addEventListener('change', function(e) {
        window.templateState.showLogo = e.target.checked;
        window.renderTemplate();
    });

    document.getElementById('subtitle1-toggle').addEventListener('change', function(e) {
        window.templateState.showSubtitle1 = e.target.checked;
        window.renderTemplate();
    });

    document.getElementById('subtitle2-toggle').addEventListener('change', function(e) {
        window.templateState.showSubtitle2 = e.target.checked;
        window.renderTemplate();
    });

    // Color inputs
    document.getElementById('bg-color').addEventListener('input', function(e) {
        window.templateState.backgroundColor = e.target.value;
        window.renderTemplate();
    });

    document.getElementById('text-color').addEventListener('input', function(e) {
        window.templateState.textColor = e.target.value;
        window.renderTemplate();
    });

    // Icon count slider
    document.getElementById('icon-count').addEventListener('input', function(e) {
        window.templateState.iconCount = parseInt(e.target.value);
        document.getElementById('icon-count-value').textContent = e.target.value;
        window.renderTemplate();
    });

    // Icon style dropdown
    document.getElementById('icon-style').addEventListener('change', function(e) {
        window.templateState.iconStyle = e.target.value;
        window.renderTemplate();
    });

    // Debug mode toggle
    document.getElementById('debug-mode').addEventListener('change', function(e) {
        window.templateState.debugMode = e.target.checked;
        window.renderTemplate();
    });

    // Color swatch functionality
    setupColorSwatches();
    
    // Icon style selector functionality
    setupIconStyleSelector();
}

// Set up color swatch functionality
function setupColorSwatches() {
    console.log('Setting up color swatches...');
    
    const bgSwatches = document.querySelectorAll('.bg-swatches .color-swatch');
    const textSwatches = document.querySelectorAll('.text-swatches .color-swatch');
    
    console.log('Found background swatches:', bgSwatches.length);
    console.log('Found text swatches:', textSwatches.length);

    bgSwatches.forEach(swatch => {
        swatch.addEventListener('click', function() {
            const color = this.dataset.color;
            console.log('Background swatch clicked:', color);
            console.log('Before update - templateState.backgroundColor:', window.templateState.backgroundColor);
            
            window.templateState.backgroundColor = color;
            document.getElementById('bg-color').value = color;
            
            console.log('After update - templateState.backgroundColor:', window.templateState.backgroundColor);
            
            // Update visual active state
            bgSwatches.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            
            console.log('Calling renderTemplate...');
            if (typeof window.renderTemplate === 'function') {
                window.renderTemplate();
                console.log('renderTemplate called successfully');
            } else {
                console.error('renderTemplate is not available!');
            }
        });
    });

    textSwatches.forEach(swatch => {
        swatch.addEventListener('click', function() {
            const color = this.dataset.color;
            console.log('Text swatch clicked:', color);
            console.log('Before update - templateState.textColor:', window.templateState.textColor);
            
            window.templateState.textColor = color;
            document.getElementById('text-color').value = color;
            
            console.log('After update - templateState.textColor:', window.templateState.textColor);
            
            // Update visual active state
            textSwatches.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            
            console.log('Calling renderTemplate...');
            if (typeof window.renderTemplate === 'function') {
                window.renderTemplate();
                console.log('renderTemplate called successfully');
            } else {
                console.error('renderTemplate is not available!');
            }
        });
    });
}

// Set up icon style selector functionality
function setupIconStyleSelector() {
    const iconStyleOptions = document.querySelectorAll('.icon-style-option');
    
    iconStyleOptions.forEach(option => {
        option.addEventListener('click', function() {
            const style = this.dataset.style;
            
            // Update template state
            window.templateState.iconStyle = style;
            
            // Update hidden select value
            document.getElementById('icon-style').value = style;
            
            // Update visual active state
            iconStyleOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Re-render template
            window.renderTemplate();
        });
    });
}

// Input validation with real-time feedback
function validateInput(inputElement, elementType) {
    const text = inputElement.value;
    const isValid = window.isTextWithinMargins ? window.isTextWithinMargins(text, elementType) : true;
    
    if (isValid) {
        inputElement.classList.remove('invalid');
        inputElement.classList.add('valid');
    } else {
        inputElement.classList.remove('valid');
        inputElement.classList.add('invalid');
    }
    
    return isValid;
}

// Add validation to inputs
function setupInputValidation() {
    const inputs = [
        { id: 'top-title', type: 'topTitle' },
        { id: 'main-title', type: 'mainTitle' },
        { id: 'subtitle1', type: 'subtitle1' },
        { id: 'subtitle2', type: 'subtitle2' }
    ];

    inputs.forEach(input => {
        const element = document.getElementById(input.id);
        
        // Add input event for real-time validation
        element.addEventListener('input', function() {
            validateInput(this, input.type);
        });

        // Add blur event for final validation
        element.addEventListener('blur', function() {
            validateInput(this, input.type);
        });
    });
}

// Export button functionality
function setupExportButton() {
    document.getElementById('export-btn').addEventListener('click', function() {
        // Create a temporary canvas for export
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = 1920;
        exportCanvas.height = 1080;
        const exportCtx = exportCanvas.getContext('2d');
        
        // Temporarily switch context to export canvas
        const originalCtx = window.ctx;
        window.ctx = exportCtx;
        
        // Render to export canvas
        window.renderTemplate();
        
        // Restore original context
        window.ctx = originalCtx;
        
        // Download the image
        exportCanvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'template-export.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    });
}

// Initialize all panel controls when window loads (after app.js initializes)
window.addEventListener('load', function() {
    // Small delay to ensure app.js has initialized
    setTimeout(function() {
        initializePanelControls();
        setupInputValidation();
        setupExportButton();
    }, 100);
});