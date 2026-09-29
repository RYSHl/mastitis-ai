const API_URL = "https://mastitis-ai-api.onrender.com";


// ============================================================
// PAGE INITIALIZATION
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // --------------------------------------------------------
    // RUN ASSESSMENT BUTTON
    // --------------------------------------------------------

    const button =
        document.getElementById("runAssessment");

    if (button) {

        button.addEventListener(
            "click",
            runAssessment
        );

    }


    // --------------------------------------------------------
    // CURRENT DATE
    // --------------------------------------------------------

    const dateElement =
        document.getElementById("currentDate");

    if (dateElement) {

        dateElement.textContent =
            new Date().toLocaleDateString(
                "en-IN",
                {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            );

    }


    // --------------------------------------------------------
    // LOAD DASHBOARD DATA
    // --------------------------------------------------------

    loadCowData();

    loadRecentAssessments();

});


// ============================================================
// RUN AI ASSESSMENT
// ============================================================

async function runAssessment() {

    // --------------------------------------------------------
    // GET ALL 6 INPUT VALUES
    // --------------------------------------------------------

    const temperature =
        parseFloat(
            document.getElementById(
                "temperature"
            ).value
        );

    const ph =
        parseFloat(
            document.getElementById(
                "ph"
            ).value
        );

    const conductivity =
        parseFloat(
            document.getElementById(
                "conductivity"
            ).value
        );

    const yieldValue =
        parseFloat(
            document.getElementById(
                "yield"
            ).value
        );

    const somaticCellCount =
        parseInt(
            document.getElementById(
                "somaticCellCount"
            ).value,
            10
        );

    const clotting =
        parseInt(
            document.getElementById(
                "clotting"
            ).value,
            10
        );


    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (
        Number.isNaN(temperature) ||
        Number.isNaN(ph) ||
        Number.isNaN(conductivity) ||
        Number.isNaN(yieldValue) ||
        Number.isNaN(somaticCellCount) ||
        Number.isNaN(clotting)
    ) {

        alert(
            "Please enter all six milk and health parameters."
        );

        return;

    }


    // --------------------------------------------------------
    // REALISTIC VALUE VALIDATION
    // --------------------------------------------------------

    if (
        temperature < 30 ||
        temperature > 45
    ) {

        alert(
            "Milk temperature must be between 30°C and 45°C."
        );

        return;

    }


    if (
        ph < 5.5 ||
        ph > 8.0
    ) {

        alert(
            "Milk pH must be between 5.5 and 8.0."
        );

        return;

    }


    if (conductivity < 0) {

        alert(
            "Milk conductivity cannot be negative."
        );

        return;

    }


    if (yieldValue < 0) {

        alert(
            "Milk yield cannot be negative."
        );

        return;

    }


    if (somaticCellCount < 0) {

        alert(
            "Somatic Cell Count cannot be negative."
        );

        return;

    }


    if (
        clotting !== 0 &&
        clotting !== 1
    ) {

        alert(
            "Clotting must be either 0 or 1."
        );

        return;

    }


    // --------------------------------------------------------
    // BUTTON
    // --------------------------------------------------------

    const button =
        document.getElementById(
            "runAssessment"
        );

    if (button) {

        button.disabled = true;

        button.textContent =
            "Analyzing...";

    }


    try {

        console.log(
            "Sending prediction request..."
        );


        // ----------------------------------------------------
        // SEND DATA TO FASTAPI
        // ----------------------------------------------------

        const response =
            await fetch(
                `${API_URL}/predict`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        cow_id: "NEW",

                        milk_temperature:
                            temperature,

                        milk_ph:
                            ph,

                        milk_conductivity:
                            conductivity,

                        milk_yield:
                            yieldValue,

                        somatic_cell_count:
                            somaticCellCount,

                        clotting:
                            clotting

                    })

                }
            );


        // ----------------------------------------------------
        // READ RESPONSE
        // ----------------------------------------------------

        const result =
            await response.json();


        console.log(
            "FastAPI response:",
            result
        );


        // ----------------------------------------------------
        // API ERROR
        // ----------------------------------------------------

        if (!response.ok) {

            console.error(
                "FastAPI error:",
                result
            );

            throw new Error(
                `API Error ${response.status}`
            );

        }


        // ----------------------------------------------------
        // UPDATE RESULT BOX
        // ----------------------------------------------------

        updateAssessmentResult(
            result
        );


        // ----------------------------------------------------
        // IMPORTANT:
        // REFRESH RECENT ASSESSMENTS
        // ----------------------------------------------------

        await loadRecentAssessments();

    }


   catch (error) {

    console.error("Prediction error:", error);

    alert(
        "Unable to get prediction from Mastitis AI API.\n\n" +
        "API: " + API_URL + "\n\n" +
        "Error: " + (error.message || "Unknown error")
    );
}


    finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                "Run AI Assessment";

        }

    }

}


