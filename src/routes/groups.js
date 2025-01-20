const express = require('express');
const router = express.Router();
const { protect: auth } = require('../middleware/auth');
const Group = require('../models/Group');
const GroupSession = require('../models/GroupSession');
const GroupMembership = require('../models/GroupMembership');

// Create a new support group
router.post('/', auth, async (req, res) => {
  try {
    const group = new Group({
      ...req.body,
      facilitator: req.user._id
    });
    await group.save();

    // Create facilitator membership
    await GroupMembership.create({
      group: group._id,
      user: req.user._id,
      role: 'facilitator'
    });

    res.status(201).json({ success: true, data: group });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get all active groups
router.get('/', auth, async (req, res) => {
  try {
    const groups = await Group.find({ isActive: true })
      .populate('facilitator', 'name email')
      .lean();

    // Add participant count to each group
    for (let group of groups) {
      group.participantCount = await GroupMembership.countDocuments({
        group: group._id,
        status: 'active'
      });
    }

    res.json({ success: true, data: groups });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's groups
router.get('/my', auth, async (req, res) => {
  try {
    const memberships = await GroupMembership.find({
      user: req.user._id,
      status: 'active'
    }).populate({
      path: 'group',
      populate: { path: 'facilitator', select: 'name email' }
    });

    // Filter out any memberships where group might be null and map to group objects
    const groups = memberships
      .filter(m => m.group) // Filter out null groups
      .map(m => {
        const groupObj = m.group.toObject ? m.group.toObject() : m.group;
        return {
          ...groupObj,
          role: m.role
        };
      });

    res.json({ success: true, data: groups });
  } catch (error) {
    console.error('Error in /my route:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: error.stack 
    });
  }
});

// Join a group
router.post('/:id/join', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }

    if (!group.isActive) {
      return res.status(400).json({ success: false, error: 'Group is not active' });
    }

    if (await group.isFull()) {
      return res.status(400).json({ success: false, error: 'Group is full' });
    }

    // Check if already a member
    const existingMembership = await GroupMembership.findOne({
      group: group._id,
      user: req.user._id
    });

    if (existingMembership) {
      if (existingMembership.status === 'active') {
        return res.status(400).json({ success: false, error: 'Already a member' });
      }
      // Reactivate membership
      existingMembership.status = 'active';
      await existingMembership.save();
    } else {
      // Create new membership
      await GroupMembership.create({
        group: group._id,
        user: req.user._id,
        role: 'participant'
      });
    }

    res.json({ success: true, message: 'Successfully joined group' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Leave a group
router.delete('/:id/leave', auth, async (req, res) => {
  try {
    const membership = await GroupMembership.findOne({
      group: req.params.id,
      user: req.user._id,
      status: 'active'
    });

    if (!membership) {
      return res.status(404).json({ success: false, error: 'Not a member of this group' });
    }

    if (membership.role === 'facilitator') {
      return res.status(400).json({ success: false, error: 'Facilitator cannot leave the group' });
    }

    membership.status = 'inactive';
    await membership.save();

    res.json({ success: true, message: 'Successfully left group' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Schedule a group session
router.post('/:id/sessions', auth, async (req, res) => {
  try {
    const membership = await GroupMembership.findOne({
      group: req.params.id,
      user: req.user._id,
      role: 'facilitator',
      status: 'active'
    });

    if (!membership) {
      return res.status(403).json({ success: false, error: 'Only facilitator can schedule sessions' });
    }

    const session = new GroupSession({
      group: req.params.id,
      date: new Date(req.body.date),
      notes: req.body.notes
    });
    await session.save();

    res.status(201).json({ success: true, data: session });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get group sessions
router.get('/:id/sessions', auth, async (req, res) => {
  try {
    const membership = await GroupMembership.findOne({
      group: req.params.id,
      user: req.user._id,
      status: 'active'
    });

    if (!membership) {
      return res.status(403).json({ success: false, error: 'Not a member of this group' });
    }

    const sessions = await GroupSession.find({
      group: req.params.id,
      date: { $gte: new Date() }
    }).sort('date');

    res.json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
