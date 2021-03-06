
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

      //Creating a Meterialize card with forecast details
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
      url:`https://cors-anywhere.herokuapp.com/https://app.ticketmaster.com/discovery/v2/events.jason?city=${city}&radius=30&unit=miles&locale=*&startDateTime=${startDate}T23:59:59Z&endDateTime=${endDate}T23:59:59Z&includeTBA=yes&includeTBD=yes&sort=date,name,asc&source=%20tmr&source=%20frontgate&source=%20universe&source=ticketmaster&apikey=3lnAM350kKFnvBTJoQKYZc9ksm0IPfOY`,    
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

        // Looping through filteredEvents to get start date, time, event name and image.  Returning at max, 5 results.

        for(i = 0; i < 5; i++) {
          var event = filteredEvents[i].name
          var eventDate = filteredEvents[i].dates.start.localDate;
          var eventTime = filteredEvents[i].dates.start.localTime;
          let formattedTime = moment(`${eventDate} [at] ${eventTime}`).format('MMMM Do YYYY, h:mm a');
          var foundImage = filteredEvents[i].images.find(function(image) {
            return image.ratio === "3_2";
          });
          var eventImageUrl = foundImage.url;

          // Creating a Materialize card with select details from search results for each filtered event and adding them to the page

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
              <p>${formattedTime}</p>
              <button class="intinBtn btn-small" id="data-${i}">Add to Itinerary</button>
            </div>
          </div>
          `)
        }
      },     
    });
});


// Here is where we add events to Itinerary that will eventually be extended to also save to local storage
$("#events-col").on("click", ".intinBtn", function() {
  let clicked = $(this);
  console.log(clicked)
  let sibling = clicked.siblings();
  let itinEventTime = `${sibling[1].innerText}`;
  let itinEventTitle = `${sibling[0].innerText}`

  //Creating a Meterialize card with the events title, date and time.
  $("#itin-col").append(`
  <div class="card teal">
    <div class="card-content white-text">
      <span class="card-title">${itinEventTitle}</span>
      <p>${itinEventTime}</p>
      <button class="removeBtn btn-small" data-id=${clicked[0].id}>Remove</button>
    </div>
  <div>
  `)
})

//This is the click listener to remove an item from the itenerary and will eventually be extended to remove from local storage
$("#itin-col").on("click", ".removeBtn", function() {
  let itinClicked = $(this);
  console.log(itinClicked);
  itinClicked[0].offsetParent.remove();
})

// The click listener for "Clear Results" button that resets the page
$("#clear-button").on("click", function(){
  location.reload();
})

//For possible future development... create a modal that pops up with a message depending on what the user adds to their list
  //"that looks delicious" for a restaurangt
  //"don't forget to check the weather" if it's an outdoor event
  //"that looks fun" for another event
  //"you have great taste in music" for a concert