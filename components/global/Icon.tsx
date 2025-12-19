import React, { FC, ComponentProps } from 'react';
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

type IconProps =
    | {
        iconFamily: 'Ionicons';
        name: ComponentProps<typeof Ionicons>['name'];
        size: number;
        color?: string;
    }
    | {
        iconFamily: 'MaterialIcons';
        name: ComponentProps<typeof MaterialIcons>['name'];
        size: number;
        color?: string;
    }
    | {
        iconFamily: 'MaterialCommunityIcons';
        name: ComponentProps<typeof MaterialCommunityIcons>['name'];
        size: number;
        color?: string;
    };

const Icon: FC<IconProps> = ({ color, size, name, iconFamily }) => {
    if (iconFamily === 'Ionicons') {
        return (
            <Ionicons
                name={name}
                color={color}
                size={RFValue(size)} />
        );
    }

    if (iconFamily === 'MaterialCommunityIcons') {
        return (
            <MaterialCommunityIcons
                name={name}
                color={color}
                size={RFValue(size)} />
        );
    }

    return (
        <MaterialIcons
            name={name}
            color={color}
            size={RFValue(size)} />
    );
}

export default Icon