const API_URL =
    "https://mastitis-ai-api.onrender.com";


const $ = (id) =>
    document.getElementById(id);



function setSystemStatus(online, text) {

    $("systemStatus").textContent = text;

    $("systemStatusLarge").textContent =
        online
            ? "AI Engine Online"
            : "AI Engine Offline";


    $("statusDot")
        .classList
        .toggle("online", online);

}



function escapeHTML(value) {

    return String(value ?? "")

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}



function statusClass(status) {

    if (status === "Mastitis Risk") {

        return "status-risk";

    }


    if (status === "Monitoring") {

        return "status-monitoring";

    }


    return "status-healthy";

}



async function loadDashboard() {


    setSystemStatus(
        false,
        "Connecting to AI..."
    );


    $("tableContainer").innerHTML = `

        <div class="loading-state">

            <div class="spinner"></div>

            <span>
                Loading herd records...
            </span>

        </div>

    `;


    try {


        const response =
            await fetch(
                `${API_URL}/cows`,
                {
                    method: "GET",

                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                `API returned ${response.status}`
            );

        }


        const data =
            await response.json();


        const cows =
            Array.isArray(data.cows)
                ? data.cows
                : [];



        let healthy = 0;

        let monitoring = 0;

        let risk = 0;



        cows.forEach(cow => {


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

        });



        const total =
            cows.length;



        const riskPercentage =
            total
                ? ((risk / total) * 100)
                    .toFixed(1)
                : "0.0";



        // STAT CARDS

        $("totalCows")
            .textContent = total;


        $("healthyCows")
            .textContent = healthy;


        $("monitoringCows")
            .textContent = monitoring;


        $("riskCows")
            .textContent = risk;



        // RISK PANEL

        $("healthyCount")
            .textContent = healthy;


        $("monitoringCount")
            .textContent = monitoring;


        $("highRiskCount")
            .textContent = risk;


        $("riskPercent")
            .textContent =
            `${riskPercentage}%`;


        $("riskCircle")
            .style
            .setProperty(
                "--risk",
                `${riskPercentage}%`
            );



        // SYSTEM

        setSystemStatus(
            true,
            "AI Engine Online"
        );



        // TABLE

        renderRecentCows(cows);


    }


    catch (error) {


        console.error(
            "Dashboard API error:",
            error
        );


        setSystemStatus(
            false,
            "API Offline"
        );


        $("tableContainer").innerHTML = `

            <div class="error-state">

                <strong>
                    Unable to connect
                    to the Mastitis AI API.
                </strong>

                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>


                <button
                    id="retryBtn"
                    class="secondary-button"
                    type="button">

                    Try again

                </button>

            </div>

        `;


        $("retryBtn")
            .addEventListener(
                "click",
                loadDashboard
            );

    }

}



function renderRecentCows(cows) {


    if (!cows.length) {


        $("tableContainer").innerHTML = `

            <div class="empty-state">

                No cow records available.

            </div>

        `;


        return;

    }



    // First 10 records

    const recent =
        cows.slice(0, 10);



    const rows =
        recent.map(cow => `

            <tr>

                <td>

                    <strong>
                        ${escapeHTML(
                            cow.cow_id
                        )}
                    </strong>

                </td>


                <td>

                    ${Number(
                        cow.milk_temperature
                    ).toFixed(2)}

                </td>


                <td>

                    ${Number(
                        cow.milk_ph
                    ).toFixed(2)}

                </td>


                <td>

                    ${Number(
                        cow.milk_conductivity
                    ).toFixed(2)}

                </td>


                <td>

                    ${Number(
                        cow.milk_yield
                    ).toFixed(2)}

                </td>


                <td>

                    ${Number(
                        cow.risk
                    ).toFixed(1)}%

                </td>


                <td>

                    <span
                        class="status
                        ${statusClass(
                            cow.status
                        )}">

                        ${escapeHTML(
                            cow.status
                        )}

                    </span>

                </td>

            </tr>

        `).join("");



    $("tableContainer").innerHTML = `

        <div class="table-wrap">

            <table>

                <thead>

                    <tr>

                        <th>
                            COW ID
                        </th>

                        <th>
                            TEMP °C
                        </th>

                        <th>
                            pH
                        </th>

                        <th>
                            CONDUCTIVITY
                        </th>

                        <th>
                            YIELD L
                        </th>

                        <th>
                            AI RISK
                        </th>

                        <th>
                            STATUS
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${rows}

                </tbody>

            </table>

        </div>

    `;

}



document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadDashboard();


        $("refreshBtn")
            .addEventListener(
                "click",
                loadDashboard
            );

    }
);