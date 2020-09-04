const key = '65288b09';
const apiURL = `http://www.omdbapi.com/?apikey=${key}&`;
let lastInputTime = 0;
let searchTerm = '';
let page;
let pageMax;

const displayMovie = function(data) {
  let result = document.getElementById('result');
  const { Search } = data;
  pageMax = Math.ceil(data.totalResults / 10);
  console.log(data, pageMax);
  result.innerHTML = '';
  for (const item of Search) {
    result.innerHTML += `${item.Title}, Year: ${item.Year}<br>`;
  }
};

const fetchFromApi = function(url, cb) {
  fetch(url)
    .then(response => response.json().then((data) => {
      cb(data);
    }));
};

const checkCoolDownFinished = function(time = 1000) {
  if (Date.now() - lastInputTime + 10 < time) {
    return false;
  }
  return true;
};

const searchMovie = function() {
  let input = document.getElementById('searchbar');
  const coolDown = 300;
  const { value } = input;
  lastInputTime = Date.now();
  setTimeout(() => {
    if (searchTerm !== value.trim()) {
      searchTerm = value.trim();
      page = 1;
  
      if (checkCoolDownFinished(coolDown) && searchTerm.length > 1) {
        console.log(value);
        fetchFromApi(`${apiURL}s=${searchTerm}&page=${page}`, displayMovie);
      }
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