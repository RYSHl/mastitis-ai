console.log("COWS.JS LOADED");


// ============================================================
// GLOBAL DATA
// ============================================================

let cows = {};
let cowsLoaded = false;


// ============================================================
// API URL
// ============================================================

const API_URL = "http://127.0.0.1:8000";


// ============================================================
// LOAD ALL COWS
// ============================================================

async function loadCows() {

    if (cowsLoaded) {
        return;
    }

    console.log("Loading cows from API...");

    try {

        const response = await fetch(
            `${API_URL}/cows`
        );

        if (!response.ok) {

            throw new Error(
                `API returned status ${response.status}`
            );

        }

        const data = await response.json();

        console.log("API response:", data);


        // ----------------------------------------------------
        // Check API response
        // ----------------------------------------------------

        if (!data.cows || !Array.isArray(data.cows)) {

            throw new Error(
                "Invalid API response: cows array not found"
            );

        }


        // ----------------------------------------------------
        // Clear previous data
        // ----------------------------------------------------

        cows = {};


        // ----------------------------------------------------
        // Store cows
        // ----------------------------------------------------

        data.cows.forEach(function (cow) {

            const cowId = String(
                cow.cow_id
            );


            // =================================================
            // GET RISK
            // =================================================

            let risk = Number(
                cow.risk
            );


            // Fallback 1
            if (!Number.isFinite(risk)) {

                risk = Number(
                    cow.probability_percent
                );

            }


            // Fallback 2
            if (!Number.isFinite(risk)) {

                risk =
                    Number(cow.prediction) === 1
                        ? 100
                        : 0;

            }


            // Keep between 0 and 100
            risk = Math.max(
                0,
                Math.min(
                    100,
                    risk
                )
            );


            // =================================================
            // STATUS
            // =================================================

            let status;
            let statusClass;


            if (risk >= 70) {

                status = "Mastitis Risk";
                statusClass = "risk";

            }

            else if (risk >= 30) {

                status = "Monitoring";
                statusClass = "monitoring";

            }

            else {

                status = "Healthy";
                statusClass = "healthy";

            }


            // =================================================
            // STORE DATA
            // =================================================

            cows[cowId] = {

                cow_id: cowId,

                day: Number(
                    cow.day
                ),

                temperature: Number(
                    cow.milk_temperature
                ),

                ph: Number(
                    cow.milk_ph
                ),

                conductivity: Number(
                    cow.milk_conductivity
                ),

                yield: Number(
                    cow.milk_yield
                ),

                somatic_cell_count: Number(
                    cow.somatic_cell_count
                ),

                clotting: Number(
                    cow.clotting
                ),

                actual_class: Number(
                    cow.actual_class
                ),

                prediction: Number(
                    cow.prediction
                ),

                risk: risk,

                status: status,

                statusClass: statusClass

            };

        });


        // ----------------------------------------------------
        // Mark loaded
        // ----------------------------------------------------

        cowsLoaded = true;


        // ----------------------------------------------------
        // Render table
        // ----------------------------------------------------

        renderCowTable();


        console.log(
            "Successfully loaded:",
            Object.keys(cows).length,
            "cows"
        );

    }

    catch (error) {

        console.error(
            "Unable to load cows:",
            error
        );


        const tableBody =
            document.getElementById(
                "cowTableBody"
            );


        if (tableBody) {

            tableBody.innerHTML = `

                <tr>

                    <td
                        colspan="8"
                        style="
                            text-align:center;
                            padding:40px;
                        "
                    >

                        <strong>
                            Unable to connect to Mastitis AI API
                        </strong>

                        <br><br>

                        Make sure FastAPI is running on:

                        <br>

                        <strong>
                            http://127.0.0.1:8000
                        </strong>

                    </td>

                </tr>

            `;

        }

    }

}


// ============================================================
// RENDER COW TABLE
// ============================================================

