import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Camera, RefreshCw } from 'lucide-react';

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate()
  
  const status = searchParams.get('status') || '';
  const isSuccess = status === 'success';

  useEffect(() => {

    if(status === ''){
        navigate('/')
    }
    // Simulate loading to show animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 transform">
        {/* Header */}
        <div className="bg-black p-6 flex items-center justify-center">
          <div className="flex items-center">
            <Camera className="h-8 w-8 text-white mr-3" />
            <h1 className="text-lg font-semibold text-white">Stock Image</h1>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8">
          {isLoading ? (
            <div className="flex flex-col items-center py-8">
              <RefreshCw className="h-16 w-16 text-blue-500 animate-spin mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Verifying your email...</h2>
              <p className="text-gray-500 text-center">Please wait while we confirm your registration.</p>
            </div>
          ) : isSuccess ? (
            <div className="flex flex-col items-center py-8 animate-fadeIn">
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"></div>
                <CheckCircle className="h-20 w-20 text-green-500 relative z-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Verified Successfully!</h2>
              <p className="text-gray-600 text-center mb-6">
                Your account has been activated. You now have full access to PixelStock's library of professional images.
              </p>
              <div className="space-y-3 w-full">
                <Link 
                  to="/login" 
                  className="flex items-center justify-center w-full py-3 px-4 bg-black text-white font-medium rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                >
                  Sign In to Your Account
                </Link>
                <Link 
                  to="/" 
                  className="flex items-center justify-center w-full py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition duration-300 ease-in-out"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-8 animate-fadeIn">
              <XCircle className="h-20 w-20 text-red-500 mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
              <p className="text-gray-600 text-center mb-6">
                We couldn't verify your email address. The verification link may have expired or is invalid.
              </p>
              <div className="space-y-3 w-full">
                <Link 
                  to="#" 
                  className="flex items-center justify-center w-full py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition duration-300 ease-in-out"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} PixelStock. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;