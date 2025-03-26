import React from 'react';
import {Alert, Image, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {launchImageLibrary} from 'react-native-image-picker';
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
        launchImageLibrary({
            mediaType: 'photo',
            includeBase64: true,
            quality: 0.7,
        }, (response) => {
            if (response.didCancel) {
                return;
            } else if (response.errorCode) {
                Alert.alert('Error', response.errorMessage || 'Unknown error occurred');
                return;
            }

            if (response.assets && response.assets[0] && response.assets[0].base64) {
                onImageSelected(`data:image/jpeg;base64,${response.assets[0].base64}`);
            }
        });
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
                    <Icon name="x" size={16} color="#ffffff"/>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <TouchableOpacity
            style={[styles.imageContainer, {height, justifyContent: 'center'}]}
            onPress={pickImage}
        >
            <Icon
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