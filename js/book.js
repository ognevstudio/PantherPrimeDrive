// Function to toggle the mobile menu
function toggleMenu() {
	const menuBackground = document.getElementById("menuBackground");
	const menuContent = document.getElementById("menuContent");
	const menuIcon = document.getElementById("menuIcon");

	// Check if the menu is currently open
	const isMenuOpen = menuBackground.style.display === "block";

	// Toggle the display of menu elements based on the current state
	menuBackground.style.display = isMenuOpen ? "none" : "block";
	menuContent.style.display = isMenuOpen ? "none" : "block";
	menuIcon.classList.toggle("header__mobile-close");
}

document.addEventListener("DOMContentLoaded", () => {
    // Car selection functionality
    const customSelect = document.querySelector(".custom-select");
    const selectBtn = document.getElementById("select-button");
    const selectedValue = document.querySelector(".selected-value");
    const optionsList = document.querySelectorAll(".select-dropdown li");
    const hiddenCarInput = document.getElementById("selectedCar");
    const carError = document.getElementById("car-error");

    // Passengers and luggage limit defaults. Actual numbers are set in function validateCarSelection
    let passengerLimit = 4;
    let luggageLimit = 3;

    selectBtn.addEventListener("click", () => {
        customSelect.classList.toggle("active");
        const expanded = selectBtn.getAttribute("aria-expanded") === "true" ? "false" : "true";
        selectBtn.setAttribute("aria-expanded", expanded);
    });

    optionsList.forEach((option) => {
        option.addEventListener("click", function () {
            const selectedOption = this.querySelector("label").cloneNode(true);
            selectedValue.innerHTML = '';
            selectedValue.appendChild(selectedOption);
            hiddenCarInput.value = this.querySelector("label").getAttribute("value");
            customSelect.classList.remove("active");
            selectBtn.setAttribute("aria-expanded", "false");
            validateCarSelection(); // Trigger validation immediately
        });

        option.addEventListener("keyup", function (e) {
            if (e.key === "Enter") {
                const selectedOption = this.querySelector("label").cloneNode(true);
                selectedValue.innerHTML = '';
                selectedValue.appendChild(selectedOption);
                hiddenCarInput.value = this.querySelector("label").getAttribute("value");
                customSelect.classList.remove("active");
                selectBtn.setAttribute("aria-expanded", "false");
                validateCarSelection(); // Trigger validation immediately
            }
        });
    });

    document.addEventListener("click", (event) => {
        if (!customSelect.contains(event.target)) {
            customSelect.classList.remove("active");
            selectBtn.setAttribute("aria-expanded", "false");
        }
    });

    // Date picker configuration
    const now = new Date();
    flatpickr("#date", {
        dateFormat: "d/m/Y",
        minDate: now, // Same day
        maxDate: new Date(new Date().setMonth(now.getMonth() + 4)), // 4 months ahead without mutating now
        onDayCreate: function (dObj, dStr, fp, dayElem) {
            dayElem.style.backgroundColor = "#FAF8F5"; // Custom background color
            if (dayElem.classList.contains("today")) {
                dayElem.style.backgroundColor = "#45513D"; // Today's date background color
                dayElem.style.color = "#fff"; // Today's date text color
            }
        },
        onChange: function(selectedDates, dateStr, instance) {
            const selectedDate = selectedDates[0];
            populateTimeDropdown(selectedDate);
            validateDate();
        }
    });

    // Initial population of the time dropdown based on the current date
    populateTimeDropdown(now);
    function populateTimeDropdown(selectedDate) {
        const timeDropdown = document.getElementById("time-select-dropdown");
        const timeSelectedValue = document.querySelector("#time-select-button .selected-time-value");
        const hiddenTimeInput = document.getElementById("selectedTime");
        timeDropdown.innerHTML = ''; // Clear existing options
        timeSelectedValue.textContent = "Select a time"; // Reset selected time text
        hiddenTimeInput.value = ''; // Reset hidden input value

        let currentTime = new Date();
        currentTime.setMinutes(0, 0, 0, 0); // Set minutes, seconds, and milliseconds to 0

        if (isSameDay(selectedDate, currentTime)) {
            currentTime.setHours(currentTime.getHours() + 2); // 2 hours from current time for today
            const endOfDay = new Date(currentTime);
            endOfDay.setHours(23, 30, 0, 0); // End of the current day at 11:30 PM

            while (currentTime <= endOfDay) {
                const option = document.createElement("li");
                option.role = "option";
                option.textContent = formatTime(currentTime);
                option.dataset.value = formatTime(currentTime);
                timeDropdown.appendChild(option);
                currentTime.setMinutes(currentTime.getMinutes() + 30);
            }
        } else {
            currentTime = new Date(selectedDate);
            currentTime.setHours(0, 0, 0, 0); // Start from midnight for future dates
            const endOfDay = new Date(selectedDate);
            endOfDay.setHours(23, 30, 0, 0); // End of the selected day at 11:30 PM

            while (currentTime <= endOfDay) {
                const option = document.createElement("li");
                option.role = "option";
                option.textContent = formatTime(currentTime);
                option.dataset.value = formatTime(currentTime);
                timeDropdown.appendChild(option);
                currentTime.setMinutes(currentTime.getMinutes() + 30);
            }
        }
    }

    function formatTime(date) {
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // The hour '0' should be '12'
        return `${hours}:${minutes} ${ampm}`;
    }

    function isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    }

    // Time dropdown functionality
    const timeSelectButton = document.getElementById("time-select-button");
    const customTimeSelect = document.getElementById("custom-time-select");
    const timeDropdown = document.getElementById("time-select-dropdown");

    timeSelectButton.addEventListener("click", () => {
        customTimeSelect.classList.toggle("active");
        const expanded = timeSelectButton.getAttribute("aria-expanded") === "true" ? "false" : "true";
        timeSelectButton.setAttribute("aria-expanded", expanded);
    });

    timeDropdown.addEventListener("click", (event) => {
        if (event.target && event.target.nodeName === "LI") {
            const timeSelectedValue = document.querySelector("#time-select-button .selected-time-value");
            const hiddenTimeInput = document.getElementById("selectedTime");
            timeSelectedValue.textContent = event.target.textContent;
            hiddenTimeInput.value = event.target.dataset.value;
            customTimeSelect.classList.remove("active");
            timeSelectButton.setAttribute("aria-expanded", "false");
            validateTime();
        }
    });

    document.addEventListener("click", (event) => {
        if (!timeSelectButton.contains(event.target) && !timeDropdown.contains(event.target)) {
            customTimeSelect.classList.remove("active");
            timeSelectButton.setAttribute("aria-expanded", "false");
        }
    });

});

