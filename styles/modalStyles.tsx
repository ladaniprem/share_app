import { StyleSheet } from "react-native";
import { screenHeight, screenWidth } from "../utils/Constants";

export const modalStyles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    qrContainer: {
        width: Math.min(screenWidth * 0.8, 320),
        aspectRatio: 1,
        marginTop: screenHeight * 0.1,
        padding: 20,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 12,
        alignSelf: 'center',
        justifyContent: "center",
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    noCameraImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    camera: {
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
    },
    info: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
    },
    infoText1: {
        fontFamily: 'Okra-Medium',
        textAlign: "center",
        opacity: 0.7,
        marginBottom: 12,
    },
    infoText2: {
        fontFamily: 'Okra-Medium',
        textAlign: "center",
        opacity: 0.7,
        fontSize: 14,
    },
    skeleton: {
        width: Math.min(screenWidth * 0.7, 250),
        aspectRatio: 1,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
        alignSelf: 'center',
    },
    shimmerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
    },
    shimmerGradient: {
        width: '100%',
        height: '100%',
    },
    closeButton: {
        padding: 8,
        borderRadius: 100,
        zIndex: 4,
        position: 'absolute',
        top: 16,
        right: 16,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        elevation: 3,
        shadowRadius: 4,
        shadowColor: "#888",
        backgroundColor: "#fff",
    }
})