# CLAUDE.md - Animated Title Template Editor

## 🎯 Project Overview

**Objective**: Proof-of-concept template-based animation system for CEO demonstration  
**Timeline**: 2-day POC development  
**Goal**: Show how templates can save 25+ minutes of designer time while maintaining brand consistency

## 📋 Current Implementation Status

### ✅ **Completed Features**
- **Modular Architecture**: Clean separation of concerns with CSS/JS modules
- **Dynamic Text Hierarchy**: Top title, main title, subtitle1, subtitle2 with show/hide toggles
- **Smart Font Loading**: All Wix Madefor Display weights (400, 700, 800) preloaded
- **Canvas Rendering**: 1920×1080 resolution with proper scaling
- **Auto-sizing Text**: Font sizes adjust based on content length with 230px margins
- **Responsive Layout**: Resizable left panel + canvas area
- **Text Kerning**: Proper auto-kerning for professional typography
- **Color System**: Background/text color controls with swatches
- **Icon System**: Icon count slider and style selector (arrow, dot, star)
- **Debug Mode**: Visual overlay with margins and element boundaries
- **Real-time Updates**: All controls update canvas immediately

### 🔄 **Partially Implemented**
- **Text Validation**: Input validation with margin compliance (needs polish)
- **Export System**: PNG export works (MP4 export needed)

### ❌ **Missing Features** 
- **GSAP Animation**: Professional animation system (core requirement)
- **MP4 Export**: MediaRecorder API implementation 
- **Preview System**: Animation preview before export
- **Template Variations**: Multiple template layouts

## 🏗️ Technical Architecture

### **Core Technologies**
- **Rendering**: HTML5 Canvas (1920×1080)
- **Language**: Vanilla JavaScript (POC simplicity)
- **Fonts**: Wix Madefor Display (Regular 400, Bold 700, ExtraBold 800)
- **State**: Global JavaScript object with event-driven updates
- **Layout**: CSS Flexbox with resizable panels

### **Modular File Structure**
```
/
├── index.html                          # Main HTML structure (clean, references modules)
├── styles/                             # CSS Modules
│   ├── main.css                        # Core styles and font definitions
│   ├── panel.css                       # Left panel styling
│   └── canvas.css                      # Canvas area styling
├── scripts/                            # Core Application Logic
│   ├── app.js                          # Main application state and canvas scaling
│   ├── template-renderer.js            # Template rendering engine
│   └── panel-controls.js               # Event handlers for panel controls
├── template/                           # Template-specific Components
│   └── components/
│       ├── text-renderer.js            # Text rendering functions
│       ├── icon-renderer.js            # Icon rendering functions
│       └── debug-overlay.js            # Debug overlay functionality
├── Issues/                             # Bug tracking
│   ├── resolved/                       # Completed bug fixes
│   └── [active-bugs].md
├── Product_Guide/                      # Original specifications
│   └── complete-project-spec.md
├── Fonts/                              # Brand fonts
│   └── Wix_Madefor_Display/
└── CLAUDE.md                           # This file
```

### **Global State Management**
```javascript
window.templateState = {
    topTitle: string,           // "Koko Samba"
    mainTitle: string,          // "PRODUCT GUILD CARPOOL" (forced uppercase)
    subtitle1: string,          // "Wix Japam 5th good Dotan"
    subtitle2: string,          // "Greeting from Avishai & Nir"
    showLogo: boolean,          // Logo visibility toggle
    showSubtitle1: boolean,     // Subtitle1 visibility toggle
    showSubtitle2: boolean,     // Subtitle2 visibility toggle
    backgroundColor: string,    // Background color hex
    textColor: string,          // Text color hex
    iconCount: number,          // 1-6 icons
    iconStyle: string,          // 'arrow', 'dot', 'star'
    debugMode: boolean          // Debug overlay toggle
}
```

