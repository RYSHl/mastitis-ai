// ============================================================
// MASTITIS AI — PREDICTION ENGINE
// ============================================================

// Production API
const API_URL = "https://mastitis-ai-api.onrender.com";


// ============================================================
// RUN AI PREDICTION
// ============================================================

async function runPrediction() {

    const button = document.getElementById("runPrediction");
    const errorBox = document.getElementById("predictionError");

    // --------------------------------------------------------
    // READ INPUTS
    // --------------------------------------------------------

    const temperature = parseFloat(
        document.getElementById("milkTemperature").value
    );

    const ph = parseFloat(
        document.getElementById("milkPH").value
    );

    const conductivity = parseFloat(
        document.getElementById("milkConductivity").value
    );

    const yieldValue = parseFloat(
        document.getElementById("milkYield").value
    );

    const somaticCellCount = parseInt(
        document.getElementById("somaticCellCount").value,
        10
    );

    const clotting = parseInt(
        document.getElementById("clotting").value,
        10
    );


    // --------------------------------------------------------
    // CLEAR PREVIOUS ERROR
    // --------------------------------------------------------

    errorBox.classList.add("hidden");
    errorBox.textContent = "";


    // --------------------------------------------------------
    // VALIDATE INPUTS
    // --------------------------------------------------------

    if (
        Number.isNaN(temperature) ||
        Number.isNaN(ph) ||
        Number.isNaN(conductivity) ||
        Number.isNaN(yieldValue) ||
        Number.isNaN(somaticCellCount) ||
        Number.isNaN(clotting)
    ) {

        errorBox.textContent =
            "Please enter valid values for all six parameters.";

        errorBox.classList.remove("hidden");

        return;
    }


    // --------------------------------------------------------
    // VALIDATE CLOTTING
    // --------------------------------------------------------

    if (clotting !== 0 && clotting !== 1) {

        errorBox.textContent =
            "Clotting must be either 0 or 1.";

        errorBox.classList.remove("hidden");

        return;
    }


    // --------------------------------------------------------
    // DISABLE BUTTON
    // --------------------------------------------------------

    button.disabled = true;

    button.innerHTML = `
        <span>Analyzing...</span>
    `;


    try {

        console.log("====================================");
        console.log("Mastitis AI Prediction Request");
        console.log("API:", API_URL);
        console.log("====================================");


        // ----------------------------------------------------
        // REQUEST DATA
        // ----------------------------------------------------

        const requestBody = {

            milk_temperature: temperature,

            milk_ph: ph,

            milk_conductivity: conductivity,

            milk_yield: yieldValue,

            somatic_cell_count: somaticCellCount,

            clotting: clotting

        };


        console.log(
            "Prediction input:",
            requestBody
        );


        // ----------------------------------------------------
        // SEND REQUEST TO LIVE FASTAPI SERVER
        // ----------------------------------------------------

        const response = await fetch(
            `${API_URL}/predict`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },

                body: JSON.stringify(requestBody)
            }
        );


        // ----------------------------------------------------
        // READ RESPONSE SAFELY
        // ----------------------------------------------------

        let data;

        try {

            data = await response.json();

        } catch (jsonError) {

            throw new Error(
                `Server returned an invalid response (${response.status}).`
            );

        }


        console.log(
            "Prediction response:",
            data
        );


        // ----------------------------------------------------
        // API ERROR
        // ----------------------------------------------------

        if (!response.ok) {

            const apiMessage =
                data?.detail ||
                data?.message ||
                `API returned ${response.status}`;

            throw new Error(apiMessage);

        }


        // ----------------------------------------------------
        // DISPLAY RESULT
        // ----------------------------------------------------

        showPredictionResult(data);


    } catch (error) {

        console.error(
            "Prediction error:",
            error
        );


        errorBox.textContent =
            `Unable to get prediction from the AI engine. ${error.message || ""}`;

        errorBox.classList.remove("hidden");

    }


    // --------------------------------------------------------
    // RESTORE BUTTON
    // --------------------------------------------------------

    button.disabled = false;

    button.innerHTML = `
        <span>Run AI Assessment</span>
    `;
}



// ============================================================
// SHOW PREDICTION RESULT
// ============================================================

function showPredictionResult(data) {

    const emptyState =
        document.getElementById("predictionEmpty");

    const resultPanel =
        document.getElementById("predictionResult");

    const badge =
        document.getElementById("resultBadge");

    const probability =
        document.getElementById("probabilityValue");

    const probabilityText =
        document.getElementById("probabilityText");

    const predictionText =
        document.getElementById("predictionText");

    const title =
        document.getElementById("resultTitle");

    const description =
        document.getElementById("resultDescription");


    // --------------------------------------------------------
    // SHOW RESULT PANEL
    // --------------------------------------------------------

    emptyState.classList.add("hidden");

    resultPanel.classList.remove("hidden");


    // --------------------------------------------------------
    // PROBABILITY
    // --------------------------------------------------------

    const percent =
        Number(data.probability_percent || 0);


    probability.textContent =
        `${percent.toFixed(1)}%`;

    probabilityText.textContent =
        `${percent.toFixed(1)}%`;


    // --------------------------------------------------------
    // PREDICTION TEXT
    // --------------------------------------------------------

    const prediction =
        String(
            data.prediction || "UNKNOWN"
        );


    predictionText.textContent =
        prediction;


    const predictionUpper =
        prediction.toUpperCase();


    // ========================================================
    // MASTITIS RISK
    // ========================================================

    if (
        predictionUpper.includes("MASTITIS") ||
        predictionUpper.includes("RISK")
    ) {

        badge.textContent =
            "MASTITIS RISK";

        badge.className =
            "result-badge risk-badge";

        title.textContent =
            "Mastitis risk detected";

        description.textContent =
            "The AI model identified a high-risk pattern in the submitted parameters.";

    }


    // ========================================================
    // MONITORING
    // ========================================================

    else if (
        predictionUpper.includes("MONITOR")
    ) {

        badge.textContent =
            "MONITORING";

        badge.className =
            "result-badge monitoring-badge";

        title.textContent =
            "Monitoring recommended";

        description.textContent =
            "The AI model identified an intermediate-risk pattern in the submitted parameters.";

    }


    // ========================================================
    // LOW RISK / HEALTHY
    // ========================================================

    else {

        badge.textContent =
            "LOW RISK";

        badge.className =
            "result-badge healthy-badge";

        title.textContent =
            "Low mastitis risk";

        description.textContent =
            "The submitted parameters currently show a low-risk pattern according to the AI model.";

    }

}