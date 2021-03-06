$(document).ready(function() {
  gif_topics.generateBtns();
  gif_topics.handleAddBtn();
  gif_topics.addFavorite();
  gif_topics.displayFavorites();
  gif_topics.handleAnimateGif();
  gif_topics.handleAnimateFavorites();
  gif_topics.handleRemoveFavorite();
  $(document).on('click', '.topic-btn', displayGifInfo);
});  

const displayGifInfo = (() => {
  let numberOf = 0;
  return function() {
    //add gifs logic
    if($(this).data('hasClicked')) {
      numberOf += 10;
    } else {
      numberOf = 10;
      $(this).data('hasClicked', true);
    }
    //api url
    const api_key = 'f1HGhTafamHISQgK6Wzp4pyRdZDNQfIT';
    const search = $(this).attr('data-name');
    const queryURL = 'https://api.giphy.com/v1/gifs/search' + 
                  '?q=' + search + 
                  '&limit=' + numberOf + 
                  '&api_key=' + api_key
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then((response) => {
        $('.gifs').empty();
        const data = response.data;
        for(let gif of data) {
          const gifDiv = $('<div>'); 
          const gifImg = $('<img>');
          const gifInfo = $('<div>');
          const gifStar = $('<div>');
          $('.gifs').append(gifDiv);
          gifDiv.append(gifInfo).append(gifImg).prepend(gifStar).addClass('gif-container')
                .data({
                      id: gif.id, 
                      still: gif.images.fixed_height_still.url,
                      animate: gif.images.fixed_height.url,
                      state: 'still',
                      isFavorite: false
                      });
          gifImg.attr('src', gif.images.fixed_height_still.url);
          gifInfo.html(`<p>Views: ${Math.round(gif._score)}</p><p><span class=${ gif.rating == 'g' || gif.rating == 'pg' ? 'green' : 'orange'}>${gif.rating}</span></p>`);
          gifStar.html('<i class="far fa-star fa-2x"></i>').addClass('favorites-star');
        }
      });
  }  
})();   

const gif_topics = (() => {
  const topics = ['tennis', 'golf', 'table tennis', 'racquetball', 'badminton'];
  let favorites = [ ];
  if(JSON.parse(localStorage.getItem('favorites'))) {
    favorites = JSON.parse(localStorage.getItem('favorites'));
  } 
  return {
    generateBtns: () => {
      for(let topic of topics) {
        const btn = $('<button>'); 
        $('.buttons').append(btn);
        btn.text(topic).addClass('btn btn-success topic-btn').attr('data-name', topic).data('hasClicked', false);
      }
    },
    handleAddBtn: () => {
      $('#add-topic').on('click', function(e) {
        $('.buttons').empty();
        e.preventDefault();
        const topic = $("#topic-input").val().trim();
        topics.push(topic);
        gif_topics.generateBtns();
      });
    },
    addFavorite: () => {
      $(document).on('click', '.favorites-star', function() {
        //set isFavorite Boolean
        if($(this).parent().data('isFavorite')) {
          $(this).parent().data('isFavorite', false);
        } else {
          $(this).parent().data('isFavorite', true);
        }
        //logic based on isFavorite truthy
        if($(this).parent().data('isFavorite')) {
          $(this).html('<i class="fas fa-star fa-2x"></i>');
          favorites.push({
                          id: $(this).parent().data('id'), 
                          still: $(this).parent().data('still'),
                          animate: $(this).parent().data('animate'),
                          state: $(this).parent().data('state'),
                        })
        localStorage.setItem('favorites', JSON.stringify(favorites));                 
        } else {
          $(this).html('<i class="far fa-star fa-2x"></i>');
          favorites = favorites.filter((favorite) => {
            return favorite.id !== $(this).parent().data('id')
          });
          localStorage.setItem('favorites', JSON.stringify(favorites));  
        }
        gif_topics.displayFavorites();
      });
    },
    displayFavorites: () => {
      $('#favorites-section').empty();
      for(let favorite of favorites) {
        const gifDiv = $('<div>');
        const gifImg = $('<img>');
        const remove = $('<span>');
        $('#favorites-section').append(gifDiv);
        gifDiv.append(remove).addClass('favorite-container').append(gifImg).data({
                                    id: favorite.id,
                                    still: favorite.still, 
                                    animate: favorite.animate, 
                                    state: favorite.state 
                                  });
        gifImg.attr('src', favorite.still);
        remove.text('X').addClass('remove')
      }
    },
    handleAnimateGif: () => {
      $(document).on("click", ".gif-container img", function() {
        const state = $(this).parent().data('state'); 
        const still = $(this).parent().data('still');
        const animate = $(this).parent().data('animate');
        if(state === 'still') {
          $(this).attr('src', animate)
          $(this).parent().data('state', 'animate')
        } else {
          $(this).attr('src', still)
          $(this).parent().data('state', 'still')
        }
      });
    },
    handleAnimateFavorites: () => {
      $(document).on("click", "#favorites-section img", function() {
        if($(this).parent().data('state') === 'still') {
          $(this).attr('src', $(this).parent().data('animate'))
          $(this).parent().data('state', 'animate')
        } else {
          $(this).attr('src', $(this).parent().data('still'))
          $(this).parent().data('state', 'still')
        }
      });  
    },
    handleRemoveFavorite: () => {
      $(document).on("click", ".remove", function() {
        const id = $(this).parent().data('id');
        favorites = favorites.filter((favorite) => {
          return favorite.id !== id
        });
        localStorage.removeItem('favorites');
        localStorage.setItem('favorites', JSON.stringify(favorites));
        $('.gif-container').each(function() {
          if($(this).data('id') === id) {
            $(this).data('isFavorite', false);
            $('.favorites-star', this).html('<i class="far fa-star fa-2x"></i>');
          }
        });
        gif_topics.displayFavorites();
      });
    }
  }
})();