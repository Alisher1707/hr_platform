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
 * Handles registration using an invitation token with premium styles, validations,
 * and dynamic job requirements checklists.
 */
export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, isAuthenticated, isLoading: isRegistering, error: registerError, clearError } = useAuthStore();

  const [token, setToken] = useState('');
  const [isValidating, setIsValidating] = useState(true);
  const [tokenError, setTokenError] = useState(null);
  const [inviteDetails, setInviteDetails] = useState(null);
  const [acceptedRequirements, setAcceptedRequirements] = useState(false);
  
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
        if (validation.valid) {
          setInviteDetails(validation.invite);
        } else {
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
    } else if (formData.password.length < 8) {
      errors.password = 'Parol kamida 8 ta belgidan iborat bo\'lishi kerak';
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
        // Set user role to EMPLOYEE if they are registering for a specific job
        role: inviteDetails?.position ? 'EMPLOYEE' : 'ADMIN',
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

  const isRequirementsCheckNeeded = inviteDetails?.position && inviteDetails?.requirements?.length > 0;

  return (
    <div className="login-page" style={{ overflowY: 'auto', padding: '2rem 1rem' }}>
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
        <div className="login-form-wrapper" style={{ width: '100%', maxWidth: '480px' }}>
          <h2 className="login-form-title">
            {inviteDetails?.position ? `${inviteDetails.position} lavozimiga ariza` : "Ro'yxatdan o'tish"}
          </h2>
          <p className="login-form-subtitle">
            {inviteDetails?.position 
              ? `Ushbu taklifnoma orqali siz ${inviteDetails.position} lavozimiga ishga kirish formasini to'ldirmoqdasiz.`
              : "Tizimga a'zo bo'lish uchun ma'lumotlaringizni to'ldiring."}
          </p>

          {/* Token error or Global registration error */}
          {(tokenError || registerError) && (
            <div className="login-error" style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--error)', fontSize: '0.875rem' }}>
              {tokenError || registerError}
            </div>
          )}

          {!tokenError && (
            <form onSubmit={handleSubmit} className="login-form">
              
              {/* Display invited position and requirements checklist if present */}
              {inviteDetails && inviteDetails.position && (
                <div style={{
                  background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-card) 100%)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  backdropFilter: 'blur(10px)'
                }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    💼 Tanlangan lavozim: <span style={{ color: 'var(--text-primary)' }}>{inviteDetails.position}</span>
                  </h3>
                  
                  {inviteDetails.requirements && inviteDetails.requirements.length > 0 && (
                    <>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, fontWeight: '600' }}>
                        Lavozim majburiyatlari va kundalik vazifalar:
                      </p>
                      <ul style={{ 
                        listStyle: 'none', 
                        margin: 0, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '0.5rem',
                        maxHeight: '150px',
                        overflowY: 'auto',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.75rem',
                        background: 'var(--bg-secondary)'
                      }}>
                        {inviteDetails.requirements.map((req, idx) => (
                          <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                            <span style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '0.85rem' }}>✓</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: '0.5rem', 
                        cursor: 'pointer', 
                        fontSize: '0.75rem', 
                        fontWeight: '600', 
                        color: 'var(--text-primary)', 
                        borderTop: '1px solid var(--border)', 
                        paddingTop: '0.75rem',
                        marginTop: '0.25rem',
                        userSelect: 'none'
                      }}>
                        <input
                          type="checkbox"
                          checked={acceptedRequirements}
                          onChange={(e) => setAcceptedRequirements(e.target.checked)}
                          style={{ marginTop: '0.1rem', cursor: 'pointer' }}
                          required
                        />
                        <span>Lavozim talablari va kundalik vazifalar bilan tanishdim va roziman</span>
                      </label>
                    </>
                  )}
                </div>
              )}

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
                placeholder="Kamida 8 belgi"
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
                disabled={isRegistering || (isRequirementsCheckNeeded && !acceptedRequirements)}
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
