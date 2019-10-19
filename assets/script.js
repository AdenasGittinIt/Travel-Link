
//Take user imput of date (Confirm that API keys can search by date and the format required)
  //future dev... date range

//onclick function that captures the user input and inserts it into the API request URL

//AJAX function to send the request 
$("#search-button").on("click", function() {
  event.preventDefault();

  var searchTerm = $("#search-term").val().trim();
  var startYear = $("#start-year").val().trim();
  var endYear = $("#end-year").val().trim();

  var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q={city name},{country code}" + searchTerm + "&api-key=3YShtKHlvcwNQDMRaoLiiGvLEBYmdOqL";
  
  $.ajax({
    url: queryURL,
    method: "GET"

  }).then(function(response) {
    console.log(response.response.docs[0].web_url);
    var link = response.response.docs[0].web_url;
    var newDiv = $("<a>").attr("href", link).text(link);

     $("#results").append(newDiv); 
      

    // Append the td elements to the new table row
    // Append the table row to the tbody element
  });








//Get the results back from the API

//dynamically updating the DOM with the search results
  //each result should have a check box next to it

//On click function that takes the checked event or restaurant and updates the intinerary with the event or restuarant

//Extra Credit... create a modal that pops up with a message depending on what the user adds to their list
  //"that looks delicious" for a restaurangt
  //"don't forget to check the weather" if it's an outdoor event
  //"that looks fun" for another envet
  //"you have great taste in music" for a musical event


