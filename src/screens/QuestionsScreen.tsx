import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Platform,
    TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

type QuestionsScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Questions'>;
};

type Gender = 'male' | 'female' | 'other' | null;
type Goal = 'weight_loss' | 'muscle_gain' | 'maintenance' | 'health' | null;
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | null;
type AgeRange = '18-24' | '25-34' | '35-44' | '45-54' | '55+' | null;

export default function QuestionsScreen({ navigation }: QuestionsScreenProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [gender, setGender] = useState<Gender>(null);
    const [goal, setGoal] = useState<Goal>(null);
    const [activityLevel, setActivityLevel] = useState<ActivityLevel>(null);
    const [ageRange, setAgeRange] = useState<AgeRange>(null);
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');

    const totalSteps = 6;

    const handleNext = async () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        } else {
            await saveAnswers();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const saveAnswers = async () => {
        try {
            const userData = {
                gender,
                goal,
                activityLevel,
                ageRange,
                height: height ? parseInt(height) : null,
                weight: weight ? parseFloat(weight) : null,
                completedAt: new Date().toISOString(),
            };

            await AsyncStorage.setItem('userProfile', JSON.stringify(userData));
            await AsyncStorage.setItem('questionsCompleted', 'true');

            navigation.replace('Onboarding');
        } catch (error) {
            console.error('Erro ao salvar respostas:', error);
        }
    };

    const canContinue = () => {
        switch (currentStep) {
            case 1:
                return gender !== null;
            case 2:
                return ageRange !== null;
            case 3:
                return goal !== null;
            case 4:
                return activityLevel !== null;
            case 5:
                return height.length > 0 && parseInt(height) >= 100 && parseInt(height) <= 250;
            case 6:
                return weight.length > 0 && parseFloat(weight) >= 30 && parseFloat(weight) <= 300;
            default:
                return false;
        }
    };

    const renderStepIndicator = () => (
        <View style={styles.stepIndicator}>
            {[1, 2, 3, 4, 5, 6].map((step) => (
                <View
                    key={step}
                    style={[
                        styles.stepDot,
                        currentStep === step && styles.stepDotActive,
                        currentStep > step && styles.stepDotCompleted,
                    ]}
                />
            ))}
        </View>
    );

    const renderQuestion1 = () => (
        <View style={styles.questionContainer}>
            <Text style={styles.questionNumber}>1 de 6</Text>
            <Text style={styles.questionTitle}>Qual seu gênero?</Text>
            <Text style={styles.questionSubtitle}>
                Isso nos ajuda a personalizar sua experiência
            </Text>

            <View style={styles.optionsContainer}>
                <TouchableOpacity
                    style={[styles.optionCard, gender === 'male' && styles.optionCardSelected]}
                    onPress={() => setGender('male')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={
                            gender === 'male'
                                ? ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']
                                : ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.optionGradient}
                    >
                        <View style={styles.optionIcon}>
                            <Text style={styles.optionEmoji}>👨</Text>
                        </View>
                        <Text style={styles.optionText}>Masculino</Text>
                        {gender === 'male' && <View style={styles.checkmark} />}
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.optionCard, gender === 'female' && styles.optionCardSelected]}
                    onPress={() => setGender('female')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={
                            gender === 'female'
                                ? ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']
                                : ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.optionGradient}
                    >
                        <View style={styles.optionIcon}>
                            <Text style={styles.optionEmoji}>👩</Text>
                        </View>
                        <Text style={styles.optionText}>Feminino</Text>
                        {gender === 'female' && <View style={styles.checkmark} />}
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.optionCard, gender === 'other' && styles.optionCardSelected]}
                    onPress={() => setGender('other')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={
                            gender === 'other'
                                ? ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']
                                : ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.optionGradient}
                    >
                        <View style={styles.optionIcon}>
                            <Text style={styles.optionEmoji}>🧑</Text>
                        </View>
                        <Text style={styles.optionText}>Prefiro não informar</Text>
                        {gender === 'other' && <View style={styles.checkmark} />}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderQuestion2 = () => (
        <View style={styles.questionContainer}>
            <Text style={styles.questionNumber}>2 de 6</Text>
            <Text style={styles.questionTitle}>Qual sua faixa etária?</Text>
            <Text style={styles.questionSubtitle}>
                Vamos ajustar as recomendações para sua idade
            </Text>

            <View style={styles.optionsContainer}>
                <TouchableOpacity
                    style={[styles.optionCardHorizontal, ageRange === '18-24' && styles.optionCardSelected]}
                    onPress={() => setAgeRange('18-24')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={
                            ageRange === '18-24'
                                ? ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']
                                : ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.optionHorizontalGradient}
                    >
                        <Text style={styles.ageText}>18 - 24 anos</Text>
                        {ageRange === '18-24' && <View style={styles.checkmark} />}
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.optionCardHorizontal, ageRange === '25-34' && styles.optionCardSelected]}
                    onPress={() => setAgeRange('25-34')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={
                            ageRange === '25-34'
                                ? ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']
                                : ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.optionHorizontalGradient}
                    >
                        <Text style={styles.ageText}>25 - 34 anos</Text>
                        {ageRange === '25-34' && <View style={styles.checkmark} />}
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.optionCardHorizontal, ageRange === '35-44' && styles.optionCardSelected]}
                    onPress={() => setAgeRange('35-44')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={
                            ageRange === '35-44'
                                ? ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']
                                : ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.optionHorizontalGradient}
                    >
                        <Text style={styles.ageText}>35 - 44 anos</Text>
                        {ageRange === '35-44' && <View style={styles.checkmark} />}
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.optionCardHorizontal, ageRange === '45-54' && styles.optionCardSelected]}
                    onPress={() => setAgeRange('45-54')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={
                            ageRange === '45-54'
                                ? ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']
                                : ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.optionHorizontalGradient}
                    >
                        <Text style={styles.ageText}>45 - 54 anos</Text>
                        {ageRange === '45-54' && <View style={styles.checkmark} />}
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.optionCardHorizontal, ageRange === '55+' && styles.optionCardSelected]}
                    onPress={() => setAgeRange('55+')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={
                            ageRange === '55+'
                                ? ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']
                                : ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.optionHorizontalGradient}
                    >
                        <Text style={styles.ageText}>55+ anos</Text>
                        {ageRange === '55+' && <View style={styles.checkmark} />}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderQuestion3 = () => (
        <View style={styles.questionContainer}>
            <Text style={styles.questionNumber}>3 de 6</Text>
            <Text style={styles.questionTitle}>Qual seu objetivo?</Text>
            <Text style={styles.questionSubtitle}>
                Vamos personalizar suas recomendações
            </Text>

            <View style={styles.optionsContainer}>
                <TouchableOpacity
                    style={[styles.optionCard, goal === 'weight_loss' && styles.optionCardSelected]}
                    onPress={() => setGoal('weight_loss')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={
                            goal === 'weight_loss'
                                ? ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']
                                : ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.optionGradient}
                    >
                        <View style={styles.optionIcon}>
                            <Text style={styles.optionEmoji}>📉</Text>
                        </View>
                        <Text style={styles.optionText}>Emagrecimento</Text>
                        {goal === 'weight_loss' && <View style={styles.checkmark} />}
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.optionCard, goal === 'muscle_gain' && styles.optionCardSelected]}
                    onPress={() => setGoal('muscle_gain')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={
                            goal === 'muscle_gain'
                                ? ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']
                                : ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.optionGradient}
                    >
                        <View style={styles.optionIcon}>
                            <Text style={styles.optionEmoji}>💪</Text>
                        </View>
                        <Text style={styles.optionText}>Ganho de massa</Text>
                        {goal === 'muscle_gain' && <View style={styles.checkmark} />}
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.optionCard, goal === 'maintenance' && styles.optionCardSelected]}
                    onPress={() => setGoal('maintenance')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={
                            goal === 'maintenance'
                                ? ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']
                                : ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.optionGradient}
                    >
                        <View style={styles.optionIcon}>
                            <Text style={styles.optionEmoji}>⚖️</Text>
                        </View>
                        <Text style={styles.optionText}>Manutenção</Text>
                        {goal === 'maintenance' && <View style={styles.checkmark} />}
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.optionCard, goal === 'health' && styles.optionCardSelected]}
                    onPress={() => setGoal('health')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={
                            goal === 'health'
                                ? ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']
                                : ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.optionGradient}
                    >
                        <View style={styles.optionIcon}>
                            <Text style={styles.optionEmoji}>❤️</Text>
                        </View>
                        <Text style={styles.optionText}>Saúde geral</Text>
                        {goal === 'health' && <View style={styles.checkmark} />}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderQuestion4 = () => (
        <View style={styles.questionContainer}>
            <Text style={styles.questionNumber}>4 de 6</Text>
            <Text style={styles.questionTitle}>Nível de atividade física</Text>
            <Text style={styles.questionSubtitle}>
                Como você descreveria sua rotina?
            </Text>

            <View style={styles.optionsContainer}>
                <TouchableOpacity
                    style={[styles.optionCardHorizontal, activityLevel === 'sedentary' && styles.optionCardSelected]}
                    onPress={() => setActivityLevel('sedentary')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={
                            activityLevel === 'sedentary'
                                ? ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']
                                : ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.optionHorizontalGradient}
                    >
                        <View>
                            <Text style={styles.activityTitle}>Sedentário</Text>
                            <Text style={styles.activityDesc}>Pouco ou nenhum exercício</Text>
                        </View>
                        {activityLevel === 'sedentary' && <View style={styles.checkmark} />}
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.optionCardHorizontal, activityLevel === 'light' && styles.optionCardSelected]}
                    onPress={() => setActivityLevel('light')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={
                            activityLevel === 'light'
                                ? ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']
                                : ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.optionHorizontalGradient}
                    >
                        <View>
                            <Text style={styles.activityTitle}>Levemente ativo</Text>
                            <Text style={styles.activityDesc}>Exercício 1-3x por semana</Text>
                        </View>
                        {activityLevel === 'light' && <View style={styles.checkmark} />}
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.optionCardHorizontal, activityLevel === 'moderate' && styles.optionCardSelected]}
                    onPress={() => setActivityLevel('moderate')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={
                            activityLevel === 'moderate'
                                ? ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']
                                : ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.optionHorizontalGradient}
                    >
                        <View>
                            <Text style={styles.activityTitle}>Moderadamente ativo</Text>
                            <Text style={styles.activityDesc}>Exercício 3-5x por semana</Text>
                        </View>
                        {activityLevel === 'moderate' && <View style={styles.checkmark} />}
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.optionCardHorizontal, activityLevel === 'active' && styles.optionCardSelected]}
                    onPress={() => setActivityLevel('active')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={
                            activityLevel === 'active'
                                ? ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']
                                : ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.optionHorizontalGradient}
                    >
                        <View>
                            <Text style={styles.activityTitle}>Muito ativo</Text>
                            <Text style={styles.activityDesc}>Exercício 6-7x por semana</Text>
                        </View>
                        {activityLevel === 'active' && <View style={styles.checkmark} />}
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.optionCardHorizontal, activityLevel === 'very_active' && styles.optionCardSelected]}
                    onPress={() => setActivityLevel('very_active')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={
                            activityLevel === 'very_active'
                                ? ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']
                                : ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.optionHorizontalGradient}
                    >
                        <View>
                            <Text style={styles.activityTitle}>Extremamente ativo</Text>
                            <Text style={styles.activityDesc}>Atleta ou treino intenso diário</Text>
                        </View>
                        {activityLevel === 'very_active' && <View style={styles.checkmark} />}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderQuestion5 = () => (
        <View style={styles.questionContainer}>
            <Text style={styles.questionNumber}>5 de 6</Text>
            <Text style={styles.questionTitle}>Qual sua altura?</Text>
            <Text style={styles.questionSubtitle}>
                Informação importante para cálculos precisos
            </Text>

            <View style={styles.inputContainer}>
                <LinearGradient
                    colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.inputGradient}
                >
                    <TextInput
                        style={styles.input}
                        value={height}
                        onChangeText={setHeight}
                        placeholder="170"
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        keyboardType="numeric"
                        maxLength={3}
                    />
                    <Text style={styles.inputUnit}>cm</Text>
                </LinearGradient>
            </View>

            <Text style={styles.inputHint}>Entre 100 e 250 cm</Text>
        </View>
    );

    const renderQuestion6 = () => (
        <View style={styles.questionContainer}>
            <Text style={styles.questionNumber}>6 de 6</Text>
            <Text style={styles.questionTitle}>Qual seu peso atual?</Text>
            <Text style={styles.questionSubtitle}>
                Última pergunta! Vamos começar sua jornada
            </Text>

            <View style={styles.inputContainer}>
                <LinearGradient
                    colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.inputGradient}
                >
                    <TextInput
                        style={styles.input}
                        value={weight}
                        onChangeText={setWeight}
                        placeholder="70.5"
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        keyboardType="decimal-pad"
                        maxLength={5}
                    />
                    <Text style={styles.inputUnit}>kg</Text>
                </LinearGradient>
            </View>

            <Text style={styles.inputHint}>Entre 30 e 300 kg</Text>
        </View>
    );

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
                    {currentStep > 1 && (
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <Text style={styles.backButtonText}>←</Text>
                        </TouchableOpacity>
                    )}
                    <View style={styles.headerSpacer} />
                </View>

                {renderStepIndicator()}

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {currentStep === 1 && renderQuestion1()}
                    {currentStep === 2 && renderQuestion2()}
                    {currentStep === 3 && renderQuestion3()}
                    {currentStep === 4 && renderQuestion4()}
                    {currentStep === 5 && renderQuestion5()}
                    {currentStep === 6 && renderQuestion6()}
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.continueButton, !canContinue() && styles.continueButtonDisabled]}
                        onPress={handleNext}
                        disabled={!canContinue()}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={canContinue() ? ['#FFFFFF', '#F0F0F0'] : ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.2)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.continueGradient}
                        >
                            <Text style={[styles.continueText, !canContinue() && styles.continueTextDisabled]}>
                                {currentStep === totalSteps ? 'Finalizar' : 'Continuar'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 10 : 30,
        paddingBottom: 20,
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
    headerSpacer: {
        flex: 1,
    },
    stepIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 24,
        marginBottom: 40,
    },
    stepDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    stepDotActive: {
        backgroundColor: '#FFFFFF',
        width: 32,
    },
    stepDotCompleted: {
        backgroundColor: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
    },
    questionContainer: {
        marginBottom: 40,
    },
    questionNumber: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    questionTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    questionSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 32,
        lineHeight: 24,
    },
    optionsContainer: {
        gap: 12,
    },
    optionCard: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    optionCardSelected: {
        borderColor: '#FFFFFF',
        borderWidth: 2,
    },
    optionGradient: {
        padding: 24,
        alignItems: 'center',
    },
    optionIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    optionEmoji: {
        fontSize: 32,
    },
    optionText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    checkmark: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
    },
    optionCardHorizontal: {
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    optionHorizontalGradient: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    activityTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    activityDesc: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    ageText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    inputContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        marginBottom: 12,
    },
    inputGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    input: {
        flex: 1,
        fontSize: 48,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    inputUnit: {
        fontSize: 24,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.6)',
        marginLeft: 12,
    },
    inputHint: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: Platform.OS === 'ios' ? 20 : 30,
        paddingTop: 16,
    },
    continueButton: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    continueButtonDisabled: {
        opacity: 0.5,
    },
    continueGradient: {
        paddingVertical: 18,
        alignItems: 'center',
    },
    continueText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#7B2CBF',
    },
    continueTextDisabled: {
        color: 'rgba(123, 44, 191, 0.5)',
    },
});