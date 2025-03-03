import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const index = () => {
  return (
    <View>
      <h1 style={Styles.h1}>AlquiCar</h1>
      <p style={Styles.p}>
      Lorem impush
      </p>
    </View>
    
  )
}

const Styles=StyleSheet.create({
  h1:{
    display:"flex",
    flex:1,
    justifyContent:"center",
    color:"white",
    fontSize:46,
    fontWeight:"bold",
  },
  p:{
    display:"flex",
    flex:2,
    justifyContent:"center",
    color:"white",
    fontSize:16,
  }
});

export default index