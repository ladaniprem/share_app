import { View, Modal, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import React, { useEffect } from 'react'
import { modalStyles } from '@/styles/modalStyles';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import CustomText from '../global/CustomText';
import Icon from '../global/Icon';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSocket } from '@/services/TCPProvider';
import { deviceName } from 'expo-device';
import { router } from 'expo-router';

interface ModelProps {
    visible: boolean;
    onClose: () => void;
}

const QRScannerModel: React.FC<ModelProps> = ({ visible, onClose }) => {
    const { connect, isConnected } = useSocket() as any;
    const [loading, setLoading] = React.useState(true);
    const [codeFound, setCodeFound] = React.useState(false);
    const [hasPermission, setHasPermission] = React.useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const shimmerTranslateX = useSharedValue(-300);

    const shimmerStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shimmerTranslateX.value }]
    }));

    const [scanError, setScanError] = React.useState<string | null>(null);
    const handleScan = (data: string) => {
        const connectionData = data.replace('tcp://', '').split('|')[0];
        const [host, port] = connectionData.split(':');
        const portNum = parseInt(port, 10);
        if (!host || isNaN(portNum) || portNum <= 0 || portNum > 65535) {
            setScanError('Invalid QR code: Port is not valid.');
            return;
        }
        const url = `ws://${host}:${portNum}`;
        connect(url, deviceName);
        onClose();
    };

    useEffect(() => {
        const checkPermission = async () => {
            if (!permission?.granted) {
                const res = await requestPermission();
                setHasPermission(!!res?.granted);
            } else {
                setHasPermission(true);
            }
        };
        checkPermission();

        if (visible) {
            setLoading(true);
            setScanError(null);
            setCodeFound(false);
            const timer = setTimeout(() => {
                setLoading(false);
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [visible, permission, requestPermission]);

    useEffect(() => {
        shimmerTranslateX.value = withRepeat(
            withTiming(300, { duration: 1500, easing: Easing.linear }),
            -1,
            false,
        );
    }, [shimmerTranslateX]);

    useEffect(() => {
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
            onRequestClose={onClose}
            onDismiss={onClose}>
            <View style={modalStyles.modalContainer}>
                {scanError && (
                    <View style={{ padding: 16, backgroundColor: '#fee', borderRadius: 8, marginBottom: 12 }}>
                        <CustomText style={{ color: '#c00', textAlign: 'center' }}>{scanError}</CustomText>
                    </View>
                )}
                <View style={modalStyles.qrContainer}>
                    {loading ? (
                        <View style={modalStyles.skeleton}>
                            <Animated.View style={[modalStyles.shimmerOverlay, shimmerStyle]}>
                                <LinearGradient
                                    colors={['#f3f3f3', "#fff", '#f3f3f3']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={modalStyles.shimmerGradient}
                                />
                            </Animated.View>
                        </View>
                    ) : !hasPermission ? (
                        <View style={modalStyles.skeleton}>
                            <Image
                                source={require('../../assets/images/no_camera.png')}
                                style={modalStyles.noCameraImage}
                            />
                        </View>
                    ) : (
                        <View style={modalStyles.skeleton}>
                            <CameraView
                                style={modalStyles.camera}
                                active={visible && hasPermission}
                                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                                onBarcodeScanned={({ data }) => {
                                    if (codeFound || !data) return;
                                    setCodeFound(true);
                                    handleScan(data);
                                }}
                            />
                        </View>
                    )}
                </View>

                <View style={modalStyles.info}>
                    <CustomText style={modalStyles.infoText1}>
                        Ensure both devices are on the same Wi-Fi network and the port is valid (1-65535).
                    </CustomText>
                    <CustomText style={modalStyles.infoText2} numberOfLines={1}>
                        Ask the receiver to show a QR code to connect and transfer files.
                    </CustomText>
                </View>

                <ActivityIndicator size='small' color='#fff' style={{ alignSelf: 'center' }} />
                <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
                    <Icon name='close' size={24} color='#000' iconFamily="MaterialCommunityIcons" />
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

export default QRScannerModel