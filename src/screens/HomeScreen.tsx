import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HomeScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

interface LastMeasurement {
    date: string;
    chest: number;
    waist: number;
    hip: number;
    bodyFat: number;
    arm: number;
    leg: number;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
    const [lastMeasurement, setLastMeasurement] = useState<LastMeasurement | null>(null);
    const [hasHistory, setHasHistory] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const historyData = await AsyncStorage.getItem('measurementHistory');
            if (historyData) {
                const history = JSON.parse(historyData);
                if (history.length > 0) {
                    setLastMeasurement(history[history.length - 1]);
                    setHasHistory(true);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    };

    const startNewAnalysis = () => {
        navigation.navigate('Camera', { photoType: 'front' });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hoje';
        if (diffDays === 1) return 'Ontem';
        if (diffDays < 7) return `${diffDays} dias atrás`;

        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short'
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#7B2CBF" />

            {/* Gradiente de fundo */}
            <LinearGradient
                colors={['#7B2CBF', '#5A67D8', '#3B82F6', '#06B6D4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            />

            <SafeAreaView style={styles.safeArea}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.appName}>Meu Shape</Text>
                        <Text style={styles.subtitle}>Análise corporal com IA</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.settingsBtn}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <View style={styles.settingsIcon}>
                            <View style={styles.settingsDot} />
                            <View style={styles.settingsDot} />
                            <View style={styles.settingsDot} />
                        </View>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Card Principal */}
                    <View style={styles.mainCard}>
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.cardGradient}
                        >
                            <Text style={styles.cardTitle}>
                                {hasHistory ? 'Nova análise' : 'Começar agora'}
                            </Text>
                            <Text style={styles.cardDescription}>
                                {hasHistory
                                    ? 'Atualize suas medidas corporais'
                                    : 'Descubra suas medidas com precisão de IA'}
                            </Text>

                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={startNewAnalysis}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#FFFFFF', '#F0F0F0']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.buttonGradient}
                                >
                                    <Text style={styles.startButtonText}>Iniciar análise</Text>
                                    <View style={styles.arrowCircle}>
                                        <Text style={styles.arrow}>→</Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>