### **Key Global Functions**
- `window.renderTemplate()`: Main rendering pipeline
- `window.canvas`: Canvas element (1920×1080)
- `window.ctx`: Canvas 2D context
- `window.renderTopTitle()`: Top title rendering
- `window.renderMainTitle()`: Main title with 2-line breaking
- `window.renderSubtitle1()`: Subtitle1 rendering
- `window.renderSubtitle2()`: Subtitle2 rendering
- `window.renderLogo()`: Logo rendering
- `window.renderIcons()`: Icon array rendering
- `window.renderDebugOverlay()`: Debug visualization
- `window.isTextWithinMargins()`: Text validation
- `scaleCanvas()`: Responsive canvas sizing
- `waitForFonts()`: Font loading with fallback

### **Module Dependencies**
```
index.html
├── scripts/app.js                      # Initializes canvas, state, scaling
├── template/components/text-renderer.js   # Text rendering functions
├── template/components/icon-renderer.js   # Icon rendering functions
├── template/components/debug-overlay.js   # Debug overlay
├── scripts/template-renderer.js        # Main template engine
└── scripts/panel-controls.js           # UI event handlers
```

## 🎨 Design System

### **Typography Hierarchy**
- **Top Title**: WixMadefor Display Bold 700, max 64px, auto-sizing
- **Main Title**: WixMadefor Display ExtraBold 800, max 240px, 2-line max
- **Subtitle1**: WixMadefor Display Bold 700, max 75px, auto-sizing
- **Subtitle2**: WixMadefor Display Regular 400, max 40px, auto-sizing

### **Layout System**
- **Margins**: 230px left/right margins enforced
- **Spacing**: 26px vertical spacing between elements
- **Centering**: Vertical centering with proper font metrics
- **Canvas**: 1920×1080 internal resolution, scaled to fit

