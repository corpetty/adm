# Interactive Project Portfolio Wizard

A comprehensive web-based system for creating projects and collecting stakeholder evaluations with automatic constraint generation for portfolio optimization.

## Overview

The Project Portfolio Wizard provides an intuitive, guided interface for:

1. **📋 Project Creation** - Interactive forms with validation and guidelines
2. **👥 Stakeholder Evaluation** - Natural language and structured evaluation collection
3. **📊 Constraint Analysis** - Automatic conversion to mathematical constraints
4. **💾 Export & Integration** - Multiple export formats for optimization frameworks

## Features

### 🚀 Interactive Project Creation
- **Guided Forms**: Step-by-step project creation with contextual help
- **Real-time Validation**: Immediate feedback on data quality and consistency
- **Smart Tooltips**: Inline guidance based on PROJECT_PROPERTIES_GUIDELINES.md
- **Progress Tracking**: Visual progress indicators and completion status
- **Data Persistence**: Automatic saving to browser local storage

### 👥 Stakeholder Evaluation Portal
- **Natural Language Input**: Parse evaluations like "ProjectA is better than ProjectB"
- **Structured Forms**: Guided evaluation types (comparison, range, ranking, threshold)
- **Multiple Evaluators**: Support for different stakeholder roles and perspectives
- **Confidence Scoring**: Weighted evaluations based on evaluator confidence
- **Real-time Preview**: See how evaluations translate to mathematical constraints

### 📊 Advanced Constraint Analysis
- **Automatic Translation**: Convert qualitative evaluations to linear constraints
- **Conflict Detection**: Identify contradictory or impossible constraints
- **Polytope Visualization**: Interactive 2D/3D constraint space visualization
- **Sensitivity Analysis**: Understand impact of individual constraints
- **Feasibility Checking**: Validate constraint system consistency

### 💾 Comprehensive Export Options
- **JSON Export**: Complete data backup and transfer format
- **CSV Export**: Spreadsheet-compatible tabular data
- **Python Export**: Ready-to-use scripts for optimization frameworks
- **Constraint Matrices**: Mathematical optimization format (A_ineq, b_ineq)

## Quick Start

### 1. Open the Wizard
```bash
# Open project_wizard.html in your web browser
open project_wizard.html
# or
python -m http.server 8000
# Then navigate to http://localhost:8000/project_wizard.html
```

### 2. Create Projects
1. Click **📋 Project Creation** tab
2. Fill in project details using the guided forms
3. Use tooltips (ℹ️) for help with each field
4. Click **💾 Save Project** when complete

### 3. Collect Evaluations
1. Click **👥 Stakeholder Evaluation** tab
2. Enter evaluator information
3. Choose evaluation method:
   - **Natural Language**: Type evaluations in plain English
   - **Structured Forms**: Use guided evaluation types
4. Add multiple evaluations from different stakeholders

### 4. Analyze Constraints
1. Click **📊 Constraint Analysis** tab
2. View automatically generated constraint matrices
3. Check for conflicts and validation issues
4. Export constraint data for optimization

### 5. Export Results
1. Click **💾 Export Results** tab
2. Choose export format based on your needs
3. Download files for further analysis

## Integration with Research Framework

### Backend Processing
Use the Python backend for advanced analysis:

```bash
# Export data from wizard as JSON
# Then process with backend
python wizard_backend.py visualize -i portfolio_data.json -o visualizations/

# Generate constraint matrices
python wizard_backend.py process -i portfolio_data.json

# Export for optimization frameworks
python wizard_backend.py export -i portfolio_data.json -o optimization_data.json

# Validate constraint consistency
python wizard_backend.py validate -i portfolio_data.json
```

### Polytope Visualization
Generate advanced visualizations:

```bash
# Process wizard data and create polytope visualizations
python wizard_backend.py visualize -i portfolio_data.json -o wizard_output/

# Generated files:
# - polytope_2d_*.html (2D projections)
# - polytope_3d.html (3D visualization)
# - polytope_dashboard.html (interactive dashboard)
# - polytope_data.json (raw polytope data)
# - polytope_properties.json (geometric properties)
```

## File Structure

```
├── project_wizard.html          # Main web interface
├── project_wizard.js            # JavaScript functionality
├── wizard_backend.py            # Python backend integration
├── WIZARD_README.md             # This documentation
├── PROJECT_PROPERTIES_GUIDELINES.md  # Data input guidelines
└── dl-example/                  # Research framework integration
    ├── qualitative_evaluation_translator.py
    ├── polytope_visualizer.py
    └── evaluation_input_parser.py
```

## Usage Examples

### Example 1: Simple Project Comparison
```
Evaluator: technical_lead
Input: "Logos Core is more strategic than Status App, but Status App has higher market impact"

Generated Constraints:
- Logos_Core_Strategic_Value ≥ Status_App_Strategic_Value + 0.01
- Status_App_Market_Impact ≥ Logos_Core_Market_Impact + 0.01
```

### Example 2: Range Constraints
```
Evaluator: ceo
Input: "Nimbus Client should have strategic value between 0.6 and 0.9"

Generated Constraints:
- Nimbus_Client_Strategic_Value ≥ 0.6
- Nimbus_Client_Strategic_Value ≤ 0.9
```

### Example 3: Project Ranking
```
Evaluator: product_manager
Input: Ranking by market impact: "Status App > Logos Core > Nimbus Client"

Generated Constraints:
- Status_App_Market_Impact ≥ Logos_Core_Market_Impact + 0.01
- Logos_Core_Market_Impact ≥ Nimbus_Client_Market_Impact + 0.01
```

## Data Model

