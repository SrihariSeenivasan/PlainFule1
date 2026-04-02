'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, Mail, Phone, MapPin, Globe, Edit3, Save, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { userAPI, User } from '@/lib/api';
import { F_SIZE, BRAND } from '@/lib/typography';

export default function UserProfile() {
  const { user: authUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const profile = await userAPI.getProfile();
        const userData = profile && typeof profile === 'object' && 'firstName' in profile ? profile : {
          firstName: authUser?.firstName || '',
          lastName: authUser?.lastName || '',
          email: authUser?.email || '',
          phone: authUser?.phone || '',
          address: authUser?.address || '',
          city: authUser?.city || '',
          state: authUser?.state || '',
          zip: authUser?.zip || '',
          country: authUser?.country || '',
        };
        setFormData(userData as typeof formData);
      } catch (err) {
        console.error('Failed to load profile:', err);
        // Use auth user data as fallback
        if (authUser) {
          setFormData({
            firstName: authUser.firstName || '',
            lastName: authUser.lastName || '',
            email: authUser.email || '',
            phone: authUser.phone || '',
            address: authUser.address || '',
            city: authUser.city || '',
            state: authUser.state || '',
            zip: authUser.zip || '',
            country: authUser.country || '',
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (authUser) {
      loadProfile();
    }
  }, [authUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await userAPI.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
      } as Partial<User>);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };



  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="space-y-8"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: F_SIZE.lg, color: BRAND.primary }} className="font-black tracking-tight mb-1 uppercase">
            Account Central
          </h1>
          <p style={{ fontSize: F_SIZE.sm, color: BRAND.secondary }} className="font-semibold uppercase letter-spacing-widest">
            Manage your biological profile
          </p>
        </div>
        {!isEditing && (
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: BRAND.primary, color: '#fff' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm border border-[#0a3d1f20]"
            style={{ color: BRAND.primary, fontSize: F_SIZE.sm }}
          >
            <Edit3 size={16} /> Edit Profile
          </motion.button>
        )}
      </div>

      {/* Profile Card */}
      <div 
        className="relative overflow-hidden"
        style={{
          background: BRAND.light,
          backdropFilter: 'blur(32px)',
          borderRadius: 32,
          padding: '40px',
          border: `1px solid ${BRAND.tertiary}`,
          boxShadow: `0 20px 50px ${BRAND.light}`
        }}
      >
        {/* Messages */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center gap-3 font-semibold"
              style={{ fontSize: F_SIZE.sm }}
            >
              <X size={18} /> {error}
            </motion.div>
          )}
          {message && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-100 text-green-800 rounded-2xl flex items-center gap-3 font-semibold"
              style={{ fontSize: F_SIZE.sm }}
            >
              <CheckCircle2 size={18} /> {message}
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex items-center gap-4 p-8 text-gray-500 animate-pulse font-bold">
            <div className="w-12 h-12 rounded-full bg-gray-200" />
            Loading your credentials...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* Fields Mapping */}
            {[
              { label: 'First Name', name: 'firstName', icon: UserIcon },
              { label: 'Last Name', name: 'lastName', icon: UserIcon },
              { label: 'Email Address', name: 'email', icon: Mail, readonly: true },
              { label: 'Phone Number', name: 'phone', icon: Phone },
              { label: 'Address', name: 'address', icon: MapPin },
              { label: 'City', name: 'city', icon: Globe },
              { label: 'State', name: 'state', icon: MapPin },
              { label: 'Zip Code', name: 'zip', icon: MapPin },
              { label: 'Country', name: 'country', icon: Globe },
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label 
                  style={{ fontSize: F_SIZE.sm, color: BRAND.primary, opacity: 0.6 }} 
                  className="font-black uppercase tracking-widest pl-1 block"
                >
                  {field.label}
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0a3d1f40] transition-colors group-hover:text-[#0a3d1f]">
                    <field.icon size={18} strokeWidth={2.5} />
                  </div>
                  {isEditing && !field.readonly ? (
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-[#0a3d1f10] focus:border-[#16a34a] focus:ring-4 focus:ring-[#16a34a08] outline-none transition-all font-bold text-[#0a3d1f]"
                      style={{ fontSize: F_SIZE.md }}
                    />
                  ) : (
                    <div 
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#0a3d1f05] border border-transparent font-bold text-[#0a3d1f]"
                      style={{ fontSize: F_SIZE.md }}
                    >
                      {formData[field.name as keyof typeof formData] || '—'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 flex justify-end gap-4"
          >
            <button
              onClick={() => { setIsEditing(false); setError(''); setMessage(''); }}
              className="px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[#0a3d1f60] hover:text-[#0a3d1f] hover:bg-[#0a3d1f05] transition-all"
              style={{ fontSize: F_SIZE.sm }}
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: BRAND.primaryDark }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={saving}
              className="px-10 py-3.5 bg-[#0a3d1f] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#0a3d1f20] disabled:bg-gray-300 transition-all flex items-center gap-3"
              style={{ fontSize: F_SIZE.sm }}
            >
              {saving ? 'Synchronizing...' : <><Save size={18} /> Save Vital Changes</>}
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
