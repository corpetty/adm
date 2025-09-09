/**
 * Advanced Filter Controls for Portfolio Visualizations
 * Provides cross-visualization filtering and data exploration
 */

class FilterControls {
    constructor() {
        this.filters = {
            projectStatus: 'all',
            riskLevel: 'all',
            budgetRange: [0, 1000000],
            strategicPriority: 'all',
            completionRange: [0, 100]
        };
        
        this.originalData = {};
        this.filteredData = {};
        this.setupFilterPanel();
    }

    setupFilterPanel() {
        // Create filter panel
        const filterPanel = document.createElement('div');
        filterPanel.id = 'filter-panel';
        filterPanel.style.cssText = `
            position: fixed;
            left: 20px;
            top: 20px;
            width: 280px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            z-index: 1500;
            max-height: 80vh;
            overflow-y: auto;
        `;

        filterPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #333;">Portfolio Filters</h3>
                <button id="toggle-filters" style="background: none; border: none; font-size: 18px; cursor: pointer;">−</button>
            </div>
            <div id="filter-content">
                <div class="filter-group">
                    <label>Project Status:</label>
                    <select id="status-filter">
                        <option value="all">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Planning">Planning</option>
                        <option value="Complete">Complete</option>
                        <option value="On Hold">On Hold</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label>Strategic Priority:</label>
                    <select id="priority-filter">
                        <option value="all">All Priorities</option>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label>Risk Level:</label>
                    <select id="risk-filter">
                        <option value="all">All Risk Levels</option>
                        <option value="Low">Low (1-3)</option>
                        <option value="Medium">Medium (4-6)</option>
                        <option value="High">High (7-10)</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label>Budget Range:</label>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <input type="range" id="budget-min" min="0" max="500000" value="0" style="flex: 1;">
                        <input type="range" id="budget-max" min="0" max="500000" value="500000" style="flex: 1;">
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 12px; color: #666;">
                        <span id="budget-min-label">$0</span>
                        <span id="budget-max-label">$500K</span>
                    </div>
                </div>

                <div class="filter-group">
                    <label>Completion Range:</label>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <input type="range" id="completion-min" min="0" max="100" value="0" style="flex: 1;">
                        <input type="range" id="completion-max" min="0" max="100" value="100" style="flex: 1;">
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 12px; color: #666;">
                        <span id="completion-min-label">0%</span>
                        <span id="completion-max-label">100%</span>
                    </div>
                </div>

                <div class="filter-actions" style="margin-top: 15px; display: flex; gap: 10px;">
                    <button id="apply-filters" style="flex: 1; background: #007bff; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">Apply Filters</button>
                    <button id="reset-filters" style="flex: 1; background: #6c757d; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">Reset</button>
                </div>

                <div id="filter-summary" style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 4px; font-size: 12px;">
                    <strong>Active Filters:</strong> None
                </div>
            </div>
        `;

        // Add CSS for filter groups
        const style = document.createElement('style');
        style.textContent = `
            .filter-group {
                margin-bottom: 15px;
            }
            .filter-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #333;
                font-size: 13px;
            }
            .filter-group select {
                width: 100%;
                padding: 5px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 12px;
            }
            .filter-group input[type="range"] {
                width: 100%;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(filterPanel);
        this.setupFilterEvents();
    }

    setupFilterEvents() {
        // Toggle panel visibility
        document.getElementById('toggle-filters').addEventListener('click', () => {
            const content = document.getElementById('filter-content');
            const toggle = document.getElementById('toggle-filters');
            if (content.style.display === 'none') {
                content.style.display = 'block';
                toggle.textContent = '−';
            } else {
                content.style.display = 'none';
                toggle.textContent = '+';
            }
        });

        // Budget range sliders
        const budgetMin = document.getElementById('budget-min');
        const budgetMax = document.getElementById('budget-max');
        const budgetMinLabel = document.getElementById('budget-min-label');
        const budgetMaxLabel = document.getElementById('budget-max-label');

        budgetMin.addEventListener('input', () => {
            const value = parseInt(budgetMin.value);
            budgetMinLabel.textContent = `$${(value/1000).toFixed(0)}K`;
            if (value > parseInt(budgetMax.value)) {
                budgetMax.value = value;
                budgetMaxLabel.textContent = `$${(value/1000).toFixed(0)}K`;
            }
        });

        budgetMax.addEventListener('input', () => {
            const value = parseInt(budgetMax.value);
            budgetMaxLabel.textContent = `$${(value/1000).toFixed(0)}K`;
            if (value < parseInt(budgetMin.value)) {
                budgetMin.value = value;
                budgetMinLabel.textContent = `$${(value/1000).toFixed(0)}K`;
            }
        });

        // Completion range sliders
        const completionMin = document.getElementById('completion-min');
        const completionMax = document.getElementById('completion-max');
        const completionMinLabel = document.getElementById('completion-min-label');
        const completionMaxLabel = document.getElementById('completion-max-label');

        completionMin.addEventListener('input', () => {
            const value = parseInt(completionMin.value);
            completionMinLabel.textContent = `${value}%`;
            if (value > parseInt(completionMax.value)) {
                completionMax.value = value;
                completionMaxLabel.textContent = `${value}%`;
            }
        });

        completionMax.addEventListener('input', () => {
            const value = parseInt(completionMax.value);
            completionMaxLabel.textContent = `${value}%`;
            if (value < parseInt(completionMin.value)) {
                completionMin.value = value;
                completionMinLabel.textContent = `${value}%`;
            }
        });

        // Apply filters button
        document.getElementById('apply-filters').addEventListener('click', () => {
            this.applyFilters();
        });

        // Reset filters button
        document.getElementById('reset-filters').addEventListener('click', () => {
            this.resetFilters();
        });
    }

