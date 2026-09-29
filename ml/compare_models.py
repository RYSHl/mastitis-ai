import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score
)

# ============================================================
# MASTITIS AI - MODEL COMPARISON
# ============================================================

print("=" * 70)
print("MASTITIS AI - MODEL COMPARISON")
print("=" * 70)

# ------------------------------------------------------------
# LOAD DATA
# ------------------------------------------------------------

df = pd.read_csv("data/cow_milk_mastitis_dataset.csv")

print("\nDataset:")
print("Rows:", len(df))
print("Columns:", len(df.columns))

# ------------------------------------------------------------
# TWO FEATURE SETS
# ------------------------------------------------------------

sensor_features = [
    "Milk_Temperature",
    "Milk_pH",
    "Milk_Conductivity",
    "Milk_Yield"
]

full_features = [
    "Milk_Temperature",
    "Milk_pH",
    "Milk_Conductivity",
    "Milk_Yield",
    "Somatic_Cell_Count",
    "Clotting"
]

target = "class1"

# ------------------------------------------------------------
# MODELS
# ------------------------------------------------------------

models = {

    "Random Forest": RandomForestClassifier(
        n_estimators=300,
        random_state=42
    ),

    "Logistic Regression": Pipeline([
        ("scaler", StandardScaler()),
        ("model", LogisticRegression(
            max_iter=2000,
            random_state=42
        ))
    ]),

    "SVM": Pipeline([
        ("scaler", StandardScaler()),
        ("model", SVC(
            probability=True,
            random_state=42
        ))
    ]),

    "Gradient Boosting": GradientBoostingClassifier(
        random_state=42
    ),

    "ANN": Pipeline([
        ("scaler", StandardScaler()),
        ("model", MLPClassifier(
            hidden_layer_sizes=(32, 16),
            max_iter=2000,
            random_state=42
        ))
    ])
}

# ------------------------------------------------------------
# FUNCTION
# ------------------------------------------------------------

def evaluate_models(features, feature_set_name):

    print("\n")
    print("=" * 70)
    print(feature_set_name)
    print("=" * 70)

    X = df[features]
    y = df[target]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        stratify=y,
        random_state=42
    )

    results = []

    for name, model in models.items():

        print("\nTraining:", name)

        model.fit(X_train, y_train)

        predictions = model.predict(X_test)

        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(X_test)[:, 1]
        else:
            probabilities = model.decision_function(X_test)

        accuracy = accuracy_score(y_test, predictions)
        precision = precision_score(
            y_test,
            predictions,
            zero_division=0
        )
        recall = recall_score(
            y_test,
            predictions,
            zero_division=0
        )
        f1 = f1_score(
            y_test,
            predictions,
            zero_division=0
        )
        auc = roc_auc_score(
            y_test,
            probabilities
        )

        results.append({
            "Feature Set": feature_set_name,
            "Model": name,
            "Accuracy": accuracy,
            "Precision": precision,
            "Recall": recall,
            "F1": f1,
            "ROC_AUC": auc
        })

        print(
            f"Accuracy : {accuracy:.4f}\n"
            f"Precision: {precision:.4f}\n"
            f"Recall   : {recall:.4f}\n"
            f"F1       : {f1:.4f}\n"
            f"ROC-AUC  : {auc:.4f}"
        )

    return results


# ------------------------------------------------------------
# RUN SENSOR MODEL EXPERIMENT
# ------------------------------------------------------------

sensor_results = evaluate_models(
    sensor_features,
    "SENSOR FEATURES"
)

# ------------------------------------------------------------
# RUN FULL MODEL EXPERIMENT
# ------------------------------------------------------------

full_results = evaluate_models(
    full_features,
    "FULL FEATURES"
)

# ------------------------------------------------------------
# COMBINE RESULTS
# ------------------------------------------------------------

all_results = sensor_results + full_results

results_df = pd.DataFrame(all_results)

print("\n")
print("=" * 70)
print("FINAL MODEL COMPARISON")
print("=" * 70)

print(
    results_df.to_string(
        index=False,
        float_format=lambda x: f"{x:.4f}"
    )
)

# ------------------------------------------------------------
# SAVE RESULTS
# ------------------------------------------------------------

results_df.to_csv(
    "models/model_comparison_results.csv",
    index=False
)

print("\nResults saved to:")
print("models/model_comparison_results.csv")

print("\n")
print("=" * 70)
print("MODEL COMPARISON COMPLETE")
print("=" * 70)