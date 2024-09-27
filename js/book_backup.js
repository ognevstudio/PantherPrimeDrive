document.addEventListener("DOMContentLoaded", () => {
    // Car selection functionality
    const customSelect = document.querySelector(".custom-select");
    const selectBtn = document.getElementById("select-button");
    const detailsOpenBtn = document.getElementById("details-open-button");
    const detailsCloseBtn = document.getElementById(details-close-button);
    const selectedValue = document.querySelector(".selected-value");
    const optionsList = document.querySelectorAll(".select-dropdown li");
    const hiddenCarInput = document.getElementById("selectedCar");
    const carError = document.getElementById("car-error");
    const priceBlock = document.getElementById("price-block");
    const detailsBlock = document.getElementById("details-block");

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

    // Validate Car Selection
    function validateCarSelection() {
        const hiddenCarInput = document.getElementById("selectedCar");
        const carError = document.getElementById("car-error");

        if (!hiddenCarInput.value) {
            carError.style.display = "block";
            if (hiddenCarInput.closest('.custom-select')) {
                hiddenCarInput.closest('.custom-select').classList.add("invalid");
            }
            return false;
        } else {
            carError.style.display = "none";
            if (hiddenCarInput.closest('.custom-select')) {
                hiddenCarInput.closest('.custom-select').classList.remove("invalid");
            }
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
            return false;
        } else {
            nameError.style.display = "none";
            nameInput.classList.remove("invalid");
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
            return false;
        } else {
            emailError.style.display = "none";
            emailInput.classList.remove("invalid");
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
            return false;
        } else {
            phoneError.style.display = "none";
            phoneInput.classList.remove("invalid");
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
            return false;
        } else {
            privacyPolicyError.style.display = "none";
            privacyPolicyCheckbox.classList.remove("invalid");
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
            return false;
        } else {
            dateError.style.display = "none";
            dateInput.classList.remove("invalid");
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
            return false;
        } else {
            timeError.style.display = "none";
            timeInput.classList.remove("invalid");
            return true;
        }
    }

    // Validate Form
    function validateForm() {
        const isValidName = validateName();
        const isValidEmail = validateEmail();
        const isValidPhone = validatePhone();
        const isValidPrivacyPolicy = validatePrivacyPolicy();
        const isValidDate = validateDate();
        const isValidTime = validateTime();
        const isValidCarSelection = validateCarSelection();

        return isValidName && isValidEmail && isValidPhone && isValidPrivacyPolicy && isValidDate && isValidTime && isValidCarSelection;
    }

    const bookingForm = document.getElementById("bookingForm");
    bookingForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let valid = true;


        if (!validateCarSelection()) {
            valid = false;
        }


        if (!validateDate()) {
            valid = false;
        }


        if (!validateTime()) {
            valid = false;
        }


        const departureInput = document.getElementById("departure");
        const departureError = document.getElementById("departure-error");
        if (!departureInput.value || !departureValid) {
            departureError.style.display = 'inline';
            departureInput.classList.add('invalid');
            valid = false;
        } else {
            departureError.style.display = 'none';
            departureInput.classList.remove('invalid');
        }


        const arrivalInput = document.getElementById("arrival");
        const arrivalError = document.getElementById("arrival-error");
        if (!arrivalInput.value || !arrivalValid) {
            arrivalError.style.display = 'inline';
            arrivalInput.classList.add('invalid');
            valid = false;
        } else {
            arrivalError.style.display = 'none';
            arrivalInput.classList.remove('invalid');
        }


        if (!validateName()) {
            valid = false;
        }


        if (!validateEmail()) {
            valid = false;
        }


        if (!validatePhone()) {
            valid = false;
        }


        if (!validatePrivacyPolicy()) {
            valid = false;
        }

        // If all fields are valid, calculate route and show alert
        if (valid) {
            calculateAndDisplayRoute();
        }
    });

    // Add input event listeners for immediate validation
    document.getElementById("name").addEventListener("input", validateName);
    document.getElementById("email").addEventListener("input", validateEmail);
    document.getElementById("phone").addEventListener("input", validatePhone);
    document.getElementById("date").addEventListener("change", validateDate);
    document.getElementById("time-select-dropdown").addEventListener("click", validateTime);
    document.getElementById("privacyPolicy").addEventListener("change", validatePrivacyPolicy);




    
