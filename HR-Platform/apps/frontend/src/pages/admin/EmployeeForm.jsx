import React, { useState, useEffect, useRef } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import employeeService from '../../services/employeeService';
import useToast from '../../hooks/useToast';

/**
 * EmployeeForm Component
 * Professional form for creating or updating employee profiles
 */
export function EmployeeForm({ employee = null, onSubmitSuccess, onCancel }) {
  const { toast } = useToast();
  const isEditing = !!employee;
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    employeeNumber: '27',
    fullName: '',
    branch: '',
    department: '',
    position: '',
    joinDate: new Date().toISOString().split('T')[0],
    birthDate: '',
    pnfl: '',
    phone: '',
    email: '',
    salaryType: 'Oylik',
    salaryAmount: '',
    status: 'Faol',
    kpiTemplate: '',
    photo: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Branch options
  const branches = [
    { value: '', label: 'Tanlang...' },
    { value: 'beeline', label: 'Beeline' },
    { value: 'stomatologiya', label: 'Stomatologiya' },
    { value: 'tuman', label: 'Tuman' },
  ];

  // Department options (Bo'lim)
  const departments = [
    { value: '', label: 'Tanlang...' },
    { value: 'moliya', label: 'Moliya' },
    { value: 'hr', label: 'HR' },
    { value: 'sotuv', label: 'Sotuv' },
    { value: 'kassir', label: 'Kassir' },
    { value: 'oquv', label: 'O\'quv' },
    { value: 'boshqaruv', label: 'Boshqaruv' },
    { value: 'texnik', label: 'Texnik bo\'lim' },
  ];

  // Position options (Lavozim)
  const positions = [
    { value: '', label: 'Tanlang...' },
    { value: 'moliya', label: 'Moliya' },
    { value: 'hr', label: 'HR' },
    { value: 'sotuv', label: 'Sotuv' },
    { value: 'kassir', label: 'Kassir' },
    { value: 'mentor', label: 'Mentor' },
    { value: 'boshqaruv', label: 'Boshqaruv' },
    { value: 'texnik', label: 'Texnik bo\'lim' },
  ];

  // Pre-fill form if editing
  useEffect(() => {
    if (employee) {
      // Parse employee data for editing
      let formattedJoinDate = '';
      let formattedBirthDate = '';

      if (employee.join_date) {
        try {
          formattedJoinDate = new Date(employee.join_date).toISOString().split('T')[0];
        } catch (e) {
          formattedJoinDate = employee.join_date;
        }
      }

      if (employee.birth_date) {
        try {
          formattedBirthDate = new Date(employee.birth_date).toISOString().split('T')[0];
        } catch (e) {
          formattedBirthDate = employee.birth_date;
        }
      }

      setFormData({
        employeeNumber: employee.employee_number || '27',
        fullName: `${employee.first_name || ''} ${employee.last_name || ''}`.trim(),
        branch: employee.branch || '',
        department: employee.department || '',
        position: employee.position || '',
        joinDate: formattedJoinDate,
        birthDate: formattedBirthDate,
        pnfl: employee.pnfl || '',
        phone: employee.phone || '',
        email: employee.email || '',
        salaryType: employee.salary_type || 'Oylik',
        salaryAmount: employee.salary_amount || '',
        status: employee.status || 'Faol',
        kpiTemplate: employee.kpi_template || '',
        photo: null,
      });

      if (employee.photo_url) {
        setPhotoPreview(employee.photo_url);
      }
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Fayl hajmi 5MB dan oshmasligi kerak');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Faqat rasm fayllari yuklash mumkin');
        return;
      }

      setFormData((prev) => ({
        ...prev,
        photo: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Ism Familiya kiritilishi shart';
    }

    if (!formData.branch) {
      errors.branch = 'Filial tanlanishi shart';
    }

    if (!formData.position.trim()) {
      errors.position = 'Lavozim tanlanishi shart';
    }

    if (!formData.joinDate) {
      errors.joinDate = 'Ishga kirgan sana kiritilishi shart';
    }

    if (formData.pnfl && !/^\d{14}$/.test(formData.pnfl)) {
      errors.pnfl = 'PNFL 14 ta raqamdan iborat bo\'lishi kerak';
    }

    if (formData.phone && !/^\+?[0-9]{7,15}$/.test(formData.phone.replace(/[\s-()]/g, ''))) {
      errors.phone = 'Telefon raqam formati noto\'g\'ri (Masalan: +998901234567)';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email formati noto\'g\'ri';
    }

    if (!formData.salaryAmount || parseFloat(formData.salaryAmount) <= 0) {
      errors.salaryAmount = 'Maosh miqdori kiritilishi shart';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Iltimos, barcha majburiy maydonlarni to\'ldiring');
      return;
    }

    setSubmitting(true);
    try {
      // Split full name into first and last name
      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const payload = {
        employeeNumber: formData.employeeNumber,
        firstName: firstName,
        lastName: lastName,
        branch: formData.branch,
        department: formData.department,
        position: formData.position,
        joinDate: formData.joinDate,
        birthDate: formData.birthDate || null,
        pnfl: formData.pnfl || null,
        phone: formData.phone || null,
        email: formData.email || null,
        salaryType: formData.salaryType,
        salaryAmount: parseFloat(formData.salaryAmount),
        status: formData.status,
        kpiTemplate: formData.kpiTemplate || null,
      };

      if (isEditing) {
        await employeeService.updateEmployee(employee.id, payload);
        toast.success('Xodim ma\'lumotlari muvaffaqiyatli yangilandi!');
      } else {
        await employeeService.createEmployee(payload);
        toast.success('Yangi xodim muvaffaqiyatli qo\'shildi!');
      }

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        const errors = {};
        err.response.data.errors.forEach((e) => {
          errors[e.field] = e.message;
        });
        setFormErrors(errors);
        toast.error('Kiritilgan ma\'lumotlarda xatolik bor, iltimos tekshiring.');
      } else {
        const errorMsg = err.response?.data?.message || 'Xatolik yuz berdi';
        toast.error(errorMsg);
      }
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Employee Number & Full Name */}
      <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem' }} className="form-row">
        <Input
          label="Xodim raqami"
          type="text"
          name="employeeNumber"
          value={formData.employeeNumber}
          onChange={handleChange}
          error={formErrors.employeeNumber}
        />
        <Input
          label="Ism Familiya"
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Alisher Karimov"
          error={formErrors.fullName}
          required
        />
      </div>

      {/* Branch & Bo'lim */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label className="form-label">
            Filial <span style={{ color: 'var(--error)' }}>*</span>
          </label>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="form-input"
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--bg-primary)',
              border: `1px solid ${formErrors.branch ? 'var(--error)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-lg)',
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            {branches.map((branch) => (
              <option key={branch.value} value={branch.value}>
                {branch.label}
              </option>
            ))}
          </select>
          {formErrors.branch && (
            <span style={{ fontSize: '0.75rem', color: 'var(--error)' }}>{formErrors.branch}</span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label className="form-label">Bo'lim</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="form-input"
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--bg-primary)',
              border: `1px solid ${formErrors.department ? 'var(--error)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-lg)',
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            {departments.map((dept) => (
              <option key={dept.value} value={dept.value}>
                {dept.label}
              </option>
            ))}
          </select>
          {formErrors.department && (
            <span style={{ fontSize: '0.75rem', color: 'var(--error)' }}>{formErrors.department}</span>
          )}
        </div>
      </div>

      {/* Position (Lavozim) & Join Date */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label className="form-label">
            Lavozim <span style={{ color: 'var(--error)' }}>*</span>
          </label>
          <select
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="form-input"
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--bg-primary)',
              border: `1px solid ${formErrors.position ? 'var(--error)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-lg)',
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            {positions.map((pos) => (
              <option key={pos.value} value={pos.value}>
                {pos.label}
              </option>
            ))}
          </select>
          {formErrors.position && (
            <span style={{ fontSize: '0.75rem', color: 'var(--error)' }}>{formErrors.position}</span>
          )}
        </div>

        <Input
          label="Ishga kirgan sana"
          type="date"
          name="joinDate"
          value={formData.joinDate}
          onChange={handleChange}
          error={formErrors.joinDate}
          required
        />
      </div>

      {/* Birth Date & PNFL */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
        <Input
          label="Tug'ilgan kuni (ixtiyoriy)"
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          error={formErrors.birthDate}
        />
        <Input
          label="PNFL (ixtiyoriy)"
          type="text"
          name="pnfl"
          value={formData.pnfl}
          onChange={handleChange}
          placeholder="12345678901234"
          error={formErrors.pnfl}
          maxLength={14}
        />
      </div>

      {/* Phone & Email */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
        <Input
          label="Telefon"
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+998 90 123 45 67"
          error={formErrors.phone}
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="employee@company.com"
          error={formErrors.email}
        />
      </div>

      {/* Salary Type & Amount */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1rem' }} className="form-row">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label className="form-label">Maosh turi</label>
          <select
            name="salaryType"
            value={formData.salaryType}
            onChange={handleChange}
            className="form-input"
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            <option value="Oylik">Oylik</option>
            <option value="Haftalik">Haftalik</option>
            <option value="15 Kunlik">15 Kunlik</option>
            <option value="Kunlik">Kunlik</option>
            <option value="Soatlik">Soatlik</option>
          </select>
        </div>

        <Input
          label="Maosh miqdori (UZS)"
          type="number"
          name="salaryAmount"
          value={formData.salaryAmount}
          onChange={handleChange}
          placeholder="5000000"
          error={formErrors.salaryAmount}
          required
        />
      </div>

      {/* Status & KPI Template */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1rem' }} className="form-row">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label className="form-label">Holat</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-input"
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            <option value="Faol">Faol</option>
            <option value="Nofaol">Nofaol</option>
            <option value="Ta'tilda">Ta'tilda</option>
            <option value="Bekor qilingan">Bekor qilingan</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label className="form-label">KPI Shablon</label>
          <select
            name="kpiTemplate"
            value={formData.kpiTemplate}
            onChange={handleChange}
            className="form-input"
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            <option value="">— KPI shablon yo'q —</option>
            <option value="standard">Standart KPI</option>
            <option value="sales">Sotuv KPI</option>
            <option value="technical">Texnik KPI</option>
            <option value="management">Boshqaruv KPI</option>
          </select>
        </div>
      </div>

      {/* Photo Upload */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label className="form-label">Xodim rasmi (yuz tekshiruvi uchun)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handlePhotoClick}
            icon="📷"
          >
            Rasm yuklash
          </Button>
          {photoPreview && (
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '2px solid var(--border)',
            }}>
              <img
                src={photoPreview}
                alt="Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-4" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
        <Button variant="ghost" onClick={onCancel} disabled={submitting}>
          Bekor qilish
        </Button>
        <Button variant="primary" type="submit" loading={submitting} disabled={submitting}>
          {isEditing ? 'Saqlash' : 'Qo\'shish'}
        </Button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </form>
  );
}

export default EmployeeForm;
