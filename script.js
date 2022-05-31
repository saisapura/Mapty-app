'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class workout {
    date = new Date ();
    id = (Date.now() + '').slice(-10);

    constructor (coords, distance, duration) {
        // this.date = ...
        // this.id = ...
        this.coords = coords; // [lat, lng]
        this. distance = distance; // in km
        this.duration = duration; // in min
    }
}

class Running extends workout  {
    constructor (coords, distance, duration, cadence) {
        super (coords, distance, duration)
        this.cadence = cadence;
        this.calcPace();
    }

    calcPace() {
        // min/km
        this.pace = this.duration / this.distance;
        return this.pace
    }
}

class Cycling extends workout  {
    constructor (coords, distance, duration, elevationGain) {
        super (coords, distance, duration)
        this.elevationGain = elevationGain; 
        this.calcSpeed()
    }

    calcSpeed() {
        // km /h
        this.speed = this.distance / (this.duration / 60)
        return this.speed
    }
}
 
// Experimenting
// const run1 = new Running([20, -1], 5, 20, 200);
// const cycling1 = new Running([20, -1], 15, 100, 500);
// console.log(run1, cycling1);

//////////////////////////////////////////////////////////////
// APPLICATION ARCHITECTURE
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
    #map;
    #mapEvent;

    constructor() {
        this._getPosition();
        form.addEventListener('submit', this._newWorkOut.bind(this));
        inputType.addEventListener('change', this._toggleElevationField);
    }

    _getPosition() {
        if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition (this._loadMap.bind(this), function () {
            alert (`Could not get your position`);

        });
    }

    _loadMap (position) {
        const {latitude} = position.coords; 
        const {longitude} = position.coords; 
        console.log(`https://www.google.pl/maps/@${latitude},${longitude}`);
       
        const coords = [latitude, longitude];
       
        this.#map = L.map('map').setView(coords, 13);
       
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: 
             '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
       
            // Handling clicks on map
            this.#map.on('click', this._showForm.bind(this));
        }

    _showForm(mapE) {
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
    }

    _toggleElevationField () {
        inputElevation
            .closest('.form__row')
            .classList.toggle('form__row--hidden');
         inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkOut(e) {
        const validInputs = (...inputs) => 
        inputs.every(inp => Number.isFinite(inp));
        const allPositive = (...inputs) => inputs.every(inp => inp > 0);

        e.preventDefault();

        // Get data from form
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;

        
        // If workout is running, create running object
        if(type === 'running') {
            const cadence = +inputCadence.value;
            // Check if data is valid
            if (
                // !Number.isFinite(distance) ||
                // !Number.isFinite(duration) ||
                // !Number.isFinite(cadence) ||
                !validInputs(distance, duration, cadence) ||
                !allPositive(distance, duration, cadence)
            )
            return alert('Inputs have to be a positive number!')
         }

        // If workout is cycling, create cycling object
        if (type === 'cyling') {
            const elevation = +inputElevation.value;
            if (
                !validInputs(distance, duration, elevation) || 
                (distance, duration)
            )
            return alert('Inputs have to be a positive number!');
        }

        // Add new object to workout array

        // Render workout on map as marker
        const { lat, lng} = this.#mapEvent.latlng;
        L.marker([lat, lng])
        .addTo(this.#map)
        .bindPopup(
            L.popup({
             maxWidth: 250, 
             minWidth: 100, 
             autoClose: false,
             closeOnClick: false,
             className: 'running-popup',
            })
    )
    .setPopupContent('workout')   
    .openPopup();

        // Render workout on list

        // Hide form + clear input fields
        
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';

    
    }
}

    const app = new App();
    app._getPosition();

    
