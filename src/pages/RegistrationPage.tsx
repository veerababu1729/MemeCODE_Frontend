import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api';
import ConfettiAnimation from '@/components/ConfettiAnimation';

interface FormData {
  email: string;
  password: string;
  name: string;
  age: string;
  phoneNumber: string;
  gender: string;
  collegeName: string;
  collegeAddress: string;
  cgpa: number;
  currentStatus: string;
  course: string;
  yearOfStudying: string;
  yearOfPassedout: string;
  reason: string;
}

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
    age: '',
    phoneNumber: '',
    gender: '',
    collegeName: '',
    collegeAddress: '',
    cgpa: 0,
    currentStatus: '',
    course: '',
    yearOfStudying: '',
    yearOfPassedout: '',
    reason: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [userData, setUserData] = useState<{name: string, email: string} | null>(null);

  // Get orderId from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdParam = urlParams.get('orderId');
    if (orderIdParam) {
      setOrderId(orderIdParam);
    } else {
      // If no orderId, redirect to payment page
      alert('Please complete payment first');
      navigate('/payment');
    }
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (field === 'cgpa') {
      const numValue = parseFloat(value) || 0;
      setFormData(prev => ({ ...prev, [field]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateForm = () => {
    const required = ['email', 'password', 'name', 'age', 'phoneNumber', 'gender', 'collegeName', 'collegeAddress', 'cgpa', 'currentStatus', 'reason'];
    
    for (const field of required) {
      const value = formData[field as keyof FormData];
      if (field === 'cgpa') {
        if (!value || value === 0) {
          return 'CGPA is required';
        }
      } else if (!value) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    }

    if (formData.currentStatus === 'student' && !formData.course) {
      return 'Course is required for students';
    }

    if (formData.currentStatus === 'student' && !formData.yearOfStudying) {
      return 'Year of studying is required for students';
    }

    if ((formData.currentStatus === 'passedout' || formData.currentStatus === 'employee') && !formData.yearOfPassedout) {
      return 'Year of passedout is required';
    }

    if (parseInt(formData.age) < 16 || parseInt(formData.age) > 100) {
      return 'Please enter a valid age';
    }

    if (formData.cgpa < 0 || formData.cgpa > 10) {
      return 'Please enter a valid CGPA between 0 and 10';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address';
    }

    // Password validation
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }

    // Phone number validation
    const phoneRegex = /^[+]?[1-9]?[0-9]{7,15}$/;
    if (!phoneRegex.test(formData.phoneNumber.replace(/[\s-()]/g, ''))) {
      return 'Please enter a valid phone number';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_ENDPOINTS.SUBMIT_DETAILS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          email: formData.email,
          password: formData.password,
          name: formData.name,
          age: parseInt(formData.age),
          phoneNumber: formData.phoneNumber,
          gender: formData.gender,
          collegeName: formData.collegeName,
          collegeAddress: formData.collegeAddress,
          cgpa: formData.cgpa,
          currentStatus: formData.currentStatus,
          course: formData.course || null,
          yearOfStudying: formData.yearOfStudying || null,
          yearOfPassedout: formData.yearOfPassedout ? parseInt(formData.yearOfPassedout) : null,
          reason: formData.reason,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        // Extract the specific error message from the server response
        throw new Error(result.error || 'Failed to submit details');
      }

      if (result.success) {
        setSubmitted(true);
        // Store user data for ebook access
        setUserData({
          name: formData.name,
          email: formData.email
        });
        
        // Redirect to ebook access page after 2 seconds
        setTimeout(() => {
          navigate(`/ebook-access?name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}`);
        }, 2000);
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      
      // More specific error handling
      if (error.message.includes('fetch')) {
        setError('Network error. Please check if the server is running and try again.');
      } else {
        setError(error.message || 'Failed to submit details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        {/* Confetti Animation for immediate celebration */}
        <ConfettiAnimation isActive={true} duration={8000} />
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-700 mb-2">🎉 Success!</h2>
            <p className="text-muted-foreground">
              Registration completed! Preparing your ebook access...
            </p>
            <div className="mt-4">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Complete Your Registration
            </CardTitle>
            <CardDescription className="text-center">
              <AlertCircle className="w-4 h-4 inline mr-1 text-orange-500" />
              Fill details carefully, for future references
            </CardDescription>
            <div className="text-center mt-2">
              <Button
                type="button"
                variant="link"
                className="text-sm text-muted-foreground hover:text-primary"
                onClick={() => navigate('/payment')}
              >
                ← Back to Payment
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email (This is your username) *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password (min 6 characters)"
                  className="w-full"
                />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full"
                />
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  min="16"
                  max="100"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="Enter your age"
                  className="w-full"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full"
                />
              </div>

              {/* Gender */}
              <div className="space-y-3">
                <Label>Gender *</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* College Name */}
              <div className="space-y-2">
                <Label htmlFor="collegeName">College Name *</Label>
                <Input
                  id="collegeName"
                  value={formData.collegeName}
                  onChange={(e) => handleInputChange('collegeName', e.target.value)}
                  placeholder="Enter your college name"
                  className="w-full"
                />
              </div>

              {/* College Address */}
              <div className="space-y-2">
                <Label htmlFor="collegeAddress">College Address *</Label>
                <Textarea
                  id="collegeAddress"
                  value={formData.collegeAddress}
                  onChange={(e) => handleInputChange('collegeAddress', e.target.value)}
                  placeholder="Enter your college address"
                  className="w-full"
                  rows={3}
                />
              </div>

              {/* CGPA */}
              <div className="space-y-2">
                <Label htmlFor="cgpa">CGPA *</Label>
                <Input
                  id="cgpa"
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={formData.cgpa === 0 ? '' : formData.cgpa.toString()}
                  onChange={(e) => handleInputChange('cgpa', e.target.value)}
                  placeholder="Enter your CGPA (e.g., 8.5)"
                  className="w-full"
                />
              </div>

              {/* Current Status */}
              <div className="space-y-2">
                <Label htmlFor="currentStatus">Current Status *</Label>
                <Select
                  value={formData.currentStatus}
                  onValueChange={(value) => handleInputChange('currentStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your current status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="passedout">Passed Out</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Conditional Fields for Students */}
              {formData.currentStatus === 'student' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="course">Course *</Label>
                    <Select
                      value={formData.course}
                      onValueChange={(value) => handleInputChange('course', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="btech">B.Tech</SelectItem>
                        <SelectItem value="degree">Degree</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearOfStudying">Year of Studying *</Label>
                    <Select
                      value={formData.yearOfStudying}
                      onValueChange={(value) => handleInputChange('yearOfStudying', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                        <SelectItem value="NA">N/A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Conditional Fields for Passed Out/Employee */}
              {(formData.currentStatus === 'passedout' || formData.currentStatus === 'employee') && (
                <div className="space-y-2">
                  <Label htmlFor="yearOfPassedout">Year of Passed Out *</Label>
                  <Input
                    id="yearOfPassedout"
                    type="number"
                    min="2000"
                    max={new Date().getFullYear()}
                    value={formData.yearOfPassedout}
                    onChange={(e) => handleInputChange('yearOfPassedout', e.target.value)}
                    placeholder="Enter year of graduation"
                    className="w-full"
                  />
                </div>
              )}

              {/* Reason */}
              <div className="space-y-2">
                <Label htmlFor="reason">Why do you want to buy this? *</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  placeholder="Tell us why you want to join this course..."
                  className="w-full"
                  rows={4}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Details'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistrationPage;
