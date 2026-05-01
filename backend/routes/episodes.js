const express = require('express');
const router = express.Router();
const Episode = require('../models/Episode');
const authMiddleware = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../middleware/upload');

// @route   GET /api/episodes/:podcastId
// @desc    Get all episodes for a podcast
// @access  Public
router.get('/:podcastId', async (req, res) => {
    try {
        const episodes = await Episode.find({ podcastId: req.params.podcastId }).sort({ createdAt: -1 });
        res.json(episodes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/episodes/:podcastId
// @desc    Create an episode
// @access  Private
router.post('/:podcastId', authMiddleware, upload.single('audioFile'), async (req, res) => {
    try {
        const { title, description } = req.body;

        let audioURL = "";
        
        if (!req.file) {
            return res.status(400).json({ message: "Audio file is required" });
        }

        try {
            const result = await uploadToCloudinary(req.file.buffer, { resource_type: 'video' }); // Cloudinary uses 'video' for audio
            audioURL = result.secure_url;
        } catch (uploadErr) {
            console.error('Audio upload failed:', uploadErr.message);
            return res.status(500).json({ message: `Audio upload failed: ${uploadErr.message}` });
        }

        const newEpisode = new Episode({
            podcastId: req.params.podcastId,
            title,
            description,
            audioFile: audioURL
        });

        const episode = await newEpisode.save();
        res.json(episode);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