let isValidName = false;
let isValidEmail = false;
let isValidPhone = false;
let isValidPrivacyPolicy = false;
let isValidDate = false;
let isValidTime = false;
let isValidCarSelection = false;
let isValidDeparture = false;
let isValidArrival = false;

// Validate Car Selection
function validateCarSelection() {
    const hiddenCarInput = document.getElementById("selectedCar");
    const carError = document.getElementById("car-error");

    if (!hiddenCarInput.value) {
        carError.style.display = "block";
        if (hiddenCarInput.closest('.custom-select')) {
            hiddenCarInput.closest('.custom-select').classList.add("invalid");
        }
        detailsOpenBtnMain.classList.add("disabled");
        detailsOpenBtnArrow.classList.add("disabled");
        isValidCarSelection = false;
        validateForm();
        return false;
    } else {
        carError.style.display = "none";
        if (hiddenCarInput.closest('.custom-select')) {
            hiddenCarInput.closest('.custom-select').classList.remove("invalid");
        }
        isValidCarSelection = true;
        passengerLimit = document.querySelector("#selected-car label .car-passengers").textContent.match(/\d+/g);
        luggageLimit = document.querySelector("#selected-car label .car-luggage").textContent.match(/\d+/g); 

        if (passengersField.value < passengerLimit) {
            passengersIncreaseButton.classList.remove("disabled");
        } else {
            passengersField.value = passengerLimit;
            passengersIncreaseButton.classList.add("disabled");
        };

        if (luggageField.value < luggageLimit) {
            luggageIncreaseButton.classList.remove("disabled");
        } else {
            luggageField.value = luggageLimit;
            luggageIncreaseButton.classList.add("disabled");
        };

        validateForm();
        return true;
    }
}

// Validate Name
function validateName() {
    const nameInput = document.getElementById("name");
    const nameError = document.getElementById("name-error");
    const namePattern = /^[A-Za-z\s]+$/;

    if (!nameInput.value.trim() || !namePattern.test(nameInput.value) || nameInput.value.length > 50) {
        nameError.style.display = "block";
        nameInput.classList.add("invalid");
        detailsOpenBtnMain.classList.add("disabled");
        detailsOpenBtnArrow.classList.add("disabled");
        isValidName = false;
        validateForm();
        return false;
    } else {
        nameError.style.display = "none";
        nameInput.classList.remove("invalid");
        isValidName = true;
        validateForm();
        return true;
    }
}

