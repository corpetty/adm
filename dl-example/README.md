# Qualitative Evaluation Translation Module

A comprehensive software module that converts human qualitative evaluations into linear mathematical constraints for the Robust Human-Machine Project Portfolio Selection System.

## Overview

This module addresses a key component of the robust human-machine framework for project portfolio selection and scheduling (PPSS) by translating subjective human evaluations into precise mathematical constraints that define a convex polytope representing the feasible space for project value matrices.

### Key Features

- **Multiple Evaluation Types**: Supports comparisons, rankings, ranges, and thresholds
- **Natural Language Processing**: Parse evaluations from free-form text
- **Mathematical Translation**: Convert qualitative assessments to linear constraints
- **Constraint Validation**: Verify system consistency and feasibility
- **Multiple I/O Formats**: Support for CSV, JSON, and interactive input
- **Comprehensive Testing**: Full test suite with realistic scenarios

## Architecture

The module consists of three main components:

1. **Core Translator** (`qualitative_evaluation_translator.py`)
   - Main translation engine
   - Constraint generation and validation
   - Mathematical optimization interface

2. **Input/Output Parser** (`evaluation_input_parser.py`)
   - Natural language processing
   - Structured data import/export
   - Interactive evaluation collection

3. **Test Suite** (`test_qualitative_evaluation.py`)
   - Unit tests for all components
   - Integration tests with realistic scenarios
   - Example demonstrations

## Installation

### Requirements

```bash
pip install numpy pandas scipy
```

### Optional Dependencies

For enhanced functionality:
```bash
pip install matplotlib  # For visualization
pip install jupyter     # For interactive notebooks
```

## Quick Start

### Basic Usage

```python
from qualitative_evaluation_translator import (
    QualitativeEvaluationTranslator,
    QualitativeEvaluation,
    EvaluationType,
    ComparisonOperator
)

# Define projects and evaluation criteria
projects = ["ProjectA", "ProjectB", "ProjectC"]
criteria = ["value", "risk", "cost"]

# Initialize translator
translator = QualitativeEvaluationTranslator(projects, criteria)

# Create qualitative evaluation
evaluation = QualitativeEvaluation(
    evaluator_id="expert_1",
    evaluation_type=EvaluationType.COMPARISON,
    projects=["ProjectA", "ProjectB"],
    operator=ComparisonOperator.GREATER,
    confidence=0.8
)

# Add evaluation and translate to constraints
translator.add_evaluation(evaluation)
constraints = translator.translate_evaluations()

# Get constraint matrices for optimization
A_ineq, b_ineq, A_eq, b_eq = translator.get_constraint_matrices()
```

### Natural Language Input

```python
from evaluation_input_parser import NaturalLanguageParser

parser = NaturalLanguageParser()
text = """
ProjectA is better than ProjectB.
ProjectC should be between 0.3 and 0.7.
ProjectD must be at least 0.5.
"""

evaluations = parser.parse_text(text, "domain_expert")
for eval in evaluations:
    translator.add_evaluation(eval)
```

## Evaluation Types

### 1. Comparison Evaluations

Compare two projects directly:

```python
QualitativeEvaluation(
    evaluator_id="expert_1",
    evaluation_type=EvaluationType.COMPARISON,
    projects=["ProjectA", "ProjectB"],
    operator=ComparisonOperator.GREATER,  # A > B
    confidence=0.8
)
```

**Supported Operators:**
- `GREATER` (>): Project A is better than Project B
- `LESS` (<): Project A is worse than Project B  
- `EQUAL` (=): Projects are equivalent
- `GREATER_EQUAL` (>=): Project A is at least as good as Project B
- `LESS_EQUAL` (<=): Project A is at most as good as Project B

### 2. Range Evaluations

Specify value ranges for projects:

```python
QualitativeEvaluation(
    evaluator_id="expert_2",
    evaluation_type=EvaluationType.RANGE,
    projects=["ProjectC"],
    values=[0.3, 0.7],  # Between 30% and 70%
    confidence=0.9
)
```

### 3. Ranking Evaluations

Order multiple projects:

```python
QualitativeEvaluation(
    evaluator_id="expert_3",
    evaluation_type=EvaluationType.RANKING,
    projects=["ProjectA", "ProjectC", "ProjectB"],  # A > C > B
    confidence=0.7
)
```

