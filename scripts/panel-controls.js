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
        const newValue = e.target.value;
        
        // Check if new text would fit within bounds
        if (window.isTextWithinMargins && !window.isTextWithinMargins(newValue, 'mainTitle')) {
            // Text exceeds bounds, revert to previous value
            e.target.value = window.templateState.mainTitle;
            return;
        }
        
        window.templateState.mainTitle = newValue;
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

    // Visibility toggle
    document.getElementById('show-logo').addEventListener('change', function(e) {
        window.templateState.showLogo = e.target.checked;
        window.renderTemplate();
    });

    // Color swatch functionality
    setupColorSwatches();
    
    // Icon style selector functionality
    setupIconStyleSelector();

    // Custom icon upload functionality
    setupCustomIconUpload();
    
    // Setup input validation
    setupInputValidation();
    
    // Setup export functionality
    setupExportButton();
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
            
            // Show/hide custom icon upload section
            const customIconSection = document.getElementById('custom-icon-section');
            if (style === 'custom') {
                customIconSection.style.display = 'block';
            } else {
                customIconSection.style.display = 'none';
            }
            
            // Re-render template
            window.renderTemplate();
        });
    });
}

// Set up custom icon upload functionality
function setupCustomIconUpload() {
    const fileInput = document.getElementById('custom-icon-input');
    const uploadedFileInfo = document.getElementById('uploaded-file-info');
    const customIconPreview = document.getElementById('custom-icon-preview');
    const customIconFilename = document.getElementById('custom-icon-filename');
    const customIconFilesize = document.getElementById('custom-icon-filesize');
    const removeBtn = document.getElementById('remove-custom-icon');
    
    // File input change handler
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file type
        const validTypes = ['image/png', 'image/gif', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload a PNG, GIF, or SVG file.');
            return;
        }
        
        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('File size must be less than 5MB.');
            return;
        }
        
        processCustomIconFile(file);
    });
    
    // Remove file button handler
    removeBtn.addEventListener('click', function() {
        removeCustomIcon();
    });
}

// Process uploaded custom icon file
function processCustomIconFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const fileType = file.type;
        
        if (fileType === 'image/svg+xml') {
            processSVGIcon(e.target.result, file);
        } else {
            processImageIcon(e.target.result, file);
        }
    };
    
    if (file.type === 'image/svg+xml') {
        reader.readAsText(file);
    } else {
        reader.readAsDataURL(file);
    }
}

// Process SVG icon
function processSVGIcon(svgContent, file) {
    try {
        // Create a temporary div to parse SVG
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = svgContent;
        const svgElement = tempDiv.querySelector('svg');
        
        if (!svgElement) {
            alert('Invalid SVG file.');
            return;
        }
        
        // Get original dimensions
        const viewBox = svgElement.getAttribute('viewBox');
        let width = 100, height = 100; // Default fallback
        
        if (viewBox) {
            const values = viewBox.split(/\s+/);
            width = parseFloat(values[2]) || 100;
            height = parseFloat(values[3]) || 100;
        } else {
            width = parseFloat(svgElement.getAttribute('width')) || 100;
            height = parseFloat(svgElement.getAttribute('height')) || 100;
        }
        
        // Store custom icon data
        window.templateState.customIcon = {
            data: svgContent,
            filename: file.name,
            type: 'svg',
            originalWidth: width,
            originalHeight: height,
            cachedImage: null // Clear any existing cache
        };
        
        showUploadedFileInfo(file, svgContent);
        window.renderTemplate();
        
    } catch (error) {
        console.error('Error processing SVG:', error);
        alert('Error processing SVG file.');
    }
}

// Process image icon (PNG/GIF)
function processImageIcon(dataURL, file) {
    const img = new Image();
    
    img.onload = function() {
        // Store custom icon data
        window.templateState.customIcon = {
            data: img,
            filename: file.name,
            type: file.type.includes('png') ? 'png' : 'gif',
            originalWidth: img.width,
            originalHeight: img.height,
            cachedImage: null // Clear any existing cache
        };
        
        showUploadedFileInfo(file, dataURL);
        window.renderTemplate();
    };
    
    img.onerror = function() {
        alert('Error loading image file.');
    };
    
    img.src = dataURL;
}

// Show uploaded file information
function showUploadedFileInfo(file, previewSrc) {
    const uploadedFileInfo = document.getElementById('uploaded-file-info');
    const customIconPreview = document.getElementById('custom-icon-preview');
    const customIconFilename = document.getElementById('custom-icon-filename');
    const customIconFilesize = document.getElementById('custom-icon-filesize');
    
    // Show file info and hide upload button
    document.querySelector('.file-upload-button').style.display = 'none';
    uploadedFileInfo.style.display = 'flex';
    
    // Set preview image
    if (file.type === 'image/svg+xml') {
        customIconPreview.src = 'data:image/svg+xml;base64,' + btoa(previewSrc);
    } else {
        customIconPreview.src = previewSrc;
    }
    
    // Set file details
    customIconFilename.textContent = file.name;
    customIconFilesize.textContent = formatFileSize(file.size);
}

// Remove custom icon
function removeCustomIcon() {
    // Clear custom icon data
    window.templateState.customIcon = {
        data: null,
        filename: null,
        type: null,
        originalWidth: 0,
        originalHeight: 0,
        cachedImage: null
    };
    
    // Clear file input
    document.getElementById('custom-icon-input').value = '';
    
    // Show upload button and hide file info
    document.querySelector('.file-upload-button').style.display = 'flex';
    document.getElementById('uploaded-file-info').style.display = 'none';
    
    // Re-render template
    window.renderTemplate();
}

// Format file size helper function
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Input validation with real-time feedback
function validateInput(inputElement, elementType) {
    const text = inputElement.value;
    const isValid = window.isTextWithinMargins ? window.isTextWithinMargins(text, elementType) : true;
    
    if (isValid) {
        inputElement.classList.remove('invalid');
        inputElement.classList.add('valid');
        inputElement.title = ''; // Clear any tooltip
    } else {
        inputElement.classList.remove('valid');
        inputElement.classList.add('invalid');
        if (elementType === 'mainTitle') {
            inputElement.title = 'Text exceeds maximum length - input limited to prevent overflow';
        } else {
            inputElement.title = 'Text exceeds margin boundaries';
        }
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
            // For main title, prevent text that would exceed bounds
            if (input.type === 'mainTitle') {
                const newValue = this.value;
                if (window.isTextWithinMargins && !window.isTextWithinMargins(newValue, 'mainTitle')) {
                    // Text exceeds bounds, revert to previous value
                    this.value = window.templateState.mainTitle;
                    return;
                }
            }
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
        // Check if VideoExporter is available
        if (window.VideoExporter) {
            console.log('Starting video export...');
            window.VideoExporter.exportVideo();
        } else {
            console.error('VideoExporter not available');
            alert('Video export system not loaded. Please refresh the page.');
        }
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