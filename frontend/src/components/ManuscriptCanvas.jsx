import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  Sliders,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
  Contrast,
  Crop,
  Search,
  Sun,
  RotateCw,
  Compass,
  Check,
  X,
} from 'lucide-react';

export default function ManuscriptCanvas({
  preprocessing,
  originalImagePreview,
  hoveredWordIndex,
  onHoverBox,
}) {
  const [imageMode, setImageMode] = useState('binarized'); // 'original' | 'binarized' | 'clahe' | 'split'
  const [splitPosition, setSplitPosition] = useState(50);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Filter Adjustments
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [isInverted, setIsInverted] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0); // -15 to +15 deg
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showBoxes, setShowBoxes] = useState(true);

  // Loupe (Magnifier Glass) state
  const [isLoupeActive, setIsLoupeActive] = useState(false);
  const [loupePos, setLoupePos] = useState({ x: 0, y: 0 });
  const [loupeBgPos, setLoupeBgPos] = useState({ x: 0, y: 0 });

  // ROI / Region-of-Interest Selection Box state
  const [isSelectingROI, setIsSelectingROI] = useState(false);
  const [roiBox, setRoiBox] = useState(null); // { startX, startY, currentX, currentY }
  const [savedRoi, setSavedRoi] = useState(null);

  const containerRef = useRef(null);
  const imageRef = useRef(null);

  const getScanImageSrc = () => {
    return (
      originalImagePreview ||
      preprocessing?.clahe_image_base64 ||
      preprocessing?.binarized_image_base64
    );
  };

  const getProcessedImageSrc = () => {
    if (imageMode === 'clahe' && preprocessing?.clahe_image_base64) {
      return preprocessing.clahe_image_base64;
    }
    return preprocessing?.binarized_image_base64 || getScanImageSrc();
  };

  const activeImageSrc =
    imageMode === 'original' ? getScanImageSrc() : getProcessedImageSrc();

  // Mouse Pan Handlers
  const handleMouseDown = (e) => {
    if (isSelectingROI) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setRoiBox({ startX: x, startY: y, currentX: x, currentY: y });
      return;
    }

    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Loupe coordinates calculation
    if (isLoupeActive) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      setLoupePos({ x: mouseX, y: mouseY });

      // Loupe zoom background position (3x zoom)
      const bgX = (mouseX / rect.width) * 100;
      const bgY = (mouseY / rect.height) * 100;
      setLoupeBgPos({ x: bgX, y: bgY });
    }

    if (isSelectingROI && roiBox) {
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
      setRoiBox((prev) => ({ ...prev, currentX: x, currentY: y }));
      return;
    }

    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    if (isSelectingROI && roiBox) {
      const w = Math.abs(roiBox.currentX - roiBox.startX);
      const h = Math.abs(roiBox.currentY - roiBox.startY);
      if (w > 15 && h > 15) {
        setSavedRoi({
          x: Math.min(roiBox.startX, roiBox.currentX),
          y: Math.min(roiBox.startY, roiBox.currentY),
          width: w,
          height: h,
        });
      }
      setRoiBox(null);
      setIsSelectingROI(false);
      return;
    }
    setIsDragging(false);
  };

  const resetAllView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setBrightness(100);
    setContrast(100);
    setRotationAngle(0);
    setIsInverted(false);
    setSavedRoi(null);
  };

  // Compute CSS filter string
  const filterStyle = `brightness(${brightness}%) contrast(${contrast}%) ${
    isInverted ? 'invert(1) hue-rotate(180deg)' : ''
  }`;

  return (
    <div className="flex flex-col h-full glass-panel rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-800 shadow-lg">
      {/* Canvas Top Bar */}
      <div className="p-3 border-b border-slate-300 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900/80 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <h4 className="font-cinzel text-xs font-bold text-slate-800 dark:text-amber-200 tracking-wide">
            Manuscript Studio
          </h4>
        </div>

        <div className="flex items-center space-x-2">
          {/* Mode Switcher */}
          <div className="flex bg-slate-200 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-300 dark:border-slate-800 text-[10px]">
            <button
              onClick={() => setImageMode('original')}
              className={`px-2 py-1 rounded transition-colors ${
                imageMode === 'original'
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Raw Scan
            </button>
            <button
              onClick={() => setImageMode('clahe')}
              className={`px-2 py-1 rounded transition-colors ${
                imageMode === 'clahe'
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              CLAHE
            </button>
            <button
              onClick={() => setImageMode('binarized')}
              className={`px-2 py-1 rounded transition-colors ${
                imageMode === 'binarized'
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Binarized
            </button>
            <button
              onClick={() => setImageMode('split')}
              className={`px-2 py-1 rounded transition-colors ${
                imageMode === 'split'
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
              title="Split Comparison Wipe"
            >
              Split
            </button>
          </div>

          {/* Filter Studio Toggle */}
          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`p-1.5 rounded-lg border transition-all text-xs flex items-center gap-1 ${
              showFilterDrawer
                ? 'bg-amber-500/25 border-amber-500 text-amber-700 dark:text-amber-300'
                : 'bg-slate-200/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
            title="Image Enhancement Sliders"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px] font-semibold">Tuning</span>
          </button>
        </div>
      </div>

      {/* Expandable Image Enhancement Tuning Tray */}
      {showFilterDrawer && (
        <div className="p-3 bg-slate-200/90 dark:bg-slate-950/90 border-b border-amber-500/25 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-in slide-in-from-top-1">
          {/* Brightness */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Sun className="w-3 h-3 text-amber-500" /> Brightness
              </span>
              <span className="font-mono">{brightness}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-300 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Contrast */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Contrast className="w-3 h-3 text-amber-500" /> Contrast
              </span>
              <span className="font-mono">{contrast}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="200"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-300 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Manual Skew Angle Rotation */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <RotateCw className="w-3 h-3 text-amber-500" /> Skew Straighten
              </span>
              <span className="font-mono">{rotationAngle}°</span>
            </div>
            <input
              type="range"
              min="-15"
              max="15"
              step="0.5"
              value={rotationAngle}
              onChange={(e) => setRotationAngle(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-300 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Main Viewport Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative flex-1 min-h-[380px] bg-slate-900 dark:bg-slate-950 overflow-hidden flex items-center justify-center p-3 select-none ${
          isSelectingROI
            ? 'cursor-crosshair'
            : zoomLevel > 1
            ? 'cursor-grab active:cursor-grabbing'
            : ''
        }`}
      >
        {/* Split Comparison Mode */}
        {imageMode === 'split' ? (
          <div className="relative w-full h-[350px] max-w-[420px] overflow-hidden rounded-lg border border-amber-500/30">
            {/* Background: Processed Image */}
            <img
              src={getProcessedImageSrc()}
              alt="Processed Scan"
              style={{ filter: filterStyle, transform: `rotate(${rotationAngle}deg)` }}
              className="w-full h-full object-contain pointer-events-none transition-all"
            />

            {/* Foreground: Original Scan with clip-path */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ clipPath: `inset(0 ${100 - splitPosition}% 0 0)` }}
            >
              <img
                src={getScanImageSrc()}
                alt="Original Scan"
                style={{ filter: filterStyle, transform: `rotate(${rotationAngle}deg)` }}
                className="w-full h-full object-contain pointer-events-none transition-all"
              />
            </div>

            {/* Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-amber-400 shadow-[0_0_10px_#f59e0b] cursor-ew-resize flex items-center justify-center"
              style={{ left: `${splitPosition}%` }}
            >
              <div className="w-5 h-5 -ml-2.5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-bold shadow-md">
                ⇄
              </div>
            </div>

            {/* Split Drag Range Slider */}
            <input
              type="range"
              min="0"
              max="100"
              value={splitPosition}
              onChange={(e) => setSplitPosition(Number(e.target.value))}
              className="absolute bottom-2 left-4 right-4 z-20 opacity-75 hover:opacity-100 transition-opacity"
            />
          </div>
        ) : (
          /* Standard Pan & Zoom Image Canvas */
          <div
            ref={imageRef}
            className="relative transition-transform duration-75 ease-out origin-center"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel}) rotate(${rotationAngle}deg)`,
              filter: filterStyle,
            }}
          >
            <img
              src={activeImageSrc}
              alt="Historical Kaithi Manuscript Scan"
              className="max-h-[350px] w-auto object-contain rounded-lg border border-amber-500/20 shadow-xl"
            />

            {/* OCR Bounding Boxes */}
            {showBoxes && preprocessing?.bounding_boxes && (
              <div className="absolute inset-0 pointer-events-auto">
                {preprocessing.bounding_boxes.slice(0, 18).map((box, idx) => {
                  const isHovered = hoveredWordIndex === idx;
                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => onHoverBox && onHoverBox(idx)}
                      onMouseLeave={() => onHoverBox && onHoverBox(null)}
                      className={`absolute rounded-sm transition-all cursor-pointer ${
                        isHovered
                          ? 'border-2 border-amber-400 bg-amber-400/30 scale-105 z-20 shadow-[0_0_12px_#f59e0b]'
                          : 'border border-amber-400/40 bg-amber-400/10 hover:border-amber-400'
                      }`}
                      style={{
                        left: `${(box.x / (preprocessing.processed_dimensions?.[0] || 900)) * 100}%`,
                        top: `${(box.y / (preprocessing.processed_dimensions?.[1] || 550)) * 100}%`,
                        width: `${(box.w / (preprocessing.processed_dimensions?.[0] || 900)) * 100}%`,
                        height: `${(box.h / (preprocessing.processed_dimensions?.[1] || 550)) * 100}%`,
                      }}
                      title={`OCR Glyph Region #${idx + 1}`}
                    />
                  );
                })}
              </div>
            )}

            {/* Saved Region-of-Interest (ROI) Overlay */}
            {savedRoi && (
              <div
                className="absolute border-2 border-emerald-400 bg-emerald-500/20 rounded shadow-[0_0_12px_#10b981] flex items-start justify-end p-1 pointer-events-auto"
                style={{
                  left: `${savedRoi.x}px`,
                  top: `${savedRoi.y}px`,
                  width: `${savedRoi.width}px`,
                  height: `${savedRoi.height}px`,
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSavedRoi(null);
                  }}
                  className="bg-black/70 hover:bg-black p-0.5 rounded text-white"
                  title="Clear ROI Selection"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Live Dragging ROI Box */}
        {isSelectingROI && roiBox && (
          <div
            className="absolute border-2 border-dashed border-amber-400 bg-amber-400/20 pointer-events-none rounded z-30"
            style={{
              left: `${Math.min(roiBox.startX, roiBox.currentX)}px`,
              top: `${Math.min(roiBox.startY, roiBox.currentY)}px`,
              width: `${Math.abs(roiBox.currentX - roiBox.startX)}px`,
              height: `${Math.abs(roiBox.currentY - roiBox.startY)}px`,
            }}
          />
        )}

        {/* Circular Loupe (Magnifier Glass) Lens Overlay */}
        {isLoupeActive && (
          <div
            className="loupe-lens absolute w-36 h-36 -ml-18 -mt-18 pointer-events-none z-40 overflow-hidden"
            style={{
              left: `${loupePos.x}px`,
              top: `${loupePos.y}px`,
              backgroundImage: `url(${activeImageSrc})`,
              backgroundPosition: `${loupeBgPos.x}% ${loupeBgPos.y}%`,
              backgroundSize: '350%',
              filter: filterStyle,
            }}
          />
        )}

        {/* Floating Quick Canvas Control Dock */}
        <div className="absolute bottom-3 right-3 flex items-center space-x-1 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 shadow-2xl text-slate-300 z-30">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3))}
            className="p-1.5 hover:text-amber-300 hover:bg-slate-800 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.5))}
            className="p-1.5 hover:text-amber-300 hover:bg-slate-800 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Loupe Tool */}
          <button
            onClick={() => setIsLoupeActive(!isLoupeActive)}
            className={`p-1.5 rounded transition-colors ${
              isLoupeActive
                ? 'text-amber-300 bg-amber-500/20 border border-amber-500/50'
                : 'hover:text-amber-300 hover:bg-slate-800'
            }`}
            title="Toggle Calligraphic 3x Loupe Magnifier"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Region-of-Interest Selection Tool */}
          <button
            onClick={() => setIsSelectingROI(!isSelectingROI)}
            className={`p-1.5 rounded transition-colors ${
              isSelectingROI
                ? 'text-emerald-300 bg-emerald-500/20 border border-emerald-500/50 animate-pulse'
                : 'hover:text-amber-300 hover:bg-slate-800'
            }`}
            title="Click & Drag to Select Region of Interest (ROI)"
          >
            <Crop className="w-3.5 h-3.5" />
          </button>

          {/* Invert Polarity */}
          <button
            onClick={() => setIsInverted(!isInverted)}
            className={`p-1.5 rounded transition-colors ${
              isInverted
                ? 'text-amber-300 bg-slate-800'
                : 'hover:text-amber-300 hover:bg-slate-800'
            }`}
            title="Invert Ink Polarity"
          >
            <Contrast className="w-3.5 h-3.5" />
          </button>

          {/* Reset */}
          <button
            onClick={resetAllView}
            className="p-1.5 hover:text-amber-300 hover:bg-slate-800 rounded transition-colors"
            title="Reset Canvas View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Footer Info & Bounding Boxes Toggle */}
      <div className="p-3 border-t border-slate-300 dark:border-slate-800 bg-slate-200/50 dark:bg-slate-950/70 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Compass className="w-3 h-3 text-amber-500" />
          Deskew:{' '}
          <strong className="text-amber-600 dark:text-amber-400 font-mono">
            {preprocessing?.skew_angle || 0}°
          </strong>
          {rotationAngle !== 0 && (
            <span className="text-[10px] text-emerald-500 font-mono ml-1">
              ({rotationAngle > 0 ? `+${rotationAngle}` : rotationAngle}°)
            </span>
          )}
        </span>

        <span>
          Zoom:{' '}
          <strong className="text-slate-800 dark:text-slate-200 font-mono">
            {Math.round(zoomLevel * 100)}%
          </strong>
        </span>

        <button
          onClick={() => setShowBoxes(!showBoxes)}
          className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
        >
          <Eye className="w-3 h-3" />
          <span>{showBoxes ? 'Hide Glyphs' : 'Show Glyphs'}</span>
        </button>
      </div>
    </div>
  );
}