                            <View style={styles.features}>
                                <View style={styles.feature}>
                                    <View style={styles.featureDot} />
                                    <Text style={styles.featureText}>3 fotos</Text>
                                </View>
                                <View style={styles.feature}>
                                    <View style={styles.featureDot} />
                                    <Text style={styles.featureText}>30 segundos</Text>
                                </View>
                                <View style={styles.feature}>
                                    <View style={styles.featureDot} />
                                    <Text style={styles.featureText}>100% privado</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Últimas Medidas */}
                    {hasHistory && lastMeasurement && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Suas medidas</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Evolution')}>
                                    <Text style={styles.seeAll}>Ver histórico</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.dateCard}>
                                <LinearGradient
                                    colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.dateCardGradient}
                                >
                                    <Text style={styles.dateLabel}>Última atualização</Text>
                                    <Text style={styles.dateValue}>{formatDate(lastMeasurement.date)}</Text>
                                </LinearGradient>
                            </View>

                            <View style={styles.metricsGrid}>
                                <View style={styles.metricBox}>
                                    <LinearGradient
                                        colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.metricGradient}
                                    >
                                        <Text style={styles.metricLabel}>Peito</Text>
                                        <Text style={styles.metricValue}>{lastMeasurement.chest}</Text>
                                        <Text style={styles.metricUnit}>cm</Text>
                                    </LinearGradient>
                                </View>

                                <View style={styles.metricBox}>
                                    <LinearGradient
                                        colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.metricGradient}
                                    >
                                        <Text style={styles.metricLabel}>Cintura</Text>
                                        <Text style={styles.metricValue}>{lastMeasurement.waist}</Text>
                                        <Text style={styles.metricUnit}>cm</Text>
                                    </LinearGradient>
                                </View>

                                <View style={styles.metricBox}>
                                    <LinearGradient
                                        colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.metricGradient}
                                    >
                                        <Text style={styles.metricLabel}>Quadril</Text>
                                        <Text style={styles.metricValue}>{lastMeasurement.hip}</Text>
                                        <Text style={styles.metricUnit}>cm</Text>
                                    </LinearGradient>
                                </View>

                                <View style={styles.metricBox}>
                                    <LinearGradient
                                        colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.metricGradient}
                                    >
                                        <Text style={styles.metricLabel}>Gordura</Text>
                                        <Text style={styles.metricValue}>{lastMeasurement.bodyFat}</Text>
                                        <Text style={styles.metricUnit}>%</Text>
                                    </LinearGradient>
                                </View>

                                <View style={styles.metricBox}>
                                    <LinearGradient
                                        colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.metricGradient}
                                    >
                                        <Text style={styles.metricLabel}>Braço</Text>
                                        <Text style={styles.metricValue}>{lastMeasurement.arm}</Text>
                                        <Text style={styles.metricUnit}>cm</Text>
                                    </LinearGradient>
                                </View>

                                <View style={styles.metricBox}>
                                    <LinearGradient
                                        colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.metricGradient}
                                    >
                                        <Text style={styles.metricLabel}>Perna</Text>
                                        <Text style={styles.metricValue}>{lastMeasurement.leg}</Text>
                                        <Text style={styles.metricUnit}>cm</Text>
                                    </LinearGradient>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Menu de Navegação */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Explorar</Text>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => hasHistory && navigation.navigate('Evolution')}
                            disabled={!hasHistory}
                        >
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[styles.menuGradient, !hasHistory && styles.menuItemDisabled]}
                            >
                                <View style={styles.menuIcon}>
                                    <View style={styles.chartIcon}>
                                        <View style={[styles.bar, { height: 8 }]} />
                                        <View style={[styles.bar, { height: 14 }]} />
                                        <View style={[styles.bar, { height: 10 }]} />
                                    </View>
                                </View>
                                <View style={styles.menuContent}>
                                    <Text style={styles.menuTitle}>Evolução</Text>
                                    <Text style={styles.menuDesc}>Acompanhe seu progresso</Text>
                                </View>
                                <Text style={styles.menuArrow}>›</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => navigation.navigate('Profile')}
                        >
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.menuGradient}
                            >
                                <View style={styles.menuIcon}>
                                    <View style={styles.userIcon} />
                                </View>
                                <View style={styles.menuContent}>
                                    <Text style={styles.menuTitle}>Perfil</Text>
                                    <Text style={styles.menuDesc}>Configurações e dados</Text>
                                </View>
                                <Text style={styles.menuArrow}>›</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.bottomSpace} />
                </ScrollView>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 10 : 30,
        paddingBottom: 24,
    },
    appName: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 2,
    },
    settingsBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    settingsIcon: {
        gap: 3,
    },
    settingsDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },

    // Card Principal
    mainCard: {
        borderRadius: 24,
        marginBottom: 32,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    cardGradient: {
        padding: 24,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconWrapper: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanLines: {
        gap: 4,
    },
    scanLine: {
        width: 24,
        height: 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 1,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    badgeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    cardTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    cardDescription: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 22,
        marginBottom: 24,
    },
    startButton: {
        borderRadius: 16,
        marginBottom: 20,
        overflow: 'hidden',
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 18,
    },
    startButtonText: {
        fontSize: 17,
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
    features: {
        flexDirection: 'row',
        gap: 16,
    },
    feature: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    featureDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    featureText: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.8)',
    },

    // Seção
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    seeAll: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },

    // Data Card
    dateCard: {
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    dateCardGradient: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    dateLabel: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    dateValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },

    // Métricas Grid
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    metricBox: {
        flex: 1,
        minWidth: '30%',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    metricGradient: {
        padding: 12,
        alignItems: 'center',
    },
    metricLabel: {
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    metricValue: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    metricUnit: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
    },

    // Menu
    menuItem: {
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    menuGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    menuItemDisabled: {
        opacity: 0.5,
    },
    menuIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    chartIcon: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 3,
    },
    bar: {
        width: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
    },
    userIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
    },
    menuContent: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    menuDesc: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    menuArrow: {
        fontSize: 24,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '300',
    },

    bottomSpace: {
        height: 40,
    },
});