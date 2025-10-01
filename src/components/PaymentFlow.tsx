import { useState } from 'react';
import PaymentForm from './PaymentForm';
import UserDetailsForm from './UserDetailsForm';
import EbookAccess from './EbookAccess';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

type FlowStep = 'payment' | 'form' | 'success';

interface PaymentFlowProps {
  onComplete?: () => void;
}

interface UserData {
  name: string;
  email: string;
}

const PaymentFlow = ({ onComplete }: PaymentFlowProps) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('payment');
  const [orderId, setOrderId] = useState<string>('');
  const [userData, setUserData] = useState<UserData | null>(null);

  const handlePaymentSuccess = (orderIdFromPayment: string) => {
    setOrderId(orderIdFromPayment);
    setCurrentStep('form');
  };

  const handleFormSubmitSuccess = (userInfo: UserData) => {
    setUserData(userInfo);
    setCurrentStep('success');
  };

  const handleGoHome = () => {
    if (onComplete) {
      onComplete();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-4 animate-in fade-in duration-300">
      <div className="w-full max-w-4xl mx-4 animate-in slide-in-from-top-4 duration-500">
        {currentStep === 'payment' && (
          <PaymentForm onPaymentSuccess={handlePaymentSuccess} />
        )}

        {currentStep === 'form' && (
          <UserDetailsForm 
            orderId={orderId} 
            onSubmitSuccess={handleFormSubmitSuccess} 
          />
        )}

        {currentStep === 'success' && userData && (
          <EbookAccess 
            userName={userData.name}
            userEmail={userData.email}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentFlow;
