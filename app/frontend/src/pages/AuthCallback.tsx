import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { client } from '@/lib/api';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await client.auth.login();
        navigate('/admin');
      } catch {
        navigate('/');
      }
    };
    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full"></div>
    </div>
  );
};

export default AuthCallback;