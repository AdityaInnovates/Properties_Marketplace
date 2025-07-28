import { Link, router } from '@inertiajs/react';
import { Building, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/AuthContext';
import { signInUser, signUpUser } from '../lib/firebase';

const AuthPage = () => {
    const { user, loading } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
    });

    useEffect(() => {
        if (!loading && user) {
            router.visit('/', { replace: true });
        }
    }, [user, loading]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (isLogin) {
                await signInUser(formData.email, formData.password);
                toast.success('Successfully logged in!');
                router.visit('/', { replace: true });
            } else {
                if (formData.password !== formData.confirmPassword) {
                    toast.error('Passwords do not match!');
                    setSubmitting(false);
                    return;
                }

                if (formData.password.length < 6) {
                    toast.error('Password must be at least 6 characters long!');
                    setSubmitting(false);
                    return;
                }

                await signUpUser(formData.email, formData.password);
                toast.success('Account created successfully!');
                router.visit('/', { replace: true });
            }
        } catch (error) {
            console.error('Auth error:', error);
            let errorMessage = 'An error occurred. Please try again.';

            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password.';
            } else if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'An account with this email already exists.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password should be at least 6 characters.';
            }

            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
        });
        setShowPassword(false);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 dark:from-gray-900 dark:to-gray-800">
                <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    <span className="text-gray-600 dark:text-gray-400">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 dark:from-gray-900 dark:to-gray-800">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link href="/" className="mb-2 inline-flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
                        <Building className="h-8 w-8 text-blue-600" />
                        PropertyHub
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        {isLogin ? 'Sign in to access your property dashboard' : 'Join us to start listing and browsing properties'}
                    </p>
                </div>

                <div className="rounded-xl bg-white p-8 shadow-xl dark:bg-gray-800">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <div>
                                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required={!isLogin}
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="pl-10"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="pl-10"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="pr-10 pl-10"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {!isLogin && (
                            <div>
                                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        required={!isLogin}
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="pl-10"
                                        placeholder="Confirm your password"
                                    />
                                </div>
                            </div>
                        )}

                        <Button type="submit" disabled={submitting} className="w-full bg-blue-600 py-3 text-white hover:bg-blue-700">
                            {submitting ? (
                                <div className="flex items-center justify-center">
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                                </div>
                            ) : isLogin ? (
                                'Sign In'
                            ) : (
                                'Create Account'
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            {isLogin ? "Don't have an account?" : 'Already have an account?'}
                            <button onClick={toggleAuthMode} className="ml-1 font-medium text-blue-600 hover:text-blue-700">
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>

                    <div className="mt-4 text-center">
                        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
