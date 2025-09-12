#!/usr/bin/env python3
"""
Project Portfolio Wizard Backend Integration
Connects the web interface with the qualitative evaluation translator
"""

import json
import sys
import os
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime

# Add the dl-example directory to the path to import the translator
sys.path.append(str(Path(__file__).parent / "dl-example"))

try:
    from qualitative_evaluation_translator import (
        QualitativeEvaluationTranslator,
        QualitativeEvaluation,
        EvaluationType,
        ComparisonOperator
    )
    from polytope_visualizer import PolytopeVisualizer
    from evaluation_input_parser import NaturalLanguageParser, EvaluationExporter
except ImportError as e:
    print(f"Warning: Could not import evaluation modules: {e}")
    print("Make sure you're running this from the correct directory with dl-example/ available")


class WizardBackend:
    """Backend integration for the Project Portfolio Wizard"""
    
    def __init__(self):
        self.projects = []
        self.evaluations = []
        self.translator = None
        self.visualizer = None
        
    def load_data_from_wizard(self, data_file: str) -> Dict[str, Any]:
        """Load project and evaluation data from wizard export"""
        try:
            with open(data_file, 'r') as f:
                data = json.load(f)
            
            self.projects = data.get('projects', [])
            self.evaluations = data.get('evaluations', [])
            
            return {
                'status': 'success',
                'projects_loaded': len(self.projects),
                'evaluations_loaded': len(self.evaluations)
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }
    
    def create_translator(self) -> Dict[str, Any]:
        """Create and configure the qualitative evaluation translator"""
        try:
            if not self.projects:
                return {
                    'status': 'error',
                    'message': 'No projects loaded. Please load project data first.'
                }
            
            # Extract project IDs and criteria
            project_ids = [p['project_id'] for p in self.projects]
            criteria = [
                'Strategic Value',
                'Technical Complexity', 
                'Market Impact',
                'Resource Requirement',
                'Innovation Level'
            ]
            
            # Create translator
            self.translator = QualitativeEvaluationTranslator(
                projects=project_ids,
                criteria=criteria
            )
            
            # Convert wizard evaluations to translator format
            converted_count = 0
            for eval_data in self.evaluations:
                try:
                    evaluation = self._convert_wizard_evaluation(eval_data)
                    if evaluation:
                        self.translator.add_evaluation(evaluation)
                        converted_count += 1
                except Exception as e:
                    print(f"Warning: Could not convert evaluation {eval_data}: {e}")
            
            return {
                'status': 'success',
                'translator_created': True,
                'evaluations_converted': converted_count,
                'total_evaluations': len(self.evaluations)
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }
    
    def _convert_wizard_evaluation(self, eval_data: Dict[str, Any]) -> Optional[QualitativeEvaluation]:
        """Convert wizard evaluation format to translator format"""
        try:
            # Map evaluation types
            type_mapping = {
                'COMPARISON': EvaluationType.COMPARISON,
                'RANGE': EvaluationType.RANGE,
                'RANKING': EvaluationType.RANKING,
                'THRESHOLD': EvaluationType.THRESHOLD
            }
            
            # Map operators
            operator_mapping = {
                'GREATER': ComparisonOperator.GREATER,
                'LESS': ComparisonOperator.LESS,
                'EQUAL': ComparisonOperator.EQUAL,
                'GREATER_EQUAL': ComparisonOperator.GREATER_EQUAL,
                'LESS_EQUAL': ComparisonOperator.LESS_EQUAL
            }
            
            evaluation_type = type_mapping.get(eval_data['evaluation_type'])
            if not evaluation_type:
                return None
            
            operator = None
            if eval_data.get('operator'):
                operator = operator_mapping.get(eval_data['operator'])
            
            return QualitativeEvaluation(
                evaluator_id=eval_data['evaluator_id'],
                evaluation_type=evaluation_type,
                projects=eval_data['projects'],
                operator=operator,
                values=eval_data.get('values'),
                confidence=eval_data.get('confidence', 1.0),
                criteria=eval_data.get('criteria'),
                timestamp=eval_data.get('timestamp')
            )
            
        except Exception as e:
            print(f"Error converting evaluation: {e}")
            return None
    
    def generate_constraint_matrices(self) -> Dict[str, Any]:
        """Generate constraint matrices from evaluations"""
        try:
            if not self.translator:
                return {
                    'status': 'error',
                    'message': 'Translator not initialized. Call create_translator() first.'
                }
            
            # Translate evaluations to constraints
            self.translator.translate_evaluations()
            
            # Get constraint matrices
            A_ineq, b_ineq, A_eq, b_eq = self.translator.get_constraint_matrices()
            
            return {
                'status': 'success',
                'A_ineq': A_ineq.tolist() if A_ineq is not None else None,
                'b_ineq': b_ineq.tolist() if b_ineq is not None else None,
                'A_eq': A_eq.tolist() if A_eq is not None else None,
                'b_eq': b_eq.tolist() if b_eq is not None else None,
                'n_inequality_constraints': len(b_ineq) if b_ineq is not None else 0,
                'n_equality_constraints': len(b_eq) if b_eq is not None else 0,
                'n_variables': A_ineq.shape[1] if A_ineq is not None else 0
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }
    
    def create_visualizations(self, output_dir: str = "wizard_output") -> Dict[str, Any]:
        """Create polytope visualizations"""
        try:
            if not self.translator:
                return {
                    'status': 'error',
                    'message': 'Translator not initialized. Call create_translator() first.'
                }
            
            # Create output directory
            os.makedirs(output_dir, exist_ok=True)
            
            # Create visualizer
            self.visualizer = PolytopeVisualizer(self.translator)
            
            generated_files = []
            
            # Generate 2D visualizations for different dimension pairs
            dimensions = len(self.translator.projects) * len(self.translator.criteria)
            if dimensions >= 2:
                for i in range(min(3, dimensions-1)):  # Generate a few 2D projections
                    for j in range(i+1, min(i+3, dimensions)):
                        try:
                            fig_2d = self.visualizer.create_2d_visualization(
                                dim_x=i, 
                                dim_y=j,
                                show_vertices=True,
                                show_constraints=True,
                                show_feasible_region=True
                            )
                            
                            filename = f"{output_dir}/polytope_2d_{i}_{j}.html"
                            fig_2d.write_html(filename)
                            generated_files.append(filename)
                            
                        except Exception as e:
                            print(f"Warning: Could not generate 2D visualization ({i},{j}): {e}")
            
            # Generate 3D visualization if possible
            if dimensions >= 3:
                try:
                    fig_3d = self.visualizer.create_3d_visualization(
                        dim_x=0, 
                        dim_y=1, 
                        dim_z=2,
                        show_vertices=True,
                        opacity=0.3
                    )
                    
                    filename = f"{output_dir}/polytope_3d.html"
                    fig_3d.write_html(filename)
                    generated_files.append(filename)
                    
                except Exception as e:
                    print(f"Warning: Could not generate 3D visualization: {e}")
            
            # Generate interactive dashboard
            try:
                dashboard = self.visualizer.create_dimension_selector_dashboard()
                filename = f"{output_dir}/polytope_dashboard.html"
                dashboard.write_html(filename)
                generated_files.append(filename)
                
            except Exception as e:
                print(f"Warning: Could not generate dashboard: {e}")
            
            # Export polytope data
            try:
                polytope_data = self.visualizer.export_polytope_data()
                filename = f"{output_dir}/polytope_data.json"
                with open(filename, 'w') as f:
                    json.dump(polytope_data, f, indent=2)
                generated_files.append(filename)
                
            except Exception as e:
                print(f"Warning: Could not export polytope data: {e}")
            
            # Compute polytope properties
            try:
                properties = self.visualizer.compute_polytope_properties()
                filename = f"{output_dir}/polytope_properties.json"
                with open(filename, 'w') as f:
                    json.dump(properties, f, indent=2)
                generated_files.append(filename)
                
            except Exception as e:
                print(f"Warning: Could not compute polytope properties: {e}")
            
            return {
                'status': 'success',
                'output_directory': output_dir,
                'generated_files': generated_files,
                'file_count': len(generated_files)
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }
    
    def validate_constraints(self) -> Dict[str, Any]:
        """Validate constraint consistency"""
        try:
            if not self.translator:
                return {
                    'status': 'error',
                    'message': 'Translator not initialized. Call create_translator() first.'
                }
            
            # Validate constraints
            validation_result = self.translator.validate_constraints()
            
            return {
                'status': 'success',
                'is_valid': validation_result['is_feasible'],
                'validation_details': validation_result
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }
    
    def export_for_optimization(self, output_file: str) -> Dict[str, Any]:
        """Export data in format suitable for optimization frameworks"""
        try:
            if not self.translator:
                return {
                    'status': 'error',
                    'message': 'Translator not initialized. Call create_translator() first.'
                }
            
            # Get constraint matrices
            A_ineq, b_ineq, A_eq, b_eq = self.translator.get_constraint_matrices()
            
            # Prepare optimization data
            optimization_data = {
                'metadata': {
                    'generated_by': 'Project Portfolio Wizard',
                    'timestamp': datetime.now().isoformat(),
                    'projects': self.translator.projects,
                    'criteria': self.translator.criteria
                },
                'constraints': {
                    'A_ineq': A_ineq.tolist() if A_ineq is not None else None,
                    'b_ineq': b_ineq.tolist() if b_ineq is not None else None,
                    'A_eq': A_eq.tolist() if A_eq is not None else None,
                    'b_eq': b_eq.tolist() if b_eq is not None else None
                },
                'bounds': {
                    'lower': [0.0] * (len(self.translator.projects) * len(self.translator.criteria)),
                    'upper': [1.0] * (len(self.translator.projects) * len(self.translator.criteria))
                },
                'variable_names': [
                    f"{project}_{criterion}"
                    for project in self.translator.projects
                    for criterion in self.translator.criteria
                ],
                'usage_examples': {
                    'scipy': {
                        'description': 'Use with scipy.optimize.linprog',
                        'code': '''
import numpy as np
from scipy.optimize import linprog

# Load constraint data
A_ineq = np.array(data['constraints']['A_ineq'])
b_ineq = np.array(data['constraints']['b_ineq'])
bounds = [(data['bounds']['lower'][i], data['bounds']['upper'][i]) 
          for i in range(len(data['bounds']['lower']))]

# Example: minimize sum of variables (you can define your own objective)
c = np.ones(A_ineq.shape[1])

# Solve
result = linprog(c, A_ub=A_ineq, b_ub=b_ineq, bounds=bounds, method='highs')
'''
                    },
                    'cvxpy': {
                        'description': 'Use with CVXPY for convex optimization',
                        'code': '''
import cvxpy as cp
import numpy as np

# Load constraint data
A_ineq = np.array(data['constraints']['A_ineq'])
b_ineq = np.array(data['constraints']['b_ineq'])

# Define variables
n_vars = A_ineq.shape[1]
x = cp.Variable(n_vars)

# Define constraints
constraints = [A_ineq @ x <= b_ineq]
constraints += [x >= 0, x <= 1]  # Bounds

# Define objective (example: minimize sum)
objective = cp.Minimize(cp.sum(x))

# Solve
problem = cp.Problem(objective, constraints)
problem.solve()
'''
                    }
                }
            }
            
            # Save to file
            with open(output_file, 'w') as f:
                json.dump(optimization_data, f, indent=2)
            
            return {
                'status': 'success',
                'output_file': output_file,
                'n_variables': len(optimization_data['variable_names']),
                'n_inequality_constraints': len(b_ineq) if b_ineq is not None else 0,
                'n_equality_constraints': len(b_eq) if b_eq is not None else 0
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }


