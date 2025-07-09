# CLAUDE.md - Animated Title Template Editor

## 🎯 Project Overview

**Objective**: Proof-of-concept template-based animation system for CEO demonstration  
**Timeline**: 2-day POC development  
**Goal**: Show how templates can save 25+ minutes of designer time while maintaining brand consistency

## 📋 Current Implementation Status

### ✅ **Completed Features**
- **Dynamic Text Hierarchy**: Main title, subtitle, description with show/hide toggles
- **Smart Font Loading**: All Wix Madefor Display weights (400, 700, 800) preloaded
- **Canvas Rendering**: 1920×1080 resolution with proper scaling
- **Auto-sizing Text**: Font sizes adjust based on content length
- **Responsive Layout**: Resizable left panel + canvas area
- **Text Kerning**: Proper auto-kerning for professional typography

### 🔄 **Partially Implemented**
- **Canvas Scaling**: Basic scaling works, smooth drag scaling needs fix
- **UI Controls**: Basic input fields and toggles functional
- **Color System**: Background/text color inputs (needs proper swatches)
- **Icon System**: Basic icon rendering (needs icon picker)

### ❌ **Missing Features** 
- **GSAP Animation**: Professional animation system (core requirement)
- **MP4 Export**: MediaRecorder API implementation 
- **Color Swatches**: Brand-compliant color palette
- **Icon Management**: Icon picker with count control
- **Preview System**: Animation preview before export

## 🏗️ Technical Architecture

### **Core Technologies**
- **Rendering**: HTML5 Canvas (1920×1080)
- **Language**: Vanilla JavaScript (POC simplicity)
- **Fonts**: Wix Madefor Display (Regular 400, Bold 700, ExtraBold 800)
- **State**: Simple JavaScript object with event-driven updates
- **Layout**: CSS Flexbox with resizable panels

### **File Structure**
```
/
├── index.html          # Main application (single file POC)
├── Issues/             # Bug tracking
│   └── bug-002-canvas-scaling.md
├── Product_Guide/      # Original specifications
│   └── complete-project-spec.md
├── Fonts/              # Brand fonts
│   └── Wix_Madefor_Display/
└── CLAUDE.md           # This file
```

### **State Management**
```javascript
templateState = {
    brandName: string,
    mainTitle: string,
    subtitle: string,
    description: string,
    showLogo: boolean,
    showSubtitle: boolean,
    showDescription: boolean,
    backgroundColor: string,
    textColor: string,
    iconCount: number
}
```

### **Key Functions**
- `renderTemplate()`: Main rendering pipeline
- `scaleCanvas()`: Responsive canvas sizing
- `waitForFonts()`: Font loading with fallback
- `renderMainTitle()`: Title rendering with auto-kerning
- `handleDrag()`: Panel resizing functionality

## 🐛 Known Issues & Bug Tracking

### **Active Issues**
*No active issues - all known bugs have been resolved!*

### **Recently Resolved**
1. **Canvas Scaling** (`Issues/resolved/bug-002-canvas-scaling.md`) - ✅ **RESOLVED**
   - Fixed smooth real-time canvas scaling during divider drag
   - Removed debouncing delays for immediate user feedback
   - Commit: `2de5100`
2. **Text Kerning** - Fixed with `ctx.fontKerning = 'auto'`
3. **Font Loading** - All weights now preload correctly
4. **Basic Canvas Scaling** - Proper fit-to-container implemented

## 📈 Development Roadmap

### **Phase 1: Core Functionality** ✅ **COMPLETED**
- [x] Basic text editing and rendering
- [x] Font loading system
- [x] Canvas scaling and layout
- [x] Fix smooth canvas scaling during drag

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
- [ ] Color swatch system
- [ ] Icon picker interface
- [ ] Preview controls
- [ ] Export settings

## 🔧 Development Guidelines

### **Code Standards**
- Single HTML file for POC simplicity
- Vanilla JavaScript (no frameworks)
- Consistent 4-space indentation
- Clear function naming and comments
- Event-driven architecture

### **Performance Considerations**
- Debounced resize events (100ms)
- Canvas optimization with proper clearing
- Font preloading to prevent FOIT
- Efficient state updates

### **Testing Strategy**
- Manual testing on desktop browsers
- Font loading verification
- Canvas scaling across window sizes
- Text input validation

## 🚀 Future Enhancements

### **Production Considerations**
- Database integration for templates
- User authentication system
- Cloud rendering for exports
- Template marketplace
- Mobile responsive design

### **Technical Improvements**
- WebGL for better performance
- Web Workers for export processing
- Progressive font loading
- Accessibility improvements

## 📊 Success Metrics

### **Demo Requirements**
- [ ] 5-minute task completion vs 30+ minutes manual
- [ ] Brand consistency through constraints
- [ ] Broadcast-quality export (30fps MP4)
- [ ] Multiple template variations quickly

### **Technical Benchmarks**
- Canvas render time: <16ms per frame
- Font loading: <2 seconds
- Export speed: Real-time or faster
- UI responsiveness: <100ms input lag

## 🔍 Debugging Information

### **Common Issues**
- **Font not loading**: Check font file paths and CORS
- **Canvas scaling**: Verify container dimensions
- **State updates**: Ensure event listeners are attached
- **Performance**: Monitor canvas clearing and redraws

### **Development Tools**
- Browser DevTools Canvas inspector
- Font loading events in Network tab
- Performance profiler for animations
- Console logging for state changes

---

**Last Updated**: Current development session  
**Next Review**: After animation system implementation  
**Maintainer**: Development team