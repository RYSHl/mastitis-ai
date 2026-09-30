const API_URL =
    "https://mastitis-ai-api.onrender.com";

const STORE =
    "dugdha_kavach_state_v2";


const defaultState = {

    user: {
        name: "",
        mobile: "",
        role: "Farmer",
        language: "English"
    },

    farm: {
        name: "My Dairy Farm",
        location: "",
        type: "Dairy cattle"
    },

    animals: [

        {
            id: "DK-001",
            name: "Gauri",
            breed: "Gir",
            age: "3 years",
            milk: 8.4,
            temperature: 38.4,
            ph: 6.68,
            conductivity: "Normal",
            status: "Normal",
            risk: "Low"
        },

        {
            id: "DK-002",
            name: "Kamdhenu",
            breed: "Sahiwal",
            age: "4 years",
            milk: 7.8,
            temperature: 38.2,
            ph: 6.71,
            conductivity: "Normal",
            status: "Normal",
            risk: "Low"
        },

        {
            id: "DK-014",
            name: "Laxmi",
            breed: "HF",
            age: "5 years",
            milk: 5.9,
            temperature: 38.7,
            ph: 6.61,
            conductivity: "High",
            status: "Monitor",
            risk: "Monitor"
        },

        {
            id: "DK-027",
            name: "Radha",
            breed: "Jersey",
            age: "4 years",
            milk: 6.3,
            temperature: 39.1,
            ph: 6.55,
            conductivity: "High",
            status: "Attention",
            risk: "Attention"
        }

    ],

    alerts: [],

    history: []

};


let state =
    JSON.parse(
        localStorage.getItem(STORE)
    ) || defaultState;


function saveState() {

    localStorage.setItem(
        STORE,
        JSON.stringify(state)
    );

}


function toast(message) {

    const root =
        document.getElementById("toast-root");

    if (!root) return;

    root.innerHTML =
        `<div class="toast">${message}</div>`;

    setTimeout(() => {

        root.innerHTML = "";

    }, 2500);

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

    if (status === "Attention")
        return "badge-attention";

    if (status === "Monitor")
        return "badge-monitor";

    return "badge-normal";

}


function render() {

    const app =
        document.getElementById("app");

    const page =
        location.hash.replace("#/", "") ||
        "home";


    if (page === "splash") {

        renderSplash(app);
        return;

    }


    if (page === "home") {

        renderHome(app);
        return;

    }


    if (page === "animals") {

        renderAnimals(app);
        return;

    }


    if (page === "add-animal") {

        renderAddAnimal(app);
        return;

    }


    if (page === "health") {

        renderHealth(app);
        return;

    }


    if (page === "alerts") {

        renderAlerts(app);
        return;

    }


    if (page === "settings") {

        renderSettings(app);
        return;

    }


    if (page === "screening") {

        renderScreening(app);
        return;

    }


    if (page === "camera") {

        renderCamera(app);
        return;

    }


    if (page === "history") {

        renderHistory(app);
        return;

    }


    if (page === "analytics") {

        renderAnalytics(app);
        return;

    }


    renderHome(app);

}


function shell(content, active = "home") {

    return `

        <div class="app-shell">

            <div class="phone">

                <div class="statusbar">

                    <span>Dugdha Kavach</span>

                    <div class="right">
                        <span>●</span>
                        <span>AI</span>
                    </div>

                </div>

                <main class="screen">

                    ${content}

                </main>

                ${bottomNav(active)}

            </div>

        </div>

    `;

}


function bottomNav(active) {

    return `

        <nav class="bottom-nav">

            <button
                class="${active === "home" ? "active" : ""}"
                onclick="go('home')"
            >
                <span class="bottom-icon">⌂</span>
                Home
            </button>

            <button
                class="${active === "animals" ? "active" : ""}"
                onclick="go('animals')"
            >
                <span class="bottom-icon">🐄</span>
                Herd
            </button>

            <button
                class="${active === "health" ? "active" : ""}"
                onclick="go('health')"
            >
                <span class="bottom-icon">♥</span>
                Health
            </button>

            <button
                class="${active === "camera" ? "active" : ""}"
                onclick="go('camera')"
            >
                <span class="bottom-icon">📷</span>
                Camera
            </button>

            <button
                class="${active === "history" ? "active" : ""}"
                onclick="go('history')"
            >
                <span class="bottom-icon">🕘</span>
                History
            </button>

            <button
                class="${active === "analytics" ? "active" : ""}"
                onclick="go('analytics')"
            >
                <span class="bottom-icon">📊</span>
                Analytics
            </button>

            <button
                class="${active === "settings" ? "active" : ""}"
                onclick="go('settings')"
            >
                <span class="bottom-icon">⚙</span>
                Settings
            </button>

        </nav>

    `;

}


function go(page) {

    location.hash =
        "#/" + page;

}


