import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'react-native-blur';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
}

interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe: (planId: string) => Promise<void>;
  loading: boolean;
}

const plans: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 9.99,
    period: 'month',
    features: [
      'Unlimited podcast access',
      'All 6 categories',
      'Bilingual content (EN/TR)',
      'Daily new content',
      'Offline downloads',
      'Premium audio quality',
    ],
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 99.99,
    period: 'year',
    features: [
      'Unlimited podcast access',
      'All 6 categories',
      'Bilingual content (EN/TR)',
      'Daily new content',
      'Offline downloads',
      'Premium audio quality',
      'Save 17% vs monthly',
    ],
    popular: true,
  },
];

export default function SubscriptionModal({
  visible,
  onClose,
  onSubscribe,
  loading,
}: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('yearly');

  const handleSubscribe = async () => {
    try {
      await onSubscribe(selectedPlan);
      onClose();
    } catch (error) {
      Alert.alert(
        'Subscription Error',
        error instanceof Error ? error.message : 'Failed to subscribe'
      );
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const getSavings = (plan: SubscriptionPlan) => {
    if (plan.id === 'yearly') {
      const monthlyCost = 9.99 * 12;
      const yearlyCost = 99.99;
      const savings = monthlyCost - yearlyCost;
      return `Save $${savings.toFixed(2)}`;
    }
    return null;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={['#000000', '#1a1a1a']}
        style={styles.container}
      >
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Upgrade to Premium</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>Unlock Premium Features</Text>
            <Text style={styles.heroSubtitle}>
              Get unlimited access to AI-generated podcasts in all categories
            </Text>
          </View>

          {/* Plans */}
          <View style={styles.plansSection}>
            {plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && styles.planCardSelected,
                  plan.popular && styles.planCardPopular,
                ]}
                onPress={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
                  </View>
                )}

                <BlurView
                  style={styles.planContent}
                  blurType="dark"
                  blurAmount={10}
                >
                  <View style={styles.planHeader}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <View style={styles.planPrice}>
                      <Text style={styles.planPriceAmount}>
                        {formatPrice(plan.price)}
                      </Text>
                      <Text style={styles.planPricePeriod}>
                        /{plan.period}
                      </Text>
                    </View>
                    {getSavings(plan) && (
                      <Text style={styles.planSavings}>
                        {getSavings(plan)}
                      </Text>
                    )}
                  </View>

                  <View style={styles.planFeatures}>
                    {plan.features.map((feature, index) => (
                      <View key={index} style={styles.featureItem}>
                        <Text style={styles.featureIcon}>✓</Text>
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>

          {/* Benefits */}
          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsTitle}>Why Choose LurkingPods?</Text>
            
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🤖</Text>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>AI-Generated Content</Text>
                <Text style={styles.benefitDescription}>
                  Fresh, engaging podcasts created daily by advanced AI
                </Text>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🌍</Text>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Bilingual Support</Text>
                <Text style={styles.benefitDescription}>
                  Content available in both English and Turkish
                </Text>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>📱</Text>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Mobile Optimized</Text>
                <Text style={styles.benefitDescription}>
                  Perfect listening experience on your mobile device
                </Text>
              </View>
            </View>
          </View>

          {/* Subscribe Button */}
          <TouchableOpacity
            style={[styles.subscribeButton, loading && styles.subscribeButtonDisabled]}
            onPress={handleSubscribe}
            disabled={loading}
          >
            <LinearGradient
              colors={['#AE8EFF', '#8B5CF6']}
              style={styles.subscribeButtonGradient}
            >
              <Text style={styles.subscribeButtonText}>
                {loading ? 'Processing...' : 'Start Premium Subscription'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Terms */}
          <View style={styles.termsSection}>
            <Text style={styles.termsText}>
              By subscribing, you agree to our Terms of Service and Privacy Policy.
              Subscription automatically renews unless cancelled.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 30,
  },
  heroSection: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 22,
  },
  plansSection: {
    padding: 20,
    paddingTop: 0,
  },
  planCard: {
    marginBottom: 15,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#AE8EFF',
  },
  planCardPopular: {
    borderColor: '#FFD700',
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFD700',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderBottomLeftRadius: 15,
    zIndex: 1,
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  planContent: {
    padding: 20,
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  planPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 5,
  },
  planPriceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#AE8EFF',
  },
  planPricePeriod: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.7,
    marginLeft: 5,
  },
  planSavings: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  planFeatures: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureIcon: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  benefitsSection: {
    padding: 20,
    paddingTop: 0,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
  },
  benefitIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    lineHeight: 18,
  },
  subscribeButton: {
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },
  subscribeButtonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  termsSection: {
    padding: 20,
    paddingTop: 0,
  },
  termsText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 16,
  },
});
