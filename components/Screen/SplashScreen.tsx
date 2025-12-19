import { Platform, Image, Pressable } from 'react-native'
import { useRouter, useRootNavigation } from 'expo-router'
import { useEffect, useRef } from "react";
import { requestPhotoPermission } from "@/utils/Constants";
import { checkFilePermissions } from "@/utils/libraryHelpers";
import { commonStyles } from '@/styles/commonStyles';

const SplashScreen = () => {
  const router = useRouter();
  const navigation = useRootNavigation();

  useEffect(() => {
    const requestPermissions = async () => {
      await requestPhotoPermission();
      await checkFilePermissions(Platform.OS);
    };
    requestPermissions();
  }, []);

  const didNavigateRef = useRef(false);

  const handleNavigateHome = () => {
    if (didNavigateRef.current) return;
    if (!navigation?.isReady()) return;
    didNavigateRef.current = true;
    router.replace('/home');
  };

  // Auto navigate after short delay when ready
  useEffect(() => {
    const id = setTimeout(() => {
      if (didNavigateRef.current) return;
      if (!navigation?.isReady()) return;
      didNavigateRef.current = true;
      router.replace('/home');
    }, 8000);
    return () => clearTimeout(id);
  }, [navigation]);

  return (
    <Pressable style={commonStyles.container} onPress={handleNavigateHome} accessibilityRole="button" accessibilityLabel="Go to Home">
      <Image style={commonStyles.img}
        source={require('../../assets/images/logo_text.png')} />
    </Pressable>
  )
}

export default SplashScreen