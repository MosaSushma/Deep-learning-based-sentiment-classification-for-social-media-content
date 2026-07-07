import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report, roc_curve, auc
)
import json
import os
from datetime import datetime

class ModelEvaluator:
    """Evaluate model performance"""
    
    def __init__(self, platform='general'):
        self.platform = platform
        self.metrics = {}
        self.results = {}
        
    def evaluate_on_test_data(self, test_data=None):
        """Evaluate model on test data"""
        if test_data is None:
            test_data = self._create_sample_test_data()
        
        # Load model and predictor
        from .predict import SentimentPredictor
        predictor = SentimentPredictor(platform=self.platform)
        
        # Get predictions
        predictions = []
        true_labels = []
        
        for _, row in test_data.iterrows():
            result = predictor.predict(row['text'])
            predictions.append(result['sentiment'])
            true_labels.append(row['sentiment'])
        
        # Calculate metrics
        accuracy = accuracy_score(true_labels, predictions)
        precision = precision_score(true_labels, predictions, average='weighted', zero_division=0)
        recall = recall_score(true_labels, predictions, average='weighted', zero_division=0)
        f1 = f1_score(true_labels, predictions, average='weighted', zero_division=0)
        
        # Confusion matrix
        labels = sorted(set(true_labels + predictions))
        cm = confusion_matrix(true_labels, predictions, labels=labels)
        
        # Classification report
        report = classification_report(true_labels, predictions, output_dict=True)
        
        self.results = {
            'accuracy': float(accuracy),
            'precision': float(precision),
            'recall': float(recall),
            'f1_score': float(f1),
            'confusion_matrix': cm.tolist(),
            'labels': labels,
            'classification_report': report,
            'evaluation_date': datetime.now().isoformat(),
            'sample_size': len(test_data)
        }
        
        # Generate visualization
        self._generate_evaluation_plots(true_labels, predictions, cm, labels)
        
        return self.results
    
    def _create_sample_test_data(self):
        """Create sample test data for evaluation"""
        test_data = {
            'text': [
                # Positive
                'Excellent service, very happy!',
                'Perfect solution for my needs',
                'Highly recommended to everyone',
                'Outstanding quality and value',
                'Amazing experience overall',
                
                # Negative
                'Terrible waste of money',
                'Worst customer service ever',
                'Very disappointed with quality',
                'Complete failure, do not buy',
                'Horrible experience from start',
                
                # Neutral
                'Average product for the price',
                'It works as expected',
                'Standard features, nothing special',
                'Mediocre performance overall',
                'Basic functionality works fine'
            ],
            'sentiment': ['positive'] * 5 + ['negative'] * 5 + ['neutral'] * 5
        }
        
        return pd.DataFrame(test_data)
    
    def _generate_evaluation_plots(self, y_true, y_pred, cm, labels):
        """Generate evaluation visualization plots"""
        fig, axes = plt.subplots(2, 2, figsize=(14, 10))
        
        # 1. Confusion Matrix Heatmap
        sns.heatmap(
            cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=labels, yticklabels=labels,
            ax=axes[0, 0]
        )
        axes[0, 0].set_title(f'Confusion Matrix - {self.platform}')
        axes[0, 0].set_ylabel('True Label')
        axes[0, 0].set_xlabel('Predicted Label')
        
        # 2. Metrics Comparison
        metrics_names = ['Accuracy', 'Precision', 'Recall', 'F1-Score']
        metrics_values = [
            self.results['accuracy'],
            self.results['precision'],
            self.results['recall'],
            self.results['f1_score']
        ]
        
        colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0']
        bars = axes[0, 1].bar(metrics_names, metrics_values, color=colors)
        axes[0, 1].set_title('Performance Metrics')
        axes[0, 1].set_ylabel('Score')
        axes[0, 1].set_ylim([0, 1])
        axes[0, 1].grid(True, alpha=0.3)
        
        # Add value labels on bars
        for bar, value in zip(bars, metrics_values):
            height = bar.get_height()
            axes[0, 1].text(
                bar.get_x() + bar.get_width()/2,
                height + 0.02,
                f'{value:.3f}',
                ha='center', va='bottom'
            )
        
        # 3. Class Distribution
        class_counts = pd.Series(y_true).value_counts()
        axes[1, 0].pie(
            class_counts.values,
            labels=class_counts.index,
            autopct='%1.1f%%',
            colors=['#FF6B6B', '#4ECDC4', '#FFD166']
        )
        axes[1, 0].set_title('Class Distribution in Test Data')
        
        # 4. Error Analysis
        error_mask = [yt != yp for yt, yp in zip(y_true, y_pred)]
        error_rate = sum(error_mask) / len(y_true)
        
        categories = ['Correct', 'Incorrect']
        counts = [len(y_true) - sum(error_mask), sum(error_mask)]
        colors = ['#4CAF50', '#F44336']
        
        axes[1, 1].bar(categories, counts, color=colors)
        axes[1, 1].set_title(f'Error Rate: {error_rate:.2%}')
        axes[1, 1].set_ylabel('Count')
        
        for i, count in enumerate(counts):
            axes[1, 1].text(i, count + 0.5, str(count), ha='center')
        
        plt.tight_layout()
        
        # Save plot
        plots_dir = 'Backend/app/ml/models/evaluation_plots'
        os.makedirs(plots_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        plot_path = os.path.join(plots_dir, f'{self.platform}_evaluation_{timestamp}.png')
        plt.savefig(plot_path, dpi=300, bbox_inches='tight')
        plt.close()
        
        print(f"📊 Evaluation plots saved: {plot_path}")
    
    def save_evaluation_results(self):
        """Save evaluation results to file"""
        if not self.results:
            raise ValueError("No evaluation results to save!")
        
        results_dir = 'Backend/app/ml/models/evaluation_results'
        os.makedirs(results_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Save metrics
        metrics_path = os.path.join(results_dir, f'{self.platform}_metrics_{timestamp}.json')
        with open(metrics_path, 'w') as f:
            json.dump(self.results, f, indent=2)
        
        # Save summary report
        summary_path = os.path.join(results_dir, f'{self.platform}_summary_{timestamp}.txt')
        with open(summary_path, 'w') as f:
            f.write(f"Model Evaluation Report\n")
            f.write(f"{'='*50}\n")
            f.write(f"Platform: {self.platform}\n")
            f.write(f"Evaluation Date: {self.results['evaluation_date']}\n")
            f.write(f"Sample Size: {self.results['sample_size']}\n\n")
            f.write(f"Performance Metrics:\n")
            f.write(f"  Accuracy:  {self.results['accuracy']:.4f}\n")
            f.write(f"  Precision: {self.results['precision']:.4f}\n")
            f.write(f"  Recall:    {self.results['recall']:.4f}\n")
            f.write(f"  F1-Score:  {self.results['f1_score']:.4f}\n")
        
        print(f"📈 Evaluation results saved to: {metrics_path}")
        print(f"📋 Summary report saved to: {summary_path}")
        
        return {
            'metrics_path': metrics_path,
            'summary_path': summary_path
        }
    
    def generate_comparison_report(self, platforms=None):
        """Compare performance across platforms"""
        if platforms is None:
            platforms = ['general', 'twitter', 'facebook', 'instagram']
        
        comparison_data = []
        
        for platform in platforms:
            evaluator = ModelEvaluator(platform=platform)
            results = evaluator.evaluate_on_test_data()
            
            comparison_data.append({
                'platform': platform,
                'accuracy': results['accuracy'],
                'precision': results['precision'],
                'recall': results['recall'],
                'f1_score': results['f1_score']
            })
        
        # Create comparison visualization
        df_comparison = pd.DataFrame(comparison_data)
        
        fig, ax = plt.subplots(figsize=(10, 6))
        
        x = np.arange(len(platforms))
        width = 0.2
        
        ax.bar(x - 1.5*width, df_comparison['accuracy'], width, label='Accuracy', color='#4CAF50')
        ax.bar(x - 0.5*width, df_comparison['precision'], width, label='Precision', color='#2196F3')
        ax.bar(x + 0.5*width, df_comparison['recall'], width, label='Recall', color='#FF9800')
        ax.bar(x + 1.5*width, df_comparison['f1_score'], width, label='F1-Score', color='#9C27B0')
        
        ax.set_xlabel('Platform')
        ax.set_ylabel('Score')
        ax.set_title('Model Performance Comparison Across Platforms')
        ax.set_xticks(x)
        ax.set_xticklabels(platforms)
        ax.legend()
        ax.grid(True, alpha=0.3)
        
        plt.tight_layout()
        
        # Save comparison plot
        plots_dir = 'Backend/app/ml/models/evaluation_plots'
        os.makedirs(plots_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        plot_path = os.path.join(plots_dir, f'platform_comparison_{timestamp}.png')
        plt.savefig(plot_path, dpi=300, bbox_inches='tight')
        plt.close()
        
        print(f"📊 Platform comparison plot saved: {plot_path}")
        
        return df_comparison

if __name__ == "__main__":
    # Test evaluation
    evaluator = ModelEvaluator(platform='general')
    results = evaluator.evaluate_on_test_data()
    evaluator.save_evaluation_results()
    
    print("\n✅ Evaluation Results:")
    print(f"Accuracy: {results['accuracy']:.4f}")
    print(f"F1-Score: {results['f1_score']:.4f}")
    
    # Generate comparison
    evaluator.generate_comparison_report()
