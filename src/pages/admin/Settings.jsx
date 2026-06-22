import React, { useState, useEffect } from 'react';
import {
  IconBuildingStore,
  IconUser,
  IconClipboardList,
  IconDeviceFloppy,
  IconCircleCheck,
  IconBrandWhatsapp,
  IconPhone,
  IconMail,
  IconMapPin,
  IconLoader,
  IconTrash,
} from '@tabler/icons-react';
import { supabase } from '../../lib/supabase';
import './Settings.css';

// ── Helpers ──────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'inquiries', label: 'B2B Inquiries', icon: <IconClipboardList size={18} /> },
  { id: 'store',     label: 'Store Info',    icon: <IconBuildingStore size={18} /> },
  { id: 'account',   label: 'My Account',   icon: <IconUser size={18} /> },
];

// ── Tab: Inquiries ────────────────────────────────────────────────────────────
const InquiriesTab = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setInquiries(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchInquiries(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    await supabase.from('inquiries').delete().eq('id', id);
    setInquiries(prev => prev.filter(i => i.id !== id));
  };

  const formatDate = (str) => str ? new Date(str).toLocaleDateString('en-PK', {
    day: '2-digit', month: 'short', year: 'numeric',
  }) : '—';

  if (loading) return <div className="loading-text"><IconLoader className="spin" size={28} /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--color-brand-primary)' }}>B2B Inquiry Submissions</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-tertiary)', marginTop: '0.2rem' }}>
            {inquiries.length} total {inquiries.length === 1 ? 'inquiry' : 'inquiries'}
          </p>
        </div>
        <button
          className="btn-outline"
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          onClick={fetchInquiries}
        >
          Refresh
        </button>
      </div>

      {inquiries.length === 0 ? (
        <div className="settings-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-tertiary)' }}>
          No inquiries yet. They'll appear here when customers submit the B2B form.
        </div>
      ) : (
        <div className="inquiries-table-wrap">
          <table className="inquiries-table">
            <thead>
              <tr>
                <th>Name / Company</th>
                <th>Contact</th>
                <th>City</th>
                <th>Categories</th>
                <th>Budget</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map(inq => (
                <tr key={inq.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{inq.name}</div>
                    {inq.company && <div style={{ fontSize: '0.78rem', color: 'var(--color-text-tertiary)' }}>{inq.company}</div>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <IconPhone size={13} />{inq.phone}
                    </div>
                    {inq.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--color-text-tertiary)', marginTop: '0.2rem' }}>
                        <IconMail size={13} />{inq.email}
                      </div>
                    )}
                  </td>
                  <td><IconMapPin size={13} style={{ marginRight: 3 }} />{inq.city || '—'}</td>
                  <td>
                    {inq.categories
                      ? inq.categories.split(',').map(cat => (
                          <span key={cat} className="inq-badge" style={{ marginRight: 4, marginBottom: 3 }}>{cat.trim()}</span>
                        ))
                      : '—'}
                  </td>
                  <td style={{ fontSize: '0.82rem' }}>{inq.budget || '—'}</td>
                  <td className="inq-date">{formatDate(inq.created_at)}</td>
                  <td>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(inq.id)}
                      title="Delete inquiry"
                      style={{ marginLeft: 'auto' }}
                    >
                      <IconTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ── Tab: Store Info ───────────────────────────────────────────────────────────
const StoreInfoTab = () => {
  const [form, setForm] = useState({
    storeName: 'Pothowar Electric',
    whatsapp: '+92 3348700655',
    phone: '051-5530360',
    email: 'info@pothowarelectric.pk',
    address: 'Iqbal Road Cometti Chowk Near Shirin Bakery, Rawalpindi, Pakistan',
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('site_settings').select('key, value');
      if (data && data.length > 0) {
        const mapped = {};
        data.forEach(row => { mapped[row.key] = row.value; });
        setForm(prev => ({ ...prev, ...mapped }));
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setSaved(false);
    setErrorMsg('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');
    const rows = Object.entries(form).map(([key, value]) => ({ key, value }));
    const { error } = await supabase
      .from('site_settings')
      .upsert(rows, { onConflict: 'key' });
    if (!error) {
      setSaved(true);
    } else {
      console.error(error);
      setErrorMsg(error.message || 'Failed to save. Did you run the SQL to create the site_settings table?');
    }
    setIsSaving(false);
  };

  if (loading) return <div className="loading-text"><IconLoader className="spin" size={28} /></div>;

  return (
    <form onSubmit={handleSave}>
      <div className="settings-card">
        <div className="settings-card-title">Business Information</div>
        <div className="settings-card-subtitle">These details are used across your website contact pages and WhatsApp links.</div>

        <div className="settings-form-grid">
          <div className="settings-form-group full-width">
            <label>Store / Business Name</label>
            <input name="storeName" value={form.storeName} onChange={handleChange} placeholder="Pothowar Electric" />
          </div>
          <div className="settings-form-group">
            <label><IconBrandWhatsapp size={14} style={{ marginRight: 4 }} />WhatsApp Number</label>
            <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="+92 3348700655" />
          </div>
          <div className="settings-form-group">
            <label><IconPhone size={14} style={{ marginRight: 4 }} />Landline / Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="051-5530360" />
          </div>
          <div className="settings-form-group full-width">
            <label><IconMail size={14} style={{ marginRight: 4 }} />Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="info@pothowarelectric.pk" />
          </div>
          <div className="settings-form-group full-width">
            <label><IconMapPin size={14} style={{ marginRight: 4 }} />Store Address</label>
            <textarea name="address" value={form.address} onChange={handleChange} rows={2} />
          </div>
        </div>

        <div className="settings-save-row">
          <button type="submit" className="btn-primary" disabled={isSaving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isSaving ? <IconLoader className="spin" size={18} /> : <IconDeviceFloppy size={18} />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          {saved && (
            <span className="settings-success-msg">
              <IconCircleCheck size={16} /> Saved successfully!
            </span>
          )}
        </div>
        {errorMsg && (
          <div className="settings-error-msg">
            {errorMsg}
          </div>
        )}
        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-tertiary)', marginTop: '1rem' }}>
          Note: After saving, redeploy your site for changes to show publicly.
        </p>
      </div>
    </form>
  );
};

// ── Tab: Account ──────────────────────────────────────────────────────────────
const AccountTab = () => {
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState({ msg: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setStatus({ msg: '', type: '' });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (form.newPassword.length < 6) {
      setStatus({ msg: 'Password must be at least 6 characters.', type: 'error' });
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setStatus({ msg: 'Passwords do not match.', type: 'error' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: form.newPassword });
    if (error) {
      setStatus({ msg: error.message, type: 'error' });
    } else {
      setStatus({ msg: 'Password updated successfully!', type: 'success' });
      setForm({ newPassword: '', confirmPassword: '' });
    }
    setLoading(false);
  };

  // Get current user email
  const [userEmail, setUserEmail] = useState('');
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data?.user?.email || '');
    });
  }, []);

  return (
    <div>
      <div className="settings-card" style={{ marginBottom: '1.5rem' }}>
        <div className="settings-card-title">Account Details</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'var(--color-brand-primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.3rem', fontWeight: 700,
          }}>
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Admin User</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{userEmail}</div>
          </div>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-title">Change Password</div>
        <div className="settings-card-subtitle">Choose a strong password to keep your admin account secure.</div>

        <form onSubmit={handleChangePassword}>
          <div className="settings-form-grid">
            <div className="settings-form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
              />
            </div>
            <div className="settings-form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                required
              />
            </div>
          </div>

          {status.msg && (
            <div className={status.type === 'success' ? 'settings-success-msg' : 'settings-error-msg'} style={{ marginTop: '0.75rem' }}>
              {status.type === 'success' && <IconCircleCheck size={16} />} {status.msg}
            </div>
          )}

          <div className="settings-save-row">
            <button type="submit" className="btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {loading ? <IconLoader className="spin" size={18} /> : <IconDeviceFloppy size={18} />}
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main Settings Page ────────────────────────────────────────────────────────
const Settings = () => {
  const [activeTab, setActiveTab] = useState('inquiries');

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'var(--color-brand-primary)', fontSize: '1.5rem' }}>Settings</h2>
        <p style={{ color: 'var(--color-text-tertiary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Manage your store information, inquiries, and account details.
        </p>
      </div>

      {/* Tabs */}
      <div className="settings-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`settings-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'inquiries' && <InquiriesTab />}
      {activeTab === 'store'     && <StoreInfoTab />}
      {activeTab === 'account'   && <AccountTab />}
    </div>
  );
};

export default Settings;