// Validate Email
function validateEmail() {
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("email-error");
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailInput.value.trim() || !emailPattern.test(emailInput.value)) {
        emailError.style.display = "block";
        emailInput.classList.add("invalid");
        detailsOpenBtnMain.classList.add("disabled");
        detailsOpenBtnArrow.classList.add("disabled");
        isValidEmail = false;
        validateForm();
        return false;
    } else {
        emailError.style.display = "none";
        emailInput.classList.remove("invalid");
        isValidEmail = true;
        validateForm();
        return true;
    }
}

// Validate Phone
function validatePhone() {
    const phoneInput = document.getElementById("phone");
    const phoneError = document.getElementById("phone-error");
    const phonePattern = /^[0-9]{10}$/;

    if (!phoneInput.value.trim() || !phonePattern.test(phoneInput.value)) {
        phoneError.style.display = "block";
        phoneInput.classList.add("invalid");
        detailsOpenBtnMain.classList.add("disabled");
        detailsOpenBtnArrow.classList.add("disabled");
        isValidPhone = false;
        validateForm();
        return false;
    } else {
        phoneError.style.display = "none";
        phoneInput.classList.remove("invalid");
        isValidPhone = true;
        validateForm();
        return true;
    }
}

// Validate Privacy Policy
function validatePrivacyPolicy() {
    const privacyPolicyCheckbox = document.getElementById("privacyPolicy");
    const privacyPolicyError = document.getElementById("privacy-policy-error");

    if (!privacyPolicyCheckbox.checked) {
        privacyPolicyError.style.display = "block";
        privacyPolicyCheckbox.classList.add("invalid");
        detailsOpenBtnMain.classList.add("disabled");
        detailsOpenBtnArrow.classList.add("disabled");
        isValidPrivacyPolicy = false;
        validateForm();
        return false;
    } else {
        privacyPolicyError.style.display = "none";
        privacyPolicyCheckbox.classList.remove("invalid");
        isValidPrivacyPolicy = true;
        validateForm();
        return true;
    }
}

// Validate Date
function validateDate() {
    const dateInput = document.getElementById("date");
    const dateError = document.getElementById("date-error");

    if (!dateInput.value.trim()) {
        dateError.style.display = "block";
        dateInput.classList.add("invalid");
        detailsOpenBtnMain.classList.add("disabled");
        detailsOpenBtnArrow.classList.add("disabled");
        isValidDate = false;
        validateForm();
        return false;
    } else {
        dateError.style.display = "none";
        dateInput.classList.remove("invalid");
        isValidDate = true;
        validateForm();
        return true;
    }
}

// Validate Time
function validateTime() {
    const timeInput = document.getElementById("selectedTime");
    const timeError = document.getElementById("time-error");

    if (!timeInput.value.trim()) {
        timeError.style.display = "block";
        timeInput.classList.add("invalid");
        detailsOpenBtnMain.classList.add("disabled");
        detailsOpenBtnArrow.classList.add("disabled");
        isValidTime = false;
        validateForm();
        return false;
    } else {
        timeError.style.display = "none";
        timeInput.classList.remove("invalid");
        isValidTime = true;
        validateForm();
        return true;
    }
    
}

// Add input event listeners for immediate validation
document.getElementById("name").addEventListener("input", validateName);
document.getElementById("email").addEventListener("input", validateEmail);
document.getElementById("phone").addEventListener("input", validatePhone);
document.getElementById("privacyPolicy").addEventListener("change", validatePrivacyPolicy);


// Validate Form
function validateForm() {
    if(isValidName && 
        isValidEmail && 
        isValidPhone && 
        isValidPrivacyPolicy && 
        isValidDate && 
        isValidTime && 
        isValidCarSelection && 
        departureValid && 
        arrivalValid)
            {
            detailsOpenBtnMain.classList.remove("disabled");
            detailsOpenBtnArrow.classList.remove("disabled"); 
            calculateAndDisplayRoute();
            detailsOpenBtnMain.classList.remove("disabled");
            detailsOpenBtnArrow.classList.remove("disabled");
    }
}

// Passengers and luggage counters
const passengersDecreaseButton = document.getElementById("decreasePassengers");
const passengersIncreaseButton = document.getElementById("increasePassengers");
const luggageDecreaseButton = document.getElementById("decreaseLuggage");
const luggageIncreaseButton = document.getElementById("increaseLuggage");
const passengersField = document.getElementById("passengers");
const luggageField = document.getElementById("luggage");

