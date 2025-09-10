# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This repository contains a portfolio management system with interactive data visualizations for strategic decision-making. It consists of:

- **toy-data/**: Sample CSV datasets representing projects, dependencies, resources, and strategic metrics
- **toy-example/**: Complete visualization implementation with D3.js interactive dashboards
- **dl-example/**: Deep learning portfolio optimization with qualitative evaluation translation

## Development Workflow

### Data Processing
```bash
# Navigate to example directory
cd toy-example

# Process raw CSV data into visualization-ready JSON format
python data_preparation.py

# Run data validation tests
python test_visualizations.py
```

### Development Server
```bash
# Start local HTTP server for development (from toy-example directory)
python -m http.server 8000

# Access visualizations at:
# http://localhost:8000/portfolio_visualizations.html
```

### Testing
```bash
# Run visualization test suite
cd toy-example
python test_visualizations.py

# Run deep learning module test suite
cd dl-example
python test_qualitative_evaluation.py
```

The visualization test suite validates:
- Data file integrity (CSV and JSON)
- Visualization file presence
- Data relationship consistency
- Decision tree structure
- Server accessibility

The deep learning test suite validates:
- Qualitative evaluation translation accuracy
- Constraint generation and validation
- Natural language parsing functionality
- Mathematical optimization integration

## Architecture

### Data Pipeline
1. **Raw Data**: CSV files in `toy-data/` directory with normalized schema
2. **ETL Process**: `data_preparation.py` loads, cleans, and transforms data
3. **Output**: JSON files in `visualization_data/` optimized for D3.js consumption

### Visualization Framework
- **HTML Container**: `portfolio_visualizations.html` with responsive layout
- **JavaScript Modules**: Separate files in `js/` directory for each visualization type
- **D3.js Framework**: Interactive SVG-based visualizations with force simulations, matrices, and dashboards

### Core Visualizations
1. **Dependency Network** (`js/dependency-graph.js`) - Force-directed graph of project relationships
2. **Resource Heatmap** (`js/resource-matrix.js`) - Matrix visualization of resource allocation
3. **Strategic Matrix** (`js/strategic-matrix.js`) - Risk vs. impact bubble chart positioning
4. **Timeline Gantt** (`js/timeline-gantt.js`) - Project schedules with dependency arrows
5. **Portfolio Dashboard** (`js/portfolio-dashboard.js`) - Multi-panel KPI overview
6. **Decision Tree** (`js/decision-tree.js`) - Interactive investment decision support tool

### Supporting Tools
7. **Export Utils** (`js/export-utils.js`) - Export visualizations as PNG/SVG images
8. **Filter Controls** (`js/filter-controls.js`) - Cross-visualization filtering and data exploration
9. **Scenario Comparison** (`js/scenario-comparison.js`) - Create and compare portfolio scenarios

## Data Schema

The system uses a normalized relational schema across CSV files:

- **projects.csv**: Core project information (IDs, budgets, timelines, status)
- **dependencies.csv**: Project interdependencies with strength and impact metrics
- **resources.csv**: Available resources (teams, budget, facilities)
- **resource_allocations.csv**: Resource assignments to projects
- **strategic_dimensions.csv**: Multi-dimensional strategic scoring
- **timeline_events.csv**: Project milestones and events
- **portfolio_metrics.csv**: Aggregated portfolio-level KPIs

## Key Technical Patterns

### Data Processing Pipeline
- Pandas for CSV loading with proper date parsing
- Foreign key joins between related datasets
- Derived metric calculation (strategic scores, utilization rates)
- JSON serialization with datetime string conversion

### D3.js Visualization Patterns
- Modular design with separate files for each chart type
- Data binding and enter/update/exit patterns
- Force simulations for network layouts
- Interactive tooltips and filtering
- Responsive SVG containers

### Decision Tree Structure
- Hierarchical JSON structure with decision and outcome nodes
- Real project data mapped to decision paths
- Color-coded recommendations based on strategic criteria
- Interactive exploration of investment decision logic

## Common Tasks

### Adding New Data
1. Update CSV files in `toy-data/` following existing schema
2. Run `python data_preparation.py` to regenerate JSON files
3. Test with `python test_visualizations.py`

### Creating New Visualizations
1. Create new JavaScript module in `js/` directory
2. Follow D3.js patterns from existing modules
3. Add container div to `portfolio_visualizations.html`
4. Update data preparation script if new data formats needed

### Modifying Existing Visualizations
- Update JavaScript files in `js/` directory
- Modify color scales, layouts, or interactions
- Test changes with local HTTP server

### Working with Supporting Tools
- **Export functionality**: Use `ExportUtils` class to add export buttons to new visualizations
- **Filtering**: Leverage `FilterControls` to add cross-visualization filtering capabilities
- **Scenario analysis**: Integrate `ScenarioComparison` for portfolio modeling and comparison features

### Deep Learning Portfolio Optimization
- **Qualitative evaluation translation**: Convert human expert evaluations into mathematical constraints
- **Natural language processing**: Parse free-form text evaluations using `NaturalLanguageParser`
- **Constraint generation**: Create linear optimization constraints from subjective assessments
- **Portfolio optimization**: Integrate with robust human-machine project selection frameworks

## Deep Learning Module Architecture

### Core Components
1. **Qualitative Evaluation Translator** (`qualitative_evaluation_translator.py`)
   - Main translation engine converting human evaluations to mathematical constraints
   - Supports comparison, ranking, range, and threshold evaluation types
   - Mathematical optimization interface for constraint matrices

2. **Input/Output Parser** (`evaluation_input_parser.py`)
   - Natural language processing for free-form evaluation text
   - Structured data import/export (CSV, JSON formats)
   - Interactive evaluation collection interface

3. **Portfolio Optimization Demo** (`portfolio_optimization_demo.py`)
   - Complete workflow demonstration using Logos/Nimbus/Status project data
   - Integration with stakeholder evaluations and budget constraints
   - Real-world portfolio selection scenarios

### Deep Learning Workflow

```bash
# Navigate to dl-example directory
cd dl-example

# Run basic demonstration
python demo.py

# Run portfolio optimization with real project data
python portfolio_optimization_demo.py

# Run comprehensive tests
python test_qualitative_evaluation.py
```

### Data Files
- **logos_nimbus_status_projects.json**: Real project portfolio data from ecosystem
- **stakeholder_evaluations.json**: Expert evaluation inputs
- **budget_constraints.json**: Financial and resource limitations
- **demo_evaluations.csv**: Example evaluation datasets