function renderCowTable() {

    const tableBody =
        document.getElementById(
            "cowTableBody"
        );


    if (!tableBody) {

        console.error(
            "ERROR: #cowTableBody was not found in cows.html"
        );

        return;

    }


    // --------------------------------------------------------
    // Clear table
    // --------------------------------------------------------

    tableBody.innerHTML = "";


    // --------------------------------------------------------
    // Get cow IDs
    // --------------------------------------------------------

    const cowIds =
        Object.keys(cows);


    // --------------------------------------------------------
    // Render each cow exactly once
    // --------------------------------------------------------

    cowIds.forEach(function (cowId) {

        const cow =
            cows[cowId];


        const row =
            document.createElement("tr");


        row.dataset.cowId =
            cowId;


        row.dataset.status =
            cow.statusClass;


        // ----------------------------------------------------
        // Risk class
        // ----------------------------------------------------

        let riskClass;


        if (cow.risk >= 70) {

            riskClass = "risk-high";

        }

        else if (cow.risk >= 30) {

            riskClass = "risk-medium";

        }

        else {

            riskClass = "risk-low";

        }


        // ----------------------------------------------------
        // Safe values
        // ----------------------------------------------------

        const temperature =
            Number.isFinite(cow.temperature)
                ? cow.temperature.toFixed(2)
                : "—";


        const ph =
            Number.isFinite(cow.ph)
                ? cow.ph.toFixed(2)
                : "—";


        const conductivity =
            Number.isFinite(cow.conductivity)
                ? cow.conductivity.toFixed(2)
                : "—";


        const milkYield =
            Number.isFinite(cow.yield)
                ? cow.yield.toFixed(1)
                : "—";


        // ----------------------------------------------------
        // Create row
        // ----------------------------------------------------

        row.innerHTML = `

            <td class="cow-id">
                ${escapeHTML(cowId)}
            </td>

            <td>
                ${temperature} °C
            </td>

            <td>
                ${ph}
            </td>

            <td>
                ${conductivity}
            </td>

            <td>
                ${milkYield} L
            </td>

            <td>

                <span class="risk-number ${riskClass}">
                    ${cow.risk.toFixed(1)}%
                </span>

            </td>

            <td>

                <span class="status ${cow.statusClass}">

                    <span class="dot"></span>

                    ${escapeHTML(cow.status)}

                </span>

            </td>

            <td>

                <button
                    type="button"
                    class="view-btn"
                    data-cow-id="${escapeHTML(cowId)}"
                >
                    View
                </button>

            </td>

        `;


        // ----------------------------------------------------
        // View button
        // ----------------------------------------------------

        const viewButton =
            row.querySelector(
                ".view-btn"
            );


        viewButton.addEventListener(
            "click",
            function () {

                viewCow(cowId);

            }
        );


        // ----------------------------------------------------
        // Add row
        // ----------------------------------------------------

        tableBody.appendChild(
            row
        );

    });


    console.log(
        "Rendered",
        cowIds.length,
        "cows"
    );

}


// ============================================================
// VIEW COW
// ============================================================

