import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <Button 
          onClick={() => navigate(-1)}
          variant="ghost" 
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="space-y-4 text-muted-foreground text-sm">
          <div>
            <h3 className="font-medium text-foreground mb-2">Information We Collect</h3>
            <ul className="space-y-1">
              <li>• Email address for ebook delivery</li>
              <li>• Payment information (processed securely)</li>
              <li>• Basic usage analytics</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-foreground mb-2">How We Use Your Data</h3>
            <ul className="space-y-1">
              <li>• Deliver "Python in 21 Days" ebook</li>
              <li>• Send important updates about your purchase</li>
              <li>• Improve our educational content</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-foreground mb-2">Data Protection</h3>
            <p>Your information is encrypted and stored securely. We never share personal data with third parties.</p>
          </div>
          
          <div>
            <h3 className="font-medium text-foreground mb-2">Cookies</h3>
            <p>We use minimal cookies for website functionality and analytics. No tracking for advertising.</p>
          </div>
          
          <div>
            <h3 className="font-medium text-foreground mb-2">Your Rights</h3>
            <ul className="space-y-1">
              <li>• Request data deletion</li>
              <li>• Update your information</li>
              <li>• Opt out of non-essential communications</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-foreground mb-2">Contact</h3>
            <p>For privacy concerns, email: privacy@ee.info</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
