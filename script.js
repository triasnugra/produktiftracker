const PIN = "010166";
let productivityData = {};

// Fungsi untuk memeriksa PIN
function checkPIN() {
    const inputPin = document.getElementById("pin").value;
    const errorMessage = document.getElementById("error-message");
    if (inputPin === PIN) {
        document.getElementById("login-page").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");
        loadProductivityData();
        generateCalendar(2024);
    } else {
        errorMessage.textContent = "Incorrect PIN. Please try again.";
    }
}

// Fungsi untuk memuat data dari localStorage
function loadProductivityData() {
    const storedData = localStorage.getItem("productivityData");
    if (storedData) {
        productivityData = JSON.parse(storedData);
    }
}

// Fungsi untuk menyimpan data ke localStorage
function saveProductivityData() {
    localStorage.setItem("productivityData", JSON.stringify(productivityData));
}

// Fungsi untuk membuat kalender
function generateCalendar(year) {
    const calendar = document.getElementById("calendar");
    const daysInMonth = [31, (year % 4 === 0 ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    calendar.innerHTML = "";

    for (let month = 0; month < 12; month++) {
        for (let day = 1; day <= daysInMonth[month]; day++) {
            const dateKey = `${year}-${month + 1}-${day}`;
            if (!productivityData[dateKey]) {
                productivityData[dateKey] = {
                    "06-09": null,
                    "09-12": null,
                    "12-15": null,
                    "15-18": null,
                    "18-21": null,
                };
            }

            const dateCell = document.createElement("div");
            dateCell.className = "date-cell";
            dateCell.innerHTML = `<strong>${day}/${month + 1}</strong>`;
            for (let time of ["06-09", "09-12", "12-15", "15-18", "18-21"]) {
                const timeBlock = document.createElement("div");
                timeBlock.className = "time-block";
                const currentStatus = productivityData[dateKey][time];
                timeBlock.innerHTML = `
                    <span>${time}</span>
                    <button class="green" onclick="setProductivity('${dateKey}', '${time}', true)" ${currentStatus === true ? "disabled" : ""}>✔</button>
                    <button class="red" onclick="setProductivity('${dateKey}', '${time}', false)" ${currentStatus === false ? "disabled" : ""}>✘</button>
                    <button class="reset" onclick="resetProductivity('${dateKey}', '${time}')">Reset</button>
                `;
                dateCell.appendChild(timeBlock);
            }
            calendar.appendChild(dateCell);
        }
    }
    updateSummary();
}

// Fungsi untuk mengatur produktivitas
function setProductivity(date, time, productive) {
    productivityData[date][time] = productive;
    saveProductivityData();
    generateCalendar(2024);
}

// Fungsi untuk mereset produktivitas
function resetProductivity(date, time) {
    productivityData[date][time] = null;
    saveProductivityData();
    generateCalendar(2024);
}

// Fungsi untuk memperbarui rekap
function updateSummary() {
    const weeklySummary = document.getElementById("weekly-summary");
    const monthlySummary = document.getElementById("monthly-summary");
    const weeklyData = {};
    const monthlyData = {};

    for (const date in productivityData) {
        const [year, month, day] = date.split("-");
        const week = Math.ceil(day / 7);
        const weekKey = `Week ${week} (${month}/${year})`;
        const monthKey = `${month}/${year}`;

        if (!weeklyData[weekKey]) weeklyData[weekKey] = { productive: 0, total: 0 };
        if (!monthlyData[monthKey]) monthlyData[monthKey] = { productive: 0, total: 0 };

        for (const time in productivityData[date]) {
            if (productivityData[date][time] !== null) {
                weeklyData[weekKey].total++;
                monthlyData[monthKey].total++;
                if (productivityData[date][time]) {
                    weeklyData[weekKey].productive++;
                    monthlyData[monthKey].productive++;
                }
            }
        }
    }

    // Render weekly summary
    weeklySummary.innerHTML = Object.entries(weeklyData)
        .map(([week, data]) => `<div>${week}: ${data.productive}/${data.total} productive</div>`)
        .join("");

    // Render monthly summary
    monthlySummary.innerHTML = Object.entries(monthlyData)
        .map(([month, data]) => `<div>${month}: ${data.productive}/${data.total} productive</div>`)
        .join("");
}
