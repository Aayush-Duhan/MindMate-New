const Resource = require('../models/Resource');
const Analytics = require('../models/Analytics');

// Get all resources
const getResources = async (req, res) => {
  try {
    console.log('Fetching resources for user:', req.user._id);
    const resources = await Resource.find().sort({ createdAt: -1 });
    console.log('Found resources:', resources.length);
    res.json(resources);
  } catch (error) {
    console.error('Error in getResources:', error);
    res.status(500).json({ message: 'Error fetching resources', error: error.message });
  }
};

// Get resource by ID
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resource', error: error.message });
  }
};

// Get resources by category
const getResourcesByCategory = async (req, res) => {
  try {
    const resources = await Resource.find({ category: req.params.category });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resources', error: error.message });
  }
};

// Create new resource
const createResource = async (req, res) => {
  try {
    const resource = await Resource.create({
      ...req.body,
      createdBy: req.user._id
    });
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Error creating resource', error: error.message });
  }
};

// Update resource
const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Error updating resource', error: error.message });
  }
};

// Delete resource
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting resource', error: error.message });
  }
};

// Track resource access
const trackResourceAccess = async (req, res) => {
  try {
    const { resourceId } = req.params;
    
    // Log analytics
    await Analytics.create({
      userId: req.user._id,
      type: 'resource_access',
      metadata: {
        resourceId,
        accessType: 'view'
      }
    });

    res.json({ message: 'Access tracked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error tracking access', error: error.message });
  }
};

const getStudentResources = async (req, res) => {
  try {
    const query = { 
      targetAudience: { $in: ['student', 'all'] },
      isActive: true 
    };
    
    const resources = await Resource.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      resources
    });
  } catch (error) {
    console.error('Error fetching student resources:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resources'
    });
  }
};

const getParentResources = async (req, res) => {
  try {
    const resources = await Resource.find({ 
      targetAudience: { $in: ['parent', 'all'] },
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      resources
    });
  } catch (error) {
    console.error('Error fetching parent resources:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resources'
    });
  }
};

module.exports = {
  getResources,
  getResourceById,
  getResourcesByCategory,
  createResource,
  updateResource,
  deleteResource,
  trackResourceAccess,
  getStudentResources,
  getParentResources
}; 