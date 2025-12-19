import { TouchableOpacity, View, Image } from 'react-native'
import React, { FC, useEffect } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { sendStyles } from '@/styles/sendStyles';
import Icon from '../global/Icon';
import CustomText from '../global/CustomText';
import BreakerText from '../ui/BreakerText';
import { Colors } from '@/utils/Constants';
import LottieView from 'lottie-react-native';
import QRGeneratorModel from '../modals/QRGeneratorModel';
import * as Device from 'expo-device';
import { goBack } from 'expo-router/build/global-state/routing';
import { useSocket } from '@/services/TCPProvider'
import { getLocalIPAddress } from '@/utils/networkUtils';
import { router } from 'expo-router';
// UDP is not supported in Expo Go or managed workflow
const ReceiveScreen: FC = () => {
  const { isConnected, server } = useSocket() as any;
  const [isScanning, setIsScanning] = React.useState(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const [qrValue, setQRValue] = React.useState<string>('');
  const setupServer = React.useCallback(async () => {
    const deviceName = await Device.getDeviceTypeAsync();
    const ip = await getLocalIPAddress();
    const port = 4000;
    setQRValue(`ws://${ip}:${port}|${deviceName}`);
    console.log(`Server info: ws://${ip}:${port}|${deviceName}`);
  }, [server]);

  const handleGoBack = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    goBack();
  }

  useEffect(() => {
    if (isConnected) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      router.navigate('/connection');
    }
  }, [isConnected]);


  useEffect(() => {
    setupServer();
  }, [setupServer]);

  return (
    <LinearGradient
      colors={['#ffffff', '#4DA0DE', '#3387C5']}
      style={sendStyles.container}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
    >
      <View
        style={[
          sendStyles.mainContainer,
          { flex: 1, marginTop: 20, alignItems: 'center' },
        ]}
      >
        <View style={[sendStyles.infoContainer, { alignItems: 'center' }]}>
          <Icon name="blur-on" size={40} color="#fff" iconFamily="MaterialIcons" />
          <CustomText color="#fff" fontSize={12} fontfamily="okra-bold" style={{ marginTop: 20, textAlign: 'center' }}>
            Receiving from nearby devices
          </CustomText>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 8 }}>
            <CustomText
              color="#fff"
              fontSize={13}
              fontfamily="okra-medium"
              style={{ textAlign: 'center', paddingHorizontal: 12, justifyContent: 'center' }}
            >
              {'\u00A0'} {'\u00A0'}{'\u00A0'} Ensure your device is connected to the {'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}sender&apos;s hotspot network.
            </CustomText>
          </View>
          <BreakerText text='or' />
          <TouchableOpacity
            style={sendStyles.qrButton}
            onPress={() => setIsScanning(true)}>
            <Icon name='qrcode' size={16} color={Colors.primary} iconFamily='MaterialCommunityIcons' />
            <CustomText
              fontfamily='okra-bold'
              color={Colors.primary}>
              Show QR
            </CustomText>
          </TouchableOpacity>
        </View>
        <View style={sendStyles.animationContainer}>
          <View style={sendStyles.lottieContainer}>
            <LottieView
              style={sendStyles.lottie}
              source={require('@/assets/animations/scan2.json')}
              autoPlay
              loop={true}
              hardwareAccelerationAndroid />
          </View>
          <Image source={require('../../assets/images/profile(2).jpg')}
            style={sendStyles.profileImage} />
        </View>
        <TouchableOpacity
          onPress={handleGoBack}
          style={[sendStyles.backButton, { position: 'absolute', top: 15, left: 20, height: 45, width: 45, justifyContent: 'center', alignItems: 'center' }]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="arrow-back" iconFamily='Ionicons' color='#000' size={18} />
        </TouchableOpacity>
      </View>
      {
        isScanning && (
          <QRGeneratorModel
            visible={isScanning}
            onClose={() => setIsScanning(false)} />
        )
      }
    </LinearGradient>
  )
};
export default ReceiveScreen;