function renderSplash(app) {

    app.innerHTML = `

        <div class="app-shell">

            <div class="phone">

                <section class="splash">

                    <div class="splash-logo">
                        🐄
                    </div>

                    <h1>
                        Dugdha Kavach
                    </h1>

                    <p>
                        Intelligent dairy health
                        protection with AI-assisted
                        mastitis screening.
                    </p>

                    <button
                        class="btn btn-primary"
                        onclick="go('home')"
                    >
                        Get Started →
                    </button>

                </section>

            </div>

        </div>

    `;

}


function renderHome(app) {

    const total =
        state.animals.length;

    const healthy =
        state.animals.filter(
            x => x.status === "Normal"
        ).length;

    const monitor =
        state.animals.filter(
            x => x.status === "Monitor"
        ).length;

    const attention =
        state.animals.filter(
            x => x.status === "Attention"
        ).length;


    const risk =
        total
            ? Math.round(
                (attention / total) * 100
            )
            : 0;


    app.innerHTML =
        shell(`

            <div class="topline">

                <div class="brand-mark">

                    <div class="mark">
                        🐄
                    </div>

                    <div class="wordmark">
                        DUGDHA
                        <small>KAVACH</small>
                    </div>

                </div>

                <button
                    class="back"
                    onclick="go('alerts')"
                >
                    🔔
                </button>

            </div>


            <div class="hero">

                <div class="kicker">
                    HERD INTELLIGENCE
                </div>

                <h1>
                    Good morning.
                </h1>

                <p>
                    Here's your herd health
                    overview.
                </p>

            </div>


            <div class="stats">

                <div class="stat">

                    <small>
                        Total Animals
                    </small>

                    <strong>
                        ${total}
                    </strong>

                </div>


                <div class="stat green">

                    <small>
                        Healthy
                    </small>

                    <strong>
                        ${healthy}
                    </strong>

                </div>


                <div class="stat yellow">

                    <small>
                        Monitoring
                    </small>

                    <strong>
                        ${monitor}
                    </strong>

                </div>


                <div class="stat red">

                    <small>
                        Attention
                    </small>

                    <strong>
                        ${attention}
                    </strong>

                </div>

            </div>


            <section class="section">

                <div class="section-heading">

                    <h2>
                        Herd health
                    </h2>

                    <button
                        onclick="go('health')"
                    >
                        View report
                    </button>

                </div>


                <div class="card risk-card">

                    <div class="kicker">
                        CURRENT RISK
                    </div>

                    <div class="risk-number">
                        ${risk}%
                    </div>

                    <p class="subtitle">
                        Animals currently requiring
                        additional attention.
                    </p>

                    <div class="progress">

                        <span
                            style="width:${risk}%"
                        ></span>

                    </div>

                </div>

            </section>


            <section class="section">

                <div class="section-heading">

                    <h2>
                        Recent animals
                    </h2>

                    <button
                        onclick="go('animals')"
                    >
                        View all
                    </button>

                </div>


                <div class="stack">

                    ${state.animals
                        .slice(0, 4)
                        .map(animalCard)
                        .join("")}

                </div>

            </section>


            <section class="section">

                <div class="card pad camera-launch-card">

                    <div class="kicker">
                        CAMERA TOOLS
                    </div>

                    <h2>
                        Identify a cow or record milking
                    </h2>

                    <p class="subtitle">
                        Scan a visual ear-tag barcode/QR code to open the cow, or record a milking session for review.
                    </p>

                    <br>

                    <button
                        class="btn btn-primary"
                        onclick="go('camera')"
                    >
                        Open Camera
                    </button>

                </div>

            </section>


            <section class="section">

                <div class="card pad">

                    <div class="kicker">
                        AI ENGINE
                    </div>

                    <h2>
                        AI screening ready
                    </h2>

                    <p class="subtitle">
                        Use your trained mastitis
                        model for individual animal
                        screening.
                    </p>

                    <br>

                    <button
                        class="btn btn-primary"
                        onclick="go('screening')"
                    >
                        Start AI Screening
                    </button>

                </div>

            </section>

        `, "home");

}


function animalCard(animal) {

    return `

        <div
            class="animal"
            onclick="openAnimal('${animal.id}')"
        >

            <div class="animal-left">

                <div class="animal-avatar">
                    🐄
                </div>

                <div>

                    <div class="animal-name">
                        ${escapeHTML(animal.name)}
                    </div>

                    <div class="animal-meta">
                        ${escapeHTML(animal.id)}
                        ·
                        ${escapeHTML(animal.breed)}
                    </div>

                </div>

            </div>


            <span
                class="badge ${statusClass(animal.status)}"
            >
                ${animal.status}
            </span>

        </div>

    `;

}


