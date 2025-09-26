import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TermsConditions = () => {
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
        
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        
        <div className="space-y-4 text-muted-foreground text-sm">
          <div>
            <h3 className="font-medium text-foreground mb-2">Usage Rights</h3>
            <p>Personal use only. No redistribution or resale of "MemeCODE" ebook content.</p>
          </div>
          
          <div>
            <h3 className="font-medium text-foreground mb-2">Payment</h3>
            <p>One-time payment of ₹99. Lifetime access to purchased content.</p>
          </div>
          
          <div>
            <h3 className="font-medium text-foreground mb-2">Content</h3>
            <p>Ebook includes Python tutorials, memes, DSA problems, and project ideas. Content updated periodically.</p>
          </div>
          
          <div>
            <h3 className="font-medium text-foreground mb-2">Restrictions</h3>
            <ul className="space-y-1">
              <li>• No sharing of login credentials</li>
              <li>• No commercial use without permission</li>
              <li>• Respect intellectual property rights</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-foreground mb-2">Liability</h3>
            <p>EE.Info provides educational content as-is. Learning outcomes may vary.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
