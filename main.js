'use strict';

const addCarForm = document.querySelector('#addCar');
const searchCarForm = document.querySelector('#searchCar');

const cars = [];

class Car {
    constructor(license, maker, model, owner, price, color) {
        this.license = license;
        this.maker = maker;
        this.model = model;
        this.owner = owner;
        this.price = parseFloat(price);
        this.color = color;
    }
}

const addCar = (e) => {
    e.preventDefault(); // this prevents form submission until submit is actually clicked

    // use .value.trim(); in order to prevent accidental whitespaces entered
    // define the input value for each form input as a variable:
    const license = document.querySelector('#license').value.trim();
    const maker = document.querySelector('#maker').value.trim();
    const model = document.querySelector('#model').value.trim();
    const owner = document.querySelector('#owner').value.trim();
    const price = document.querySelector('#price').value.trim();
    const color = document.querySelector('#color').value;

    // create a object with the parameters
    // since the variables and parameters are called same, this is a shortcut: otherwise use constructor with .this
    const newCar = new Car(license, maker, model, owner, price, color);

    // resets the values of all elements in a form (same as clicking the Reset button):
    addCarForm.reset();
    // push the new Car object to the Cars array:
    cars.push(newCar)
    // run the displayTable function to display the entered data in table:
    displayTable();
}

const displayTable = () => {
    const table = document.querySelector('#carsTable'); //define table with id from html

    table.innerHTML = table.rows[0].innerHTML; //

    cars.forEach(car => {
        const row = table.insertRow(-1); // for each car in the array, insert a row into the table

        Object.values(car).forEach(text => {
            const cell = row.insertCell(-1); // for each car object value, insert a cell to the row
            cell.textContent = text; // put the text value into each cell created
        })
    })
}

const searchCar = (e) => {
    e.preventDefault(); // this prevents search until Search is actually clicked
    const searchInput = document.querySelector('#search').value; // get the value writen by user as a variable

    // take the Cars array, find if any object (car) with a license parameter is equal to the search
    // put it as a variable
    // put both to lowerCase to avoid upper and lower case differences:
    const foundCar = cars.find(car => car.license.toLowerCase() === searchInput.toLowerCase());

    const searchResult = document.querySelector('#searchResult');
    if (foundCar) {
        // if the foundCar value was found, set the text of the p with searchResult equal to:
        // take each parameter and place it as text:
        searchResult.innerHTML = `
          <p>Maker: ${foundCar.maker}</p>
          <p>Model: ${foundCar.model}</p>
          <p>Owner: ${foundCar.owner}</p>
          <p>Price: ${foundCar.price.toFixed(2)}€</p>
        `; // the last line turns the numerical value to a specified number of decimal places, here 2
    } else {
        searchResult.innerHTML = '<p>No car found with the given license plate.</p>';
    }
}

addCarForm.addEventListener('submit', addCar);
searchCarForm.addEventListener('submit', searchCar);
