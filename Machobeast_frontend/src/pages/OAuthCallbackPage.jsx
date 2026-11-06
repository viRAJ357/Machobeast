import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setOAuthUser } from '../redux/slices/authSlice';
import { Dumbbell } from 'lucide-react';

/**
 * OAuthCallbackPage
 * The backend redirects here after a successful Google/Facebook OAuth flow.
 * URL: /oauth-callback?token=JWT&user=JSON
 */
export const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const userRaw = searchParams.get('user');
    const error = searchParams.get('error');

    if (error || !token || !userRaw) {
      navigate('/login?error=oauth_failed');
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userRaw));
      dispatch(setOAuthUser(user, token));
      navigate('/', { replace: true });
    } catch {
      navigate('/login?error=oauth_failed');
    }
  }, [searchParams, dispatch, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-black text-amber-400 rounded-2xl shadow-lg animate-pulse">
          <Dumbbell className="w-7 h-7 fill-amber-400" />
        </div>
        <p className="text-slate-700 font-semibold text-sm tracking-wide">
          Signing you in to <span className="text-amber-500 font-black">MachoBeast</span>...
        </p>
      </div>
    </div>
  );
};
