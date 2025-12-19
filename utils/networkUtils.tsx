import * as Network from 'expo-network';

export const getLocalIPAddress = async (): Promise<string> => {
    try {
        const ip = await Network.getIpAddressAsync();
        console.log("IP ADDRESS", ip);
        return ip || '0.0.0.0';
    } catch (error) {
        console.error('Error getting local IP address:', error);
        return '0.0.0.0';
    }
};

function setLastBlockTo255(ip: string): string {
    const parts = ip.split('.').map(Number);
    parts[3] = 255;
    return parts.join('.');
}

export const getBroadcastAddress = async (): Promise<string | null> => {
    try {
        const ip = await Network.getIpAddressAsync();
        const broadcastAddress = setLastBlockTo255(ip || "255.255.255.255");
        console.log('Broadcast Address:', broadcastAddress);
        return broadcastAddress;
    } catch (error) {
        console.error('Error getting broadcast address:', error);
        return null;
    }
};

