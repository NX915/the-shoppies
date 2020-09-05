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
        <button id="${item.imdbID}_nom_button" class="result_item nom_buttom" onclick="nominateMovie('${item.imdbID}', '${item.Title}', '${item.Year}', '${poster}')">Nominate</button>
      </div>
    </li>
    `;
    if (document.getElementById(`${item.imdbID}_nom`)) {
      document.getElementById(`${item.imdbID}_nom_button`).disabled = true;
    }
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
      document.getElementById('search_info').innerHTML = `Search result for '${searchTerm}'`;
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