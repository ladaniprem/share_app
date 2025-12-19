import React, { FC, useEffect, useState } from 'react';
import { View, ActivityIndicator, FlatList, TouchableOpacity, Platform, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Directory, File, Paths } from 'expo-file-system';
import Icon from '../global/Icon';
import { sendStyles } from '@/styles/sendStyles';
import CustomText from '../global/CustomText';
import { Colors } from '@/utils/Constants';
import { connectionStyles } from '../../styles/connectionStyles';
import { formatFileSize } from '@/utils/libraryHelpers';
import { goBack } from 'expo-router/build/global-state/routing';
import { useRouter } from 'expo-router';
/*
Note for blob import:
Expo provides the official library expo-blob
for handling binary data (Blobs) in React Native applications,
ensuring web standards compliance and reliable performance across 
all platforms.          

expo-blob offers a robust, 
web standards-compliant implementation of the Blob object, 
which is essential for working with multimedia objects like 
images, videos, and audio files. 

import for filesystem:-

new version of the expo 
that I have debug code using AI but their new version full of the example
of documentation of expo but does not accurately answer debug it so,
anykind of stuck in situation to use it
this updated code for new version directly.

*/
type FormattedFile = {
  id: string;
  name: string;
  size: number;
  url: string;
  mimeType: string;
};

const ReceivedFileScreen: FC = () => {
  const [files, setFiles] = useState<FormattedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadFiles = () => {
    try {
      setLoading(true);

      const directory = new Directory(Paths.document);
      const contents = directory.list();

      const onlyFiles = contents.filter(
        (item): item is File => item instanceof File
      );

      // ✅ required formatted structure
      const formattedFiles: FormattedFile[] = onlyFiles.map((file) => ({
        id: file.name,
        name: file.name,
        size: file.size ?? 0,
        url: file.uri,
        mimeType: file.name.split('.').pop()?.toLowerCase() || 'unknown',
      }));
      setFiles(formattedFiles);
    } catch (error) {
      console.error('Error loading files:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  // ✅ thumbnail renderer (fixed switch + types)
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

  // ✅ item renderer uses thumbnail to avoid unused variable error
  const renderItem = ({ item }: { item: any }) => (
    <>
      <View style={connectionStyles.fileItem}>
        <View style={connectionStyles.fileInfoContainer}>
          {renderThumbnail(item?.mimeType)}
          <View style={connectionStyles.fileDetails}>
            <CustomText numberOfLines={1} fontfamily='okra-bold' fontSize={14} color='#333'>
              {item?.name}
            </CustomText>
            <CustomText numberOfLines={1} fontfamily='okra-regular' fontSize={12} color='#666'>
              {item.mimeType} • {formatFileSize(item.size)}
            </CustomText>
          </View>
        </View>

        <TouchableOpacity
          onPress={async () => {
            try {
              const uri =
                Platform.OS === 'android'
                  ? item?.url?.startsWith('file://')
                    ? item?.url
                    : `file://${item?.url}`
                  : item?.url;

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
      </View>
    </>
  );

  return (
    <LinearGradient
      colors={['#FFFFFF', '#CDDAEE', '#8DBAFF']}
      style={sendStyles.container}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
    >
      <View style={sendStyles.mainContainer}>
        <View style={{ height: 56, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', borderBottomWidth: 0.5, borderBottomColor: '#DADDE5' }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ position: 'absolute', left: 12, height: 36, width: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name='arrow-back' iconFamily='Ionicons' size={18} color='#000' />
          </TouchableOpacity>
          <CustomText fontfamily='okra-bold' fontSize={16} color='#000'>
            Received Files
          </CustomText>
        </View>
        <CustomText fontfamily='okra-bold' fontSize={15} color='#fff'
          style={{ textAlign: 'center', marginVertical: 10 }}>
          All Received Files
        </CustomText>
      </View>
      {
        loading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : files.length > 0 ? (
          <View style={{ flex: 1 }}>
            <FlatList
              data={files}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={connectionStyles.fileList}
            />
          </View>
        ) : (
          <View style={connectionStyles.noDataContainer}>
            <CustomText fontfamily='okra-regular' fontSize={14} color='#333'>
              No received files found.
            </CustomText>
          </View>
        )}
      <TouchableOpacity
        style={sendStyles.backButton}
        onPress={goBack}>
        <Icon name='arrow-back' iconFamily='Ionicons' size={16} color='#000' />
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default ReceivedFileScreen;