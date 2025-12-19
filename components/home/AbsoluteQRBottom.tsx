import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { bottomTabStyles } from '@/styles/bottomTabStyle';
import { useRouter } from 'expo-router';
import Icon from '../global/Icon';
import QRScannerModel from '../modals/QRScannerModel';
const AbsoluteQRBottom = () => {
    const [isVisible, setIsVisible] = React.useState(false);
    const router = useRouter();

    return (
        <>
            <View style={bottomTabStyles.container}>
                <TouchableOpacity
                    accessibilityRole="button"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    onPress={() => {
                        console.log('Bottom tab: navigating to rfile');
                        router.push('/rfile');
                    }}>
                    <Icon name="folder" size={28} color="#333" iconFamily='Ionicons' />
                </TouchableOpacity>

                <TouchableOpacity
                    style={bottomTabStyles.qrCode}
                    onPress={() => setIsVisible(true)}>
                    <Icon name="qrcode-scan" size={32} color="#fff" iconFamily='MaterialCommunityIcons' />
                </TouchableOpacity>

                <TouchableOpacity>
                    <Icon name="cog-outline" size={28} color="#333" iconFamily="MaterialCommunityIcons" />
                </TouchableOpacity>
            </View>

            {isVisible && (
                <QRScannerModel visible={isVisible} onClose={() => setIsVisible(false)} />
            )}
        </>
    )
}

export default AbsoluteQRBottom