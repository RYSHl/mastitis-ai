import pandas as pd
from pathlib import Path

# Find the project folder
BASE_DIR = Path(__file__).resolve().parent.parent

# Dataset location
DATA_FILE = BASE_DIR / "data" / "cow_milk_mastitis_dataset.csv"

# Load dataset
df = pd.read_csv(DATA_FILE)

print("\n" + "=" * 60)
print("MASTITIS AI - DATASET ANALYSIS")
print("=" * 60)

# Basic information
print("\nDataset shape:")
print(f"Rows: {df.shape[0]}")
print(f"Columns: {df.shape[1]}")

print("\nColumns:")
for column in df.columns:
    print(f" - {column}")

# First records
print("\nFirst 5 records:")
print(df.head())

# Data types
print("\nData types:")
print(df.dtypes)

# Missing values
print("\nMissing values:")
print(df.isnull().sum())

# Duplicate rows
print("\nDuplicate rows:")
print(df.duplicated().sum())

# Statistical summary
print("\nStatistical summary:")
print(df.describe().T)

# Target distribution
if "class1" in df.columns:
    print("\nTarget distribution (class1):")
    print(df["class1"].value_counts())

    print("\nTarget percentages:")
    print(df["class1"].value_counts(normalize=True) * 100)

print("\n" + "=" * 60)
print("ANALYSIS COMPLETE")
print("=" * 60)