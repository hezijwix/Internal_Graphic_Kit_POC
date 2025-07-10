// Simple Video Export System - DOM to MP4 using OffscreenCanvas
// Converts DOM elements to Canvas for MediaRecorder compatibility

window.SimpleVideoExporter = {
    isExporting: false,
    exportSettings: {
        fps: 60,
        duration: 5, // seconds
        width: 1920,
        height: 1080,
        format: 'mp4'
    },
    
    // Main export function for DOM elements
    exportVideo: async function() {
        if (this.isExporting) {
            console.warn('Export already in progress');
            return;
        }
        
        console.log('Starting DOM video export...');
        console.log(`Settings: ${this.exportSettings.width}x${this.exportSettings.height} @ ${this.exportSettings.fps}fps for ${this.exportSettings.duration}s`);
        
        this.isExporting = true;
        
        try {
            this.showExportProgress();
            
            // Create offscreen canvas for recording
            const canvas = document.createElement('canvas');
            canvas.width = this.exportSettings.width;
            canvas.height = this.exportSettings.height;
            const ctx = canvas.getContext('2d');
            
            // Get the best supported MIME type
            const mimeType = this.getBestMimeType();
            console.log('Using MIME type:', mimeType);
            
            // Create MediaRecorder from canvas stream
            const stream = canvas.captureStream(this.exportSettings.fps);
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: mimeType,
                videoBitsPerSecond: 8000000 // 8 Mbps for high quality
            });
            
            const chunks = [];
            
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };
            
            mediaRecorder.onstop = () => {
                const videoBlob = new Blob(chunks, { type: mimeType });
                this.downloadVideo(videoBlob);
                this.isExporting = false;
                this.hideExportProgress();
                console.log('DOM video export completed successfully');
            };
            
            mediaRecorder.onerror = (error) => {
                console.error('MediaRecorder error:', error);
                this.showError('Recording failed: ' + error.message);
                this.isExporting = false;
                this.hideExportProgress();
            };
            
            // Start recording
            mediaRecorder.start();
            
            // Play animation and render to canvas
            await this.renderDOMToCanvas(canvas, ctx, mediaRecorder);
            
        } catch (error) {
            console.error('DOM video export failed:', error);
            this.showError('Export failed: ' + error.message);
            this.isExporting = false;
            this.hideExportProgress();
        }
    },
    
    // Render DOM elements to canvas during animation
    renderDOMToCanvas: function(canvas, ctx, mediaRecorder) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const duration = this.exportSettings.duration * 1000;
            const templateContainer = document.getElementById('template-container');
            
            if (!templateContainer) {
                console.error('Template container not found');
                mediaRecorder.stop();
                resolve();
                return;
            }
            
            // Store original animation state
            const originalState = this.backupAnimationState();
            
            // Start the animation from the beginning
            if (window.GSAPTimelineController && window.GSAPTimelineController.timeline) {
                window.GSAPTimelineController.timeline.seek(0);
                window.GSAPTimelineController.timeline.play();
                console.log('Animation started for DOM recording');
            }
            
            // Render frames
            const renderFrame = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Clear canvas
                ctx.fillStyle = window.templateState.backgroundColor || '#000000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Render DOM elements to canvas
                this.renderDOMElementsToCanvas(ctx, templateContainer);
                
                // Update progress
                this.updateRecordingProgress(progress);
                
                if (progress < 1) {
                    requestAnimationFrame(renderFrame);
                } else {
                    console.log('Stopping DOM recording...');
                    mediaRecorder.stop();
                    
                    // Restore original animation state
                    this.restoreAnimationState(originalState);
                    resolve();
                }
            };
            
            renderFrame();
        });
    },
    
    // Render individual DOM elements to canvas
    renderDOMElementsToCanvas: function(ctx, container) {
        const elements = container.querySelectorAll('.template-element');
        
        elements.forEach(element => {
            if (element.style.display === 'none' || 
                parseFloat(element.style.opacity || '1') === 0) {
                return; // Skip hidden elements
            }
            
            // Get element position and transform
            const rect = element.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            // Calculate position relative to container (accounting for scaling)
            const scaleX = this.exportSettings.width / containerRect.width;
            const scaleY = this.exportSettings.height / containerRect.height;
            
            const x = (rect.left - containerRect.left) * scaleX;
            const y = (rect.top - containerRect.top) * scaleY;
            const width = rect.width * scaleX;
            const height = rect.height * scaleY;
            
            // Get element styles
            const computedStyle = window.getComputedStyle(element);
            const fontSize = parseFloat(computedStyle.fontSize) * scaleX;
            const fontWeight = computedStyle.fontWeight;
            const fontFamily = computedStyle.fontFamily;
            const color = computedStyle.color;
            const opacity = parseFloat(computedStyle.opacity || '1');
            
            // Set canvas context for text rendering
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
            ctx.fillStyle = color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Handle icons container (render rectangles)
            if (element.classList.contains('icons-container')) {
                const icons = element.querySelectorAll('.icon');
                icons.forEach((icon, index) => {
                    const iconRect = icon.getBoundingClientRect();
                    const iconX = (iconRect.left - containerRect.left) * scaleX;
                    const iconY = (iconRect.top - containerRect.top) * scaleY;
                    const iconWidth = iconRect.width * scaleX;
                    const iconHeight = iconRect.height * scaleY;
                    
                    ctx.fillStyle = '#666';
                    ctx.fillRect(iconX, iconY, iconWidth, iconHeight);
                });
                ctx.restore();
                return;
            }
            
            // Handle multi-line elements (main title)
            const lines = element.querySelectorAll('.line');
            if (lines.length > 1) {
                const lineHeight = fontSize * 0.88;
                const totalHeight = lines.length * lineHeight;
                let currentY = y + height / 2 - totalHeight / 2 + lineHeight / 2;
                
                lines.forEach(line => {
                    const text = line.textContent.trim();
                    if (text) {
                        ctx.fillText(text, x + width / 2, currentY);
                        currentY += lineHeight;
                    }
                });
            } else {
                // Single line text
                const text = element.textContent.trim();
                if (text && text !== '') {
                    ctx.fillText(text, x + width / 2, y + height / 2);
                }
            }
            
            ctx.restore();
        });
    },
    
    // Get the best supported MIME type
    getBestMimeType: function() {
        const types = [
            'video/mp4;codecs=h264',
            'video/mp4;codecs=avc1',
            'video/mp4',
            'video/webm;codecs=vp9',
            'video/webm;codecs=vp8',
            'video/webm'
        ];
        
        for (const type of types) {
            if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(type)) {
                return type;
            }
        }
        
        return 'video/webm';
    },
    
    // Update progress during recording
    updateRecordingProgress: function(progress) {
        const progressElement = document.getElementById('export-progress');
        const statusElement = document.getElementById('status');
        
        if (statusElement) {
            const percentage = (progress * 100).toFixed(1);
            const timeLeft = (1 - progress) * this.exportSettings.duration;
            statusElement.textContent = `Recording: ${percentage}% (${timeLeft.toFixed(1)}s remaining)`;
        }
    },
    
    // Backup current animation state
    backupAnimationState: function() {
        return {
            timelineState: window.GSAPTimelineController && window.GSAPTimelineController.timeline ? {
                time: window.GSAPTimelineController.timeline.time(),
                paused: window.GSAPTimelineController.timeline.paused()
            } : null
        };
    },
    
    // Restore animation state
    restoreAnimationState: function(backup) {
        if (backup.timelineState && window.GSAPTimelineController && window.GSAPTimelineController.timeline) {
            window.GSAPTimelineController.timeline.seek(backup.timelineState.time);
            if (!backup.timelineState.paused) {
                window.GSAPTimelineController.timeline.play();
            } else {
                window.GSAPTimelineController.timeline.pause();
            }
        }
        
        // Return to final state for editing
        if (window.GSAPTimelineController && window.GSAPTimelineController.showFinalState) {
            setTimeout(() => {
                window.GSAPTimelineController.showFinalState();
            }, 100);
        }
    },
    
    // Download the exported video
    downloadVideo: function(videoBlob) {
        const url = URL.createObjectURL(videoBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `animated-template-${Date.now()}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.textContent = 'Video exported successfully!';
            setTimeout(() => {
                statusElement.textContent = 'Ready';
            }, 3000);
        }
        
        console.log('Video download initiated');
    },
    
    // Show export progress
    showExportProgress: function() {
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.textContent = 'Preparing export...';
            statusElement.style.backgroundColor = '#ff9800';
        }
    },
    
    // Hide export progress
    hideExportProgress: function() {
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.style.backgroundColor = '#4caf50';
        }
    },
    
    // Show error message
    showError: function(message) {
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.textContent = `Error: ${message}`;
            statusElement.style.backgroundColor = '#f44336';
            
            setTimeout(() => {
                statusElement.textContent = 'Ready';
                statusElement.style.backgroundColor = '#4caf50';
            }, 5000);
        }
        
        console.error('Export error:', message);
    }
};

// Make globally available
window.VideoExporter = window.SimpleVideoExporter;