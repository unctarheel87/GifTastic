$(document).ready(function() {
  gif_topics.generateBtns();
  gif_topics.handleAddBtn();
  gif_topics.addFavorite();
  $(document).on('click', '.topic-btn', displayGifInfo);
});  

function displayGifInfo() {
  //api url
  const api_key = 'f1HGhTafamHISQgK6Wzp4pyRdZDNQfIT';
  const search = $(this).attr('data-name');
  const queryURL = 'http://api.giphy.com/v1/gifs/' + 
                'search?q=' + search + 
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
        gifDiv.append(gifInfo).append(gifImg).append(gifStar).addClass('gif-container')
              .data({
                    id: gif.id, 
                    url: gif.images.fixed_height_still.url,
                    isFavorite: false
                    });
        gifImg.attr('src', gif.images.fixed_height_still.url);
        gifInfo.html(`<p>Rating: ${gif.rating}</p>`);
        gifStar.html('<i class="far fa-star fa-5x"></i>').addClass('favorites-star');
      }
    });
}   

const gif_topics = (() => {
  const topics = ['tennis', 'golf', 'table tennis', 'racquetball', 'badminton'];
  let favorites = [ ];
  return {
    generateBtns: () => {
      for(let topic of topics) {
        const btn = $('<button>'); 
        $('header').append(btn);
        btn.text(topic).addClass('topic-btn').attr('data-name', topic);
      }
    },
    handleAddBtn: () => {
      $('#add-topic').on('click', function(e) {
        $('header').empty();
        e.preventDefault();
        const topic = $("#topic-input").val().trim();
        topics.push(topic);
        gif_topics.generateBtns();
      });
    },
    addFavorite: () => {
      $(document).on('click', '.gif-container', function() {
        $('#favorites-section').empty();
        //set isFavorite Boolean
        if($(this).data('isFavorite')) {
          $(this).data('isFavorite', false);
        } else {
          $(this).data('isFavorite', true);
        }
        //logic based on isFavorite truthy
        if($(this).data('isFavorite')) {
          $('.favorites-star', this).html('<i class="fas fa-star fa-5x"></i>');
          favorites.push({id: $(this).data('id'), url: $(this).data('url')}) 
        } else {
          $('.favorites-star', this).html('<i class="far fa-star fa-5x"></i>');
          favorites = favorites.filter((favorite, index) => {
            return favorite.id !== $(this).data('id')
          });
          console.log(favorites);
        }  
        for(let favorite of favorites) {
          const gifImg = $('<img>');
          $('#favorites-section').append(gifImg);
          gifImg.attr('src', favorite.url)
        }
      });
    }
  }
})();