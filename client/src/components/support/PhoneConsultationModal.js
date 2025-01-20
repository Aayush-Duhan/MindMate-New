import React, { useState } from 'react';
import { PhoneIcon, XMarkIcon } from '@heroicons/react/24/outline';

const PhoneConsultationModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    reason: '',
    priority: 'normal'
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    if (!formData.reason) {
      newErrors.reason = 'Reason for consultation is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({ phoneNumber: '', reason: '', priority: 'normal' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        
        <div className="relative bg-[#111] rounded-2xl w-full max-w-md p-8 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <PhoneIcon className="w-5 h-5 text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Request Phone Consultation</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className={`w-full px-4 py-2 bg-[#1a1a1a] border ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white focus:outline-none focus:border-green-500`}
                placeholder="+1 (555) 000-0000"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Reason for Consultation
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className={`w-full px-4 py-2 bg-[#1a1a1a] border ${
                  errors.reason ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white focus:outline-none focus:border-green-500 h-32 resize-none`}
                placeholder="Please briefly describe your reason for consultation..."
              />
              {errors.reason && (
                <p className="mt-1 text-sm text-red-500">{errors.reason}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Request Call
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhoneConsultationModal;
