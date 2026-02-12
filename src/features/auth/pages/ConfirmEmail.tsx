import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, CheckCircle } from 'lucide-react';

export default function ConfirmEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    // If no email parameter, redirect to login
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Check Your Email
          </h2>

          <div className="mb-6">
            <Mail className="h-12 w-12 text-blue-600 mx-auto mb-3" />
            <p className="text-gray-700 mb-4">
              We've sent a confirmation email to:
            </p>
            <p className="text-lg font-semibold text-gray-900 mb-4">
              {email}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Next steps:</strong>
            </p>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the confirmation link in the email</li>
              <li>Return here to sign in</li>
            </ol>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Didn't receive the email? Check your spam folder or try signing up again.
          </p>

          <button
            onClick={() => navigate('/login')}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Sign In
          </button>

          <p className="mt-4 text-xs text-gray-500">
            If you continue to have issues, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
