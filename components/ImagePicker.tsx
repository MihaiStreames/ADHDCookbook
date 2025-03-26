import React from 'react';
import {Alert, Image, Text, TouchableOpacity, View} from 'react-native';
import {Feather} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {useTheme} from '../context/ThemeContext';

type ImagePickerProps = {
    image?: string;
    onImageSelected: (imageUri: string) => void;
    onImageRemoved: () => void;
    placeholder?: string;
    height?: number;
};

const ImagePickerComponent = ({
                                  image,
                                  onImageSelected,
                                  onImageRemoved,
                                  placeholder = 'Add Photo',
                                  height = 200
                              }: ImagePickerProps) => {
    const {styles, colors} = useTheme();

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission Required', 'You need to grant camera roll permissions to upload images');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
            base64: true,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
            if (result.assets[0].base64) {
                onImageSelected(`data:image/jpeg;base64,${result.assets[0].base64}`);
            }
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

export default ImagePickerComponent;