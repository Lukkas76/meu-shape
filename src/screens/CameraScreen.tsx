import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type CameraScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Camera'>;
    route: RouteProp<RootStackParamList, 'Camera'>;
};

interface PhotoCollection {
    front?: string;
    side?: string;
}

export default function CameraScreen({ navigation, route }: CameraScreenProps) {
    const [permission, requestPermission] = useCameraPermissions();
    const [photos, setPhotos] = useState<PhotoCollection>({});
    const cameraRef = useRef<CameraView>(null);
    const { photoType } = route.params;

    const getInstructions = () => {
        switch (photoType) {
            case 'front':
                return 'Foto de Frente';
            case 'side':
                return 'Foto de Lado';
            default:
                return '';
        }
    };

    const getSubInstructions = () => {
        switch (photoType) {
            case 'front':
                return 'Fique em pé, braços relaxados ao lado do corpo';
            case 'side':
                return 'Vire-se de lado, mantenha a postura natural';
            default:
                return '';
        }
    };

    const getNextPhotoType = (): 'side' | null => {
        if (photoType === 'front') return 'side';
        return null;
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                });

                if (photo) {
                    const updatedPhotos = { ...photos, [photoType]: photo.uri };
                    setPhotos(updatedPhotos);

                    const nextType = getNextPhotoType();

                    if (nextType) {
                        navigation.push('Camera', { photoType: nextType });
                    } else {
                        navigation.navigate('Analysis', {
                            photos: updatedPhotos as Required<PhotoCollection>,
                        });
                    }
                }
            } catch (error) {
                Alert.alert('Erro', 'Não foi possível tirar a foto. Tente novamente.');
            }
        }
    };

    if (!permission) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={['#7B2CBF', '#5A67D8', '#3B82F6', '#06B6D4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                />
                <Text style={styles.permissionText}>Verificando permissões...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={['#7B2CBF', '#5A67D8', '#3B82F6', '#06B6D4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                />
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.permissionContainer}>
                        <View style={styles.permissionIconContainer}>
                            <View style={styles.cameraIconBox}>
                                <View style={styles.cameraIconLens} />
                            </View>
                        </View>
                        <Text style={styles.permissionTitle}>Acesso à Câmera</Text>
                        <Text style={styles.permissionText}>
                            Precisamos de permissão para tirar fotos e analisar suas medidas corporais
                        </Text>
                        <TouchableOpacity
                            style={styles.permissionButton}
                            onPress={requestPermission}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#FFFFFF', '#F0F0F0']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.permissionButtonGradient}
                            >
                                <Text style={styles.permissionButtonText}>Permitir acesso</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing="back"
            >
                <View style={styles.overlay}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.backButtonText}>✕</Text>
                        </TouchableOpacity>
                        <View style={styles.progressContainer}>
                            <View style={[styles.progressDot, photoType === 'front' && styles.progressDotActive]} />
                            <View style={[styles.progressDot, photoType === 'side' && styles.progressDotActive]} />
                        </View>
                        <View style={styles.placeholder} />
                    </View>

                    {/* Área central com moldura */}
                    <View style={styles.guideContainer}>
                        <View style={styles.frameContainer}>
                            {/* Moldura minimalista */}
                            <View style={styles.guideBorder}>
                                <View style={[styles.corner, styles.cornerTopLeft]} />
                                <View style={[styles.corner, styles.cornerTopRight]} />
                                <View style={[styles.corner, styles.cornerBottomLeft]} />
                                <View style={[styles.corner, styles.cornerBottomRight]} />
                            </View>
                        </View>
                    </View>

                    {/* Instruções */}
                    <View style={styles.instructionsContainer}>
                        <View style={styles.instructionsCard}>
                            <LinearGradient
                                colors={['rgba(123, 44, 191, 0.9)', 'rgba(90, 103, 216, 0.9)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.instructionsGradient}
                            >
                                <Text style={styles.instructions}>{getInstructions()}</Text>
                                <Text style={styles.subInstructions}>{getSubInstructions()}</Text>
                            </LinearGradient>
                        </View>
                    </View>

                    {/* Botão de Captura */}
                    <View style={styles.controls}>
                        <TouchableOpacity
                            style={styles.captureButton}
                            onPress={takePicture}
                            activeOpacity={0.8}
                        >
                            <View style={styles.captureButtonOuter}>
                                <View style={styles.captureButtonInner} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </CameraView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A1828',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    safeArea: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 20 : 40,
        paddingBottom: 20,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(123, 44, 191, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    backButtonText: {
        fontSize: 22,
        color: '#FFFFFF',
        fontWeight: '300',
    },
    progressContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    progressDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    progressDotActive: {
        backgroundColor: '#FFFFFF',
        width: 32,
    },
    placeholder: {
        width: 44,
    },
    guideContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    frameContainer: {
        width: '75%',
        aspectRatio: 0.5,
        maxHeight: 550,
        position: 'relative',
    },
    guideBorder: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: '#FFFFFF',
        borderWidth: 4,
    },
    cornerTopLeft: {
        top: 0,
        left: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderTopLeftRadius: 12,
    },
    cornerTopRight: {
        top: 0,
        right: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderTopRightRadius: 12,
    },
    cornerBottomLeft: {
        bottom: 0,
        left: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomLeftRadius: 12,
    },
    cornerBottomRight: {
        bottom: 0,
        right: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomRightRadius: 12,
    },
    instructionsContainer: {
        paddingHorizontal: 32,
        paddingBottom: 24,
    },
    instructionsCard: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    instructionsGradient: {
        padding: 24,
    },
    instructions: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
    },
    subInstructions: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 22,
    },
    controls: {
        alignItems: 'center',
        paddingBottom: 50,
    },
    captureButton: {
        width: 85,
        height: 85,
    },
    captureButtonOuter: {
        width: 85,
        height: 85,
        borderRadius: 42.5,
        backgroundColor: 'rgba(123, 44, 191, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 5,
        borderColor: '#FFFFFF',
    },
    captureButtonInner: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: '#FFFFFF',
    },

    // Tela de Permissão
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    permissionIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    cameraIconBox: {
        width: 48,
        height: 40,
        borderWidth: 3,
        borderColor: '#FFFFFF',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraIconLens: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    permissionTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 12,
        textAlign: 'center',
    },
    permissionText: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    permissionButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    permissionButtonGradient: {
        paddingVertical: 18,
        paddingHorizontal: 40,
        alignItems: 'center',
    },
    permissionButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#7B2CBF',
    },
});