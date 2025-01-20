const express = require('express');
const router = express.Router();
const { protect: auth } = require('../middleware/auth');
const VideoConsultation = require('../models/VideoConsultation');
const User = require('../models/User');

// Schedule a video consultation
router.post('/', auth, async (req, res) => {
  try {
    const { scheduledDate, duration, topic, preferredTimeSlots } = req.body;

    // Validate date is in the future
    if (new Date(scheduledDate) < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Consultation date must be in the future'
      });
    }

    // Check for scheduling conflicts
    const conflictingConsultation = await VideoConsultation.findOne({
      scheduledDate: {
        $gte: new Date(scheduledDate),
        $lt: new Date(new Date(scheduledDate).getTime() + duration * 60000)
      },
      status: { $in: ['pending', 'confirmed'] }
    });

    if (conflictingConsultation) {
      return res.status(400).json({
        success: false,
        error: 'Time slot is already booked'
      });
    }

    // Find available counselors
    const availableCounselors = await User.find({
      role: 'counselor',
      isAvailable: true
    });

    const consultation = await VideoConsultation.create({
      user: req.user._id,
      scheduledDate,
      duration,
      topic,
      preferredTimeSlots: preferredTimeSlots || [],
      counselor: availableCounselors.length > 0 ? availableCounselors[0]._id : null
    });

    await consultation.populate('counselor', 'name email');

    res.status(201).json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Video consultation scheduling error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get available time slots
router.get('/available-slots', auth, async (req, res) => {
  try {
    const { date } = req.query;
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Get booked slots
    const bookedConsultations = await VideoConsultation.find({
      scheduledDate: {
        $gte: startDate,
        $lte: endDate
      },
      status: { $in: ['pending', 'confirmed'] }
    });

    // Generate all possible time slots (9 AM to 5 PM, 45-minute intervals)
    const allSlots = [];
    const startHour = 9;
    const endHour = 17;
    const intervalMinutes = 45;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        allSlots.push(time);
      }
    }

    // Filter out booked slots
    const availableSlots = allSlots.filter(slot => {
      const [hour, minute] = slot.split(':').map(Number);
      const slotDate = new Date(date);
      slotDate.setHours(hour, minute, 0, 0);

      return !bookedConsultations.some(consultation => {
        const consultationStart = new Date(consultation.scheduledDate);
        const consultationEnd = new Date(consultationStart.getTime() + consultation.duration * 60000);
        return slotDate >= consultationStart && slotDate < consultationEnd;
      });
    });

    res.json({
      success: true,
      data: availableSlots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user's consultations
router.get('/my', auth, async (req, res) => {
  try {
    const consultations = await VideoConsultation.find({ user: req.user._id })
      .populate('counselor', 'name email')
      .sort('-scheduledDate');

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

// Reschedule consultation
router.put('/:id/reschedule', auth, async (req, res) => {
  try {
    const { scheduledDate } = req.body;
    const consultation = await VideoConsultation.findById(req.params.id);

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

    // Store the previous consultation reference
    consultation.previousConsultations.push(consultation._id);
    consultation.status = 'rescheduled';
    consultation.scheduledDate = scheduledDate;
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

// Cancel consultation
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    const consultation = await VideoConsultation.findById(req.params.id);

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
    consultation.cancellationReason = reason;
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

// Update meeting link (for counselors)
router.put('/:id/meeting-link', auth, async (req, res) => {
  try {
    const { meetingLink } = req.body;
    const consultation = await VideoConsultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        error: 'Consultation not found'
      });
    }

    if (consultation.counselor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }

    consultation.meetingLink = meetingLink;
    consultation.status = 'confirmed';
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

module.exports = router;