function viewCow(cowId) {

    console.log(
        "Viewing cow:",
        cowId
    );


    const cow =
        cows[cowId];


    if (!cow) {

        console.error(
            "Cow not found:",
            cowId
        );

        return;

    }


    // --------------------------------------------------------
    // Remove old modal if one exists
    // --------------------------------------------------------

    const oldModal =
        document.getElementById(
            "mastitisCowModal"
        );


    if (oldModal) {

        oldModal.remove();

    }


    // --------------------------------------------------------
    // Risk label
    // --------------------------------------------------------

    let riskLabel;


    if (cow.risk >= 70) {

        riskLabel = "HIGH RISK";

    }

    else if (cow.risk >= 30) {

        riskLabel = "MONITORING";

    }

    else {

        riskLabel = "LOW RISK";

    }


    // --------------------------------------------------------
    // Prediction label
    // --------------------------------------------------------

    let predictionText;


    if (cow.prediction === 1) {

        predictionText =
            "Mastitis Risk";

    }

    else if (cow.prediction === 0) {

        predictionText =
            "Low Risk";

    }

    else {

        predictionText =
            "Not Available";

    }


    // --------------------------------------------------------
    // Create modal
    // --------------------------------------------------------

    const modal =
        document.createElement("div");


    modal.id =
        "mastitisCowModal";


    modal.innerHTML = `

        <div class="mastitis-modal-backdrop"></div>

        <div class="mastitis-modal">

            <button
                type="button"
                class="mastitis-modal-close"
                id="closeCowModal"
            >
                ×
            </button>


            <div class="mastitis-modal-header">

                <div class="mastitis-modal-eyebrow">
                    COW PROFILE
                </div>

                <h2>
                    ${escapeHTML(cow.cow_id)}
                </h2>

            </div>


            <div class="mastitis-modal-status">

                <div>

                    <div class="mastitis-section-label">
                        AI RISK ASSESSMENT
                    </div>

                    <div
                        class="mastitis-status-text ${cow.statusClass}"
                    >
                        ${escapeHTML(cow.status)}
                    </div>

                </div>


                <div class="mastitis-risk-value">
                    ${cow.risk.toFixed(1)}%
                </div>

            </div>


            <div class="mastitis-modal-section">

                <div class="mastitis-section-title">
                    Milk Parameters
                </div>


                <div class="mastitis-data-grid">

                    <div class="mastitis-data-item">

                        <span>
                            Milk Temperature
                        </span>

                        <strong>
                            ${formatNumber(
                                cow.temperature,
                                2
                            )} °C
                        </strong>

                    </div>


                    <div class="mastitis-data-item">

                        <span>
                            Milk pH
                        </span>

                        <strong>
                            ${formatNumber(
                                cow.ph,
                                2
                            )}
                        </strong>

                    </div>


                    <div class="mastitis-data-item">

                        <span>
                            Milk Conductivity
                        </span>

                        <strong>
                            ${formatNumber(
                                cow.conductivity,
                                2
                            )}
                        </strong>

                    </div>


                    <div class="mastitis-data-item">

                        <span>
                            Milk Yield
                        </span>

                        <strong>
                            ${formatNumber(
                                cow.yield,
                                1
                            )} L
                        </strong>

                    </div>

                </div>

            </div>


            <div class="mastitis-modal-section">

                <div class="mastitis-section-title">
                    Health Indicators
                </div>


                <div class="mastitis-data-grid">

                    <div class="mastitis-data-item">

                        <span>
                            Somatic Cell Count
                        </span>

                        <strong>
                            ${formatInteger(
                                cow.somatic_cell_count
                            )}
                        </strong>

                    </div>


                    <div class="mastitis-data-item">

                        <span>
                            Clotting
                        </span>

                        <strong>
                            ${formatInteger(
                                cow.clotting
                            )}
                        </strong>

                    </div>


                    <div class="mastitis-data-item">

                        <span>
                            Day
                        </span>

                        <strong>
                            ${formatInteger(
                                cow.day
                            )}
                        </strong>

                    </div>

                </div>

            </div>


            <div class="mastitis-modal-section">

                <div class="mastitis-section-title">
                    AI Assessment
                </div>


                <div class="mastitis-ai-box">

                    <div>

                        <span>
                            Prediction
                        </span>

                        <strong>
                            ${predictionText}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Risk Probability
                        </span>

                        <strong>
                            ${cow.risk.toFixed(1)}%
                        </strong>

                    </div>


                    <div>

                        <span>
                            Assessment
                        </span>

                        <strong>
                            ${riskLabel}
                        </strong>

                    </div>

                </div>

            </div>


        </div>

    `;


    document.body.appendChild(
        modal
    );


    // --------------------------------------------------------
    // Add modal CSS
    // --------------------------------------------------------

    addCowModalStyles();


    // --------------------------------------------------------
    // Close button
    // --------------------------------------------------------

    const closeButton =
        document.getElementById(
            "closeCowModal"
        );


    closeButton.addEventListener(
        "click",
        closeCowModal
    );


    // --------------------------------------------------------
    // Click outside modal
    // --------------------------------------------------------

    const backdrop =
        modal.querySelector(
            ".mastitis-modal-backdrop"
        );


    backdrop.addEventListener(
        "click",
        closeCowModal
    );


    // --------------------------------------------------------
    // ESC key
    // --------------------------------------------------------

    document.addEventListener(
        "keydown",
        handleModalEscape
    );

}


