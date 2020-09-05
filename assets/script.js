const key = '65288b09';
const apiURL = `http://www.omdbapi.com/?apikey=${key}&type=movie&`;
const posterPlaceholderURL = 'https://imgur.com/mzbtmQz.png';
const nominationCount = 4;
let lastInputTime = 0;
let searchTerm = '';
let page;
let pageMax;

const generateRandomString = function(length = 6) {
  const charString = 'abcdefghijklmnopqretuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    randomString += charString[Math.floor(Math.random() * charString.length)];
  }
  return randomString;
};

const fetchFromApi = function(url, cb) {
  fetch(url)
    .then(response => response.json().then((data) => {
      cb(data);
    }));
};

const changeAllChildren = function(element, cb) {
  const children = element.children;

  cb(element);
  for (const subElement of children) {
    changeAllChildren(subElement, cb);
  }
};

const displayMovie = function(data) {
  let result = document.getElementById('result');
  const { Search } = data;
  pageMax = Math.ceil(data.totalResults / 10);

  
  console.log(data, pageMax);
  result.innerHTML = '';
  for (const item of Search) {
    let poster = item.Poster === 'N/A' ? posterPlaceholderURL : item.Poster;

    result.innerHTML += `
    <li id="${item.imdbID}" class="result_item movie_item">
      <img class="result_item movie_poster" src="${poster}" alt="Poster for ${item.Title}">
      <div class="result_item movie_info">
        <h3 class="result_item movie_title">${item.Title}</h3>
        <h4 class="result_item movie_year">Year: ${item.Year}</h4>
        <button id="${item.imdbID}_nom_button" class="result_item nom_buttom svg_button" onclick="nominateMovie('${item.imdbID}', '${item.Title}', '${item.Year}', '${poster}')">
          <svg class="nom_icon" viewBox="0 0 512 512"><path fill="rgb(14, 110, 84)" d="M104 224H24c-13.255 0-24 10.745-24 24v240c0 13.255 10.745 24 24 24h80c13.255 0 24-10.745 24-24V248c0-13.255-10.745-24-24-24zM64 472c-13.255 0-24-10.745-24-24s10.745-24 24-24 24 10.745 24 24-10.745 24-24 24zM384 81.452c0 42.416-25.97 66.208-33.277 94.548h101.723c33.397 0 59.397 27.746 59.553 58.098.084 17.938-7.546 37.249-19.439 49.197l-.11.11c9.836 23.337 8.237 56.037-9.308 79.469 8.681 25.895-.069 57.704-16.382 74.757 4.298 17.598 2.244 32.575-6.148 44.632C440.202 511.587 389.616 512 346.839 512l-2.845-.001c-48.287-.017-87.806-17.598-119.56-31.725-15.957-7.099-36.821-15.887-52.651-16.178-6.54-.12-11.783-5.457-11.783-11.998v-213.77c0-3.2 1.282-6.271 3.558-8.521 39.614-39.144 56.648-80.587 89.117-113.111 14.804-14.832 20.188-37.236 25.393-58.902C282.515 39.293 291.817 0 312 0c24 0 72 8 72 81.452z"></path></svg>
          Nominate
        </button>
      </div>
    </li>
    `;
    if (document.getElementById(`${item.imdbID}_nom`)) {
      document.getElementById(`${item.imdbID}_nom_button`).disabled = true;
    }
  }

  if (data.totalResults) {
    document.getElementById('search_info').innerHTML = `${data.totalResults} movies found for "${searchTerm}"`;
  }

};

const nominateMovie = function(imdbID, movieTitle, movieYear, moviePoster) {
  let nomination = document.getElementById('nomination');
  let movie = document.getElementById(imdbID);

  if (nomination.children.length < 5) {
    nomination.innerHTML += `
      <li id="${imdbID}_nom" class="nom_item movie_item">
        <img class="nom_item movie_poster" src=${moviePoster} alt="Poster for ${movieTitle}">
        <div class="nom_item movie_info">
          <h3 class="nom_item movie_title">${movieTitle} (${movieYear})</h3>
          <button class="nom_item remove_button" onclick="removeMovie('${imdbID}')">Remove</button>
        </div>  
      </li>
    `;
    changeAllChildren(document.getElementById('nom_box'), (element) => {
      element.classList.remove('hide');
    });
    document.getElementById(`${imdbID}_nom_button`).disabled = true;
  }

  //hide search if nomination reach limit
  if (nomination.children.length === nominationCount) {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'auto'
    });

    document.getElementById('search_box').classList.add('invis');
    document.getElementById('searchbar').classList.add('hide');
    document.getElementById('search_button').classList.add('hide');


    changeAllChildren(document.getElementById('result_box'), (element) => {
      element.classList.add('hide');
    });
    document.getElementById('result_box').style.flex = '0 0 0px';
    document.getElementById('nom_box').style.flex = '1 1 auto';
  }
};

