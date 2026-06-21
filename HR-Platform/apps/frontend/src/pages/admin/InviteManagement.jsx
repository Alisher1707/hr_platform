import React, { useState, useEffect } from 'react';
import inviteService from '../../services/inviteService';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import useToast from '../../hooks/useToast';

/**
 * InviteManagement Component
 * Premium invite creation, table listing, deactivate, delete and copy clipboard actions
 */
export function InviteManagement() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [invites, setInvites] = useState([]);
  const [creating, setCreating] = useState(false);

  const fetchInvites = async () => {
    try {
      const data = await inviteService.getInvites();
      setInvites(data || []);
    } catch (err) {
      toast.error('Taklifnomalarni yuklashda xatolik yuz berdi');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const handleCreateInvite = async () => {
    setCreating(true);
    try {
      const newInvite = await inviteService.createInvite();
      toast.success('Yangi taklifnoma muvaffaqiyatli yaratildi!');
      setInvites((prev) => [newInvite, ...prev]);
    } catch (err) {
      toast.error('Taklifnoma yaratishda xatolik yuz berdi');
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await inviteService.deactivateInvite(id);
      toast.success('Taklifnoma muvaffaqiyatli faolsizlantirildi');
      // Update local state
      setInvites((prev) => 
        prev.map((inv) => (inv.id === id ? { ...inv, is_active: false } : inv))
      );
    } catch (err) {
      toast.error('Taklifnomani faolsizlantirishda xatolik yuz berdi');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Haqiqatan ham ushbu taklifnomani o\'chirib tashlamoqchimisiz?')) return;
    
    try {
      await inviteService.deleteInvite(id);
      toast.success('Taklifnoma o\'chirib tashlandi');
      setInvites((prev) => prev.filter((inv) => inv.id !== id));
    } catch (err) {
      toast.error('Taklifnomani o\'chirishda xatolik yuz berdi');
      console.error(err);
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('Taklifnoma havolasi buferga nusxalandi! 📋');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('uz-UZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateStr;
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Taklifnomalar ro'yxati yuklanmoqda..." />;
  }

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h2 className="page-title">Taklifnomalar havolalari</h2>
          <p className="page-subtitle">Kompaniyaning boshqa xodimlari ro'yxatdan o'tishi uchun taklifnomalar boshqaruvi.</p>
        </div>
        <div className="page-header-right">
          <Button 
            variant="primary" 
            onClick={handleCreateInvite} 
            loading={creating}
            icon="🔗"
          >
            Havola yaratish
          </Button>
        </div>
      </div>

      <Card>
        {invites.length === 0 ? (
          <EmptyState
            title="Taklifnomalar mavjud emas"
            text="Hozircha hech qanday taklifnoma yaratilmagan. Yuqoridagi tugmani bosib yangi havola yaratishingiz mumkin."
            icon="🔗"
            action={
              <Button variant="primary" onClick={handleCreateInvite} loading={creating}>
                Yangi havola yaratish
              </Button>
            }
          />
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Yaratilgan sana</th>
                  <th>Amal qilish muddati</th>
                  <th>Yaratuvchi</th>
                  <th>Ishlatuvchi</th>
                  <th>Holati</th>
                  <th style={{ textAlign: 'right' }}>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {invites.map((inv) => {
                  const isExpired = new Date(inv.expires_at) < new Date();
                  const isUsed = !!inv.used_at;
                  
                  let statusBadge = <Badge variant="success">Faol</Badge>;
                  if (isUsed) {
                    statusBadge = <Badge variant="info">Ishlatilgan</Badge>;
                  } else if (isExpired) {
                    statusBadge = <Badge variant="error">Muddati o'tgan</Badge>;
                  } else if (!inv.is_active) {
                    statusBadge = <Badge variant="warning">Nofaol</Badge>;
                  }

                  return (
                    <tr key={inv.id}>
                      <td>{formatDate(inv.created_at)}</td>
                      <td>{formatDate(inv.expires_at)}</td>
                      <td>
                        {inv.created_by 
                          ? `${inv.created_by.first_name} ${inv.created_by.last_name}` 
                          : 'Tizim'}
                      </td>
                      <td>
                        {inv.used_by 
                          ? `${inv.used_by.first_name} ${inv.used_by.last_name} (${inv.used_by.email})` 
                          : '—'}
                      </td>
                      <td>{statusBadge}</td>
                      <td>
                        <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                          {!isUsed && !isExpired && inv.is_active && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => copyToClipboard(inv.invite_url)}
                              >
                                Nusxalash
                              </Button>
                              <Button 
                                variant="secondary" 
                                size="sm" 
                                onClick={() => handleDeactivate(inv.id)}
                                style={{ color: 'var(--warning)' }}
                              >
                                Faolsizlantirish
                              </Button>
                            </>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(inv.id)}
                            style={{ color: 'var(--error)' }}
                          >
                            O'chirish
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default InviteManagement;
