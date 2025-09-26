import { ArrowLeft, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ContactUs = () => {
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
        
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">Email Support</p>
              <p>eefriends1729@gmail.com</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">WhatsApp Support</p>
              <p>+91 9701910239 (9 AM - 6 PM IST)</p>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm">
              For ebook access issues, payment queries, or technical support related to "Python in 21 Days" ebook, 
              reach out to us. We typically respond within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
