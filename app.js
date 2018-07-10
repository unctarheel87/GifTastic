const topics = ['tennis', 'golf', 'table tennis', 'racquetball', 'badminton'];

$(document).ready(function() {
  
  $('#add-topic').on('click', function(e) {
    $('header').empty();
    e.preventDefault();
    const topic = $("#topic-input").val().trim();
    topics.push(topic);
    generateBtns();
  });
  generateBtns();

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
    }).then(function(response) {
      $('.gifs').empty();
      const data = response.data;
      for(let gif of data) {
        const gifDiv = $('<div>'); 
        const gifImg = $('<img>');
        const gifInfo = $('<div>');
        $('.gifs').append(gifDiv);
        gifDiv.append(gifInfo).append(gifImg).addClass('gif-container');
        gifImg.attr('src', gif.images.fixed_height_still.url);
        gifInfo.html(`<p>Rating: ${gif.rating}</p>`);
      }
    });
}   

function generateBtns() {
  for(let topic of topics) {
    const btn = $('<button>'); 
    $('header').append(btn);
    btn.text(topic).addClass('topic-btn').attr('data-name', topic);
  }
}