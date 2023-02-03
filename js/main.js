/*********************************************************************************
*  BTI425 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Nolan Smith Student ID: 101664217 Date: 22/02/03
*
********************************************************************************/ 


var page = 1
var perPage = 10

const loadMovieData = (title = null) => {
    let url = (title != null) ? `https:calm-blue-colt-tutu.cyclic.app/api/movies?page=${page}&perPage=${perPage}&title=${title}` : `https:calm-blue-colt-tutu.cyclic.app/api/movies?page=${page}&perPage=${perPage}`
    if(title != null) {
        page = 1;
        document.getElementById("pageSelector").classList.add("d-none")
    }
    else {
        document.getElementById("pageSelector").classList.remove("d-none")
    }
    
    fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    let movieRows = `
                        ${data.map(movie => (
                            `<tr data-id=${movie._id}>
                                <td>${movie.year}</td>
                                <td>${movie.title}</td>
                                <td>${(movie.plot) ? movie.plot : "N/A"}</td>
                                <td>${(movie.rated) ? movie.rated : "N/A"}</td>
                                <td>${Math.floor(movie.runtime / 60) + ":" + (movie.runtime % 60).toString().padStart(2, '0')}</td>
                            </tr>`
                        )).join('')}
                        `;

                    document.querySelector('#moviesTable tbody').innerHTML = movieRows;
                    document.querySelector('#curPage').innerHTML = page
                    
                    // add the "click" event listener to the newly created rows
                    document.querySelectorAll('#moviesTable tbody tr').forEach((row) => {
                        console.log("get")
                        row.addEventListener('click', (e) => {
                            let dataId = row.getAttribute('data-id');
                            fetch(`https:calm-blue-colt-tutu.cyclic.app/api/movies/${dataId}`)
                            .then((res) => res.json())
                            .then((data) => {
                                document.querySelector('#modalTitle').innerHTML = data.title;
                                console.log(data.title)
                                let movieInfo = `
                                ${
                                    (data.poster) ?  `<img class="img-fluid w-100" src="${data.poster}"><br><br></br>` : ``
                                }
                                   
                                    <strong>Directed By: </strong>
                                    ${data.directors.map(director => (`
                                        ${director}
                                    `
                                    )).join(',')}<br><br>

                                    <p>${data.fullplot}</p>

                                    <strong>Cast: </strong>

                                    ${
                                        (data.cast) ? 
                                        data.cast.map(actor => (`
                                            ${actor}
                                        `
                                        )).join(',') : "N/A"
                                    }
                                    <br><br>

                                    <strong>Awards: </strong>${data.awards.text}<br>
                                    
                                    <strong>IMDB Rating:</strong> ${data.imdb.rating} (${data.imdb.votes} votes)
                                `;
                                document.querySelector("#detailsModal .modal-body").innerHTML = movieInfo

                                let modal = new bootstrap.Modal(document.getElementById('detailsModal'), {
                                    backdrop: 'static',
                                    keyboard: false,
                                });
                                modal.show();
                            });
                        });
                    });
                });
}

document.addEventListener('DOMContentLoaded', function () {
    loadMovieData();
    document.querySelector("#searchForm").addEventListener("submit", (event)  => {
        loadMovieData(document.querySelector('#title').value)
    })
    document.querySelector("#prevPage").addEventListener("click", (event)  => {
        if(page != 1) {
            page --;
            loadMovieData()
        }
    })
    document.querySelector("#nextPage").addEventListener("click", (event)  => {
        page ++;
        loadMovieData()
    })
    
    document.querySelector("#clearForm").addEventListener("click", (event)  => {
        document.querySelector('#title').value = ""
        loadMovieData()
    })
    
});
