import pandas as pd
from pathlib import Path

from sklearn.model_selection import StratifiedKFold, cross_validate
from sklearn.ensemble import RandomForestClassifier


# Project paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = BASE_DIR / "data" / "cow_milk_mastitis_dataset.csv"

# Load dataset
df = pd.read_csv(DATA_FILE)

# Same features we used for the first model
features = [
    "Milk_Temperature",
    "Milk_pH",
    "Milk_Conductivity",
    "Milk_Yield"
]

X = df[features]
y = df["class1"]

# Random Forest
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight="balanced"
)

# 5-fold cross-validation
cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)

scoring = [
    "accuracy",
    "precision",
    "recall",
    "f1",
    "roc_auc"
]

results = cross_validate(
    model,
    X,
    y,
    cv=cv,
    scoring=scoring
)

print("=" * 60)
print("MASTITIS AI - 5-FOLD CROSS VALIDATION")
print("=" * 60)

for metric in scoring:
    scores = results[f"test_{metric}"]

    print(
        f"\n{metric.upper()}: "
        f"{scores.mean():.4f} "
        f"+/- {scores.std():.4f}"
    )

print("\nIndividual fold results:")

for i in range(5):
    print(
        f"Fold {i + 1}: "
        f"Accuracy={results['test_accuracy'][i]:.4f}, "
        f"Recall={results['test_recall'][i]:.4f}, "
        f"F1={results['test_f1'][i]:.4f}, "
        f"AUC={results['test_roc_auc'][i]:.4f}"
    )

print("\n" + "=" * 60)
print("VALIDATION COMPLETE")
print("=" * 60)