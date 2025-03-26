import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {useTheme} from '../context/ThemeContext';

type ServingsControlProps = {
    servings: number;
    onAdjustServings: (delta: number) => void;
};

const ServingsControl = ({servings, onAdjustServings}: ServingsControlProps) => {
    const {styles, colors} = useTheme();

    return (
        <View style={styles.servingsContainer}>
            <View style={styles.servingsLabel}>
                <Feather name="users" size={20} color={colors.mutedForeground}/>
                <Text style={styles.servingsText}>Servings</Text>
            </View>
            <View style={styles.servingsControls}>
                <TouchableOpacity
                    style={styles.servingsButton}
                    onPress={() => onAdjustServings(-1)}
                    disabled={servings <= 1}
                >
                    <Feather
                        name="minus"
                        size={16}
                        color={servings <= 1 ? colors.disabledIcon : colors.foreground}
                    />
                </TouchableOpacity>
                <Text style={styles.servingsValue}>{servings}</Text>
                <TouchableOpacity
                    style={styles.servingsButton}
                    onPress={() => onAdjustServings(1)}
                >
                    <Feather name="plus" size={16} color={colors.foreground}/>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ServingsControl;