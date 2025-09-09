/**
 * Portfolio Scenario Comparison Tool
 * Allows users to create and compare different portfolio scenarios
 */

class ScenarioComparison {
    constructor() {
        this.scenarios = {
            current: { name: 'Current Portfolio', projects: [], metrics: {} },
            scenario1: { name: 'Scenario 1', projects: [], metrics: {} },
            scenario2: { name: 'Scenario 2', projects: [], metrics: {} }
        };
        this.currentData = {};
        this.setupScenarioPanel();
    }

    setupScenarioPanel() {
        const scenarioPanel = document.createElement('div');
        scenarioPanel.id = 'scenario-panel';
        scenarioPanel.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 350px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            z-index: 1500;
            max-height: 70vh;
            overflow-y: auto;
        `;

        scenarioPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #333;">Scenario Planning</h3>
                <button id="toggle-scenarios" style="background: none; border: none; font-size: 18px; cursor: pointer;">−</button>
            </div>
            <div id="scenario-content">
                <div class="scenario-tabs" style="display: flex; margin-bottom: 15px;">
                    <button class="scenario-tab active" data-scenario="current">Current</button>
                    <button class="scenario-tab" data-scenario="scenario1">Scenario 1</button>
                    <button class="scenario-tab" data-scenario="scenario2">Scenario 2</button>
                </div>

                <div id="scenario-current" class="scenario-panel active">
                    <p style="font-size: 12px; color: #666; margin-bottom: 10px;">Current portfolio baseline</p>
                    <div id="current-metrics" class="metrics-display"></div>
                </div>

                <div id="scenario-scenario1" class="scenario-panel" style="display: none;">
                    <div style="margin-bottom: 10px;">
                        <label style="font-size: 12px; font-weight: bold;">Scenario Name:</label>
                        <input type="text" id="scenario1-name" value="High Growth Strategy" style="width: 100%; padding: 4px; margin-top: 2px; border: 1px solid #ddd; border-radius: 3px;">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="font-size: 12px; font-weight: bold;">Budget Adjustment:</label>
                        <select id="scenario1-budget" style="width: 100%; padding: 4px; margin-top: 2px;">
                            <option value="1.0">No Change</option>
                            <option value="1.2">+20% Budget</option>
                            <option value="1.5">+50% Budget</option>
                            <option value="0.8">-20% Budget</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="font-size: 12px; font-weight: bold;">Project Selection:</label>
                        <div id="scenario1-projects" class="project-selection"></div>
                    </div>
                    <button id="calculate-scenario1" style="width: 100%; background: #007bff; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">Calculate Scenario</button>
                    <div id="scenario1-metrics" class="metrics-display" style="margin-top: 10px;"></div>
                </div>

                <div id="scenario-scenario2" class="scenario-panel" style="display: none;">
                    <div style="margin-bottom: 10px;">
                        <label style="font-size: 12px; font-weight: bold;">Scenario Name:</label>
                        <input type="text" id="scenario2-name" value="Risk Mitigation Focus" style="width: 100%; padding: 4px; margin-top: 2px; border: 1px solid #ddd; border-radius: 3px;">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="font-size: 12px; font-weight: bold;">Budget Adjustment:</label>
                        <select id="scenario2-budget" style="width: 100%; padding: 4px; margin-top: 2px;">
                            <option value="1.0">No Change</option>
                            <option value="1.2">+20% Budget</option>
                            <option value="1.5">+50% Budget</option>
                            <option value="0.8" selected>-20% Budget</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="font-size: 12px; font-weight: bold;">Project Selection:</label>
                        <div id="scenario2-projects" class="project-selection"></div>
                    </div>
                    <button id="calculate-scenario2" style="width: 100%; background: #007bff; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">Calculate Scenario</button>
                    <div id="scenario2-metrics" class="metrics-display" style="margin-top: 10px;"></div>
                </div>

                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
                    <button id="compare-scenarios" style="width: 100%; background: #28a745; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-weight: bold;">Compare All Scenarios</button>
                </div>
            </div>
        `;

        // Add CSS for scenario tabs and panels
        const style = document.createElement('style');
        style.textContent = `
            .scenario-tab {
                flex: 1;
                padding: 8px 4px;
                border: 1px solid #ddd;
                background: #f8f9fa;
                cursor: pointer;
                font-size: 11px;
                border-radius: 0;
            }
            .scenario-tab:first-child {
                border-radius: 4px 0 0 4px;
            }
            .scenario-tab:last-child {
                border-radius: 0 4px 4px 0;
            }
            .scenario-tab.active {
                background: #007bff;
                color: white;
            }
            .scenario-panel {
                min-height: 200px;
            }
            .project-selection {
                max-height: 120px;
                overflow-y: auto;
                border: 1px solid #eee;
                padding: 5px;
                border-radius: 3px;
            }
            .project-checkbox {
                display: flex;
                align-items: center;
                margin-bottom: 5px;
                font-size: 11px;
            }
            .project-checkbox input {
                margin-right: 5px;
            }
            .metrics-display {
                background: #f8f9fa;
                padding: 8px;
                border-radius: 4px;
                font-size: 11px;
            }
            .metric-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 3px;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(scenarioPanel);
        this.setupScenarioEvents();
    }

    setupScenarioEvents() {
        // Toggle panel visibility
        document.getElementById('toggle-scenarios').addEventListener('click', () => {
            const content = document.getElementById('scenario-content');
            const toggle = document.getElementById('toggle-scenarios');
            if (content.style.display === 'none') {
                content.style.display = 'block';
                toggle.textContent = '−';
            } else {
                content.style.display = 'none';
                toggle.textContent = '+';
            }
        });

        // Scenario tab switching
        document.querySelectorAll('.scenario-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const scenario = tab.dataset.scenario;
                this.switchToScenario(scenario);
            });
        });

        // Calculate scenario buttons
        document.getElementById('calculate-scenario1').addEventListener('click', () => {
            this.calculateScenario('scenario1');
        });

        document.getElementById('calculate-scenario2').addEventListener('click', () => {
            this.calculateScenario('scenario2');
        });

        // Compare scenarios button
        document.getElementById('compare-scenarios').addEventListener('click', () => {
            this.showScenarioComparison();
        });
    }

    switchToScenario(scenarioId) {
        // Update tab appearance
        document.querySelectorAll('.scenario-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-scenario="${scenarioId}"]`).classList.add('active');

