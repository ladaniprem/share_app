import { View, TouchableOpacity } from 'react-native';
import React, { FC, useEffect, useState } from 'react'
import { useSocket } from '@/services/TCPProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { sendStyles } from '@/styles/sendStyles';
import QRScannerModel from '../modals/QRScannerModel';
import Icon from '../global/Icon';
import CustomText from '../global/CustomText';
import BreakerText from '../ui/BreakerText';
import { Colors, screenWidth } from '@/utils/Constants';
import LottieView from 'lottie-react-native';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { goBack } from 'expo-router/build/global-state/routing';
import { router } from 'expo-router';

type NearbyDevice = {
  id: string;
  position: { x: number; y: number };
  fullAddress: string;
  image: any;
  name: string;
};


// Returns a random position within a circle of given radius, ensuring minimum distance from existing positions
function getRandomPosition(
  radius: number,
  positions: { x: number; y: number }[],
  minDistance: number
): { x: number; y: number } {
  const maxAttempts = 50;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const angle = Math.random() * 2 * Math.PI;
    const r = Math.random() * (radius - minDistance);
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (
      positions.every(
        (pos) => Math.hypot(pos.x - x, pos.y - y) >= minDistance
      )
    ) {
      return { x, y };
    }
  }
  return { x: 0, y: 0 };
}




const SendScreen: FC = () => {
  const { connectToServer, isConnected }: any = useSocket();
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  // Only one demo device for now
  const [device, setDevice] = useState<NearbyDevice | null>(null);

  // No longer using deviceScaleMap; use hook directly in render

  const handleScan = (data: any) => {
    const [connectionData, deviceName] = data.replace('tcp://', '').split('|');
    const [host, port] = connectionData.split(':');
    if (connectToServer) {
      connectToServer(host, parseInt(port, 10), deviceName);
    }
  };

  const handleGoBack = () => {
    goBack();
  };

  // Add a dummy device for demonstration (remove in production)
  useEffect(() => {
    if (!device) {
      const deviceName = 'Demo Device';
      const newDevice: NearbyDevice = {
        id: `${Date.now()}_${Math.random()}`,
        name: deviceName,
        image: require('../../assets/icons/device.jpeg'),
        fullAddress: 'tcp://127.0.0.1:12345|Demo Device',
        position: getRandomPosition(150, [], 50),
      };
      setDevice(newDevice);
    }
  }, [device]);

  // Animation hooks for the single device
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => device ? ({
    transform: [{ scale: scale.value }],
    left: screenWidth / 2.33 + device.position.x,
    top: screenWidth / 2.2 + device.position.y,
  }) : {}, [device, scale.value]);


  useEffect(() => {
    if (isConnected) {
      router.navigate('/connection')
    }
  }, [isConnected]);

  return (
    <LinearGradient
      colors={['#FFFFFF', '#B869ED', '#A066E5']}
      style={sendStyles.container}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
    >
      <View style={sendStyles.mainContainer}>
        <View style={sendStyles.infoContainer}>
          <Icon name="search" iconFamily='Ionicons' color='#fff' size={40} />
          <View style={{ height: 20 }} />
          <CustomText fontfamily='okra-bold' color='#fff' fontSize={16} style={{ marginTop: 20 }}>
            Looking for nearby devices...
            {'\u00A0'}
            {'\u00A0'}
          </CustomText>
          <View style={{ height: 20 }} />
          <CustomText color='#fff' fontSize={12} fontfamily='okra-medium' style={{ textAlign: 'center' }}>
            {'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}your device&apos;s personal hotspot is active and the {'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}receiver device is connected to it.
          </CustomText>
          <BreakerText text='or' />
          <TouchableOpacity
            style={sendStyles.qrButton}
            onPress={() => setIsScannerVisible(true)}>
            <Icon name="qrcode-scan" iconFamily='MaterialCommunityIcons' color={Colors.primary} size={20} />
            <CustomText fontfamily='okra-bold' color={Colors.primary} >
              Scan QR
            </CustomText>
          </TouchableOpacity>
        </View>
        <View style={sendStyles.animationContainer}>
          <View style={sendStyles.lottieContainer}>
            <LottieView
              style={sendStyles.lottie}
              source={require('../../assets/animations/scanner.json')}
              autoPlay
              loop={true}
              hardwareAccelerationAndroid />
            {device && (
              <Animated.View key={device.id} style={[sendStyles.deviceDot, animatedStyle]}>
                <TouchableOpacity style={sendStyles.popup} onPress={() => handleScan(device.fullAddress)}>
                  <Image source={device.image} style={sendStyles.deviceImage} />
                  <CustomText numberOfLines={1} color='#333' fontfamily='okra-bold' fontSize={8} style={sendStyles.deviceText}>
                    {device.name}
                  </CustomText>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
          <Image source={require('../../assets/images/profile.jpg')}
            style={sendStyles.profileImage} />
        </View>

        <TouchableOpacity
          onPress={handleGoBack}
          style={[sendStyles.backButton, { position: 'absolute', top: 30, left: 20, height: 45, width: 45, justifyContent: 'center', alignItems: 'center' }]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="arrow-back" iconFamily='Ionicons' color='#000' size={18} />
        </TouchableOpacity>

      </View>
      {isScannerVisible && (
        <QRScannerModel
          visible={isScannerVisible}
          onClose={() => setIsScannerVisible(false)}
        />
      )}
    </LinearGradient>
  )
}

export default SendScreen