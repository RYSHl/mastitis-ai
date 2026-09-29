import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)
from sklearn.calibration import CalibratedClassifierCV


# ============================================================
# PATHS
# ============================================================

DATA_PATH = "data/cow_milk_mastitis_dataset.csv"
MODEL_PATH = "models/mastitis_random_forest.pkl"


# ============================================================
# LOAD DATA
# ============================================================

df = pd.read_csv(DATA_PATH)

print("Dataset loaded")
print("Shape:", df.shape)

print("\nClass distribution:")
print(df["class1"].value_counts())


# ============================================================
# FEATURES
# ============================================================

FEATURES = [
    "Milk_Temperature",
    "Milk_pH",
    "Milk_Conductivity",
    "Milk_Yield",
    "Somatic_Cell_Count",
    "Clotting"
]

TARGET = "class1"


X = df[FEATURES]
y = df[TARGET]


# ============================================================
# TRAIN / TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


# ============================================================
# BASE RANDOM FOREST
# ============================================================

base_model = RandomForestClassifier(
    n_estimators=300,
    max_depth=8,
    min_samples_split=8,
    min_samples_leaf=4,
    max_features="sqrt",
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)


# ============================================================
# PROBABILITY CALIBRATION
# ============================================================

model = CalibratedClassifierCV(
    estimator=base_model,
    method="sigmoid",
    cv=5
)


# ============================================================
# TRAIN
# ============================================================

print("\nTraining model...")

model.fit(X_train, y_train)

print("Training complete.")


# ============================================================
# TEST
# ============================================================

predictions = model.predict(X_test)

probabilities = model.predict_proba(X_test)[:, 1]


accuracy = accuracy_score(
    y_test,
    predictions
)


print("\n==============================")
print("MODEL RESULTS")
print("==============================")

print(
    f"Accuracy: {accuracy * 100:.2f}%"
)

print("\nClassification Report:")

print(
    classification_report(
        y_test,
        predictions
    )
)

print("\nConfusion Matrix:")

print(
    confusion_matrix(
        y_test,
        predictions
    )
)


# ============================================================
# PROBABILITY CHECK
# ============================================================

print("\n==============================")
print("PROBABILITY CHECK")
print("==============================")

print(
    "Minimum:",
    probabilities.min()
)

print(
    "Maximum:",
    probabilities.max()
)

print(
    "Unique probabilities:",
    len(set(probabilities))
)

print(
    "First 20 probabilities:"
)

print(
    probabilities[:20]
)


# ============================================================
# SAVE MODEL
# ============================================================

joblib.dump(
    model,
    MODEL_PATH
)


print("\n==============================")
print("MODEL SAVED")
print("==============================")

print(
    MODEL_PATH
)

print("\nFeatures used:")

print(FEATURES)