        // Show/hide panels
        document.querySelectorAll('.scenario-panel').forEach(panel => {
            panel.style.display = 'none';
        });
        document.getElementById(`scenario-${scenarioId}`).style.display = 'block';
    }

    loadCurrentPortfolio(projects) {
        this.currentData.projects = projects;
        this.scenarios.current.projects = [...projects];
        this.scenarios.current.metrics = this.calculatePortfolioMetrics(projects);
        
        this.updateCurrentMetricsDisplay();
        this.setupProjectSelections();
    }

    setupProjectSelections() {
        const projects = this.currentData.projects;
        
        ['scenario1', 'scenario2'].forEach(scenarioId => {
            const container = document.getElementById(`${scenarioId}-projects`);
            container.innerHTML = '';
            
            projects.forEach(project => {
                const checkbox = document.createElement('div');
                checkbox.className = 'project-checkbox';
                checkbox.innerHTML = `
                    <input type="checkbox" id="${scenarioId}-${project.project_id}" checked>
                    <label for="${scenarioId}-${project.project_id}">${project.name} ($${(project.budget_allocated/1000).toFixed(0)}K)</label>
                `;
                container.appendChild(checkbox);
            });
        });
    }

    calculateScenario(scenarioId) {
        const budgetMultiplier = parseFloat(document.getElementById(`${scenarioId}-budget`).value);
        const scenarioName = document.getElementById(`${scenarioId}-name`).value;
        
        // Get selected projects
        const selectedProjects = [];
        this.currentData.projects.forEach(project => {
            const checkbox = document.getElementById(`${scenarioId}-${project.project_id}`);
            if (checkbox && checkbox.checked) {
                const adjustedProject = { ...project };
                adjustedProject.budget_allocated *= budgetMultiplier;
                selectedProjects.push(adjustedProject);
            }
        });

        this.scenarios[scenarioId] = {
            name: scenarioName,
            projects: selectedProjects,
            metrics: this.calculatePortfolioMetrics(selectedProjects)
        };

        this.updateScenarioMetricsDisplay(scenarioId);
    }

    calculatePortfolioMetrics(projects) {
        if (!projects || projects.length === 0) {
            return {
                totalProjects: 0,
                totalBudget: 0,
                avgRisk: 0,
                avgStrategicScore: 0,
                avgCompletion: 0,
                projectedROI: 0
            };
        }

        const totalBudget = projects.reduce((sum, p) => sum + (p.budget_allocated || 0), 0);
        const avgRisk = projects.reduce((sum, p) => sum + (p.risk_score || 0), 0) / projects.length;
        const avgStrategicScore = projects.reduce((sum, p) => sum + (p.strategic_fit_score || 0), 0) / projects.length;
        const avgCompletion = projects.reduce((sum, p) => sum + (p.completion_percentage || 0), 0) / projects.length;
        const projectedROI = projects.reduce((sum, p) => sum + ((p.roi_projected || 0) * (p.budget_allocated || 0)), 0) / totalBudget;

        return {
            totalProjects: projects.length,
            totalBudget,
            avgRisk: avgRisk.toFixed(1),
            avgStrategicScore: avgStrategicScore.toFixed(1),
            avgCompletion: avgCompletion.toFixed(1),
            projectedROI: projectedROI.toFixed(2)
        };
    }

    updateCurrentMetricsDisplay() {
        const metrics = this.scenarios.current.metrics;
        const container = document.getElementById('current-metrics');
        
        container.innerHTML = `
            <div class="metric-item">
                <span>Total Projects:</span>
                <span>${metrics.totalProjects}</span>
            </div>
            <div class="metric-item">
                <span>Total Budget:</span>
                <span>$${(metrics.totalBudget/1000).toFixed(0)}K</span>
            </div>
            <div class="metric-item">
                <span>Avg Risk Score:</span>
                <span>${metrics.avgRisk}</span>
            </div>
            <div class="metric-item">
                <span>Avg Strategic Score:</span>
                <span>${metrics.avgStrategicScore}</span>
            </div>
            <div class="metric-item">
                <span>Avg Completion:</span>
                <span>${metrics.avgCompletion}%</span>
            </div>
            <div class="metric-item">
                <span>Projected ROI:</span>
                <span>${metrics.projectedROI}</span>
            </div>
        `;
    }

    updateScenarioMetricsDisplay(scenarioId) {
        const metrics = this.scenarios[scenarioId].metrics;
        const container = document.getElementById(`${scenarioId}-metrics`);
        
        container.innerHTML = `
            <div class="metric-item">
                <span>Total Projects:</span>
                <span>${metrics.totalProjects}</span>
            </div>
            <div class="metric-item">
                <span>Total Budget:</span>
                <span>$${(metrics.totalBudget/1000).toFixed(0)}K</span>
            </div>
            <div class="metric-item">
                <span>Avg Risk Score:</span>
                <span>${metrics.avgRisk}</span>
            </div>
            <div class="metric-item">
                <span>Avg Strategic Score:</span>
                <span>${metrics.avgStrategicScore}</span>
            </div>
            <div class="metric-item">
                <span>Avg Completion:</span>
                <span>${metrics.avgCompletion}%</span>
            </div>
            <div class="metric-item">
                <span>Projected ROI:</span>
                <span>${metrics.projectedROI}</span>
            </div>
        `;
    }

    showScenarioComparison() {
        // Create comparison modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 8px;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            width: 90%;
        `;

        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0;">Portfolio Scenario Comparison</h2>
                <button id="close-comparison" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
            </div>
            ${this.generateComparisonTable()}
            ${this.generateComparisonCharts()}
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Close modal event
        document.getElementById('close-comparison').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    generateComparisonTable() {
        const scenarios = Object.values(this.scenarios);
        
        return `
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr style="background: #f8f9fa;">
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Metric</th>
                        ${scenarios.map(s => `<th style="padding: 10px; border: 1px solid #ddd; text-align: center;">${s.name}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Total Projects</td>
                        ${scenarios.map(s => `<td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${s.metrics.totalProjects}</td>`).join('')}
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Total Budget</td>
                        ${scenarios.map(s => `<td style="padding: 8px; border: 1px solid #ddd; text-align: center;">$${(s.metrics.totalBudget/1000).toFixed(0)}K</td>`).join('')}
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Avg Risk Score</td>
                        ${scenarios.map(s => `<td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${s.metrics.avgRisk}</td>`).join('')}
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Avg Strategic Score</td>
                        ${scenarios.map(s => `<td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${s.metrics.avgStrategicScore}</td>`).join('')}
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Projected ROI</td>
                        ${scenarios.map(s => `<td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${s.metrics.projectedROI}</td>`).join('')}
                    </tr>
                </tbody>
            </table>
        `;
    }

    generateComparisonCharts() {
        return `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <h4>Budget Comparison</h4>
                    <div id="budget-comparison-chart" style="height: 200px; border: 1px solid #ddd;"></div>
                </div>
                <div>
                    <h4>Risk vs Strategic Value</h4>
                    <div id="risk-strategic-chart" style="height: 200px; border: 1px solid #ddd;"></div>
                </div>
            </div>
            <div style="margin-top: 20px;">
                <h4>Scenario Recommendations</h4>
                ${this.generateRecommendations()}
            </div>
        `;
    }

    generateRecommendations() {
        const scenarios = Object.values(this.scenarios);
        let recommendations = '<ul>';

        scenarios.forEach(scenario => {
            if (scenario.name === 'Current Portfolio') return;
            
            const current = this.scenarios.current.metrics;
            const metrics = scenario.metrics;
            
            let recommendation = `<li><strong>${scenario.name}:</strong> `;
            
            if (metrics.projectedROI > current.projectedROI) {
                recommendation += `Higher ROI potential (${metrics.projectedROI} vs ${current.projectedROI}). `;
            }
            
            if (metrics.avgRisk < current.avgRisk) {
                recommendation += `Lower risk profile (${metrics.avgRisk} vs ${current.avgRisk}). `;
            }
            
            if (metrics.avgStrategicScore > current.avgStrategicScore) {
                recommendation += `Better strategic alignment (${metrics.avgStrategicScore} vs ${current.avgStrategicScore}). `;
            }
            
            recommendation += '</li>';
            recommendations += recommendation;
        });

        recommendations += '</ul>';
        return recommendations;
    }
}

// Initialize scenario comparison when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.scenarioComparison = new ScenarioComparison();
});