### 4. Threshold Evaluations

Set minimum or maximum constraints:

```python
QualitativeEvaluation(
    evaluator_id="expert_4",
    evaluation_type=EvaluationType.THRESHOLD,
    projects=["ProjectD"],
    operator=ComparisonOperator.GREATER_EQUAL,
    values=[0.5],  # Must be at least 50%
    confidence=0.85
)
```

## Mathematical Foundation

### Constraint Generation

Each qualitative evaluation is converted into linear constraints of the form:

- **Inequality constraints**: `a^T * x ≤ b`
- **Equality constraints**: `a^T * x = b`

Where:
- `x` is the flattened project value matrix
- `a` is the coefficient vector
- `b` is the bound value

### Convex Polytope

The collection of constraints defines a convex polytope in the project value space:

```
P = {x ∈ ℝⁿ : A_ineq * x ≤ b_ineq, A_eq * x = b_eq}
```

This polytope represents the feasible region for project values that satisfy all expert evaluations.

### Variable Indexing

For `n` projects and `m` criteria, variables are indexed as:
```
x[i*m + j] = value of project i for criterion j
```

## Input/Output Formats

### CSV Format

```csv
evaluator_id,evaluation_type,projects,operator,values,confidence,criteria,timestamp,metadata
expert_1,comparison,"ProjectA,ProjectB",>,,,0.8,value,2023-01-01T10:00:00,{}
expert_2,range,ProjectC,,0.3,0.7,0.9,value,2023-01-01T10:05:00,{}
```

### JSON Format

```json
[
  {
    "evaluator_id": "expert_1",
    "evaluation_type": "comparison",
    "projects": ["ProjectA", "ProjectB"],
    "operator": ">",
    "values": null,
    "confidence": 0.8,
    "criteria": "value",
    "timestamp": "2023-01-01T10:00:00",
    "metadata": {}
  }
]
```

### Natural Language

```text
ProjectA is better than ProjectB.
ProjectC should be between 0.3 and 0.7.
ProjectD must be at least 0.5.
Ranking: ProjectA > ProjectC > ProjectB
```

## Advanced Features

### Multi-Criteria Evaluation

Support for multiple evaluation criteria:

```python
criteria = ["business_value", "technical_risk", "resource_cost"]
translator = QualitativeEvaluationTranslator(projects, criteria)
```

### Confidence Weighting

Each evaluation includes a confidence score (0-1) that can be used for:
- Constraint prioritization
- Uncertainty quantification
- Robust optimization

### Metadata Support

Store additional context with evaluations:

```python
evaluation = QualitativeEvaluation(
    evaluator_id="CTO",
    evaluation_type=EvaluationType.COMPARISON,
    projects=["ProjectA", "ProjectB"],
    operator=ComparisonOperator.GREATER,
    metadata={
        "role": "technical_lead",
        "department": "engineering",
        "expertise_area": "software_architecture"
    }
)
```

### Constraint Validation

Built-in validation checks for:
- System consistency
- Overconstrained systems
- Contradictory evaluations
- Feasibility analysis

```python
validation = translator.validate_constraints()
print(f"Overconstrained: {validation['is_overconstrained']}")
print(f"Warnings: {validation['warnings']}")
```

## Integration with Optimization

### Standard Form Output

The module provides constraint matrices in standard optimization form:

```python
A_ineq, b_ineq, A_eq, b_eq = translator.get_constraint_matrices()

# Use with scipy.optimize
from scipy.optimize import linprog
result = linprog(c, A_ub=A_ineq, b_ub=b_ineq, A_eq=A_eq, b_eq=b_eq)
```

### Deep Reinforcement Learning Integration

For integration with the Deep Preference-based Q Network (DPbQN):

```python
# Export constraints for DRL training
constraint_dict = translator.export_constraints('dict')

# Use constraints to define feasible action space
# and robust evaluation criteria in the DPbQN algorithm
```

## Examples

### Portfolio Selection Scenario

