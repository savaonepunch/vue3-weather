Deployment URL: https://vue-3-weather.netlify.app

## How to run:

1. `npm i` to install dependencies.
2. `npm run dev` to start the live development server.

## Features: 

Required:
- Ability to search for a city, calls the OpenWeather API with Axios.
- Find the user's location via the Geolocation API.
- The ability to save locations, they are saved in a Pinia store and they persist in the website's cookies using "pinia-plugin-persistedstate".

Extra:
- Loading animations.
- Animated SVG icons.
- Draggable forecast carrousel slider.
- Ability to remove saved locations.
- Search auto-focuses on page load.
- Button to clear the search input quickly.

## Challenges I faced and how I fixed them:

- The free api plan didnt have access to the previous weather for the day so instead I changed the section to "Forecast" which shows the weather every 3 hours for 24 hours.

- API was not returning the desired format so I had to use some methods from the JS "Math" object to round decimal numbers.

- I had to create a function that checks if a location has already been saved in the store so that we couldn't create duplicates.

- Created a fallback for devices that don't support mouse hover to remove locations.
