import { StatusBar, StyleSheet, Text, View, Image ,TextInput, Touchable, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

//for icons
import {MagnifyingGlassIcon} from 'react-native-heroicons/outline'
import {MapPinIcon} from 'react-native-heroicons/solid'




const Home = () => {

    //state for search bar 
    const [showSearchBar, toggelSearchBar] = useState(false);

    //location state 
    const [locations, setLocations] = useState([1,2,3]);

    //location handling on search 

    const handleLocations = (loc: number) => {
      console.log ("location" , loc)
    }
  return (
    <View style={styles.container}>
        <StatusBar barStyle={'light-content'} />

        {/* backgroundimage */}
        <Image 
        style ={styles.bgimg}
        source={require('../assets/bg3.jpg')} 
        blurRadius={70} />

        <SafeAreaView style = {styles.fullScreen}>

            {/* search section */}
            <View style={[styles.searchBar, {backgroundColor  : showSearchBar? '#f5f5f5' : 'transparent'},{elevation : showSearchBar? 2 : 0}]}>
                <View style ={styles.searchCon}>
                    {showSearchBar ? (
                        <TextInput placeholder=' Search City' placeholderTextColor={'white'} style={styles.searchInput} />
                    ):null}
                    <TouchableOpacity 
                    style = {styles.searchButton} 
                    onPress={() => toggelSearchBar(!showSearchBar)}>
                        <MagnifyingGlassIcon size={25} color= "white" />
                    </TouchableOpacity>
                </View>
            </View>
                {
                  locations.length > 0 && showSearchBar ? (
                    <View style= {styles.searchSuggestion}>
                      { 
                        locations.map((loc, index) => {

                          let showBorder = index+1 != locations.length;
                          return(
                            <TouchableOpacity
                            key={index}
                            style= {[styles.searchSuggestionbtn, {borderBottomWidth : showBorder? 1 : 0} ]}
                            onPress={()=> handleLocations(loc)}
                            >
                              <MapPinIcon size={20} color={'grey'} style={{marginLeft : 10}} />
                              <Text style= {styles.searchTxt}> London, United Kingdom </Text>
                            </TouchableOpacity>
                          )
                        })
                      }
                    </View>

                  ) : null
                }

          {/* forecast section   */}
            <View style = {{marginHorizontal : 4, flexDirection : 'column', flex : 1, marginBottom : 4}}>
              {/* Location details */}
              <Text style = {{color : 'white', fontSize :22, fontWeight : '700', alignSelf : 'center' }}>
                 London
                 <Text style ={{color : 'grey', fontSize : 16, fontWeight : '400'}}>
                  ,United Kingdom
                 </Text>
              </Text>
            </View>
        </SafeAreaView>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
    container : {
        flex : 1,
    },

    bgimg : {
        ...StyleSheet.absoluteFillObject,
        height : '100%',
        width : '100%',
    },

    fullScreen :{
       flex : 1,
    },
    searchBar: {
        height : '7%',
        opacity : 0.3,
        backgroundColor: '#F5F5F5',
        borderRadius: 100,
        marginTop : 20,
        marginHorizontal : 20,
        paddingHorizontal : 5,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        justifyContent : 'center'
      },

      searchCon :{
        justifyContent : 'center',
        alignItems : 'center',
        flexDirection : 'row'
      },
      searchInput: {
        flex : 1,
        height: 40,
        fontSize: 20, 
        marginTop : 9,
        color: '#fff',
        marginHorizontal : 10,
      },

      searchButton :{
        backgroundColor : '#000',
        opacity : 0.8,
        borderRadius : 100,
        height :50,
        width : 50,
        margin : 2,
        right : 2,
        justifyContent : 'center',
        alignItems : 'center',
        position : 'absolute',
        elevation : 2,
      },
      searchSuggestion : {
        backgroundColor : '#f5f5f5',
        borderRadius : 25,
        opacity : 0.8,
        marginHorizontal : 20,
        paddingHorizontal : 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        justifyContent : 'center'
      },

      searchTxt : {
        color : '#000',
        fontWeight : '500',
        fontSize : 20,
        marginLeft :2,
        margin : 5

      },

      searchSuggestionbtn : {
        flexDirection : 'row',
        alignItems : 'center',
        padding : 4,
        marginBottom : 1,
        borderRadius : 0,
        borderBottomWidth : 1,


      }
    
})