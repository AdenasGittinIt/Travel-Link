

//Take user imput of date (Confirm that API keys can search by date and the format required)
  //future dev... date range

//onclick function that captures the user input and inserts it into the API request URL
//AJAX function to send the request 
$("#search-button").on('click', function () {
  event.preventDefault();
  var zipCode = $('#zipcode').val().trim();
  var weatherURL = "https://api.openweathermap.org/data/2.5/forecast?zip=" + zipCode + ",us&units=imperial&appid=00604984263164d160d696afed305b97";

// Here we run our AJAX call to the OpenWeatherMap API
$.ajax({
    url: weatherURL,
    method: "GET"
}).then(function (response) {
    // We store all of the retrieved data inside of an object called "response"
        let currentTemp = response.list[0].main.temp;
        console.log(response);
        $("#weather").text("Weather: " + currentTemp);

        if (response.list[0].weather[0].main === "Clouds") {
          console.log("Where's the sun?");
        }

   
        // City
        // Temp on desired day of travel
    //     console.log("Wind Speed: " + response.wind.speed);
    //     console.log("Humidity: " + response.main.humidity);
    //     console.log("Temperature (F): " + response.main.temp);
    });

  // $.ajax({
  //   url: queryURL1,
  //   method: "GET"
  // }).then(function (response) {
  //   console.log("forecast URL: " + queryURL1);
  //   console.log("response 2: " + response);
  //   console.log("temperature: " + response.list[0].main.temp);
  // });
});








//Get the results back from the API

//dynamically updating the DOM with the search results
  //each result should have a check box next to it

//On click function that takes the checked event or restaurant and updates the intinerary with the event or restuarant

//Extra Credit... create a modal that pops up with a message depending on what the user adds to their list
  //"that looks delicious" for a restaurangt
  //"don't forget to check the weather" if it's an outdoor event
  //"that looks fun" for another envet
  //"you have great taste in music" for a 
