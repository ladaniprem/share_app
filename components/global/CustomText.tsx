import { Text, TextStyle, StyleSheet, Platform } from 'react-native';
import React from 'react'
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '@/utils/Constants';

type Variant = 'h1'| 'h2' | 'h3'|'h4'|'h5'|'h6'|'h7'
type PlatformType  = 'ios' | 'android';

interface CustomTextProps {
    varient?: Variant;
    fontfamily?:"okra-regular" | "okra-medium" | "okra-bold"|'okra-Light'|'okra-Black';
    fontSize?:number;
    color?:string;
    style?:TextStyle|TextStyle[];
    children:React.ReactNode;
    numberOfLines?:number;
    onLayout?: (event: any) => void;
}

const fontSizeMap:Record<Variant, Record<PlatformType, number>> = {
    h1: {android:24,ios:22},
    h2: {android:22,ios:20},
    h3: {android:20,ios:18},
    h4: {android:18,ios:16},
    h5: {android:16,ios:14},
    h6: {android:14,ios:10},
    h7: {android:10,ios:9},
}

const CustomText: React.FC<CustomTextProps> = ({
    varient,
    fontfamily='okra-regular',
    fontSize,
    style,
    color,
    children,
    numberOfLines,
    onLayout,
    ...props
}) =>  {
    let computedFontSize:number = 
    Platform.OS === 'android' ? RFValue(fontSize ?? 12) : RFValue(fontSize ?? 10);

    if(varient && fontSizeMap[varient]){
        const defaultSize = fontSizeMap[varient][Platform.OS as PlatformType];
        computedFontSize = RFValue(fontSize || defaultSize);
    }

    return (
        <Text
            style={[
                styles.text,
                {color:color || Colors.text},
                { fontFamily: fontfamily, fontSize: computedFontSize, color }
            ]}
            numberOfLines={numberOfLines}
            onLayout={onLayout}
            {...props}
        >
            {children}
        </Text>
    )
}
export default CustomText

const styles = StyleSheet.create({
    text: {
        textAlign: 'left',
    }
})