// ============================================================
// CLOSE MODAL
// ============================================================

function closeCowModal() {

    const modal =
        document.getElementById(
            "mastitisCowModal"
        );


    if (modal) {

        modal.remove();

    }


    document.removeEventListener(
        "keydown",
        handleModalEscape
    );

}


// ============================================================
// ESCAPE KEY
// ============================================================

function handleModalEscape(event) {

    if (event.key === "Escape") {

        closeCowModal();

    }

}


// ============================================================
// MODAL STYLES
// ============================================================

function addCowModalStyles() {

    if (
        document.getElementById(
            "mastitisCowModalStyles"
        )
    ) {

        return;

    }


    const style =
        document.createElement("style");


    style.id =
        "mastitisCowModalStyles";


    style.textContent = `

        #mastitisCowModal {

            position: fixed;

            inset: 0;

            z-index: 99999;

            display: flex;

            align-items: center;

            justify-content: center;

            padding: 24px;

            font-family:
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                sans-serif;

        }


        .mastitis-modal-backdrop {

            position: absolute;

            inset: 0;

            background:
                rgba(15, 23, 42, 0.45);

            backdrop-filter:
                blur(5px);

        }


        .mastitis-modal {

            position: relative;

            width: min(
                720px,
                100%
            );

            max-height:
                calc(100vh - 48px);

            overflow-y: auto;

            background:
                #ffffff;

            border-radius:
                22px;

            padding:
                34px;

            box-shadow:
                0 30px 80px
                rgba(15, 23, 42, 0.22);

            animation:
                mastitisModalIn
                0.18s ease-out;

        }


        @keyframes mastitisModalIn {

            from {

                opacity: 0;

                transform:
                    translateY(12px)
                    scale(0.98);

            }

            to {

                opacity: 1;

                transform:
                    translateY(0)
                    scale(1);

            }

        }


        .mastitis-modal-close {

            position: absolute;

            top: 20px;

            right: 22px;

            width: 36px;

            height: 36px;

            border: none;

            border-radius: 10px;

            background:
                #f1f5f9;

            color:
                #334155;

            font-size: 24px;

            line-height: 1;

            cursor: pointer;

        }


        .mastitis-modal-close:hover {

            background:
                #e2e8f0;

        }


        .mastitis-modal-eyebrow {

            font-size: 12px;

            font-weight: 700;

            letter-spacing:
                0.12em;

            color:
                #64748b;

            margin-bottom: 6px;

        }


        .mastitis-modal-header h2 {

            margin: 0;

            font-size: 34px;

            color:
                #0f172a;

        }


        .mastitis-modal-status {

            display: flex;

            align-items: center;

            justify-content: space-between;

            gap: 20px;

            margin-top: 28px;

            padding: 20px;

            border-radius: 16px;

            background:
                #f8fafc;

        }


        .mastitis-section-label {

            font-size: 12px;

            font-weight: 700;

            text-transform: uppercase;

            letter-spacing:
                0.08em;

            color:
                #64748b;

            margin-bottom: 7px;

        }


        .mastitis-status-text {

            font-size: 18px;

            font-weight: 700;

        }


        .mastitis-status-text.healthy {

            color:
                #047857;

        }


        .mastitis-status-text.monitoring {

            color:
                #b45309;

        }


        .mastitis-status-text.risk {

            color:
                #be123c;

        }


        .mastitis-risk-value {

            font-size: 30px;

            font-weight: 800;

            color:
                #0f172a;

        }


        .mastitis-modal-section {

            margin-top: 26px;

        }


        .mastitis-section-title {

            font-size: 14px;

            font-weight: 750;

            text-transform: uppercase;

            letter-spacing:
                0.06em;

            color:
                #475569;

            margin-bottom: 12px;

        }


        .mastitis-data-grid {

            display: grid;

            grid-template-columns:
                repeat(2, 1fr);

            gap: 10px;

        }


        .mastitis-data-item {

            display: flex;

            align-items: center;

            justify-content: space-between;

            gap: 20px;

            padding: 14px 16px;

            border:
                1px solid #e2e8f0;

            border-radius: 12px;

        }


        .mastitis-data-item span {

            color:
                #64748b;

            font-size: 13px;

        }


        .mastitis-data-item strong {

            color:
                #0f172a;

            font-size: 14px;

        }


        .mastitis-ai-box {

            display: grid;

            grid-template-columns:
                repeat(3, 1fr);

            gap: 10px;

        }


        .mastitis-ai-box > div {

            padding: 16px;

            border-radius: 12px;

            background:
                #f8fafc;

            border:
                1px solid #e2e8f0;

        }


        .mastitis-ai-box span {

            display: block;

            color:
                #64748b;

            font-size: 12px;

            margin-bottom: 7px;

        }


        .mastitis-ai-box strong {

            color:
                #0f172a;

            font-size: 14px;

        }


        @media (max-width: 650px) {

            .mastitis-modal {

                padding: 24px;

                border-radius: 18px;

            }


            .mastitis-data-grid {

                grid-template-columns: 1fr;

            }


            .mastitis-ai-box {

                grid-template-columns: 1fr;

            }


            .mastitis-modal-status {

                align-items: flex-start;

                flex-direction: column;

            }

        }

    `;


    document.head.appendChild(
        style
    );

}


