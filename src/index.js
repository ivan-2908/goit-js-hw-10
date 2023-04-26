import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './api/fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

let searchTerm = '';

searchBox.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange() {
  searchTerm = searchBox.value.trim();
  if (searchTerm === '') {
    clearAll();
    return;
  } else
    fetchCountries(searchTerm)
      .then(countryNames => {
        if (countryNames.length < 2) {
          createCountrieCard(countryNames);
          Notiflix.Notify.success('Here your result');
        } else if (countryNames.length < 10 && countryNames.length > 1) {
          createCountrieList(countryNames);
          Notiflix.Notify.success('Here your results');
        } else {
          clearAll();
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }
      })
      .catch(() => {
        clearAll();
        Notiflix.Notify.failure('Oops, there is no country with that name.');
      });
}

function createCountrieCard(country) {
  clearAll();
  const c = country[0];
  const readyCard = `<div class="country-card">
        <div class="country-card--header">
            <img src="${
              c.flags.svg
            }" alt="Country flag" width="55", height="35">
            <h2 class="country-card--name"> ${c.name.official}</h2>
        </div>
            <p class="country-card--field">Capital: <span class="country-value">${
              c.capital
            }</span></p>
            <p class="country-card--field">Population: <span class="country-value">${
              c.population
            }</span></p>
            <p class="country-card--field">Languages: <span class="country-value">${Object.values(
              c.languages
            ).join(',')}</span></p>
    </div>`;
  countryInfo.innerHTML = readyCard;
}

function createCountrieList(country) {
  clearAll();
  const readyList = country
    .map(
      c =>
        `<li class="country-list--item">
            <img src="${c.flags.svg}" alt="Country flag" width="40", height="30">
            <span class="country-list--name">${c.name.official}</span>
        </li>`
    )
    .join('');
  countryList.insertAdjacentHTML('beforeend', readyList);
}

function clearAll() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
