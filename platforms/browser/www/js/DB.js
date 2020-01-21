var db = openDatabase('mydb', '1.0', 'DB_Movies', 5 * 1024 * 1024);
function CreateMovies()
{
  db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS Tbl_Movies(Id_Movie INTEGER primary key,Nm_Title TEXT, Dt_Year TEXT,Txt_Synopsis TEXT,Id_Genre INTEGER,Nb_VoteAverage INTEGER, Dt_ReleaseDate TEXT,Txt_OriginalLanguage TEXT, Blb_Image BLOB,Is_Playing INTEGER, Is_Favorite INTEGER)');
  });
}
function CreateGenre()
{
  db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS Tbl_Genres(Id_Genre INTEGER primary key,nomGenre TEXT)');
  });
}
function CreateLastUpdate()
{
  db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS Tbl_LastUpdate(Id_LastUpdate INTEGER primary key,Nm_Table TEXT,Dttm_LastUpdateAt TEXT)');
  });
}
function InsertMovies(title,year,synopsis,idGenre,voteAverage,releaseDate,originalLanguage,/*image,*/isPlaying,isFavorite)
{
  db.transaction(function (tx) {
    tx.executeSql('INSERT INTO Tbl_Movies (Nm_Title, Dt_Year, Txt_Synopsis, Id_Genre, Nb_VoteAverage, Dt_ReleaseDate, Txt_OriginalLanguage, ' /*+ Blb_Image,*/ + 'Is_Playing, Is_Favorite) VALUES ("' + title +'", "' + year +'", "' + synopsis +'", ' + idGenre +', ' + voteAverage +', "' + releaseDate +'", "' + originalLanguage +'", '/* + image +', '*/ + isPlaying +', ' + isFavorite +' )');
  });
}
function InsertGenre(idGenre,nameGenre)
{
  db.transaction(function (tx) {
    tx.executeSql('INSERT INTO Tbl_Genres (Id_Genre ,nomGenre) VALUES (' + idGenre +', "' + nameGenre + '")');
  });
}
function InsertLastUpdate(nameTable)
{
  db.transaction(function (tx) {
    tx.executeSql('INSERT INTO Tbl_LastUpdate(Nm_Table) VALUES ("' + nameTable + '")');
  });
}
function UpdateLastUpdate(nameTable)
{
  db.transaction(function (tx) {
    tx.executeSql('UPDATE Tbl_LastUpdate SET Dttm_LastUpdateAt=datetime() WHERE Nm_Table="' + nameTable + '"');
  });
}
CreateMovies();
CreateGenre();
CreateLastUpdate();
//InsertGenre(1,"test12");
//InsertMovies("testTitreS","2001","ceci est l'histoire de",1,5,"2015-10-10","French",1,0,1)
//InsertLastUpdate("test");
//UpdateLastUpdate("test");  