import { View,ScrollView } from 'react-native'
import React from 'react'
import { commonStyles } from '../../styles/commonStyles'
import HomeHeader from '../home/HomeHeader'
import Misc from '../home/Misc'
import Options from '../home/Options'
import SendReceiveButton from './SendReceiveButton'
import AbsoluteQRBottom from '../home/AbsoluteQRBottom'

const HomeScreen = () => {
  return (
    <View style={commonStyles.baseContainer}>
      <HomeHeader />
     <ScrollView contentContainerStyle={{paddingBottom:100,paddingTop:15}}
     showsHorizontalScrollIndicator={false}>     
     <SendReceiveButton/>
     <Options isHome/>
     <Misc />
     </ScrollView>
     <AbsoluteQRBottom/>
    </View>
  )
}

export default HomeScreen