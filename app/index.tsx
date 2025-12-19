import SplashScreen from '@/components/Screen/SplashScreen';

export default function Index() {
  return (
    <>
        {/* <Navigation /> */}
        {/* Uncaught Error Looks like you have nested a 'NavigationContainer' inside another. 
          Normally you need only one container at the root of the app, so this was probably an error. 
          If this was intentional, wrap the container in 'NavigationIndependentTree' explicitly. 
          Note that this will make the child navigators disconnected from the parent and you won't be able to navigate between them. */}
        <SplashScreen />
    
    </>
  );
}
