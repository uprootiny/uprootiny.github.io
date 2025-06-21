// Simplified globe.js fallback for when three.js isn't available
// This provides basic functionality without 3D dependencies

class SimpleGlobe {
    constructor() {
        this.container = document.getElementById('globe-container');
        this.currentYear = 2025;
        this.exhibitions = [];
        this.residencies = [];
        
        if (this.container) {
            this.init();
        }
    }
    
    init() {
        // Create fallback 2D visualization
        this.container.innerHTML = `
            <div class="simple-map">
                <h3>Exhibition & Residency Timeline</h3>
                <div class="timeline-controls">
                    <input type="range" id="year-slider" min="2014" max="2025" value="2025" step="1">
                    <span id="current-year">2025</span>
                </div>
                <div class="locations-list" id="locations-list">
                    <p>Interactive 3D globe requires WebGL support. Showing simplified timeline view.</p>
                </div>
            </div>
        `;
        
        // Add basic interactivity
        const slider = document.getElementById('year-slider');
        if (slider) {
            slider.addEventListener('input', (e) => {
                this.currentYear = parseInt(e.target.value);
                document.getElementById('current-year').textContent = this.currentYear;
                this.updateDisplay();
            });
        }
        
        this.loadData();
    }
    
    loadData() {
        // Mock data for demonstration
        this.exhibitions = [
            { year: 2025, title: "Mountains of May", location: "Togatta, Japan" },
            { year: 2024, title: "Fields of Air", location: "The Hague, Netherlands" },
            { year: 2023, title: "Open Works", location: "The Hague, Netherlands" },
            // Add more exhibitions...
        ];
        
        this.updateDisplay();
    }
    
    updateDisplay() {
        const listContainer = document.getElementById('locations-list');
        if (!listContainer) return;
        
        const filteredExhibitions = this.exhibitions.filter(ex => ex.year <= this.currentYear);
        
        const html = filteredExhibitions.map(ex => 
            `<div class="location-item">
                <span class="year">${ex.year}</span>
                <span class="title">${ex.title}</span>
                <span class="location">${ex.location}</span>
            </div>`
        ).join('');
        
        listContainer.innerHTML = html || '<p>No exhibitions for selected year range.</p>';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SimpleGlobe();
});