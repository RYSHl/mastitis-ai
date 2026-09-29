import joblib
import pandas as pd
from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# ============================================================
# PATHS
# ============================================================

MODEL_PATH = "models/mastitis_random_forest.pkl"
DATA_PATH = "data/cow_milk_mastitis_dataset.csv"


# ============================================================
# LOAD MODEL + DATA
# ============================================================

model = joblib.load(MODEL_PATH)

cow_data = pd.read_csv(DATA_PATH)

# ============================================================
# RECENT AI ASSESSMENTS
# ============================================================

recent_assessments = []


# ============================================================
# FEATURES USED BY THE MODEL
# ============================================================

FEATURES = [
    "Milk_Temperature",
    "Milk_pH",
    "Milk_Conductivity",
    "Milk_Yield",
    "Somatic_Cell_Count",
    "Clotting"
]


# ============================================================
# FASTAPI
# ============================================================

app = FastAPI(
    title="Mastitis AI API",
    version="2.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ============================================================
# REQUEST MODEL
# ============================================================

class CowData(BaseModel):

    cow_id: str = "NEW"

    milk_temperature: float
    milk_ph: float
    milk_conductivity: float
    milk_yield: float
    somatic_cell_count: int
    clotting: int

# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "status": "online",
        "service": "Mastitis AI",
        "model_features": FEATURES
    }


# ============================================================
# GET ALL COWS
# ============================================================

@app.get("/cows")
def get_cows():

    features = cow_data[FEATURES]

    predictions = model.predict(features)

    probabilities = model.predict_proba(features)[:, 1]

    cows = []

    for i in range(len(cow_data)):

        row = cow_data.iloc[i]

        risk = float(probabilities[i]) * 100

        prediction = int(predictions[i])

        # ----------------------------------------------------
        # STATUS BASED ON AI RISK
        # ----------------------------------------------------

        if risk >= 70:

            status = "Mastitis Risk"

        elif risk >= 30:

            status = "Monitoring"

        else:

            status = "Healthy"


        cows.append({

            "cow_id": str(row["Cow_ID"]),

            "day": int(row["Day"]),

            "milk_temperature": float(
                row["Milk_Temperature"]
            ),

            "milk_ph": float(
                row["Milk_pH"]
            ),

            "milk_conductivity": float(
                row["Milk_Conductivity"]
            ),

            "somatic_cell_count": int(
                row["Somatic_Cell_Count"]
            ),

            "milk_yield": float(
                row["Milk_Yield"]
            ),

            "clotting": int(
                row["Clotting"]
            ),

            # Actual dataset label
            "actual_class": int(
                row["class1"]
            ),

            # AI prediction
            "prediction": prediction,

            # AI probability
            "risk": round(
                risk,
                2
            ),

            # Human-readable AI status
            "status": status

        })


    return {

        "count": len(cows),

        "cows": cows

    }


# ============================================================
# GET SINGLE COW
# ============================================================

@app.get("/cows/{cow_id}")
def get_cow(cow_id: str):

    result = cow_data[
        cow_data["Cow_ID"]
        .astype(str)
        .str.upper()
        == cow_id.upper()
    ]


    if result.empty:

        raise HTTPException(
            status_code=404,
            detail="Cow not found"
        )


    row = result.iloc[0]


    features = pd.DataFrame([{

        "Milk_Temperature":
            float(row["Milk_Temperature"]),

        "Milk_pH":
            float(row["Milk_pH"]),

        "Milk_Conductivity":
            float(row["Milk_Conductivity"]),

        "Milk_Yield":
            float(row["Milk_Yield"]),

        "Somatic_Cell_Count":
            int(row["Somatic_Cell_Count"]),

        "Clotting":
            int(row["Clotting"])

    }])


    prediction = int(
        model.predict(features)[0]
    )


    probability = float(
        model.predict_proba(features)[0][1]
    )


    risk = probability * 100


    if risk >= 70:

        status = "Mastitis Risk"

    elif risk >= 30:

        status = "Monitoring"

    else:

        status = "Healthy"


    return {

        "cow_id": str(row["Cow_ID"]),

        "day": int(row["Day"]),

        "milk_temperature":
            float(row["Milk_Temperature"]),

        "milk_ph":
            float(row["Milk_pH"]),

        "milk_conductivity":
            float(row["Milk_Conductivity"]),

        "somatic_cell_count":
            int(row["Somatic_Cell_Count"]),

        "milk_yield":
            float(row["Milk_Yield"]),

        "clotting":
            int(row["Clotting"]),

        "actual_class":
            int(row["class1"]),

        "prediction":
            prediction,

        "risk":
            round(risk, 2),

        "status":
            status

    }

