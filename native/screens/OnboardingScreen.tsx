import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChevronRight, ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../../App';

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

interface OnboardingScreenProps {
  navigation: OnboardingScreenNavigationProp;
  onComplete: () => void;
}

const { width } = Dimensions.get('window');

const steps = [
  {
    title: 'Social Media Reconstructed 🎨',
    description: 'Welcome to Quilts - where your friends create your story, not you. Instead of "one to many" broadcasting, this is "many to one" connection.',
  },
  {
    title: 'A Different Approach',
    description: 'You can\'t post to your own board - only your friends can. Your profile becomes a collection of how the people who matter most see you and your shared experiences.',
  },
  {
    title: 'Friends Create Your Story',
    description: 'Your friends appear in a circle around you. Tap any friend to view their board and contribute to their story by posting photos.',
  },
  {
    title: 'Share Real Moments',
    description: 'Upload photos to your friends\' boards - not highlight reels, but genuine memories from real-world connections.',
  },
  {
    title: 'You\'re All Set! ✨',
    description: 'Start creating authentic connections by sharing photos to your friends\' boards. Let them shape how you\'re seen.',
  },
];

export default function OnboardingScreen({ navigation, onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  const step = steps[currentStep];

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
      navigation.replace('Home');
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#eff6ff', '#f9fafb']}
        style={styles.gradient}
      >
        {/* Skip button */}
        {!isLastStep && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.description}>{step.description}</Text>
          </View>

          {/* Progress indicators */}
          <View style={styles.progressContainer}>
            {steps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index === currentStep && styles.progressDotActive,
                  index < currentStep && styles.progressDotCompleted,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Navigation */}
        <View style={styles.navigation}>
          {!isFirstStep && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handlePrevious}
            >
              <ChevronLeft size={20} color="#6b7280" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          )}

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#3b82f6', '#8b5cf6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.nextGradient}
            >
              <Text style={styles.nextText}>
                {isLastStep ? 'Get Started' : 'Next'}
              </Text>
              {!isLastStep && <ChevronRight size={20} color="#fff" />}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  skipButton: {
    alignSelf: 'flex-end',
    padding: 16,
  },
  skipText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  textContainer: {
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#6b7280',
    lineHeight: 28,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
  },
  progressDotActive: {
    width: 24,
    backgroundColor: '#3b82f6',
  },
  progressDotCompleted: {
    backgroundColor: '#93c5fd',
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 4,
  },
  backText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  nextButton: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  nextGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 4,
  },
  nextText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