    applyFilters() {
        // Collect filter values
        this.filters = {
            projectStatus: document.getElementById('status-filter').value,
            strategicPriority: document.getElementById('priority-filter').value,
            riskLevel: document.getElementById('risk-filter').value,
            budgetRange: [
                parseInt(document.getElementById('budget-min').value),
                parseInt(document.getElementById('budget-max').value)
            ],
            completionRange: [
                parseInt(document.getElementById('completion-min').value),
                parseInt(document.getElementById('completion-max').value)
            ]
        };

        // Update filter summary
        this.updateFilterSummary();

        // Apply filters to all visualizations
        this.filterAllVisualizations();
    }

    resetFilters() {
        // Reset all filter controls
        document.getElementById('status-filter').value = 'all';
        document.getElementById('priority-filter').value = 'all';
        document.getElementById('risk-filter').value = 'all';
        document.getElementById('budget-min').value = 0;
        document.getElementById('budget-max').value = 500000;
        document.getElementById('completion-min').value = 0;
        document.getElementById('completion-max').value = 100;

        // Update labels
        document.getElementById('budget-min-label').textContent = '$0';
        document.getElementById('budget-max-label').textContent = '$500K';
        document.getElementById('completion-min-label').textContent = '0%';
        document.getElementById('completion-max-label').textContent = '100%';

        // Reset filters object
        this.filters = {
            projectStatus: 'all',
            strategicPriority: 'all',
            riskLevel: 'all',
            budgetRange: [0, 500000],
            completionRange: [0, 100]
        };

        this.updateFilterSummary();
        this.filterAllVisualizations();
    }

    updateFilterSummary() {
        const activeFilters = [];
        
        if (this.filters.projectStatus !== 'all') {
            activeFilters.push(`Status: ${this.filters.projectStatus}`);
        }
        if (this.filters.strategicPriority !== 'all') {
            activeFilters.push(`Priority: ${this.filters.strategicPriority}`);
        }
        if (this.filters.riskLevel !== 'all') {
            activeFilters.push(`Risk: ${this.filters.riskLevel}`);
        }
        if (this.filters.budgetRange[0] > 0 || this.filters.budgetRange[1] < 500000) {
            activeFilters.push(`Budget: $${(this.filters.budgetRange[0]/1000).toFixed(0)}K-$${(this.filters.budgetRange[1]/1000).toFixed(0)}K`);
        }
        if (this.filters.completionRange[0] > 0 || this.filters.completionRange[1] < 100) {
            activeFilters.push(`Completion: ${this.filters.completionRange[0]}%-${this.filters.completionRange[1]}%`);
        }

        const summary = document.getElementById('filter-summary');
        if (activeFilters.length === 0) {
            summary.innerHTML = '<strong>Active Filters:</strong> None';
        } else {
            summary.innerHTML = `<strong>Active Filters:</strong><br>${activeFilters.join('<br>')}`;
        }
    }

    filterAllVisualizations() {
        // Trigger filter events for each visualization
        const filterEvent = new CustomEvent('portfolioFiltersChanged', {
            detail: { filters: this.filters }
        });
        document.dispatchEvent(filterEvent);
    }

    // Helper method to check if a project passes current filters
    projectPassesFilters(project) {
        // Status filter
        if (this.filters.projectStatus !== 'all' && project.status !== this.filters.projectStatus) {
            return false;
        }

        // Priority filter
        if (this.filters.strategicPriority !== 'all' && project.strategic_priority !== this.filters.strategicPriority) {
            return false;
        }

        // Risk filter
        if (this.filters.riskLevel !== 'all') {
            const riskScore = project.risk_score || project.risk_level || 0;
            if (this.filters.riskLevel === 'Low' && riskScore > 3) return false;
            if (this.filters.riskLevel === 'Medium' && (riskScore < 4 || riskScore > 6)) return false;
            if (this.filters.riskLevel === 'High' && riskScore < 7) return false;
        }

        // Budget filter
        const budget = project.budget_allocated || project.budget || 0;
        if (budget < this.filters.budgetRange[0] || budget > this.filters.budgetRange[1]) {
            return false;
        }

        // Completion filter
        const completion = project.completion_percentage || 0;
        if (completion < this.filters.completionRange[0] || completion > this.filters.completionRange[1]) {
            return false;
        }

        return true;
    }
}

// Initialize filter controls when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.filterControls = new FilterControls();
});
