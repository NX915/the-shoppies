const key = '65288b09';
const apiURL = `http://www.omdbapi.com/?apikey=${key}&`;
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

const displayMovie = function(data) {
  let result = document.getElementById('result');
  const { Search } = data;
  pageMax = Math.ceil(data.totalResults / 10);
  
  console.log(data, pageMax);
  result.innerHTML = '';
  for (const item of Search) {
    result.innerHTML += `
    <li id="${item.Title}">
    ${item.Title}, Year: ${item.Year}
    <button class="nom_button" onclick="nominateMovie('${item.Title}')">Nominate</button>
    </li>
    `;
    if (document.getElementById(`${item.Title}_nom`)) {
      document.getElementById(item.Title).style.display = 'none';
    }
  }
};

const nominateMovie = function(movieTitle) {
  let nomination = document.getElementById('nomination');
  let movie = document.getElementById(movieTitle);

  if (nomination.children.length < 5) {
    nomination.innerHTML += `
      <li id="${movieTitle}_nom">
        ${movieTitle}
        <button class="remove_button" onclick="removeMovie('${movieTitle}')">Remove</button>
      </li>
    `;
    movie.style.display = 'none';
  }
};

const removeMovie = function(movieTitle) {
  let movieNom = document.getElementById(`${movieTitle}_nom`);
  let movie = document.getElementById(movieTitle);
  if (movie) {
    movie.style.display = '';
  }
  movieNom.parentNode.removeChild(movieNom);
};

const checkCoolDownFinished = function(time = 1000) {
  if (Date.now() - lastInputTime + 10 < time) {
    return false;
  }
  return true;
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