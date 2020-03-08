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
function CreateMovieGenre() {
  db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS FK_Tbl_MovieGenre(Fk_Id_Movie INTEGER,Fk_Id_Genre INTEGER, PRIMARY KEY (Fk_Id_Movie, Fk_Id_Genre))');
  });
}
function CreateLastUpdate() {
  db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS Tbl_LastUpdate(Id_LastUpdate INTEGER primary key,Nm_Table TEXT,Dttm_LastUpdateAt TEXT)');
  });
}
function InsertMovies(idMovies, title, synopsis, voteAverage, releaseDate, originalLanguage, image, isPlaying, isFavorite) {
  db.transaction(function (tx) {
    tx.executeSql('INSERT INTO Tbl_Movies (Id_Movie, Nm_Title, Txt_Synopsis, Nb_VoteAverage, Dt_ReleaseDate, Txt_OriginalLanguage, Blb_Image, Is_Playing, Is_Favorite) VALUES (' + idMovies + ',"' + title + '", "' + synopsis + '", ' + voteAverage + ', "' + releaseDate + '", "' + originalLanguage + '", "' + image + '", ' + isPlaying + ', ' + isFavorite + ' )');
  });
}
function InsertGenre(idGenre, nameGenre) {
  db.transaction(function (tx) {
    tx.executeSql('INSERT INTO Tbl_Genres (Id_Genre ,nomGenre) VALUES (' + idGenre + ', "' + nameGenre + '")');
  });
}
function InsertMovieGenre(idMovie, idGenre) {
  db.transaction(function (tx) {
    tx.executeSql('INSERT OR REPLACE INTO FK_Tbl_MovieGenre (Fk_Id_Movie ,Fk_Id_Genre) VALUES (' + idMovie + ', "' + idGenre + '")');
  });
}
function InsertOrUpdateLastUpdate(nameTable) {
  db.transaction(function (tx) {
    tx.executeSql('INSERT OR REPLACE INTO Tbl_LastUpdate(Id_LastUpdate,Nm_Table,Dttm_LastUpdateAt) VALUES (1,"' + nameTable + '",' + Date.now() + ')');
  });
}
function UpdateFavorite(idMovies, value) {
  db.transaction(function (tx) {
    tx.executeSql('UPDATE Tbl_Movies SET Is_Favorite=' + value + ' WHERE Id_Movie="' + idMovies + '"');
  });
}
function DeleteNowPlayingMovies() {
  db.transaction(function (tx) {
    tx.executeSql('DELETE FROM Tbl_Movies WHERE IsPlaying = 1');
  });
}
function DeleteGenre() {
  db.transaction(function (tx) {
    tx.executeSql('DELETE FROM Tbl_Genres');
  });
}
