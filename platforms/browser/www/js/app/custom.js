function InsertNowPlayingMovies() {
  GetNowPlayingMovies().then(function (data) {
    data.forEach(el => {
      fetch("https://image.tmdb.org/t/p/w500" + el["poster_path"]).then(function (reponse) {

        return reponse.blob();
      }).then(function (reponse) {
        var reader = new FileReader();
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
    var html = "";
    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM Tbl_Movies', [], function (tx, results) {
        for (var i = 0; i < results.rows.length; i++) {
          html += '<tr> <td style="width: 25%; height: auto;"id="img"><img style="width : 100%" src="' + results.rows[i]["Blb_Image"] + '"/></td> <td valign="Top"><a class="notA" href="/Movie/1"> <h3 style="margin: 0px;">' + decodeURI(results.rows[i]["Nm_Title"]) + '</h3>' + ' Rating : ' + results.rows[i]["Nb_VoteAverage"] + '/10 <h6 style="margin: 0px;">' + decodeURI(results.rows[i]["Txt_Synopsis"]) + '</h6></a><button onclick="' + (results.rows[i]["Is_Favorite"] ? "UpdateFavorite(" + results.rows[i]["Id_Movie"] + ",0)" : "UpdateFavorite(" + results.rows[i]["Id_Movie"] + ",1)") + '" type="button" style="margin-left: 90%; width: 10%; padding : 0%;background: transparent; border: none !important;"><i class="icon material-icons if-md">' + (results.rows[i]["Is_Favorite"] ? "star" : "star_border") + '</i></button> </td> </tr></a>';
        }
        document.getElementById("NowPlaying").innerHTML = html;
      }, null);
    });
  }
}
function GetHTMLFavorites() {
  var html = "";
  db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM Tbl_Movies WHERE Is_favorite = 1', [], function (tx, results) {
      for (var i = 0; i < results.rows.length; i++) {
        html += '<tr> <td style="width: 25%; height: auto;"id="img"><img style="width : 100%" src="' + results.rows[i]["Blb_Image"] + '"/></td> <td valign="Top"><a class="notA" href="/Movie/1"> <h3 style="margin: 0px;">' + decodeURI(results.rows[i]["Nm_Title"]) + '</h3>' + ' Rating : ' + results.rows[i]["Nb_VoteAverage"] + '/10 <h6 style="margin: 0px;">' + decodeURI(results.rows[i]["Txt_Synopsis"]) + '</h6></a><button onclick="' + (results.rows[i]["Is_Favorite"] ? "UpdateFavorite(" + results.rows[i]["Id_Movie"] + ",0)" : "UpdateFavorite(" + results.rows[i]["Id_Movie"] + ",1)") + '" type="button" style="margin-left: 90%; width: 10%; padding : 0%;background: transparent; border: none !important;"><i class="icon material-icons if-md">' + (results.rows[i]["Is_Favorite"] ? "star" : "star_border") + '</i></button> </td> </tr></a>';
      }
      document.getElementById("favorites").innerHTML = html;
    }, null);
  });
}
function GetNowPlayingMovies() {
  var maRequete = new Request('https://api.themoviedb.org/3/movie/now_playing?language=en-EN&page=1', {
    method: 'GET',
    headers: { "Authorization": "Bearer  eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzY2RjMTk0ODc1YTYxNWQ3OWQ0NDMxMTgyMGRlY2Q2ZSIsInN1YiI6IjVkY2E1ZWQwNmMwZTRmMDAxODNkOTM2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mYxJPYquR3b6LzocmRLmeysJHbFnOyekblVIU21stzQ" }
  });
  return fetch(maRequete).then(function (reponse) {
    return reponse.json();
  }).then(function (reponse) {
    return reponse.results;
  });
}