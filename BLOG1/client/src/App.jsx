import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';

function App() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [location, setLocation] = useState("");
    const [tags, setTags] = useState(""); // Comma-separated tags
    const [image, setImage] = useState(""); // Image URL
    const [blogs, setBlogs] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const [searchTerm, setSearchTerm] = useState(""); // Search term
    const [filteredBlogs, setFilteredBlogs] = useState([]); // Filtered blogs
    const blogRefs = useRef({}); // Store references to each blog

    useEffect(() => {
        // Fetch blogs on initial load
        Axios.get("http://localhost:5000/blogs").then((response) => {
            setBlogs(response.data);
            setFilteredBlogs(response.data); // Set initial filtered blogs
            blogRefs.current = {}; // Initialize blogRefs
        });
    }, []);

    const addBlog = () => {
        Axios.post("http://localhost:5000/blogs", {
            title: title,
            content: content,
            author: author,
            location: location,
            tags: tags.split(",").map(tag => tag.trim()),
            primaryImage: image,
        }).then((response) => {
            const newBlog = response.data;
            setBlogs([...blogs, newBlog]);
            setFilteredBlogs([...filteredBlogs, newBlog]);
            setTitle('');
            setContent('');
            setAuthor('');
            setLocation('');
            setTags('');
            setImage('');
        }).catch(err => {
            console.error("Error adding blog:", err);
        });
    };

    const updateBlog = (id) => {
        Axios.put(`http://localhost:5000/blogs/${id}`, {
            title: newTitle,
        }).then(() => {
            setBlogs(blogs.map((blog) =>
                blog._id === id ? { ...blog, title: newTitle } : blog
            ));
            setFilteredBlogs(filteredBlogs.map((blog) =>
                blog._id === id ? { ...blog, title: newTitle } : blog
            ));
            setNewTitle('');
        }).catch(err => {
            console.error("Error updating blog:", err);
        });
    };

    const deleteBlog = (id) => {
        Axios.delete(`http://localhost:5000/blogs/${id}`).then(() => {
            setBlogs(blogs.filter((blog) => blog._id !== id));
            setFilteredBlogs(filteredBlogs.filter((blog) => blog._id !== id));
        }).catch(err => {
            console.error("Error deleting blog:", err);
        });
    };

    const handleSearch = () => {
        const filtered = blogs.filter((blog) =>
            blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredBlogs(filtered);

        // Scroll to the first matching blog
        if (filtered.length > 0) {
            const firstBlogId = filtered[0]._id;
            const blogElement = blogRefs.current[firstBlogId];
            if (blogElement) {
                blogElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    return (
        <div className="App">
            <h1>Travel Blog Manager</h1>

            {/* Search Tab Section */}
            <div className="search-tab">
                <h2>Search Blogs</h2>
                <input
                    type="text"
                    placeholder="Search by title"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button onClick={handleSearch} className="search-button">Search</button>
            </div>

            {/* New Tab for Creating Web Log */}
            <div className="create-log-tab">
                <h2>Create Your Web Log Now</h2>
                <p>Start writing your own travel blogs by filling out the form below.</p>
            </div>

            <div className="form">
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <label>Content:</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>

                <label>Author:</label>
                <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                />

                <label>Location:</label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />

                <label>Tags (comma-separated):</label>
                <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />

                <label>Image URL:</label>
                <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                />

                <button onClick={addBlog}>Add Blog</button>
            </div>

            <h2>Blog List</h2>
            {filteredBlogs.map((blog) => (
                <div
                    className={`blog ${searchTerm && blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 'highlight' : ''}`}
                    key={blog._id}
                    ref={(el) => (blogRefs.current[blog._id] = el)} // Assign ref dynamically
                >
                    <h3>{blog.title}</h3>
                    {blog.primaryImage && <img src={blog.primaryImage} alt={blog.title} style={{ maxWidth: '100%', borderRadius: '10px', marginBottom: '10px' }} />}
                    <p>{blog.content}</p>
                    <p><strong>Author:</strong> {blog.author}</p>
                    <p><strong>Location:</strong> {blog.location}</p>
                    <p><strong>Tags:</strong> {blog.tags.join(", ")}</p>

                    <input
                        type="text"
                        value={newTitle}
                        placeholder="New title..."
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <button onClick={() => updateBlog(blog._id)}>Update</button>
                    <button onClick={() => deleteBlog(blog._id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default App;
