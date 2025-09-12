# Portfolio Management System

This repository contains tools and examples for strategic portfolio management, focusing on project interdependencies, resource allocation, and strategic decision-making.

## Overview

The portfolio management system provides data models, visualization tools, and analytical frameworks to help organizations make informed decisions about their project portfolios. It addresses key challenges in portfolio management including:

- **Project Interdependencies** - Understanding how projects depend on and influence each other
- **Resource Optimization** - Allocating limited resources across competing priorities
- **Strategic Alignment** - Ensuring projects support organizational objectives
- **Risk Management** - Identifying and mitigating portfolio-level risks

## Repository Structure

```
├── README.md                 # This file - high-level overview
├── PROJECT_PROPERTIES_GUIDELINES.md # Data input guidelines and best practices
├── project_wizard.html      # Interactive project creation wizard
├── project_wizard.js        # Wizard JavaScript functionality
├── wizard_backend.py        # Python backend integration
├── WIZARD_README.md          # Wizard documentation and usage guide
├── dl-example/               # Deep Learning Portfolio Selection Framework
│   ├── qualitative_evaluation_translator.py # Core translation module
│   ├── evaluation_input_parser.py # Natural language processing
│   ├── logos_nimbus_status_projects.py # Mocked project data
│   ├── portfolio_optimization_demo.py # Complete mock demonstration
│   ├── test_qualitative_evaluation.py # Comprehensive test suite
│   └── README.md             # Detailed implementation guide
├── toy-data/                 # Sample dataset for demonstrations
│   ├── projects.csv          # Core project information
│   ├── dependencies.csv      # Project interdependencies
│   ├── resources.csv         # Available resources
│   └── [additional data files]
└── toy-example/              # Complete visualization example
    ├── README.md             # Detailed project documentation
    ├── data_preparation.py   # Data processing pipeline
    ├── portfolio_visualizations.html # Interactive dashboard
    └── [implementation files]
```

## Key Components

### 1. Data Model (`toy-data/`)
NOTE: this data model doesn't coincide with data models of `dl-example`

A comprehensive data schema designed for portfolio analysis:

- **Normalized Structure** - Separate tables for projects, resources, dependencies
- **Temporal Data** - Time series tracking of project progress and metrics
- **Strategic Dimensions** - Multi-faceted scoring across business objectives
- **Cross-Platform Format** - CSV files compatible with Excel, Tableau, Python, R

### 2. Deep Learning Portfolio Selection Framework (`dl-example/`)

(WIP) A robust human-machine framework for project portfolio selection that converts qualitative evaluations into mathematical optimization constraints:

- **Qualitative Evaluation Translation** - Converts human assessments to linear constraints
- **Natural Language Processing** - Processes stakeholder evaluations in natural language
- **Mathematical Optimization** - Generates constraint matrices for optimization frameworks
- **Mocked Project Data** - Includes comprehensive Logos/Nimbus/Status ecosystem projects
- **Comprehensive Testing** - Full test suite with realistic scenarios

### 3. Interactive Project Wizard (`project_wizard.html`)

A comprehensive web-based interface for guided project creation and stakeholder evaluation:

- **Guided Project Creation** - Step-by-step forms with real-time validation and contextual help
- **Stakeholder Evaluation Portal** - Natural language and structured evaluation collection
- **Automatic Constraint Generation** - Convert qualitative assessments to mathematical constraints
- **Advanced Export Options** - JSON, CSV, and Python formats for optimization frameworks
- **Backend Integration** - Seamless connection to the research framework via `wizard_backend.py`

### 4. Visualization Framework (`toy-example/`)

Interactive web-based visualizations built with D3.js:

- **Dependency Network** - Force-directed graph showing project relationships
- **Resource Heatmap** - Matrix visualization of resource allocation
- **Strategic Matrix** - Risk vs. reward positioning of projects
- **Modular Architecture** - Extensible framework for additional visualizations

## Getting Started

### Interactive Project Wizard (Recommended)

The easiest way to get started is with the interactive web-based wizard:

```bash
# Start a local web server
python -m http.server 8000

# Open browser to http://localhost:8000/project_wizard.html
```

**Features:**
- 📋 **Guided Project Creation** - Step-by-step forms with validation
- 👥 **Stakeholder Evaluation** - Natural language and structured input
- 📊 **Constraint Analysis** - Automatic mathematical constraint generation
- 💾 **Export Options** - JSON, CSV, and Python formats

See `WIZARD_README.md` for detailed usage instructions.

### Quick Demo

To see the visualizations in action:

```bash
# Navigate to the example project
cd toy-example

# Process the sample data
python data_preparation.py

# Start local web server
python -m http.server 8000

# Open browser to http://localhost:8000/portfolio_visualizations.html
```

### Deep Learning Portfolio Selection

