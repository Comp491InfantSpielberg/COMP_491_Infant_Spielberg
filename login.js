document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from submitting normally
  
    // Get the email and password from the form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    // Validate the fields (optional)
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }
  
    // Send POST request to the backend
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // We are sending JSON data
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // If login is successful, the token will be in the response
        const token = data.token;
        // Save the token (in localStorage, sessionStorage, or cookies)
        localStorage.setItem('authToken', token);
        alert('Login successful!');
        // Redirect or perform actions after successful login
        window.location.href = '/dashboard'; // Redirect to a protected page
      } else {
        // If there is an error, show the error message
        alert(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  });
  