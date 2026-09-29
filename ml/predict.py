import joblib
import pandas as pd

MODEL_PATH = "models/mastitis_random_forest.pkl"

model = joblib.load(MODEL_PATH)

print("=" * 60)
print("MASTITIS AI - COW PREDICTION")
print("=" * 60)

milk_temperature = 38.2
milk_ph = 7.10
milk_conductivity = 6.8
milk_yield = 9.5

features = pd.DataFrame([{
    "Milk_Temperature": milk_temperature,
    "Milk_pH": milk_ph,
    "Milk_Conductivity": milk_conductivity,
    "Milk_Yield": milk_yield
}])

prediction = model.predict(features)[0]
probability = model.predict_proba(features)[0][1]

print()
print("Input:")
print("Milk Temperature :", milk_temperature)
print("Milk pH          :", milk_ph)
print("Milk Conductivity:", milk_conductivity)
print("Milk Yield       :", milk_yield)

print()
print("AI RESULT")
print("-" * 60)

if prediction == 1:
    print("Prediction : MASTITIS RISK")
else:
    print("Prediction : LOW RISK")

print(f"Probability: {probability * 100:.2f}%")

print("=" * 60)
if __name__ == "__main__":
    main()