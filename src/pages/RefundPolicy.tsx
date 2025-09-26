import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const RefundPolicy = () => {
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
        
        <h1 className="text-3xl font-bold mb-6">Cancellations and Refunds</h1>
        
        <div className="space-y-4 text-muted-foreground text-sm">
          <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <p className="font-medium text-red-700 dark:text-red-400 mb-2">No Refund Policy</p>
            <p className="text-red-600 dark:text-red-300">
              Due to the digital nature of "Python in 21 Days" ebook, all sales are final. No refunds available.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-foreground mb-2">Why No Refunds?</h3>
            <ul className="space-y-1">
              <li>• Instant access to complete content</li>
              <li>• Digital product cannot be "returned"</li>
              <li>• Affordable pricing at ₹99 only</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-foreground mb-2">Before Purchase</h3>
            <p>Check demo content and reviews to ensure this ebook meets your learning needs.</p>
          </div>
          
          <div>
            <h3 className="font-medium text-foreground mb-2">Technical Issues</h3>
            <p>For access problems or technical issues, contact support. We'll resolve access issues promptly.</p>
          </div>
          
          <div>
            <h3 className="font-medium text-foreground mb-2">Exceptional Cases</h3>
            <p>Refunds considered only for duplicate payments or technical errors during purchase.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
