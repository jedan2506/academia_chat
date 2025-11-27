import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { SignupCredentials } from '@/types/auth';
import AuthLayout from '@/components/AuthLayout';
import SEOHead from '@/components/SEOHead';
import { FaUser, FaEnvelope, FaLock, FaCheckCircle, FaUserPlus } from 'react-icons/fa';

const SignUp = () => {
    const navigate = useNavigate();
    const { signup, isAuthenticated, isLoading } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SignupCredentials & { confirmPassword: string }>();

    const password = watch('password');

    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            navigate('/chat', { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate]);

    const onSubmit = async (data: SignupCredentials & { confirmPassword: string }) => {
        setIsSubmitting(true);
        try {
            const { confirmPassword, ...signupData } = data;
            const success = await signup(signupData);
            if (success) {
                navigate('/chat', { replace: true });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <SEOHead
                title="Sign Up - Join Virallens Marketing Bot Community"
                description="Create your free account with Virallens Marketing Bot and unlock AI-powered marketing insights, strategies, and expert guidance for your business growth."
                keywords="sign up, register, create account, free marketing bot, AI marketing assistant, marketing tools"
                url="https://virallens.com/signup"
            />
            <AuthLayout
                title="Create your account"
                subtitle="Join us today! Please fill in your details to get started."
            >
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label dark:text-gray-200">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaUser className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                                {...register('name', {
                                    required: 'Name is required',
                                    minLength: {
                                        value: 2,
                                        message: 'Name must be at least 2 characters',
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: 'Name cannot exceed 50 characters',
                                    },
                                })}
                                type="text"
                                autoComplete="name"
                                className="input pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                placeholder="Enter your full name"
                            />
                        </div>
                        {errors.name && (
                            <p className="form-error dark:text-red-400">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label dark:text-gray-200">
                            Email address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaEnvelope className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address',
                                    },
                                })}
                                type="email"
                                autoComplete="email"
                                className="input pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                placeholder="Enter your email address"
                            />
                        </div>
                        {errors.email && (
                            <p className="form-error dark:text-red-400">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label dark:text-gray-200">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters',
                                    },
                                })}
                                type="password"
                                autoComplete="new-password"
                                className="input pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                placeholder="Enter your password"
                            />
                        </div>
                        {errors.password && (
                            <p className="form-error dark:text-red-400">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label dark:text-gray-200">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaCheckCircle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: value =>
                                        value === password || 'The passwords do not match',
                                })}
                                type="password"
                                autoComplete="new-password"
                                className="input pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                placeholder="Confirm your password"
                            />
                        </div>
                        {errors.confirmPassword && (
                            <p className="form-error dark:text-red-400">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary w-full dark:bg-primary-600 dark:hover:bg-primary-700"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <div className="spinner h-5 w-5 mr-3"></div>
                                    Creating account...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <FaUserPlus className="w-5 h-5 mr-2" />
                                    Create account
                                </div>
                            )}
                        </button>
                    </div>

                    <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-600">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                            Already have an account?{' '}
                            <Link
                                to="/signin"
                                className="font-semibold text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors underline underline-offset-2"
                            >
                                Sign in
                            </Link>
                        </span>
                    </div>
                </form>
            </AuthLayout>
        </>
    );
};

export default SignUp;
