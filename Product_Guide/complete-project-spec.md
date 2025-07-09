# Complete Project Specification - Animated Title Template Editor

## 🎯 POC Objective
Demonstrate to CEO how a template-based system can save designer/animator time while maintaining brand consistency through smart constraints.

## ⏱️ Timeline
2 days to complete functional demo

## 🎨 Template: Animated Title Card

### Core Features to Demonstrate

#### 1. **Dynamic Text Hierarchy**
- **Title**: Main header (required)
- **Subtitle 1-4**: Optional supporting text lines with different hierarchy levels
- **Smart Visibility**: Users can show/hide any subtitle while maintaining vertical centering
- **Auto-sizing**: Long text automatically reduces font size within defined limits

#### 2. **Smart Layout Logic**
- **Vertical Centering**: Composition auto-adjusts when elements are shown/hidden
- **Text Relationships**: 
  - Font sizes adjust based on content length
  - Line spacing responds to number of active elements
  - Maintains visual hierarchy regardless of configuration

#### 3. **Constrained Customization**
- **Color Selection**: 
  - Locked color swatches (no custom colors)
  - Separate controls for text and background
  - Brand-compliant palette only
- **Icon System**:
  - Replace default icons from approved set
  - Adjustable count (min/max limits)
  - Auto-distribution based on longest text line width

#### 4. **Professional Animation (GSAP)**
- **Text Reveal**: Staggered line animations with precise easing
- **Subtle Motion**: Position/kerning micro-animations
- **Timing**: ~3-5 second total duration
- **Quality**: Broadcast-ready smoothness at 30fps

### 🎯 Success Metrics for Demo

1. **Time Savings**: Show how a 5-minute task replaces 30+ minutes of designer work
2. **Consistency**: Demonstrate how constraints ensure brand compliance
3. **Quality**: Export matches professional animation standards
4. **Flexibility**: Multiple valid configurations from single template

### 📋 Demo Flow

1. **Show Template**: Display default configuration
2. **Edit Content**: 
   - Change text to relevant example
   - Toggle subtitle visibility
   - Adjust icon count
3. **Style Changes**: Switch between pre-approved color schemes
4. **Preview**: Play animation in browser
5. **Export**: Generate MP4 file
6. **Show Variations**: Quickly create 2-3 different versions

### ⚠️ Critical Requirements

- **Custom Font**: Must load and display Wix brand fonts correctly
- **Pixel-Perfect Design**: Match Figma specifications exactly
- **Smooth Animation**: No janky movements or timing issues
- **Reliable Export**: MP4 generation must work consistently

### 🚫 Out of Scope for POC
- User authentication
- Template switching
- Project saving
- Rendering server integration
- Timeline/keyframe access
- Mobile support

## System Design

### Architecture Pattern
- **Single Page Application (SPA)**
  - Monolithic HTML file for POC
  - Client-side only (no backend required)
  - Event-driven UI updates
  - Canvas-based rendering pipeline

### State Management
- **Simple JavaScript Object State**
  - Single source of truth object
  - Direct property updates
  - Event listeners for UI synchronization
  - No complex state libraries needed

### Data Flow
- **Unidirectional Flow**
  - User Input → State Update → Canvas Re-render
  - Export triggers separate rendering pipeline
  - Real-time preview uses requestAnimationFrame
  - Export uses frame-by-frame capture

## Technical Stack

### Core Technologies
- **HTML5 Canvas** - Main rendering surface
- **Vanilla JavaScript** - Keep it simple for POC
- **GSAP 3** - Professional animation control
- **MediaRecorder API** - MP4 export
- **Canvas API** - Drawing and compositing

### Libraries
- **GSAP Core + Timeline** - Animation sequencing
- **GSAP EasePack** - Custom easing curves (Power2, Cubic, etc.)
- **WebFont Loader** - Custom font support
- **Canvas-to-MP4** - Video encoding

