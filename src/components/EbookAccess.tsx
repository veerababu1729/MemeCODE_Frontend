import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, BookOpen, Star, Users, Clock, Eye, ExternalLink } from 'lucide-react';

interface EbookAccessProps {
  userName: string;
  userEmail: string;
  autoScrollToPdf?: boolean; // New prop to control auto-scroll behavior
}

const EbookAccess = ({ userName, userEmail, autoScrollToPdf = false }: EbookAccessProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(true);

  // Add 3D book animation styles
  const bookStyles = `
    .book-container {
      perspective: 1200px;
      width: 128px;
      height: 160px;
      margin: 0 auto;
      filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2));
    }

    .book {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      animation: bookFloat 4s ease-in-out infinite;
      transform: rotateY(-25deg) rotateX(5deg);
    }

    .book-cover {
      position: absolute;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
    }

    .book-spine {
      position: absolute;
      left: -12px;
      top: 0;
      width: 24px;
      height: 100%;
      background: linear-gradient(135deg, #1e40af, #1d4ed8, #2563eb);
      transform: rotateY(-90deg);
      transform-origin: right center;
      border-radius: 3px 0 0 3px;
      box-shadow: inset -2px 0 4px rgba(0, 0, 0, 0.3);
    }

    .book-front {
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6);
      border-radius: 8px;
      box-shadow: 
        0 0 0 2px rgba(255, 255, 255, 0.1),
        0 8px 25px rgba(59, 130, 246, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: white;
      font-weight: bold;
      position: relative;
      overflow: hidden;
    }

    .book-front::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        45deg,
        transparent 30%,
        rgba(255, 255, 255, 0.1) 50%,
        transparent 70%
      );
      animation: bookShine 3s ease-in-out infinite;
    }

    .book-title {
      font-size: 14px;
      margin-bottom: 4px;
      text-align: center;
    }

    .book-subtitle {
      font-size: 10px;
      opacity: 0.8;
    }

    .pages {
      position: absolute;
      top: 4px;
      left: 4px;
      right: 4px;
      bottom: 4px;
      transform-style: preserve-3d;
    }

    .page {
      position: absolute;
      width: 100%;
      height: 100%;
      background: #fefefe;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      transform-origin: left center;
      animation: pageFlip 4s ease-in-out infinite;
    }

    .page-cover {
      background: linear-gradient(135deg, #f8fafc, #e2e8f0);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #1e293b;
      font-weight: bold;
      text-align: center;
      padding: 8px;
    }

    .page-cover-title {
      font-size: 12px;
      margin-bottom: 4px;
      color: #3b82f6;
    }

    .page-cover-subtitle {
      font-size: 8px;
      color: #64748b;
      opacity: 0.8;
    }

    .page-1 { animation-delay: 0s; z-index: 5; }
    .page-2 { animation-delay: 0.8s; z-index: 4; }
    .page-3 { animation-delay: 1.6s; z-index: 3; }
    .page-4 { animation-delay: 2.4s; z-index: 2; }
    .page-5 { animation-delay: 3.2s; z-index: 1; }

    @keyframes bookFloat {
      0%, 100% { transform: translateY(0px) rotateY(-15deg); }
      50% { transform: translateY(-10px) rotateY(-15deg); }
    }

    @keyframes pageFlip {
      0%, 15% { transform: rotateY(0deg); }
      25%, 35% { transform: rotateY(-180deg); }
      85%, 100% { transform: rotateY(0deg); }
    }

    /* Mobile optimizations */
    @media (max-width: 640px) {
      .book-container {
        width: 100px;
        height: 130px;
      }
      
      .book-title {
        font-size: 12px;
      }
      
      .book-subtitle {
        font-size: 9px;
      }

      .page-cover-title {
        font-size: 10px;
      }
      
      .page-cover-subtitle {
        font-size: 7px;
      }
    }

    /* Shining effect for download button */
    .shine-button {
      position: relative;
      overflow: hidden;
    }

    .shine-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.4),
        transparent
      );
      transition: left 0.6s ease;
    }

    .shine-button:hover::before {
      left: 100%;
    }

    .shine-button-auto::before {
      animation: shine 2.5s ease-in-out infinite;
    }

    @keyframes shine {
      0% { left: -100%; }
      50% { left: 100%; }
      100% { left: 100%; }
    }
  `;


  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Create a link element to trigger download
      const link = document.createElement('a');
      link.href = '/ebook/memecodepdf.pdf'; // Path to your PDF file
      link.download = 'memecodepdf.pdf';
      link.target = '_blank';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Optional: Track download analytics
      console.log(`Ebook downloaded by: ${userEmail}`);
      
    } catch (error) {
      console.error('Download failed:', error);
      // Could add a toast notification here instead of alert
    } finally {
      setIsDownloading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <style dangerouslySetInnerHTML={{ __html: bookStyles }} />
      {/* Success Header */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-2">
            🎉 Welcome, {userName}!
          </h1>
          <p className="text-lg text-gray-600">
            Registration completed successfully! Your coding journey begins now.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="max-w-2xl mx-auto mb-8">
          {/* Download Card */}
          <Card className="border-green-200 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-700 flex items-center justify-center gap-2">
                <BookOpen className="w-6 h-6" />
                Your Ebook is Ready!
              </CardTitle>
              <CardDescription>
                Download your MemeCode (Telugu) ebook now
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <div className="w-32 h-40 mx-auto mb-4 relative">
                  <div className="book-container">
                    <div className="book">
                      <div className="book-cover">
                        <div className="book-spine"></div>
                        <div className="book-front">
                          <div className="book-title">MemeCode</div>
                          <div className="book-subtitle">Telugu</div>
                        </div>
                      </div>
                      <div className="pages">
                        <div className="page page-1 page-cover">
                          <div className="page-cover-title">MemeCode</div>
                          <div className="page-cover-subtitle">Telugu Edition</div>
                        </div>
                        <div className="page page-2"></div>
                        <div className="page page-3"></div>
                        <div className="page page-4"></div>
                        <div className="page page-5"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">MemeCode</h3>
                <p className="text-sm text-muted-foreground">Telugu Edition • PDF Format • 155 Pages</p>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold shine-button shine-button-auto"
                  size="lg"
                >
                  {isDownloading ? (
                    <>
                      <Download className="w-5 h-5 mr-2 animate-bounce" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Download Your Ebook 
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={() => setShowPdfViewer(!showPdfViewer)}
                  variant="outline"
                  className="w-full py-4 text-lg font-semibold border-blue-600 text-blue-600 hover:bg-blue-50"
                  size="lg"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  {showPdfViewer ? 'Hide Ebook Online' : 'Read Ebook Online'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PDF Viewer */}
        {showPdfViewer && (
          <Card id="pdf-viewer-section" className="border-blue-200 shadow-lg mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-blue-700 flex items-center justify-center gap-2">
                <BookOpen className="w-6 h-6" />
                Read Your Ebook Online
              </CardTitle>
              <CardDescription>
                MemeCode PDF - Python in 21 Days (Telugu)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">
                    📖 Reading: memecodepdf.pdf
                  </p>
                  <Button
                    onClick={() => window.open('/ebook/memecodepdf.pdf', '_blank')}
                    variant="outline"
                    size="sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Full Screen
                  </Button>
                </div>
                
                {/* PDF Embed */}
                <div className="w-full h-96 md:h-[600px] border border-gray-300 rounded-lg overflow-hidden">
                  <iframe
                    src="/ebook/memecodepdf.pdf#toolbar=1&navpanes=1&scrollbar=1"
                    className="w-full h-full"
                    title="MemeCode Ebook PDF Viewer"
                  >
                    <p className="p-4 text-center">
                      Your browser doesn't support PDF viewing. 
                      <Button 
                        onClick={handleDownload}
                        variant="link" 
                        className="text-blue-600 underline ml-1"
                      >
                        Download the PDF instead
                      </Button>
                    </p>
                  </iframe>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    💡 Tip: Use Ctrl+F to search within the ebook, or click "Full Screen" for better reading experience
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional Resources */}
        <Card className="border-purple-200 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-purple-700">Next Steps</CardTitle>
            <CardDescription>
              Continue your learning journey with these resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Join Community</h4>
                <p className="text-sm text-muted-foreground">Connect with fellow Telugu developers</p>
                <Button 
                  variant="outline" 
                  className="mt-2" 
                  size="sm"
                  onClick={() => window.open('https://whatsapp.com/channel/0029Vathe9C7NoZz0cMZlw3C', '_blank')}
                >
                  Join Now
                </Button>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Start Reading</h4>
                <p className="text-sm text-muted-foreground">Begin with Chapter 1: Python Basics</p>
                <Button 
                  onClick={() => setShowPdfViewer(true)}
                  variant="outline" 
                  className="mt-2" 
                  size="sm"
                >
                  Read Now
                </Button>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Practice Projects</h4>
                <p className="text-sm text-muted-foreground">Access 300+ resume-worthy projects</p>
                <Button variant="outline" className="mt-2" size="sm">
                  Explore
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Info */}
        <div className="text-center mt-8 p-4 bg-white/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            📧 Logged in as: <span className="font-medium">{userEmail}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Keep this email safe - it's your username for future access
          </p>
        </div>
      </div>
    </div>
  );
};

export default EbookAccess;
