/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import OnboardingScreen from './components/OnboardingScreen';
import { supabase } from './supabase';
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, TrendingUp, Sparkles, Zap, Building2, Heart, ExternalLink, ArrowLeft, Download, Plus } from 'lucide-react';
import HomeTab from './components/HomeTab';
import LeadsTab from './components/LeadsTab';
import RoiTab from './components/RoiTab';
import CreativeTab from './components/CreativeTab';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import CreateCampaignScreen from './components/CreateCampaignScreen';
import LeadDetailScreen from './components/LeadDetailScreen';
import { BusinessProfile, Lead, LeadStatus } from './types';

function AppInner() {
  const navigate = useNavigate();
  const location = useLocation();

  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  // 1. Core Profile State
  const [profile, setProfile] = useState<BusinessProfile>({
    name: 'IDALS',
    type: 'Online Dance Education',
    city: 'Mumbai',
    language: 'English'
  });

  // 2. Pre-seeded India-focused Leads (synchronized with Leads tab specifications)
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 'L01',
      name: 'Priya Rajesh',
      phone: '+91 98451 22354',
      source: 'Instagram',
      status: 'Hot',
      productInterest: 'Hip-hop, Weekend, Mumbai',
      dateAdded: '2hr ago',
      notes: ''
    },
    {
      id: 'L02',
      name: 'Sneha K.',
      phone: '+91 91223 74652',
      source: 'Website',
      status: 'Hot',
      productInterest: 'Hip-hop, Weekend, Thane',
      dateAdded: '4hr ago',
      notes: ''
    },
    {
      id: 'L03',
      name: 'Amit M.',
      phone: '+91 97423 55812',
      source: 'Google Ads',
      status: 'Contacted',
      productInterest: 'Bollywood, Weekday, Pune',
      dateAdded: 'Follow up due',
      notes: ''
    },
    {
      id: 'L04',
      name: 'Rahul K.',
      phone: '+91 94235 63219',
      source: 'Instagram',
      status: 'Closed',
      productInterest: 'No response, 48 hours',
      dateAdded: 'Yesterday',
      notes: ''
    }
  ]);

  // Lead CRUD Operations
  const handleAddLead = (newLead: Lead) => {
    setLeads([newLead, ...leads]);
  };

  const handleUpdateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
  };

  const handleDeleteLead = (id: string) => {
    setLeads(leads.filter(l => l.id !== id));
  };

  // Helper values
  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.status === 'Hot').length;

  const currentPath = location.pathname;
  const isAuthRoute = currentPath === '/login' || currentPath === '/signup';
  const isOnboardingRoute = currentPath === '/onboarding';
  const isCreateCampaignRoute = currentPath === '/create-campaign';
  const isLeadDetailRoute = currentPath === '/lead-detail';

  useEffect(() => {
    if (!isLoggedIn && currentPath !== '/login' && currentPath !== '/signup') {
      navigate('/login');
    }
  }, [isLoggedIn, currentPath, navigate]);

  return (
    <div className="min-h-screen bg-[#E5E7EB] font-sans flex items-center justify-center p-0 md:p-6 select-none">
      {/* Outer viewport wrapper: aligns left on wide screens, holding the active smartphone model */}
      <div className="flex flex-row gap-8 items-stretch max-w-4xl w-full justify-center">
        
        {/* DESKTOP EXPLAINER SIDEBAR - Invisible on mobile, premium visual support on desktop */}
        <div className="hidden md:flex flex-col justify-between w-[320px] bg-white rounded-3xl p-6 border border-gray-100 shadow-xl self-center shrink-0 h-[640px]">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2 text-white rounded-xl">
                <Zap size={20} className="fill-white" />
              </div>
              <h1 className="text-base font-extrabold tracking-tight text-gray-900 font-display">
                GROWMATIC <span className="text-secondary text-[10px] block font-bold transition-all">AI MARKETING CO-PILOT</span>
              </h1>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              We have custom-designed this application with an elegant **mobile-first interface** suited for premium education and content providers.
            </p>

            <div className="border-t border-gray-50 pt-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase font-display tracking-wider">Features Included:</h3>
              <ul className="text-[11px] text-gray-500 space-y-2.5 mt-2.5">
                <li className="flex items-start gap-2">
                  <span className="text-secondary font-bold">✓</span>
                  <div>
                    <strong>Intelligent Home Dashboard:</strong> Get personalized recommendations, real-time campaign overview, and track hot customer pipelines.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary font-bold">✓</span>
                  <div>
                    <strong>CRM Pipeline:</strong> Manage students, organize inquiries, filter status pipelines, and trigger automated outreach.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary font-bold">✓</span>
                  <div>
                    <strong>Predictive Analytics:</strong> Monitor acquisition models and performance forecasts based on active marketing campaigns.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary font-bold">✓</span>
                  <div>
                    <strong>Creative Accelerator:</strong> Build professional copy templates tailored meticulously for advanced social channels.
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-[11px] text-gray-400 border-t border-gray-50 pt-3 flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <span>Made with React & Tailwind CSS</span>
            </div>
            <span>Optimized for Premium Visuals</span>
          </div>
        </div>

        {/* PHYSICAL SMARTPHONE CONTAINER MOCKUP */}
        <div className="w-full max-w-[390px] h-screen md:h-[680px] bg-warm-bg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col relative md:rounded-[36px] overflow-hidden md:border-[8px] md:border-slate-800 border-x border-gray-100 shrink-0 select-text">
          {/* Top Notch Area (Decorative - only shows up on desktop layout to look high quality) */}
          <div className="hidden md:block w-full h-5 bg-slate-900 shrink-0 relative">
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-28 h-3.5 bg-slate-850 rounded-full flex items-center justify-center gap-1 px-3">
              <div className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
              <div className="w-8 h-1 bg-slate-800 rounded-md" />
            </div>
          </div>

          {/* APP HEADER BAR */}
          {!isAuthRoute && !isOnboardingRoute && !isCreateCampaignRoute && !isLeadDetailRoute && (
            <header className="bg-white px-5 py-4 border-b border-[#F0F0EE] flex items-center justify-between shrink-0 shadow-[0_2px_4px_rgba(0,0,0,0.02)] z-20 font-sans">
              <div className="flex items-center gap-2">
                {currentPath === '/leads' ? (
                  <>
                    <button 
                      onClick={() => navigate('/')} 
                      className="text-gray-500 hover:text-gray-800 transition-all cursor-pointer flex items-center pr-1"
                    >
                      <ArrowLeft size={20} strokeWidth={2.5} />
                    </button>
                    <span className="text-xl font-bold text-gray-800 tracking-tight font-display">
                      Lead Inbox
                    </span>
                  </>
                ) : currentPath === '/roi' ? (
                  <>
                    <div className="text-primary">
                      <Zap size={22} className="fill-primary" strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-bold text-gray-800 tracking-tight font-display">
                      ROI Dashboard
                    </span>
                  </>
                ) : currentPath === '/creative' ? (
                  <>
                    <div className="text-primary">
                      <Zap size={22} className="fill-primary" strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-bold text-gray-800 tracking-tight font-display">
                      Creative Library
                    </span>
                  </>
                ) : (
                  <>
                    <div className="text-primary">
                      <Zap size={22} className="fill-primary" strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-bold text-gray-800 tracking-tight font-display">
                      Growmatic
                    </span>
                  </>
                )}
              </div>

              {/* Header Right Element */}
              <div className="flex items-center">
                {currentPath === '/roi' ? (
                  <button 
                    onClick={() => alert('Report download initiated!')}
                    className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-gray-200 text-gray-600 rounded-lg transition-all cursor-pointer shadow-2xs"
                    title="Download PDF Report"
                  >
                    <Download size={16} strokeWidth={2.5} />
                  </button>
                ) : currentPath === '/creative' ? (
                  <button 
                    onClick={() => {
                      const event = new CustomEvent('show-create-creative-modal');
                      window.dispatchEvent(event);
                    }}
                    className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-gray-200 text-gray-600 rounded-lg transition-all cursor-pointer shadow-2xs"
                    title="Add Creative"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </button>
                ) : (
                <div className="relative group">
                  <div className="h-8 w-8 rounded-full bg-[#E5E7EB] border border-gray-200 overflow-hidden flex items-center justify-center text-[11px] font-bold text-gray-700 shadow-xs shrink-0 font-display cursor-pointer">
                    {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'ID'}
                  </div>
                  <div className="absolute right-0 top-9 bg-white border border-gray-200 rounded-xl shadow-lg p-1 hidden group-hover:block z-50 w-32">
                    <button
                      onClick={async () => {
                        await supabase.auth.signOut();
                        setIsLoggedIn(false);
                        navigate('/login');
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
              </div>
            </header>
          )}

          {/* MAIN APP CONTENT - SCROLLABLE COMPONENT VIEWER */}
          <main className={`flex-1 overflow-y-auto no-scrollbar bg-warm-bg ${(isAuthRoute || isCreateCampaignRoute || isLeadDetailRoute) ? 'p-0' : 'p-4'}`}>
            <Routes>
              <Route
                path="/onboarding"
                element={
                  <OnboardingScreen
                    userId={currentUserId}
                    businessName={profile.name}
                    onComplete={() => {
                      setShowOnboarding(false);
                      navigate('/');
                    }}
                  />
                }
              />
              <Route 
                path="/lead-detail" 
                element={
                  <LeadDetailScreen />
                } 
              />
              <Route 
                path="/create-campaign" 
                element={
                  <CreateCampaignScreen />
                } 
              />
              <Route 
                path="/login" 
                element={
                  <LoginScreen 
                    onLoginSuccess={() => {
                      setIsLoggedIn(true);
                      navigate('/');
                    }} 
                    onNavigateToSignup={() => navigate('/signup')} 
                  />
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <SignupScreen 
                    onSignupSuccess={async (details) => {
                      setProfile({
                        name: details.businessName,
                        type: details.businessType,
                        city: 'Mumbai',
                        language: 'English'
                      });

                      // Check if onboarding already complete
                      const { data: { user } } = await supabase.auth.getUser();
                      if (user) {
                        setCurrentUserId(user.id);
                        const { data: userData } = await supabase
                          .from('users')
                          .select('onboarding_complete')
                          .eq('id', user.id)
                          .single();

                        if (userData?.onboarding_complete) {
                          setIsLoggedIn(true);
                          navigate('/');
                        } else {
                          setShowOnboarding(true);
                          setIsLoggedIn(true);
                          navigate('/onboarding');
                        }
                      }
                    }} 
                    onNavigateToLogin={() => navigate('/login')} 
                  />
                } 
              />
              <Route 
                path="/" 
                element={
                  <HomeTab 
                    profile={profile} 
                    setProfile={setProfile} 
                    onNavigate={(tab) => navigate(tab === 'home' ? '/' : `/${tab}`)} 
                    leadsCount={{ total: totalLeads, hot: hotLeads }}
                  />
                } 
              />
              <Route 
                path="/leads" 
                element={
                  <LeadsTab 
                    profile={profile}
                  />
                } 
              />
              <Route 
                path="/roi" 
                element={
                  <RoiTab 
                    businessCity={profile.city}
                  />
                } 
              />
              <Route 
                path="/creative" 
                element={
                  <CreativeTab 
                    profile={profile}
                  />
                } 
              />
            </Routes>
          </main>

          {/* APP BOTTOM NAVIGATION TAB BAR */}
          {!isAuthRoute && !isOnboardingRoute && !isCreateCampaignRoute && !isLeadDetailRoute && (
            <nav className="bg-white border-t border-[#F0F0EE] h-[72px] pb-3 px-3 flex justify-around items-center shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.02)] z-20">
              
              {/* Tab: Home */}
              <button
                onClick={() => navigate('/')}
                className={`flex flex-col items-center gap-1.5 py-1 px-3.5 rounded-xl transition-all cursor-pointer ${
                  currentPath === '/' 
                    ? 'text-primary scale-105' 
                    : 'text-gray-400 hover:text-gray-500'
                }`}
              >
                <Home size={20} className={currentPath === '/' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'} />
                <span className="text-[11px] font-semibold tracking-tight font-sans">Home</span>
              </button>

              {/* Tab: Leads */}
              <button
                onClick={() => navigate('/leads')}
                className={`flex flex-col items-center gap-1.5 py-1 px-3.5 rounded-xl transition-all cursor-pointer relative ${
                  currentPath === '/leads' 
                    ? 'text-primary scale-105' 
                    : 'text-gray-400 hover:text-gray-500'
                }`}
              >
                <Users size={20} className={currentPath === '/leads' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'} />
                <span className="text-[11px] font-semibold tracking-tight font-sans">Leads</span>
                {hotLeads > 0 && (
                  <span className="absolute top-0 right-3 bg-accent text-[8px] font-extrabold text-white h-3.5 w-3.5 flex items-center justify-center rounded-full ring-2 ring-white">
                    {hotLeads}
                  </span>
                )}
              </button>

              {/* Tab: ROI */}
              <button
                onClick={() => navigate('/roi')}
                className={`flex flex-col items-center gap-1.5 py-1 px-3.5 rounded-xl transition-all cursor-pointer ${
                  currentPath === '/roi' 
                    ? 'text-primary scale-105' 
                    : 'text-gray-400 hover:text-gray-500'
                }`}
              >
                <TrendingUp size={20} className={currentPath === '/roi' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'} />
                <span className="text-[11px] font-semibold tracking-tight font-sans">ROI</span>
              </button>

              {/* Tab: Creative */}
              <button
                onClick={() => navigate('/creative')}
                className={`flex flex-col items-center gap-1.5 py-1 px-3.5 rounded-xl transition-all cursor-pointer ${
                  currentPath === '/creative' 
                    ? 'text-primary scale-105' 
                    : 'text-gray-405 hover:text-gray-500'
                }`}
              >
                <Sparkles size={20} className={currentPath === '/creative' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'} />
                <span className="text-[11px] font-semibold tracking-tight font-sans">Creative</span>
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppInner />
    </HashRouter>
  );
}
