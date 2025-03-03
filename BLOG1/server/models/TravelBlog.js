const mongoose = require('mongoose');

// Define the schema for a Travel Blog
const TravelBlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    publicationDate: {
        type: Date,
        default: Date.now,
    },
    tags: {
        type: [String], // An array of strings for tags like "beach", "mountain", "adventure"
        default: [],
    },
    images: {
        type: [String], // An array of image URLs
        default: [],
    },
    primaryImage: { // New field for a single primary image
        type: String, // URL or path to the primary image
        default: '',
    },
    location: {
        type: String, // The location the blog is about
        required: true,
    },
    likes: {
        type: Number, // Number of likes for the blog post
        default: 0,
    },
    featured: {
        type: Boolean, // Whether the blog post is featured on the homepage
        default: false,
    },
    comments: [
        {
            username: {
                type: String,
                required: true,
            },
            commentText: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});

// Ensure that the '_id' is correctly handled (added validation for objectId format)
TravelBlogSchema.pre('save', function (next) {
    if (!mongoose.isValidObjectId(this._id)) {
        this._id = mongoose.Types.ObjectId(); // Create a new valid ObjectId
    }
    next();
});

// Create the model for the Travel Blog
const TravelBlog = mongoose.model('TravelBlog', TravelBlogSchema);

module.exports = TravelBlog;
