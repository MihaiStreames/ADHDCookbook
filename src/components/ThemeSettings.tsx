import React from 'react';
import {Switch, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../context/ThemeContext';

type ThemeSettingsProps = {
    onClose: () => void;
};

const ThemeSettings = ({onClose}: ThemeSettingsProps) => {
    const {theme, toggleTheme, styles, colors, isUsingDeviceTheme, setUseDeviceTheme} = useTheme();

    return (
        <View style={{
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.cardBorder,
        }}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16
            }}>
                <Text style={styles.sectionTitle}>Use Device Theme</Text>
                <Switch
                    value={isUsingDeviceTheme}
                    onValueChange={setUseDeviceTheme}
                    trackColor={{false: colors.muted, true: colors.accent}}
                    thumbColor={colors.background}
                />
            </View>

            {!isUsingDeviceTheme && (
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: theme === 'light' ? colors.accent : colors.secondary,
                            borderRadius: 8,
                            padding: 12,
                            alignItems: 'center',
                            marginRight: 8
                        }}
                        onPress={toggleTheme}
                    >
                        <Text
                            style={{
                                color: theme === 'light'
                                    ? colors.accentForeground
                                    : colors.secondaryForeground,
                                fontWeight: '500'
                            }}
                        >
                            Light
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: theme === 'dark' ? colors.accent : colors.secondary,
                            borderRadius: 8,
                            padding: 12,
                            alignItems: 'center',
                            marginLeft: 8
                        }}
                        onPress={toggleTheme}
                    >
                        <Text
                            style={{
                                color: theme === 'dark'
                                    ? colors.accentForeground
                                    : colors.secondaryForeground,
                                fontWeight: '500'
                            }}
                        >
                            Dark
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity
                style={[styles.secondaryButton, {marginTop: 16}]}
                onPress={onClose}
            >
                <Text style={styles.secondaryButtonText}>Close</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ThemeSettings;