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
      if(movie != null) {
      let date = new Date(movie.Dt_ReleaseDate);
      document.getElementById("title").innerHTML = decodeURI(movie.Nm_Title);
      document.getElementById("image").src = movie.Blb_Image;
      document.getElementById("year").innerHTML = date.getFullYear();
      document.getElementById("rating").innerHTML = movie.Nb_VoteAverage + "/10";
      document.getElementById("synopsis").innerHTML = decodeURI(movie.Txt_Synopsis);
      document.getElementById("genres").innerHTML = movie.Id_Genre;
      document.getElementById("release").innerHTML = date.toLocaleString('default', {day : 'numeric',month : 'long',year : "numeric"})
      document.getElementById("original").innerHTML = movie.Txt_OriginalLanguage;
      }
      else{
          //TODO:
      }
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
  if(search.value !=  "" && search.value != null)
  {
    requestString += '&query=' + search.value;
    if(year.value != "None")
  {
    requestString += '&year=' + year.value;
  }
  console.log(requestString);
  let maRequete = new Request(requestString, {
  
    method: 'GET',
    headers: { "Authorization": "Bearer  eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzY2RjMTk0ODc1YTYxNWQ3OWQ0NDMxMTgyMGRlY2Q2ZSIsInN1YiI6IjVkY2E1ZWQwNmMwZTRmMDAxODNkOTM2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mYxJPYquR3b6LzocmRLmeysJHbFnOyekblVIU21stzQ" }
  });
  return fetch(maRequete).then(function (reponse) {
    return reponse.json();
  }).then(function (reponse) {
    console.log(reponse["results"]);
    let html = "";
    if(reponse == null)
    {
      document.getElementById("searched").innerHTML = "<h1> No result found </h1>"
    }
    //FIXME: LAST SETUP
    for (let i = 0; i < reponse["results"].length; i++) {
      html += '<tr> <td style="width: 25%; height: auto;"id="img"><img style="width : 100%" src="' + results.rows[i]["poster_path"] + '"/></td> <td valign="Top"><a class="notA" href="/Movie/' + results.rows[i]["id"] + '"> <h3 style="margin: 0px;">' + results.rows[i]["title"] + '</h3>' + ' Rating : ' + results.rows[i]["vote_average"] + '/10 <h6 style="margin: 0px;">' + results.rows[i]["overview"] + '</h6></a><button class=' + results.rows[i]["id"] + ' onclick="' + (results.rows[i]["Is_Favorite"] ? "AddOrRemoveFavorite(" + results.rows[i]["Id_Movie"] + ",0,this)" : "AddOrRemoveFavorite(" + results.rows[i]["Id_Movie"] + ",1,this)") + '" type="button" style="margin-left: 90%; width: 10%; padding : 0%;background: transparent; border: none !important;"><i class="icon material-icons if-md">' + (results.rows[i]["Is_Favorite"] ? "star" : "star_border") + '</i></button></a> </td> </tr>';
    }
    document.getElementById("searched").innerHTML = html
  });
  }
  else
  {
    search.placeholder = "Please enter a title";
  }
  
}
function SetDropDown()
{
  today = new Date();
  let html = '<option value="None" selected>None</option>';
  for(let i = today.getFullYear(); i > today.getFullYear() - 100; i--)
  {
    html +=  '<option value="' + i + '">' + i + '</option>';
  }
  document.getElementById("yearSearch").innerHTML = html;
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