const Settings = require('../models/Settings');

// Get system settings
const getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json({
      success: true,
      settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message
    });
  }
};

// Update system settings
const updateSettings = async (req, res) => {
  try {
    const { category, setting, value } = req.body;
    
    // Validate required fields
    if (!category || !setting || value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Get current settings
    let settings = await Settings.getSettings();

    // Update the specific setting
    if (!settings[category]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    settings[category][setting] = value;
    await settings.save();

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating settings',
      error: error.message
    });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
