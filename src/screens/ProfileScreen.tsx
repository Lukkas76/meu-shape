import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Alert,
    Switch,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProfileScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
    const [measurementCount, setMeasurementCount] = useState(0);
    const [firstMeasurementDate, setFirstMeasurementDate] = useState<string | null>(null);
    const [notifications, setNotifications] = useState(true);
    const [privacyMode, setPrivacyMode] = useState(false);

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        try {
            const historyData = await AsyncStorage.getItem('measurementHistory');
            if (historyData) {
                const history = JSON.parse(historyData);
                setMeasurementCount(history.length);

                if (history.length > 0) {
                    const firstDate = new Date(history[0].date);
                    setFirstMeasurementDate(
                        `${String(firstDate.getDate()).padStart(2, '0')}/${String(firstDate.getMonth() + 1).padStart(2, '0')}/${firstDate.getFullYear()}`
                    );
                }
            }

            const notifPref = await AsyncStorage.getItem('notifications');
            if (notifPref !== null) {
                setNotifications(JSON.parse(notifPref));
            }

            const privacyPref = await AsyncStorage.getItem('privacyMode');
            if (privacyPref !== null) {
                setPrivacyMode(JSON.parse(privacyPref));
            }
        } catch (error) {
            console.error('Erro ao carregar dados do perfil:', error);
        }
    };

    const toggleNotifications = async (value: boolean) => {
        setNotifications(value);
        await AsyncStorage.setItem('notifications', JSON.stringify(value));
    };

    const togglePrivacyMode = async (value: boolean) => {
        setPrivacyMode(value);
        await AsyncStorage.setItem('privacyMode', JSON.stringify(value));
    };

    const clearAllData = () => {
        Alert.alert(
            'Limpar todos os dados',
            'Isso irá apagar todo o histórico de medições. Esta ação não pode ser desfeita.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Limpar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('measurementHistory');
                            setMeasurementCount(0);
                            setFirstMeasurementDate(null);
                            Alert.alert('Sucesso', 'Todos os dados foram apagados.');
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível limpar os dados.');
                        }
                    },
                },
            ]
        );
    };

    const exportData = async () => {
        try {
            const historyData = await AsyncStorage.getItem('measurementHistory');
            if (historyData) {
                Alert.alert(
                    'Exportar dados',
                    'Seus dados foram preparados para exportação.',
                    [{ text: 'OK' }]
                );
            } else {
                Alert.alert('Aviso', 'Não há dados para exportar.');
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível exportar os dados.');
        }
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
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Perfil</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Stats Card */}
                    <View style={styles.statsCard}>
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.statsGradient}
                        >
                            <View style={styles.avatarContainer}>
                                <View style={styles.avatar}>
                                    <View style={styles.userIcon}>
                                        <View style={styles.userIconHead} />
                                        <View style={styles.userIconBody} />
                                    </View>
                                </View>
                            </View>

                            <View style={styles.statsRow}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{measurementCount}</Text>
                                    <Text style={styles.statLabel}>Análises</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>
                                        {firstMeasurementDate || '--/--/----'}
                                    </Text>
                                    <Text style={styles.statLabel}>Desde</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Configurações */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Configurações</Text>

                        <View style={styles.settingItem}>
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.settingGradient}
                            >
                                <View style={styles.settingContent}>
                                    <View style={styles.settingIcon}>
                                        <View style={styles.bellIcon}>
                                            <View style={styles.bellTop} />
                                            <View style={styles.bellBottom} />
                                        </View>
                                    </View>
                                    <View style={styles.settingText}>
                                        <Text style={styles.settingLabel}>Notificações</Text>
                                        <Text style={styles.settingDescription}>
                                            Receber lembretes para novas medições
                                        </Text>
                                    </View>
                                </View>
                                <Switch
                                    value={notifications}
                                    onValueChange={toggleNotifications}
                                    trackColor={{ false: 'rgba(255, 255, 255, 0.2)', true: '#FFFFFF' }}
                                    thumbColor={notifications ? '#7B2CBF' : '#FFFFFF'}
                                    ios_backgroundColor="rgba(255, 255, 255, 0.2)"
                                />
                            </LinearGradient>
                        </View>

                        <View style={styles.settingItem}>
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.settingGradient}
                            >
                                <View style={styles.settingContent}>
                                    <View style={styles.settingIcon}>
                                        <View style={styles.lockIcon}>
                                            <View style={styles.lockShackle} />
                                            <View style={styles.lockBody} />
                                        </View>
                                    </View>
                                    <View style={styles.settingText}>
                                        <Text style={styles.settingLabel}>Modo privado</Text>
                                        <Text style={styles.settingDescription}>
                                            Ocultar valores nas telas
                                        </Text>
                                    </View>
                                </View>
                                <Switch
                                    value={privacyMode}
                                    onValueChange={togglePrivacyMode}
                                    trackColor={{ false: 'rgba(255, 255, 255, 0.2)', true: '#FFFFFF' }}
                                    thumbColor={privacyMode ? '#7B2CBF' : '#FFFFFF'}
                                    ios_backgroundColor="rgba(255, 255, 255, 0.2)"
                                />
                            </LinearGradient>
                        </View>
                    </View>

                    {/* Dados */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Seus dados</Text>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={exportData}
                        >
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.menuGradient}
                            >
                                <View style={styles.menuIconContainer}>
                                    <View style={styles.uploadIcon}>
                                        <View style={styles.uploadArrow} />
                                        <View style={styles.uploadLine} />
                                    </View>
                                </View>
                                <View style={styles.menuContent}>
                                    <Text style={styles.menuLabel}>Exportar dados</Text>
                                    <Text style={styles.menuDescription}>
                                        Baixe suas medições em formato CSV
                                    </Text>
                                </View>
                                <Text style={styles.menuArrow}>›</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={clearAllData}
                        >
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.menuGradient}
                            >
                                <View style={styles.menuIconContainer}>
                                    <View style={styles.trashIcon}>
                                        <View style={styles.trashLid} />
                                        <View style={styles.trashBody} />
                                    </View>
                                </View>
                                <View style={styles.menuContent}>
                                    <Text style={[styles.menuLabel, styles.dangerText]}>
                                        Limpar todos os dados
                                    </Text>
                                    <Text style={styles.menuDescription}>
                                        Apagar todo o histórico permanentemente
                                    </Text>
                                </View>
                                <Text style={styles.menuArrow}>›</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Sobre */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Sobre</Text>

                        <TouchableOpacity style={styles.menuItem}>
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.menuGradient}
                            >
                                <View style={styles.menuIconContainer}>
                                    <View style={styles.infoIcon}>
                                        <View style={styles.infoDot} />
                                        <View style={styles.infoLine} />
                                    </View>
                                </View>
                                <View style={styles.menuContent}>
                                    <Text style={styles.menuLabel}>Como funciona</Text>
                                    <Text style={styles.menuDescription}>
                                        Saiba mais sobre a análise com IA
                                    </Text>
                                </View>
                                <Text style={styles.menuArrow}>›</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem}>
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.menuGradient}
                            >
                                <View style={styles.menuIconContainer}>
                                    <View style={styles.shieldIcon}>
                                        <View style={styles.shieldBody} />
                                        <View style={styles.shieldCheck} />
                                    </View>
                                </View>
                                <View style={styles.menuContent}>
                                    <Text style={styles.menuLabel}>Privacidade</Text>
                                    <Text style={styles.menuDescription}>
                                        Política de privacidade
                                    </Text>
                                </View>
                                <Text style={styles.menuArrow}>›</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem}>
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.menuGradient}
                            >
                                <View style={styles.menuIconContainer}>
                                    <View style={styles.documentIcon}>
                                        <View style={styles.documentBody} />
                                        <View style={styles.documentLines}>
                                            <View style={styles.documentLine} />
                                            <View style={styles.documentLine} />
                                            <View style={styles.documentLine} />
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.menuContent}>
                                    <Text style={styles.menuLabel}>Termos de uso</Text>
                                    <Text style={styles.menuDescription}>
                                        Leia os termos e condições
                                    </Text>
                                </View>
                                <Text style={styles.menuArrow}>›</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Version */}
                    <View style={styles.versionContainer}>
                        <Text style={styles.versionText}>Meu Shape v1.0.0</Text>
                        <Text style={styles.versionSubtext}>
                            Feito com 💜 para sua evolução
                        </Text>
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
    statsCard: {
        borderRadius: 24,
        marginBottom: 32,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    statsGradient: {
        padding: 24,
        alignItems: 'center',
    },
    avatarContainer: {
        marginBottom: 20,
    },
    avatar: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },

    // Ícone de Usuário
    userIcon: {
        alignItems: 'center',
    },
    userIconHead: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        marginBottom: 4,
    },
    userIconBody: {
        width: 36,
        height: 20,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        backgroundColor: '#FFFFFF',
    },

    statsRow: {
        flexDirection: 'row',
        width: '100%',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    settingItem: {
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    settingGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    settingContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    settingIcon: {
        width: 48,
        height: 48,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },

    // Ícone de Sino
    bellIcon: {
        alignItems: 'center',
    },
    bellTop: {
        width: 18,
        height: 16,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        borderTopLeftRadius: 9,
        borderTopRightRadius: 9,
        borderBottomWidth: 0,
    },
    bellBottom: {
        width: 6,
        height: 4,
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
    },

    // Ícone de Cadeado
    lockIcon: {
        alignItems: 'center',
    },
    lockShackle: {
        width: 14,
        height: 10,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderBottomWidth: 0,
        marginBottom: -2,
    },
    lockBody: {
        width: 18,
        height: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
    },

    settingText: {
        flex: 1,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.7)',
    },
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
    menuIconContainer: {
        width: 48,
        height: 48,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },

    // Ícone de Upload
    uploadIcon: {
        alignItems: 'center',
    },
    uploadArrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderBottomWidth: 8,
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#FFFFFF',
        marginBottom: 2,
    },
    uploadLine: {
        width: 2,
        height: 10,
        backgroundColor: '#FFFFFF',
    },

    // Ícone de Lixeira
    trashIcon: {
        alignItems: 'center',
    },
    trashLid: {
        width: 16,
        height: 2,
        backgroundColor: '#FFFFFF',
        marginBottom: 2,
    },
    trashBody: {
        width: 14,
        height: 14,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        borderTopWidth: 0,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
    },

    // Ícone de Info
    infoIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoDot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: '#FFFFFF',
        marginBottom: 2,
    },
    infoLine: {
        width: 2,
        height: 8,
        backgroundColor: '#FFFFFF',
    },

    // Ícone de Escudo
    shieldIcon: {
        width: 18,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shieldBody: {
        position: 'absolute',
        width: 18,
        height: 20,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        borderTopLeftRadius: 9,
        borderTopRightRadius: 9,
        borderBottomLeftRadius: 9,
        borderBottomRightRadius: 9,
    },
    shieldCheck: {
        width: 6,
        height: 3,
        borderLeftWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#FFFFFF',
        transform: [{ rotate: '-45deg' }],
        marginTop: 2,
    },

    // Ícone de Documento
    documentIcon: {
        width: 16,
        height: 20,
        position: 'relative',
    },
    documentBody: {
        position: 'absolute',
        width: 16,
        height: 20,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        borderRadius: 2,
    },
    documentLines: {
        position: 'absolute',
        top: 6,
        left: 4,
        gap: 2,
    },
    documentLine: {
        width: 8,
        height: 2,
        backgroundColor: '#FFFFFF',
    },

    menuContent: {
        flex: 1,
    },
    menuLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    menuDescription: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    menuArrow: {
        fontSize: 24,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '300',
    },
    dangerText: {
        color: '#FB7185',
    },
    versionContainer: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    versionText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: 4,
    },
    versionSubtext: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    bottomSpacer: {
        height: 40,
    },
});