function increasePassengersCounter() {
    passengersField.value++;
    passengersDecreaseButton.classList.remove("disabled");
    if (passengersField.value >= passengerLimit) {
        passengersIncreaseButton.classList.add("disabled");
    };
};

function decreasePassengersCounter() {
    passengersField.value--;
    passengersIncreaseButton.classList.remove("disabled");
    if (passengersField.value <= 1) {
        passengersDecreaseButton.classList.add("disabled");
    };
};

function increaseLuggageCounter() {
    luggageField.value++;
    luggageDecreaseButton.classList.remove("disabled");
    if (luggageField.value >= luggageLimit) {
        luggageIncreaseButton.classList.add("disabled");
    };
};

function decreaseLuggageCounter() {
    luggageField.value--;
    luggageIncreaseButton.classList.remove("disabled");
    if (luggageField.value <= 0) {
        luggageDecreaseButton.classList.add("disabled");
    };
};

passengersDecreaseButton.addEventListener("click", decreasePassengersCounter);
passengersIncreaseButton.addEventListener("click", increasePassengersCounter);
luggageDecreaseButton.addEventListener("click", decreaseLuggageCounter);
luggageIncreaseButton.addEventListener("click", increaseLuggageCounter);

// Toggle visibility of details and order price blocks, populate order information
const detailsOpenBtnContainer = document.getElementById("details-open-button-container");
const detailsOpenBtnMain = document.getElementById("details-open-button-main");
const detailsOpenBtnArrow = document.getElementById("details-open-button-arrow");
const detailsCloseBtn = document.getElementById("details-close-button");

function toggleDetails() {
    const hourlyBanner = document.querySelector(".hourly-container");
    const bookingForm = document.getElementById("bookingForm");
    const orderDetails = document.getElementById("details-block");
    const orderPrice = document.getElementById("price-block");
    const headline = document.getElementById("page-headline");
    
    //Fill order information from booking form inputs
    const carInfo = document.getElementById("car-info");
    const carInfoImage = document.getElementById("car-info-image");
    const dateInfo = document.getElementById("date-info");
    const timeInfo = document.getElementById("time-info");
    const departureInfo = document.getElementById("departure-info");
    const arrivalInfo = document.getElementById("arrival-info");
    const passengersInfo = document.getElementById("passengers-info");
    const luggageInfo = document.getElementById("luggage-info");
    const nameInfo = document.getElementById("name-info");
    const emailInfo = document.getElementById("email-info");
    const phoneInfo = document.getElementById("phone-info");
    const servicesInfo = document.getElementById("services-info");
    const priceTotal = document.getElementById("price-total");
    const priceSubtotal = document.getElementById("price-subtotal");
    const priceTax = document.getElementById("price-tax")

    carInfo.textContent = document.querySelector(".selected-value label .car-name").textContent;
    dateInfo.textContent = document.getElementById("date").value;
    timeInfo.textContent = document.getElementById("selectedTime").value;
    departureInfo.textContent = document.getElementById("departure").value;
    arrivalInfo.textContent = document.getElementById("arrival").value;
    passengersInfo.textContent = document.getElementById("passengers").value;
    luggageInfo.textContent = document.getElementById("luggage").value;
    nameInfo.textContent = document.getElementById("name").value;
    emailInfo.textContent = document.getElementById("email").value;
    phoneInfo.textContent = document.getElementById("phone").value;
    servicesInfo.textContent = document.getElementById("services-input").value;

    let priceNumber = 0;
    let taxNumber = 0;

    //TODO: fill conditions for all cars
    //200 for SUV, 160 for sedan. All cars are SUVs for now. When there will be sedans, then will add conditions
    if ((carInfo.textContent.toUpperCase().includes("TESLA")) || (carInfo.textContent.toUpperCase().includes("INFINITI"))) {
        priceNumber = priceNumber + 180;
    } else {
        priceNumber = priceNumber +200;
    };
    
    priceNumber = priceNumber + (distance*0.621371*3); // adding distance rate

    let time = document.getElementById("selectedTime").value;

    if (time.includes("AM") && (parseInt(time) < 6 || parseInt(time) === 12)) {
        priceNumber = priceNumber * 1.25;
    };
    
    priceNumber = priceNumber * 1.32; //20% tips + 12% profit margin

    priceNumber = Math.ceil(priceNumber);

    priceSubtotal.textContent = "$" + priceNumber; //display subtotal

    taxNumber = priceNumber * 0.08;
    taxNumber = parseFloat(taxNumber.toFixed(2));

    priceTax.textContent = "$" + taxNumber;

    priceNumber = priceNumber + taxNumber;
    
    priceTotal.textContent = "$" + priceNumber;
    document.getElementById("priceInput").value = priceNumber;
    

    //Car image insertion
    //TODO: put correct files for all cars
    if (carInfo.textContent.toUpperCase().includes("SUBURBAN")) {
        carInfoImage.src = "./img/car-labels/suburban.png";
    };

    if (carInfo.textContent.toUpperCase().includes("TAHOE")) {
        carInfoImage.src = "./img/car-labels/tahoe.png";
    };

    if (carInfo.textContent.toUpperCase().includes("TESLA")) {
        carInfoImage.src = "./img/car-labels/tesla.webp";
    };

    if (carInfo.textContent.toUpperCase().includes("INFINITI")) {
        carInfoImage.src = "./img/car-labels/qx60.png";
    };

    //toggle visibility of booking form and order information
    hourlyBanner.classList.toggle("visually-hidden");
    bookingForm.classList.toggle("visually-hidden");
    orderDetails.classList.toggle("visually-hidden");
    orderPrice.classList.toggle("visually-hidden");
    detailsOpenBtnContainer.classList.toggle("visually-hidden");

    //Change headline
    if(headline.textContent === "Order Information") {
        headline.textContent = "Booking car trips";
    } else {
        headline.textContent = "Order Information";
    }
}

