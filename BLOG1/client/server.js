// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const cloudinary = require('./cloudinaryConfig');
const multerStorageCloudinary = require('multer-storage-cloudinary');
const TravelBlog = require('./models/TravelBlog');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Cloudinary storage configuration for multer
const storage = multerStorageCloudinary({
    cloudinary: cloudinary,
    folder: 'travel_blog_images', // Cloudinary folder name
});

const upload = multer({ storage: storage });

const PORT = process.env.PORT || 3001;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL || 'mongodb+srv://your_mongodb_url_here', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
});

// Create a new blog post with image upload
app.post('/blogs', upload.single('image'), async (req, res) => {
    const { title, content, author, location, tags } = req.body;
    const image = req.file; // The uploaded image file from Cloudinary

    const blog = new TravelBlog({
        title,
        content,
        author,
        location,
        tags: tags.split(',').map(tag => tag.trim()), // Handle comma-separated tags
        image: {
            url: image.secure_url, // Image URL from Cloudinary
            public_id: image.public_id, // Cloudinary public ID for later deletion
        },
    });

    try {
        await blog.save();
        res.status(201).send(blog);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding blog post');
    }
});

// Get all blog posts
app.get('/blogs', async (req, res) => {
    try {
        const blogs = await TravelBlog.find();
        res.status(200).send(blogs);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching blog posts');
    }
});

// Update a blog post by ID
app.put('/blogs/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content, author, location, tags } = req.body;

    try {
        const blog = await TravelBlog.findById(id);
        if (!blog) {
            return res.status(404).send('Blog post not found');
        }

        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.author = author || blog.author;
        blog.location = location || blog.location;
        blog.tags = tags ? tags.split(',').map(tag => tag.trim()) : blog.tags;

        await blog.save();
        res.status(200).send('Blog post updated successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating blog post');
    }
});

// Delete a blog post by ID
app.delete('/blogs/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const blog = await TravelBlog.findById(id);
        if (!blog) {
            return res.status(404).send('Blog post not found');
        }

        // Optionally delete the image from Cloudinary
        await cloudinary.uploader.destroy(blog.image.public_id);

        await TravelBlog.findByIdAndDelete(id);
        res.status(200).send('Blog post deleted successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting blog post');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
