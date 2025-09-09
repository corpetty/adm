/**
 * Export Utilities for Portfolio Visualizations
 * Provides functionality to export visualizations as PNG/SVG images
 */

class ExportUtils {
    constructor() {
        this.setupExportButtons();
    }

    setupExportButtons() {
        // Add export buttons to each visualization section
        const sections = [
            'dependency-network',
            'resource-matrix', 
            'strategic-matrix',
            'timeline-gantt',
            'portfolio-dashboard',
            'decision-tree'
        ];

        sections.forEach(sectionId => {
            this.addExportButton(sectionId);
        });
    }

    addExportButton(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const exportBtn = document.createElement('button');
        exportBtn.className = 'export-btn';
        exportBtn.innerHTML = '📥 Export PNG';
        exportBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: #007bff;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            z-index: 1000;
        `;

        exportBtn.addEventListener('click', () => {
            this.exportVisualization(sectionId);
        });

        // Make section relative positioned for absolute button
        section.style.position = 'relative';
        section.appendChild(exportBtn);
    }

    exportVisualization(sectionId) {
        const section = document.getElementById(sectionId);
        const svg = section.querySelector('svg');
        
        if (!svg) {
            alert('No visualization found to export');
            return;
        }

        // Clone SVG to avoid modifying original
        const svgClone = svg.cloneNode(true);
        
        // Set explicit dimensions
        const rect = svg.getBoundingClientRect();
        svgClone.setAttribute('width', rect.width);
        svgClone.setAttribute('height', rect.height);
        
        // Add white background
        const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        background.setAttribute('width', '100%');
        background.setAttribute('height', '100%');
        background.setAttribute('fill', 'white');
        svgClone.insertBefore(background, svgClone.firstChild);

        // Convert to PNG
        this.svgToPng(svgClone, `${sectionId}-export.png`);
    }

    svgToPng(svgElement, filename) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        // Set canvas size
        canvas.width = parseInt(svgElement.getAttribute('width'));
        canvas.height = parseInt(svgElement.getAttribute('height'));

        img.onload = function() {
            ctx.drawImage(img, 0, 0);
            
            // Download as PNG
            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
        };

        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(svgBlob);
        img.src = url;
    }

    // Export all visualizations as a ZIP file
    exportAll() {
        const sections = [
            'dependency-network',
            'resource-matrix', 
            'strategic-matrix',
            'timeline-gantt',
            'portfolio-dashboard',
            'decision-tree'
        ];

        sections.forEach((sectionId, index) => {
            setTimeout(() => {
                this.exportVisualization(sectionId);
            }, index * 1000); // Stagger exports to avoid browser issues
        });
    }
}

// Global export functionality
window.exportUtils = new ExportUtils();

// Add global export all button
document.addEventListener('DOMContentLoaded', function() {
    const exportAllBtn = document.createElement('button');
    exportAllBtn.innerHTML = '📥 Export All Visualizations';
    exportAllBtn.className = 'export-all-btn';
    exportAllBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        z-index: 2000;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;

    exportAllBtn.addEventListener('click', () => {
        window.exportUtils.exportAll();
    });

    document.body.appendChild(exportAllBtn);
});
