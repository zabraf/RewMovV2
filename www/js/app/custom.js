/*
Raphael Lopes
RewMov
15.03.2020
*/
let countUpdate = 0;
//permet de mettre a jours la DB
function Update() {
  CreateLastUpdate()
  InsertOrUpdateLastUpdate("Tbl_Movies");
  CreateGenre();
  CreateMovies();
  CreateMovieGenre();
  DeleteNowPlayingMovies();
  DeleteGenre();
  AddGenre();
  countUpdate = 0;
  GetNowPlayingMovies().then(function (data) {
    data.forEach(movie => {
      AddImageThenMovie(movie, 1, 0,true)
    });
    GetHTMLNowPlayingMovies();
  });
}
//rajoute tout les genres dans la DB
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
//va chercher l'image la stock dans la DB et après stock le film
  function AddImageThenMovie(movie, Is_NowPLaying, Is_Favorite,is_Update) {
    fetch("https://image.tmdb.org/t/p/w500" + movie["poster_path"]).then(function (reponse) {
      return reponse.blob();
    }).then(function (reponse) {
      let reader = new FileReader();
      reader.readAsDataURL(reponse);
      reader.onloadend = function () {
        movie["poster_path"] = reader.result;
        if(movie["genre_ids"] == null)
        {
           movie["genres"].forEach(genre => {
            InsertMovieGenre(movie["id"], genre["id"])
          });
        }
        else
        {
          movie["genre_ids"].forEach(genre => {
            InsertMovieGenre(movie["id"], genre)
          });
        }
        
        InsertMovies(movie["id"], encodeURI(movie["title"]), encodeURI(movie["overview"]), movie["vote_average"], movie["release_date"], movie["original_language"], movie["poster_path"], Is_NowPLaying, Is_Favorite);
        //si il sagit d'un update et que 20 film on été ajouter affiche les films actuellement au cinéma
        if(is_Update)
        {
          
          if(countUpdate >= 19)
          {
            GetHTMLNowPlayingMovies()
          }
          else
          {
            countUpdate++;
          }
        }
      }
    });
  }
// affiche les films actuellement au cinéma
  function GetHTMLNowPlayingMovies() {
    let html = "";
    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM Tbl_Movies WHERE Is_Playing = 1', [], function (tx, results) {
        for (let i = 0; i < results.rows.length; i++) {
          html += '<tr> <td style="width: 25%; height: auto;"id="img"><img style="width : 100%" src="' + results.rows[i]["Blb_Image"] + '"/></td> <td valign="Top"><a class="notA" href="/Movie/' + results.rows[i]["Id_Movie"] + '"> <h3 style="margin: 0px;">' + decodeURI(results.rows[i]["Nm_Title"]) + '</h3>' + ' Rating : ' + results.rows[i]["Nb_VoteAverage"] + '/10 <h6 style="margin: 0px;">' + decodeURI(results.rows[i]["Txt_Synopsis"]) + '</h6></a><button class=' + results.rows[i]["Id_Movie"] + ' onclick="' + (results.rows[i]["Is_Favorite"] ? "AddOrRemoveFavorite(" + results.rows[i]["Id_Movie"] + ",0,this)" : "AddOrRemoveFavorite(" + results.rows[i]["Id_Movie"] + ",1,this)") + '" type="button" style="margin-left: 90%; width: 10%; padding : 0%;background: transparent; border: none !important;"><i class="icon material-icons if-md">' + (results.rows[i]["Is_Favorite"] ? "star" : "star_border") + '</i></button></a> </td> </tr>';
        }
        document.getElementsByClassName("NowPlaying")[document.getElementsByClassName("NowPlaying").length - 1].innerHTML = html;
      }, null);
    });
  }
//affiche les films favoris
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

//affiche un film en detail qu'il soit dans la DB ou depuis API
  function GetHTMLDetailled(idMovies) {
    let movie;
    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM Tbl_Movies WHERE Id_Movie = ' + idMovies, [], function (tx, results) {
        movie = results.rows[0];
        //verfie si le film est dans la DB ou non
        if (movie != null) {
          let date = new Date(movie.Dt_ReleaseDate);
          ShowGenreName(idMovies);
          document.getElementById("title").innerHTML = decodeURI(movie.Nm_Title);
          document.getElementById("image").src = movie.Blb_Image;
          document.getElementById("year").innerHTML = date.getFullYear();
          document.getElementById("release").innerHTML = date.toLocaleString('default', { day: 'numeric', month: 'long', year: "numeric" })
          if(movie.Nb_VoteAverage == 0)
          {
            document.getElementById("rating").innerHTML = "ND" + "/10";
          }
          else
          {
            document.getElementById("rating").innerHTML = movie.Nb_VoteAverage + "/10";
          }
          
          document.getElementById("synopsis").innerHTML = decodeURI(movie.Txt_Synopsis);
          document.getElementById("release").innerHTML = date.toLocaleString('default', { day: 'numeric', month: 'long', year: "numeric" })
          if(movie.Txt_OriginalLanguage == null)
          {
            document.getElementById("original").innerHTML = "ND";
          }
          else
          {
            document.getElementById("original").innerHTML = movie.Txt_OriginalLanguage;
          }

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

            document.getElementById("title").innerHTML = reponse["title"];
            document.getElementById("image").src = "https://image.tmdb.org/t/p/w500" + reponse["poster_path"];
            document.getElementById("year").innerHTML = date.getFullYear();
            if(reponse["vote_average"] != 0)
            {
              document.getElementById("rating").innerHTML = reponse["vote_average"] + "/10";
            }
            else
            {
              document.getElementById("rating").innerHTML = "ND" + "/10";
            }
            document.getElementById("synopsis").innerHTML = reponse["overview"];
            let genre = "";
            for (let i = 0; i < reponse["genres"].length; i++) {
              genre += reponse["genres"][i]["name"] + ", ";
            }
            document.getElementById("genres").innerHTML = genre;
            document.getElementById("release").innerHTML = date.toLocaleString('default', { day: 'numeric', month: 'long', year: "numeric" });
            if(reponse["original_language"] != null)
            {
              document.getElementById("original").innerHTML = reponse["original_language"];
            }
            else
            {
              document.getElementById("original").innerHTML = "ND";
            }
          });
        }
      }, null);
    });
  }