// ============================================================
// UPDATE ASSESSMENT RESULT BOX
// ============================================================

function updateAssessmentResult(result) {

    const prediction =
        result.prediction ||
        "UNKNOWN";


    const probability =
        Number(
            result.probability_percent ||
            0
        );


    console.log(
        "AI Prediction:",
        prediction
    );


    console.log(
        "AI Probability:",
        probability
    );


    // --------------------------------------------------------
    // FIND RESULT BOX
    // --------------------------------------------------------

    let resultBox =
        document.getElementById(
            "assessmentResult"
        );


    // --------------------------------------------------------
    // CREATE RESULT BOX IF NEEDED
    // --------------------------------------------------------

    if (!resultBox) {

        resultBox =
            document.createElement(
                "div"
            );


        resultBox.id =
            "assessmentResult";


        resultBox.style.marginTop =
            "20px";


        resultBox.style.padding =
            "18px";


        resultBox.style.borderRadius =
            "12px";


        resultBox.style.fontWeight =
            "600";


        const button =
            document.getElementById(
                "runAssessment"
            );


        if (button &&
            button.parentNode) {

            button.parentNode.insertBefore(
                resultBox,
                button.nextSibling
            );

        }

    }


    // --------------------------------------------------------
    // MASTITIS RISK
    // --------------------------------------------------------

    if (
        prediction ===
        "MASTITIS RISK"
    ) {

        resultBox.innerHTML = `

            <div style="font-size:18px;">
                ⚠️ Mastitis Risk Detected
            </div>

            <div style="margin-top:6px;">
                AI probability:
                ${probability.toFixed(2)}%
            </div>

            <div style="
                margin-top:10px;
                font-size:13px;
                font-weight:400;
            ">
                Further examination is recommended.
            </div>

        `;


        resultBox.style.background =
            "#fff1f2";


        resultBox.style.color =
            "#be123c";


        resultBox.style.border =
            "1px solid #fecdd3";

    }


    // --------------------------------------------------------
    // MONITORING
    // --------------------------------------------------------

    else if (
        prediction ===
        "MONITORING"
    ) {

        resultBox.innerHTML = `

            <div style="font-size:18px;">
                ◉ Monitoring Required
            </div>

            <div style="margin-top:6px;">
                AI probability:
                ${probability.toFixed(2)}%
            </div>

            <div style="
                margin-top:10px;
                font-size:13px;
                font-weight:400;
            ">
                The AI model identified an intermediate-risk pattern.
            </div>

        `;


        resultBox.style.background =
            "#fff7ed";


        resultBox.style.color =
            "#c2410c";


        resultBox.style.border =
            "1px solid #fed7aa";

    }


    // --------------------------------------------------------
    // LOW RISK
    // --------------------------------------------------------

    else {

        resultBox.innerHTML = `

            <div style="font-size:18px;">
                ✓ Low Risk
            </div>

            <div style="margin-top:6px;">
                Mastitis probability:
                ${probability.toFixed(2)}%
            </div>

            <div style="
                margin-top:10px;
                font-size:13px;
                font-weight:400;
            ">
                Current parameters indicate a low mastitis risk
                according to the AI model.
            </div>

        `;


        resultBox.style.background =
            "#ecfdf5";


        resultBox.style.color =
            "#047857";


        resultBox.style.border =
            "1px solid #a7f3d0";

    }

}


