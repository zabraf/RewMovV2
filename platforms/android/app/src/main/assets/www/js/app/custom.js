function InsertNowPlayingMovies() {
  GetNowPlayingMovies().then(function (data) {
    data.forEach(el => {
      fetch("https://image.tmdb.org/t/p/w500" + el["poster_path"]).then(function (reponse) {

        return reponse.blob();
      }).then(function (reponse) {
        let reader = new FileReader();
        reader.readAsDataURL(reponse);
        reader.onloadend = function () {
          el["poster_path"] = reader.result;
          InsertMovies(el["id"], encodeURI(el["title"]), encodeURI(el["overview"]), 1, el["vote_average"], el["release_date"], el["original_language"], el["poster_path"], 1, 0);
        }
      });
    });
  });
}
function GetHTMLNowPlayingMovies() {
  if (false) {
    InsertNowPlayingMovies();
  }
  else {
    let html = "";
    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM Tbl_Movies', [], function (tx, results) {
        for (let i = 0; i < results.rows.length; i++) {
          html += '<tr> <td style="width: 25%; height: auto;"id="img"><img style="width : 100%" src="' + results.rows[i]["Blb_Image"] + '"/></td> <td valign="Top"><a class="notA" href="/Movie/' + results.rows[i]["Id_Movie"] + '"> <h3 style="margin: 0px;">' + decodeURI(results.rows[i]["Nm_Title"]) + '</h3>' + ' Rating : ' + results.rows[i]["Nb_VoteAverage"] + '/10 <h6 style="margin: 0px;">' + decodeURI(results.rows[i]["Txt_Synopsis"]) + '</h6></a><button class=' + results.rows[i]["Id_Movie"] + ' onclick="' + (results.rows[i]["Is_Favorite"] ? "AddOrRemoveFavorite(" + results.rows[i]["Id_Movie"] + ",0,this)" : "AddOrRemoveFavorite(" + results.rows[i]["Id_Movie"] + ",1,this)") + '" type="button" style="margin-left: 90%; width: 10%; padding : 0%;background: transparent; border: none !important;"><i class="icon material-icons if-md">' + (results.rows[i]["Is_Favorite"] ? "star" : "star_border") + '</i></button></a> </td> </tr>';
        }
        document.getElementById("NowPlaying").innerHTML = html;
      }, null);
    });
  }
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
      let date = new Date(movie.Dt_ReleaseDate);
      document.getElementById("title").innerHTML = decodeURI(movie.Nm_Title);
      document.getElementById("image").src = movie.Blb_Image;
      document.getElementById("year").innerHTML = date.getFullYear();
      document.getElementById("rating").innerHTML = movie.Nb_VoteAverage + "/10";
      document.getElementById("synopsis").innerHTML = decodeURI(movie.Txt_Synopsis);
      document.getElementById("genres").innerHTML = movie.Id_Genre;
      document.getElementById("release").innerHTML = date.toLocaleString('default', {day : 'numeric',month : 'long',year : "numeric"})
      document.getElementById("original").innerHTML = movie.Txt_OriginalLanguage;
      
    }, null);
  });
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
function GetSearchedMovies(search,year) {
  let requestString = "https://api.themoviedb.org/3/search/movie?language=en-US&page=1&include_adult=false"
  //'&query=' search;
  //'&year=' + year;
  if(query != null)
  {

  }
  let maRequete = new Request(requestString, {
  
    method: 'GET',
    headers: { "Authorization": "Bearer  eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzY2RjMTk0ODc1YTYxNWQ3OWQ0NDMxMTgyMGRlY2Q2ZSIsInN1YiI6IjVkY2E1ZWQwNmMwZTRmMDAxODNkOTM2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mYxJPYquR3b6LzocmRLmeysJHbFnOyekblVIU21stzQ" }
  });
  return fetch(maRequete).then(function (reponse) {
    return reponse.json();
  }).then(function (reponse) {
    return reponse.results;
  });
}
function AddOrRemoveFavorite(idMovies,value,button)
{
  let html = '<i class="icon material-icons if-md">';
  let lastClass = document.getElementsByClassName(button.className).length - 1
  if(value)
  {
    html += "star</i>";
    document.getElementsByClassName(button.className)[lastClass].onclick  = Function("AddOrRemoveFavorite(" + idMovies + ",0,this)");
  }else
  {
     html += "star_border</i>";
     document.getElementsByClassName(button.className)[lastClass].onclick  = Function("AddOrRemoveFavorite(" + idMovies + ",1,this)");
  }
  document.getElementsByClassName(button.className)[lastClass].innerHTML = html;
  
  UpdateFavorite(idMovies,value)
}