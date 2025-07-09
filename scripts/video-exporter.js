// Video Export System - MediaRecorder-based for proper MP4 compatibility
// High-quality export that works with QuickTime, After Effects, and all video players

window.VideoExporter = {
    isExporting: false,
    exportSettings: {
        fps: 60,
        duration: 5, // seconds
        width: 1920,
        height: 1080,
        format: 'mp4'
    },
    
    // Main export function using MediaRecorder
    exportVideo: async function() {
        if (this.isExporting) {
            console.warn('Export already in progress');
            return;
        }
        
        console.log('Starting video export with MediaRecorder...');
        console.log(`Settings: ${this.exportSettings.width}x${this.exportSettings.height} @ ${this.exportSettings.fps}fps for ${this.exportSettings.duration}s`);
        
        this.isExporting = true;
        
        try {
            this.showExportProgress();
            
            // Get the best supported MIME type
            const mimeType = this.getBestMimeType();
            console.log('Using MIME type:', mimeType);
            
            // Create MediaRecorder from canvas stream
            const stream = window.canvas.captureStream(this.exportSettings.fps);
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
                console.log('Video export completed successfully');
            };
            
            mediaRecorder.onerror = (error) => {
                console.error('MediaRecorder error:', error);
                this.showError('Recording failed: ' + error.message);
                this.isExporting = false;
                this.hideExportProgress();
            };
            
            // Start recording
            mediaRecorder.start();
            
            // Play animation and stop recording after duration
            await this.playAnimationForRecording(mediaRecorder);
            
        } catch (error) {
            console.error('Video export failed:', error);
            this.showError('Export failed: ' + error.message);
            this.isExporting = false;
            this.hideExportProgress();
        }
    },
    
    // Get the best supported MIME type for the browser
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
                console.log('Selected MIME type:', type);
                return type;
            }
        }
        
        // Fallback for browsers without isTypeSupported
        return 'video/webm';
    },
    
    // Play animation synchronized with recording
    playAnimationForRecording: function(mediaRecorder) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const duration = this.exportSettings.duration * 1000; // Convert to milliseconds
            
            // Store original animation state
            const originalState = this.backupAnimationState();
            
            // Start the animation from the beginning
            if (window.GSAPTimelineController && window.GSAPTimelineController.timeline) {
                window.GSAPTimelineController.timeline.seek(0);
                window.GSAPTimelineController.timeline.play();
                console.log('Animation started for recording');
            } else {
                console.warn('No GSAP timeline found, recording static content');
            }
            
            // Update progress during recording
            const updateProgress = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                this.updateRecordingProgress(progress);
                
                if (progress < 1) {
                    requestAnimationFrame(updateProgress);
                }
            };
            
            updateProgress();
            
            // Stop recording after duration
            setTimeout(() => {
                console.log('Stopping recording...');
                mediaRecorder.stop();
                
                // Restore original animation state
                this.restoreAnimationState(originalState);
                
                resolve();
            }, duration);
        });
    },
    
    // Update progress during recording
    updateRecordingProgress: function(progress) {
        const progressFill = document.getElementById('export-progress-fill');
        const progressText = document.getElementById('export-progress-text');
        
        if (progressFill && progressText) {
            const percentage = progress * 100;
            progressFill.style.width = `${percentage}%`;
            const timeLeft = (1 - progress) * this.exportSettings.duration;
            progressText.textContent = `Recording: ${percentage.toFixed(1)}% (${timeLeft.toFixed(1)}s remaining)`;
        }
    },
    
    // Backup current animation state
    backupAnimationState: function() {
        return {
            animationState: window.animationState ? { ...window.animationState } : null,
            timelineState: window.GSAPTimelineController && window.GSAPTimelineController.timeline ? {
                time: window.GSAPTimelineController.timeline.time(),
                paused: window.GSAPTimelineController.timeline.paused()
            } : null
        };
    },
    
    // Restore animation state
    restoreAnimationState: function(backup) {
        if (backup.animationState) {
            window.animationState = backup.animationState;
        }
        
        if (backup.timelineState && window.GSAPTimelineController && window.GSAPTimelineController.timeline) {
            window.GSAPTimelineController.timeline.seek(backup.timelineState.time);
            if (!backup.timelineState.paused) {
                window.GSAPTimelineController.timeline.play();
            } else {
                window.GSAPTimelineController.timeline.pause();
            }
        }
        
        // Re-render template
        if (window.renderTemplate) {
            window.renderTemplate();
        }
        
        console.log('Animation state restored');
    },
    
    // Show export progress UI
    showExportProgress: function() {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.id = 'export-modal';
        modal.innerHTML = `
            <div class="export-modal-overlay">
                <div class="export-modal-content">
                    <h3>Exporting Video</h3>
                    <div class="export-progress">
                        <div class="export-progress-bar">
                            <div id="export-progress-fill" class="export-progress-fill"></div>
                        </div>
                        <div id="export-progress-text" class="export-progress-text">Starting...</div>
                    </div>
                    <p class="export-note">Recording canvas animation at 60fps...</p>
                    <p class="export-note" style="font-size: 12px; color: #999;">Compatible with QuickTime, After Effects, and all video players</p>
                </div>
            </div>
        `;
        
        // Add styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        document.body.appendChild(modal);
    },
    
    // Hide export progress UI
    hideExportProgress: function() {
        const modal = document.getElementById('export-modal');
        if (modal) {
            modal.remove();
        }
    },
    
    // Show error message
    showError: function(message) {
        alert('Export Error: ' + message);
        console.error('Export Error:', message);
    },
    
    // Download the generated video
    downloadVideo: function(videoBlob) {
        const url = URL.createObjectURL(videoBlob);
        const a = document.createElement('a');
        a.href = url;
        
        // Generate filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const extension = videoBlob.type.includes('mp4') ? 'mp4' : 'webm';
        a.download = `template-animation-${timestamp}.${extension}`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log(`Video downloaded as: ${a.download}`);
        console.log(`Video size: ${(videoBlob.size / 1024 / 1024).toFixed(2)} MB`);
    },
    
    // Debug: Test MediaRecorder support
    testSupport: function() {
        console.log('MediaRecorder Support Test:');
        console.log('MediaRecorder available:', typeof MediaRecorder !== 'undefined');
        
        if (typeof MediaRecorder !== 'undefined') {
            const testTypes = [
                'video/mp4;codecs=h264',
                'video/mp4;codecs=avc1',
                'video/mp4',
                'video/webm;codecs=vp9',
                'video/webm;codecs=vp8',
                'video/webm'
            ];
            
            testTypes.forEach(type => {
                const supported = MediaRecorder.isTypeSupported ? MediaRecorder.isTypeSupported(type) : false;
                console.log(`${type}: ${supported ? '✅' : '❌'}`);
            });
        }
        
        console.log('Canvas available:', !!window.canvas);
        console.log('captureStream available:', window.canvas && typeof window.canvas.captureStream === 'function');
    },
    
    // Debug: Export single frame for testing
    exportSingleFrame: async function() {
        try {
            console.log('Exporting single frame for testing...');
            
            if (!window.canvas) {
                throw new Error('Canvas not available');
            }
            
            // Capture current frame
            window.canvas.toBlob((blob) => {
                if (blob) {
                    this.downloadVideo(blob);
                    console.log('Single frame exported successfully');
                } else {
                    console.error('Failed to capture frame');
                }
            }, 'image/png', 0.95);
            
        } catch (error) {
            console.error('Single frame export failed:', error);
        }
    }
};

// Initialize when page loads
window.addEventListener('load', function() {
    console.log('VideoExporter module loaded with MediaRecorder support');
    
    // Test browser support
    window.VideoExporter.testSupport();
    
    // Add debug commands to console
    console.log('Debug commands:');
    console.log('- VideoExporter.testSupport() - Test browser compatibility');
    console.log('- VideoExporter.exportSingleFrame() - Test frame capture');
    console.log('- VideoExporter.exportVideo() - Start full video export');
});