### Project Properties
The wizard supports both standard and advanced project properties:

**Standard Properties:**
- Basic info (ID, name, description, status)
- Timeline (start/end dates, duration)
- Resources (budget, team size)
- Risk assessment (risk level, completion %)

**Advanced Properties (Research Model):**
- Normalized strategic dimensions (0.0-1.0 scale)
- Project relationships (cooperation, precedence, exclusivity)
- Technology stack and success metrics
- Construction cost and resource requirements

### Evaluation Types
**Comparison**: Compare two projects on a criterion
- Format: `ProjectA > ProjectB` for Strategic Value
- Constraint: `v_A - v_B ≥ ε`

**Range**: Set acceptable value range for a project
- Format: `ProjectC between 0.3 and 0.7` for Technical Complexity
- Constraints: `0.3 ≤ v_C ≤ 0.7`

**Ranking**: Order projects by preference
- Format: `ProjectA > ProjectB > ProjectC` for Market Impact
- Constraints: `v_A ≥ v_B + ε, v_B ≥ v_C + ε`

**Threshold**: Set minimum/maximum values
- Format: `ProjectD ≥ 0.5` for Innovation Level
- Constraint: `v_D ≥ 0.5`

## Technical Architecture

### Frontend (Web Interface)
- **HTML5**: Responsive design with modern CSS
- **JavaScript**: Interactive forms, validation, and data management
- **Local Storage**: Automatic data persistence
- **Progressive Enhancement**: Works without backend

### Backend Integration
- **Python Integration**: Seamless connection to research framework
- **Constraint Translation**: Automatic conversion to optimization format
- **Visualization Generation**: Advanced polytope visualizations
- **Export Formats**: Multiple output formats for different tools

### Data Flow
```
Web Interface → Local Storage → JSON Export → Python Backend → Constraint Matrices → Optimization
     ↓              ↓              ↓              ↓                    ↓
User Input → Validation → Persistence → Processing → Visualization → Analysis
```

## Validation and Quality Assurance

### Real-time Validation
- **Field Validation**: Format, length, and type checking
- **Cross-field Validation**: Date logic, budget consistency
- **JSON Validation**: Syntax checking for array fields
- **Uniqueness Checking**: Project ID collision detection

### Constraint Validation
- **Feasibility Checking**: Detect impossible constraint combinations
- **Conflict Detection**: Identify contradictory evaluations
- **Completeness Analysis**: Ensure sufficient constraints for optimization
- **Sensitivity Testing**: Analyze constraint impact on solution space

## Performance Considerations

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Support**: Responsive design for tablets and phones
- **Offline Capability**: Works without internet connection
- **Local Storage**: 5-10MB capacity for typical portfolios

### Scalability
- **Project Limit**: Recommended maximum 50-100 projects
- **Evaluation Limit**: Handles 500+ evaluations efficiently
- **Constraint Generation**: Linear scaling with evaluation count
- **Visualization**: Optimized for up to 20-dimensional spaces

## Troubleshooting

### Common Issues

**"No projects available for evaluation"**
- Solution: Create projects first in the Project Creation tab

**"Invalid JSON format" errors**
- Solution: Use proper JSON array syntax: `["item1", "item2"]`

**"Constraint conflicts detected"**
- Solution: Review evaluations for contradictory statements

**Backend integration errors**
- Solution: Ensure `dl-example/` directory is available and dependencies installed

### Data Recovery
- **Local Storage**: Data persists between browser sessions
- **Export Backup**: Regular JSON exports recommended
- **Import Function**: Restore data from JSON files

## Advanced Features

### Natural Language Processing
The wizard includes basic NLP for parsing evaluations:

```javascript
// Supported patterns:
"ProjectA is better than ProjectB"           → Comparison
"ProjectC should be between 0.3 and 0.7"    → Range  
"ProjectD must be at least 0.5"             → Threshold
"Ranking: ProjectA > ProjectB > ProjectC"    → Ranking
```

### Constraint Sensitivity Analysis
Analyze the impact of individual constraints:

```python
# Using the backend
backend = WizardBackend()
backend.load_data_from_wizard('portfolio_data.json')
backend.create_translator()

# Generate sensitivity analysis
sensitivity = backend.visualizer.analyze_constraint_sensitivity()
```

### Multi-Criteria Decision Making
Support for multiple evaluation criteria:
- Strategic Value
- Technical Complexity  
- Market Impact
- Resource Requirement
- Innovation Level

## Future Enhancements

### Planned Features
- **Real-time Collaboration**: Multiple stakeholders editing simultaneously
- **Advanced NLP**: More sophisticated natural language parsing
- **Machine Learning**: Automated evaluation suggestion
- **Integration APIs**: Direct connection to project management tools

### Research Extensions
- **Preference Learning**: Infer stakeholder preferences from evaluations
- **Uncertainty Modeling**: Handle evaluation uncertainty and confidence
- **Dynamic Constraints**: Time-varying constraint systems
- **Multi-objective Optimization**: Pareto frontier analysis

## Contributing

### Development Setup
1. Clone the repository
2. Open `project_wizard.html` in a modern browser
3. For backend features, ensure Python dependencies are installed
4. Test with sample data from `toy-data/` directory

### Code Structure
- **HTML**: Semantic markup with accessibility features
- **CSS**: Modern responsive design with CSS Grid/Flexbox
- **JavaScript**: Modular functions with clear separation of concerns
- **Python**: Object-oriented backend with comprehensive error handling

## License

This project is part of the Portfolio Management System and follows the same open-source license terms.

---

**Version**: 1.0  
**Last Updated**: December 2024  
**Compatibility**: Modern browsers, Python 3.8+
