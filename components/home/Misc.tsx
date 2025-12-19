import { View, StyleSheet } from 'react-native'
import React from 'react'
import CustomText from '../global/CustomText'
import { Image } from 'expo-image'

const Misc = () => {
  return (
    <View style={styles.container}>
      <CustomText fontSize={18} fontfamily="okra-bold" style={{ fontWeight: 'bold' }}>
        Explore
      </CustomText>

      <Image
        source={require('../../assets/icons/adbanner.png')}
        style={styles.adBanner}
        contentFit="cover"
      />
      <View style={styles.row}>
        <View style={styles.textContainer}>
          <CustomText fontfamily='okra-regular' style={styles.text} fontSize={22}>
            #1 World Best{'\n'}File Sharing{'\n'}App!
          </CustomText>
        </View>
        <Image
          source={require('../../assets/icons/share_logo.jpg')}
          style={styles.Image}
          contentFit="contain"
        />
      </View>

      <CustomText fontfamily='okra-regular' style={styles.text2}>
        Made With ❤️ - Ladani Prem
      </CustomText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  adBanner: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginTop: 15,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: -2,
  },
  textContainer: {
    flex: 1,
    paddingRight: 15,
  },
  text: {
    opacity: 0.25,
    lineHeight: 35,
  },
  Image: {
    width: 125,
    height: 125,
    marginRight: 10,
  },
  text2: {
    opacity: 0.25,
    marginTop: 0,
    textAlign: 'center',
  },
})

export default Misc