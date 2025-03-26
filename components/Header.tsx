import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {useTheme} from '../context/ThemeContext';

type HeaderProps = {
    title: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    rightComponent?: React.ReactNode;
};

const Header = ({
                    title,
                    showBackButton = false,
                    onBackPress,
                    rightComponent
                }: HeaderProps) => {
    const {styles, colors} = useTheme();

    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                {showBackButton && (
                    <TouchableOpacity
                        onPress={onBackPress}
                        style={styles.iconButton}
                    >
                        <Feather name="arrow-left" size={24} color={colors.foreground}/>
                    </TouchableOpacity>
                )}
                <Text style={showBackButton ? styles.smallTitle : styles.title} numberOfLines={1}>
                    {title}
                </Text>
            </View>
            {rightComponent && (
                <View style={styles.headerActions}>
                    {rightComponent}
                </View>
            )}
        </View>
    );
};

export default Header;