### **Color System**
Available color swatches:
- Black (#000000)
- White (#ffffff)
- Dark Gray (#1f1f1f)
- Light Gray (#f5f5f5)
- Wix Blue (#0070f3)
- Wix Purple (#7b68ee)

### **Icon System**
- **Arrow**: Circular border with left-pointing arrow
- **Dot**: Filled circles
- **Star**: 5-pointed star shapes
- **Count**: 1-6 icons distributed across text width

## 🐛 Known Issues & Bug Tracking

### **Active Issues**
*No active issues - all known bugs have been resolved!*

### **Recently Resolved**
1. **Template Editor Disconnection** - ✅ **RESOLVED**
   - Fixed missing HTML input elements for color and icon controls
   - Fixed ID mismatches between HTML and JavaScript
   - Added click event handlers for color swatches and icon style selector
   - Fixed variable scope issues with global window objects
   - Fixed initialization timing with proper delay

2. **Canvas Scaling** - ✅ **RESOLVED**
   - Fixed smooth real-time canvas scaling during divider drag
   - Removed debouncing delays for immediate user feedback

3. **Text Kerning** - ✅ **RESOLVED**
   - Fixed with `ctx.fontKerning = 'auto'`

4. **Font Loading** - ✅ **RESOLVED**
   - All weights now preload correctly

## 📈 Development Roadmap

### **Phase 1: Modular Architecture** ✅ **COMPLETED**
- [x] Split monolithic HTML into modular components
- [x] Separate CSS into logical modules
- [x] Extract JavaScript into reusable functions
- [x] Implement proper global variable management
- [x] Fix template editor-canvas connection

### **Phase 2: Animation System** (Next Priority)
- [ ] GSAP integration
- [ ] Timeline creation for text reveals
- [ ] Staggered animation sequences
- [ ] Easing curve implementation

### **Phase 3: Export System**
- [ ] MediaRecorder API setup
- [ ] Frame-by-frame capture
- [ ] MP4 generation at 30fps
- [ ] Progress indicators

### **Phase 4: UI Enhancement**
- [ ] Advanced color picker
- [ ] Icon upload system
- [ ] Preview controls
- [ ] Export settings

## 🔧 Development Guidelines

### **Code Standards**
- **Modular Architecture**: Separate concerns into logical modules
- **Global Variables**: Use `window.*` for shared state and functions
- **Vanilla JavaScript**: No frameworks for POC simplicity
- **Consistent Indentation**: 4-space tabs
- **Clear Function Naming**: Descriptive and consistent
- **Event-driven Architecture**: Reactive UI updates

### **Module Guidelines**
- **CSS Modules**: Logical separation by functionality
- **JavaScript Modules**: Single responsibility principle
- **Global Access**: Essential functions exposed via `window.*`
- **Error Handling**: Proper checks for global variable availability
- **Initialization Order**: Proper timing with window.load events

### **Performance Considerations**
- **Debounced Resize Events**: 100ms for smooth scaling
- **Canvas Optimization**: Proper clearing and redrawing
- **Font Preloading**: Prevents FOIT (Flash of Invisible Text)
- **Efficient State Updates**: Minimal re-renders

### **Testing Strategy**
- **Manual Testing**: Desktop browsers
- **Font Loading Verification**: Network tab monitoring
- **Canvas Scaling**: Multiple window sizes
- **Text Input Validation**: Margin compliance
- **Real-time Updates**: All controls functional

## 🚀 Parallel Development

### **Module Independence**
The new modular structure enables multiple developers to work simultaneously:

- **Template Developer**: Can work on `template/components/` without affecting UI
- **UI Developer**: Can modify `scripts/panel-controls.js` independently
- **Styling Developer**: Can update `styles/` modules without touching logic
- **Core Developer**: Can enhance `scripts/app.js` and `template-renderer.js`

### **Safe Collaboration Areas**
- **CSS Modules**: `styles/` directory is style-only
- **Template Components**: `template/components/` for rendering logic
- **Panel Controls**: `scripts/panel-controls.js` for UI interactions
- **Main Logic**: `scripts/app.js` and `template-renderer.js` for core functionality

## 📊 Success Metrics

### **Demo Requirements**
- [x] Real-time template editing
- [x] Brand consistency through constraints
- [x] Professional typography rendering
- [ ] Broadcast-quality export (30fps MP4)
- [ ] Multiple template variations quickly

### **Technical Benchmarks**
- Canvas render time: <16ms per frame ✅
- Font loading: <2 seconds ✅
- Export speed: Real-time or faster (PNG only)
- UI responsiveness: <100ms input lag ✅

## 🔍 Debugging Information

### **Common Issues**
- **Font not loading**: Check font file paths and CORS
- **Canvas scaling**: Verify container dimensions
- **State updates**: Ensure global variables are available
- **Module loading**: Check script order in HTML
- **Event handlers**: Verify initialization timing

### **Development Tools**
- Browser DevTools Canvas inspector
- Font loading events in Network tab
- Performance profiler for animations
- Console logging for state changes
- Global variable inspection in console

### **Console Commands for Debugging**
```javascript
// Check global state
console.log(window.templateState);

// Test rendering
window.renderTemplate();

// Check canvas
console.log(window.canvas, window.ctx);

// Test text validation
window.isTextWithinMargins("TEST TEXT", "mainTitle");
```

## 🔄 Recent Changes

### **Modular Restructuring (Latest)**
- Converted monolithic `index.html` (1300+ lines) to modular architecture
- Split CSS into 3 logical modules (`main.css`, `panel.css`, `canvas.css`)
- Extracted JavaScript into 6 specialized modules
- Implemented proper global variable management
- Fixed template editor-canvas connection issues
- Added comprehensive event handlers for all UI controls

### **Bug Fixes**
- Fixed missing HTML input elements for color and icon controls
- Fixed ID mismatches between HTML and JavaScript
- Added click event handlers for color swatches and icon style selector
- Fixed variable scope issues with proper global window objects
- Fixed initialization timing with proper delay after window.load

---

**Last Updated**: Current development session (Modular Architecture Complete)  
**Next Review**: After animation system implementation  
**Maintainer**: Development team  
**Architecture**: Modular, ready for parallel development