/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Onboarding from './components/Onboarding';
import './i18n';

// Lazy load pages for better performance on mobile
const Home = lazy(() => import('./pages/Home'));
const DiseaseDetection = lazy(() => import('./pages/DiseaseDetection'));
const MandiPrices = lazy(() => import('./pages/MandiPrices'));
const GovSchemes = lazy(() => import('./pages/GovSchemes'));
const Profile = lazy(() => import('./pages/Profile'));
const Auth = lazy(() => import('./pages/Auth'));
const FertilizerCalc = lazy(() => import('./pages/FertilizerCalc'));
const ExpertChat = lazy(() => import('./pages/ExpertChat'));
const DirectChat = lazy(() => import('./pages/DirectChat'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const AgriInputs = lazy(() => import('./pages/AgriInputs'));

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isKissanLoggedIn') === 'true';
  });
  
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('hasSeenOnboarding') !== 'true';
  });

  const handleLogin = () => {
    localStorage.setItem('isKissanLoggedIn', 'true');
    setIsAuthenticated(true);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
        </div>
      }>
        <Routes>
          <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
          
          <Route element={<Layout />}>
            <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/auth" />} />
            <Route path="/disease-detection" element={isAuthenticated ? <DiseaseDetection /> : <Navigate to="/auth" />} />
            <Route path="/mandi-prices" element={isAuthenticated ? <MandiPrices /> : <Navigate to="/auth" />} />
            <Route path="/schemes" element={isAuthenticated ? <GovSchemes /> : <Navigate to="/auth" />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/auth" />} />
            <Route path="/fertilizer-calc" element={isAuthenticated ? <FertilizerCalc /> : <Navigate to="/auth" />} />
            <Route path="/expert-chat" element={isAuthenticated ? <ExpertChat /> : <Navigate to="/auth" />} />
            <Route path="/chat/:sellerId" element={isAuthenticated ? <DirectChat /> : <Navigate to="/auth" />} />
            <Route path="/marketplace" element={isAuthenticated ? <Marketplace /> : <Navigate to="/auth" />} />
            <Route path="/agri-inputs" element={isAuthenticated ? <AgriInputs /> : <Navigate to="/auth" />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}