### Asset Support
- **Images**: PNG with alpha channel support
- **Vectors**: SVG rendering to canvas
- **Animations**: GIF frame extraction and playback
- **Fonts**: WOFF/WOFF2 custom fonts

### 🛠️ Technical Implementation

#### Canvas Setup
- **Resolution**: 1920×1080 (Full HD)
- **Frame Rate**: 30fps
- **Background**: Support for both solid colors and transparency (alpha)

#### Export Capabilities
- **Direct MP4 Export**: 
  - Browser-independent rendering (no performance impact)
  - Consistent 30fps output
  - No alpha in initial POC
- **Preview Mode**: Real-time animation playback before export

## Authentication Process
- **None Required** - POC is standalone
- **Future Consideration**: OAuth for production

## Route Design
- **Single Route Application**
  - index.html serves everything
  - No routing needed for POC
  - Hash-based states for undo/redo (future)

## API Design

### Internal APIs (JavaScript Methods)

#### Animation Controller
```javascript
- createTimeline(config) // Returns GSAP timeline
- setEasing(easingType) // Power2.inOut, Cubic.out, etc.
- setDuration(seconds)
- preview() // Plays animation
- pause()
- seek(time)
```

#### Canvas Renderer
```javascript
- renderFrame(currentTime) // Renders specific frame
- clearCanvas()
- exportFrameData() // Returns image data
- setResolution(width, height)
- setBackground(color, alpha)
```

#### Export Engine
```javascript
- startExport(format, quality)
- captureFrame() // Adds frame to video
- finalizeExport() // Returns MP4 blob
- setFrameRate(fps)
- setCodec(type) // H.264 for compatibility
```

#### Asset Manager
```javascript
- loadFont(fontUrl, fontFamily)
- loadImage(url) // Returns promise
- loadSVG(url) // Converts to canvas-ready format
- extractGIFFrames(url) // Returns frame array
- preloadAssets(assetList)
```

### External APIs (Future)
- **Font API**: Google Fonts or custom CDN
- **Asset Storage**: S3 or similar for user uploads
- **Render Farm**: For production-quality exports

## Database Design ERD

### POC Phase
- **No Database Required**
- All data stored in browser memory
- LocalStorage for settings persistence

### Future Production Database

#### Templates Table
- template_id (PK)
- name
- category
- thumbnail_url
- config_json
- created_at
- updated_at

#### Projects Table
- project_id (PK)
- user_id (FK)
- template_id (FK)
- name
- state_json
- preview_url
- created_at
- modified_at

#### Assets Table
- asset_id (PK)
- user_id (FK)
- type (font/image/svg/gif)
- url
- metadata_json
- uploaded_at

#### Exports Table
- export_id (PK)
- project_id (FK)
- format (mp4/gif/png_sequence)
- resolution
- frame_rate
- duration
- url
- created_at

### Animation Architecture Notes

#### Timing Control
- **Frame-based timing** for accuracy
- **Time remapping** support
- **Bezier curve editor** data structure
- **Keyframe interpolation** types

#### Rendering Pipeline
1. **Update Phase**: Calculate all animated properties
2. **Composite Phase**: Layer all elements
3. **Effect Phase**: Apply filters/transforms
4. **Output Phase**: Render to canvas or export

#### Performance Optimizations
- **Dirty rectangle** tracking
- **Layer caching** for static elements
- **GPU acceleration** where available
- **Web Workers** for export processing

#### Export Quality Settings
- **Bitrate**: Variable (2-10 Mbps)
- **Codec**: H.264 (universal compatibility)
- **Profile**: High Profile for quality
- **Pixel Format**: YUV 4:2:0
- **Frame Accuracy**: Exact frame timing

## User Interface Design

### Layout Structure

**Main Layout:** Fixed single-page application
- **Left Panel:** Tools panel - **resizable width** (default ~33%, min: 280px, max: 50%)
- **Divider:** Draggable vertical separator - 4px wide hit area
- **Right Area:** Canvas container - responsive width (remaining space)
- **Canvas:** 1920×1080 content that **scales to fit container width** maintaining aspect ratio
- **Bottom Bar:** Full width control strip - fixed height ~60px

