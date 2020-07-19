//on page load populate itinerary with items from local storage.
var itineraryItems = JSON.parse(localStorage.getItem("itineraryItems")) || [];

//function that updates local storage with the new itinerary item
const updateStorage = () => {
  localStorage.setItem("itineraryItems", JSON.stringify(itineraryItems));
  // localStorage.setItem("lastID", lastID);
}


function showCards() {
  var x = document.getElementsByClassName("card");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}


// This is the click event that gets search results from our three APIs
$("#search-button").on('click', function () {
  event.preventDefault();
  var city = $('#city').val().trim().toLowerCase();
  let weatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city},&units=imperial&appid=00604984263164d160d696afed305b97`;
  var startDate = $('#arrival-date').val().trim();
  console.log(startDate);
  var endDate = $('#departure-date').val().trim();

    // This is the API call from Open Weather
  $.ajax({
    url: weatherURL,
    method: "GET"
  }).then(function (response) {
  
    var currentTemp = response.list[0].main.temp;
    var currentConditions = response.list[0].weather[0].main;

    // The current temperature is added to the page
    $("#temp").html("Current Temperature: " + currentTemp +"°");
    $("#conditions").html("Current Conditions: " + currentConditions);
    console.log(response);
  });

    //This is the API call from TicketMaster
  $.ajax({
    type:"GET",
    url:"https://cors-anywhere.herokuapp.com/https://app.ticketmaster.com/discovery/v2/events.jason?city=" + city + "&radius=30&unit=miles&locale=*&startDateTime=" + startDate + "T23:59:59Z&endDateTime=" + endDate + "T23:59:59Z&includeTBA=yes&includeTBD=yes&sort=date,name,asc&source=%20tmr&source=%20frontgate&source=%20universe&source=ticketmaster&apikey=3lnAM350kKFnvBTJoQKYZc9ksm0IPfOY",

    async:true,
    dataType: "json",
    success: function(response) {
      // Filtering the envents by event name so that if the API returns an event with the same name, it get's excluded from the eventNames array
      var eventNames = [];
      var filteredEvents = response._embedded.events.filter(function(event){
        if(eventNames.includes(event.name)) {
          return false 
        } else {
          eventNames.push(event.name);
          return true 
        }
      });
      // console.log(filteredEvents);
        // Looping through the filteredEvents to get start date, time, event name and image.  Returning at max, 5 results.
      for(i = 0; i < 5; i++) {
        var event = filteredEvents[i].name
        var eventDate = filteredEvents[i].dates.start.localDate
        var eventTime = filteredEvents[i].dates.start.localTime
        var foundImage = filteredEvents[i].images.find(function(image) {
          return image.ratio === "3_2";
        });
        // Creating new HTML elements with my search results and adding them to the page
        var eventImageUrl = foundImage.url;
        var newLink = $("<a>").attr({
          href: filteredEvents[i].url,
          target: "_blank"});
        var newImage = $("<img>").attr("src", eventImageUrl);
        var newDiv = $("<div>").attr("data-box", "box"+(i+5));
        
        //Here is where we created itinerary button
        var newButton = $("<button>").text("Add to Itinerary").attr('class','itinerary-btn');
        var eventTitle = $("<p>").text(event + " " + eventDate).css({display:"block", color: "black"});
        
        newImage.css("width", "300px")
        
        newDiv.append(eventTitle, newLink, newButton);
        
        newLink.append(newImage);
        $("#box"+(i+5)).replaceWith(newDiv);
      }
    },     
  });

  $.ajax({
    method:"GET",
    crossDomain: true,
    url: "https://developers.zomato.com/api/v2.1/search?entity_id=" + city + "&entity_type=city",
    dataType : "json",
    async: true,
    headers: {
      "user-key": "f9a5acdea9259dd8ef4a0a2a9868c19a"
    },
    success: function(response) {
      var restaurantArr = response.restaurants;

       for(var i = 0; i < 5; i++) {
          var newDiv = $("<div>").attr("id", "results"+i);
          var imgDiv = $("<img>").attr("src", restaurantArr[i].restaurant.thumb);
          var menuLink = $("<a>").attr({
            href: restaurantArr[i].restaurant.menu_url,
            target: "_blank"});
          var newButton = $("<button>").text("Add to Itinerary").attr('class','itinerary-btn');
          var restName = $("<p>").text(restaurantArr[i].restaurant.name).css({display:"block", color: "black"});
          imgDiv.css({width: "300px", height:"200px"})
          newDiv.append(restName, menuLink, imgDiv, newButton);
          menuLink.append(imgDiv);
          $("#box" + (i)).replaceWith(newDiv);
        }
    },
  })
  showCards(); 
});

// Here is where we add food or events to Itinerary and save to local storage
$(".events").on('click', ".itinerary-btn", function (){
  var clicked = $(this);
  let siblings = clicked.siblings();
  var eventText = siblings[0].textContent;
  var eventItin = $("<p></p>").text(eventText).css({display:"block", color: "white"});
  $("#itin-box").append(eventItin);
});

$(".food").on('click', ".itinerary-btn", function (){
  var clicked = $(this);
  console.log(clicked);
  let siblings = clicked.siblings();
  console.log(siblings[0]);
  var foodText = siblings[0].textContent;
  console.log(foodText);
  var foodItin = $("<p></p>").text(foodText).css({display:"block", color: "white"});
  $("#itin-box").append(foodItin);
});

// The click function for our clear button that resets the page
$("#clear-button").on("click", function(){
  location.reload();
})

//Extra Credit... create a modal that pops up with a message depending on what the user adds to their list
  //"that looks delicious" for a restaurangt
  //"don't forget to check the weather" if it's an outdoor event
  //"that looks fun" for another event
  //"you have great taste in music" for a concert