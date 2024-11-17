const PIN = "010166";
let productivityData = {};

function checkPIN() {
    const inputPin = document.getElementById('pin').value;
    const errorMessage = document.getElementById('error-message');
    if (inputPin === PIN) {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        generateCalendar(2024);
    } else {
        errorMessage.textContent = "Incorrect PIN. Please try again.";
    }
}

function generateCalendar(year) {
    const calendar = document.getElementById('calendar');
    const daysInMonth = [31, (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    calendar.innerHTML = '';
    productivityData = {};

    for (let month = 0; month < 12; month++) {
        for (let day = 1; day <= daysInMonth[month]; day++) {
            const dateKey = `${year}-${month + 1}-${day}`;
            productivityData[dateKey] = { "06-09": null, "09-12": null, "12-15": null, "15-18": null, "18-21": null };

            const dateCell = document.createElement('div');
            dateCell.className = 'date-cell';
            dateCell.innerHTML = `<strong>${day}/${month + 1}</strong>`;
            
            for (let timeBlock of ["06-09", "09-12", "12-15", "15-18", "18-21"]) {
                const timeDiv = document.createElement('div');
                timeDiv.className = 'time-block';
                timeDiv.innerHTML = `
                    <span>${timeBlock}</span>
                    <button class="green" onclick="setProductivity('${dateKey}', '${timeBlock}', true)">✔</button>
                    <button class="red" onclick="setProductivity('${dateKey}', '${timeBlock}', false)">✘</button>
                `;
                dateCell.appendChild(timeDiv);
            }
            calendar.appendChild(dateCell);
        }
    }
}

function setProductivity(date, timeBlock, isProductive) {
    productivityData[date][timeBlock] = isProductive;
    updateSummary();
}

function updateSummary() {
    console.log(productivityData);
    // Placeholder for summary update logic
}