To use the qualitative evaluation translation framework:

```bash
# Navigate to the deep learning example
cd dl-example

# Run the complete demonstration
python portfolio_optimization_demo.py

# Test the core functionality
python test_qualitative_evaluation.py

# Try the interactive evaluation parser
python evaluation_input_parser.py
```

### Using Your Own Data

1. **Prepare Data** - Format your portfolio data using the schema in `toy-data/`
2. **Process Data** - Adapt `toy-example/data_preparation.py` for your data sources
3. **Customize Visualizations** - Modify the D3.js code to match your requirements
4. **Deploy** - Host the visualizations on your preferred web platform

## Use Cases

### Human-Machine Portfolio Selection

- **Qualitative Assessment Integration** - Convert stakeholder opinions into mathematical constraints
- **Multi-Criteria Decision Making** - Balance technical feasibility, strategic value, and resource constraints
- **Stakeholder Consensus Building** - Systematically incorporate diverse expert perspectives
- **Optimization-Ready Constraints** - Generate linear programming inputs from human evaluations

### Strategic Planning

- **Portfolio Optimization** - Identify highest-value project combinations
- **Resource Planning** - Forecast resource needs and identify bottlenecks
- **Risk Assessment** - Understand cascade effects of project failures
- **Timeline Analysis** - Optimize project sequencing and dependencies

### Operational Management

- **Resource Allocation** - Balance workload across teams and departments
- **Progress Monitoring** - Track portfolio health and milestone adherence
- **Conflict Resolution** - Identify and resolve resource conflicts
- **Performance Analysis** - Compare actual vs. planned outcomes

### Executive Reporting

- **Dashboard Views** - High-level portfolio status and trends
- **Strategic Alignment** - Measure progress toward organizational goals
- **Investment Analysis** - ROI and strategic value assessment
- **Risk Reporting** - Portfolio-level risk exposure and mitigation status

## Technical Architecture

### Data Processing

- **ETL Pipeline** - Automated data loading, cleaning, and transformation
- **Data Validation** - Integrity checks and relationship validation
- **Metric Calculation** - Derived KPIs and strategic scores
- **Export Optimization** - Format conversion for visualization tools

### Visualization Engine

- **D3.js Framework** - Modern web-based interactive visualizations
- **Responsive Design** - Works across desktop and mobile devices
- **Real-time Updates** - Dynamic filtering and data exploration
- **Export Capabilities** - Save visualizations and data extracts

### Integration Points

- **Data Sources** - CSV files, databases, APIs, project management tools
- **Analytics Tools** - Python, R, Jupyter notebooks for advanced analysis
- **Reporting Systems** - Integration with BI tools and executive dashboards
- **Project Management** - Sync with tools like Jira, Asana, Microsoft Project

## Advanced Features

### Network Analysis

- **Centrality Measures** - Identify critical projects and dependencies
- **Community Detection** - Discover natural project clusters
- **Path Analysis** - Find critical paths and bottlenecks
- **Cascade Modeling** - Simulate impact of project changes

### Optimization Algorithms

- **Resource Allocation** - Linear programming for optimal resource distribution
- **Project Selection** - Portfolio optimization under constraints
- **Timeline Optimization** - Critical path method and resource leveling
- **Scenario Planning** - What-if analysis and sensitivity testing

### Machine Learning

- **Predictive Analytics** - Forecast project success and timeline risks
- **Anomaly Detection** - Identify unusual patterns in project data
- **Recommendation Systems** - Suggest optimal project combinations
- **Natural Language Processing** - Extract insights from project descriptions

## Contributing

We welcome contributions to improve the portfolio management system:

### Areas for Enhancement

- **Additional Visualizations** - New chart types and analytical views
- **Data Connectors** - Integration with popular project management tools
- **Advanced Analytics** - Machine learning and optimization algorithms
- **Mobile Support** - Touch-optimized interfaces for tablets and phones

### Development Guidelines

1. **Code Quality** - Follow established patterns and include documentation
2. **Testing** - Validate changes with sample data and edge cases
3. **Performance** - Ensure visualizations work with realistic data sizes
4. **Accessibility** - Support screen readers and keyboard navigation

## Support and Documentation

- **Project Properties Guidelines** - See `PROJECT_PROPERTIES_GUIDELINES.md` for comprehensive data input recommendations and best practices
- **Deep Learning Framework** - See `dl-example/README.md` for qualitative evaluation translation guide
- **Detailed Documentation** - See `toy-example/README.md` for implementation details
- **Data Schema** - Reference `toy-example/core-data-flat.md` for data formats
- **Visualization Patterns** - Review `toy-example/visualization-options.md` for design guidance
- **Sample Data** - Use `toy-data/` files as templates for your own data

## License

This project is provided as an open-source educational resource for portfolio management and data visualization techniques.