def main():
    """Command-line interface for the wizard backend"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Project Portfolio Wizard Backend')
    parser.add_argument('command', choices=['process', 'visualize', 'export', 'validate'],
                       help='Command to execute')
    parser.add_argument('--input', '-i', required=True,
                       help='Input JSON file from wizard')
    parser.add_argument('--output', '-o', default='wizard_output',
                       help='Output directory or file')
    parser.add_argument('--verbose', '-v', action='store_true',
                       help='Verbose output')
    
    args = parser.parse_args()
    
    # Create backend instance
    backend = WizardBackend()
    
    # Load data
    if args.verbose:
        print(f"Loading data from {args.input}...")
    
    load_result = backend.load_data_from_wizard(args.input)
    if load_result['status'] != 'success':
        print(f"Error loading data: {load_result['message']}")
        return 1
    
    if args.verbose:
        print(f"Loaded {load_result['projects_loaded']} projects and {load_result['evaluations_loaded']} evaluations")
    
    # Create translator
    if args.verbose:
        print("Creating translator...")
    
    translator_result = backend.create_translator()
    if translator_result['status'] != 'success':
        print(f"Error creating translator: {translator_result['message']}")
        return 1
    
    if args.verbose:
        print(f"Converted {translator_result['evaluations_converted']}/{translator_result['total_evaluations']} evaluations")
    
    # Execute command
    if args.command == 'process':
        if args.verbose:
            print("Generating constraint matrices...")
        
        result = backend.generate_constraint_matrices()
        if result['status'] == 'success':
            print(f"Generated {result['n_inequality_constraints']} inequality constraints")
            print(f"Generated {result['n_equality_constraints']} equality constraints")
            print(f"Problem has {result['n_variables']} variables")
        else:
            print(f"Error: {result['message']}")
            return 1
    
    elif args.command == 'visualize':
        if args.verbose:
            print(f"Creating visualizations in {args.output}...")
        
        result = backend.create_visualizations(args.output)
        if result['status'] == 'success':
            print(f"Generated {result['file_count']} visualization files in {result['output_directory']}")
            for file in result['generated_files']:
                print(f"  - {file}")
        else:
            print(f"Error: {result['message']}")
            return 1
    
    elif args.command == 'export':
        if args.verbose:
            print(f"Exporting optimization data to {args.output}...")
        
        result = backend.export_for_optimization(args.output)
        if result['status'] == 'success':
            print(f"Exported optimization data to {result['output_file']}")
            print(f"Problem size: {result['n_variables']} variables, {result['n_inequality_constraints']} constraints")
        else:
            print(f"Error: {result['message']}")
            return 1
    
    elif args.command == 'validate':
        if args.verbose:
            print("Validating constraints...")
        
        result = backend.validate_constraints()
        if result['status'] == 'success':
            if result['is_valid']:
                print("✅ Constraints are valid and feasible")
            else:
                print("❌ Constraints are invalid or infeasible")
                print("Validation details:", result['validation_details'])
        else:
            print(f"Error: {result['message']}")
            return 1
    
    return 0


if __name__ == '__main__':
    sys.exit(main())
