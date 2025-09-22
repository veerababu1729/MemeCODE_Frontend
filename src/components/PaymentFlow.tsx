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

  if (currentStep === 'payment') {
    return <PaymentForm onPaymentSuccess={handlePaymentSuccess} />;
  }

  if (currentStep === 'form') {
    return (
      <UserDetailsForm 
        orderId={orderId} 
        onSubmitSuccess={handleFormSubmitSuccess} 
      />
    );
  }

  if (currentStep === 'success' && userData) {
    return (
      <EbookAccess 
        userName={userData.name}
        userEmail={userData.email}
      />
    );
  }

  return null;
};

export default PaymentFlow;
