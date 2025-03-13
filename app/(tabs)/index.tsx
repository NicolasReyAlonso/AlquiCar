import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import React from 'react'
import { ThemedText } from '@/components/ThemedText';

const index = () => {
  return (
    <SafeAreaView>
      <ThemedText style={Styles.h1}>AlquiCar</ ThemedText>
      <ThemedText style={Styles.p}>
      Lorem impush
      </ThemedText>
    </SafeAreaView>
    
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