//affiche les genres d'un film dans la DB
  function ShowGenreName(idMovies) {
    let html = "";
    db.transaction(function (tx) {
      tx.executeSql('SELECT nomGenre FROM Tbl_Genres, FK_Tbl_MovieGenre WHERE Id_Genre = Fk_Id_Genre AND Fk_Id_Movie = ' + idMovies, [], function (tx, results) {
        for (let i = 0; i < results.rows.length; i++) {
          html += results.rows[i]["nomGenre"] + ", ";
        }
        document.getElementById("genres").innerHTML = html;
      }, null);
    });
  }

//recuprer les films actuellement au cinema dans la DB
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

//retourne les films rechecher avec le titre + année (non obligatoire)
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
        else{
        document.getElementById("searched").innerHTML = "";
        for (let i = 0; i < reponse["results"].length; i++) {
          html = '<tr> <td style="width: 25%; height: auto;"id="img"><img style="width : 100%"  alt="" src="https://image.tmdb.org/t/p/w500' + reponse["results"][i]["poster_path"] + '"/></td><td valign="Top"><a class="notA" href="/Movie/' + reponse["results"][i]["id"] + '"> <h3 style="margin: 0px;">' + reponse["results"][i]["title"] + '</h3>' + ' Rating : ' + (reponse["results"][i]["vote_average"] != 0 ? reponse["results"][i]["vote_average"] : "ND") + '/10 <h6 style="margin: 0px;">' + reponse["results"][i]["overview"] + '</h6>';
          IsSearchedFavorite(reponse["results"][i]["id"],html);
          }
        }
      });
    }
    else {
      search.placeholder = "Please enter a title";
    }

  }
  //verifie si le film existe deja dans la DB et affiche le logo etoile en fonction de si il est dedans ou non
  function IsSearchedFavorite(idMovie,html)
  {
    db.transaction(function (tx) {
      tx.executeSql('SELECT Is_Favorite FROM Tbl_Movies WHERE Id_Movie = ' + idMovie, [], function (tx, results) {
        if (results.rows[0] != null && results.rows[0]["Is_Favorite"] == 1) {
          html += '</a><button class=' + idMovie + ' onclick="' + "AddOrRemoveFavorite(" + idMovie + ",0,this)"+ '" type="button" style="margin-left: 90%; width: 10%; padding : 0%;background: transparent; border: none !important;"><i class="icon material-icons if-md">star</i></button></td> </tr>'
        } else {
          html += '</a><button class=' + idMovie + ' onclick="' + "AddOrRemoveFavorite(" + idMovie + ",1,this)"+ '" type="button" style="margin-left: 90%; width: 10%; padding : 0%;background: transparent; border: none !important;"><i class="icon material-icons if-md">star_border</i></button> </td> </tr>'
        }
        document.getElementById("searched").innerHTML += html;
      }, null);
    });
  }
//met les 100 dernière année dans le dropdown
  function SetDropDown() {
    today = new Date();
    let html = '<option value="None" selected>None</option>';
    for (let i = today.getFullYear(); i > today.getFullYear() - 100; i--) {
      html += '<option value="' + i + '">' + i + '</option>';
    }
    document.getElementById("yearSearch").innerHTML = html;
  }

//enleve ou ajoute au favoris
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

    AddOrRemoveFavoriteInDB(idMovies, value)
  }
//enleve ou ajoute au favoris dans la DB
  function AddOrRemoveFavoriteInDB(idMovies, value) {
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
//retourne un film et le stock dans la DB de API avec l'id
  function GetMovieWithId(idMovies) {
    let maRequete = new Request('https://api.themoviedb.org/3/movie/' + idMovies + '?language=en-US', {
      method: 'GET',
      headers: { "Authorization": "Bearer  eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzY2RjMTk0ODc1YTYxNWQ3OWQ0NDMxMTgyMGRlY2Q2ZSIsInN1YiI6IjVkY2E1ZWQwNmMwZTRmMDAxODNkOTM2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mYxJPYquR3b6LzocmRLmeysJHbFnOyekblVIU21stzQ" }
    });
    return fetch(maRequete).then(function (reponse) {
      return reponse.json();
    }).then(function (reponse) {
      AddImageThenMovie(reponse, 0, 1,false)
    });
  }