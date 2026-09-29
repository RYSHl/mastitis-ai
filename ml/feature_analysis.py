import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = BASE_DIR / "data" / "cow_milk_mastitis_dataset.csv"

df = pd.read_csv(DATA_FILE)

features = [
    "Milk_Temperature",
    "Milk_pH",
    "Milk_Conductivity",
    "Milk_Yield"
]

print("=" * 70)
print("MASTITIS AI - FEATURE ANALYSIS")
print("=" * 70)

print("\nClass-wise statistics")
print("=" * 70)

for feature in features:

    print(f"\n{feature}")

    stats = df.groupby("class1")[feature].agg([
        "count",
        "mean",
        "std",
        "min",
        "median",
        "max"
    ])

    print(stats)


print("\n" + "=" * 70)
print("CLASS MEANS")
print("=" * 70)

means = df.groupby("class1")[features].mean()

print(means)


print("\n" + "=" * 70)
print("CORRELATION WITH MASTITIS")
print("=" * 70)

correlation = df[features + ["class1"]].corr()["class1"]

print(correlation.sort_values(ascending=False))


print("\n" + "=" * 70)
print("FEATURE ANALYSIS COMPLETE")
print("=" * 70)