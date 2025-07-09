// Video Export System - Frame-by-Frame Capture for 30fps MP4 Export
// High-quality export independent of browser performance

window.VideoExporter = {
    isExporting: false,
    exportSettings: {
        fps: 30,
        duration: 5, // seconds
        width: 1920,
        height: 1080,
        quality: 0.95, // PNG quality for frame capture
        format: 'mp4'
    },
    
    // Calculate total frames needed
    getTotalFrames: function() {
        return this.exportSettings.fps * this.exportSettings.duration; // 30 * 5 = 150 frames
    },
    
    // Main export function
    exportVideo: async function() {
        if (this.isExporting) {
            console.warn('Export already in progress');
            return;
        }
        
        console.log('Starting video export...');
        console.log(`Settings: ${this.exportSettings.width}x${this.exportSettings.height} @ ${this.exportSettings.fps}fps for ${this.exportSettings.duration}s`);
        
        this.isExporting = true;
        
        try {
            // Show export UI
            this.showExportProgress();
            
            // Capture all frames
            const frames = await this.captureAllFrames();
            
            // Encode to video
            const videoBlob = await this.encodeFramesToVideo(frames);
            
            // Download the video
            this.downloadVideo(videoBlob);
            
            console.log('Video export completed successfully');
            
        } catch (error) {
            console.error('Video export failed:', error);
            this.showError('Export failed: ' + error.message);
        } finally {
            this.isExporting = false;
            this.hideExportProgress();
        }
    },
    
    // Capture all frames using frame-by-frame timeline control
    captureAllFrames: async function() {
        const totalFrames = this.getTotalFrames();
        const frames = [];
        
        console.log(`Capturing ${totalFrames} frames...`);
        
        // Store original animation state
        const originalState = this.backupAnimationState();
        
        for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
            // Calculate exact time position for this frame
            const timePosition = frameIndex / this.exportSettings.fps;
            
            // Set animation to exact frame position
            this.setAnimationToFrame(timePosition);
            
            // Force render the template at this exact time
            window.renderTemplate();
            
            // Capture the frame
            const frameData = await this.captureFrame();
            frames.push(frameData);
            
            // Update progress
            this.updateProgress(frameIndex + 1, totalFrames);
            
            // Allow UI to update (non-blocking)
            await this.sleep(1);
            
            console.log(`Frame ${frameIndex + 1}/${totalFrames} captured (${timePosition.toFixed(3)}s)`);
        }
        
        // Restore original animation state
        this.restoreAnimationState(originalState);
        
        console.log(`All ${totalFrames} frames captured successfully`);
        return frames;
    },
    
    // Set GSAP timeline to exact frame position
    setAnimationToFrame: function(timePosition) {
        if (window.GSAPTimelineController && window.GSAPTimelineController.timeline) {
            // Pause the timeline and seek to exact position
            window.GSAPTimelineController.timeline.pause();
            window.GSAPTimelineController.timeline.seek(timePosition);
        } else {
            // If no animation, ensure we're in final state
            if (window.GSAPTimelineController && window.GSAPTimelineController.showFinalState) {
                window.GSAPTimelineController.showFinalState();
            }
        }
    },
    
    // Capture single frame from canvas
    captureFrame: function() {
        return new Promise((resolve, reject) => {
            try {
                if (!window.canvas) {
                    throw new Error('Canvas not available');
                }
                
                // Capture high-quality frame
                window.canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to capture frame'));
                    }
                }, 'image/png', this.exportSettings.quality);
                
            } catch (error) {
                reject(error);
            }
        });
    },
    
    // Encode frames to MP4 video
    encodeFramesToVideo: async function(frames) {
        console.log('Encoding frames to MP4...');
        
        // Check for WebCodecs support (modern browsers)
        if (typeof VideoEncoder !== 'undefined') {
            return await this.encodeWithWebCodecs(frames);
        } else {
            // Fallback to alternative encoding method
            return await this.encodeWithFallback(frames);
        }
    },
    
    // Modern WebCodecs encoding (Chrome/Edge)
    encodeWithWebCodecs: async function(frames) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            
            const encoder = new VideoEncoder({
                output: (chunk) => {
                    chunks.push(new Uint8Array(chunk.byteLength));
                    chunk.copyTo(chunks[chunks.length - 1]);
                },
                error: (error) => {
                    console.error('WebCodecs encoding error:', error);
                    reject(error);
                }
            });
            
            // Configure high-quality H.264 encoding
            encoder.configure({
                codec: 'avc1.42E028', // H.264 Baseline Profile, Level 4.0 (supports 1080p)
                width: this.exportSettings.width,
                height: this.exportSettings.height,
                bitrate: 8000000, // 8 Mbps for high quality
                framerate: this.exportSettings.fps,
                alpha: 'discard'
            });
            
            // Process each frame
            let frameIndex = 0;
            const processNextFrame = async () => {
                if (frameIndex >= frames.length) {
                    // Finalize encoding
                    await encoder.flush();
                    encoder.close();
                    
                    // Combine chunks into final video
                    const totalSize = chunks.reduce((size, chunk) => size + chunk.byteLength, 0);
                    const videoData = new Uint8Array(totalSize);
                    let offset = 0;
                    
                    chunks.forEach(chunk => {
                        videoData.set(chunk, offset);
                        offset += chunk.byteLength;
                    });
                    
                    const videoBlob = new Blob([videoData], { type: 'video/mp4' });
                    resolve(videoBlob);
                    return;
                }
                
                try {
                    // Convert blob to ImageBitmap
                    const imageBitmap = await createImageBitmap(frames[frameIndex]);
                    
                    // Create VideoFrame
                    const videoFrame = new VideoFrame(imageBitmap, {
                        timestamp: frameIndex * (1000000 / this.exportSettings.fps) // microseconds
                    });
                    
                    // Encode frame
                    encoder.encode(videoFrame);
                    videoFrame.close();
                    imageBitmap.close();
                    
                    frameIndex++;
                    this.updateEncodingProgress(frameIndex, frames.length);
                    
                    // Process next frame
                    setTimeout(processNextFrame, 1);
                    
                } catch (error) {
                    reject(error);
                }
            };
            
            processNextFrame();
        });
    },
    
    // Fallback encoding for browsers without WebCodecs
    encodeWithFallback: async function(frames) {
        console.log('Using fallback encoding method...');
        
        // For now, create a simple image sequence download
        // This can be enhanced with FFmpeg.wasm for true MP4 encoding
        return this.createImageSequenceZip(frames);
    },
    
    // Create ZIP of PNG sequence as fallback
    createImageSequenceZip: async function(frames) {
        // Simple fallback - download first frame as preview
        // In production, this would use FFmpeg.wasm or similar
        console.warn('WebCodecs not supported. Downloading preview frame instead.');
        return frames[0]; // Return first frame as PNG
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
            }
        }
        
        // Re-render template
        if (window.renderTemplate) {
            window.renderTemplate();
        }
    },
    
    // Download the generated video
    downloadVideo: function(videoBlob) {
        const url = URL.createObjectURL(videoBlob);
        const a = document.createElement('a');
        a.href = url;
        
        // Generate filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const extension = videoBlob.type.includes('mp4') ? 'mp4' : 'png';
        a.download = `template-animation-${timestamp}.${extension}`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log(`Video downloaded as: ${a.download}`);
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
                        <div id="export-progress-text" class="export-progress-text">Preparing...</div>
                    </div>
                    <p class="export-note">Please wait while we render your animation at 30fps...</p>
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
    
    // Update progress during frame capture
    updateProgress: function(current, total) {
        const progressFill = document.getElementById('export-progress-fill');
        const progressText = document.getElementById('export-progress-text');
        
        if (progressFill && progressText) {
            const percentage = (current / total) * 100;
            progressFill.style.width = `${percentage}%`;
            progressText.textContent = `Capturing frames: ${current}/${total} (${percentage.toFixed(1)}%)`;
        }
    },
    
    // Update progress during encoding
    updateEncodingProgress: function(current, total) {
        const progressText = document.getElementById('export-progress-text');
        
        if (progressText) {
            const percentage = (current / total) * 100;
            progressText.textContent = `Encoding video: ${current}/${total} (${percentage.toFixed(1)}%)`;
        }
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
    
    // Utility: Sleep function for non-blocking delays
    sleep: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    // Debug: Export single frame for testing
    exportSingleFrame: async function() {
        try {
            console.log('Exporting single frame for testing...');
            const frameBlob = await this.captureFrame();
            this.downloadVideo(frameBlob);
            console.log('Single frame exported successfully');
        } catch (error) {
            console.error('Single frame export failed:', error);
        }
    }
};

// Initialize when page loads
window.addEventListener('load', function() {
    console.log('VideoExporter module loaded');
    
    // Add debug command to console
    console.log('Debug: Use VideoExporter.exportSingleFrame() to test frame capture');
    console.log('Debug: Use VideoExporter.exportVideo() to start full export');
}); 