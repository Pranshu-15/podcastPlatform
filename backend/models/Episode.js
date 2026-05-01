const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
    podcastId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Podcast',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    audioFile: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Episode', episodeSchema);
