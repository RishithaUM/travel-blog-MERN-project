function handleSubmit() {
    // Get input values
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Define correct credentials
    const validUsername = "admin";
    const validPassword = "password123";

    // Check if credentials are correct
    if (username === validUsername && password === validPassword) {
        window.location.href = "home.html"; // Redirects to travel blog homepage
    } else {
        alert("Invalid username or password! Please try again.");
    }
}
