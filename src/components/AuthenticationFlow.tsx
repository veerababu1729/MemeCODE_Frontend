import { useState } from 'react';
import LoginForm from './LoginForm';
import PaymentFlow from './PaymentFlow';
import EbookAccess from './EbookAccess';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ShoppingCart } from 'lucide-react';

interface AuthenticationFlowProps {
  onComplete: () => void;
}

interface UserData {
  id: number;
  email: string;
  name: string;
  hasPurchased: boolean;
}

const AuthenticationFlow = ({ onComplete }: AuthenticationFlowProps) => {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'success' | 'purchase-prompt' | 'ebook-access'>('login');
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleLoginSuccess = (user: UserData) => {
    setUserData(user);
    
    if (user.hasPurchased) {
      // User has already purchased, go directly to ebook content
      setCurrentView('ebook-access');
    } else {
      // User exists but hasn't purchased, show purchase prompt
      setCurrentView('purchase-prompt');
    }
  };

  const handleSwitchToRegister = () => {
    setCurrentView('register');
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
  };

  const handlePaymentComplete = (userData?: UserData) => {
    if (userData) {
      setUserData(userData);
      setCurrentView('ebook-access');
    } else {
      onComplete();
    }
  };

  if (currentView === 'login') {
    return (
      <LoginForm 
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={handleSwitchToRegister}
      />
    );
  }

  if (currentView === 'register') {
    return (
      <div>
        {/* Add a back to login button */}
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={handleSwitchToLogin}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            ← Already have an account? Login
          </button>
        </div>
        <PaymentFlow onComplete={handlePaymentComplete} />
      </div>
    );
  }

  if (currentView === 'success' && userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-green-700">
              Welcome Back, {userData.name}!
            </CardTitle>
            <CardDescription>
              You already have access to all the content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You can now access:
              </p>
              <ul className="text-sm text-left space-y-2">
                <li>• Python in 21 Days (Telugu)</li>
                <li>• 300+ Resume Projects with Source Code</li>
                <li>• Curated DSA Sheet (150-250 Problems)</li>
                <li>• Community & Mentor Support</li>
              </ul>
              <Button 
                onClick={() => setCurrentView('ebook-access')}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Access Content
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === 'purchase-prompt' && userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <ShoppingCart className="w-16 h-16 text-orange-600 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-orange-700">
              Welcome Back, {userData.name}!
            </CardTitle>
            <CardDescription>
              Complete your purchase to access the content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You have an account but haven't purchased the content yet.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => setCurrentView('register')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Complete Purchase - ₹99
                </Button>
                <Button 
                  onClick={handleSwitchToLogin}
                  variant="outline"
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === 'ebook-access' && userData) {
    return (
      <EbookAccess 
        userName={userData.name}
        userEmail={userData.email}
      />
    );
  }

  return null;
};

export default AuthenticationFlow;
