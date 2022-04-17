var searchBtn = document.getElementById("searchBtn");
var cityEl = document.getElementById("city")
var fiveDayForecast = document.getElementById("fiveday")
var uvEl = document.getElementById("UV")
var uvValue = document.getElementById("UVvalue")
var windEl = document.getElementById("wind")
var humidityEl = document.getElementById("humidity")
var tempEl = document.getElementById("temp")
var searchHistoryEl = document.getElementById("searchhistory")
var fiveDayHeader = document.getElementById("fiveDayTitle")

function handleSearchFormSubmit(event) {
    event.preventDefault();

searchInputVal = document.querySelector("#searchCity").value;
if (historyArr.indexOf(searchInputVal) === -1) {
    historyArr.push(searchInputVal);
    localStorage.setItem("history", JSON.stringify(historyArr));
    displayHistory(searchInputVal);
}
if (!searchInputVal) {
    console.error("You Must Enter a City!");
    return;
}
getApi(searchInputVal);
}
function getApi(city) {
var forecastApi = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=775e103db5d395971a8a5055dde627a8&units=imperial";
var weatherApi = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=775e103db5d395971a8a5055dde627a8&units=imperial";
cityEl.innerHTML = "";
windEl.innerHTML = "";
humidityEl.innerHTML = "";
uvEl.innerHTML = "";
uvValue.innerHTML = "";
fiveDayForecast.innerHTML = "";

fetch(forecastApi)
.then(function (response) {
    if (!response.ok) {
        throw response.json();
    }
    return response.json();
})
.then(function(data) {
fiveDayData = data;
for (i=4; i < fiveDayData.list.length; i+=8) {
    var card = document.createElement("div");
    card.classList.add("col", "five", "text-white", "bg-primary", "ml-3", "mb-3", "rounded")
    fiveDayHeader.textContent = "5 Day Forecast:"
    var date = document.createElement("h2")
    var fiveDates = data.list[i].dt_txt;
    date.textContent = new Date(fiveDates).toLocaleDateString();
    var temp = document.createElement("p")
    var fiveDateTemp = data.list[i].main.temp;
    temp.textContent = "Temp: " + fiveDateTemp;
    var humid = document.createElement("p")
    var fiveDateHumidity = data.list[i].main.humidity
    humid.textContent = "humidity: " + fiveDateHumidity + "%";
    var icon = document.createElement("img");
    icon.setAttribute("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png")
    card.append(date, icon, temp, humid)
    fiveDayForecast.appendChild(card);
}
})
fetch(weatherApi)
    .then(function (response) {
        if (!response.ok) {
            throw response.json();
        }
        return response.json();
    })
    .then(function(data) {
        currentData = data;
        displayCityInfo(currentData)
    })
}
function displayCityInfo(currentData){
    var Lat = currentData.coord.lat;
    var Lon = currentData.coord.lon;
    getUV(Lat, Lon);
    var displayCityInfo = document.createElement("h2");
    cityEl.append(displayCityInfo);
    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", "http://openweathermap.org/img/w/" + currentData.weather[0].icon + ".png")
    var todaysDate = new Date(moment().format()).toLocaleDateString();
    displayCityInfo.append(document.createTextNode(currentData.name + " "));
    displayCityInfo.append(document.createTextNode(" (" + todaysDate + ")"));
    displayCityInfo.append(weatherIcon);
    tempEl.append(document.createTextNode("Temperature: " + currentData.main.temp));
    humidityEl.append(document.createTextNode("Humidity: " + currentData.main.humidity + "%"));
    windEl.append(document.createTextNode("Wind Speed: " + currentData.wind.speed + "Mph"));
    uvEl.append(document.createTextNode("UV Index: "));
}
function getUV(latitude, longitude) {
    var uvApi = "http://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=775e103db5d395971a8a5055dde627a8";
    fetch(uvApi)
    .then(function(response) {
        if (!response.ok) {
            throw response.json();
        }
        return response.json();
    })
    .then(function(data) {
        uvData = data.value;
        uvStyle(uvData);
    })
}
function uvStyle(uvData) {
    uvValue.append(document.createTextNode(uvData))
    if (uvData >= 3 && uvData <6){
        uvValue.style.backgroundColor = "yellow";
    }
    else if (uvData >= 6 && uvData <8) {
        uvValue.style.backgroundColor = "orange";
    }
    else {
        uvValue.style.backgroundColor = "violet";
    }
}
 function displayHistory(city) {
     var cityName = document.createElement("li");
     cityName.textContent = city.toUpperCase();
     cityName.onclick = function (){
         getApi(this.textContent)
     }
     searchHistoryEl.appendChild(cityName)
 }
 searchBtn.addEventListener("click", handleSearchFormSubmit);
 var historyArr = JSON.parse(localStorage.getItem("history")) || [];
 if(historyArr.length) {
     for (let i = 0; i < historyArr.length; i++) {
         displayHistory(historyArr[i])
     }
 };