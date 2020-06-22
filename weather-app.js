const API_KEY = 'd9aea0850eeef3769c679a50817a311c';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?';

const button1 = document.getElementById('mybutton1');
console.log(button1);

button1.addEventListener('click', fetchCityName);

const button2 = document.getElementById('mybutton2');
button2.addEventListener('click', fetchPosition);


function fetchCityName() {
    const cityName = document.getElementById('inputtext');
    const city = cityName.value;
    console.log(city);
    if (!city) {
        alert("Please enter a city to get the weather details");
    } else {
        let loadingLabel = document.getElementById("hiddentext");
        loadingLabel.hidden = false;
        fetch(`${weatherUrl}q=${city}&appid=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                loadingLabel.hidden = true;
                localStorage.setItem('savedCity', city);
                return organizeData(data);

            }).then(processedObject => renderHtml(processedObject));
    }

}

function fetchLocation(lat, lon) {

    fetch(`${weatherUrl}lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            let loadingLabel = document.getElementById("hiddentext");
            loadingLabel.hidden = true;
            return organizeData(data);
        }).then(processedObject => renderHtml(processedObject));


}

function organizeData(data) {
    let organizedDataObject = {};
    // setting the properties of organizedDataObject based on the fetch response
    let tempInKelvin = data.main.temp;
    let tempInCelcius = tempInKelvin - 273.15;
    organizedDataObject.city = data.name;
    organizedDataObject.coordinates = data.coord;
    organizedDataObject.temperature = Math.round(tempInCelcius);
    organizedDataObject.weathericon = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    organizedDataObject.windspeed = data.wind.speed;
    organizedDataObject.cloudy = data.clouds.all;
    organizedDataObject.sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    organizedDataObject.sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    if (organizedDataObject.cloudy >= 0 && organizedDataObject.cloudy < 10) {
        organizedDataObject.cloudStaus = 'Sunny';
    } else if (organizedDataObject.cloudy >= 10 && organizedDataObject.cloudy < 20) {
        organizedDataObject.cloudStaus = 'Sunny to Mostly Sunny';
    } else if (organizedDataObject.cloudy >= 20 && organizedDataObject.cloudy < 30) {
        organizedDataObject.cloudStaus = 'Mostly Sunny';
    } else if (organizedDataObject.cloudy >= 30 && organizedDataObject.cloudy < 60) {
        organizedDataObject.cloudStaus = 'Partly Sunny';
    } else if (organizedDataObject.cloudy >= 60 && organizedDataObject.cloudy < 80) {
        organizedDataObject.cloudStaus = 'Mostly Cloudy';
    } else {
        organizedDataObject.cloudStaus = 'Cloudy';
    }
    console.log(organizedDataObject);
    return organizedDataObject;
}

function renderHtml(organizedDataObject) {

    const city = document.querySelector('#grid-container .grid-item1 > label');
    city.innerHTML = organizedDataObject.city;
    const temp = document.querySelector('#grid-container .grid-item2 > label');
    temp.innerHTML = `${organizedDataObject.temperature}°C`;
    const image = document.querySelector('#grid-container .grid-item3 > img');
    image.src = organizedDataObject.weathericon;
    const windSpeed = document.querySelector('#grid-container .grid-item4 > label');
    windSpeed.innerHTML = organizedDataObject.windspeed;
    const cloudStaus = document.querySelector('#grid-container .grid-item5 > label');
    cloudStaus.innerHTML = organizedDataObject.cloudStaus;
    const sunrise = document.querySelector('#grid-container .grid-item6 > label');
    sunrise.innerHTML = organizedDataObject.sunrise;
    const sunset = document.querySelector('#grid-container .grid-item7 > label');
    sunset.innerHTML = organizedDataObject.sunset;
    const locationObject = {
        'lat': organizedDataObject.coordinates.lat,
        'lng': organizedDataObject.coordinates.lon
    }
    const map = new google.maps.Map(
        document.getElementById('map'), { zoom: 14, center: locationObject });
    const marker = new google.maps.Marker({ position: locationObject, map: map });

}



function fetchPosition() {
    let hidden = document.getElementById("hiddentext");
    hidden.hidden = false;
    navigator.geolocation.getCurrentPosition(position => {
        fetchLocation(position.coords.latitude, position.coords.longitude);
    })

}




