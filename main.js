"use strict";

const addCarForm = document.querySelector("#addCar");
const searchCarForm = document.querySelector("#searchCar");
const cars = [];

class Car {
    constructor(license, maker, model, owner, price, color, year) {
        this.license = license;
        this.maker = maker;
        this.model = model;
        this.owner = owner;
        this.price = parseFloat(price);
        this.color = color;
        this.year = parseInt(year);
    }

    getCarAge() {
        const currentYear = new Date().getFullYear();
        return currentYear - this.year;
    }

    getDiscountedPrice() {
        return this.getCarAge() > 10 ? this.price * 0.85 : this.price;
    }

    isEligibleForDiscount() {
        return this.getCarAge() > 10;
    }

}

const displayMessage = (message, type = "success") => {
    const messageElement = document.querySelector("#message");
    messageElement.textContent = message;
    messageElement.className = type;
    setTimeout(() => { // inbuilt asynchronous function, which runs in x milliseconds after being called, other code keeps running during it
        messageElement.textContent = "";
        messageElement.className = "";
    }, 3000); // runs after 3 seconds (3000 milliseconds)
};


const addCar = (e) => {
    e.preventDefault();
    // try for all possibilities of errors, throw an error in case of one. If error not found, run display message, else, throw error message
    try {
        const license = document.querySelector("#license").value.trim();
        const maker = document.querySelector("#maker").value.trim();
        const model = document.querySelector("#model").value.trim();
        const owner = document.querySelector("#owner").value.trim();
        const price = parseFloat(document.querySelector("#price").value.trim());
        const color = document.querySelector("#color").value.trim();
        const year = parseInt(document.querySelector("#year").value.trim());
        const currentYear = new Date().getFullYear();

        if (!license || !maker || !model || !owner || isNaN(price) || !color || isNaN(year)) {
            throw new Error("All fields are required and must be valid.");
        }

        if (price <= 0) {
            throw new Error("Price must be a positive number.");
        }

        if (year < 1886 || year > currentYear) {
            throw new Error(`Year must be between 1886 and ${currentYear}.`);
        }

        const newCar = new Car(license, maker, model, owner, price, color, year);
        addCarForm.reset();
        cars.push(newCar);

        localStorage.setItem('cars', JSON.stringify(cars)); // store the entered car in localStorage, stringyfy the array

        displayTable(); // enter car details to a table
        displayMessage("Car added successfully!"); // run the display message function

    } catch (error) {
        displayMessage(error.message, "error");
    }
};

const loadCarsFromLocalStorage = () => {
    const storedCars = localStorage.getItem('cars'); // get stringfied array from localStorage
    if (storedCars) {
        const parsedCars = JSON.parse(storedCars); // parse the array into new array variable
        parsedCars.forEach(carData => { // for each array object (car), push to the Cars array
            cars.push(new Car(carData.license, carData.maker, carData.model, carData.owner, carData.price, carData.color, carData.year));
        });
        displayTable(); // display the data in a table
    }
};

const displayTable = () => {
    const table = document.querySelector("#carsTable");

    table.innerHTML = table.rows[0].innerHTML;

    cars.forEach((car, index) => {
        const row = table.insertRow(-1);

        const { license, maker, model, owner, year, color, price } = car;

        const carDetails = [license, maker, model, owner, year, color];

        carDetails.forEach(detail => {
            row.insertCell(-1).textContent = detail ?? 'N/A';
        });

        row.insertCell(-1).textContent = `${price.toFixed(2)}€`;

        const discountedPrice = car.isEligibleForDiscount()
            ? `$${car.getDiscountedPrice().toFixed(2)}`
            : "No Discount";
        row.insertCell(-1).textContent = discountedPrice;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete");
        deleteButton.addEventListener("click", () => deleteCar(index));
        row.insertCell(-1).appendChild(deleteButton);
    });
};

const deleteCar = (index) => {
    cars.splice(index, 1); // removes an array object from given index, deletes only 1 object (second value)
    localStorage.setItem('cars', JSON.stringify(cars)); // update the localStorage 
    displayTable(); // update the table to display without the removed car object
    displayMessage("Car deleted successfully!"); // run the message on screen
};


const searchCar = (e) => {
    e.preventDefault();
    const searchInput = document.querySelector("#search").value.trim();
    const foundCar = cars.find((car) => car.license.toLowerCase() === searchInput.toLowerCase());

    const searchResult = document.querySelector("#searchResult");

    if (foundCar) {
        const originalPrice = foundCar.price.toFixed(2);
        const discountedPrice = foundCar.isEligibleForDiscount()
            ? `$${foundCar.getDiscountedPrice().toFixed(2)}`
            : "No Discount";

        searchResult.innerHTML = `
            <p>Maker: ${foundCar.maker}</p>
            <p>Model: ${foundCar.model}</p>
            <p>Owner: ${foundCar.owner}</p>
            <p>Year: ${foundCar.year}</p>
            <p>Original Price: $${originalPrice}</p>
            <p>Discounted Price: ${discountedPrice}</p>
            <p>Color: ${foundCar.color}</p>
        `;
    } else {
        searchResult.innerHTML = "<p>No car found with the given license plate.</p>";
    }
};

addCarForm.addEventListener("submit", addCar);
searchCarForm.addEventListener("submit", searchCar);
window.addEventListener('load', loadCarsFromLocalStorage);