function renderAnimals(app) {

    app.innerHTML =
        shell(`

            <div class="topline">

                <div>

                    <div class="kicker">
                        HERD
                    </div>

                    <h1 class="title">
                        My Animals
                    </h1>

                </div>

                <button
                    class="back"
                    onclick="go('add-animal')"
                >
                    +
                </button>

            </div>


            <div class="section">

                <div class="field">

                    <label>
                        Search animal
                    </label>

                    <input
                        id="animalSearch"
                        placeholder="Name or ID"
                        oninput="filterAnimals()"
                    >

                </div>

            </div>


            <div
                id="animalList"
                class="stack"
            >

                ${state.animals
                    .map(animalCard)
                    .join("")}

            </div>

        `, "animals");

}


function filterAnimals() {

    const input =
        document.getElementById(
            "animalSearch"
        );

    if (!input) return;


    const query =
        input.value.toLowerCase();


    const list =
        document.getElementById(
            "animalList"
        );


    list.innerHTML =
        state.animals
            .filter(a =>
                a.name
                    .toLowerCase()
                    .includes(query)
                ||
                a.id
                    .toLowerCase()
                    .includes(query)
            )
            .map(animalCard)
            .join("");

}


function renderAddAnimal(app) {

    app.innerHTML =
        shell(`

            <div class="topline">

                <div>

                    <div class="kicker">
                        HERD MANAGEMENT
                    </div>

                    <h1 class="title">
                        Add animal
                    </h1>

                </div>

                <button
                    class="back"
                    onclick="go('animals')"
                >
                    ←
                </button>

            </div>


            <form
                class="stack"
                onsubmit="saveAnimal(event)"
            >

                <div class="card pad stack">

                    <div class="field">

                        <label>
                            Animal ID
                        </label>

                        <input
                            id="newId"
                            required
                            placeholder="DK-005"
                        >

                    </div>


                    <div class="field">

                        <label>
                            Ear tag / scan ID
                        </label>

                        <input
                            id="newTagId"
                            placeholder="DK-005 or printed tag code"
                        >

                    </div>


                    <div class="field">

                        <label>
                            Animal name
                        </label>

                        <input
                            id="newName"
                            required
                            placeholder="Gauri"
                        >

                    </div>


                    <div class="field">

                        <label>
                            Breed
                        </label>

                        <input
                            id="newBreed"
                            placeholder="Gir"
                        >

                    </div>


                    <div class="field">

                        <label>
                            Age
                        </label>

                        <input
                            id="newAge"
                            placeholder="3 years"
                        >

                    </div>

                </div>


                <button
                    class="btn btn-primary"
                    type="submit"
                >
                    Save Animal
                </button>

            </form>

        `, "animals");

}


function saveAnimal(event) {

    event.preventDefault();


    const animal = {

        id:
            document.getElementById(
                "newId"
            ).value.trim(),

        tagId:
            document.getElementById(
                "newTagId"
            )?.value.trim() || "",

        name:
            document.getElementById(
                "newName"
            ).value.trim(),

        breed:
            document.getElementById(
                "newBreed"
            ).value.trim()
            || "Unknown",

        age:
            document.getElementById(
                "newAge"
            ).value.trim()
            || "Not recorded",

        milk: 0,

        temperature: 0,

        ph: 0,

        conductivity: "Not measured",

        status: "Normal",

        risk: "Low"

    };


    state.animals.push(animal);

    saveState();

    toast("Animal added successfully");

    setTimeout(
        () => go("animals"),
        500
    );

}


function openAnimal(id) {

    selectedAnimal = state.animals.find(
        a => a.id === id
    );


    if (!selectedAnimal) return;


    location.hash =
        "#/animal/" + id;

    renderAnimalDetails();

}


let selectedAnimal = null;

let cameraStream = null;
let cameraMode = null;
let scanTimer = null;
let mediaRecorder = null;
let recordingChunks = [];
let recordingStartedAt = null;
let lastMilkingRecording = null;



