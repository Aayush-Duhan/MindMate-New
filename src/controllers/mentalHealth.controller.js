const MentalHealthRecord = require('../models/MentalHealthRecord');
const crypto = require('crypto');

// Encryption helper functions
const encryptData = (data) => {
  try {
    if (!process.env.ENCRYPTION_KEY) {
      throw new Error('Encryption key is not defined');
    }

    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(JSON.stringify(data));
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    return { 
      iv: iv.toString('hex'), 
      data: encrypted.toString('hex') 
    };
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
};

// Add this decryption function after the encryptData function
const decryptData = (encryptedData) => {
  try {
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    
    let decrypted = decipher.update(Buffer.from(encryptedData.data, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return JSON.parse(decrypted.toString());
  } catch (error) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
};

// @desc    Create mental health record
// @route   POST /api/records
// @access  Private/Counselor
const createRecord = async (req, res) => {
  try {
    const { type, data, severity, userId } = req.body;

    if (!data) {
      return res.status(400).json({ message: 'Data is required' });
    }

    // Encrypt sensitive data
    let encryptedData;
    try {
      encryptedData = encryptData(data);
    } catch (error) {
      return res.status(500).json({ 
        message: 'Failed to encrypt data', 
        error: error.message 
      });
    }

    const record = await MentalHealthRecord.create({
      userId: userId || req.user._id,
      type,
      encryptedData,
      severity,
      assignedTo: req.user._id,
      isAnonymous: !userId
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get records for a user
// @route   GET /api/records/user/:userId
// @access  Private
const getUserRecords = async (req, res) => {
  try {
    const records = await MentalHealthRecord.find({
      userId: req.params.userId
    }).populate('assignedTo', 'email profile');

    // Decrypt data for each record
    const decryptedRecords = records.map(record => {
      const recordObj = record.toObject();
      try {
        recordObj.data = decryptData(record.encryptedData);
        delete recordObj.encryptedData; // Remove encrypted data from response
        return recordObj;
      } catch (error) {
        console.error(`Failed to decrypt record ${record._id}: ${error.message}`);
        return recordObj;
      }
    });

    res.json(decryptedRecords);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get counselor's assigned records
// @route   GET /api/records/assigned
// @access  Private/Counselor
const getAssignedRecords = async (req, res) => {
  try {
    const records = await MentalHealthRecord.find({
      assignedTo: req.user._id
    }).populate('userId', 'email profile');

    // Decrypt data for each record
    const decryptedRecords = records.map(record => {
      const recordObj = record.toObject();
      try {
        recordObj.data = decryptData(record.encryptedData);
        delete recordObj.encryptedData;
        return recordObj;
      } catch (error) {
        console.error(`Failed to decrypt record ${record._id}: ${error.message}`);
        return recordObj;
      }
    });

    res.json(decryptedRecords);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update record status
// @route   PUT /api/records/:id/status
// @access  Private/Counselor
const updateRecordStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const record = await MentalHealthRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    if (record.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this record' });
    }

    record.status = status;
    await record.save();

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createRecord,
  getUserRecords,
  getAssignedRecords,
  updateRecordStatus
}; 