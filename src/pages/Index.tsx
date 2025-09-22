import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EntryPage from '@/components/EntryPage';
import HomePage from '@/components/HomePage';

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showHome, setShowHome] = useState(location.pathname === '/home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showGateway, setShowGateway] = useState(false);
  
  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      // Let React Router handle the navigation naturally
      if (location.pathname === '/') {
        setShowHome(false);
      } else if (location.pathname === '/home') {
        setShowHome(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [location.pathname]);
  
  const handleGetStarted = () => {
    setIsTransitioning(true);
    setShowGateway(true);
    
    // Navigate to /home using React Router
    navigate('/home', { replace: false });
    
    // Start the gateway animation
    setTimeout(() => {
      setShowHome(true);
    }, 600); // Halfway through the gateway animation
    
    // Hide gateway after animation completes
    setTimeout(() => {
      setShowGateway(false);
      setIsTransitioning(false);
    }, 1200); // After gateway animation completes
  };
  
  return (
    <div className="gateway-container">
      {/* Gateway overlay for transition effect */}
      {showGateway && (
        <div className={`gateway-overlay ${isTransitioning ? 'gateway-opening' : ''}`}>
          <div className="gateway-half gateway-half--left"></div>
          <div className="gateway-half gateway-half--right"></div>
        </div>
      )}
      
      {/* Main content */}
      <div className={isTransitioning ? 'page-transition-exit-active' : ''}>
        {!showHome ? (
          <EntryPage onGetStarted={handleGetStarted} />
        ) : (
          <div className={isTransitioning ? 'page-transition-enter' : 'page-transition-enter-active'}>
            <HomePage />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