// ============================================================
// SEARCH + FILTER
// ============================================================

function applyCowFilters() {

    const searchInput =
        document.getElementById(
            "cowSearch"
        );


    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toUpperCase()
            : "";


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "all";


    const rows =
        document.querySelectorAll(
            "#cowTableBody tr"
        );


    rows.forEach(function (row) {

        const cowId =
            String(
                row.dataset.cowId || ""
            ).toUpperCase();


        const status =
            row.dataset.status || "";


        const matchesSearch =
            cowId.includes(search);


        const matchesStatus =
            selectedStatus === "all" ||
            selectedStatus === "" ||
            status === selectedStatus;


        if (
            matchesSearch &&
            matchesStatus
        ) {

            row.style.display = "";

        }

        else {

            row.style.display = "none";

        }

    });

}


// ============================================================
// SEARCH COWS
// ============================================================

function searchCows() {

    applyCowFilters();

}


// ============================================================
// FILTER COWS
// ============================================================

function filterCows() {

    applyCowFilters();

}


// ============================================================
// FORMATTING HELPERS
// ============================================================

function formatNumber(
    value,
    decimals
) {

    const number =
        Number(value);


    if (!Number.isFinite(number)) {

        return "—";

    }


    return number.toFixed(
        decimals
    );

}


function formatInteger(value) {

    const number =
        Number(value);


    if (!Number.isFinite(number)) {

        return "—";

    }


    return Math.round(
        number
    ).toLocaleString();

}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ============================================================
// INITIALIZE PAGE
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Cows page loaded"
        );


        // ----------------------------------------------------
        // Load cows
        // ----------------------------------------------------

        loadCows();


        // ----------------------------------------------------
        // Search
        // ----------------------------------------------------

        const searchInput =
            document.getElementById(
                "cowSearch"
            );


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                searchCows
            );

        }


        // ----------------------------------------------------
        // Status filter
        // ----------------------------------------------------

        const statusFilter =
            document.getElementById(
                "statusFilter"
            );


        if (statusFilter) {

            statusFilter.addEventListener(
                "change",
                filterCows
            );

        }

    }
);