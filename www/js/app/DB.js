/*
Raphael Lopes
RewMov
15.03.2020
*/
//creer la DV
var db = openDatabase('mydb', '1.0', 'DB_Movies', 5 * 1024 * 1024);
//Crée la table movie si elle n'existe pas dans la DB
function CreateMovies() {
  db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS Tbl_Movies(Id_Movie INTEGER primary key,Nm_Title TEXT, Txt_Synopsis TEXT,Id_Genre INTEGER,Nb_VoteAverage INTEGER, Dt_ReleaseDate TEXT,Txt_OriginalLanguage TEXT, Blb_Image BLOB,Is_Playing INTEGER, Is_Favorite INTEGER)');
  });
}
//Crée la table genre si elle n'existe pas dans la DB
function CreateGenre() {
  db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS Tbl_Genres(Id_Genre INTEGER primary key,nomGenre TEXT)');
  });
}
//Crée la table MovieGenre si elle n'existe pas dans la DB
function CreateMovieGenre() {
  db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS FK_Tbl_MovieGenre(Fk_Id_Movie INTEGER,Fk_Id_Genre INTEGER, PRIMARY KEY (Fk_Id_Movie, Fk_Id_Genre))');
  });
}
//Crée la table LastUpdate si elle n'existe pas dans la DB
function CreateLastUpdate() {
  db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS Tbl_LastUpdate(Id_LastUpdate INTEGER primary key,Nm_Table TEXT,Dttm_LastUpdateAt TEXT)');
  });
}
//insere un film dans la DB
function InsertMovies(idMovies, title, synopsis, voteAverage, releaseDate, originalLanguage, image, isPlaying, isFavorite) {
  db.transaction(function (tx) {
    tx.executeSql('INSERT INTO Tbl_Movies (Id_Movie, Nm_Title, Txt_Synopsis, Nb_VoteAverage, Dt_ReleaseDate, Txt_OriginalLanguage, Blb_Image, Is_Playing, Is_Favorite) VALUES (' + idMovies + ',"' + title + '", "' + synopsis + '", ' + voteAverage + ', "' + releaseDate + '", "' + originalLanguage + '", "' + image + '", ' + isPlaying + ', ' + isFavorite + ' )');
  });
}
//insere un genre dans la DB
function InsertGenre(idGenre, nameGenre) {
  db.transaction(function (tx) {
    tx.executeSql('INSERT INTO Tbl_Genres (Id_Genre ,nomGenre) VALUES (' + idGenre + ', "' + nameGenre + '")');
  });
}
//insere un id d'un film avec id d'un genre dans la DB
function InsertMovieGenre(idMovie, idGenre) {
  db.transaction(function (tx) {
    tx.executeSql('INSERT OR REPLACE INTO FK_Tbl_MovieGenre (Fk_Id_Movie ,Fk_Id_Genre) VALUES (' + idMovie + ', "' + idGenre + '")');
  });
}
//insere un timestamp + nom de la table dans la DB
function InsertOrUpdateLastUpdate(nameTable) {
  db.transaction(function (tx) {
    tx.executeSql('INSERT OR REPLACE INTO Tbl_LastUpdate(Id_LastUpdate,Nm_Table,Dttm_LastUpdateAt) VALUES (1,"' + nameTable + '",' + Date.now() + ')');
  });
}
// Update le favoris
function UpdateFavorite(idMovies, value) {
  db.transaction(function (tx) {
    tx.executeSql('UPDATE Tbl_Movies SET Is_Favorite=' + value + ' WHERE Id_Movie="' + idMovies + '"');
  });
}
//supprime les film au cinéma
function DeleteNowPlayingMovies() {
  db.transaction(function (tx) {
    tx.executeSql('DELETE FROM Tbl_Movies WHERE IsPlaying = 1');
  });
}
//supprime les genres
function DeleteGenre() {
  db.transaction(function (tx) {
    tx.executeSql('DELETE FROM Tbl_Genres');
  });
}
