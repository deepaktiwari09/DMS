import React from 'react';
import { LandingPage } from '../pages/landing/LandingPage';
import { useAppNavigation } from '../hooks/useNavigation';

export function LandingRoute() {
  const { goToAuth } = useAppNavigation();

  const handleExploreModules = () => {
    const modulesSection = document.getElementById('modules');
    modulesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleChoosePlan = (planId: string) => {
    console.log('Plan chosen:', planId);
    goToAuth();
  };

  const handleContactSales = () => {
    // TODO: Implement proper contact sales modal/page
    alert('Contact sales functionality would be implemented here');
  };

  const handlePrivacy = () => {
    // TODO: Implement proper privacy policy modal/page
    alert('Privacy policy would be shown here');
  };

  const handleTerms = () => {
    // TODO: Implement proper terms of service modal/page
    alert('Terms of service would be shown here');
  };

  const handleContact = () => {
    // TODO: Implement proper contact page
    alert('Contact page would be shown here');
  };

  return (
    <LandingPage
      onLoginClick={goToAuth}
      onRegisterClick={goToAuth}
      onDemoClick={goToAuth}
      onExploreModulesClick={handleExploreModules}
      onChoosePlan={handleChoosePlan}
      onContactSales={handleContactSales}
      onGetStartedClick={goToAuth}
      onPrivacyClick={handlePrivacy}
      onTermsClick={handleTerms}
      onContactClick={handleContact}
    />
  );
}