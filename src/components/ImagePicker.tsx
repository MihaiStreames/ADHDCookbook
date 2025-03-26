import React from 'react';
import {Alert, Image, Text, TouchableOpacity, View} from 'react-native';
import {Feather} from '@expo/vector-icons';
import * as ExpoImagePicker from 'expo-image-picker';
import {useTheme} from '../context/ThemeContext';

type ImagePickerProps = {
    image?: string;
    onImageSelected: (imageUri: string) => void;
    onImageRemoved: () => void;
    placeholder?: string;
    height?: number;
};

const ImagePicker = ({
                         image,
                         onImageSelected,
                         onImageRemoved,
                         placeholder = 'Add Photo',
                         height = 200
                     }: ImagePickerProps) => {
    const {styles, colors} = useTheme();

    const pickImage = async () => {
        const {status} = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant camera roll permissions to add a photo.');
            return;
        }

        const result = await ExpoImagePicker.launchImageLibraryAsync({
            mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.7,
            base64: true,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
            onImageSelected(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
    };

    if (image) {
        return (
            <View style={[styles.imageContainer, {height}]}>
                <Image
                    source={{uri: image}}
                    style={styles.imagePreview}
                    resizeMode="cover"
                />
                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={onImageRemoved}
                >
                    <Feather name="x" size={16} color="#ffffff"/>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <TouchableOpacity
            style={[styles.imageContainer, {height, justifyContent: 'center'}]}
            onPress={pickImage}
        >
            <Feather
                name="image"
                size={40}
                color={colors.placeholderText}
                style={styles.imageIcon}
            />
            <Text style={styles.imageButtonText}>{placeholder}</Text>
        </TouchableOpacity>
    );
};

export default ImagePicker;