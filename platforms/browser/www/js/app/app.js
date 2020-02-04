var app = new Framework7({
  
  Movies: [],
  // App root element
  root: '#app',
  // App Name
  name: 'My App',
  // App id
  id: 'com.myapp.test',
  // Enable swipe panel
  panel: {
    swipe: 'left',
  },
  // Add default routes
  // see https://blog.framework7.io/mastering-v2-router-958ea2dbd24f
  routes: [
    {
      path: '/',
      url: 'index.html',
      on:{
        pageAfterIn: function (event, page) {
          GetHTMLNowPlayingMovies();
        },
      }
    },
    { path: '/movie/:id',
      url: 'detailled.html',
      on:{
        pageInit: function (event, page) {
          GetHTMLDetailled(page.route.params.id);
        },
      }
    },
    { path: '/favorites/',
      url: 'favorite.html',
      on:{
        pageAfterIn: function (event, page) {
          GetHTMLFavorites();
        },
      }
    },
    { path: '/search/',
      url: 'search.html',
    },
    { path: '/discover/',
      url: 'discover.html',
    },
  ],
});

var mainView = app.views.create('#home',{stackPages : false});