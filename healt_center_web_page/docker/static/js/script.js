const charts = {}

function addOrUpdateRow(fk_id, eegData, probability, datetime) {
    const table = document.getElementById('eegTable').getElementsByTagName('tbody')[0];
    let row = Array.from(table.rows).find(row => row.cells[0].innerText === fk_id);

    if (!row) {
        row = table.insertRow();
        const first = row.insertCell(0);
        first.innerText = fk_id;
        first.style.setProperty('width', '8%');
        first.style.setProperty('height', '200px');
        const second = row.insertCell(1);
        second.innerHTML = '<canvas></canvas>';
        second.style.setProperty('width', '60%');
        const third = row.insertCell(2);
        third.innerText = probability;
        third.style.setProperty('width', '10%');
        if (probability > 0.7) {
            third.style.backgroundColor = 'red';
        } else if (probability < 0.3) {
            third.style.backgroundColor = 'lightgreen';
        } else {
            third.style.backgroundColor = 'yellow';
        }
        row.insertCell(3).innerText = datetime;
        const ctx = row.cells[1].getElementsByTagName('canvas')[0].getContext('2d');
        charts[fk_id] = new Chart(ctx, {
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
        const chart = charts[fk_id]
        chart.data.labels = eegData.map((_, index) => index);
        chart.data.datasets[0].data = eegData;
        chart.update();
    }
}

async function fetchData() {
    const response = await fetch('/data');
    const data = await response.json();
    data.forEach(item => addOrUpdateRow(item.fk_user, item.eeg_data, item.epilepsy_prediction_probability, item.register_timestamp));
}

setInterval(fetchData, 5000);

fetchData();
