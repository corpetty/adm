# Qualitative Evaluation Translation Module

A comprehensive system for converting human qualitative evaluations into mathematical constraints for robust project portfolio selection, implementing the constraint space visualization framework described in the research requirements.

## Overview

This module implements the **Qualitative Evaluation Translation Module** from the Robust Human–Machine Framework for Project Portfolio Selection (PPSS). It converts subjective human evaluations into linear equality and inequality constraints that define a convex polytope representing the feasible space for project value matrices.

## Key Features

- **🔄 Qualitative-to-Mathematical Translation**: Converts human evaluations into linear constraints
- **📊 Interactive Polytope Visualization**: 2D/3D visualization of constraint spaces
- **🎯 Multi-Criteria Support**: Handles multiple evaluation criteria simultaneously
- **👥 Stakeholder Integration**: Processes evaluations from multiple stakeholders
- **📈 Constraint Sensitivity Analysis**: Analyzes impact of individual constraints
- **🌐 Web-Based Dashboards**: Interactive HTML visualizations
- **📁 Data Export**: Multiple export formats (JSON, CSV, NPZ)

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Input Layer                              │
├─────────────────────────────────────────────────────────────┤
│ • Human Qualitative Evaluations                            │
│ • Project Data (costs, durations, values)                  │
│ • Stakeholder Preferences                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Translation Engine                             │
├─────────────────────────────────────────────────────────────┤
│ • QualitativeEvaluationTranslator                         │
│ • Constraint Generation (A_ineq * x ≤ b_ineq)             │
│ • Polytope Definition                                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│             Visualization Layer                            │
├─────────────────────────────────────────────────────────────┤
│ • PolytopeVisualizer                                       │
│ • 2D/3D Interactive Plots                                  │
│ • Constraint Sensitivity Analysis                          │
│ • Stakeholder Comparison                                    │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. QualitativeEvaluationTranslator
**File**: `qualitative_evaluation_translator.py`

Converts human evaluations into mathematical constraints:

```python
from qualitative_evaluation_translator import (
    QualitativeEvaluationTranslator, 
    QualitativeEvaluation, 
    EvaluationType,
    ComparisonOperator
)

# Create translator
translator = QualitativeEvaluationTranslator(
    projects=["Project A", "Project B"],
    criteria=["Strategic Value", "Technical Feasibility"]
)

# Add evaluation
evaluation = QualitativeEvaluation(
    evaluator_id="expert_1",
    evaluation_type=EvaluationType.COMPARISON,
    projects=["Project A", "Project B"],
    operator=ComparisonOperator.GREATER,
    criteria="Strategic Value"
)
translator.add_evaluation(evaluation)

# Get constraint matrices
A_ineq, b_ineq, A_eq, b_eq = translator.get_constraint_matrices()
```

**Supported Evaluation Types**:
- **COMPARISON**: "Project A > Project B"
- **RANGE**: "Project value between 0.3 and 0.7"
- **RANKING**: "A > B > C > D"
- **THRESHOLD**: "Project must have value ≥ 0.5"

### 2. PolytopeVisualizer
**File**: `polytope_visualizer.py`

Creates interactive visualizations of constraint polytopes:

```python
from polytope_visualizer import PolytopeVisualizer

# Create visualizer
visualizer = PolytopeVisualizer(translator)

# Generate 2D visualization
fig_2d = visualizer.create_2d_visualization(
    dim_x=0, dim_y=1,
    show_vertices=True,
    show_constraints=True,
    show_feasible_region=True
)

# Generate 3D visualization
fig_3d = visualizer.create_3d_visualization(
    dim_x=0, dim_y=1, dim_z=2,
    show_vertices=True,
    opacity=0.3
)

# Create interactive dashboard
dashboard = visualizer.create_dimension_selector_dashboard()
```

### 3. Project Data Integration
**File**: `logos_nimbus_status_projects.py`

Comprehensive project data for the Logos/Nimbus/Status ecosystem:

- **16 projects** across 5 ecosystems
- **Complete project attributes**: duration, cost, multiple values
- **Constraint relationships**: cooperation, precedence, exclusivity
- **12 stakeholder evaluations** from 6 different roles

### 4. Demonstration System
**File**: `polytope_visualization_demo.py`

Complete demonstration with real project data:

```python
from polytope_visualization_demo import create_logos_nimbus_status_translator

# Create translator with real project data
translator = create_logos_nimbus_status_translator()

# Generate visualizations and analysis
visualizer = PolytopeVisualizer(translator)
properties = visualizer.compute_polytope_properties()
```

## Installation & Setup

### Prerequisites
```bash
pip install numpy pandas plotly scipy
```

### Optional Dependencies
```bash
pip install pypoman  # For enhanced polytope operations
pip install dash     # For interactive web applications
```

### Quick Start
```python
# Basic usage example
from qualitative_evaluation_translator import *
from polytope_visualizer import PolytopeVisualizer

# 1. Create translator
translator = QualitativeEvaluationTranslator(
    projects=["Project A", "Project B"],
    criteria=["Strategic Value"]
)

# 2. Add evaluations
eval1 = QualitativeEvaluation(
    evaluator_id="expert_1",
    evaluation_type=EvaluationType.RANGE,
    projects=["Project A"],
    values=[0.3, 0.7],
    criteria="Strategic Value"
)
translator.add_evaluation(eval1)

# 3. Create visualizer
visualizer = PolytopeVisualizer(translator)

# 4. Generate visualization
fig = visualizer.create_2d_visualization()
fig.show()
```

