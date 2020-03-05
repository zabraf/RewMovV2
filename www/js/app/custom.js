function Update() {
  InsertOrUpdateLastUpdate("Tbl_Movies");
  CreateMovies();
  DeleteNowPlayingMovies();
  DeleteGenre();
  AddGenre();
  GetNowPlayingMovies().then(function (data) {
    data.forEach(movie => {
      AddImageThenMovie(movie, 1, 0)
    });
  });
  GetHTMLNowPlayingMovies();
}


  function AddGenre() {
    let maRequete = new Request("https://api.themoviedb.org/3/genre/movie/list?language=en-US", {
      method: 'GET',
      headers: { "Authorization": "Bearer  eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzY2RjMTk0ODc1YTYxNWQ3OWQ0NDMxMTgyMGRlY2Q2ZSIsInN1YiI6IjVkY2E1ZWQwNmMwZTRmMDAxODNkOTM2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mYxJPYquR3b6LzocmRLmeysJHbFnOyekblVIU21stzQ" }
    });
    return fetch(maRequete).then(function (reponse) {
      return reponse.json();
    }).then(function (reponse) {
      for (let i = 0; i < reponse.genres.length; i++) {
        InsertGenre(reponse.genres[i]["id"], reponse.genres[i]["name"]);
      }
    });
  }

  function AddImageThenMovie(movie, Is_NowPLaying, Is_Favorite) {
    fetch("https://image.tmdb.org/t/p/w500" + movie["poster_path"]).then(function (reponse) {
      return reponse.blob();
    }).then(function (reponse) {
      let reader = new FileReader();
      reader.readAsDataURL(reponse);
      reader.onloadend = function () {
        movie["poster_path"] = reader.result;
        movie["genre_ids"].forEach(genre => {
          InsertMovieGenre(movie["id"], genre)
        });
        InsertMovies(movie["id"], encodeURI(movie["title"]), encodeURI(movie["overview"]), movie["vote_average"], movie["release_date"], movie["original_language"], movie["poster_path"], Is_NowPLaying, Is_Favorite);
      }
    });
  }

  function GetHTMLNowPlayingMovies() {
    let html = "";
    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM Tbl_Movies WHERE Is_Playing = 1', [], function (tx, results) {
        for (let i = 0; i < results.rows.length; i++) {
          html += '<tr> <td style="width: 25%; height: auto;"id="img"><img style="width : 100%" src="' + results.rows[i]["Blb_Image"] + '"/></td> <td valign="Top"><a class="notA" href="/Movie/' + results.rows[i]["Id_Movie"] + '"> <h3 style="margin: 0px;">' + decodeURI(results.rows[i]["Nm_Title"]) + '</h3>' + ' Rating : ' + results.rows[i]["Nb_VoteAverage"] + '/10 <h6 style="margin: 0px;">' + decodeURI(results.rows[i]["Txt_Synopsis"]) + '</h6></a><button class=' + results.rows[i]["Id_Movie"] + ' onclick="' + (results.rows[i]["Is_Favorite"] ? "AddOrRemoveFavorite(" + results.rows[i]["Id_Movie"] + ",0,this)" : "AddOrRemoveFavorite(" + results.rows[i]["Id_Movie"] + ",1,this)") + '" type="button" style="margin-left: 90%; width: 10%; padding : 0%;background: transparent; border: none !important;"><i class="icon material-icons if-md">' + (results.rows[i]["Is_Favorite"] ? "star" : "star_border") + '</i></button></a> </td> </tr>';
        }
        document.getElementById("NowPlaying").innerHTML = html;
      }, null);
    });
  }

  function GetHTMLFavorites() {
    let html = "";
    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM Tbl_Movies WHERE Is_favorite = 1', [], function (tx, results) {
        for (let i = 0; i < results.rows.length; i++) {
          html += '<tr> <td style="width: 25%; height: auto;"id="img"><img style="width : 100%" src="' + results.rows[i]["Blb_Image"] + '"/></td> <td valign="Top"><a class="notA" href="/Movie/' + results.rows[i]["Id_Movie"] + '"> <h3 style="margin: 0px;">' + decodeURI(results.rows[i]["Nm_Title"]) + '</h3>' + ' Rating : ' + results.rows[i]["Nb_VoteAverage"] + '/10 <h6 style="margin: 0px;">' + decodeURI(results.rows[i]["Txt_Synopsis"]) + '</h6></a><button class=' + results.rows[i]["Id_Movie"] + ' onclick="' + (results.rows[i]["Is_Favorite"] ? "AddOrRemoveFavorite(" + results.rows[i]["Id_Movie"] + ",0,this)" : "AddOrRemoveFavorite(" + results.rows[i]["Id_Movie"] + ",1,this)") + '" type="button" style="margin-left: 90%; width: 10%; padding : 0%;background: transparent; border: none !important;"><i class="icon material-icons if-md">' + (results.rows[i]["Is_Favorite"] ? "star" : "star_border") + '</i></button></a> </td> </tr>';
        }
        document.getElementById("favorites").innerHTML = html;
      }, null);
    });
  }


  function GetHTMLDetailled(idMovies) {
    let movie;
    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM Tbl_Movies WHERE Id_Movie = ' + idMovies, [], function (tx, results) {
        movie = results.rows[0];
        if (movie != null) {
          let date = new Date(movie.Dt_ReleaseDate);
          document.getElementById("title").innerHTML = decodeURI(movie.Nm_Title);
          document.getElementById("image").src = movie.Blb_Image;
          document.getElementById("year").innerHTML = date.getFullYear();
          document.getElementById("rating").innerHTML = movie.Nb_VoteAverage + "/10";
          document.getElementById("synopsis").innerHTML = decodeURI(movie.Txt_Synopsis);
          document.getElementById("genres").innerHTML = 1;//TODO:
          document.getElementById("release").innerHTML = date.toLocaleString('default', { day: 'numeric', month: 'long', year: "numeric" })
          document.getElementById("original").innerHTML = movie.Txt_OriginalLanguage;
        }
        else {
          let maRequete = new Request('https://api.themoviedb.org/3/movie/' + idMovies + '?api_key=&language=en-US', {
            method: 'GET',
            headers: { "Authorization": "Bearer  eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzY2RjMTk0ODc1YTYxNWQ3OWQ0NDMxMTgyMGRlY2Q2ZSIsInN1YiI6IjVkY2E1ZWQwNmMwZTRmMDAxODNkOTM2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mYxJPYquR3b6LzocmRLmeysJHbFnOyekblVIU21stzQ" }
          });
          return fetch(maRequete).then(function (reponse) {
            return reponse.json();
          }).then(function (reponse) {
            let date = new Date(reponse["release_date"]);
            document.getElementById("title").innerHTML = reponse["title"]
            document.getElementById("image").src = "https://image.tmdb.org/t/p/w500" + reponse["poster_path"]
            document.getElementById("year").innerHTML = date.getFullYear();
            document.getElementById("rating").innerHTML = reponse["vote_average"] + "/10";
            document.getElementById("synopsis").innerHTML = reponse["overview"]
            let genre = "";
            for (let i = 0; i < reponse["genres"].length; i++) {
              genre += reponse["genres"][i]["name"] + ", ";
            }
            document.getElementById("genres").innerHTML = genre;
            document.getElementById("release").innerHTML = date.toLocaleString('default', { day: 'numeric', month: 'long', year: "numeric" })
            document.getElementById("original").innerHTML = reponse["original_language"]
          });
        }
      }, null);
    });
  }

  function ShowGenreName(genreString) {
    let movie;
  }


  function GetNowPlayingMovies() {
    let maRequete = new Request('https://api.themoviedb.org/3/movie/now_playing?language=en-EN&page=1', {
      method: 'GET',
      headers: { "Authorization": "Bearer  eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzY2RjMTk0ODc1YTYxNWQ3OWQ0NDMxMTgyMGRlY2Q2ZSIsInN1YiI6IjVkY2E1ZWQwNmMwZTRmMDAxODNkOTM2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mYxJPYquR3b6LzocmRLmeysJHbFnOyekblVIU21stzQ" }
    });
    return fetch(maRequete).then(function (reponse) {
      return reponse.json();
    }).then(function (reponse) {
      return reponse.results;
    });
  }


  function GetSearchedMovies(search, year) {
    let requestString = "https://api.themoviedb.org/3/search/movie?language=en-US&page=1&include_adult=false"
    if (search.value != "" && search.value != null) {
      requestString += '&query=' + search.value;
      if (year.value != "None") {
        requestString += '&year=' + year.value;
      }
      let maRequete = new Request(requestString, {

        method: 'GET',
        headers: { "Authorization": "Bearer  eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzY2RjMTk0ODc1YTYxNWQ3OWQ0NDMxMTgyMGRlY2Q2ZSIsInN1YiI6IjVkY2E1ZWQwNmMwZTRmMDAxODNkOTM2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mYxJPYquR3b6LzocmRLmeysJHbFnOyekblVIU21stzQ" }
      });
      return fetch(maRequete).then(function (reponse) {
        return reponse.json();
      }).then(function (reponse) {
        let html = "";
        if (reponse == null) {
          html = "<h1> No result found </h1>"
        }
        //FIXME: no Setup
        for (let i = 0; i < reponse["results"].length; i++) {
          html += '<tr> <td style="width: 25%; height: auto;"id="img"><img style="width : 100%" src="https://image.tmdb.org/t/p/w500' + reponse["results"][i]["poster_path"] + '"/></td> <td valign="Top"><a class="notA" href="/Movie/' + reponse["results"][i]["id"] + '"> <h3 style="margin: 0px;">' + reponse["results"][i]["title"] + '</h3>' + ' Rating : ' + reponse["results"][i]["vote_average"] + '/10 <h6 style="margin: 0px;">' + reponse["results"][i]["overview"] + '</h6></a></td> </tr>';
        }
        document.getElementById("searched").innerHTML = html
      });
    }
    else {
      search.placeholder = "Please enter a title";
    }

  }


  function SetDropDown() {
    today = new Date();
    let html = '<option value="None" selected>None</option>';
    for (let i = today.getFullYear(); i > today.getFullYear() - 100; i--) {
      html += '<option value="' + i + '">' + i + '</option>';
    }
    document.getElementById("yearSearch").innerHTML = html;
  }


  function AddOrRemoveFavorite(idMovies, value, button) {
    let html = '<i class="icon material-icons if-md">';
    let lastClass = document.getElementsByClassName(button.className).length - 1
    if (value) {
      html += "star</i>";
      document.getElementsByClassName(button.className)[lastClass].onclick = Function("AddOrRemoveFavorite(" + idMovies + ",0,this)");
    } else {
      html += "star_border</i>";
      document.getElementsByClassName(button.className)[lastClass].onclick = Function("AddOrRemoveFavorite(" + idMovies + ",1,this)");
    }
    document.getElementsByClassName(button.className)[lastClass].innerHTML = html;

    FavoriteExiste(idMovies, value)
  }

  function FavoriteExiste(idMovies, value) {
    let existe;
    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM Tbl_Movies WHERE Id_Movie = ' + idMovies, [], function (tx, results) {
        if (results.rows[0] == null) {
          GetMovieWithId(idMovies);
        } else {
          UpdateFavorite(idMovies, value)
        }
      }, null);
    });
  }

  function GetMovieWithId(idMovies) {
    let maRequete = new Request('https://api.themoviedb.org/3/movie/' + idMovies + '?language=en-US', {
      method: 'GET',
      headers: { "Authorization": "Bearer  eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzY2RjMTk0ODc1YTYxNWQ3OWQ0NDMxMTgyMGRlY2Q2ZSIsInN1YiI6IjVkY2E1ZWQwNmMwZTRmMDAxODNkOTM2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mYxJPYquR3b6LzocmRLmeysJHbFnOyekblVIU21stzQ" }
    });
    return fetch(maRequete).then(function (reponse) {
      return reponse.json();
    }).then(function (reponse) {
      AddImageThenMovie(reponse, 0, 1)
    });
  }