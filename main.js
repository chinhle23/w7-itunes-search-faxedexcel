'use strict'

function querySelect(selector) {
    return document.querySelector(selector);
}

function querySelectA(selector) {
    return document.querySelectorAll(selector);
}

function getSongs(search) {
    return fetch(`https://itunes-api-proxy.glitch.me/search?term=${encodeURIComponent(search)}&limit=100&entity=song`)
        // 'fetch()' takes an API URL as an argument and returns a 'promise'
        // 'promise' has a method called 'then()' that we can give a callback function
        // 'then()' method can be chained together
        // 'then()' method also returns a 'promise' and is 'resolved' when ran
        // 'promise' has a 2nd method called 'catch()' to catch errors
        // 'encodeURIComponenet()' function
        .then(function(response) {
            if (!response.ok) {
                throw Error(response.statusText)
            }
            return response.json();
        })
}  

function updateSongs(search) {
    getSongs(search)
    .then(function (songList) {
        console.log(songList)
        const songListDiv = querySelect('.song_list');
        songListDiv.innerText = "";
        const searchTermDiv = querySelect('#search_term');
        const searchTerm = querySelect('.input_box');
        searchTermDiv.innerHTML = `Search term: "${searchTerm.value}"`;
        searchTerm.value = "";
        createFilterButtons();
        for (let song of songList.results) {
            const songInfoDiv = document.createElement('div');

            const imageDiv = document.createElement('div');
            const songAudio = document.createElement('audio');
            const songDiv = document.createElement('div');
            const albumDiv = document.createElement('div');
            const artistDiv = document.createElement('div');
            
            
            songInfoDiv.classList.add("song_info");
            imageDiv.innerHTML = `<img data-audio-id="audio-id${songList.results.indexOf(song)}" class="song_image" src="${song.artworkUrl100}" alt="${song.collectionName}">`
            songAudio.id = `audio-id${songList.results.indexOf(song)}`
            songAudio.classList.add("song_audio");
            songAudio.innerHTML = `<source src="${song.previewUrl}">`
            songDiv.classList.add("song");
            songDiv.innerHTML = `<span class="label">Track: </span>${song.trackName}`;
            albumDiv.classList.add("song");
            albumDiv.innerHTML = `<span class="label">Album: </span>${song.collectionName}`;
            artistDiv.classList.add("song");
            artistDiv.innerHTML = `<span class="label">Artist: </span>${song.artistName}`;

            imageDiv.append(songAudio);
            songInfoDiv.appendChild(imageDiv);
            songInfoDiv.appendChild(songDiv);
            songInfoDiv.appendChild(albumDiv);
            songInfoDiv.appendChild(artistDiv);
            
            songListDiv.appendChild(songInfoDiv);
        }
    })
}

function createFilterButtons() {
    const filterDiv = querySelect('#filter');
    filterDiv.innerText = "";
    filterDiv.innerHTML = `Filter by:  
    <input type="radio" id="none" name="song_filter" value="none" checked> <label for="none">None</label>
    <input type="radio" id="track" name="song_filter" value="track"> <label for="track">Track</label>  
    <input type="radio" id="artist" name="song_filter" value="artist"> <label for="artist">Artist</label>  
    <input type="radio" id="album" name="song_filter" value="album"> <label for="album">Album</label>     
    `;
}

function playSong() {
    querySelect('#songs').addEventListener('click', function(event) {
        if (event.target && event.target.nodeName === 'IMG') {    
            console.log('image item clicked');
            const img = event.target
            console.log(img.dataset['audioId'])
            let song = querySelect(`#${img.dataset['audioId']}`)
            if (!song.paused) {
                // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
                song.pause();
            } else {
                song.play();
            }
            
        }
    })
}

function main() {
    querySelect('#search').addEventListener('change', function(event) {
        updateSongs(event.target.value)
        
    });
    playSong();
}

document.addEventListener('DOMContentLoaded', main);
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event
    // 'main' is a callback function (a function passed into another function as an argument)