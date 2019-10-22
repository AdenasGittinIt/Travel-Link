

//Take user imput of date (Confirm that API keys can search by date and the format required)
  //future dev... date range

//onclick function that captures the user input and inserts it into the API request URL
//AJAX function to send the request 
$("#search-button").on('click', function () {
  event.preventDefault();
  var zipCode = $('#zipcode').val().trim();
  var weatherURL = "https://api.openweathermap.org/data/2.5/forecast?zip=" + zipCode + ",us&units=imperial&appid=00604984263164d160d696afed305b97";
  var startDate = $('#arrival-date').val().trim();
  console.log(startDate);
  var endDate = $('#departure-date').val().trim();

  $.ajax({
    url: weatherURL,
    method: "GET"
  }).then(function (response) {
    // console.log(response);    
    var currentTemp = response.list[0].main.temp;
  
    $("#weather").text("Weather: " + currentTemp +"°");

    // if (response.list[0].weather[0].main === "Clouds") {
    //   console.log("Where's the sun?");
    // }
  });

  $.ajax({
    type:"GET",
    url:"https://cors-anywhere.herokuapp.com/https://app.ticketmaster.com/discovery/v2/events.jason?postalCode=" + zipCode + "&radius=30&unit=miles&locale=*&startDateTime=" + startDate + "T00:00:00Z&endDateTime=" + endDate + "T00:00:00Z&includeTBA=yes&includeTBD=yes&sort=date,name,asc&source=%20tmr&source=%20frontgate&source=%20universe&source=ticketmaster&apikey=3lnAM350kKFnvBTJoQKYZc9ksm0IPfOY",

    async:true,
    dataType: "json",
    success: function(response) {
      // console.log(response);
      var eventNames = [];
      var filteredEvents = response._embedded.events.filter(function(event){
        if(eventNames.includes(event.name)) {
          return false 
        } else {
          eventNames.push(event.name);
          return true 
        }
      });
      console.log(filteredEvents);

      for(i = 0; i < 5; i++) {
        var event = filteredEvents[i].name
        var eventDate = filteredEvents[i].dates.start.localDate
        var eventTime = filteredEvents[i].dates.start.localTime
        var foundImage = filteredEvents[i].images.find(function(image) {
          return image.ratio === "3_2";
        });

        var eventImageUrl = foundImage.url;

        var newLink = $("<a>").attr({
          href: filteredEvents[i].url,
          target: "_blank"});

        var newImage = $("<img>").attr("src", eventImageUrl);
        newImage.css("width", "300px")
        var newDiv = $("<div>").attr("id", "results-"+i)

        newDiv.append(event + " " + eventDate +" "+eventTime);
        newDiv.append(newLink);
        newLink.append(newImage);
        $("#events").append(newDiv); 
      }

             },
    error: function(xhr, status, err) {
                // This time, we do not end up here!
             }
  });
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
