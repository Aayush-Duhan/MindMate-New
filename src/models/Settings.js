const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  notifications: {
    emailNotifications: { type: Boolean, default: true },
    systemAlerts: { type: Boolean, default: true },
    maintenanceAlerts: { type: Boolean, default: true },
    securityAlerts: { type: Boolean, default: true }
  },
  security: {
    passwordExpiry: { type: Number, default: 90 },
    sessionTimeout: { type: Number, default: 30 },
    maxLoginAttempts: { type: Number, default: 5 }
  },
  system: {
    maintenanceMode: { type: Boolean, default: false },
    debugMode: { type: Boolean, default: false },
    logLevel: { type: String, default: 'info', enum: ['error', 'warn', 'info', 'debug'] },
    backupFrequency: { type: String, default: 'daily', enum: ['hourly', 'daily', 'weekly', 'monthly'] }
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
SettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', SettingsSchema);
