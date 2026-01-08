
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile } from './types';
import { requestNotificationPermission } from './utils/notifications';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Verification from './pages/Verification';
import PINSetup from './pages/PINSetup';
import PINLock from './pages/PINLock';
import SendMoney from './pages/SendMoney';
import History from './pages/History';
import ChatList from './pages/ChatList';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Components
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [pinAuthorized, setPinAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch Profile
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        }
        // Ask for notification permission after login
        requestNotificationPermission();
      } else {
        setProfile(null);
        setPinAuthorized(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-200">
        {currentUser && profile && profile.pinHash && pinAuthorized && <Navbar />}
        
        <Routes>
          <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={currentUser ? <Navigate to="/" /> : <Signup />} />

          <Route path="/" element={
            !currentUser ? <Navigate to="/login" /> :
            !currentUser.emailVerified ? <Navigate to="/verify" /> :
            !profile?.pinHash ? <Navigate to="/setup-pin" /> :
            !pinAuthorized ? <PINLock profile={profile} onAuthorized={() => setPinAuthorized(true)} /> :
            <Dashboard profile={profile} />
          } />

          <Route path="/verify" element={
            currentUser && !currentUser.emailVerified ? <Verification user={currentUser} /> : <Navigate to="/" />
          } />

          <Route path="/setup-pin" element={
            currentUser && currentUser.emailVerified && !profile?.pinHash ? <PINSetup uid={currentUser.uid} onComplete={() => window.location.reload()} /> : <Navigate to="/" />
          } />

          <Route path="/send-money" element={
            pinAuthorized ? <SendMoney profile={profile!} /> : <Navigate to="/" />
          } />

          <Route path="/history" element={
            pinAuthorized ? <History profile={profile!} /> : <Navigate to="/" />
          } />

          <Route path="/chat" element={
            pinAuthorized ? <ChatList profile={profile!} /> : <Navigate to="/" />
          } />

          <Route path="/profile" element={
            pinAuthorized ? <Profile profile={profile!} /> : <Navigate to="/" />
          } />

          <Route path="/settings" element={
            pinAuthorized ? <Settings profile={profile!} /> : <Navigate to="/" />
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
