import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import employeeService from '../../services/employeeService';
import useToast from '../../hooks/useToast';

/**
 * EmployeeForm Component
 * Reusable form for creating or updating employee profiles
 */
export function EmployeeForm({ employee = null, onSubmitSuccess, onCancel }) {
  const { toast } = useToast();
  const isEditing = !!employee;
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    birthDate: '',
    experience: 0,
    position: '',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill form if editing
  useEffect(() => {
    if (employee) {
      // Format date to YYYY-MM-DD
      let formattedDate = '';
      if (employee.birth_date) {
        try {
          formattedDate = new Date(employee.birth_date).toISOString().split('T')[0];
        } catch (e) {
          formattedDate = employee.birth_date;
        }
      }

      setFormData({
        firstName: employee.first_name || '',
        lastName: employee.last_name || '',
        phone: employee.phone || '',
        address: employee.address || '',
        birthDate: formattedDate,
        experience: employee.experience || 0,
        position: employee.position || '',
        notes: employee.notes || '',
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'experience' ? parseInt(value) || 0 : value,
    }));
    
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) errors.firstName = 'Ism kiritilishi shart';
    if (!formData.lastName.trim()) errors.lastName = 'Familiya kiritilishi shart';
    
    if (formData.phone && !/^\+?[0-9]{7,15}$/.test(formData.phone.replace(/[\s-()]/g, ''))) {
      errors.phone = 'Telefon raqam formati noto\'g\'ri (Masalan: +998901234567)';
    }

    if (formData.experience < 0 || formData.experience > 80) {
      errors.experience = 'Ish tajribasi 0 va 80 yosh orasida bo\'lishi kerak';
    }

    if (!isEditing && !formData.position.trim()) {
      errors.position = 'Lavozim kiritilishi shart';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing) {
        // Update employee details (only specific fields allowed on update)
        const updatePayload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || null,
          address: formData.address || null,
          birthDate: formData.birthDate || null,
          experience: formData.experience,
        };
        await employeeService.updateEmployee(employee.id, updatePayload);
        toast.success('Xodim ma\'lumotlari muvaffaqiyatli yangilandi!');
      } else {
        // Create employee and candidate application
        await employeeService.createEmployee(formData);
        toast.success('Yangi xodim va uning arizasi muvaffaqiyatli qo\'shildi!');
      }
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Xatolik yuz berdi';
      toast.error(errorMsg);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
        <Input
          label="Ismi"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={formErrors.firstName}
          required
        />
        <Input
          label="Familiyasi"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={formErrors.lastName}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
        <Input
          label="Telefon raqami"
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+998901234567"
          error={formErrors.phone}
        />
        <Input
          label="Tug'ilgan sanasi"
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          error={formErrors.birthDate}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
        <Input
          label="Lavozimi (Lavozimi/Mutaxassisligi)"
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="Dasturchi"
          error={formErrors.position}
          disabled={isEditing} // position only on creation as it relates to application
          required={!isEditing}
        />
        <Input
          label="Ish tajribasi (yil)"
          type="number"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          error={formErrors.experience}
        />
      </div>

      <Input
        label="Manzili"
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Toshkent sh., Chilonzor tumani"
        error={formErrors.address}
      />

      {!isEditing && (
        <Textarea
          label="Qo'shimcha izohlar"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Nomzod yoki ariza haqida batafsil ma'lumot..."
          rows={3}
        />
      )}

      <div className="flex justify-end gap-3 mt-4" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
        <Button variant="ghost" onClick={onCancel} disabled={submitting}>
          Bekor qilish
        </Button>
        <Button variant="primary" type="submit" loading={submitting} disabled={submitting}>
          {isEditing ? 'Saqlash' : 'Qo\'shish'}
        </Button>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </form>
  );
}

export default EmployeeForm;
