# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This repository contains a portfolio management system with interactive data visualizations and deep learning optimization for strategic decision-making. It consists of:

- **toy-data/**: Sample CSV datasets representing projects, dependencies, resources, and strategic metrics
- **toy-example/**: Complete visualization implementation with D3.js interactive dashboards
- **dl-example/**: Deep learning portfolio optimization with qualitative evaluation translation

## Quick Start

### Interactive Visualizations (toy-example)
```bash
cd toy-example
python data_preparation.py
python -m http.server 8000
# Access at http://localhost:8000/portfolio_visualizations.html
```

### Deep Learning Optimization (dl-example)
```bash
cd dl-example
python demo.py
python portfolio_optimization_demo.py
python polytope_visualization_demo.py
```

### Testing
```bash
# Test visualization system
cd toy-example && python test_visualizations.py

# Test deep learning system
cd dl-example && python test_qualitative_evaluation.py
```

## Documentation

For detailed documentation on each component:

- **📊 Interactive Visualizations**: See [toy-example-docs.md](./toy-example-docs.md) for complete D3.js visualization documentation
- **🧠 Deep Learning Optimization**: See [dl-example-docs.md](./dl-example-docs.md) for qualitative evaluation translation and polytope visualization documentation

## Key Components

### Visualization System (toy-example/)
- **Core Visualizations**: Dependency networks, resource heatmaps, strategic matrices, timeline Gantt charts, portfolio dashboards, decision trees
- **Supporting Tools**: Export utilities, filter controls, scenario comparison
- **Data Pipeline**: CSV → Python ETL → JSON → D3.js visualizations

### Deep Learning System (dl-example/)
- **Qualitative Evaluation Translator**: Convert human evaluations to mathematical constraints
- **Polytope Visualizer**: Interactive 2D/3D constraint space visualization
- **Project Data Integration**: Real Logos/Nimbus/Status ecosystem project data
- **Mathematical Framework**: Linear constraint generation for robust portfolio selection

## Common Workflows

### Adding New Interactive Visualizations
1. Create JavaScript module in `toy-example/js/`
2. Follow existing D3.js patterns and modular design
3. Update `portfolio_visualizations.html` with container div
4. Test with local HTTP server

### Working with Deep Learning Optimization
1. Define projects and evaluation criteria
2. Add qualitative evaluations using supported types (comparison, range, ranking, threshold)
3. Generate constraint matrices for optimization
4. Create interactive polytope visualizations
5. Export results in multiple formats

### Data Updates
- **Visualization data**: Update CSV files in `toy-data/`, run `data_preparation.py`
- **Optimization data**: Modify project data in `dl-example/logos_nimbus_status_projects.py`
- **Stakeholder evaluations**: Update `stakeholder_evaluations.json`

## Architecture Overview

```
Repository Structure:
├── toy-data/           # Sample datasets (CSV)
├── toy-example/        # D3.js visualizations
│   ├── js/            # Visualization modules
│   ├── data_preparation.py
│   └── portfolio_visualizations.html
├── dl-example/         # Deep learning optimization
│   ├── qualitative_evaluation_translator.py
│   ├── polytope_visualizer.py
│   ├── portfolio_optimization_demo.py
│   └── *.json         # Project and evaluation data
└── CLAUDE.md          # This file
```

## Integration Points

The two systems can be integrated for complete portfolio management:

1. **Data Flow**: toy-data → toy-example (visualization) + dl-example (optimization)
2. **Decision Support**: Use dl-example constraints to inform toy-example decision trees
3. **Stakeholder Input**: Collect evaluations via toy-example interface, process in dl-example
4. **Results Presentation**: Optimize in dl-example, visualize results in toy-example

## Important Instructions

- **File Creation**: NEVER create files unless absolutely necessary; always prefer editing existing files
- **Documentation**: Do not proactively create documentation files unless explicitly requested
- **Code Style**: Follow existing patterns and conventions in each module
- **Security**: Never expose or log secrets; follow security best practices
- **Testing**: Always run appropriate test suites after making changes