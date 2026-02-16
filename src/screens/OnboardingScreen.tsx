import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

const { width, height } = Dimensions.get('window');

type OnboardingScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};

export default function OnboardingScreen({ navigation }: OnboardingScreenProps) {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#7B2CBF', '#5A67D8', '#3B82F6', '#06B6D4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    {/* Logo/Ilustração */}
                    <View style={styles.illustrationContainer}>
                        <View style={styles.logoContainer}>
                            {/* Círculos decorativos */}
                            <View style={styles.decorCircle1} />
                            <View style={styles.decorCircle2} />

                            {/* Logo Principal - Letra S gigante */}
                            <View style={styles.logoCircle}>
                                <LinearGradient
                                    colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.logoGradient}
                                >
                                    <Text style={styles.logoText}>S</Text>
                                </LinearGradient>
                            </View>

                            {/* Anel externo */}
                            <View style={styles.outerRing} />
                        </View>
                    </View>

                    {/* Título e descrição */}
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Comece sua{'\n'}evolução</Text>
                        <Text style={styles.description}>
                            Acompanhe seu progresso com análises precisas da sua forma física
                        </Text>
                    </View>

                    {/* Botão CTA */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.startButton}
                            onPress={() => navigation.replace('Home')}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#FFFFFF', '#F0F0F0']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.startButtonGradient}
                            >
                                <Text style={styles.startButtonText}>Começar agora</Text>
                                <View style={styles.arrowCircle}>
                                    <Text style={styles.arrow}>→</Text>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7B2CBF',
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
    content: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: Platform.OS === 'ios' ? 60 : 80,
        paddingBottom: 40,
    },
    illustrationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 280,
        height: 280,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 32,
    },

    // Círculos decorativos de fundo
    decorCircle1: {
        position: 'absolute',
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    decorCircle2: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },

    // Logo principal
    logoCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: '#FFFFFF',
        zIndex: 1,
    },
    logoGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 96,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -4,
    },

    // Anel externo
    outerRing: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderStyle: 'dashed',
    },

    // Brand
    brandContainer: {
        alignItems: 'center',
        gap: 8,
    },
    brandName: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    brandBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    aiDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
    },
    brandSubtext: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
    },

    textContainer: {
        marginBottom: 52,
    },
    title: {
        fontSize: 48,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 24,
        lineHeight: 56,
        letterSpacing: -0.5,
    },
    description: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 28,
    },
    buttonContainer: {
        gap: 32,
    },
    startButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    startButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        paddingHorizontal: 32,
        gap: 12,
    },
    startButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#7B2CBF',
    },
    arrowCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(123, 44, 191, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrow: {
        fontSize: 16,
        color: '#7B2CBF',
        fontWeight: '700',
    },
    pageIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    dot: {
        width: 64,
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 2,
    },
    dotActive: {
        backgroundColor: '#FFFFFF',
    },
});