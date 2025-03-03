const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const TravelBlog = require('./models/TravelBlog'); // Assuming TravelBlog.js is inside models folder

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL || 'mongodb+srv://umrishitha:umrishitha@cluster0.zfc79.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Route to create a new blog post
app.post('/blogs', async (req, res) => {
  const { title, content, author, location, tags, images, primaryImage, featured } = req.body;

  const blog = new TravelBlog({
    title,
    content,
    author,
    location,
    tags,
    images,
    primaryImage,
    featured,
  });

  try {
    await blog.save();
    res.status(201).send('Blog post created');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error creating blog post');
  }
});

// Route to get all blog posts
app.get('/blogs', async (req, res) => {
  try {
    const blogs = await TravelBlog.find();
    res.status(200).send(blogs);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error fetching blogs');
  }
});

// Route to search for a blog by title
app.get('/blogs/search', async (req, res) => {
  const { title } = req.query;

  try {
    const blogs = await TravelBlog.find({ title: new RegExp(title, 'i') }); // Case-insensitive search
    if (blogs.length === 0) {
      return res.status(404).send('No blogs found with the given title');
    }
    res.status(200).send(blogs);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error searching for blogs');
  }
});

// Route to update a blog post by ID
app.put('/blogs/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, author, location, tags, images, primaryImage, featured } = req.body;

  try {
    const blog = await TravelBlog.findById(id);
    if (!blog) {
      return res.status(404).send('Blog post not found');
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.author = author || blog.author;
    blog.location = location || blog.location;
    blog.tags = tags || blog.tags;
    blog.images = images || blog.images;
    blog.primaryImage = primaryImage || blog.primaryImage;
    blog.featured = featured || blog.featured;

    await blog.save();
    res.status(200).send('Blog post updated');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error updating blog post');
  }
});

// Route to delete a blog post by ID
app.delete('/blogs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await TravelBlog.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send('Blog post not found');
    }
    res.status(200).send('Blog post deleted');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error deleting blog post');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
