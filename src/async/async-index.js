import '../css/styles.css';
import Notiflix, { Notify } from 'notiflix';
import { fetchCountries } from './async-fetchCountries';
import { notifyOptions } from '../notify-options';
const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('input#search-box'),
  itemsList: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const countryName = e.target.value.trim();
  console.log(countryName);
  if (!countryName) {
    refs.itemsList.innerHTML = '';
    refs.info.innerHTML = '';
    return;
  }
  fetchCountries(countryName).then(onFetchSuccess).catch(onFetchError);
}

function onFetchSuccess(countryInfo) {
  console.log(countryInfo);
  if (countryInfo.length > 10) {
    Notify.info(
      'Too many matches found. Please enter a more specific name!',
      notifyOptions
    );
  } else if (countryInfo.length >= 2 && countryInfo.length <= 10) {
    renderItemsList(countryInfo);
  } else if (countryInfo.length === 1) {
    renderInfo(countryInfo);
  }
}

function renderItemsList(countryInfo) {
  refs.info.innerHTML = '';
  const markup = countryInfo
    .map(({ name, flags }) => {
      return ` <li class="country-item">
      <img class="flag-mini" src="${flags.svg}" alt="img">
      <p>${name.official}</p>
    </li>`;
    })
    .join('');
  return (refs.itemsList.innerHTML = markup);
}

function renderInfo(countryInfo) {
  refs.itemsList.innerHTML = '';
  const markup = countryInfo
    .map(({ name, capital, population, flags, languages }) => {
      return ` <div class="card-header"><p class="country"><img class="flag" src="${
        flags.svg
      }" alt="img"></p>
        <p class="country-name">${name.official}</p></div>
        <p class="capital"><span class="title">Capital:</span> ${capital}</p>
        <p class="population"><span class="title">Population:</span> ${population}</p>
        <p class="languages"><span class="title">Languages:</span> ${Object.values(
          languages
        ).join(', ')}</p> `;
    })
    .join('');
  return (refs.info.innerHTML = markup);
}

function onFetchError(error) {
  Notify.failure('Oops, there is no country with that name(', notifyOptions);
}
