import { View, TouchableOpacity } from 'react-native'
import React, {} from 'react'
import { optionStyles } from '@/styles/optionsStyles';
import { Colors } from '@/utils/Constants';
import Icon from '../global/Icon';
import CustomText from '../global/CustomText';
import { useSocket } from '@/services/TCPProvider';
import { router } from 'expo-router';
import { pickDocument, pickImage } from '@/utils/libraryHelpers';
type OptionsProps = {
  isHome?: boolean;
  onMediaPickedUp?: (media: any) => void;
  onFilePickedUp?: (file: any) => void;
};

const Options: React.FC<OptionsProps> = ({ isHome, onMediaPickedUp, onFilePickedUp }) => {
  const { isConnected } = useSocket() as any;

  const handleUniversalPicker = async (type: string) => {
    if (isConnected) {
      router.navigate('/connection');
    } else {
      router.navigate('/send');
    }

    if (type === 'images' && onMediaPickedUp) {
      pickImage(onMediaPickedUp);
    }
    if (type === 'files' && onFilePickedUp) {
      pickDocument(onFilePickedUp);
    }
  };

  return (
    <View style={optionStyles.container}>
      <TouchableOpacity
        style={optionStyles.subContainer}
        onPress={() => handleUniversalPicker('images')}
      >
        <Icon name="images" iconFamily="Ionicons" color={Colors.primary} size={20} />
        <CustomText fontfamily="okra-medium" style={{ marginTop: 4, textAlign: 'center' }}>
          Photo
        </CustomText>
      </TouchableOpacity>
      <TouchableOpacity style={optionStyles.subContainer} onPress={() => {}}>
        <Icon name="musical-notes-sharp" iconFamily="Ionicons" color={Colors.primary} size={20} />
        <CustomText fontfamily="okra-medium" style={{ marginTop: 4, textAlign: 'center' }}>
          Audio
        </CustomText>
      </TouchableOpacity>
      <TouchableOpacity
        style={optionStyles.subContainer}
        onPress={() => handleUniversalPicker('files')}
      >
        <Icon name="folder-open" iconFamily="MaterialIcons" color={Colors.primary} size={20} />
        <CustomText fontfamily="okra-medium" style={{ marginTop: 4, textAlign: 'center' }}>
          Files
        </CustomText>
      </TouchableOpacity>
      <TouchableOpacity style={optionStyles.subContainer} onPress={() => {}}>
        <Icon name="contacts" iconFamily="MaterialIcons" color={Colors.primary} size={20} />
        <CustomText fontfamily="okra-medium" style={{ marginTop: 4, textAlign: 'center' }}>
          Contacts
        </CustomText>
      </TouchableOpacity>
    </View>
  );
}

export default Options