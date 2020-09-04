const key = '65288b09';
const apiURL = `http://www.omdbapi.com/?apikey=${key}&`;
let searchTerm;
let page = 1;

const searchMovie = function() {
  let input = document.getElementById('searchbar');
  let result = document.getElementById('result');
  const { value } = input;
  searchTerm = value;
  // page = 1;

  if (value.length > 3 && value[value.length - 1] === ' ') {
    console.log(value);
    result.innerHTML = '';
    fetch(`${apiURL}s=${value.trim()}&page=${page}`)
      .then(response => response.json().then((data) => {
        console.log(data);
        const { Search } = data;
        for (const item of Search) {
          result.innerHTML += `${item.Title}, Year: ${item.Year}<br>`;
        }
      }));
  }
};

const changePage = function(direction) {
  switch (direction) {
  case 'next':
    page++;
    break;
  case 'previous':
    page--;
  }
  searchMovie();
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