import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { ThemedText } from '@/components/ThemedText';

const index = () => {
  return (
    <View>
      <ThemedText style={Styles.h1}>AlquiCar</ ThemedText>
      <ThemedText style={Styles.p}>
      Lorem impush
      </ThemedText>
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