function renderAnimalDetails() {

    const app =
        document.getElementById("app");


    if (!selectedAnimal) {

        go("animals");

        return;

    }


    app.innerHTML =
        shell(`

            <div class="topline">

                <div>

                    <div class="kicker">
                        ANIMAL PROFILE
                    </div>

                    <h1 class="title">
                        ${escapeHTML(
                            selectedAnimal.name
                        )}
                    </h1>

                </div>

                <button
                    class="back"
                    onclick="go('animals')"
                >
                    ←
                </button>

            </div>


            <div class="card pad section">

                <div class="animal">

                    <div class="animal-left">

                        <div class="animal-avatar">
                            🐄
                        </div>

                        <div>

                            <div class="animal-name">
                                ${escapeHTML(
                                    selectedAnimal.name
                                )}
                            </div>

                            <div class="animal-meta">
                                ${selectedAnimal.id}
                                ·
                                ${selectedAnimal.breed}
                            </div>

                        </div>

                    </div>


                    <span
                        class="badge ${statusClass(
                            selectedAnimal.status
                        )}"
                    >
                        ${selectedAnimal.status}
                    </span>

                </div>

            </div>


            <div class="card pad section">

                <div class="kicker">
                    HEALTH DATA
                </div>

                <div class="metric-grid">

                    <div class="metric">
                        <small>
                            Milk
                        </small>
                        <strong>
                            ${selectedAnimal.milk} L
                        </strong>
                    </div>

                    <div class="metric">
                        <small>
                            Temperature
                        </small>
                        <strong>
                            ${selectedAnimal.temperature}
                        </strong>
                    </div>

                    <div class="metric">
                        <small>
                            Milk pH
                        </small>
                        <strong>
                            ${selectedAnimal.ph}
                        </strong>
                    </div>

                    <div class="metric">
                        <small>
                            Conductivity
                        </small>
                        <strong>
                            ${selectedAnimal.conductivity}
                        </strong>
                    </div>

                    <div class="metric">
                        <small>
                            Somatic cell count
                        </small>
                        <strong>
                            ${selectedAnimal.somatic_cell_count ?? "—"}
                        </strong>
                    </div>

                    <div class="metric">
                        <small>
                            Clotting
                        </small>
                        <strong>
                            ${selectedAnimal.clotting ? "Detected" : "Not detected"}
                        </strong>
                    </div>

                </div>

            </div>


            <button
                class="btn btn-primary"
                onclick="go('screening')"
            >
                Run AI Screening
            </button>

            <button
                class="btn btn-secondary section-small"
                onclick="go('camera')"
            >
                📷 Scan / Record for this cow
            </button>

        `, "animals");

}


function renderHealth(app) {

    const total =
        state.animals.length;

    const normal =
        state.animals.filter(
            a => a.status === "Normal"
        ).length;

    const monitor =
        state.animals.filter(
            a => a.status === "Monitor"
        ).length;

    const attention =
        state.animals.filter(
            a => a.status === "Attention"
        ).length;


    app.innerHTML =
        shell(`

            <div class="topline">

                <div>

                    <div class="kicker">
                        HEALTH
                    </div>

                    <h1 class="title">
                        Herd Health
                    </h1>

                </div>

            </div>


            <div class="stats">

                <div class="stat green">

                    <small>
                        Normal
                    </small>

                    <strong>
                        ${normal}
                    </strong>

                </div>


                <div class="stat yellow">

                    <small>
                        Monitor
                    </small>

                    <strong>
                        ${monitor}
                    </strong>

                </div>


                <div class="stat red">

                    <small>
                        Attention
                    </small>

                    <strong>
                        ${attention}
                    </strong>

                </div>


                <div class="stat">

                    <small>
                        Total
                    </small>

                    <strong>
                        ${total}
                    </strong>

                </div>

            </div>


            <div class="card pad">

                <div class="kicker">
                    AI INTERPRETATION
                </div>

                <h2>
                    Current herd picture
                </h2>

                <p class="subtitle">
                    Health status is based on the
                    animal records currently stored
                    in Dugdha Kavach.
                </p>

            </div>

        `, "health");

}


function renderAlerts(app) {

    const animalAlerts = state.animals.filter(
        a => a.status === "Attention" || a.status === "Monitor"
    );

    const savedAlerts = (state.alerts || []).slice(0, 20);
    const alerts = animalAlerts.map(a => ({
        type: a.status === "Attention" ? "attention" : "monitor",
        name: a.name,
        message: a.status === "Attention"
            ? "Animal requires additional observation and veterinary assessment if indicated."
            : "Animal should be monitored during the next milking."
    }));

    savedAlerts.forEach(a => alerts.unshift({
        type: "attention",
        name: a.cowId,
        message: a.message
    }));


    app.innerHTML =
        shell(`

            <div class="topline">

                <div>

                    <div class="kicker">
                        ALERTS
                    </div>

                    <h1 class="title">
                        Health Alerts
                    </h1>

                </div>

            </div>


            <div class="stack">

                ${
                    alerts.length

                    ?

                    alerts.map(a => `

                        <div
                            class="alert ${
                                a.status === "Attention"
                                    ? "attention"
                                    : "monitor"
                            }"
                        >

                            <div>

                                <strong>
                                    ${escapeHTML(a.name)}
                                </strong>

                                <p>
                                    ${escapeHTML(a.message)}
                                </p>

                            </div>

                        </div>

                    `).join("")

                    :

                    `

                        <div class="card empty">

                            <div class="empty-icon">
                                ✓
                            </div>

                            No active alerts.

                        </div>

                    `
                }

            </div>

        `, "home");

}


