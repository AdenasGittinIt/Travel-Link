//on page load populate itinerary with items from local storage.
var itineraryItems = JSON.parse(localStorage.getItem("itineraryItems")) || [];

//function that updates local storage with the new itinerary item
const updateStorage = () => {
  localStorage.setItem("itineraryItems", JSON.stringify(itineraryItems));
  // localStorage.setItem("lastID", lastID);
}

// This is the click event that gets search results from our three APIs
$("#search-button").on('click', function () {
  event.preventDefault();
  var city = $('#city').val().trim().toLowerCase();
  let weatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city},&units=imperial&appid=00604984263164d160d696afed305b97`;
  var startDate = $('#arrival-date').val().trim();

  var endDate = $('#departure-date').val().trim();

    // This is the API call from Open Weather
  $.ajax({
    url: weatherURL,
    method: "GET"
  }).then(function (res) {

    const forecastDays = [];
    const fiveDayDetails = [];

    res.list.filter(function(hourly) {
      let forecastDate = moment(hourly.dt, "X").format("MM/DD/YYYY");
      if (
        forecastDays.includes(forecastDate) ||
        forecastDate === moment().format("MM/DD/YYYY")
      ) {
        return false;
      } else {
        forecastDays.push(moment(hourly.dt, "X").format("MM/DD/YYYY"));
        fiveDayDetails.push({
          date: moment(hourly.dt, "X").format("MM/DD/YYYY"),
          temp: hourly.main.temp,
          humidity: hourly.main.humidity,
          description: hourly.weather[0].description,
          iconUrl: `http://openweathermap.org/img/wn/${hourly.weather[0].icon}@2x.png`
        });
      }
    });
    
    fiveDayDetails.forEach(day => {

      const {date, temp, humidity, description, iconUrl} = day

      $("#five-day").append(`
      <div class="card teal">
        <div class="card-image">
          <img src="${iconUrl}" style="width: 150px;">
        </div>
        <div class="card-content">
          <span class="card-title">${date}, ${description}</span>
          <p>Temp: ${temp};  Humidity: ${humidity} </p>
        </div>
      </div>`)
    });
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
          // var newLink = $("<a>").attr({
          //   href: filteredEvents[i].url,
          //   target: "_blank"});
          // var newImage = $("<img>").attr("src", eventImageUrl);
          // var newDiv = $("<div>").attr("data-box", "box"+(i+5));
          
          // //Here is where we created itinerary button
          // var newButton = $("<button>").text("Add to Itinerary").attr('class','itinerary-btn');
          // var eventTitle = $("<p>").text(event + " " + eventDate).css({display:"block", color: "black"});
          
          // newImage.css("width", "300px")
          
          // newDiv.append(eventTitle, newLink, newButton);
          
          // newLink.append(newImage);
          // $("#box"+(i+5)).replaceWith(newDiv);

          console.log(eventTime); 
          $("#events-col").append(`
          <div class="card teal">
            <div class="card-image">
              <a href=${filteredEvents[i].url} target="_blank">  
                <img src="${eventImageUrl}">
              </a>
            </div>
            <div class="card-content">
              <span class="card-title">${event}</span>
              <p>${eventDate}, ${eventTime}</p>
              <button class="intinerary-btn">Add to Itinerary</button>
            </div>
          </div>
          `)
        }
      },     
    });
});


// Here is where we add food or events to Itinerary and save to local storage
$(".events").on('click', ".itinerary-btn", function (){
  var clicked = $(this);
  console.log(clicked)
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

//Possible future development... create a modal that pops up with a message depending on what the user adds to their list
  //"that looks delicious" for a restaurangt
  //"don't forget to check the weather" if it's an outdoor event
  //"that looks fun" for another event
  //"you have great taste in music" for a concert