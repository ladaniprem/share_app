import { View, TouchableOpacity, Platform, Linking, ActivityIndicator, FlatList } from 'react-native'
import * as Sharing from 'expo-sharing';
import React, { FC, useEffect } from 'react'
import { useSocket } from '@/services/TCPProvider';
import Icon from '../global/Icon';
// import send from '@/app/send'; // Removed unused import
import { router } from 'expo-router';
import { Colors } from '../../utils/Constants';
import { sendStyles } from '@/styles/sendStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { connectionStyles } from '@/styles/connectionStyles';
import CustomText from '../global/CustomText';
import Options from '../home/Options';
import { formatFileSize } from '@/utils/libraryHelpers';
// import Blob from 'expo-blob'; // Removed unused import
const ConnectionScreen: FC = () => {
  const {
    disconnect,
    sendFileAck,
    sentFiles,
    receivedFiles,
    totalReceivedBytes,
    totalSentBytes,
    isConnected,
    // connectedDevice may not exist, so handle it below
  } = useSocket();

  // If connectedDevice is not part of context, fallback to a default value
  // You may need to add connectedDevice to your SocketContextType if required
  // For now, use a fallback:
  const connectedDevice = (useSocket() as any).connectedDevice || 'Unknown Device';

  const [activeTab, setActiveTab] = React.useState<'sent' | 'received'>('sent');

  const renderThumbnail = (mimeType: string) => {
    switch (mimeType) {
      case 'mp3':
        return <Icon name="musical-notes" size={18} color="blue" iconFamily="Ionicons" />;
      case 'mp4':
        return <Icon name="videocam" size={18} color="green" iconFamily="Ionicons" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <Icon name="image" size={18} color="orange" iconFamily="Ionicons" />;
      case 'pdf':
        return <Icon name="document-text" size={18} color="red" iconFamily="Ionicons" />;
      default:
        return <Icon name="folder" size={18} color="gray" iconFamily="Ionicons" />;
    }
  };

  const onMediaPickUp = (image: any) => {
    console.log('Picked image:', image);
    sendFileAck("image", image);
  };

  const onFilePickedUp = (file: any) => {
    console.log('Picked file:', file);
    sendFileAck("file", file);
  };

  useEffect(() => {
    if (!isConnected) {
      router.replace('/send');
    }
  }, [isConnected]);

  const handleTabChange = (tab: 'sent' | 'received') => {
    setActiveTab(tab);
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <>
        <View style={connectionStyles.fileItem}>
          <View style={connectionStyles.fileContainer}>
            {renderThumbnail(item?.mimeType)}
            <View style={connectionStyles?.fileDetails}>
              <CustomText numberOfLines={1} fontfamily='okra-bold' fontSize={12}>
                {item?.name}
              </CustomText>
              <CustomText>
                {item?.mimeType}{'\u2022'}{formatFileSize(item?.size)}
              </CustomText>
            </View>
          </View>
          {item?.available ? (
            <TouchableOpacity
              onPress={async () => {
                try {
                  const uri =
                    Platform.OS === 'android'
                      ? item?.url?.startsWith('file://')
                        ? item?.url
                        : `file://${item?.url}`
                      : item?.url;
                  if (Platform.OS === 'android' && uri.startsWith('file://')) {
                    if (await Sharing.isAvailableAsync()) {
                      await Sharing.shareAsync(uri);
                      return;
                    } else {
                      console.warn('Sharing is not available on this device.');
                      return;
                    }
                  }
                  const canOpen = await Linking.canOpenURL(uri);
                  if (!canOpen) {
                    console.warn('Cannot open file URI:', uri);
                    return;
                  }
                  await Linking.openURL(uri);
                  console.log('File opened successfully');
                } catch (error) {
                  console.error('Error opening file:', error);
                }
              }}
              style={connectionStyles.openButton}
            >
              <CustomText numberOfLines={1} color='#fff' fontfamily='okra-bold' fontSize={9}>
                Open
              </CustomText>
            </TouchableOpacity>
          ) : (
            <ActivityIndicator color={Colors.primary} size='small' />
          )}
        </View>
      </>
    );
  }

  return (
    <LinearGradient
      colors={['#FFFFFF', '#CDDAEE', '#8DBAFF']}
      style={sendStyles.container}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
    >
      <View style={sendStyles.mainContainer}>
        <View style={connectionStyles.container}>
          <View style={connectionStyles.connectionContainer}>
            <View style={{ width: '55%' }}>
              <CustomText numberOfLines={1} fontfamily='okra-bold' fontSize={16} >
                connected with
              </CustomText>
              <CustomText numberOfLines={1} fontfamily='okra-bold' fontSize={14}>
                {connectedDevice || 'Unknown Device'}
              </CustomText>
            </View>
            <TouchableOpacity
              onPress={() => disconnect()}
              style={connectionStyles.disconnectButton}>
              <Icon name="remove-circle" size={18} color='red' iconFamily='Ionicons' />
              <CustomText numberOfLines={1} fontfamily='okra-bold' fontSize={14}>
                Disconnect
              </CustomText>
            </TouchableOpacity>
          </View>

          <Options
            onMediaPickedUp={onMediaPickUp}
            onFilePickedUp={onFilePickedUp}
          />

          <View style={connectionStyles.fileContainer}>
            <View style={connectionStyles.sendReceiveContainer}>
              <View style={connectionStyles.sendReceiveButton}>
                <TouchableOpacity
                  onPress={() => handleTabChange('sent')}
                  style={[
                    connectionStyles.sendReceiveButton,
                    activeTab === 'sent' ? connectionStyles.activeButton : connectionStyles.inactiveButton,
                  ]}>
                  <CustomText numberOfLines={1} fontSize={10} fontfamily='okra-bold' color={activeTab === 'sent' ? '#fff' : '#000'}>
                    SENT
                  </CustomText>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleTabChange('received')}
                  style={[
                    connectionStyles.sendReceiveButton,
                    activeTab === 'received' ? connectionStyles.activeButton : connectionStyles.inactiveButton,
                  ]}>
                  <CustomText numberOfLines={1} fontSize={10} fontfamily='okra-bold' color={activeTab === 'received' ? '#fff' : '#000'}>
                    RECEIVED
                  </CustomText>
                </TouchableOpacity>
              </View>

              <View style={connectionStyles.sendReceiveDataContainer}>
                <CustomText fontfamily='okra-bold' fontSize={10}>
                  {formatFileSize((activeTab === 'sent' ? totalSentBytes : totalReceivedBytes || 0))}
                </CustomText>
                <CustomText fontfamily='okra-bold' fontSize={12}>
                  /
                </CustomText>
                <CustomText fontfamily='okra-bold' fontSize={10}>
                  {
                    activeTab === 'sent' ?
                      formatFileSize(sentFiles?.reduce((total: number, file: any) => total + file.size, 0))
                      :
                      formatFileSize(receivedFiles?.reduce((total: number, file: any) => total + file.size, 0))
                  }
                </CustomText>
              </View>
            </View>
            {
              (activeTab === 'sent' ? sentFiles?.length : receivedFiles?.length) > 0 ? (
                <FlatList
                  data={activeTab === 'sent' ? sentFiles : receivedFiles}
                  keyExtractor={item => item.id.toString()}
                  renderItem={renderItem}
                  contentContainerStyle={connectionStyles.fileList}
                />
              ) : (
                <View style={connectionStyles.noDataContainer}>
                  <CustomText numberOfLines={1} fontfamily='okra-medium' fontSize={14}>
                    {activeTab === 'sent' ? 'No files sent yet.' : 'No files received yet.'}
                  </CustomText>
                </View>
              )
            }

          </View>
        </View>
      </View>
      <View style={sendStyles.mainContainer}>
        <TouchableOpacity onPress={() => router.navigate('/home')}
          style={sendStyles.backButton}>
          <Icon name="arrow-back" iconFamily='Ionicons' color='#000' size={18} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}

export default ConnectionScreen