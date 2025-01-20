const express = require('express');
const router = express.Router();
const { protect: auth } = require('../middleware/auth');
const PhoneConsultation = require('../models/PhoneConsultation');
const User = require('../models/User');

// Request a phone consultation
router.post('/', auth, async (req, res) => {
  try {
    const { reason, phoneNumber, priority } = req.body;

    // Create new consultation request
    const consultation = await PhoneConsultation.create({
      user: req.user._id,
      reason,
      phoneNumber,
      priority: priority || 'normal'
    });

    // Find available counselors (you may want to implement a more sophisticated matching system)
    const counselors = await User.find({ role: 'counselor', isAvailable: true });
    
    if (counselors.length > 0) {
      // Assign to first available counselor for now
      consultation.counselor = counselors[0]._id;
      consultation.status = 'accepted';
      await consultation.save();
    }

    await consultation.populate('counselor', 'name email');
    
    res.status(201).json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Phone consultation request error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get user's consultation history
router.get('/my', auth, async (req, res) => {
  try {
    const consultations = await PhoneConsultation.find({ user: req.user._id })
      .populate('counselor', 'name email')
      .sort('-createdAt');

    res.json({
      success: true,
      data: consultations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update consultation status (for counselors)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const consultation = await PhoneConsultation.findById(req.params.id);
    
    if (!consultation) {
      return res.status(404).json({
        success: false,
        error: 'Consultation not found'
      });
    }

    // Verify that the user is either the assigned counselor or an admin
    if (consultation.counselor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }

    consultation.status = req.body.status;
    if (req.body.notes) {
      consultation.notes = req.body.notes;
    }
    
    await consultation.save();

    res.json({
      success: true,
      data: consultation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Cancel consultation (for users)
router.delete('/:id', auth, async (req, res) => {
  try {
    const consultation = await PhoneConsultation.findById(req.params.id);
    
    if (!consultation) {
      return res.status(404).json({
        success: false,
        error: 'Consultation not found'
      });
    }

    if (consultation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }

    consultation.status = 'cancelled';
    await consultation.save();

    res.json({
      success: true,
      message: 'Consultation cancelled successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