**Scrolling Behavior:**
- Left panel scrolls independently when content overflows
- Right canvas area remains fixed (no scroll)
- Canvas scales down/up to always fit visible area

**Resizing Behavior:**
- Drag divider to adjust panel widths
- Smooth real-time resizing
- Canvas auto-scales during resize
- Panel widths persist during session

### Core Components

#### Left Tools Panel
**Header Section**
- Small app identifier
- Generous white space padding (40px top)

**Text Controls Section**
- Main Title input field (light border, generous padding)
- Subtitle 1-4 input fields 
- Minimal toggle switches (simple on/off) aligned right
- Ample spacing between fields (24px)

**Style Section**
- Clean grid of color swatches (no labels needed)
- Simple radio selection for background/text
- Monochromatic hover states

**Icon Section**
- Grid view (no borders, just spacing)
- Minimal slider with numeric input
- Clean sectioning with white space

#### Canvas Area
- Centered preview with automatic fit-to-width scaling
- Pure white or selected background
- No visual guides or overlays
- Subtle drop shadow to separate from UI

#### Resizable Divider
- Vertical line between panels
- 1px visual width (light gray #F0F0F0)
- 4px invisible hit area for easier grabbing
- Cursor: col-resize on hover
- Active state: 1px black line while dragging
- No handle or grip icons (pure minimalism)

### Interaction Patterns

**Immediate Feedback**
- Real-time canvas updates
- Subtle hover states (opacity change)
- Minimal transition animations (150ms)
- No unnecessary visual feedback

**Workflow Optimization**
- Natural tab flow top to bottom
- Enter advances fields
- Space triggers preview
- Clean disabled states (reduced opacity)

### Visual Design Elements & Color Scheme

**Aesthetic Direction**
- Pure minimalism
- Maximum white space
- No decorative elements
- Subtle depth through spacing only

**Color Palette**
- Background: Pure white (#FFFFFF)
- Text: Pure black (#000000)
- Borders: Very light gray (#F0F0F0)
- Hover states: 10% black opacity
- Active elements: Black with 2px black border
- Disabled: 30% opacity

**UI Elements**
- No rounded corners (sharp edges)
- 1px borders where needed
- No shadows except canvas
- No gradients or textures

### Mobile, Web App, Desktop Considerations

**Desktop-Only Design**
- Minimum viewport: 1440×900
- Canvas auto-scales to fit available width
- No mobile breakpoints
- Optimized for mouse interaction

**Canvas Scaling**
- Maintains 16:9 aspect ratio
- Scales down for smaller windows
- Maximum scale: 100% (1920×1080)
- Centered in container

### Typography

**WixMadefor Font Usage**
- Section Labels: WixMadefor Light, 11px, uppercase, letter-spacing: 2px
- Input Fields: WixMadefor Light, 14px
- Buttons: WixMadefor Medium, 13px
- Field Labels: WixMadefor Light, 12px

**Spacing Principles**
- Line height: 1.6x font size
- Paragraph spacing: 24px
- Section spacing: 48px
- Consistent padding: 16px increments

### Accessibility

**Contrast & Visibility**
- Pure black on white (maximum contrast)
- Focus states: 2px solid black outline
- Clear interactive boundaries

**Keyboard Navigation**
- Logical tab order
- Visible focus indicators
- Escape closes any overlays
- Enter submits active field

**Simplicity First**
- No reliance on color for meaning
- Clear text labels (no icon-only buttons)
- Obvious interactive elements
- Clean disabled states

## UI Requirements Summary
- **Functional Sidebar** (minimal styling acceptable):
  - Text input fields for each hierarchy level
  - Show/hide toggles for subtitles
  - Color swatches selector
  - Icon picker with count control
  - Preview button
  - Export button

## 📦 Deliverable
Single HTML file with:
- Embedded GSAP animations
- Functional editing panel
- Real-time preview
- Direct MP4 export
- Professional polish on template visuals