// ============================================================
// LOAD ALL COW DATA
// ============================================================

async function loadCowData() {

    try {

        console.log(
            "Loading cow data..."
        );


        const response =
            await fetch(
                `${API_URL}/cows`
            );


        if (!response.ok) {

            throw new Error(
                `API Error: ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "Cow data received:",
            data
        );


        console.log(
            "Total cows:",
            data.count
        );


        console.log(
            "Cows:",
            data.cows
        );


        // ----------------------------------------------------
        // UPDATE DASHBOARD STATISTICS
        // ----------------------------------------------------

        const totalCows =
            document.getElementById(
                "totalCows"
            );


        const healthyCows =
            document.getElementById(
                "healthyCows"
            );


        const riskCows =
            document.getElementById(
                "riskCows"
            );


        const aiPredictions =
            document.getElementById(
                "aiPredictions"
            );


        // ----------------------------------------------------
        // TOTAL COWS
        // ----------------------------------------------------

        if (totalCows) {

            totalCows.textContent =
                data.count;

        }


        // ----------------------------------------------------
        // COUNT STATUSES
        // ----------------------------------------------------

        let healthy = 0;

        let monitoring = 0;

        let risk = 0;


        data.cows.forEach(
            (cow) => {

                if (
                    cow.status ===
                    "Healthy"
                ) {

                    healthy++;

                }

                else if (
                    cow.status ===
                    "Monitoring"
                ) {

                    monitoring++;

                }

                else if (
                    cow.status ===
                    "Mastitis Risk"
                ) {

                    risk++;

                }

            }
        );


        // ----------------------------------------------------
        // OTHER DASHBOARD ELEMENTS
        // ----------------------------------------------------

        const riskPercentage =
            document.getElementById(
                "riskPercentage"
            );


        const healthyRiskCount =
            document.getElementById(
                "healthyRiskCount"
            );


        const highRiskCount =
            document.getElementById(
                "highRiskCount"
            );


        const monitoringCount =
            document.getElementById(
                "monitoringCount"
            );


        const total =
            data.cows.length;


        const atRiskPercentage =
            total > 0
                ? (
                    (risk / total) *
                    100
                )
                : 0;


        if (riskPercentage) {

            riskPercentage.textContent =
                `${atRiskPercentage.toFixed(1)}%`;

        }


        if (healthyRiskCount) {

            healthyRiskCount.textContent =
                healthy;

        }


        if (highRiskCount) {

            highRiskCount.textContent =
                risk;

        }


        if (monitoringCount) {

            monitoringCount.textContent =
                monitoring;

        }


        // ----------------------------------------------------
        // MAIN COUNTERS
        // ----------------------------------------------------

        if (healthyCows) {

            healthyCows.textContent =
                healthy;

        }


        if (riskCows) {

            riskCows.textContent =
                risk;

        }


        if (aiPredictions) {

            aiPredictions.textContent =
                data.count;

        }


        // ----------------------------------------------------
        // DEBUG
        // ----------------------------------------------------

        console.log(
            "Healthy:",
            healthy
        );


        console.log(
            "Monitoring:",
            monitoring
        );


        console.log(
            "Mastitis Risk:",
            risk
        );

    }


    catch (error) {

        console.error(
            "Failed to load cow data:",
            error
        );

    }

}


// ============================================================
// LOAD RECENT AI ASSESSMENTS
// ============================================================

async function loadRecentAssessments() {

    try {

        console.log(
            "Loading recent AI assessments..."
        );


        const response =
            await fetch(
                `${API_URL}/recent-assessments`
            );


        if (!response.ok) {

            throw new Error(
                `Recent assessments API error: ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "Recent assessments received:",
            data
        );


        // ----------------------------------------------------
        // RENDER ACTUAL USER ASSESSMENTS
        // ----------------------------------------------------

        renderRecentAssessments(
            data.assessments || []
        );

    }


    catch (error) {

        console.error(
            "Failed to load recent assessments:",
            error
        );

    }

}


// ============================================================
// RENDER RECENT AI ASSESSMENTS
// ============================================================

function renderRecentAssessments(
    assessments
) {

    const tbody =
        document.getElementById(
            "recentCowsBody"
        );


    // --------------------------------------------------------
    // TABLE NOT FOUND
    // --------------------------------------------------------

    if (!tbody) {

        console.error(
            "recentCowsBody not found"
        );

        return;

    }


    // --------------------------------------------------------
    // REMOVE STATIC HTML ROWS
    // --------------------------------------------------------

    tbody.innerHTML = "";


    // --------------------------------------------------------
    // NO ASSESSMENTS
    // --------------------------------------------------------

    if (
        !Array.isArray(assessments) ||
        assessments.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >
                    No AI assessments yet.
                </td>

            </tr>

        `;

        return;

    }


    // --------------------------------------------------------
    // SHOW LATEST 5
    // --------------------------------------------------------

    assessments
        .slice(0, 5)
        .forEach(
            (assessment) => {

                let badgeClass =
                    "badge-healthy";


                let status =
                    "LOW RISK";


                const prediction =
                    String(
                        assessment.prediction ||
                        "LOW RISK"
                    ).toUpperCase();


                // ------------------------------------------------
                // MASTITIS
                // ------------------------------------------------

                if (
                    prediction ===
                    "MASTITIS RISK"
                ) {

                    badgeClass =
                        "badge-risk";

                    status =
                        "MASTITIS RISK";

                }


                // ------------------------------------------------
                // MONITORING
                // ------------------------------------------------

                else if (
                    prediction ===
                    "MONITORING"
                ) {

                    badgeClass =
                        "badge-monitoring";

                    status =
                        "MONITORING";

                }


                // ------------------------------------------------
                // LOW RISK
                // ------------------------------------------------

                else {

                    badgeClass =
                        "badge-healthy";

                    status =
                        "LOW RISK";

                }


                // ------------------------------------------------
                // CREATE ROW
                // ------------------------------------------------

                const row =
                    document.createElement(
                        "tr"
                    );


                const temperature =
                    Number(
                        assessment.milk_temperature
                    );


                const ph =
                    Number(
                        assessment.milk_ph
                    );


                const conductivity =
                    Number(
                        assessment.milk_conductivity
                    );


                const milkYield =
                    Number(
                        assessment.milk_yield
                    );


                row.innerHTML = `

                    <td class="cow-id">
                        ${
                            assessment.cow_id ||
                            "NEW"
                        }
                    </td>

                    <td>
                        ${
                            Number.isFinite(
                                temperature
                            )
                            ? temperature.toFixed(2)
                            : "—"
                        } °C
                    </td>

                    <td>
                        ${
                            Number.isFinite(
                                ph
                            )
                            ? ph.toFixed(2)
                            : "—"
                        }
                    </td>

                    <td>
                        ${
                            Number.isFinite(
                                conductivity
                            )
                            ? conductivity.toFixed(2)
                            : "—"
                        }
                    </td>

                    <td>
                        ${
                            Number.isFinite(
                                milkYield
                            )
                            ? milkYield.toFixed(1)
                            : "—"
                        } L
                    </td>

                    <td>
                        <span
                            class="badge ${badgeClass}"
                        >
                            ${status}
                        </span>
                    </td>

                `;


                tbody.appendChild(
                    row
                );

            }
        );

}