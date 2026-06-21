import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ThemeToggle from '../../components/ui/ThemeToggle';

/**
 * LoginPage Component
 * High-end split layout login page matching globals.css classes
 */
export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const user = useAuthStore.getState().user;
      if (user?.role === 'HR') {
        navigate('/hr/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    }
  }, [isAuthenticated, navigate]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error on change
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
      errors.email = 'Email majburiy';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email formati noto\'g\'ri';
    }

    if (!formData.password) {
      errors.password = 'Parol majburiy';
    } else if (formData.password.length < 6) {
      errors.password = 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak';
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
      await login(formData.email, formData.password);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-page">
      {/* Theme Toggle - Top Right */}
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10 }}>
        <ThemeToggle />
      </div>

      {/* Left side: Premium Branding & Landing */}
      <div className="login-left">
        <div className="login-brand animate-fade-in-up">
          <h1>HR Platform</h1>
          <p>Kompaniya xodimlari va ishga qabul qilish jarayonlarini boshqarish tizimi.</p>
        </div>

        <div className="login-features animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="login-feature">
            <div className="login-feature-icon">📊</div>
            <span>Premium Dashboard & Analitika</span>
          </div>
          <div className="login-feature">
            <div className="login-feature-icon">📋</div>
            <span>Interaktiv Kanban Board</span>
          </div>
          <div className="login-feature">
            <div className="login-feature-icon">🔗</div>
            <span>Oson taklifnomalar jo'natish tizimi</span>
          </div>
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="login-right">
        <div className="login-form-wrapper">
          <h2 className="login-form-title">Xush kelibsiz!</h2>
          <p className="login-form-subtitle">Tizimga kirish uchun login ma'lumotlaringizni kiriting.</p>

          {/* Global error message */}
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <Input
              label="Email manzili"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@hrplatform.com"
              error={formErrors.email}
              required
            />

            <Input
              label="Maxfiy parol"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={formErrors.password}
              required
            />

            <Button
              type="submit"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
              style={{ marginTop: '0.5rem' }}
            >
              Kirish
            </Button>
          </form>

          {/* Demo account helper card */}
          <div className="login-demo animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="login-demo-title">Demo Hisoblar:</div>
            
            <div className="login-demo-item">
              <span>Admin:</span>
              <code>admin@hrplatform.com</code> / <code>Admin123!@#</code>
            </div>
            
            <div className="login-demo-item" style={{ marginTop: '0.25rem' }}>
              <span>HR Manager:</span>
              <code>hr@hrplatform.com</code> / <code>HR123!@#</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
