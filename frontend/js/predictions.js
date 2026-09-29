const API_URL = "http://127.0.0.1:8000";


async function runPrediction() {

    const button = document.getElementById("runPrediction");
    const errorBox = document.getElementById("predictionError");

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


    // Clear previous error
    errorBox.classList.add("hidden");
    errorBox.textContent = "";


    // Validate all six inputs
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


    // Clotting must be 0 or 1
    if (clotting !== 0 && clotting !== 1) {

        errorBox.textContent =
            "Clotting must be either 0 or 1.";

        errorBox.classList.remove("hidden");

        return;
    }


    button.disabled = true;

    button.innerHTML = `
        <span>Analyzing...</span>
    `;


    try {

        console.log("Sending prediction request...");

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


        const response = await fetch(
            `${API_URL}/predict`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(requestBody)
            }
        );


        const data = await response.json();


        console.log(
            "Prediction response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                `API returned ${response.status}`
            );

        }


        showPredictionResult(data);


    } catch (error) {

        console.error(
            "Prediction error:",
            error
        );


        errorBox.textContent =
            "Unable to get prediction from the AI engine.";

        errorBox.classList.remove("hidden");

    }


    button.disabled = false;

    button.innerHTML = `
        <span>Run AI Assessment</span>
    `;
}



// ============================================================
// SHOW RESULT
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


    emptyState.classList.add("hidden");

    resultPanel.classList.remove("hidden");


    const percent =
        Number(data.probability_percent || 0);


    probability.textContent =
        `${percent.toFixed(1)}%`;

    probabilityText.textContent =
        `${percent.toFixed(1)}%`;

    predictionText.textContent =
        data.prediction || "UNKNOWN";


    // ========================================================
    // MASTITIS RISK
    // ========================================================

    if (
        data.prediction &&
        data.prediction
            .toUpperCase()
            .includes("MASTITIS")
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
        data.prediction &&
        data.prediction
            .toUpperCase()
            .includes("MONITOR")
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
    // LOW RISK
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