function renderScreening(app) {

    const animal = selectedAnimal || state.animals[0] || null;

    app.innerHTML =
        shell(`

            <div class="topline">

                <div>

                    <div class="kicker">AI ENGINE</div>

                    <h1 class="title">AI Screening</h1>

                    <p class="subtitle">
                        Screen the selected animal using milk measurements.
                    </p>

                </div>

                <button class="back" onclick="go('camera')">📷</button>

            </div>

            <div class="card pad section">

                <div class="kicker">SELECTED ANIMAL</div>

                <h2>${animal ? escapeHTML(animal.name) : "No animal selected"}</h2>

                <p class="subtitle">
                    ${animal ? `${escapeHTML(animal.id)} · ${escapeHTML(animal.breed || "Unknown")}` : "Open Camera or Herd to select an animal."}
                </p>

            </div>

            <form class="stack" onsubmit="runPrediction(event)">

                <div class="card pad stack">

                    <div class="field">
                        <label>Milk temperature °C</label>
                        <input id="predTemp" type="number" step="0.01" value="${animal?.temperature || 38.4}" required>
                    </div>

                    <div class="field">
                        <label>Milk pH</label>
                        <input id="predPH" type="number" step="0.01" value="${animal?.ph || 6.68}" required>
                    </div>

                    <div class="field">
                        <label>Milk conductivity</label>
                        <input id="predConductivity" type="number" step="0.01" value="5.1" required>
                    </div>

                    <div class="field">
                        <label>Milk yield L</label>
                        <input id="predYield" type="number" step="0.01" value="${animal?.milk || 8}" required>
                    </div>

                    <div class="field">
                        <label>Somatic cell count</label>
                        <input id="predSCC" type="number" step="1" value="200" required>
                    </div>

                    <div class="field">
                        <label>Clotting</label>
                        <select id="predClotting" required>
                            <option value="0">No clotting</option>
                            <option value="1">Clotting detected</option>
                        </select>
                    </div>

                </div>

                <button class="btn btn-primary" type="submit">
                    Run AI Screening
                </button>

            </form>

            <div id="predictionResult" class="section"></div>

        `, "health");

}


