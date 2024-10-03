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
        return currentYear - this.year; // calculate car age
    }

    getDiscountedPrice() {
        return this.getCarAge() > 10 ? this.price * 0.85 : this.price; // if car age is more than 10, display 0.85 times price, else display car price
    }

    isEligibleForDiscount() {
        return this.getCarAge() > 10; //returns a boolean value
    }

}

const addCar = (e) => {
    e.preventDefault();

    try {
        const license = document.querySelector("#license").value.trim();
        const maker = document.querySelector("#maker").value.trim();
        const model = document.querySelector("#model").value.trim();
        const owner = document.querySelector("#owner").value.trim();
        const price = parseFloat(document.querySelector("#price").value.trim()); // turn to string
        const color = document.querySelector("#color").value.trim();
        const year = parseInt(document.querySelector("#year").value.trim()); // turn to number
        const currentYear = new Date().getFullYear();

        if (!license || !maker || !model || !owner || isNaN(price) || !color || isNaN(year)) { // if one of these is not given, throw error
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
        displayTable();

    } catch (error) {
        alert(error.message);
    }
};

const displayTable = () => {
    const table = document.querySelector("#carsTable");

    table.innerHTML = table.rows[0].innerHTML;

    cars.forEach((car) => {
        const row = table.insertRow(-1); // insert a row at the end of the table

        const { license, maker, model, owner, year, color, price } = car; // destruct an objects variables to write less

        const carDetails = [license, maker, model, owner, year, color]; // put the destructured variables into an array

        carDetails.forEach(detail => {
            row.insertCell(-1).textContent = detail ?? 'N/A'; // create a cell at the end of the row and fill it with a variable, if it's not there, display N/A
        });

        row.insertCell(-1).textContent = `${price.toFixed(2)}€`;

        const discountedPrice = car.isEligibleForDiscount() // variable of: if car is eligble for discount, display car price, else No discount
            ? `$${car.getDiscountedPrice().toFixed(2)}`
            : "No Discount";
        row.insertCell(-1).textContent = discountedPrice; // display variable in the inserted cell in each cars' inserted row
    });
};


const searchCar = (e) => {
    e.preventDefault();
    const searchInput = document.querySelector("#search").value.trim();
    const foundCar = cars.find((car) => car.license.toLowerCase() === searchInput.toLowerCase());

    const searchResult = document.querySelector("#searchResult");

    if (foundCar) {
        const originalPrice = foundCar.price.toFixed(2);
        const discountedPrice = foundCar.isEligibleForDiscount() // the function returns boolean, ? says if yes, then get the discounted price, else "":
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
