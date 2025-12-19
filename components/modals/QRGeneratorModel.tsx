import { View, Modal, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { modalStyles } from '@/styles/modalStyles';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { multiColor } from '@/utils/Constants';
import QRCode from 'react-native-qrcode-svg';
import CustomText from '../global/CustomText';
import Icon from '../global/Icon';
import { useSocket } from '@/services/TCPProvider';
import { getLocalIPAddress } from '@/utils/networkUtils';
import * as Device from 'expo-device';
import { router } from 'expo-router';
interface ModelProps {
    visible: boolean;
    onClose: () => void;
}
const QRGeneratorModel: React.FC<ModelProps> = ({ visible, onClose }) => {
    const { isConnected, server } = useSocket() as any;
    const [loading, setLoading] = React.useState(true);
    const [qrValue, setQrValue] = React.useState<string>('Prem');
    const shimerTranslateX = useSharedValue(-300);
    const shimerStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shimerTranslateX.value }]
    }))
    const setupServer = async () => {
        const deviceName = await Device.getDeviceTypeAsync();
        const ip = await getLocalIPAddress();
        const port = 4000;
        setQrValue(`ws://${ip}:${port}|${deviceName}`);
        setLoading(false);
    };
    useEffect(() => {
        shimerTranslateX.value = withRepeat(
            withTiming(300, { duration: 1500, easing: Easing.linear }),
            -1,
            false
        );

        if (visible) {
            setLoading(true);
            setupServer();
        }
    }, [visible]);

    useEffect(() => {
        console.log('TCPProvider isconnected update to : ', isConnected);
        if (isConnected) {
            onClose();
            router.navigate('/connection');
        }
    }, [isConnected]);

    return (
        <Modal
            animationType='slide'
            visible={visible}
            presentationStyle='formSheet'
            //(property) presentationStyle?: "formSheet" | "fullScreen" | "pageSheet" | "overFullScreen" | undefined
            // The presentationStyle determines the style of modal to show
            onRequestClose={onClose}
            //The onRequestClose callback is called when the user taps the hardware back button on Android, dismisses the sheet using a gesture on iOS (when allowSwipeDismissal is set to true) or the menu button on Apple TV.
            onDismiss={onClose}>
            {/* The onDismiss callback is called when the modal is dismissed. */}
            <View style={modalStyles.modalContainer}>
                <View style={modalStyles.qrContainer}>
                    {
                        loading || qrValue === null || qrValue === '' ? (
                            <View style={modalStyles.skeleton}>
                                <Animated.View style={[modalStyles.shimmerOverlay, shimerStyle]}>
                                    <LinearGradient
                                        colors={['#f3f3f3', "#fff", '#f3f3f3']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={modalStyles.shimmerGradient}
                                    >
                                    </LinearGradient>
                                </Animated.View>
                            </View>
                        ) : (
                            <QRCode
                                value={qrValue}
                                size={250}
                                logoSize={60}
                                logoBackgroundColor="#fff"
                                logoMargin={2}
                                logoBorderRadius={10}
                                logo={require('../../assets/images/profile(2).jpg')}
                                linearGradient={multiColor}
                                enableLinearGradient />
                        )
                    }
                </View>
                <View style={modalStyles.info}>
                    <CustomText
                        style={modalStyles.infoText1}>
                        Ensure you&apos;re on the same Wi-Fi network.
                    </CustomText>
                    <CustomText
                        style={modalStyles.infoText2}
                        numberOfLines={1}>
                        Ask the sender to scan this QR code to Connect and transfer
                    </CustomText>
                </View>
                <ActivityIndicator size='small' color='#fff' style={{ alignSelf: 'center' }} />
                <TouchableOpacity onPress={() => onClose()} style={modalStyles.closeButton}>
                    <Icon name='close' size={24} color='#000' iconFamily="MaterialCommunityIcons" />
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

export default QRGeneratorModel