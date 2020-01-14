import $$ from 'dom7';
import Framework7 from 'framework7/framework7.esm.bundle.js';

// Import F7 Styles
import 'framework7/css/framework7.bundle.css';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';
// Import Cordova APIs
import cordovaApp from './cordova-app.js';
// Import Routes
import routes from './routes.js';

var db = openDatabase('mydb', '1.0', 'DB_Movies', 5 * 1024 * 1024);
function CreateMovies() {
  db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS Tbl_Movies(Id_Movie INTEGER primary key,Nm_Title TEXT, Txt_Synopsis TEXT,Id_Genre INTEGER,Nb_VoteAverage INTEGER, Dt_ReleaseDate TEXT,Txt_OriginalLanguage TEXT, Blb_Image BLOB,Is_Playing INTEGER, Is_Favorite INTEGER)');
  });
}
function CreateGenre() {
  db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS Tbl_Genres(Id_Genre INTEGER primary key,nomGenre TEXT)');
  });
}
function CreateLastUpdate() {
  db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS Tbl_LastUpdate(Id_LastUpdate INTEGER primary key,Nm_Table TEXT,Dttm_LastUpdateAt TEXT)');
  });
}
function InsertMovies(idMovies,title, synopsis, idGenre, voteAverage, releaseDate, originalLanguage, image, isPlaying, isFavorite) {
  db.transaction(function (tx) {
    tx.executeSql('INSERT INTO Tbl_Movies (Id_Movie, Nm_Title, Txt_Synopsis, Id_Genre, Nb_VoteAverage, Dt_ReleaseDate, Txt_OriginalLanguage, Blb_Image, Is_Playing, Is_Favorite) VALUES (' + idMovies + ',"' + title + '", "' + synopsis + '", ' + idGenre + ', ' + voteAverage + ', "' + releaseDate + '", "' + originalLanguage + '", "' + image + '", ' + isPlaying + ', ' + isFavorite + ' )');
  });
}
function InsertGenre(idGenre, nameGenre) {
  db.transaction(function (tx) {
    tx.executeSql('INSERT INTO Tbl_Genres (Id_Genre ,nomGenre) VALUES (' + idGenre + ', "' + nameGenre + '")');
  });
}
function InsertLastUpdate(nameTable) {
  db.transaction(function (tx) {
    tx.executeSql('INSERT INTO Tbl_LastUpdate(Nm_Table) VALUES ("' + nameTable + '")');
  });
}
function UpdateLastUpdate(nameTable) {
  db.transaction(function (tx) {
    tx.executeSql('UPDATE Tbl_LastUpdate SET Dttm_LastUpdateAt=datetime() WHERE Nm_Table="' + nameTable + '"');
  });
}
function UpdateFavorite(idMovies,value) {
  db.transaction(function (tx) {
    tx.executeSql('UPDATE Tbl_Movies SET Is_Favorite='+value+' WHERE Id_Movie="' + idMovies + '"');
  });
}
CreateMovies();
CreateGenre();
CreateLastUpdate();
InsertGenre(1, "test12");
GetHTMLNowPlayingMovies();



function InsertNowPlayingMovies()
{
  GetNowPlayingMovies().then(function (data) {
    data.forEach(el => {
      fetch("https://image.tmdb.org/t/p/w500" + el["poster_path"]).then(function (reponse) {
        
        return reponse.blob();
      }).then(function (reponse) {
        var reader = new FileReader();
        reader.readAsDataURL(reponse);
        reader.onloadend = function () {
          el["poster_path"] = reader.result;
          InsertMovies(el["id"],encodeURI(el["title"]),encodeURI(el["overview"]), 1, el["vote_average"], el["release_date"], el["original_language"], el["poster_path"], 1, 0);
        }});
    });
  });
}
function GetHTMLNowPlayingMovies()
{
  if(false)
  {
    InsertNowPlayingMovies();
  }
  else{
     var html = "";
    db.transaction(function (tx) {
      tx.executeSql('SELECT Id_Movie,Nm_Title,Txt_Synopsis,Nb_VoteAverage,Dt_ReleaseDate,Blb_Image,Is_Favorite FROM Tbl_Movies',[], function (tx, results){
        for(var i = 0; i < results.rows.length; i++)
        {
          html += '<tr> <td style="width: 25%; height: auto;"id="img"><img style="width : 100%" src="' + results.rows[i]["Blb_Image"] + '"/></td> <td valign="Top"><a href="/Movie/1"> <h3 style="margin: 0px;">' + decodeURI(results.rows[i]["Nm_Title"]) + '</h3>'+' Rating : ' + results.rows[i]["Nb_VoteAverage"] + '/10 <h6 style="margin: 0px;">' + decodeURI(results.rows[i]["Txt_Synopsis"]) + '</h6></a><button onclick="' + (results.rows[i]["Is_Favorite"] ? "UpdateFavorite(" + results.rows[i]["Id_Movie"] + ",0)" : "UpdateFavorite(" + results.rows[i]["Id_Movie"] + ",1)") + '" type="button" style="margin-left: 90%; width: 10%; padding : 0%;background: transparent; border: none !important;"><i class="icon material-icons if-md">' + (results.rows[i]["Is_Favorite"] ? "star" : "star_border") + '</i></button> </td> </tr></a>';
        }
        document.getElementById("NowPlaying").innerHTML = html;
        return html
      },null);
    });
  }
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


var app = new Framework7({
  root: '#app', // App root element
  id: 'RewMov.framework7.Raphael', // App bundle ID
  name: 'RewMov', // App name
  theme: 'auto', // Automatic theme detection
  // App root data
  data: function () {
    return {
    };
  },
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  // App routes
  routes: routes,


  // Input settings
  input: {
    scrollIntoViewOnFocus: Framework7.device.cordova && !Framework7.device.electron,
    scrollIntoViewCentered: Framework7.device.cordova && !Framework7.device.electron,
  },
  // Cordova Statusbar settings
  statusbar: {
    iosOverlaysWebView: true,
    androidOverlaysWebView: false,
  },
  on: {
    init: function () {
      var f7 = this;
      if (f7.device.cordova) {
        // Init cordova APIs (see cordova-app.js)
        cordovaApp.init(f7);
      }
    },
  },
});