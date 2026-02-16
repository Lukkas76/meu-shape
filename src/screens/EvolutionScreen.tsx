import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

type EvolutionScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Evolution'>;
};

interface MeasurementEntry {
    id: number;
    date: string;
    chest: number;
    waist: number;
    hip: number;
    bodyFat: number;
    arm: number;
    leg: number;
    height: number;
}

type MetricType = 'chest' | 'waist' | 'hip' | 'bodyFat';

export default function EvolutionScreen({ navigation }: EvolutionScreenProps) {
    const [history, setHistory] = useState<MeasurementEntry[]>([]);
    const [selectedMetric, setSelectedMetric] = useState<MetricType>('chest');
    const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('month');

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const historyData = await AsyncStorage.getItem('measurementHistory');
            if (historyData) {
                const parsedHistory = JSON.parse(historyData);
                setHistory(parsedHistory);
            }
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
        }
    };

    const getMetricData = () => {
        if (history.length === 0) return { labels: [], data: [] };

        const filtered = filterByPeriod(history);
        const labels = filtered.map((entry) => {
            const date = new Date(entry.date);
            return `${date.getDate()}/${date.getMonth() + 1}`;
        });
        const data = filtered.map((entry) => entry[selectedMetric]);

        return { labels, data };
    };

    const filterByPeriod = (data: MeasurementEntry[]) => {
        const now = new Date();
        return data.filter((entry) => {
            const entryDate = new Date(entry.date);
            const diffDays = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));

            switch (selectedPeriod) {
                case 'week':
                    return diffDays <= 7;
                case 'month':
                    return diffDays <= 30;
                case 'all':
                default:
                    return true;
            }
        });
    };

    const getLatestEntry = (): MeasurementEntry | null => {
        if (history.length === 0) return null;
        return history[history.length - 1];
    };

    const getPreviousEntry = (): MeasurementEntry | null => {
        if (history.length < 2) return null;
        return history[history.length - 2];
    };

    const calculateChange = (metric: MetricType): number => {
        const latest = getLatestEntry();
        const previous = getPreviousEntry();

        if (!latest || !previous) return 0;

        return latest[metric] - previous[metric];
    };

    const formatChange = (change: number, metric: MetricType): string => {
        const prefix = change > 0 ? '+' : '';
        const suffix = metric === 'bodyFat' ? '%' : ' cm';
        return `${prefix}${change.toFixed(1)}${suffix}`;
    };

    const getMetricLabel = (metric: MetricType): string => {
        const labels = {
            chest: 'Peito',
            waist: 'Cintura',
            hip: 'Quadril',
            bodyFat: 'Gordura',
        };
        return labels[metric];
    };

    const chartData = getMetricData();
    const latestEntry = getLatestEntry();

    if (history.length === 0) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={['#7B2CBF', '#5A67D8', '#3B82F6', '#06B6D4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                />
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.backButtonText}>←</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Evolução</Text>
                        <View style={styles.placeholder} />
                    </View>

                    <View style={styles.emptyState}>
                        <View style={styles.emptyIcon}>
                            <Text style={styles.emptyEmoji}>📊</Text>
                        </View>
                        <Text style={styles.emptyTitle}>Nenhuma medição</Text>
                        <Text style={styles.emptyText}>
                            Comece a registrar suas medidas para acompanhar sua evolução
                        </Text>
                        <TouchableOpacity
                            style={styles.emptyButton}
                            onPress={() => navigation.navigate('Home')}
                        >
                            <Text style={styles.emptyButtonText}>Fazer primeira análise</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#7B2CBF', '#5A67D8', '#3B82F6', '#06B6D4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Evolução</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Period Selector */}
                    <View style={styles.periodSelector}>
                        {(['week', 'month', 'all'] as const).map((period) => (
                            <TouchableOpacity
                                key={period}
                                style={styles.periodButton}
                                onPress={() => setSelectedPeriod(period)}
                            >
                                <LinearGradient
                                    colors={
                                        selectedPeriod === period
                                            ? ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.2)']
                                            : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']
                                    }
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.periodGradient}
                                >
                                    <Text
                                        style={[
                                            styles.periodButtonText,
                                            selectedPeriod === period && styles.periodButtonTextActive,
                                        ]}
                                    >
                                        {period === 'week' ? '7 dias' : period === 'month' ? '1 mês' : 'Tudo'}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Current Stats */}
                    {latestEntry && (
                        <View style={styles.statsGrid}>
                            {(['chest', 'waist', 'hip', 'bodyFat'] as MetricType[]).map((metric) => {
                                const change = calculateChange(metric);
                                const isSelected = selectedMetric === metric;
                                return (
                                    <TouchableOpacity
                                        key={metric}
                                        style={styles.statCard}
                                        onPress={() => setSelectedMetric(metric)}
                                    >
                                        <LinearGradient
                                            colors={
                                                isSelected
                                                    ? ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']
                                                    : ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.08)']
                                            }
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={[
                                                styles.statGradient,
                                                isSelected && styles.statGradientActive
                                            ]}
                                        >
                                            <Text style={styles.statLabel}>{getMetricLabel(metric)}</Text>
                                            <Text style={styles.statValue}>
                                                {latestEntry[metric]}
                                                {metric === 'bodyFat' ? '%' : ''}
                                            </Text>
                                            <Text style={styles.statUnit}>
                                                {metric === 'bodyFat' ? 'gordura' : 'centímetros'}
                                            </Text>
                                            {history.length > 1 && (
                                                <Text
                                                    style={[
                                                        styles.statChange,
                                                        change < 0 && styles.statChangeNegative,
                                                    ]}
                                                >
                                                    {formatChange(change, metric)}
                                                </Text>
                                            )}
                                        </LinearGradient>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}

                    {/* Chart */}
                    {chartData.data.length > 0 && (
                        <View style={styles.chartContainer}>
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.chartCard}
                            >
                                <Text style={styles.chartTitle}>
                                    {getMetricLabel(selectedMetric)}
                                </Text>
                                <LineChart
                                    data={{
                                        labels: chartData.labels,
                                        datasets: [{ data: chartData.data }],
                                    }}
                                    width={width - 72}
                                    height={200}
                                    chartConfig={{
                                        backgroundColor: 'transparent',
                                        backgroundGradientFrom: 'transparent',
                                        backgroundGradientTo: 'transparent',
                                        decimalPlaces: 1,
                                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.7})`,
                                        style: {
                                            borderRadius: 16,
                                        },
                                        propsForDots: {
                                            r: '5',
                                            strokeWidth: '2',
                                            stroke: '#FFFFFF',
                                            fill: '#FFFFFF',
                                        },
                                        propsForBackgroundLines: {
                                            stroke: 'rgba(255, 255, 255, 0.1)',
                                            strokeWidth: 1,
                                        },
                                    }}
                                    bezier
                                    style={styles.chart}
                                    withInnerLines={true}
                                    withOuterLines={false}
                                />
                            </LinearGradient>
                        </View>
                    )}

                    {/* History List */}
                    <View style={styles.historySection}>
                        <Text style={styles.sectionTitle}>Histórico</Text>
                        {history
                            .slice()
                            .reverse()
                            .map((entry) => {
                                const date = new Date(entry.date);
                                const formattedDate = `${date.getDate()}/${date.getMonth() + 1
                                    }/${date.getFullYear()}`;
                                const formattedTime = `${date.getHours()}:${String(
                                    date.getMinutes()
                                ).padStart(2, '0')}`;

                                return (
                                    <View key={entry.id} style={styles.historyItem}>
                                        <LinearGradient
                                            colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={styles.historyGradient}
                                        >
                                            <View style={styles.historyDate}>
                                                <Text style={styles.historyDateText}>{formattedDate}</Text>
                                                <Text style={styles.historyTimeText}>{formattedTime}</Text>
                                            </View>
                                            <View style={styles.historyValues}>
                                                <Text style={styles.historyValue}>
                                                    Peito: {entry.chest} cm
                                                </Text>
                                                <Text style={styles.historyValue}>
                                                    Cintura: {entry.waist} cm
                                                </Text>
                                            </View>
                                        </LinearGradient>
                                    </View>
                                );
                            })}
                    </View>

                    <View style={styles.bottomSpacer} />
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 10 : 30,
        paddingBottom: 24,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    backButtonText: {
        fontSize: 24,
        color: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    placeholder: {
        width: 44,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
    },
    periodSelector: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 24,
    },
    periodButton: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    periodGradient: {
        paddingVertical: 14,
        alignItems: 'center',
    },
    periodButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.7)',
    },
    periodButtonTextActive: {
        color: '#FFFFFF',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        minWidth: '47%',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    statGradient: {
        padding: 16,
        alignItems: 'center',
    },
    statGradientActive: {
        borderWidth: 2,
        borderColor: '#FFFFFF',
        borderRadius: 16,
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statValue: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    statUnit: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: 8,
    },
    statChange: {
        fontSize: 13,
        fontWeight: '700',
        color: '#4ADE80',
    },
    statChangeNegative: {
        color: '#FB7185',
    },
    chartContainer: {
        marginBottom: 24,
    },
    chartCard: {
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    chart: {
        marginLeft: -16,
    },
    historySection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    historyItem: {
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    historyGradient: {
        flexDirection: 'row',
        padding: 16,
    },
    historyDate: {
        marginRight: 16,
    },
    historyDateText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    historyTimeText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    historyValues: {
        flex: 1,
    },
    historyValue: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 4,
    },
    bottomSpacer: {
        height: 40,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIcon: {
        width: 100,
        height: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    emptyEmoji: {
        fontSize: 48,
    },
    emptyTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 12,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    emptyButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 32,
    },
    emptyButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#7B2CBF',
    },
});