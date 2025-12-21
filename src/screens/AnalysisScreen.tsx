import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Animated,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import BodyAnalysisService, { BodyMeasurements } from '../services/BodyAnalysisService';

type AnalysisScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Analysis'>;
    route: RouteProp<RootStackParamList, 'Analysis'>;
};

export default function AnalysisScreen({ navigation, route }: AnalysisScreenProps) {
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('Preparando análise...');
    const scaleAnim = new Animated.Value(1);
    const rotateAnim = new Animated.Value(0);
    const { photos } = route.params;

    useEffect(() => {
        startAnalysis();
        startPulseAnimation();
        startRotateAnimation();
    }, []);

    const startPulseAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const startRotateAnimation = () => {
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: true,
            })
        ).start();
    };

    const startAnalysis = async () => {
        try {
            // Etapa 1: Processando imagens
            setStatusText('Processando imagens...');
            setProgress(20);
            await delay(800);

            // Etapa 2: Detectando pontos corporais
            setStatusText('Detectando pontos corporais...');
            setProgress(40);
            await delay(1000);

            // Etapa 3: Analisando com IA
            setStatusText('Analisando com IA...');
            setProgress(60);

            const measurements = await BodyAnalysisService.analyzePhotos(photos);

            // Etapa 4: Calculando medidas
            setStatusText('Calculando medidas...');
            setProgress(80);
            await delay(600);

            // Etapa 5: Finalizando
            setStatusText('Finalizando análise...');
            setProgress(100);
            await delay(400);

            // Navega para resultados
            navigation.replace('Results', { measurements });
        } catch (error) {
            console.error('Erro na análise:', error);
            setStatusText('Erro ao processar. Tente novamente.');
        }
    };

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

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
                    {/* Ícone animado */}
                    <View style={styles.iconWrapper}>
                        {/* Círculo externo rotativo */}
                        <Animated.View
                            style={[
                                styles.outerRing,
                                { transform: [{ rotate: spin }] },
                            ]}
                        >
                            <View style={styles.ringSegment1} />
                            <View style={styles.ringSegment2} />
                            <View style={styles.ringSegment3} />
                        </Animated.View>

                        {/* Círculo do meio */}
                        <Animated.View
                            style={[
                                styles.iconContainer,
                                { transform: [{ scale: scaleAnim }] },
                            ]}
                        >
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.iconGradient}
                            >
                                {/* Ícone de scan */}
                                <View style={styles.scanIcon}>
                                    <View style={styles.scanLine} />
                                    <View style={styles.scanLine} />
                                    <View style={styles.scanLine} />
                                </View>
                            </LinearGradient>
                        </Animated.View>
                    </View>

                    {/* Status */}
                    <View style={styles.statusContainer}>
                        <Text style={styles.statusText}>{statusText}</Text>
                        <Text style={styles.progressText}>{progress}%</Text>
                    </View>

                    {/* Barra de progresso */}
                    <View style={styles.progressBarContainer}>
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.progressBarBackground}
                        >
                            <LinearGradient
                                colors={['#FFFFFF', 'rgba(255, 255, 255, 0.9)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[
                                    styles.progressBarFill,
                                    { width: `${progress}%` },
                                ]}
                            />
                        </LinearGradient>
                    </View>

                    {/* Informações */}
                    <View style={styles.infoCard}>
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.infoGradient}
                        >
                            <Text style={styles.infoText}>
                                Estamos analisando suas fotos com inteligência artificial para calcular suas medidas
                            </Text>
                        </LinearGradient>
                    </View>

                    {/* Etapas */}
                    <View style={styles.stepsContainer}>
                        <View style={styles.step}>
                            <View style={[styles.stepDot, progress >= 20 && styles.stepDotActive]} />
                            <Text style={styles.stepText}>Processamento</Text>
                        </View>
                        <View style={styles.step}>
                            <View style={[styles.stepDot, progress >= 40 && styles.stepDotActive]} />
                            <Text style={styles.stepText}>Detecção</Text>
                        </View>
                        <View style={styles.step}>
                            <View style={[styles.stepDot, progress >= 60 && styles.stepDotActive]} />
                            <Text style={styles.stepText}>Análise IA</Text>
                        </View>
                        <View style={styles.step}>
                            <View style={[styles.stepDot, progress >= 80 && styles.stepDotActive]} />
                            <Text style={styles.stepText}>Cálculo</Text>
                        </View>
                        <View style={styles.step}>
                            <View style={[styles.stepDot, progress >= 100 && styles.stepDotActive]} />
                            <Text style={styles.stepText}>Concluído</Text>
                        </View>
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: Platform.OS === 'ios' ? 60 : 80,
    },
    iconWrapper: {
        marginBottom: 60,
        position: 'relative',
        width: 160,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
    },
    outerRing: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
    },
    ringSegment1: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 3,
        borderColor: 'transparent',
        borderTopColor: '#FFFFFF',
        borderRightColor: 'rgba(255, 255, 255, 0.3)',
    },
    ringSegment2: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 3,
        borderColor: 'transparent',
        borderLeftColor: 'rgba(255, 255, 255, 0.2)',
    },
    ringSegment3: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 3,
        borderColor: 'transparent',
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    iconGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanIcon: {
        gap: 8,
    },
    scanLine: {
        width: 40,
        height: 3,
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
    },
    statusContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    statusText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 12,
        textAlign: 'center',
    },
    progressText: {
        fontSize: 56,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -2,
    },
    progressBarContainer: {
        width: '100%',
        marginBottom: 40,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    progressBarBackground: {
        width: '100%',
        height: 12,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
    },
    infoCard: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    infoGradient: {
        padding: 20,
    },
    infoText: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 22,
    },
    stepsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 8,
    },
    step: {
        alignItems: 'center',
        gap: 8,
    },
    stepDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    stepDotActive: {
        backgroundColor: '#FFFFFF',
        borderColor: 'rgba(255, 255, 255, 0.5)',
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
    },
    stepText: {
        fontSize: 11,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.7)',
    },
});