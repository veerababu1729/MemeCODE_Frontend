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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-4 animate-in fade-in duration-300">
      <div className="w-full max-w-4xl mx-4 animate-in slide-in-from-top-4 duration-500">
        {currentView === 'login' && (
          <LoginForm 
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={handleSwitchToRegister}
          />
        )}

        {currentView === 'register' && (
          <div>
            {/* Add a back to login button */}
            <div className="mb-4">
              <button
                onClick={handleSwitchToLogin}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                ← Already have an account? Login
              </button>
            </div>
            <PaymentFlow onComplete={handlePaymentComplete} />
          </div>
        )}

        {currentView === 'success' && userData && (
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8">
            <Card className="w-full max-w-md mx-auto text-center">
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
        )}

        {currentView === 'purchase-prompt' && userData && (
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-8">
            <Card className="w-full max-w-md mx-auto text-center">
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
        )}

        {currentView === 'ebook-access' && userData && (
          <EbookAccess 
            userName={userData.name}
            userEmail={userData.email}
          />
        )}
      </div>
    </div>
  );
};

export default AuthenticationFlow;