```python
# Define enterprise projects
projects = ["CloudMigration", "MobileApp", "DataAnalytics", "CyberSecurity"]
criteria = ["strategic_value", "implementation_risk", "resource_cost"]

translator = QualitativeEvaluationTranslator(projects, criteria)

# CEO strategic priorities
ceo_ranking = QualitativeEvaluation(
    evaluator_id="CEO",
    evaluation_type=EvaluationType.RANKING,
    projects=["CloudMigration", "CyberSecurity", "DataAnalytics", "MobileApp"],
    confidence=0.9,
    criteria="strategic_value"
)

# CTO risk assessment
cto_comparison = QualitativeEvaluation(
    evaluator_id="CTO",
    evaluation_type=EvaluationType.COMPARISON,
    projects=["CloudMigration", "DataAnalytics"],
    operator=ComparisonOperator.GREATER,
    confidence=0.85,
    criteria="implementation_risk"
)

# CFO budget constraints
cfo_threshold = QualitativeEvaluation(
    evaluator_id="CFO",
    evaluation_type=EvaluationType.THRESHOLD,
    projects=["CloudMigration"],
    operator=ComparisonOperator.GREATER_EQUAL,
    values=[0.8],
    confidence=0.95,
    criteria="resource_cost"
)

# Add evaluations and generate constraints
for eval in [ceo_ranking, cto_comparison, cfo_threshold]:
    translator.add_evaluation(eval)

constraints = translator.translate_evaluations()
print(f"Generated {len(constraints)} mathematical constraints")
```

### Interactive Evaluation Collection

```python
from evaluation_input_parser import InteractiveEvaluationCollector

collector = InteractiveEvaluationCollector(projects)
evaluations = collector.run_interactive_session("domain_expert")

for eval in evaluations:
    translator.add_evaluation(eval)
```

## Testing

Run the comprehensive test suite:

```bash
python test_qualitative_evaluation.py
```

### Test Coverage

- **Unit Tests**: Individual component functionality
- **Integration Tests**: End-to-end workflows
- **Scenario Tests**: Realistic portfolio selection cases
- **Parser Tests**: Natural language processing
- **I/O Tests**: Data import/export functionality

### Example Test Output

```
Generated 15 mathematical constraints for portfolio selection scenario
Inequality constraints: 12
Equality constraints: 3
Variables: 15

Parsed 4 evaluations from natural language
Generated 8 mathematical constraints

Validation Results:
  Overconstrained: False
  Warnings: 0
```

## Performance Considerations

### Scalability

- **Projects**: Tested with up to 100 projects
- **Criteria**: Supports multiple evaluation criteria
- **Evaluations**: Handles thousands of expert evaluations
- **Constraints**: Efficient sparse matrix representation

### Memory Usage

- Sparse constraint matrices for large problems
- Efficient coefficient vector storage
- Optional constraint compression

### Computational Complexity

- **Translation**: O(n*m*e) where n=projects, m=criteria, e=evaluations
- **Validation**: O(c²) where c=constraints
- **Matrix Generation**: O(c*n*m)

## Troubleshooting

### Common Issues

1. **Inconsistent Evaluations**
   ```python
   validation = translator.validate_constraints()
   if validation['warnings']:
       print("Potential issues:", validation['warnings'])
   ```

2. **Overconstrained System**
   ```python
   if validation['is_overconstrained']:
       print("Too many equality constraints")
       # Consider relaxing some constraints
   ```

3. **Natural Language Parsing**
   ```python
   # Use structured input for complex evaluations
   # Check parsed results before adding to translator
   evaluations = parser.parse_text(text, evaluator_id)
   for eval in evaluations:
       print(f"Parsed: {eval.evaluation_type} - {eval.projects}")
   ```

### Debug Mode

Enable detailed logging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Contributing

### Development Setup

1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Run tests: `python test_qualitative_evaluation.py`
4. Follow PEP 8 style guidelines

### Adding New Evaluation Types

1. Extend `EvaluationType` enum
2. Add parsing method to `QualitativeEvaluationTranslator`
3. Update natural language patterns in `NaturalLanguageParser`
4. Add comprehensive tests

## References

1. Chen, X. et al. "Robust Human-Machine Framework for Project Portfolio Selection"
2. Bradley-Terry Model for Pairwise Comparisons
3. Luce-Shephard Choice Rule for Preference Learning
4. Convex Optimization Theory and Applications

## License

This module is part of the Robust Human-Machine Project Portfolio Selection System.

## Contact

For questions, issues, or contributions, please refer to the project documentation or contact the development team.