async function runPrediction(event) {

    event.preventDefault();

    const result = document.getElementById("predictionResult");
    const animal = selectedAnimal || state.animals[0] || null;

    result.innerHTML = `
        <div class="card pad">
            <div class="kicker">ANALYSING</div>
            <h2>Connecting to AI engine...</h2>
            <p class="subtitle">Sending six model features to FastAPI.</p>
        </div>
    `;

    const payload = {
        cow_id: animal?.id || "MANUAL",
        milk_temperature: Number(document.getElementById("predTemp").value),
        milk_ph: Number(document.getElementById("predPH").value),
        milk_conductivity: Number(document.getElementById("predConductivity").value),
        milk_yield: Number(document.getElementById("predYield").value),
        somatic_cell_count: Number(document.getElementById("predSCC").value),
        clotting: Number(document.getElementById("predClotting").value),
        timestamp: new Date().toISOString()
    };

    try {

        const response = await fetch(`${API_URL}/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();
        const risk = Number(data.probability_percent ?? data.probability ?? 0);
        const isRisk = Number(data.prediction ?? 0) === 1 || risk >= 50;
        const status = isRisk ? "Attention" : "Normal";

        if (animal) {
            animal.temperature = payload.milk_temperature;
            animal.ph = payload.milk_ph;
            animal.milk = payload.milk_yield;
            animal.somatic_cell_count = payload.somatic_cell_count;
            animal.clotting = payload.clotting;
            animal.risk = isRisk ? "Attention" : "Low";
            animal.status = status;
            animal.lastScreened = payload.timestamp;

            if (isRisk) {
                state.alerts.unshift({
                    id: `AL-${Date.now()}`,
                    cowId: animal.id,
                    message: "AI screening detected elevated mastitis risk.",
                    risk,
                    timestamp: payload.timestamp
                });
            }
        }

        state.history.unshift({
            id: `SC-${Date.now()}`,
            cowId: animal?.id || payload.cow_id,
            timestamp: payload.timestamp,
            prediction: Number(data.prediction ?? 0),
            predictionClass: data.prediction_class ?? null,
            risk,
            measurements: payload
        });

        state.history = state.history.slice(0, 100);
        saveState();

        result.innerHTML = `
            <div class="card pad">
                <div class="kicker">AI RESULT</div>
                <h2>${isRisk ? "Mastitis risk detected" : "No high-risk signal detected"}</h2>
                <div class="metric-grid section-small">
                    <div class="metric">
                        <small>Risk</small>
                        <strong>${risk.toFixed(1)}%</strong>
                    </div>
                    <div class="metric">
                        <small>Status</small>
                        <strong>${status}</strong>
                    </div>
                </div>
                <div class="alert ${isRisk ? "attention" : "normal"}">
                    <div>
                        <strong>AI screening result</strong>
                        <p>
                            This is an AI-assisted screening result, not a confirmed veterinary diagnosis.
                            Veterinary assessment is recommended for elevated-risk animals.
                        </p>
                    </div>
                </div>
            </div>
        `;

        toast("AI screening saved");

    } catch (error) {

        result.innerHTML = `
            <div class="alert attention">
                <div>
                    <strong>AI API unavailable</strong>
                    <p>${escapeHTML(error.message)}</p>
                </div>
            </div>
        `;

    }

}



function renderCamera(app) {

    stopCamera();

    app.innerHTML = shell(`

        <div class="topline">
            <div>
                <div class="kicker">CAMERA CENTER</div>
                <h1 class="title">Camera</h1>
                <p class="subtitle">Identify a cow by visual ear tag or record the milking session.</p>
            </div>
            <button class="back" onclick="go('home')">←</button>
        </div>

        <div class="camera-box camera-workspace">
            <video id="cameraVideo" autoplay playsinline muted></video>
            <div id="cameraPlaceholder" class="camera-placeholder">
                <div class="camera-icon">📷</div>
                <strong>Camera is off</strong>
                <span>Choose a camera action below.</span>
            </div>
        </div>

        <div class="camera-controls section">
            <button class="btn btn-primary" onclick="startEarTagScan()">📷 Scan Ear Tag</button>
            <button class="btn btn-secondary" onclick="startMilkingRecording()">🎥 Record Milking</button>
        </div>

        <div class="card pad section">
            <div class="kicker">IDENTIFIED COW</div>
            <div id="cameraCowResult">
                <p class="subtitle">No cow selected.</p>
            </div>
        </div>

        <div id="recordingPanel" class="card pad section hidden">
            <div class="kicker">MILKING SESSION</div>
            <h2 id="recordingStatus">Ready to record</h2>
            <p id="recordingTimer" class="subtitle">00:00</p>
            <div class="recording-actions">
                <button class="btn btn-primary" onclick="toggleMilkingRecording()" id="recordButton">Start recording</button>
                <button class="btn btn-secondary" onclick="stopMilkingRecording()">Stop</button>
            </div>
            <div id="recordingResult" class="section-small"></div>
        </div>

        <div class="card pad section">
            <div class="kicker">EAR TAG SCANNING</div>
            <p class="subtitle">
                Camera scanning supports visual barcode/QR ear tags. If your tag only has printed numbers, use the manual ID field below.
            </p>
            <div class="field section-small">
                <label>Enter ear tag / cow ID manually</label>
                <input id="manualCowId" placeholder="DK-001">
            </div>
            <button class="btn btn-secondary" onclick="selectCowFromManualTag()">Open Cow</button>
        </div>

    `, "camera");

}


async function openCamera(mode) {

    cameraMode = mode;

    const video = document.getElementById("cameraVideo");
    const placeholder = document.getElementById("cameraPlaceholder");

    if (!video) return false;

    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: "environment" } },
            audio: mode === "record"
        });

        video.srcObject = cameraStream;
        placeholder?.classList.add("hidden");
        return true;

    } catch (error) {
        toast("Camera permission is required");
        const result = document.getElementById("cameraCowResult");
        if (result) {
            result.innerHTML = `<div class="alert attention"><div><strong>Camera unavailable</strong><p>${escapeHTML(error.message)}</p></div></div>`;
        }
        return false;
    }

}


async function startEarTagScan() {

    const ok = await openCamera("scan");
    if (!ok) return;

    const result = document.getElementById("cameraCowResult");
    result.innerHTML = `
        <div class="alert monitor">
            <div>
                <strong>Scanning for ear tag...</strong>
                <p>Point the camera at a visible barcode or QR code on the ear tag.</p>
            </div>
        </div>
    `;

    if (!("BarcodeDetector" in window)) {
        result.innerHTML = `
            <div class="alert monitor">
                <div>
                    <strong>Automatic barcode scanning is not supported in this browser.</strong>
                    <p>Use the manual ear-tag ID field below, or open this app in a browser with BarcodeDetector support.</p>
                </div>
            </div>
        `;
        return;
    }

    try {
        const detector = new BarcodeDetector({
            formats: ["qr_code", "code_128", "code_39", "ean_13", "ean_8", "upc_a", "upc_e"]
        });

        clearInterval(scanTimer);
        scanTimer = setInterval(async () => {
            const video = document.getElementById("cameraVideo");
            if (!video || video.readyState < 2 || !cameraStream) return;

            try {
                const codes = await detector.detect(video);
                if (!codes.length) return;

                const raw = String(codes[0].rawValue || "").trim();
                if (!raw) return;

                clearInterval(scanTimer);
                scanTimer = null;
                identifyCowByTag(raw);

            } catch (_) {
                // Keep scanning; a single failed frame should not stop the camera.
            }
        }, 350);

    } catch (error) {
        result.innerHTML = `<div class="alert attention"><div><strong>Scanner could not start</strong><p>${escapeHTML(error.message)}</p></div></div>`;
    }

}


function identifyCowByTag(tagValue) {

    const normalized = tagValue.toLowerCase().replace(/\s+/g, "");

    const animal = state.animals.find(a =>
        String(a.id).toLowerCase().replace(/\s+/g, "") === normalized
        || String(a.tagId || "").toLowerCase().replace(/\s+/g, "") === normalized
    );

    const result = document.getElementById("cameraCowResult");

    if (!animal) {
        result.innerHTML = `
            <div class="alert attention">
                <div>
                    <strong>Ear tag scanned: ${escapeHTML(tagValue)}</strong>
                    <p>No matching cow is registered yet. Add this animal to the herd or use the manual ID field.</p>
                </div>
            </div>
        `;
        return;
    }

    selectedAnimal = animal;

    result.innerHTML = `
        <div class="animal">
            <div class="animal-left">
                <div class="animal-avatar">🐄</div>
                <div>
                    <div class="animal-name">${escapeHTML(animal.name)}</div>
                    <div class="animal-meta">${escapeHTML(animal.id)} · ${escapeHTML(animal.breed || "Unknown")}</div>
                </div>
            </div>
            <span class="badge ${statusClass(animal.status)}">${escapeHTML(animal.status)}</span>
        </div>
        <br>
        <button class="btn btn-primary" onclick="go('screening')">Screen This Cow</button>
    `;

    toast(`${animal.name} identified`);
    stopCamera();

}


function selectCowFromManualTag() {

    const input = document.getElementById("manualCowId");
    const value = input?.value.trim();
    if (!value) return toast("Enter a cow ID");
    identifyCowByTag(value);

}


async function startMilkingRecording() {

    const ok = await openCamera("record");
    if (!ok) return;

    const panel = document.getElementById("recordingPanel");
    panel?.classList.remove("hidden");

    document.getElementById("recordingStatus").textContent = "Ready to record";
    document.getElementById("recordingResult").innerHTML = "";

}


function toggleMilkingRecording() {

    if (mediaRecorder && mediaRecorder.state === "recording") {
        stopMilkingRecording();
        return;
    }

    if (!cameraStream) {
        toast("Open the camera first");
        return;
    }

    const supported = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
        ? "video/webm;codecs=vp9,opus"
        : "video/webm";

    recordingChunks = [];
    mediaRecorder = new MediaRecorder(cameraStream, { mimeType: supported });
    recordingStartedAt = Date.now();

    mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) recordingChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordingChunks, { type: supported });
        lastMilkingRecording = {
            blob,
            url: URL.createObjectURL(blob),
            timestamp: new Date().toISOString(),
            cowId: selectedAnimal?.id || null,
            cowName: selectedAnimal?.name || "Unassigned"
        };

        const result = document.getElementById("recordingResult");
        if (result) {
            result.innerHTML = `
                <div class="alert normal">
                    <div>
                        <strong>Milking session recorded</strong>
                        <p>${escapeHTML(lastMilkingRecording.cowName)} · ${new Date(lastMilkingRecording.timestamp).toLocaleString()}</p>
                        <a class="btn btn-secondary recording-download" href="${lastMilkingRecording.url}" download="dugdha-kavach-milking-${lastMilkingRecording.cowId || "session"}.webm">Save video</a>
                    </div>
                </div>
            `;
        }

        toast("Milking session recorded");
    };

    mediaRecorder.start(250);

    document.getElementById("recordingStatus").textContent = "Recording milking session";
    document.getElementById("recordButton").textContent = "Stop recording";
    startRecordingTimer();

}


let recordingTimerInterval = null;

function startRecordingTimer() {
    clearInterval(recordingTimerInterval);
    recordingTimerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - recordingStartedAt) / 1000);
        const min = String(Math.floor(elapsed / 60)).padStart(2, "0");
        const sec = String(elapsed % 60).padStart(2, "0");
        const timer = document.getElementById("recordingTimer");
        if (timer) timer.textContent = `${min}:${sec}`;
    }, 500);
}


function stopMilkingRecording() {

    clearInterval(recordingTimerInterval);

    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
    }

    const button = document.getElementById("recordButton");
    const status = document.getElementById("recordingStatus");
    if (button) button.textContent = "Start recording";
    if (status) status.textContent = "Recording stopped";

}


function stopCamera() {

    clearInterval(scanTimer);
    scanTimer = null;

    clearInterval(recordingTimerInterval);

    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
    }

    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }

}


function renderHistory(app) {

    const rows = state.history || [];

    app.innerHTML = shell(`
        <div class="topline">
            <div>
                <div class="kicker">SCREENING HISTORY</div>
                <h1 class="title">AI History</h1>
            </div>
        </div>

        <div class="stack">
            ${rows.length ? rows.slice(0, 30).map(item => `
                <div class="card pad">
                    <div class="section-heading">
                        <div>
                            <strong>${escapeHTML(item.cowId || "Unknown cow")}</strong>
                            <p class="panel-description">${new Date(item.timestamp).toLocaleString()}</p>
                        </div>
                        <span class="badge ${Number(item.prediction) === 1 ? "badge-attention" : "badge-normal"}">
                            ${Number(item.prediction) === 1 ? "Mastitis Risk" : "Healthy / Low Risk"}
                        </span>
                    </div>
                    <div class="metric-grid">
                        <div class="metric"><small>Risk</small><strong>${Number(item.risk || 0).toFixed(1)}%</strong></div>
                        <div class="metric"><small>Temperature</small><strong>${Number(item.measurements?.milk_temperature || 0).toFixed(2)} °C</strong></div>
                        <div class="metric"><small>pH</small><strong>${Number(item.measurements?.milk_ph || 0).toFixed(2)}</strong></div>
                        <div class="metric"><small>Conductivity</small><strong>${Number(item.measurements?.milk_conductivity || 0).toFixed(2)}</strong></div>
                    </div>
                </div>
            `).join("") : `
                <div class="card empty">
                    <div class="empty-icon">🕘</div>
                    No AI screenings recorded yet.
                </div>
            `}
        </div>
    `, "history");

}


function renderAnalytics(app) {

    const total = state.animals.length;
    const normal = state.animals.filter(a => a.status === "Normal").length;
    const monitor = state.animals.filter(a => a.status === "Monitor").length;
    const attention = state.animals.filter(a => a.status === "Attention").length;
    const screenings = state.history?.length || 0;
    const highRiskScreenings = state.history?.filter(x => Number(x.prediction) === 1).length || 0;

    app.innerHTML = shell(`
        <div class="topline">
            <div>
                <div class="kicker">HERD ANALYTICS</div>
                <h1 class="title">Analytics</h1>
            </div>
        </div>

        <div class="stats">
            <div class="stat"><small>Current Animals</small><strong>${total}</strong></div>
            <div class="stat green"><small>Normal</small><strong>${normal}</strong></div>
            <div class="stat yellow"><small>Monitor</small><strong>${monitor}</strong></div>
            <div class="stat red"><small>Attention</small><strong>${attention}</strong></div>
        </div>

        <div class="card pad section">
            <div class="kicker">AI ACTIVITY</div>
            <h2>${screenings} screenings recorded</h2>
            <p class="subtitle">${highRiskScreenings} screenings returned a high-risk prediction.</p>
            <div class="progress"><span style="width:${screenings ? Math.min(100, (highRiskScreenings / screenings) * 100) : 0}%"></span></div>
        </div>

        <div class="card pad section">
            <div class="kicker">DATA SEPARATION</div>
            <h2>Training data vs current herd</h2>
            <p class="subtitle">
                The historical 800-record dataset is used by the trained AI model. The figures above represent the current cows registered in Dugdha Kavach and their screening history only.
            </p>
        </div>
    `, "analytics");

}

function renderSettings(app) {

    app.innerHTML =
        shell(`

            <div class="topline">

                <div>

                    <div class="kicker">
                        ACCOUNT
                    </div>

                    <h1 class="title">
                        Settings
                    </h1>

                </div>

            </div>


            <div class="stack">

                <div class="card pad">

                    <div class="kicker">
                        FARM
                    </div>

                    <h2>
                        ${escapeHTML(
                            state.farm.name
                        )}
                    </h2>

                    <p class="subtitle">
                        ${escapeHTML(
                            state.farm.type
                        )}
                    </p>

                </div>


                <button
                    class="btn btn-secondary"
                    onclick="resetDemo()"
                >
                    Reset Demo Data
                </button>


                <button
                    class="btn btn-primary"
                    onclick="go('animals')"
                >
                    Manage Animals
                </button>

            </div>

        `, "settings");

}


function resetDemo() {

    localStorage.removeItem(STORE);

    state =
        JSON.parse(
            JSON.stringify(
                defaultState
            )
        );

    toast(
        "Demo data reset"
    );

    setTimeout(
        () => go("home"),
        400
    );

}


window.addEventListener(
    "hashchange",
    () => {

        if (!location.hash.includes("camera")) {
            stopCamera();
        }

        const page =
            location.hash
                .replace("#/", "");


        if (page.startsWith("animal/")) {

            const id =
                page.split("/")[1];

            selectedAnimal =
                state.animals.find(
                    a => a.id === id
                );

            renderAnimalDetails();

            return;

        }


        render();

    }
);


document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (!location.hash) {

            location.hash =
                "#/splash";

        }

        render();

    }
);