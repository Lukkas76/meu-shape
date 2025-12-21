import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    DimensionValue,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BodyMeasurements } from '../services/BodyAnalysisService';

type ResultsScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Results'>;
    route: RouteProp<RootStackParamList, 'Results'>;
};

export default function ResultsScreen({ navigation, route }: ResultsScreenProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const { measurements } = route.params;

    const saveMeasurements = async () => {
        setIsSaving(true);
        try {
            const historyData = await AsyncStorage.getItem('measurementHistory');
            const history = historyData ? JSON.parse(historyData) : [];

            const newEntry = {
                ...measurements,
                date: new Date().toISOString(),
                id: Date.now(),
            };

            history.push(newEntry);
            await AsyncStorage.setItem('measurementHistory', JSON.stringify(history));

            setIsSaved(true);
        } catch (error) {
            console.error('Erro ao salvar:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const getProgressWidth = (type: string): DimensionValue => {
        const widths: { [key: string]: DimensionValue } = {
            chest: '75%',
            waist: '65%',
            hip: '70%',
            bodyFat: `${Math.min(measurements.bodyFat * 2, 100)}%`,
            arm: '60%',
            leg: '80%',
        };
        return widths[type] || '50%';
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#7B2CBF', '#5A67D8', '#3B82F6', '#06B6D4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            />
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Seus{'\n'}Resultados</Text>
                        <Text style={styles.subtitle}>Análise concluída com sucesso</Text>
                    </View>

                    {/* Status Card */}
                    <View style={styles.statusCard}>
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.statusGradient}
                        >
                            <View style={styles.statusIcon}>
                                <Text style={styles.statusEmoji}>✨</Text>
                            </View>
                            <View style={styles.statusContent}>
                                <Text style={styles.statusTitle}>Pronto!</Text>
                                <Text style={styles.statusText}>Suas medidas foram calculadas</Text>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Medidas Principais */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Medidas principais</Text>

                        <View style={styles.measurementGrid}>
                            {/* Peito */}
                            <View style={styles.measurementCard}>
                                <LinearGradient
                                    colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.measurementGradient}
                                >
                                    <Text style={styles.measurementLabel}>Peito</Text>
                                    <View style={styles.progressBar}>
                                        <View
                                            style={[
                                                styles.progressFill,
                                                { width: getProgressWidth('chest') },
                                            ]}
                                        />
                                    </View>
                                    <Text style={styles.measurementValue}>{measurements.chest}</Text>
                                    <Text style={styles.measurementUnit}>centímetros</Text>
                                </LinearGradient>
                            </View>

                            {/* Cintura */}
                            <View style={styles.measurementCard}>
                                <LinearGradient
                                    colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.measurementGradient}
                                >
                                    <Text style={styles.measurementLabel}>Cintura</Text>
                                    <View style={styles.progressBar}>
                                        <View
                                            style={[
                                                styles.progressFill,
                                                { width: getProgressWidth('waist') },
                                            ]}
                                        />
                                    </View>
                                    <Text style={styles.measurementValue}>{measurements.waist}</Text>
                                    <Text style={styles.measurementUnit}>centímetros</Text>
                                </LinearGradient>
                            </View>

                            {/* Quadril */}
                            <View style={styles.measurementCard}>
                                <LinearGradient
                                    colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.measurementGradient}
                                >
                                    <Text style={styles.measurementLabel}>Quadril</Text>
                                    <View style={styles.progressBar}>
                                        <View
                                            style={[
                                                styles.progressFill,
                                                { width: getProgressWidth('hip') },
                                            ]}
                                        />
                                    </View>
                                    <Text style={styles.measurementValue}>{measurements.hip}</Text>
                                    <Text style={styles.measurementUnit}>centímetros</Text>
                                </LinearGradient>
                            </View>

                            {/* Gordura Corporal */}
                            <View style={styles.measurementCard}>
                                <LinearGradient
                                    colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.measurementGradient}
                                >
                                    <Text style={styles.measurementLabel}>Gordura</Text>
                                    <View style={styles.progressBar}>
                                        <View
                                            style={[
                                                styles.progressFill,
                                                { width: getProgressWidth('bodyFat') },
                                            ]}
                                        />
                                    </View>
                                    <Text style={styles.measurementValue}>{measurements.bodyFat}</Text>
                                    <Text style={styles.measurementUnit}>percentual</Text>
                                </LinearGradient>
                            </View>
                        </View>
                    </View>

                    {/* Medidas Adicionais */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Outras medidas</Text>

                        <View style={styles.additionalCard}>
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.additionalGradient}
                            >
                                <View style={styles.additionalItem}>
                                    <View>
                                        <Text style={styles.additionalLabel}>Braço</Text>
                                        <View style={styles.additionalProgress}>
                                            <View
                                                style={[
                                                    styles.additionalProgressFill,
                                                    { width: getProgressWidth('arm') },
                                                ]}
                                            />
                                        </View>
                                    </View>
                                    <Text style={styles.additionalValue}>{measurements.arm} cm</Text>
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.additionalItem}>
                                    <View>
                                        <Text style={styles.additionalLabel}>Perna</Text>
                                        <View style={styles.additionalProgress}>
                                            <View
                                                style={[
                                                    styles.additionalProgressFill,
                                                    { width: getProgressWidth('leg') },
                                                ]}
                                            />
                                        </View>
                                    </View>
                                    <Text style={styles.additionalValue}>{measurements.leg} cm</Text>
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.additionalItem}>
                                    <Text style={styles.additionalLabel}>Altura</Text>
                                    <Text style={styles.additionalValue}>{measurements.height} cm</Text>
                                </View>
                            </LinearGradient>
                        </View>
                    </View>

                    {/* Info Card */}
                    <View style={styles.infoCard}>
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.infoGradient}
                        >
                            <Text style={styles.infoTitle}>💡 Dica</Text>
                            <Text style={styles.infoText}>
                                Tire novas fotos regularmente para acompanhar sua evolução ao longo do tempo
                            </Text>
                        </LinearGradient>
                    </View>

                    <View style={styles.bottomSpacer} />
                </ScrollView>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    {!isSaved ? (
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={saveMeasurements}
                            disabled={isSaving}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#FFFFFF', '#F0F0F0']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.saveGradient}
                            >
                                <Text style={styles.saveButtonText}>
                                    {isSaving ? 'Salvando...' : 'Salvar resultados'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.buttonsRow}>
                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={() => navigation.navigate('Evolution')}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.secondaryGradient}
                                >
                                    <Text style={styles.secondaryButtonText}>Ver evolução</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={() => navigation.navigate('Home')}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#FFFFFF', '#F0F0F0']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.primaryGradient}
                                >
                                    <Text style={styles.primaryButtonText}>Voltar ao início</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    )}
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 10 : 30,
        paddingBottom: 24,
    },
    title: {
        fontSize: 40,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 8,
        lineHeight: 48,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    statusCard: {
        borderRadius: 20,
        marginBottom: 32,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    statusGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    statusIcon: {
        width: 56,
        height: 56,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    statusEmoji: {
        fontSize: 28,
    },
    statusContent: {
        flex: 1,
    },
    statusTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    statusText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    measurementGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    measurementCard: {
        flex: 1,
        minWidth: '47%',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    measurementGradient: {
        padding: 16,
        alignItems: 'center',
    },
    measurementLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    progressBar: {
        width: '100%',
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 2,
        marginBottom: 12,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
    },
    measurementValue: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    measurementUnit: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    additionalCard: {
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    additionalGradient: {
        padding: 20,
    },
    additionalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    additionalLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 6,
    },
    additionalProgress: {
        width: 120,
        height: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    additionalProgressFill: {
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
    },
    additionalValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    infoCard: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    infoGradient: {
        padding: 20,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 20,
    },
    bottomSpacer: {
        height: 100,
    },
    actionButtons: {
        paddingHorizontal: 24,
        paddingBottom: Platform.OS === 'ios' ? 20 : 30,
        paddingTop: 16,
    },
    saveButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    saveGradient: {
        paddingVertical: 18,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#7B2CBF',
    },
    buttonsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    secondaryButton: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    secondaryGradient: {
        paddingVertical: 18,
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    primaryButton: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    primaryGradient: {
        paddingVertical: 18,
        alignItems: 'center',
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#7B2CBF',
    },
});