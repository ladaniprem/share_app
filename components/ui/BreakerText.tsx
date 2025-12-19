import { View,StyleSheet } from 'react-native'
import React, { FC } from 'react'
import CustomText from '../global/CustomText'

const BreakerText:FC<{text:string}> = ({text}) => {
  return (
    <View style={style.breakerContainer}>
      <View style={style.horizontalLine}/>
       <CustomText fontSize={12} fontfamily="okra-medium" style={style.breakerText} color='#fff'>
        {text}
        </CustomText>
        <View style={style.horizontalLine} />
    </View>
  )
}

const style = StyleSheet.create({
    breakerContainer: {
     flexDirection: 'row',
     alignItems: 'center',
    justifyContent: 'center',   
    marginVertical: 20,
    width: '80%',
    },
    horizontalLine: {
     flex: 1,
     height: 1,
     backgroundColor: '#CCC',
    },
    breakerText: {
        marginHorizontal: 10,
        color: '#fff',
        opacity: 0.8,
        textAlign: 'center',
    },
})

export default BreakerText