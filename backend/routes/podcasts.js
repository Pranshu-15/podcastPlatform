const express = require('express');
const router = express.Router();
const Podcast = require('../models/Podcast');
const authMiddleware = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../middleware/upload');

// @route   GET /api/podcasts
// @desc    Get all podcasts
// @access  Public
router.get('/', async (req, res) => {
    try {
        const podcasts = await Podcast.find().sort({ createdAt: -1 });
        res.json(podcasts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/podcasts/:id
// @desc    Get podcast by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const podcast = await Podcast.findById(req.params.id);
        if (!podcast) {
            return res.status(404).json({ message: 'Podcast not found' });
        }
        res.json(podcast);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Podcast not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/podcasts
// @desc    Create a podcast
// @access  Private
router.post('/', authMiddleware, upload.fields([{ name: 'displayImage', maxCount: 1 }, { name: 'bannerImage', maxCount: 1 }]), async (req, res) => {
    try {
        const { title, description, genre } = req.body;

        let displayImageURL = '';
        let bannerImageURL = '';

        if (!req.files || !req.files.displayImage || !req.files.bannerImage) {
            return res.status(400).json({ message: "Both display image and banner image are required" });
        }

        try {
            const displayResult = await uploadToCloudinary(req.files.displayImage[0].buffer);
            displayImageURL = displayResult.secure_url;
        } catch (err) {
            console.error('Display image upload failed:', err.message);
            return res.status(500).json({ message: `Image upload failed: ${err.message}` });
        }

        try {
            const bannerResult = await uploadToCloudinary(req.files.bannerImage[0].buffer);
            bannerImageURL = bannerResult.secure_url;
        } catch (err) {
            console.error('Banner image upload failed:', err.message);
            return res.status(500).json({ message: `Banner upload failed: ${err.message}` });
        }

        const newPodcast = new Podcast({
            title,
            description,
            genre,
            displayImage: displayImageURL,
            bannerImage: bannerImageURL,
            createdBy: req.user.id
        });

        const podcast = await newPodcast.save();
        res.json(podcast);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
