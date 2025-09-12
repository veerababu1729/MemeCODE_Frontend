import { useState } from 'react';
import EntryPage from '@/components/EntryPage';
import HomePage from '@/components/HomePage';

const Index = () => {
  const [showHome, setShowHome] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const handleGetStarted = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowHome(true);
    }, 600);
  };
  
  if (!showHome) {
    return <EntryPage onGetStarted={handleGetStarted} />;
  }
  
  return (
    <div className={`transition-all duration-600 ${isTransitioning ? 'animate-page-transition' : ''}`}>
      <HomePage />
    </div>
  );
};

export default Index;
