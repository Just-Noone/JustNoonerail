document.addEventListener("DOMContentLoaded", () => {
    const routeForm = document.getElementById('routeForm');
    const fromInput = document.getElementById('ticketsfrom');
    const toInput = document.getElementById('ticketsto');
    const submitButton = document.getElementById('SubTick');
    const resultsDiv = document.getElementById('results');
    const errorMessage = document.getElementById('error-message');
    const arrivalsDiv = document.getElementById('arrivals');
    const showMoreButton = document.getElementById('show-more');
    const expandAllButton = document.getElementById('expand-all');
    const fromSuggestions = document.getElementById('from-suggestions');
    const toSuggestions = document.getElementById('to-suggestions');

    fromInput.addEventListener('input', () => showSuggestions(fromInput.value, 'from'));
    toInput.addEventListener('input', () => showSuggestions(toInput.value, 'to'));
    routeForm.addEventListener('submit', handleSubmit);
    showMoreButton.addEventListener('click', showMore);
    expandAllButton.addEventListener('click', expandAll);

    let stations = [];
    let currentArrivals = [];
    let visibleArrivalsCount = 10;

    fetch('http://georail.uk.to:8888/data')
        .then(response => response.json())
        .then(data => {
            stations = data[0].stations;
        })
        .catch(error => {
            console.error('Error fetching stations:', error);
        });

    function showSuggestions(value, type) {
        const suggestionsDiv = type === 'from' ? fromSuggestions : toSuggestions;
        suggestionsDiv.innerHTML = '';

        if (!value) {
            suggestionsDiv.style.display = 'none';
            return;
        }

        const filteredStations = Object.values(stations).filter(station =>
            station.name.toLowerCase().includes(value.toLowerCase())
        );

        filteredStations.forEach(station => {
            const suggestion = document.createElement('div');
            suggestion.classList.add('autocomplete-suggestion');
            suggestion.textContent = station.name.split('|')[1] || station.name.split('|')[0];
            suggestion.addEventListener('click', () => {
                if (type === 'from') {
                    fromInput.value = suggestion.textContent;
                } else {
                    toInput.value = suggestion.textContent;
                }
                suggestionsDiv.innerHTML = '';
                suggestionsDiv.style.display = 'none';
            });
            suggestionsDiv.appendChild(suggestion);
        });

        suggestionsDiv.style.display = 'block';
    }

function handleSubmit(e) {
    e.preventDefault();
    const fromValue = fromInput.value.trim();
    const toValue = toInput.value.trim();

        // Hide previous results and errors
        resultsDiv.style.display = 'none';
        errorMessage.style.display = 'none';

        if (!fromValue || !toValue) {
            errorMessage.textContent = 'Both fields are required.';
            errorMessage.style.display = 'flex';
            errorMessage.style.justifyContent = 'center'
            errorMessage.style.backgroundColor = '#fe5858'
            errorMessage.style.color = 'white'
            errorMessage.style.borderRadius = '100px'
            errorMessage.style.padding = '5px'
            return;
        }

        if (fromValue === toValue) {
            errorMessage.textContent = 'The departure and destination stations cannot be the same.';
            errorMessage.style.display = 'flex';
            errorMessage.style.justifyContent = 'center'
            errorMessage.style.backgroundColor = '#fe5858'
            errorMessage.style.color = 'white'
            errorMessage.style.borderRadius = '100px'
            errorMessage.style.padding = '5px'
            return;
        }

        

        getRoute(fromValue.toLowerCase(), toValue.toLowerCase());
    }

    async function getRoute(fromStation, toStation) {
        const url = 'http://georail.uk.to:8888/data';
        const response = await fetch(url);
        const data = await response.json();

        const routesData = data[0].routes;
        const stationsData = data[0].stations;

        let foundRoute = false;
        let resultHTML = '';

        for (const route of routesData) {
            const routeStations = route.stations.map(stationId => stationId.split('_')[0]);

            const fromStationId = Object.keys(stationsData).find(id =>
                stationsData[id].name.toLowerCase().includes(fromStation)
            );

            const toStationId = Object.keys(stationsData).find(id =>
                stationsData[id].name.toLowerCase().includes(toStation)
            );

            if (fromStationId && toStationId && routeStations.includes(fromStationId) && routeStations.includes(toStationId)) {
                foundRoute = true;

                let stationsHTML = '';
                let exchangesHTML = '';

                for (const stationId of routeStations) {
                    const station = stationsData[stationId];
                    if (station) {
                        const stationName = station.name.split('|')[1] || station.name.split('|')[0];
                        stationsHTML += `<div class="station" data-id="${stationId}">${stationName} (Zone: ${station.zone})</div>`;
                    }
                }

                if (route.stations.length > 0) {
                    exchangesHTML = route.stations.map((stationId, index) => {
                        const station = stationsData[stationId.split('_')[0]];
                        if (station && index < route.stations.length - 1) {
                            const nextStation = stationsData[route.stations[index + 1].split('_')[0]];
                            if (nextStation && station.name !== nextStation.name) {
                                return `<p class="exchange" style="background-color: ${decimalToHex(route.color)};">
                                    Exchange from ${station.name.split('|')[1] || station.name.split('|')[0]} to ${nextStation.name.split('|')[1] || nextStation.name.split('|')[0]}
                                </p>`;
                            }
                        }
                        return '';
                    }).join('');
                } else {
                    exchangesHTML = '<p class="exchange">None</p>';
                }

                resultHTML += `
                    <div class="route">
                        <h2>Route: ${route.name.split('|')[1] || route.name.split('|')[0]}</h2>
                        ${stationsHTML}
                        <h3>Exchanges:</h3>
                        ${exchangesHTML}
                    </div>
                `;
            }
        }

        if (!foundRoute) {
            resultHTML = '<p>No routes available.</p>';
        }

        resultsDiv.innerHTML = resultHTML;
        resultsDiv.style.display = 'block';

        // Fetch and display arrival times
        const stationElements = document.querySelectorAll('.station');
        stationElements.forEach(element => {
            const stationId = element.getAttribute('data-id');
            fetchArrivals(stationId, element);
        });
    }

    async function fetchArrivals(stationId, element) {
        const url = `http://georail.uk.to:8888/arrivals?worldIndex=0&stationId=${stationId}`;
        const response = await fetch(url);
        const arrivalsData = await response.json();

        arrivalsData.forEach(arrival => {
            const arrivalTime = new Date(arrival.arrival * 1000);
            const formattedTime = arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const arrivalHTML = `<p class="time arrival-item" data-arrival="${arrival.arrival}" data-route="${element.textContent.trim()}">${formattedTime}</p>`;
            element.innerHTML += arrivalHTML;

            // Add click event to each arrival time
            document.querySelectorAll('.time').forEach(item => {
                item.addEventListener('click', function () {
                    const arrivalData = {
                        arrivalTime: new Date(this.dataset.arrival * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        routeDetails: this.dataset.route,
                    };
                    localStorage.setItem('arrivalDetails', JSON.stringify(arrivalData));
                    window.open('arrivalDetails.html', '_blank');
                });
            });

            // Add arrivals to current arrivals list for sorting and displaying
            currentArrivals.push(element);
        });

        updateArrivalsDisplay();
    }

    function decimalToHex(d) {
        let hex = Number(d).toString(16);
        hex = '#' + hex.padStart(6, '0');
        return hex;
    }

    function updateArrivalsDisplay() {
        arrivalsDiv.innerHTML = '';
        const visibleArrivals = currentArrivals.slice(0, visibleArrivalsCount);
        visibleArrivals.forEach(arrival => {
            arrivalsDiv.appendChild(arrival);
        });

        if (visibleArrivalsCount < currentArrivals.length) {
            showMoreButton.style.display = 'block';
        } else {
            showMoreButton.style.display = 'none';
        }

        if (currentArrivals.length > visibleArrivalsCount) {
            expandAllButton.style.display = 'block';
        } else {
            expandAllButton.style.display = 'none';
        }

        const fadeOutItems = currentArrivals.slice(10);
        fadeOutItems.forEach(item => {
            item.classList.add('fade-out');
        });
    }

    function showMore() {
        visibleArrivalsCount += 5;
        updateArrivalsDisplay();
    }

    function expandAll() {
        visibleArrivalsCount = currentArrivals.length;
        updateArrivalsDisplay();
    }

    document.addEventListener('click', function (event) {
        if (!event.target.matches('.ticketsfrom') && !event.target.matches('.ticketsto')) {
            fromSuggestions.style.display = 'none';
            toSuggestions.style.display = 'none';
        }
    });
});