const removeMovie = function(imdbID) {
  let nomination = document.getElementById('nomination');
  let movieNom = document.getElementById(`${imdbID}_nom`);
  let movie = document.getElementById(imdbID);

  if (movie) {
    document.getElementById(`${imdbID}_nom_button`).disabled = false;
  }

  movieNom.parentNode.removeChild(movieNom);

  if (nomination.children.length < nominationCount) {
    changeAllChildren(document.getElementById('result_box'), (element) => {
      element.classList.remove('hide');
    });
    document.getElementById('search_box').classList.remove('invis');
    document.getElementById('searchbar').classList.remove('hide');
    document.getElementById('search_button').classList.remove('hide');
    document.getElementById('result_box').style.flex = '';
    document.getElementById('nom_box').style.flex = '';
  }

  if (nomination.children.length === 0) {
    changeAllChildren(document.getElementById('nom_box'), (element) => {
      element.classList.add('hide');
    });
  }
};

const checkCoolDownFinished = function(time = 1000) {
  if (Date.now() - lastInputTime + 10 < time) {
    return false;
  }
  return true;
};

const searchBarResize = function() {
  let input = document.getElementById('searchbar');

  if (input.value.trim().length > 1) {
    input.classList.remove('minSearchBar');
    input.classList.add('maxSearchBar');
    changeAllChildren(document.getElementById('result_box'), (element) => {
      element.classList.remove('hide');
    });
    changeAllChildren(document.getElementById('search_box'), (element) => {
      element.classList.remove('fullSearchBox');
    });
    document.getElementById('content_box').classList.remove('hide');
  } else {
    input.classList.remove('maxSearchBar');
    input.classList.add('minSearchBar');
    changeAllChildren(document.getElementById('result_box'), (element) => {
      element.classList.add('hide');
    });
  }
};

const searchMovie = function() {
  let input = document.getElementById('searchbar');
  const coolDown = 500;
  const { value } = input;
  lastInputTime = Date.now();
  searchTerm = value.trim();

  setTimeout(() => {
    page = 1;
    if (checkCoolDownFinished(coolDown) && searchTerm.length > 1) {
      console.log(value);
      // document.getElementById('search_info').innerHTML = `Search result for '${searchTerm}'`;
      fetchFromApi(`${apiURL}s=${searchTerm}&page=${page}`, displayMovie);
    }
  }, coolDown);
};

const changePage = function(direction) {
  switch (direction) {
  case 'next':
    if (page < pageMax) {
      page++;
    } else {
      return;
    }
    break;
  case 'previous':
    if (page > 1) {
      page--;
    } else {
      return;
    }
  }
  fetchFromApi(`${apiURL}s=${document.getElementById('searchbar').value.trim()}&page=${page}`, displayMovie);
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'auto'
  });
};

// {
//   "Title":"Sports Monster",
//   "Year":"1990–1991",
//   "Rated":"N/A",
//   "Released":"N/A",
//   "Runtime":"N/A",
//   "Genre":"Comedy",
//   "Director":"N/A",
//   "Writer":"N/A",
//   "Actors":"Nick Bakay, Joe Bolster, Jon Hayman, Steve Skrovan",
//   "Plot":"N/A",
//   "Language":"English",
//   "Country":"USA",
//   "Awards":"N/A",
//   "Poster":"N/A",
//   "Ratings":[{"Source":"Internet Movie Database","Value":"7.0/10"}],
//   "Metascore":"N/A",
//   "imdbRating":"7.0",
//   "imdbVotes":"8",
//   "imdbID":"tt0395902",
//   "Type":"series",
//   "totalSeasons":"N/A",
//   "Response":"True"
// }