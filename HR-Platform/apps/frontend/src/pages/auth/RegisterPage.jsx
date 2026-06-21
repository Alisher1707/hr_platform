import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import authService from '../../services/authService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ThemeToggle from '../../components/ui/ThemeToggle';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

/**
 * RegisterPage Component
 * Handles registration using an invitation token with premium styles and validations
 */
export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, isAuthenticated, isLoading: isRegistering, error: registerError, clearError } = useAuthStore();

  const [token, setToken] = useState('');
  const [isValidating, setIsValidating] = useState(true);
  const [tokenError, setTokenError] = useState(null);
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({});

  // 1. Get and validate token from URL
  useEffect(() => {
    const inviteToken = searchParams.get('token');
    if (!inviteToken) {
      setTokenError('Taklifnoma kodi topilmadi. Tizimga faqat maxsus taklifnoma orqali ro\'yxatdan o\'tish mumkin.');
      setIsValidating(false);
      return;
    }

    setToken(inviteToken);

    const validateToken = async () => {
      try {
        const validation = await authService.validateInviteToken(inviteToken);
        if (!validation.valid) {
          setTokenError(validation.message || 'Taklifnoma kodi yaroqsiz yoki muddati tugagan.');
        }
      } catch (err) {
        setTokenError(err.response?.data?.message || 'Taklifnomani tekshirishda xatolik yuz berdi.');
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [searchParams]);

  // 2. Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // 3. Clear errors on unmount
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email manzili majburiy';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email formati noto\'g\'ri';
    }

    if (!formData.firstName.trim()) {
      errors.firstName = 'Ism majburiy';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Familiya majburiy';
    }

    if (!formData.password) {
      errors.password = 'Parol majburiy';
    } else if (formData.password.length < 6) {
      errors.password = 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Parollar mos kelmadi';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await register({
        token,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  if (isValidating) {
    return (
      <div className="login-page">
        <LoadingSpinner fullScreen text="Taklifnomani tekshirilmoqda..." />
      </div>
    );
  }

  return (
    <div className="login-page">
      {/* Theme Toggle */}
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10 }}>
        <ThemeToggle />
      </div>

      {/* Left Branding Panel */}
      <div className="login-left">
        <div className="login-brand animate-fade-in-up">
          <h1>HR Platform</h1>
          <p>Yangi xodim sifatida ro'yxatdan o'tish va tizimda o'z faoliyatingizni boshlash.</p>
        </div>
      </div>

      {/* Right Registration Form */}
      <div className="login-right">
        <div className="login-form-wrapper">
          <h2 className="login-form-title">Ro'yxatdan o'tish</h2>
          <p className="login-form-subtitle">Tizimga a'zo bo'lish uchun ma'lumotlaringizni to'ldiring.</p>

          {/* Token error or Global registration error */}
          {(tokenError || registerError) && (
            <div className="login-error">
              {tokenError || registerError}
            </div>
          )}

          {!tokenError && (
            <form onSubmit={handleSubmit} className="login-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input
                  label="Ism"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Ali"
                  error={formErrors.firstName}
                  required
                />
                <Input
                  label="Familiya"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Valiyev"
                  error={formErrors.lastName}
                  required
                />
              </div>

              <Input
                label="Email manzili"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ali.valiyev@company.com"
                error={formErrors.email}
                required
              />

              <Input
                label="Parol"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Kamida 6 belgi"
                error={formErrors.password}
                required
              />

              <Input
                label="Parolni tasdiqlash"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••"
                error={formErrors.confirmPassword}
                required
              />

              <Button
                type="submit"
                fullWidth
                loading={isRegistering}
                disabled={isRegistering}
                style={{ marginTop: '0.5rem' }}
              >
                Ro'yxatdan o'tish
              </Button>
            </form>
          )}

          {tokenError && (
            <Button
              variant="outline"
              fullWidth
              onClick={() => navigate('/login')}
              style={{ marginTop: '1rem' }}
            >
              Kirish sahifasiga o'tish
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
