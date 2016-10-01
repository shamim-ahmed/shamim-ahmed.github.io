
$(document).ready(function() {
  $('#form-container').submit(loadData);
});

function loadData() {
  var greeting = $('#greeting');

  // clear out old data before new request
  clearData();

  // load streetview
  var street = $("#street").val();
  var city = $("#city").val();

  if (isBlank(street) || isBlank(city)) {
    // TODO implement better error message display
    alert('Please specify the address correctly');
    return false;
  }

  var addr = street + ',' + city;
  var imageUrl = 'http://maps.googleapis.com/maps/api/streetview';
  imageUrl += '?' + $.param({'size': '600x300'});
  imageUrl += '&' + $.param({'location': addr});
  $('body').append('<img src="' + imageUrl + '" alt="location image">');

  // load the new york times articles
  var nytUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
  var nytApiKey = 'f02b97068e3b4ca8b370cb40830b2dd6';
  nytUrl += '?' + $.param({'api-key': nytApiKey});
  nytUrl += '&' + $.param({'q': city});

  $.getJSON(nytUrl, renderDataFromNYT).fail(renderErrorMessageForNYT);

  // load wikipedia articles
  var wikipediaUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json';
  wikipediaUrl += '&' + $.param({'titles': city});
  $.ajax(wikipediaUrl, {
    dataType: 'application/json',
    callback: renderDataFromWikipedia,
    headers: {'Origin': document.location.href},
    error: renderErrorMessageForWikipedia
  });

  return false;
};

function clearData() {
  $('#wikipedia-links').text("");
  $('#nytimes-articles').text("");
}

function renderDataFromNYT(data) {
  var i;
  var docs = data.response.docs;
  var resultHtml = '';

  if (docs) {
    for (i = 0; i < docs.length; i++) {
      var newsItem = docs[i];
      resultHtml += '<li class="article">';
      resultHtml += '<a href="' + newsItem.web_url + '">' + newsItem.headline.main + '</a>';

      if (newsItem.lead_paragraph) {
        resultHtml += '<p>' + newsItem.lead_paragraph + '</p>';
      }

      resultHtml += '</li>';
    }
  }

  $('#nytimes-articles').append(resultHtml);
}

function renderErrorMessageForNYT() {
  $('#nytimes-header').text('New York Times articles could not be loaded');
}

function renderDataFromWikipedia(data) {
  console.log(data);
}

function renderErrorMessageForWikipedia() {

}

function isBlank(str) {
  return str === null || str.trim() === '';
}
