const key = '65288b09';
const apiURL = `https://www.omdbapi.com/?apikey=${key}&type=movie&`;
const posterPlaceholderURL = 'https://imgur.com/mzbtmQz.png';
const nomIcon = '<svg class="nom_icon" viewBox="0 0 512 512"><path fill="rgb(14, 110, 84)" d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"></path></svg>';
const removeIcon = '<svg class="remove_icon" viewBox="0 0 512 512"><path fill="rgb(143, 18, 24)" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"></path></svg>';
const previousIcon = '<svg class="previous_icon" viewBox="0 0 512 512"><path fill="rgb(14, 110, 84)" d="M256 504C119 504 8 393 8 256S119 8 256 8s248 111 248 248-111 248-248 248zm116-292H256v-70.9c0-10.7-13-16.1-20.5-8.5L121.2 247.5c-4.7 4.7-4.7 12.2 0 16.9l114.3 114.9c7.6 7.6 20.5 2.2 20.5-8.5V300h116c6.6 0 12-5.4 12-12v-64c0-6.6-5.4-12-12-12z"></path></svg>';
const nextIcon = '<svg class="next_icon" viewBox="0 0 512 512"><path fill="rgb(14, 110, 84)" d="M256 8c137 0 248 111 248 248S393 504 256 504 8 393 8 256 119 8 256 8zM140 300h116v70.9c0 10.7 13 16.1 20.5 8.5l114.3-114.9c4.7-4.7 4.7-12.2 0-16.9l-114.3-115c-7.6-7.6-20.5-2.2-20.5 8.5V212H140c-6.6 0-12 5.4-12 12v64c0 6.6 5.4 12 12 12z"></path></svg>';
const nominationCount = 5;
let lastInputTime = 0;
let searchTerm = '';
let page;
let pageMax;

const test = function() {
  const Http = new XMLHttpRequest();
  const url = 'https://jsonplaceholder.typicode.com/posts';
  Http.open("GET", url);
  Http.send();

  Http.onreadystatechange = (e) => {
    console.log(Http.responseText);
  };
};

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

const displayPage = function(page, pageMax) {
  let txt = '';
  const pages = document.getElementById('pages');
  if (pageMax > 1) {
    if (page > 1) {
      txt += `
        <button class="svg_button page_button" onclick="changePage('previous')">
          <div class="svg_icon">
            ${previousIcon}
          </div>
          <div>
            Previous
          </div>
        </button>
      `;
    }
    if (page < pageMax) {
      txt += `
        <button class="svg_button page_button" onclick="changePage('next')">
          <div class="svg_icon">
            ${nextIcon}
          </div>
          <div>
            Next
          </div>
        </button>
      `;
    }
    pages.innerHTML = txt;

    if (page === 1 || page === pageMax) {
      pages.classList.add('edge_page');
    } else {
      pages.classList.remove('edge_page');
    }
  }
};

const clearSearchArea = function() {
  document.getElementById('result').innerHTML = '';
  document.getElementById('search_info').innerHTML = '';
  document.getElementById('pages').innerHTML = '';
};

const displayMovie = function(data) {
  let result = document.getElementById('result');
  const { Search } = data;
  pageMax = Math.ceil(data.totalResults / 10);

  test();

  window.scroll({
    top: 0,
    left: 0,
    behavior: 'auto'
  });

  console.log(data, pageMax);
  clearSearchArea();

  if (data.Response === "False") {
    result.innerHTML = `<b class="error_msg">Sorry! ${data.Error}<b>`;
  } else {
    for (const item of Search) {
      let poster = item.Poster === 'N/A' ? posterPlaceholderURL : item.Poster;
  
      result.innerHTML += `
      <li id="${item.imdbID}" class="result_item movie_item">
        <img class="result_item movie_poster" src="${poster}" alt="Poster for ${item.Title}">
        <div class="result_item movie_info">
          <h3 class="result_item movie_title">${item.Title}</h3>
          <h4 class="result_item movie_year">Year: ${item.Year}</h4>
          <button id="${item.imdbID}_nom_button" class="result_item nom_button svg_button" onclick="nominateMovie('${item.imdbID}', '${item.Title}', '${item.Year}', '${poster}')">
            <div class="svg_icon">
              ${nomIcon}
            </div>  
            Nominate
          </button>
        </div>
      </li>
      `;
      if (document.getElementById(`${item.imdbID}_nom`)) {
        document.getElementById(`${item.imdbID}_nom_button`).disabled = true;
      }
    }
  
    displayPage(page, pageMax);
   
    if (data.totalResults) {
      document.getElementById('search_info').innerHTML = `<b>${data.totalResults}</b> movies found for <b>"${searchTerm}"</b>`;
    }
  }
};

const nominateMovie = function(imdbID, movieTitle, movieYear, moviePoster) {
  let nomination = document.getElementById('nomination');

  if (nomination.children.length < 5) {
    nomination.innerHTML += `
      <li id="${imdbID}_nom" class="nom_item movie_item">
        <img class="nom_item movie_poster" src=${moviePoster} alt="Poster for ${movieTitle}">
        <div class="nom_item movie_info">
          <h3 class="nom_item movie_title">${movieTitle} (${movieYear})</h3>
          <button class="nom_item remove_button svg_button" onclick="removeMovie('${imdbID}')">
            ${removeIcon}
            Remove
          </button>
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
  searchBarResize();
};

const checkCoolDownFinished = function(time = 1000) {
  if (Date.now() - lastInputTime + 10 < time) {
    return false;
  }
  return true;
};

const searchBarResize = function() {
  const coolDown = 550;
  let input = document.getElementById('searchbar');

  if (input.value.trim().length >= 1) {
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
    if (document.getElementById('nomination').children.length === 0) {
      setTimeout(() => {
        if (checkCoolDownFinished(coolDown) && searchTerm.length === 0) {
          changeAllChildren(document.getElementById('search_box'), (element) => {
            element.classList.add('fullSearchBox');
          });
          document.getElementById('content_box').classList.add('hide');
        }
      }, coolDown);
    }
    input.classList.remove('maxSearchBar');
    input.classList.add('minSearchBar');
    changeAllChildren(document.getElementById('result_box'), (element) => {
      element.classList.add('hide');
    });
    clearSearchArea();
  }
};

const searchMovie = function() {
  let input = document.getElementById('searchbar');
  const coolDown = 500;
  const { value } = input;
  lastInputTime = Date.now();
  searchTerm = value.trim();

  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });

  setTimeout(() => {
    page = 1;
    if (checkCoolDownFinished(coolDown) && searchTerm.length > 1) {
      console.log(value);
      fetchFromApi(`${apiURL}s=${searchTerm}&page=${page}`, displayMovie);
    } else if (searchTerm.length === 1) {
      document.getElementById('result').innerHTML = `<b class="error_msg">Sorry! Search term too short!<b>`;
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