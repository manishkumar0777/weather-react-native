import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

//axios to fetch api
import axios from 'axios'

//apikey
import { apiKey } from '../constants'

//Endpoints
const forecastEndpoint = params => `https://api.weatherapi.com/v1/forecast.json?key=0bddc3004db8434585f53321240709&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`;
const locationEndpoint = params => `https://api.weatherapi.com/v1/search.json?key=0bddc3004db8434585f53321240709&q=${params.cityName}`;

//calling api with try catch 
const apiCall = async(endpoint) => {
    const options = {
        method : 'GET',
        url : endpoint,
    }

    try {
      const response = await axios.request(options);
      return response.data;
    } catch (err) {
      console.log("error ", err);
      return;
    }
}

//calling api passing endpoints
export const fetchWeatherForecast = params => {
  return apiCall(forecastEndpoint(params));
}

//for locations
export const fetchLocations = params => {
  return apiCall(locationEndpoint(params));
}

