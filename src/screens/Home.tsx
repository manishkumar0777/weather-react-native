import { StatusBar, StyleSheet, Text, View, Image, TextInput, Touchable, TouchableOpacity, ScrollView, KeyboardAvoidingView, Keyboard, ProgressBarAndroidBase } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

//for icons
import { CalendarDaysIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { MapPinIcon } from 'react-native-heroicons/solid'

import { debounce, times } from 'lodash';

//weather api
import { fetchLocations, fetchWeatherForecast } from '../api/weather'

//progress
import * as Progress from 'react-native-progress'

//keyboard
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'






const Home = () => {


  //Weather Data state
  const [weather, setWeather] = useState({})

  //state for search bar 
  const [showSearchBar, toggelSearchBar] = useState(false);

  //location state 
  const [locations, setLocations] = useState([]);

  //loading
  const [loading, setLoading] = useState(true);


  //location handling on search with fetching weather api
  const handleLocations = (loc: any) => {
    console.log("location", loc);
    setLocations([]);
    toggelSearchBar(false);
    fetchWeatherForecast({
      cityName: loc.name,
      days: '7'
    }).then(data => {
      console.log("got Data :", data)
      setWeather(data);
    })
  };

  //seacrh handling and fetching location data from api 
  const handleSearch = (value: any) => {
    console.log("Value : ", value);
    if (value.length > 0) {
      fetchLocations({ cityName: value }).then(data => {
        console.log("data :", data);
        setLocations(data);
      })
    }
  }

  //creating hooks so that appp not reload always 

  useEffect(() => {
    fetchMyWeatherData();
  }, [])

  const fetchMyWeatherData = async () => {
    fetchWeatherForecast({
      cityName: 'Kolkata',
      days: '7'
    }).then(data => {
      setWeather(data);
    })
  }

  //timer 
  const [date, setDate] = useState(new Date().toLocaleString());

  useEffect(() => {
    let secTimer = setInterval(() => {
      const formattedDate = new Date().toLocaleString('en-US', {
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });

      // Insert a comma between day and time
      const dayAndDate = formattedDate.replace(/(\w+)\s(\d+)/, '$1, $2');

      setDate(dayAndDate);
    }, 1000);

    return () => clearInterval(secTimer);
  }, []);

  //keyboard aware
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Adding keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);





  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);


  const { current, location } = weather;

  return (

    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      extraScrollHeight={keyboardHeight} // Adjust scroll height dynamically
    >


      {/* backgroundimage */}
      <Image
        style={styles.bgimg}
        source={require('../assets/images/bgx.png')}
        blurRadius={70} />

      <SafeAreaView style={styles.fullScreen}>

        {/* search section */}
        <View style={[styles.searchBar, { backgroundColor: showSearchBar ? 'rgba(255, 255, 255, 0.2)' : 'transparent' }, { elevation: showSearchBar ? 2 : 0 }]}>
          <View style={styles.searchCon}>
            {showSearchBar ? (
              <TextInput
                onChangeText={handleTextDebounce}
                placeholder=' Search City'
                placeholderTextColor={'lightgrey'}
                style={styles.searchInput}
              />
            ) : null}
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => toggelSearchBar(!showSearchBar)}>
              <MagnifyingGlassIcon size={25} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        {
          locations.length > 0 && showSearchBar ? (
            <View style={styles.searchSuggestion}>
              {
                locations.map((loc, index) => {

                  let showBorder = index + 1 != locations.length;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.searchSuggestionbtn, { borderBottomWidth: showBorder ? 1 : 0 }]}
                      onPress={() => handleLocations(loc)}
                    >
                      <MapPinIcon size={20} color={'grey'} style={{ marginLeft: 10 }} />
                      <Text style={styles.searchTxt}>
                        {loc?.name || 'Unknown Name'},{loc?.region || 'Unknown region'}, {loc?.country || 'Unknown Country'}
                      </Text>
                    </TouchableOpacity>
                  )
                })
              }
            </View>

          ) : null
        }


        {/* forecast section************************************************   */}

        <View style={{ marginHorizontal: 4, flexDirection: 'column', flex: 1, marginBottom: 4, marginVertical: 20, }}>
          {/* Location details */}
          <Text style={{ color: 'white', fontSize: 30, fontWeight: '700', alignSelf: 'center' }}>
            {location?.name},
            <Text style={{ color: 'grey', fontSize: 20, fontWeight: '400' }}>
              {" " + location?.country}
            </Text>
          </Text>
          <Text style={{ color: 'white', fontSize: 19, fontWeight: 'semibold', alignSelf: 'center', opacity: 0.5 }}>
            {date}
          </Text>

          {/* Weather Images  */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 15, }}>
            <Image
              source={{ uri: 'https:' + current?.condition?.icon }}
              style={{ width: 200, height: 200 }}
            />
          </View>

          {/* degree data */}
          <View style={{ marginVertical: 15 }}>
            <Text style={{ fontSize: 90, fontWeight: '800', color: 'white', textAlign: 'center', marginLeft: 29 }}>{current?.temp_c}&#176;</Text>
            <Text style={{ fontSize: 25, fontWeight: '600', color: 'white', opacity: 0.5, textAlign: 'center', marginLeft: 5, }}>{current?.condition?.text}</Text>
          </View>

          {/* Other stats */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginVertical: 10, }}>

            <View style={{ flexDirection: 'row', marginHorizontal: 2, alignItems: 'center' }}>
              <Image source={require('../assets/icons/wind.png')}
                style={{ height: 25, width: 25, tintColor: 'white' }}
              />
              <Text style={{ fontSize: 18, fontWeight: 'semibold', color: 'white', margin: 3 }}>
                {current?.wind_kph}Km
              </Text>
            </View>

            <View style={{ flexDirection: 'row', marginHorizontal: 2, alignItems: 'center' }}>
              <Image source={require('../assets/icons/drop.png')}
                style={{ height: 25, width: 25, tintColor: 'white' }}
              />
              <Text style={{ fontSize: 18, fontWeight: 'semibold', color: 'white', margin: 3 }}>
                {current?.humidity}%
              </Text>
            </View>

            <View style={{ flexDirection: 'row', marginHorizontal: 2, alignItems: 'center' }}>
              <Image source={require('../assets/icons/sun.png')}
                style={{ height: 25, width: 25, tintColor: 'white' }}
              />
              <Text style={{ fontSize: 18, fontWeight: 'semibold', color: 'white', margin: 3 }}>
                {current?.astro?.sunrise?.text}
              </Text>
            </View>
          </View>
        </View>


        {/* forecast for other days************************************ */}

        <View style={{ marginBottom: 40, marginVertical: 10, marginHorizontal: 10, }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 4, }}>
            <CalendarDaysIcon size={25} color={"white"} />
            <Text style={{ color: 'white', fontSize: 17, }}> Daily Forecast </Text>
          </View>
          <ScrollView
            horizontal={true}
            contentContainerStyle={{ paddingHorizontal: 20, }}
            showsHorizontalScrollIndicator={false}
          >

            {weather?.forecast?.forecastday?.map((item, index) => {
              let date = new Date(item.date);
              let options = { weekday: 'long' };
              let dayName = date.toLocaleDateString('en-US', options);
              return (
                <View
                  key={index}
                  style={{
                    flex: 1, justifyContent: 'center',
                    alignItems: 'center', width: 100, height: 110,
                    borderRadius: 20, paddingVertical: 4,
                    marginVertical: 5, marginRight: 14,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                  }}>

                  <Image
                    source={{ uri: 'https:' + item?.day?.condition?.icon }}
                    style={{ height: 40, width: 40 }}
                  />
                  <Text style={{ color: 'white', fontSize: 14, margin: 2 }}> {dayName} </Text>
                  <Text style={{ color: 'white', fontSize: 20, fontWeight: 'semibold' }}> {item?.day?.avgtemp_c}&#176;</Text>
                </View>

              )
            })}

          </ScrollView>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>

  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  bgimg: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
  },

  fullScreen: {
    flex: 1,
  },
  searchBar: {
    height: '7%',
    borderRadius: 100,
    marginTop: 20,
    marginHorizontal: 20,
    paddingHorizontal: 5,
    margin: 10,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,


  },

  searchCon: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 20,
    marginTop: 10,
    color: '#fff',
    marginHorizontal: 10,
  },

  searchButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 100,
    height: 50,
    width: 50,
    margin: 2,
    right: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    elevation: 2,
  },
  searchSuggestion: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    paddingHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    justifyContent: 'center',
    position: 'absolute',
    top: 87,
    left: 20,
    right: 20,
    zIndex: 100,
    paddingVertical: 5,

  },

  searchTxt: {
    color: '#000',
    fontWeight: '500',
    fontSize: 20,
    marginLeft: 2,
    margin: 5

  },

  searchSuggestionbtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    marginBottom: 1,
    borderRadius: 0,
    borderBottomWidth: 1,


  }

})