## Usage Examples

### Example 1: Simple Project Comparison
```python
# Compare two projects on strategic value
comparison = QualitativeEvaluation(
    evaluator_id="ceo",
    evaluation_type=EvaluationType.COMPARISON,
    projects=["Logos Core", "Status App"],
    operator=ComparisonOperator.GREATER,
    criteria="Strategic Value"
)
```

### Example 2: Range Constraints
```python
# Set acceptable range for project value
range_constraint = QualitativeEvaluation(
    evaluator_id="expert",
    evaluation_type=EvaluationType.RANGE,
    projects=["Nimbus Client"],
    values=[0.6, 0.9],
    criteria="Technical Feasibility"
)
```

### Example 3: Multi-Project Ranking
```python
# Rank projects by preference
ranking = QualitativeEvaluation(
    evaluator_id="stakeholder",
    evaluation_type=EvaluationType.RANKING,
    projects=["Project A", "Project B", "Project C"],
    criteria="Market Impact"
)
```

## Testing

Run the comprehensive test suite:

```bash
cd dl-example
python test_polytope_visualization.py
```

Run basic functionality test:

```bash
python -c "
from polytope_visualization_demo import create_logos_nimbus_status_translator
from polytope_visualizer import PolytopeVisualizer

translator = create_logos_nimbus_status_translator()
visualizer = PolytopeVisualizer(translator)
properties = visualizer.compute_polytope_properties()
print(f'System working: {properties[\"n_constraints\"]} constraints generated')
"
```

## Demo & Visualization

### Generate Interactive Visualizations
```bash
python polytope_visualization_demo.py
```

This creates:
- `polytope_2d_*.html` - 2D constraint visualizations
- `polytope_3d_*.html` - 3D polytope visualizations  
- `polytope_dashboard.html` - Interactive dashboard
- `polytope_data.json` - Exported polytope data

### View Results
Open the generated HTML files in a web browser to explore:
- **Feasible regions** defined by constraints
- **Polytope vertices** and boundaries
- **Interactive dimension selection**
- **Constraint sensitivity analysis**

## Mathematical Foundation

The system implements the mathematical framework where:

- **x** = project value vector (n_projects × n_criteria dimensions)
- **A_ineq * x ≤ b_ineq** = inequality constraints from evaluations
- **A_eq * x = b_eq** = equality constraints from evaluations
- **Polytope P** = {x : A_ineq * x ≤ b_ineq, A_eq * x = b_eq}

### Constraint Types Generated

1. **Comparison Constraints**: v_A - v_B ≥ ε (for A > B)
2. **Range Constraints**: min ≤ v_i ≤ max
3. **Threshold Constraints**: v_i ≥ threshold
4. **Ranking Constraints**: v_1 ≥ v_2 ≥ ... ≥ v_n

## API Reference

### QualitativeEvaluationTranslator

#### Methods
- `add_evaluation(evaluation)` - Add qualitative evaluation
- `translate_evaluations()` - Convert to linear constraints
- `get_constraint_matrices()` - Get A_ineq, b_ineq, A_eq, b_eq
- `validate_constraints()` - Check system consistency
- `export_constraints(format)` - Export in various formats

### PolytopeVisualizer

#### Methods
- `compute_vertices()` - Calculate polytope vertices
- `compute_polytope_properties()` - Get polytope statistics
- `create_2d_visualization()` - Generate 2D plots
- `create_3d_visualization()` - Generate 3D plots
- `create_dimension_selector_dashboard()` - Interactive dashboard
- `export_polytope_data()` - Export polytope data

## Performance Considerations

- **Vertex computation** scales exponentially with dimensions
- **Constraint generation** is linear in number of evaluations
- **Visualization** works best with ≤ 20 dimensions for interactive use
- **Large systems** (>100 constraints) may require specialized solvers

## Limitations & Future Work

### Current Limitations
- Vertex computation limited without pypoman for high-dimensional spaces
- Visualization complexity increases with dimension count
- No automatic constraint conflict resolution

### Planned Enhancements (Phases 2-5)
- **Phase 2**: Objective trade-off sampling and analysis
- **Phase 3**: Advanced constraint sensitivity analysis
- **Phase 4**: Comparative constraint visualizations
- **Phase 5**: Preference inference and dimensionality reduction

## Contributing

The system is designed for extensibility:

1. **New Evaluation Types**: Add to `EvaluationType` enum and implement parser
2. **Visualization Modes**: Extend `PolytopeVisualizer` with new plot types
3. **Export Formats**: Add new formats to `export_polytope_data()`
4. **Constraint Solvers**: Integrate additional optimization libraries

## Research Context

This implementation supports the research described in:
- "Robust Human–Machine Framework for Project Portfolio Selection"
- Requirements document: `required-resources.md`
- Constraint space analysis roadmap: `constraint_space_analysis_roadmap.md`

## License

This module is part of the Logos/Nimbus/Status ecosystem research project.

---

**Status**: ✅ Phase 1 Complete - Interactive Polytope Visualization System Operational

For questions or support, refer to the test files and demo scripts for usage examples.
