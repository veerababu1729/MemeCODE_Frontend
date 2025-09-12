import { useState } from 'react';
import EntryPage from '@/components/EntryPage';
import HomePage from '@/components/HomePage';

const Index = () => {
  const [showHome, setShowHome] = useState(false);
  
  const handleGetStarted = () => {
    setShowHome(true);
  };
  
  if (!showHome) {
    return <EntryPage onGetStarted={handleGetStarted} />;
  }
  
  return <HomePage />;
};

export default Index;
