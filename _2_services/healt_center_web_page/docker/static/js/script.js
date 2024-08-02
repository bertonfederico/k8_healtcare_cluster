const EEG_charts = {}
const hearbeat_charts = {}

function addOrUpdateEegRow(fk_id, eegData, probability, datetime) {
    const table = document.getElementById('eegTable').getElementsByTagName('tbody')[0];
    let row = Array.from(table.rows).find(row => row.cells[0].innerText === fk_id.toString());

    if (!row) {
        row = table.insertRow();
        const first = row.insertCell(0);
        first.innerText = fk_id;
        first.style.setProperty('width', '8%');
        first.style.setProperty('height', '200px');
        const second = row.insertCell(1);
        second.innerHTML = '<canvas></canvas>';
        second.style.setProperty('width', '55%');
        const third = row.insertCell(2);
        third.innerText = probability;
        third.style.setProperty('width', '20%');
        if (probability > 0.7) {
            third.style.backgroundColor = 'red';
        } else if (probability < 0.3) {
            third.style.backgroundColor = 'lightgreen';
        } else {
            third.style.backgroundColor = 'yellow';
        }
        row.insertCell(3).innerText = datetime;
        const ctx = row.cells[1].getElementsByTagName('canvas')[0].getContext('2d');
        EEG_charts[fk_id] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: eegData.map((_, index) => index),
                datasets: [{
                    label: 'EEG data',
                    data: eegData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }],
                    y: {
                        min: -1000,
                        max: 1000,
                        ticks: {
                            stepSize: 200 
                        }
                    }
                }
            }
        });
    } else {
        row.cells[2].innerText = probability
        if (probability > 0.7) {
            row.cells[2].style.backgroundColor = 'red';
        } else if (probability < 0.3) {
            row.cells[2].style.backgroundColor = 'lightgreen';
        } else {
            row.cells[2].style.backgroundColor = 'yellow';
        }
        row.cells[3].innerText = datetime
        const chart = EEG_charts[fk_id]
        chart.data.labels = eegData.map((_, index) => index);
        chart.data.datasets[0].data = eegData;
        chart.update();
    }
}

function getColorForHeartbeatValue(value) {
    min = 20;
    max = 150;
    const normalized = (value - min) / (max - min);
    const green = Math.floor(255 * (1 - normalized));
    const red = Math.floor(255 * normalized);
    return `rgb(${red}, ${green}, 0)`;
}

function addOrUpdateHeartRow(fk_id, heartbeat_values, register_timestamps, mean, higher, lower) {
    const table = document.getElementById('heartTable').getElementsByTagName('tbody')[0];
    let row = Array.from(table.rows).find(row => row.cells[0].innerText === fk_id.toString());

    if (!row) {
        row = table.insertRow();
        const first = row.insertCell(0);
        first.innerText = fk_id;
        first.style.setProperty('width', '13%');
        first.style.setProperty('height', '200px');
        const second = row.insertCell(1);
        second.innerHTML = '<canvas></canvas>';
        const third = row.insertCell(2);
        const container = document.createElement('div');
        container.className = 'cell-content';
        const line1 = document.createElement('div');
        line1.className = 'line';
        line1.innerText = "Higher: " + higher;
        line1.style.backgroundColor = getColorForHeartbeatValue(higher);
        container.appendChild(line1);
        const line2 = document.createElement('div');
        line2.className = 'line';
        line2.innerText = "Mean: " + mean;
        line2.style.backgroundColor = getColorForHeartbeatValue(mean);
        container.appendChild(line2);
        const line3 = document.createElement('div');
        line3.className = 'line';
        line3.innerText = "Lower: " + lower;
        line3.style.backgroundColor = getColorForHeartbeatValue(lower);
        container.appendChild(line3);
        third.appendChild(container);
        third.style.setProperty('width', '13%');
        const ctx = row.cells[1].getElementsByTagName('canvas')[0].getContext('2d');
        hearbeat_charts[fk_id] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: register_timestamps,
                datasets: [{
                    label: 'Heartbeat data',
                    data: heartbeat_values,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            tooltipFormat: 'MMM dd, yyyy HH:mm',
                            unit: 'minute'
                        },
                        title: {
                            display: true,
                            text: 'Timestamp'
                        }
                    },
                    y: {
                        min: 10,
                        max: 130,
                        title: {
                            display: true,
                            text: 'Heart beat'
                        }
                    }
                }
            }
        });
    } else {
        const chart = hearbeat_charts[fk_id]
        chart.data.labels = register_timestamps;
        chart.data.datasets[0].data = heartbeat_values;
        chart.update();
    }
}

async function fetchEegData() {
    const response = await fetch('/eeg_data');
    const data = await response.json();
    data.forEach(item => addOrUpdateEegRow(item.fk_user, JSON.parse(item.eeg_data), item.epilepsy_prediction_probability, item.register_timestamp));
}

async function fetchHeartBeatData() {
    const response = await fetch('/heartbeat_data');
    const data = await response.json();
    for (let fk_user in data) {
        const heartbeat_values = data[fk_user].heartbeat_values;
        const register_timestamps = data[fk_user].register_timestamps;
        const sum = heartbeat_values.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const average = Math.floor(sum / heartbeat_values.length);
        const higher = Math.max(...heartbeat_values);
        const lower = Math.min(...heartbeat_values);
        addOrUpdateHeartRow(fk_user, heartbeat_values, register_timestamps, average, higher, lower);
    }
}

setInterval(fetchEegData, 5000);
setInterval(fetchHeartBeatData, 25000);

fetchEegData();
fetchHeartBeatData();
