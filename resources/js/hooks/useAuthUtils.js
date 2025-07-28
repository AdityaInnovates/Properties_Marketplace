import { router } from '@inertiajs/react';
import { useAuth } from '../contexts/AuthContext';

export const useAuthUtils = () => {
    const { user, loading } = useAuth();

    const isAuthenticated = !loading && !!user;
    const isLoading = loading;
    const isGuest = !loading && !user;

    const requireAuth = (callback) => {
        if (!isAuthenticated) {
            router.visit('/auth', { replace: true });
            return;
        }
        if (typeof callback === 'function') {
            callback();
        }
    };

    const redirectIfAuthenticated = (redirectTo = '/') => {
        if (isAuthenticated) {
            router.visit(redirectTo, { replace: true });
        }
    };

    return {
        user,
        isAuthenticated,
        isLoading,
        isGuest,
        requireAuth,
        redirectIfAuthenticated,
    };
};

export default useAuthUtils;
