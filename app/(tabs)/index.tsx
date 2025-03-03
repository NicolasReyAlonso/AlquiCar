import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const index = () => {
  return (
    <View>
      <h1 style={Styles.h1}>index</h1>
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
  }
});

export default index