//details opening and closing

  /*  const detailsOpenBtn = document.getElementById("details-open-button");
    const detailsCloseBtn = document.getElementById(details-close-button);
    const priceBlock = document.getElementById("price-block");
    const detailsBlock = document.getElementById("details-block");
    const bookingForm = document.getElementById("bookingForm");


detailsOpenBtn.addEventListener('click'), function () {
    bookingForm.classList.add('visually-hidden');
    priceBlock.classList.remove('visually-hidden');
    detailsBlock.classList.remove('visually-hidden');
}

detailsCloseBtn.addEventListener('click'), function () {
    bookingForm.classList.remove('visually-hidden');
    priceBlock.classList.add('visually-hidden');
    detailsBlock.classList.add('visually-hidden');
}
*/


});
/*

// // Initialize Google Maps and Address Autocomplete
// let map, directionsService, directionsRenderer;
// let departureValid = false, arrivalValid = false;

// function initMap() {
//     const location = { lat: 39.8563, lng: -104.6764 };
//     map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 10, center: location
//     });

//     directionsService = new google.maps.DirectionsService();
//     directionsRenderer = new google.maps.DirectionsRenderer();
//     directionsRenderer.setMap(map);

//     const departureInput = document.getElementById('departure');
//     const arrivalInput = document.getElementById('arrivalInput');
//     const departureError = document.getElementById('departure-error');
//     const arrivalError = document.getElementById('arrival-error');
//     const form = document.getElementById('bookingForm');

//     const departureAutocomplete = new google.maps.places.Autocomplete(departureInput);
//     const arrivalAutocomplete = new google.maps.places.Autocomplete(arrivalInput);
//     departureAutocomplete.setFields(['address_component', 'geometry']);
//     arrivalAutocomplete.setFields(['address_component', 'geometry']);

//     departureAutocomplete.addListener('place_changed', function () {
//         const place = departureAutocomplete.getPlace();
//         departureValid = verifyAddress(place);
//         if (!departureValid) {
//             departureError.style.display = 'inline';
//             departureInput.classList.add('invalid');
//         } else {
//             departureError.style.display = 'none';
//             departureInput.classList.remove('invalid');
//         }
//     });

//     arrivalAutocomplete.addListener('place_changed', function () {
//         const place = arrivalAutocomplete.getPlace();
//         arrivalValid = verifyAddress(place);
//         if (!arrivalValid) {
//             arrivalError.style.display = 'inline';
//             arrivalInput.classList.add('invalid');
//         } else {
//             arrivalError.style.display = 'none';
//             arrivalInput.classList.remove('invalid');
//         }
//     });

//     form.addEventListener('submit', function (event) {
//         if (!departureValid || !arrivalValid) {
//             event.preventDefault();
//             if (!departureValid) {
//                 departureError.style.display = 'inline';
//                 departureInput.classList.add('invalid');
//             }
//             if (!arrivalValid) {
//                 arrivalError.style.display = 'inline';
//                 arrivalInput.classList.add('invalid');
//             }
//         } else {
//             departureError.style.display = 'none';
//             arrivalError.style.display = 'none';
//         }
//     });
// }

// function verifyAddress(place) {
//     if (!place.geometry) {
//         return false;
//     }

//     const addressComponents = place.address_components;
//     let street = false;
//     let city = false;
//     let country = false;

//     for (let i = 0; i < addressComponents.length; i++) {
//         const types = addressComponents[i].types;
//         if (types.includes('street_number') || types.includes('route')) {
//             street = true;
//         }
//         if (types.includes('locality') || types.includes('administrative_area_level_1')) {
//             city = true;
//         }
//         if (types.includes('country')) {
//             country = true;
//         }
//     }

//     return street && city && country;
// }

// function calculateAndDisplayRoute() {
//     const departureAddress = document.getElementById('departure').value;
//     const arrivalAddress = document.getElementById('arrival').value;

//     directionsService.route({
//         origin: departureAddress,
//         destination: arrivalAddress,
//         travelMode: google.maps.TravelMode.DRIVING
//     }, (response, status) => {
//         if (status === google.maps.DirectionsStatus.OK) {
//             directionsRenderer.setDirections(response);
//             // After displaying the route, show alert
//             alert("Form submitted!");
//         } else {
//             window.alert('Directions request failed due to ' + status);
//         }
//     });
// }

// window.initMap = initMap;

// document.addEventListener('DOMContentLoaded', function() {
//     var addStopButton = document.getElementById('addStopButton');
//     var stopsContainer = document.getElementById('stopsContainer');
    
//     if (addStopButton && stopsContainer) {
//         addStopButton.addEventListener('click', function() {
//             // Create a new stop input
//             var stopDiv = document.createElement('div');
//             stopDiv.classList.add('stop-input');

//             var stopInput = document.createElement('input');
//             stopInput.type = 'text';
//             stopInput.name = 'stop[]'; // Use array notation for submission
//             stopInput.placeholder = 'Stop Address'; // Placeholder text
//             stopDiv.appendChild(stopInput);

//             var closeButton = document.createElement('button');
//             closeButton.type = 'button';
//             closeButton.textContent = '×';
//             closeButton.classList.add('close-button');
//             closeButton.addEventListener('click', function() {
//                 stopDiv.remove(); // Remove the stop input when close button is clicked
//                 // Re-enable addStopButton when an input is removed
//                 addStopButton.disabled = false;
//                 addStopButton.classList.remove('disabled');
//             });
//             stopDiv.appendChild(closeButton);

//             // Insert the new stop input before the addStopButton
//             stopsContainer.insertBefore(stopDiv, addStopButton);

//             // Disable addStopButton when maximum stops reached (5 stops)
//             if (stopsContainer.querySelectorAll('.stop-input').length >= 5) {
//                 addStopButton.disabled = true;
//                 addStopButton.classList.add('disabled');
//             }
//         });
//     } else {
//         console.error('stopsContainer or addStopButton element not found.');
//     }

// // Function to initialize Google Places Autocomplete for stop inputs and verify addresses
// function initStopAutocomplete() {
//     const stopsContainer = document.getElementById('stopsContainer');

//     stopsContainer.addEventListener('input', function(event) {
//         const target = event.target;

//         // Check if the input is a stop input
//         if (target && target.classList.contains('stop-input') && target.tagName === 'INPUT') {
//             const autocomplete = new google.maps.places.Autocomplete(target);
//             autocomplete.setFields(['address_component', 'geometry']);

//             autocomplete.addListener('place_changed', function() {
//                 const place = autocomplete.getPlace();
//                 const stopValid = verifyAddress(place);

//                 if (!stopValid) {
//                     target.classList.add('invalid');
//                 } else {
//                     target.classList.remove('invalid');
//                 }
//             });
//         }
//     });
// }

// // Function to verify address components
// function verifyAddress(place) {
//     if (!place.geometry) {
//         return false;
//     }

//     const addressComponents = place.address_components;
//     let street = false;
//     let city = false;
//     let country = false;

//     for (let i = 0; i < addressComponents.length; i++) {
//         const types = addressComponents[i].types;
//         if (types.includes('street_number') || types.includes('route')) {
//             street = true;
//         }
//         if (types.includes('locality') || types.includes('administrative_area_level_1')) {
//             city = true;
//         }
//         if (types.includes('country')) {
//             country = true;
//         }
//     }

//     return street && city && country;
// }

// // Function to initialize Google Places Autocomplete for arrival and departure addresses

//     // Initialize Google Places Autocomplete for stops' addresses and address verification
//     initStopAutocomplete();
// });

*/

   
    

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
    const arrivalInput = document.getElementById('arrivalInput');
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
        } else {
            departureError.style.display = 'none';
            departureInput.classList.remove('invalid');
        }
    });

    arrivalAutocomplete.addListener('place_changed', function () {
        const place = arrivalAutocomplete.getPlace();
        arrivalValid = verifyAddress(place);
        if (!arrivalValid) {
            arrivalError.style.display = 'inline';
            arrivalInput.classList.add('invalid');
        } else {
            arrivalError.style.display = 'none';
            arrivalInput.classList.remove('invalid');
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

            stopsContainer.appendChild(stopDiv);

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
                } else {
                    stopError.style.display = 'none';
                    stopInput.classList.remove('invalid');
                }
            });
        }

        // Disable addStopButton if maximum stops reached
        if (stopCount === 5) {
            addStopButton.disabled = true;
            addStopButton.style.backgroundColor = 'gray';
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
    const arrivalAddress = document.getElementById('arrivalInput').value;

    const stopsAddresses = [];
    const stopInputs = document.getElementsByClassName('stop-input');
    for (let i = 0; i < stopInputs.length; i++) {
        stopsAddresses.push(stopInputs[i].getElementsByTagName('input')[0].value);
    }

    directionsService.route({
        origin: departureAddress,
        destination: arrivalAddress,
        waypoints: stopsAddresses.map(address => ({ location: address, stopover: true })),
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING
    }, (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(response);
            // After displaying the route, show alert
            alert("Form submitted!");
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

window.initMap = initMap;


/*
// document.addEventListener("DOMContentLoaded", () => {
//     const customSelect = document.querySelector(".custom-select");
//     const selectBtn = document.getElementById("select-button");
//     const selectedValue = document.querySelector(".selected-value");
//     const optionsList = document.querySelectorAll(".select-dropdown li");
//     const hiddenCarInput = document.getElementById("selectedCar");
//     const carError = document.getElementById("car-error");

//     selectBtn.addEventListener("click", () => {
//         customSelect.classList.toggle("active");
//         const expanded = selectBtn.getAttribute("aria-expanded") === "true" ? "false" : "true";
//         selectBtn.setAttribute("aria-expanded", expanded);
//     });

//     optionsList.forEach((option) => {
//         option.addEventListener("click", function () {
//             const selectedOption = this.querySelector("label").cloneNode(true);
//             selectedValue.innerHTML = '';
//             selectedValue.appendChild(selectedOption);
//             hiddenCarInput.value = this.querySelector("label").getAttribute("value");
//             customSelect.classList.remove("active");
//             selectBtn.setAttribute("aria-expanded", "false");
//             validateCarSelection(); // Trigger validation immediately
//         });

//         option.addEventListener("keyup", function (e) {
//             if (e.key === "Enter") {
//                 const selectedOption = this.querySelector("label").cloneNode(true);
//                 selectedValue.innerHTML = '';
//                 selectedValue.appendChild(selectedOption);
//                 hiddenCarInput.value = this.querySelector("label").getAttribute("value");
//                 customSelect.classList.remove("active");
//                 selectBtn.setAttribute("aria-expanded", "false");
//                 validateCarSelection(); // Trigger validation immediately
//             }
//         });
//     });

//     document.addEventListener("click", (event) => {
//         if (!customSelect.contains(event.target)) {
//             customSelect.classList.remove("active");
//             selectBtn.setAttribute("aria-expanded", "false");
//         }
//     });

//     // Date picker configuration
//     const now = new Date();
//     flatpickr("#date", {
//         dateFormat: "d/m/Y",
//         minDate: now, // Same day
//         maxDate: new Date(new Date().setMonth(now.getMonth() + 4)), // 4 months ahead without mutating now
//         onDayCreate: function (dObj, dStr, fp, dayElem) {
//             dayElem.style.backgroundColor = "#FAF8F5"; // Custom background color
//             if (dayElem.classList.contains("today")) {
//                 dayElem.style.backgroundColor = "#45513D"; // Today's date background color
//                 dayElem.style.color = "#fff"; // Today's date text color
//             }
//         },
//         onChange: function(selectedDates, dateStr, instance) {
//             const selectedDate = selectedDates[0];
//             populateTimeDropdown(selectedDate);
//             validateDate();
//         }
//     });

//     // Time dropdown functionality
//     const timeSelectButton = document.getElementById("time-select-button");
//     const customTimeSelect = document.getElementById("custom-time-select");
//     const timeDropdown = document.getElementById("time-select-dropdown");

//     timeSelectButton.addEventListener("click", () => {
//         customTimeSelect.classList.toggle("active");
//         const expanded = timeSelectButton.getAttribute("aria-expanded") === "true" ? "false" : "true";
//         timeSelectButton.setAttribute("aria-expanded", expanded);
//     });

//     timeDropdown.addEventListener("click", (event) => {
//         if (event.target && event.target.nodeName === "LI") {
//             const timeSelectedValue = document.querySelector("#time-select-button .selected-time-value");
//             const hiddenTimeInput = document.getElementById("selectedTime");
//             timeSelectedValue.textContent = event.target.textContent;
//             hiddenTimeInput.value = event.target.dataset.value;
//             customTimeSelect.classList.remove("active");
//             timeSelectButton.setAttribute("aria-expanded", "false");
//             validateTime();
//         }
//     });

//     document.addEventListener("click", (event) => {
//         if (!timeSelectButton.contains(event.target) && !timeDropdown.contains(event.target)) {
//             customTimeSelect.classList.remove("active");
//             timeSelectButton.setAttribute("aria-expanded", "false");
//         }
//     });

//     // Initialize Google Maps and Address Autocomplete
//     let map, directionsService, directionsRenderer;
//     let departureValid = false, arrivalValid = false;

//     function initMap() {
        
//         const location = { lat: 39.8563, lng: -104.6764 };
//         map = new google.maps.Map(document.getElementById('map'), {
//             zoom: 10, center: location
//         });

//         directionsService = new google.maps.DirectionsService();
//         directionsRenderer = new google.maps.DirectionsRenderer();
//         directionsRenderer.setMap(map);

//         const departureInput = document.getElementById('departure');
//         const arrivalInput = document.getElementById('arrival');
//         const departureError = document.getElementById('departure-error');
//         const arrivalError = document.getElementById('arrival-error');
//         const form = document.getElementById('bookingForm');

//         const departureAutocomplete = new google.maps.places.Autocomplete(departureInput);
//         const arrivalAutocomplete = new google.maps.places.Autocomplete(arrivalInput);
//         departureAutocomplete.setFields(['address_component', 'geometry']);
//         arrivalAutocomplete.setFields(['address_component', 'geometry']);

//         departureAutocomplete.addListener('place_changed', function () {
//             const place = departureAutocomplete.getPlace();
//             departureValid = verifyAddress(place);
//             if (!departureValid) {
//                 departureError.style.display = 'inline';
//                 departureInput.classList.add('invalid');
//             } else {
//                 departureError.style.display = 'none';
//                 departureInput.classList.remove('invalid');
//             }
//         });

//         arrivalAutocomplete.addListener('place_changed', function () {
//             const place = arrivalAutocomplete.getPlace();
//             arrivalValid = verifyAddress(place);
//             if (!arrivalValid) {
//                 arrivalError.style.display = 'inline';
//                 arrivalInput.classList.add('invalid');
//             } else {
//                 arrivalError.style.display = 'none';
//                 arrivalInput.classList.remove('invalid');
//             }
//         });

//         form.addEventListener('submit', function (event) {
//             if (!departureValid || !arrivalValid) {
//                 event.preventDefault();
//                 if (!departureValid) {
//                     departureError.style.display = 'inline';
//                     departureInput.classList.add('invalid');
//                 }
//                 if (!arrivalValid) {
//                     arrivalError.style.display = 'inline';
//                     arrivalInput.classList.add('invalid');
//                 }
//             } else {
//                 departureError.style.display = 'none';
//                 arrivalError.style.display = 'none';
//             }
//         });
//     }

//     function verifyAddress(place) {
//         if (!place.geometry) {
//             return false;
//         }

//         const addressComponents = place.address_components;
//         let street = false;
//         let city = false;
//         let country = false;

//         for (let i = 0; i < addressComponents.length; i++) {
//             const types = addressComponents[i].types;
//             if (types.includes('street_number') || types.includes('route')) {
//                 street = true;
//             }
//             if (types.includes('locality') || types.includes('administrative_area_level_1')) {
//                 city = true;
//             }
//             if (types.includes('country')) {
//                 country = true;
//             }
//         }

//         return street && city && country;
//     }

//     function calculateAndDisplayRoute() {
//         const departureAddress = document.getElementById('departure').value;
//         const arrivalAddress = document.getElementById('arrival').value;

//         directionsService.route({
//             origin: departureAddress,
//             destination: arrivalAddress,
//             travelMode: google.maps.TravelMode.DRIVING
//         }, (response, status) => {
//             if (status === google.maps.DirectionsStatus.OK) {
//                 directionsRenderer.setDirections(response);
//                 // After displaying the route, show alert
//                 alert("Form submitted!");
//             } else {
//                 window.alert('Directions request failed due to ' + status);
//             }
//         });
//     }

//     window.initMap = initMap;

//     // Function to add stops
//     const addStopButton = document.getElementById('addStopButton');
//     const stopsContainer = document.getElementById('stopsContainer');

//     if (addStopButton && stopsContainer) {
//         addStopButton.addEventListener('click', function () {
//             if (stopsContainer.querySelectorAll('.stop-input').length < 5) {
//                 const stopDiv = document.createElement('div');
//                 stopDiv.classList.add('stop-input');

//                 const stopInput = document.createElement('input');
//                 stopInput.type = 'text';
//                 stopInput.name = 'stop[]';
//                 stopDiv.appendChild(stopInput);

//                 const closeButton = document.createElement('button');
//                 closeButton.type = 'button';
//                 closeButton.textContent = '×';
//                 closeButton.classList.add('close-button');
//                 closeButton.addEventListener('click', function () {
//                     stopDiv.remove();
//                 });
//                 stopDiv.appendChild(closeButton);

//                 stopsContainer.insertBefore(stopDiv, addStopButton);

//                 if (stopsContainer.querySelectorAll('.stop-input').length >= 5) {
//                     addStopButton.disabled = true;
//                     addStopButton.classList.add('disabled');
//                 }
//             }
//         });
//     } else {
//         console.error('stopsContainer or addStopButton element not found.');
//     }

//     // Form submission validation
//     const bookingForm = document.getElementById("bookingForm");
//     bookingForm.addEventListener("submit", (e) => {
//         e.preventDefault();
//         let valid = true;

//         if (!validateCarSelection()) {
//             valid = false;
//         }

//         if (!validateDate()) {
//             valid = false;
//         }

//         if (!validateTime()) {
//             valid = false;
//         }

//         if (!validateAddresses()) {
//             valid = false;
//         }

//         if (valid) {
//             calculateAndDisplayRoute();
//         } else {
//             console.log("Form validation failed.");
//         }
//     });

//     function validateCarSelection() {
//         const selectedCar = hiddenCarInput.value;
//         const carError = document.getElementById("car-error");

//         if (!selectedCar) {
//             carError.style.display = "inline";
//             return false;
//         } else {
//             carError.style.display = "none";
//             return true;
//         }
//     }

//     function validateDate() {
//         const dateInput = document.getElementById("date");
//         const dateError = document.getElementById("date-error");

//         if (!dateInput.value) {
//             dateError.style.display = "inline";
//             return false;
//         } else {
//             dateError.style.display = "none";
//             return true;
//         }
//     }

//     function validateTime() {
//         const selectedTime = document.getElementById("selectedTime").value;
//         const timeError = document.getElementById("time-error");

//         if (!selectedTime) {
//             timeError.style.display = "inline";
//             return false;
//         } else {
//             timeError.style.display = "none";
//             return true;
//         }
//     }

//     function validateAddresses() {
//         const departureInput = document.getElementById("departure");
//         const arrivalInput = document.getElementById("arrival");
//         const departureError = document.getElementById("departure-error");
//         const arrivalError = document.getElementById("arrival-error");

//         if (!departureInput.value) {
//             departureError.style.display = "inline";
//             return false;
//         } else {
//             departureError.style.display = "none";
//         }

//         if (!arrivalInput.value) {
//             arrivalError.style.display = "inline";
//             return false;
//         } else {
//             arrivalError.style.display = "none";
//         }

//         return true;
//     }

//     // Function to populate time dropdown based on selected date
//     function populateTimeDropdown(selectedDate) {
//         const today = new Date();
//         const timeDropdown = document.getElementById("time-select-dropdown");
//         timeDropdown.innerHTML = ''; // Clear previous options

//         if (selectedDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
//             // If selected date is today, start from current time + 2 hours
//             const startHour = Math.ceil(today.getHours() + 2);
//             for (let hour = startHour; hour < 24; hour++) {
//                 for (let minutes = 0; minutes < 60; minutes += 30) {
//                     const option = document.createElement("li");
//                     const timeValue = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
//                     option.textContent = timeValue;
//                     option.dataset.value = timeValue;
//                     timeDropdown.appendChild(option);
//                 }
//             }
//         } else {
//             // Otherwise, start from 00:00
//             for (let hour = 0; hour < 24; hour++) {
//                 for (let minutes = 0; minutes < 60; minutes += 30) {
//                     const option = document.createElement("li");
//                     const timeValue = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
//                     option.textContent = timeValue;
//                     option.dataset.value = timeValue;
//                     timeDropdown.appendChild(option);
//                 }
//             }
//         }
//     }
// });
// document.addEventListener("DOMContentLoaded", () => {
//     // Car selection functionality
//     const customSelect = document.querySelector(".custom-select");
//     const selectBtn = document.getElementById("select-button");
//     const selectedValue = document.querySelector(".selected-value");
//     const optionsList = document.querySelectorAll(".select-dropdown li");
//     const hiddenCarInput = document.getElementById("selectedCar");

//     selectBtn.addEventListener("click", () => {
//         customSelect.classList.toggle("active");
//         const expanded = selectBtn.getAttribute("aria-expanded") === "true" ? "false" : "true";
//         selectBtn.setAttribute("aria-expanded", expanded);
//     });

//     optionsList.forEach((option) => {
//         option.addEventListener("click", function () {
//             const selectedOption = this.querySelector("label").cloneNode(true);
//             selectedValue.innerHTML = '';
//             selectedValue.appendChild(selectedOption);
//             hiddenCarInput.value = this.querySelector("label").getAttribute("value");
//             customSelect.classList.remove("active");
//             selectBtn.setAttribute("aria-expanded", "false");
//         });

//         option.addEventListener("keyup", function (e) {
//             if (e.key === "Enter") {
//                 const selectedOption = this.querySelector("label").cloneNode(true);
//                 selectedValue.innerHTML = '';
//                 selectedValue.appendChild(selectedOption);
//                 hiddenCarInput.value = this.querySelector("label").getAttribute("value");
//                 customSelect.classList.remove("active");
//                 selectBtn.setAttribute("aria-expanded", "false");
//             }
//         });
//     });

//     document.addEventListener("click", (event) => {
//         if (!customSelect.contains(event.target)) {
//             customSelect.classList.remove("active");
//             selectBtn.setAttribute("aria-expanded", "false");
//         }
//     });

//     // Date picker configuration
//     const now = new Date();
//     flatpickr("#date", {
//         dateFormat: "d/m/Y",
//         minDate: now, // Same day
//         maxDate: new Date(new Date().setMonth(now.getMonth() + 4)), // 4 months ahead without mutating now
//         onDayCreate: function (dObj, dStr, fp, dayElem) {
//             dayElem.style.backgroundColor = "#FAF8F5"; // Custom background color
//             if (dayElem.classList.contains("today")) {
//                 dayElem.style.backgroundColor = "#45513D"; // Today's date background color
//                 dayElem.style.color = "#fff"; // Today's date text color
//             }
//         },
//         onChange: function(selectedDates, dateStr, instance) {
//             const selectedDate = selectedDates[0];
//             populateTimeDropdown(selectedDate);
//         }
//     });

//     // Initial population of the time dropdown based on the current date
//     populateTimeDropdown(now);

//     function populateTimeDropdown(selectedDate) {
//         const timeDropdown = document.getElementById("time-select-dropdown");
//         const timeSelectedValue = document.querySelector("#time-select-button .selected-time-value");
//         const hiddenTimeInput = document.getElementById("selectedTime");
//         timeDropdown.innerHTML = ''; // Clear existing options
//         timeSelectedValue.textContent = "Select a time"; // Reset selected time text
//         hiddenTimeInput.value = ''; // Reset hidden input value

//         let currentTime = new Date();
//         currentTime.setMinutes(0, 0, 0, 0); // Set minutes, seconds, and milliseconds to 0

//         if (isSameDay(selectedDate, currentTime)) {
//             currentTime.setHours(currentTime.getHours() + 2); // 2 hours from current time for today
//             const endOfDay = new Date(currentTime);
//             endOfDay.setHours(23, 30, 0, 0); // End of the current day at 11:30 PM

//             while (currentTime <= endOfDay) {
//                 const option = document.createElement("li");
//                 option.role = "option";
//                 option.textContent = formatTime(currentTime);
//                 option.dataset.value = formatTime(currentTime);
//                 timeDropdown.appendChild(option);
//                 currentTime.setMinutes(currentTime.getMinutes() + 30);
//             }
//         } else {
//             currentTime = new Date(selectedDate);
//             currentTime.setHours(0, 0, 0, 0); // Start from midnight for future dates
//             const endOfDay = new Date(selectedDate);
//             endOfDay.setHours(23, 30, 0, 0); // End of the selected day at 11:30 PM

//             while (currentTime <= endOfDay) {
//                 const option = document.createElement("li");
//                 option.role = "option";
//                 option.textContent = formatTime(currentTime);
//                 option.dataset.value = formatTime(currentTime);
//                 timeDropdown.appendChild(option);
//                 currentTime.setMinutes(currentTime.getMinutes() + 30);
//             }
//         }
//     }

//     function formatTime(date) {
//         let hours = date.getHours();
//         const minutes = date.getMinutes().toString().padStart(2, '0');
//         const ampm = hours >= 12 ? 'PM' : 'AM';
//         hours = hours % 12;
//         hours = hours ? hours : 12; // The hour '0' should be '12'
//         return `${hours}:${minutes} ${ampm}`;
//     }

//     function isSameDay(date1, date2) {
//         return date1.getFullYear() === date2.getFullYear() &&
//             date1.getMonth() === date2.getMonth() &&
//             date1.getDate() === date2.getDate();
//     }

//     // Time dropdown functionality
//     const timeSelectButton = document.getElementById("time-select-button");
//     const customTimeSelect = document.getElementById("custom-time-select");
//     const timeDropdown = document.getElementById("time-select-dropdown");

//     timeSelectButton.addEventListener("click", () => {
//         customTimeSelect.classList.toggle("active");
//         const expanded = timeSelectButton.getAttribute("aria-expanded") === "true" ? "false" : "true";
//         timeSelectButton.setAttribute("aria-expanded", expanded);
//     });

//     timeDropdown.addEventListener("click", (event) => {
//         if (event.target && event.target.nodeName === "LI") {
//             const timeSelectedValue = document.querySelector("#time-select-button .selected-time-value");
//             const hiddenTimeInput = document.getElementById("selectedTime");
//             timeSelectedValue.textContent = event.target.textContent;
//             hiddenTimeInput.value = event.target.dataset.value;
//             customTimeSelect.classList.remove("active");
//             timeSelectButton.setAttribute("aria-expanded", "false");
//         }
//     });

//     document.addEventListener("click", (event) => {
//         if (!timeSelectButton.contains(event.target) && !timeDropdown.contains(event.target)) {
//             customTimeSelect.classList.remove("active");
//             timeSelectButton.setAttribute("aria-expanded", "false");
//         }
//     });

//     function validateName() {
//         const nameInput = document.getElementById("name");
//         const nameError = document.getElementById("name-error");
//         const namePattern = /^[A-Za-z\s]+$/;
    
//         if (!nameInput.value.trim() || !namePattern.test(nameInput.value) || nameInput.value.length > 50) {
//             nameError.style.display = "block";
//             nameInput.classList.add("invalid");
//             return false;
//         } else {
//             nameError.style.display = "none";
//             nameInput.classList.remove("invalid");
//             return true;
//         }
//     }
    
//     // Validate Email
//     function validateEmail() {
//         const emailInput = document.getElementById("email");
//         const emailError = document.getElementById("email-error");
//         const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
//         if (!emailInput.value.trim() || !emailPattern.test(emailInput.value)) {
//             emailError.style.display = "block";
//             emailInput.classList.add("invalid");
//             return false;
//         } else {
//             emailError.style.display = "none";
//             emailInput.classList.remove("invalid");
//             return true;
//         }
//     }
    
//     // Validate Phone
//     function validatePhone() {
//         const phoneInput = document.getElementById("phone");
//         const phoneError = document.getElementById("phone-error");
//         const phonePattern = /^[0-9]{10}$/;
    
//         if (!phoneInput.value.trim() || !phonePattern.test(phoneInput.value)) {
//             phoneError.style.display = "block";
//             phoneInput.classList.add("invalid");
//             return false;
//         } else {
//             phoneError.style.display = "none";
//             phoneInput.classList.remove("invalid");
//             return true;
//         }
//     }
    
//     // Validate Privacy Policy
//     function validatePrivacyPolicy() {
//         const privacyPolicyCheckbox = document.getElementById("privacyPolicy");
//         const privacyPolicyError = document.getElementById("privacy-policy-error");
    
//         if (!privacyPolicyCheckbox.checked) {
//             privacyPolicyError.style.display = "block";
//             privacyPolicyCheckbox.classList.add("invalid");
//             return false;
//         } else {
//             privacyPolicyError.style.display = "none";
//             privacyPolicyCheckbox.classList.remove("invalid");
//             return true;
//         }
//     }

//     function validateForm() {
//         const isValidName = validateName();
//         const isValidEmail = validateEmail();
//         const isValidPhone = validatePhone();
//         const isValidPrivacyPolicy = validatePrivacyPolicy();
    
//         return isValidName && isValidEmail && isValidPhone && isValidPrivacyPolicy;
//     }
    

//     const bookingForm = document.getElementById("bookingForm");
//     bookingForm.addEventListener("submit", (e) => {
//         e.preventDefault();
//         let valid = true;

//         // Validate Car Selection
//         const carError = document.getElementById("car-error");
//         if (!hiddenCarInput.value) {
//             carError.style.display = "block";
//             if (hiddenCarInput.closest('.custom-select')) {
//                 hiddenCarInput.closest('.custom-select').classList.add('invalid');
//             }
//             valid = false;
//         } else {
//             carError.style.display = "none";
//             if (hiddenCarInput.closest('.custom-select')) {
//                 hiddenCarInput.closest('.custom-select').classList.remove('invalid');
//             }
//         }

//         // Validate Date
//         const date = document.getElementById("date");
//         const dateError = document.getElementById("date-error");
//         if (!date.value) {
//             dateError.style.display = "block";
//             date.classList.add('invalid');
//             valid = false;
//         } else {
//             dateError.style.display = "none";
//             date.classList.remove('invalid');
//         }

//         // Validate Time
//         const selectedTime = document.getElementById("selectedTime");
//         const timeError = document.getElementById("time-error");
//         if (!selectedTime.value) {
//             timeError.style.display = "block";
//             if (selectedTime.closest('.custom-time-select')) {
//                 selectedTime.closest('.custom-time-select').classList.add('invalid');
//             }
//             valid = false;
//         } else {
//             timeError.style.display = "none";
//             if (selectedTime.closest('.custom-time-select')) {
//                 selectedTime.closest('.custom-time-select').classList.remove('invalid');
//             }
//         }

//         // Validate Departure Address
//         const departureInput = document.getElementById("departure");
//         const departureError = document.getElementById("departure-error");
//         if (!departureInput.value || !departureValid) {
//             departureError.style.display = 'inline';
//             departureInput.classList.add('invalid');
//             valid = false;
//         } else {
//             departureError.style.display = 'none';
//             departureInput.classList.remove('invalid');
//         }

//         // Validate Arrival Address
//         const arrivalInput = document.getElementById("arrival");
//         const arrivalError = document.getElementById("arrival-error");
//         if (!arrivalInput.value || !arrivalValid) {
//             arrivalError.style.display = 'inline';
//             arrivalInput.classList.add('invalid');
//             valid = false;
//         } else {
//             arrivalError.style.display = 'none';
//             arrivalInput.classList.remove('invalid');
//         }

//         // Validate Name
//         if (!validateName()) {
//             valid = false;
//         }

//         // Validate Email
//         if (!validateEmail()) {
//             valid = false;
//         }

//         // Validate Phone
//         if (!validatePhone()) {
//             valid = false;
//         }

//         // Validate Privacy Policy
//         if (!validatePrivacyPolicy()) {
//             valid = false;
//         }

//         // If all fields are valid, calculate route and show alert
//         if (valid) {
//             calculateAndDisplayRoute();
//         }
//     });
// });

// // Initialize Google Maps and Address Autocomplete
// let map, directionsService, directionsRenderer;
// let departureValid = false, arrivalValid = false;

// function initMap() {
//     const location = { lat: 39.8563, lng: -104.6764 };
//     map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 10,
//         center: location
//     });

//     directionsService = new google.maps.DirectionsService();
//     directionsRenderer = new google.maps.DirectionsRenderer();
//     directionsRenderer.setMap(map);

//     const departureInput = document.getElementById('departure');
//     const arrivalInput = document.getElementById('arrival');
//     const departureError = document.getElementById('departure-error');
//     const arrivalError = document.getElementById('arrival-error');
//     const form = document.getElementById('bookingForm');

//     const departureAutocomplete = new google.maps.places.Autocomplete(departureInput);
//     const arrivalAutocomplete = new google.maps.places.Autocomplete(arrivalInput);
//     departureAutocomplete.setFields(['address_component', 'geometry']);
//     arrivalAutocomplete.setFields(['address_component', 'geometry']);

//     departureAutocomplete.addListener('place_changed', function() {
//         const place = departureAutocomplete.getPlace();
//         departureValid = verifyAddress(place);
//         if (!departureValid) {
//             departureError.style.display = 'inline';
//             departureInput.classList.add('invalid');
//         } else {
//             departureError.style.display = 'none';
//             departureInput.classList.remove('invalid');
//         }
//     });

//     arrivalAutocomplete.addListener('place_changed', function() {
//         const place = arrivalAutocomplete.getPlace();
//         arrivalValid = verifyAddress(place);
//         if (!arrivalValid) {
//             arrivalError.style.display = 'inline';
//             arrivalInput.classList.add('invalid');
//         } else {
//             arrivalError.style.display = 'none';
//             arrivalInput.classList.remove('invalid');
//         }
//     });

//     form.addEventListener('submit', function(event) {
//         if (!departureValid || !arrivalValid) {
//             event.preventDefault();
//             if (!departureValid) {
//                 departureError.style.display = 'inline';
//                 departureInput.classList.add('invalid');
//             }
//             if (!arrivalValid) {
//                 arrivalError.style.display = 'inline';
//                 arrivalInput.classList.add('invalid');
//             }
//         } else {
//             departureError.style.display = 'none';
//             arrivalError.style.display = 'none';
//         }
//     });
// }

// function verifyAddress(place) {
//     if (!place.geometry) {
//         return false;
//     }

//     const addressComponents = place.address_components;
//     let street = false;
//     let city = false;
//     let country = false;

//     for (let i = 0; i < addressComponents.length; i++) {
//         const types = addressComponents[i].types;
//         if (types.includes('street_number') || types.includes('route')) {
//             street = true;
//         }
//         if (types.includes('locality') || types.includes('administrative_area_level_1')) {
//             city = true;
//         }
//         if (types.includes('country')) {
//             country = true;
//         }
//     }

//     return street && city && country;
// }

// function calculateAndDisplayRoute() {
//     const departureAddress = document.getElementById('departure').value;
//     const arrivalAddress = document.getElementById('arrival').value;

//     directionsService.route({
//         origin: departureAddress,
//         destination: arrivalAddress,
//         travelMode: google.maps.TravelMode.DRIVING
//     }, (response, status) => {
//         if (status === google.maps.DirectionsStatus.OK) {
//             directionsRenderer.setDirections(response);
//             // After displaying the route, show alert
//             alert("Form submitted!");
//         } else {
//             window.alert('Directions request failed due to ' + status);
//         }
//     });
// }

// window.initMap = initMap;

// document.addEventListener("DOMContentLoaded", () => {
//     // Car selection functionality
//     const customSelect = document.querySelector(".custom-select");
//     const selectBtn = document.getElementById("select-button");
//     const selectedValue = document.querySelector(".selected-value");
//     const optionsList = document.querySelectorAll(".select-dropdown li");
//     const hiddenCarInput = document.getElementById("selectedCar");

//     selectBtn.addEventListener("click", () => {
//         customSelect.classList.toggle("active");
//         const expanded = selectBtn.getAttribute("aria-expanded") === "true" ? "false" : "true";
//         selectBtn.setAttribute("aria-expanded", expanded);
//     });

//     optionsList.forEach((option) => {
//         option.addEventListener("click", function () {
//             const selectedOption = this.querySelector("label").cloneNode(true);
//             selectedValue.innerHTML = '';
//             selectedValue.appendChild(selectedOption);
//             hiddenCarInput.value = this.querySelector("label").getAttribute("value");
//             customSelect.classList.remove("active");
//             selectBtn.setAttribute("aria-expanded", "false");
//         });

//         option.addEventListener("keyup", function (e) {
//             if (e.key === "Enter") {
//                 const selectedOption = this.querySelector("label").cloneNode(true);
//                 selectedValue.innerHTML = '';
//                 selectedValue.appendChild(selectedOption);
//                 hiddenCarInput.value = this.querySelector("label").getAttribute("value");
//                 customSelect.classList.remove("active");
//                 selectBtn.setAttribute("aria-expanded", "false");
//             }
//         });
//     });

//     document.addEventListener("click", (event) => {
//         if (!customSelect.contains(event.target)) {
//             customSelect.classList.remove("active");
//             selectBtn.setAttribute("aria-expanded", "false");
//         }
//     });

//     // Date picker configuration
//     const now = new Date();
//     flatpickr("#date", {
//         dateFormat: "d/m/Y",
//         minDate: now, // Same day
//         maxDate: new Date(new Date().setMonth(now.getMonth() + 4)), // 4 months ahead without mutating now
//         onDayCreate: function (dObj, dStr, fp, dayElem) {
//             dayElem.style.backgroundColor = "#FAF8F5"; // Custom background color
//             if (dayElem.classList.contains("today")) {
//                 dayElem.style.backgroundColor = "#45513D"; // Today's date background color
//                 dayElem.style.color = "#fff"; // Today's date text color
//             }
//         },
//         onChange: function(selectedDates, dateStr, instance) {
//             const selectedDate = selectedDates[0];
//             populateTimeDropdown(selectedDate);
//         }
//     });

//     // Initial population of the time dropdown based on the current date
//     populateTimeDropdown(now);

//     function populateTimeDropdown(selectedDate) {
//         const timeDropdown = document.getElementById("time-select-dropdown");
//         const timeSelectedValue = document.querySelector("#time-select-button .selected-time-value");
//         const hiddenTimeInput = document.getElementById("selectedTime");
//         timeDropdown.innerHTML = ''; // Clear existing options
//         timeSelectedValue.textContent = "Select a time"; // Reset selected time text
//         hiddenTimeInput.value = ''; // Reset hidden input value

//         let currentTime = new Date();
//         currentTime.setMinutes(0, 0, 0, 0); // Set minutes, seconds, and milliseconds to 0

//         if (isSameDay(selectedDate, currentTime)) {
//             currentTime.setHours(currentTime.getHours() + 2); // 2 hours from current time for today
//             const endOfDay = new Date(currentTime);
//             endOfDay.setHours(23, 30, 0, 0); // End of the current day at 11:30 PM

//             while (currentTime <= endOfDay) {
//                 const option = document.createElement("li");
//                 option.role = "option";
//                 option.textContent = formatTime(currentTime);
//                 option.dataset.value = formatTime(currentTime);
//                 timeDropdown.appendChild(option);
//                 currentTime.setMinutes(currentTime.getMinutes() + 30);
//             }
//         } else {
//             currentTime = new Date(selectedDate);
//             currentTime.setHours(0, 0, 0, 0); // Start from midnight for future dates
//             const endOfDay = new Date(selectedDate);
//             endOfDay.setHours(23, 30, 0, 0); // End of the selected day at 11:30 PM

//             while (currentTime <= endOfDay) {
//                 const option = document.createElement("li");
//                 option.role = "option";
//                 option.textContent = formatTime(currentTime);
//                 option.dataset.value = formatTime(currentTime);
//                 timeDropdown.appendChild(option);
//                 currentTime.setMinutes(currentTime.getMinutes() + 30);
//             }
//         }
//     }

//     function formatTime(date) {
//         let hours = date.getHours();
//         const minutes = date.getMinutes().toString().padStart(2, '0');
//         const ampm = hours >= 12 ? 'PM' : 'AM';
//         hours = hours % 12;
//         hours = hours ? hours : 12; // The hour '0' should be '12'
//         return `${hours}:${minutes} ${ampm}`;
//     }

//     function isSameDay(date1, date2) {
//         return date1.getFullYear() === date2.getFullYear() &&
//             date1.getMonth() === date2.getMonth() &&
//             date1.getDate() === date2.getDate();
//     }

//     // Time dropdown functionality
//     const timeSelectButton = document.getElementById("time-select-button");
//     const customTimeSelect = document.getElementById("custom-time-select");
//     const timeDropdown = document.getElementById("time-select-dropdown");

//     timeSelectButton.addEventListener("click", () => {
//         customTimeSelect.classList.toggle("active");
//         const expanded = timeSelectButton.getAttribute("aria-expanded") === "true" ? "false" : "true";
//         timeSelectButton.setAttribute("aria-expanded", expanded);
//     });

//     timeDropdown.addEventListener("click", (event) => {
//         if (event.target && event.target.nodeName === "LI") {
//             const timeSelectedValue = document.querySelector("#time-select-button .selected-time-value");
//             const hiddenTimeInput = document.getElementById("selectedTime");
//             timeSelectedValue.textContent = event.target.textContent;
//             hiddenTimeInput.value = event.target.dataset.value;
//             customTimeSelect.classList.remove("active");
//             timeSelectButton.setAttribute("aria-expanded", "false");
//         }
//     });

//     document.addEventListener("click", (event) => {
//         if (!timeSelectButton.contains(event.target) && !timeDropdown.contains(event.target)) {
//             customTimeSelect.classList.remove("active");
//             timeSelectButton.setAttribute("aria-expanded", "false");
//         }
//     });

//     const bookingForm = document.getElementById("bookingForm");
//     bookingForm.addEventListener("submit", (e) => {
//         e.preventDefault();
//         let valid = true;

//         // Validate Car Selection
//         const carError = document.getElementById("car-error");
//         if (!hiddenCarInput.value) {
//             carError.style.display = "block";
//             if (hiddenCarInput.closest('.custom-select')) {
//                 hiddenCarInput.closest('.custom-select').classList.add('invalid');
//             }
//             valid = false;
//         } else {
//             carError.style.display = "none";
//             if (hiddenCarInput.closest('.custom-select')) {
//                 hiddenCarInput.closest('.custom-select').classList.remove('invalid');
//             }
//         }

//         // Validate Date
//         const date = document.getElementById("date");
//         const dateError = document.getElementById("date-error");
//         if (!date.value) {
//             dateError.style.display = "block";
//             date.classList.add('invalid');
//             valid = false;
//         } else {
//             dateError.style.display = "none";
//             date.classList.remove('invalid');
//         }

//         // Validate Time
//         const selectedTime = document.getElementById("selectedTime");
//         const timeError = document.getElementById("time-error");
//         if (!selectedTime.value) {
//             timeError.style.display = "block";
//             if (selectedTime.closest('.custom-time-select')) {
//                 selectedTime.closest('.custom-time-select').classList.add('invalid');
//             }
//             valid = false;
//         } else {
//             timeError.style.display = "none";
//             if (selectedTime.closest('.custom-time-select')) {
//                 selectedTime.closest('.custom-time-select').classList.remove('invalid');
//             }
//         }

//         // Validate Departure Address
//         const departureInput = document.getElementById("departure");
//         const departureError = document.getElementById("departure-error");
//         if (!departureInput.value || !departureValid) {
//             departureError.style.display = 'inline';
//             departureInput.classList.add('invalid');
//             valid = false;
//         } else {
//             departureError.style.display = 'none';
//             departureInput.classList.remove('invalid');
//         }

//         // Validate Arrival Address
//         const arrivalInput = document.getElementById("arrival");
//         const arrivalError = document.getElementById("arrival-error");
//         if (!arrivalInput.value || !arrivalValid) {
//             arrivalError.style.display = 'inline';
//             arrivalInput.classList.add('invalid');
//             valid = false;
//         } else {
//             arrivalError.style.display = 'none';
//             arrivalInput.classList.remove('invalid');
//         }

//         // If all fields are valid, calculate route and submit the form
//         if (valid) {
//             calculateAndDisplayRoute();
//         }
//     });
// });

// // Initialize Google Maps and Address Autocomplete
// let map, directionsService, directionsRenderer;
// let departureValid = false, arrivalValid = false;

// function initMap() {
//     const location = { lat: 39.8563, lng: -104.6764 };
//     map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 10,
//         center: location
//     });

//     directionsService = new google.maps.DirectionsService();
//     directionsRenderer = new google.maps.DirectionsRenderer();
//     directionsRenderer.setMap(map);

//     const departureInput = document.getElementById('departure');
//     const arrivalInput = document.getElementById('arrival');
//     const departureError = document.getElementById('departure-error');
//     const arrivalError = document.getElementById('arrival-error');
//     const form = document.getElementById('bookingForm');

//     const departureAutocomplete = new google.maps.places.Autocomplete(departureInput);
//     const arrivalAutocomplete = new google.maps.places.Autocomplete(arrivalInput);
//     departureAutocomplete.setFields(['address_component', 'geometry']);
//     arrivalAutocomplete.setFields(['address_component', 'geometry']);

//     departureAutocomplete.addListener('place_changed', function() {
//         const place = departureAutocomplete.getPlace();
//         departureValid = verifyAddress(place);
//         if (!departureValid) {
//             departureError.style.display = 'inline';
//             departureInput.classList.add('invalid');
//         } else {
//             departureError.style.display = 'none';
//             departureInput.classList.remove('invalid');
//         }
//     });

//     arrivalAutocomplete.addListener('place_changed', function() {
//         const place = arrivalAutocomplete.getPlace();
//         arrivalValid = verifyAddress(place);
//         if (!arrivalValid) {
//             arrivalError.style.display = 'inline';
//             arrivalInput.classList.add('invalid');
//         } else {
//             arrivalError.style.display = 'none';
//             arrivalInput.classList.remove('invalid');
//         }
//     });

//     form.addEventListener('submit', function(event) {
//         event.preventDefault();
//         if (departureValid && arrivalValid) {
//             calculateAndDisplayRoute();
//         }
//     });
// }

// function verifyAddress(place) {
//     if (!place.geometry) {
//         return false;
//     }

//     const addressComponents = place.address_components;
//     let street = false;
//     let city = false;
//     let country = false;

//     for (let i = 0; i < addressComponents.length; i++) {
//         const types = addressComponents[i].types;
//         if (types.includes('street_number') || types.includes('route')) {
//             street = true;
//         }
//         if (types.includes('locality') || types.includes('administrative_area_level_1')) {
//             city = true;
//         }
//         if (types.includes('country')) {
//             country = true;
//         }
//     }

//     return street && city && country;
// }

// function calculateAndDisplayRoute() {
//     const departureAddress = document.getElementById('departure').value;
//     const arrivalAddress = document.getElementById('arrival').value;

//     directionsService.route({
//         origin: departureAddress,
//         destination: arrivalAddress,
//         travelMode: google.maps.TravelMode.DRIVING
//     }, (response, status) => {
//         if (status === google.maps.DirectionsStatus.OK) {
//             directionsRenderer.setDirections(response);
//             // After displaying the route, submit the form
//             document.getElementById("bookingForm").submit();
//         } else {
//             window.alert('Directions request failed due to ' + status);
//         }
//     });
// }

// window.initMap = initMap;



// document.addEventListener("DOMContentLoaded", () => {
//     // Car selection functionality
//     const customSelect = document.querySelector(".custom-select");
//     const selectBtn = document.getElementById("select-button");
//     const selectedValue = document.querySelector(".selected-value");
//     const optionsList = document.querySelectorAll(".select-dropdown li");
//     const hiddenCarInput = document.getElementById("selectedCar");

//     selectBtn.addEventListener("click", () => {
//         customSelect.classList.toggle("active");
//         const expanded = selectBtn.getAttribute("aria-expanded") === "true" ? "false" : "true";
//         selectBtn.setAttribute("aria-expanded", expanded);
//     });

//     optionsList.forEach((option) => {
//         option.addEventListener("click", function () {
//             const selectedOption = this.querySelector("label").cloneNode(true);
//             selectedValue.innerHTML = '';
//             selectedValue.appendChild(selectedOption);
//             hiddenCarInput.value = this.querySelector("label").getAttribute("value");
//             customSelect.classList.remove("active");
//             selectBtn.setAttribute("aria-expanded", "false");
//         });

//         option.addEventListener("keyup", function (e) {
//             if (e.key === "Enter") {
//                 const selectedOption = this.querySelector("label").cloneNode(true);
//                 selectedValue.innerHTML = '';
//                 selectedValue.appendChild(selectedOption);
//                 hiddenCarInput.value = this.querySelector("label").getAttribute("value");
//                 customSelect.classList.remove("active");
//                 selectBtn.setAttribute("aria-expanded", "false");
//             }
//         });
//     });

//     document.addEventListener("click", (event) => {
//         if (!customSelect.contains(event.target)) {
//             customSelect.classList.remove("active");
//             selectBtn.setAttribute("aria-expanded", "false");
//         }
//     });

//     // Date picker configuration
//     const now = new Date();
//     flatpickr("#date", {
//         dateFormat: "d/m/Y",
//         minDate: now, // Same day
//         maxDate: new Date(new Date().setMonth(now.getMonth() + 4)), // 4 months ahead without mutating now
//         onDayCreate: function (dObj, dStr, fp, dayElem) {
//             dayElem.style.backgroundColor = "#FAF8F5"; // Custom background color
//             if (dayElem.classList.contains("today")) {
//                 dayElem.style.backgroundColor = "#45513D"; // Today's date background color
//                 dayElem.style.color = "#fff"; // Today's date text color
//             }
//         },
//         onChange: function(selectedDates, dateStr, instance) {
//             const selectedDate = selectedDates[0];
//             populateTimeDropdown(selectedDate);
//         }
//     });

//     // Initial population of the time dropdown based on the current date
//     populateTimeDropdown(now);

//     function populateTimeDropdown(selectedDate) {
//         const timeDropdown = document.getElementById("time-select-dropdown");
//         const timeSelectedValue = document.querySelector("#time-select-button .selected-time-value");
//         const hiddenTimeInput = document.getElementById("selectedTime");
//         timeDropdown.innerHTML = ''; // Clear existing options
//         timeSelectedValue.textContent = "Select a time"; // Reset selected time text
//         hiddenTimeInput.value = ''; // Reset hidden input value

//         let currentTime = new Date();
//         currentTime.setMinutes(0, 0, 0, 0); // Set minutes, seconds, and milliseconds to 0

//         if (isSameDay(selectedDate, currentTime)) {
//             currentTime.setHours(currentTime.getHours() + 2); // 2 hours from current time for today
//             const endOfDay = new Date(currentTime);
//             endOfDay.setHours(23, 30, 0, 0); // End of the current day at 11:30 PM

//             while (currentTime <= endOfDay) {
//                 const option = document.createElement("li");
//                 option.role = "option";
//                 option.textContent = formatTime(currentTime);
//                 option.dataset.value = formatTime(currentTime);
//                 timeDropdown.appendChild(option);
//                 currentTime.setMinutes(currentTime.getMinutes() + 30);
//             }
//         } else {
//             currentTime = new Date(selectedDate);
//             currentTime.setHours(0, 0, 0, 0); // Start from midnight for future dates
//             const endOfDay = new Date(selectedDate);
//             endOfDay.setHours(23, 30, 0, 0); // End of the selected day at 11:30 PM

//             while (currentTime <= endOfDay) {
//                 const option = document.createElement("li");
//                 option.role = "option";
//                 option.textContent = formatTime(currentTime);
//                 option.dataset.value = formatTime(currentTime);
//                 timeDropdown.appendChild(option);
//                 currentTime.setMinutes(currentTime.getMinutes() + 30);
//             }
//         }
//     }

//     function formatTime(date) {
//         let hours = date.getHours();
//         const minutes = date.getMinutes().toString().padStart(2, '0');
//         const ampm = hours >= 12 ? 'PM' : 'AM';
//         hours = hours % 12;
//         hours = hours ? hours : 12; // The hour '0' should be '12'
//         return `${hours}:${minutes} ${ampm}`;
//     }

//     function isSameDay(date1, date2) {
//         return date1.getFullYear() === date2.getFullYear() &&
//             date1.getMonth() === date2.getMonth() &&
//             date1.getDate() === date2.getDate();
//     }

//     // Time dropdown functionality
//     const timeSelectButton = document.getElementById("time-select-button");
//     const customTimeSelect = document.getElementById("custom-time-select");
//     const timeDropdown = document.getElementById("time-select-dropdown");

//     timeSelectButton.addEventListener("click", () => {
//         customTimeSelect.classList.toggle("active");
//         const expanded = timeSelectButton.getAttribute("aria-expanded") === "true" ? "false" : "true";
//         timeSelectButton.setAttribute("aria-expanded", expanded);
//     });

//     timeDropdown.addEventListener("click", (event) => {
//         if (event.target && event.target.nodeName === "LI") {
//             const timeSelectedValue = document.querySelector("#time-select-button .selected-time-value");
//             const hiddenTimeInput = document.getElementById("selectedTime");
//             timeSelectedValue.textContent = event.target.textContent;
//             hiddenTimeInput.value = event.target.dataset.value;
//             customTimeSelect.classList.remove("active");
//             timeSelectButton.setAttribute("aria-expanded", "false");
//         }
//     });

//     document.addEventListener("click", (event) => {
//         if (!timeSelectButton.contains(event.target) && !timeDropdown.contains(event.target)) {
//             customTimeSelect.classList.remove("active");
//             timeSelectButton.setAttribute("aria-expanded", "false");
//         }
//     });

//     const bookingForm = document.getElementById("bookingForm");
//     bookingForm.addEventListener("submit", (e) => {
//         e.preventDefault();
//         let valid = true;

//         // Validate Car Selection
//         const carError = document.getElementById("car-error");
//         if (!hiddenCarInput.value) {
//             carError.style.display = "block";
//             if (hiddenCarInput.closest('.custom-select')) {
//                 hiddenCarInput.closest('.custom-select').classList.add('invalid');
//             }
//             valid = false;
//         } else {
//             carError.style.display = "none";
//             if (hiddenCarInput.closest('.custom-select')) {
//                 hiddenCarInput.closest('.custom-select').classList.remove('invalid');
//             }
//         }

//         // Validate Date
//         const date = document.getElementById("date");
//         const dateError = document.getElementById("date-error");
//         if (!date.value) {
//             dateError.style.display = "block";
//             date.classList.add('invalid');
//             valid = false;
//         } else {
//             dateError.style.display = "none";
//             date.classList.remove('invalid');
//         }

//         // Validate Time
//         const selectedTime = document.getElementById("selectedTime");
//         const timeError = document.getElementById("time-error");
//         if (!selectedTime.value) {
//             timeError.style.display = "block";
//             selectedTime.closest('.custom-time-select').classList.add('invalid');
//             valid = false;
//         } else {
//             timeError.style.display = "none";
//             selectedTime.closest('.custom-time-select').classList.remove('invalid');
//         }

//         // Validate Departure Address
//         const departureInput = document.getElementById("departure");
//         const departureError = document.getElementById("departure-error");
//         if (!departureInput.value || !departureValid) {
//             departureError.style.display = 'inline';
//             departureInput.classList.add('invalid');
//             valid = false;
//         } else {
//             departureError.style.display = 'none';
//             departureInput.classList.remove('invalid');
//         }

//         // Validate Arrival Address
//         const arrivalInput = document.getElementById("arrival");
//         const arrivalError = document.getElementById("arrival-error");
//         if (!arrivalInput.value || !arrivalValid) {
//             arrivalError.style.display = 'inline';
//             arrivalInput.classList.add('invalid');
//             valid = false;
//         } else {
//             arrivalError.style.display = 'none';
//             arrivalInput.classList.remove('invalid');
//         }

//         // If all fields are valid, submit the form
//         if (valid) {
//             alert("Form submitted!");
//             bookingForm.submit();
//         }
//     });
// });

// // Initialize Google Maps and Address Autocomplete
// let map, directionsService, directionsRenderer;
// let departureValid = false, arrivalValid = false;

// function initMap() {
//     const location = { lat: 39.8563, lng: -104.6764 };
//     map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 10,
//         center: location
//     });

//     directionsService = new google.maps.DirectionsService();
//     directionsRenderer = new google.maps.DirectionsRenderer();
//     directionsRenderer.setMap(map);

//     const departureInput = document.getElementById('departure');
//     const arrivalInput = document.getElementById('arrival');
//     const departureError = document.getElementById('departure-error');
//     const arrivalError = document.getElementById('arrival-error');
//     const form = document.getElementById('bookingForm');

//     const departureAutocomplete = new google.maps.places.Autocomplete(departureInput);
//     const arrivalAutocomplete = new google.maps.places.Autocomplete(arrivalInput);
//     departureAutocomplete.setFields(['address_component', 'geometry']);
//     arrivalAutocomplete.setFields(['address_component', 'geometry']);

//     departureAutocomplete.addListener('place_changed', function() {
//         const place = departureAutocomplete.getPlace();
//         departureValid = verifyAddress(place);
//         if (!departureValid) {
//             departureError.style.display = 'inline';
//             departureInput.classList.add('invalid');
//         } else {
//             departureError.style.display = 'none';
//             departureInput.classList.remove('invalid');
//         }
//     });

//     arrivalAutocomplete.addListener('place_changed', function() {
//         const place = arrivalAutocomplete.getPlace();
//         arrivalValid = verifyAddress(place);
//         if (!arrivalValid) {
//             arrivalError.style.display = 'inline';
//             arrivalInput.classList.add('invalid');
//         } else {
//             arrivalError.style.display = 'none';
//             arrivalInput.classList.remove('invalid');
//         }
//     });

//     form.addEventListener('submit', function(event) {
//         if (!departureValid) {
//             event.preventDefault();
//             departureError.style.display = 'inline';
//         } else {
//             departureError.style.display = 'none';
//         }
//         if (!arrivalValid) {
//             event.preventDefault();
//             arrivalError.style.display = 'inline';
//         } else {
//             arrivalError.style.display = 'none';
//         }

//         if (departureValid && arrivalValid) {
//             event.preventDefault(); // Prevent form submission
//             calculateAndDisplayRoute();
//         }
//     });
// }

// function verifyAddress(place) {
//     if (!place.geometry) {
//         return false;
//     }

//     const addressComponents = place.address_components;
//     let street = false;
//     let city = false;
//     let country = false;

//     for (let i = 0; i < addressComponents.length; i++) {
//         const types = addressComponents[i].types;
//         if (types.includes('street_number') || types.includes('route')) {
//             street = true;
//         }
//         if (types.includes('locality') || types.includes('administrative_area_level_1')) {
//             city = true;
//         }
//         if (types.includes('country')) {
//             country = true;
//         }
//     }

//     return street && city && country;
// }

// function calculateAndDisplayRoute() {
//     const departureAddress = document.getElementById('departure').value;
//     const arrivalAddress = document.getElementById('arrival').value;

//     directionsService.route({
//         origin: departureAddress,
//         destination: arrivalAddress,
//         travelMode: google.maps.TravelMode.DRIVING
//     }, (response, status) => {
//         if (status === google.maps.DirectionsStatus.OK) {
//             directionsRenderer.setDirections(response);
//         } else {
//             window.alert('Directions request failed due to ' + status);
//         }
//     });
// }

// window.initMap = initMap;
*/

