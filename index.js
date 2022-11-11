const searchInput = document.getElementById("search-input")
const movies = document.getElementById("movies")
const searchForm = document.getElementById("search-form")

document.addEventListener("click", function(e) {
    if (e.target.id === "search-btn") {
        e.preventDefault()
        if (searchForm.checkValidity()) {
            let searchInputValue = searchInput.value
            let title = searchInputValue.toLowerCase().replace(/ /g, "+")
    
            fetch(`https://www.omdbapi.com/?apikey=aa87202c&t=${title}&plot=short`)
                .then(res => res.json())
                .then(data => {
                    if (data.Error) {
                        let html = "<h4>Unable to find what you’re looking for. Please try another search.</h4>"
                        movies.innerHTML = html
                        searchInput.value = ""
                    } else {
                        renderSearchResult(data)
                    }
                })
        }
    }
    removeFromWatchlist(e.target.id)
})

renderWatchlist()

function renderSearchResult(data){
    const { Poster, Title, Runtime, Genre, Plot } = data
    let html = `
            <div class="movie">
                <img class="movie-img" src="${Poster}">
                <div class="movie-info">
                    <h2 class="movie-title">${Title}</h2>
                    <div class="movie-details">
                        <span>${Runtime}</span>
                        <span>${Genre}</span>
                        <button id="${Title}" class="add-to-watchlist">
                            <i class="fa-solid fa-circle-plus"></i>Watchlist
                        </button>
                    </div>
                    <p class="movie-descrption">${Plot}</p>
                </div>
            </div>`
    movies.innerHTML = html
    searchInput.value = ""
    
    document.addEventListener("click", function(e) {
        if (e.target.id === Title) {
            let movieObj = JSON.stringify(data)
            localStorage.setItem(`${Title}`, movieObj)    
        }
        
    })
}

function renderWatchlist() {
    let watchlistHtml = ""

    for (let i = 0; i< localStorage.length; i++) {
        let watchlistItem = JSON.parse(localStorage.getItem(localStorage.key(i)))

        watchlistHtml +=`
                <div class="movie">
                    <img class="movie-img" src="${watchlistItem.Poster}">
                    <div class="movie-info">
                        <h2 class="movie-title">${watchlistItem.Title}</h2>
                        <div class="movie-details">
                            <span>${watchlistItem.Runtime}</span>
                            <span>${watchlistItem.Genre}</span>
                            <button id="${watchlistItem.Title}" class="add-to-watchlist remove">
                            <i class="fa-solid fa-circle-minus"></i>Remove
                            </button>
                        </div>
                        <p class="movie-descrption">${watchlistItem.Plot}</p>
                    </div>
                </div>`
    }
    document.getElementById("watchlist").innerHTML = watchlistHtml
    if (localStorage.length === 0) {
        document.getElementById("watchlist").innerHTML =`
                <h3>Your watchlist is looking a little empty...</h3>
                    <a href="./index.html" class="back-to-search">
                    <i class="fa-solid fa-circle-plus icon-watchlist"></i>Let’s add some movies!
                </a>`

    }
}

function removeFromWatchlist(id) {
    for (let i = 0; i < localStorage.length; i++) {
        if (id === localStorage.key(i)) {
            localStorage.removeItem(id)
        }
    }
    renderWatchlist()
}






