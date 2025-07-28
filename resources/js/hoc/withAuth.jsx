import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const withAuth = (WrappedComponent) => {
    const AuthenticatedComponent = (props) => {
        const { user, loading } = useAuth();

        useEffect(() => {
            if (!loading) {
                if (!user) {
                    router.visit('/auth', {
                        replace: true,
                    });
                }
            }
        }, [user, loading]);
        if (loading) {
            return (
                <div className="flex min-h-screen items-center justify-center">
                    <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                        <span className="text-gray-600">Loading...</span>
                    </div>
                </div>
            );
        }

        if (!user) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };

    AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return AuthenticatedComponent;
};

export default withAuth;