# ============================================================
# GET RECENT AI ASSESSMENTS
# ============================================================

@app.get("/recent-assessments")
def get_recent_assessments():

    return {
        "count": len(recent_assessments),
        "assessments": recent_assessments
    }
# ============================================================
# AI PREDICTION
# ============================================================

@app.post("/predict")
def predict(data: CowData):

    features = pd.DataFrame([{

        "Milk_Temperature":
            data.milk_temperature,

        "Milk_pH":
            data.milk_ph,

        "Milk_Conductivity":
            data.milk_conductivity,

        "Milk_Yield":
            data.milk_yield,

        "Somatic_Cell_Count":
            data.somatic_cell_count,

        "Clotting":
            data.clotting

    }])


    # ========================================================
    # AI PREDICTION
    # ========================================================

    prediction_class = int(
        model.predict(features)[0]
    )


    probability = float(
        model.predict_proba(features)[0][1]
    )


    risk = probability * 100


    # ========================================================
    # HUMAN-READABLE STATUS
    # ========================================================

    if risk >= 70:

        result = "MASTITIS RISK"

    elif risk >= 30:

        result = "MONITORING"

    else:

        result = "LOW RISK"


    # ========================================================
    # CREATE ASSESSMENT RECORD
    # ========================================================

    assessment = {

        "cow_id":
            data.cow_id
            if hasattr(data, "cow_id")
            else "NEW",

        "milk_temperature":
            data.milk_temperature,

        "milk_ph":
            data.milk_ph,

        "milk_conductivity":
            data.milk_conductivity,

        "milk_yield":
            data.milk_yield,

        "somatic_cell_count":
            data.somatic_cell_count,

        "clotting":
            data.clotting,

        "prediction":
            result,

        "prediction_class":
            prediction_class,

        "risk":
            round(risk, 2),

        "probability_percent":
            round(risk, 2),

        "timestamp":
            datetime.now().isoformat()

    }


    # ========================================================
    # SAVE AS RECENT ASSESSMENT
    # ========================================================

    recent_assessments.insert(
        0,
        assessment
    )


    # Keep only latest 20 assessments

    if len(recent_assessments) > 20:

        recent_assessments.pop()


       # ========================================================
    # RETURN RESULT
    # ========================================================

    return {

        "cow_id":
            assessment["cow_id"],

        "milk_temperature":
            assessment["milk_temperature"],

        "milk_ph":
            assessment["milk_ph"],

        "milk_conductivity":
            assessment["milk_conductivity"],

        "milk_yield":
            assessment["milk_yield"],

        "somatic_cell_count":
            assessment["somatic_cell_count"],

        "clotting":
            assessment["clotting"],

        "prediction":
            result,

        "prediction_class":
            prediction_class,

        "probability":
            round(probability, 4),

        "probability_percent":
            round(risk, 2),

        "timestamp":
            assessment["timestamp"]

    }

    # ============================================================
# GET RECENT AI ASSESSMENTS
# ============================================================

@app.get("/recent-assessments")
def get_recent_assessments():

    return {
        "count": len(recent_assessments),
        "assessments": recent_assessments
    }