detailsOpenBtnMain.addEventListener("click", toggleDetails);
detailsOpenBtnArrow.addEventListener("click", toggleDetails);
detailsCloseBtn.addEventListener("click", toggleDetails);

// Map functions
let map, directionsService, directionsRenderer;
let departureValid = false, arrivalValid = false;
let stopsValid = [];

function initMap() {
    const location = { lat: 39.8563, lng: -104.6764 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: location
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const departureInput = document.getElementById('departure');
    const arrivalInput = document.getElementById('arrival');
    const departureError = document.getElementById('departure-error');
    const arrivalError = document.getElementById('arrival-error');
    const form = document.getElementById('bookingForm');

    const departureAutocomplete = new google.maps.places.Autocomplete(departureInput);
    const arrivalAutocomplete = new google.maps.places.Autocomplete(arrivalInput);
    departureAutocomplete.setFields(['address_component', 'geometry']);
    arrivalAutocomplete.setFields(['address_component', 'geometry']);

    departureAutocomplete.addListener('place_changed', function () {
        const place = departureAutocomplete.getPlace();
        departureValid = verifyAddress(place);
        if (!departureValid) {
            departureError.style.display = 'inline';
            departureInput.classList.add('invalid');
            detailsOpenBtnMain.classList.add("disabled");
            detailsOpenBtnArrow.classList.add("disabled");
        } else {
            departureError.style.display = 'none';
            departureInput.classList.remove('invalid');
            validateForm();
        }
    });

    arrivalAutocomplete.addListener('place_changed', function () {
        const place = arrivalAutocomplete.getPlace();
        arrivalValid = verifyAddress(place);
        if (!arrivalValid) {
            arrivalError.style.display = 'inline';
            arrivalInput.classList.add('invalid');
            detailsOpenBtnMain.classList.add("disabled");
            detailsOpenBtnArrow.classList.add("disabled");
        } else {
            arrivalError.style.display = 'none';
            arrivalInput.classList.remove('invalid');
            validateForm();
        }
    });

    // Assuming you have a button to add stops dynamically
    const addStopButton = document.getElementById('addStopButton');
    addStopButton.addEventListener('click', function () {
        const stopsContainer = document.getElementById('stopsContainer');
        const stopCount = stopsContainer.getElementsByClassName('stop-input').length + 1;

        if (stopCount <= 5) { // Limit to 5 stops
            const stopDiv = document.createElement('div');
            stopDiv.classList.add('stop-input');

            const stopInput = document.createElement('input');
            stopInput.type = 'text';
            stopInput.id = `stop${stopCount}`;
            stopInput.name = `stop${stopCount}`;
            stopInput.placeholder = `Stop ${stopCount} Address`;
            stopInput.required = true;
            stopDiv.appendChild(stopInput);
            let closeButton = document.createElement('button');
            closeButton.type = 'button';
            closeButton.textContent = '×';
            closeButton.classList.add('close-button');
            closeButton.addEventListener('click', function() {
                stopDiv.remove(); // Remove the stop input when close button is clicked
                stopInfo.remove();
                validateForm()
                // Re-enable addStopButton when an input is removed
                addStopButton.disabled = false;
                addStopButton.classList.remove('disabled');
            });
            stopDiv.appendChild(closeButton);

            const stopError = document.createElement('span');
            stopError.id = `stop${stopCount}-error`;
            stopError.classList.add("error-message");
            stopError.display = "none";
            stopError.textContent = "Please enter a valid arrival address.";
            stopDiv.appendChild(stopError);
            stopsContainer.appendChild(stopDiv);

            const stopInfoContainer = document.getElementById("arrival-container");
            const stopInfo = document.createElement('p');
            stopInfo.id = `stop${stopCount}-info`;
            stopInfo.textContent = "Unidentified stop";
            stopInfoContainer.appendChild(stopInfo);

            // Initialize Place Autocomplete for the new stop input
            const stopAutocomplete = new google.maps.places.Autocomplete(stopInput);
            stopAutocomplete.setFields(['address_component', 'geometry']);

            stopAutocomplete.addListener('place_changed', function () {
                const place = stopAutocomplete.getPlace();
                stopsValid[stopCount - 1] = verifyAddress(place); // Store validity for each stop

                // Optional: Display error for each stop if needed
                const stopError = document.getElementById(`stop${stopCount}-error`);
                if (!stopsValid[stopCount - 1]) {
                    stopError.style.display = 'inline';
                    stopInput.classList.add('invalid');
                    detailsOpenBtnMain.classList.add("disabled");
                    detailsOpenBtnArrow.classList.add("disabled");
                } else {
                    stopError.style.display = 'none';
                    stopInput.classList.remove('invalid');
                    stopInfo.textContent = stopInput.value;
                    validateForm();
                }
            });
        }

        // Disable addStopButton if maximum stops reached
        if (stopCount >= 5) {
            addStopButton.classList.add("disabled");
        }
    });

    form.addEventListener('submit', function (event) {
        let formValid = true;
        if (!departureValid) {
            departureError.style.display = 'inline';
            departureInput.classList.add('invalid');
            formValid = false;
        }
        if (!arrivalValid) {
            arrivalError.style.display = 'inline';
            arrivalInput.classList.add('invalid');
            formValid = false;
        }
        for (let i = 0; i < stopsValid.length; i++) {
            const stopInput = document.getElementById(`stop${i + 1}`);
            const stopError = document.getElementById(`stop${i + 1}-error`);
            if (!stopsValid[i]) {
                stopError.style.display = 'inline';
                stopInput.classList.add('invalid');
                formValid = false;
            } else {
                stopError.style.display = 'none';
                stopInput.classList.remove('invalid');
            }
        }
        if (!formValid) {
            event.preventDefault();
        }
    });
}

function verifyAddress(place) {
    if (!place.geometry) {
        return false;
    }

    const addressComponents = place.address_components;
    let street = false;
    let city = false;
    let country = false;

    for (let i = 0; i < addressComponents.length; i++) {
        const types = addressComponents[i].types;
        if (types.includes('street_number') || types.includes('route')) {
            street = true;
        }
        if (types.includes('locality') || types.includes('administrative_area_level_1')) {
            city = true;
        }
        if (types.includes('country')) {
            country = true;
        }
    }

    return street && city && country;
}

function calculateAndDisplayRoute() {
    const departureAddress = document.getElementById('departure').value;
    const arrivalAddress = document.getElementById('arrival').value;

    const stopsAddresses = [];
    const stopInputs = document.getElementsByClassName('stop-input');
    for (let i = 0; i < stopInputs.length; i++) {
        stopsAddresses.push(stopInputs[i].getElementsByTagName('input')[0].value);
    }

    directionsService.route({
        origin: departureAddress,
        destination: arrivalAddress,
        waypoints: stopsAddresses.map(address => ({ location: address, stopover: true })),
        optimizeWaypoints: false,
        travelMode: google.maps.TravelMode.DRIVING
    }, (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(response);
            
            const myroute = response.routes[0];
        
            if (!myroute) {
            return;
            }
        
            for (let i = 0; i < myroute.legs.length; i++) {
                distance += myroute.legs[i].distance.value;
            }
        
            distance = distance / 1000;
        } else {
            detailsOpenBtnMain.classList.add("disabled");
            detailsOpenBtnArrow.classList.add("disabled");
        }
    });
}

let distance = 0;

window.initMap = initMap;