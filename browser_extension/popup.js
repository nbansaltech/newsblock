// Utility function to get the current tab's URL
async function getCurrentTabUrl() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log(tab.url);
    if (tab && tab.url) {
      const url = new URL(tab.url);
      return url;
    } else {
      throw new Error('Unable to get current tab URL');
    }
  } catch (error) {
    console.error('Error getting current tab URL:', error);
    return null;
  }
}
// Function to check if user is logged in
function isLoggedIn() {
  return !!localStorage.getItem('token');
}

// Function to show/hide UI elements based on login status
function updateUIForLoginStatus() {
  const loginStatus = isLoggedIn();
  document.getElementById('loginForm').style.display = loginStatus ? 'none' : 'block';
  document.getElementById('logoutBtn').style.display = loginStatus ? 'block' : 'none';
  document.getElementById('upvoteBtn').disabled = !loginStatus;
  document.getElementById('downvoteBtn').disabled = !loginStatus;
  document.getElementById('registerForm').style.display = loginStatus ? 'none' : 'block';
}

document.addEventListener('DOMContentLoaded', async function () {
  const customCheckbox = document.getElementById('customCheckbox');
  const manualInputs = document.getElementById('manualInputs');
  const resultElement = document.getElementById('result');
  const autoAnalyzeBtn = document.getElementById('autoAnalyzeBtn');
  const upvoteBtn = document.getElementById('upvoteBtn');
  const downvoteBtn = document.getElementById('downvoteBtn');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const logoutBtn = document.getElementById('logoutBtn');

  updateUIForLoginStatus();

  customCheckbox.addEventListener('change', function () {
    manualInputs.style.display = this.checked ? 'block' : 'none';
  });

  autoAnalyzeBtn.addEventListener('click', analyzeWebpage);

  upvoteBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    if (!isLoggedIn()) {
      alert('Please log in to vote.');
      return;
    }
    showCaptcha('upvote');
  });

  downvoteBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    if (!isLoggedIn()) {
      alert('Please log in to vote.');
      return;
    }
    showCaptcha('downvote');
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    await login(username, password);
  });

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    await register(username, password);
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    updateUIForLoginStatus();
  });

  // Keep the existing functionality
  const analyzeBtn = document.getElementById('analyzeBtn');
  analyzeBtn.addEventListener('click', async function () {
    if (customCheckbox.checked) {
      const title = document.getElementById('title').value;
      const text = document.getElementById('text').value;
      const subject = document.getElementById('subject').value;
      const date = document.getElementById('date').value;
      const url = await getCurrentTabUrl();

      if (!text) {
        resultElement.innerText = 'Error: Please enter some text to analyze.';
        return;
      }

      analyzeFakeNews('/predict/pipeline', { title, text, subject, date, url });
    } else {
      analyzeWebpage();
    }
  });

  document.getElementById('analyzeButton').addEventListener('click', analyzeImage);

  // Automatically check site data when popup is opened
  checkSiteData();
});

async function analyzeWebpage() {
  const resultElement = document.getElementById('result');
  resultElement.innerText = 'Analyzing...';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      throw new Error('No active tab found');
    }
    
    const url = await getCurrentTabUrl();

    // Execute a content script to get the page content
    const [{ result: pageContent }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        return document.body.innerText;
      }
    });

    if (!pageContent) {
      throw new Error('No content found to analyze');
    }

    // Send the content directly to your backend
    const response = await fetch('http://localhost:8000/predict/simple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: pageContent, url: url }),
    });

    const result = await response.json();
    resultElement.innerText = `Prediction: ${result.prediction}\nProbability: ${result.probability.toFixed(2)}`;
  } catch (error) {
    console.error('Error:', error);
    resultElement.innerText = `Error: Failed to analyze the webpage. ${error.message}`;
  }
}

async function analyzeFakeNews(endpoint, data) {
  const resultElement = document.getElementById('result');
  resultElement.innerText = 'Analyzing...';
  try {
    const response = await fetch(`http://localhost:8000${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    resultElement.innerText = `Prediction: ${result.prediction}\nProbability: ${result.probability.toFixed(2)}`;
  } catch (error) {
    console.error('Error:', error);
    resultElement.innerText = 'Error: Failed to analyze. Please try again.';
  }
}

async function analyzeImage() {
  const imageUpload = document.getElementById('imageUpload').files[0];
  const loadingElement = document.getElementById('loading');
  const resultElement = document.getElementById('result');

  if (!imageUpload) {
    alert('Please select an image first.');
    return;
  }

  const formData = new FormData();
  formData.append('image', imageUpload);

  loadingElement.style.display = 'block';
  resultElement.innerHTML = '';

  try {
    const url = await getCurrentTabUrl();
    formData.append('url', url);
    const response = await fetch('http://localhost:8000/predict/image', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    loadingElement.style.display = 'none';
    resultElement.innerHTML = `
      <p><strong>Generated Text:</strong> ${data.generated_text}</p>
      <p><strong>Prediction:</strong> ${data.prediction}</p>
      <p><strong>Probability:</strong> ${data.probability}</p>
    `;
  } catch (error) {
    loadingElement.style.display = 'none';
    resultElement.innerHTML = '<p>An error occurred. Please try again.</p>';
  }
}

async function checkSiteData() {
  const url = await getCurrentTabUrl();
  const resultElement = document.getElementById('result');

  if (!url) {
    resultElement.innerHTML = '<p>Error: Unable to get current site data.</p>';
    return;
  }

  try {
    const response = await fetch(`http://localhost:8000/check_site/?url=${url}`);
    const data = await response.json();

    resultElement.innerHTML = `
      <p><strong>Upvotes:</strong> ${data.upvotes}</p>
      <p><strong>Downvotes:</strong> ${data.downvotes}</p>
    `;

    // If the site has accuracy data, display it
    const accuracyResponse = await fetch(`http://localhost:8000/check_site/?url=${url}`);
    if (accuracyResponse.ok) {
      const accuracyData = await accuracyResponse.json();
      resultElement.innerHTML = `
        <p><strong>Upvotes:</strong> ${data.upvotes}</p>
        <p><strong>Downvotes:</strong> ${data.downvotes}</p>
      `;

    }
  } catch (error) {
    console.error('Error:', error);
    resultElement.innerHTML = '<p>Error: Failed to fetch site data.</p>';
  }
}

async function voteSite(url, voteType) {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id');
  if (!token || !userId) {
    alert('Please log in to vote.');
    return;
  }

  try {
    const response = await fetch(`http://localhost:8000/${voteType}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ url: url, user_id: userId })
    });

    if (response.ok) {
      alert(`${voteType.charAt(0).toUpperCase() + voteType.slice(1)} successful!`);
      await checkSiteData();
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.detail}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to submit vote. Please try again.');
  }
}

async function login(username, password) {
  try {
    const response = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user_id', data.user_id);
      updateUIForLoginStatus();
      alert('Logged in successfully!');
    } else {
      const errorData = await response.json();
      alert(`Login failed: ${errorData.detail}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Login failed. Please try again.');
  }
}

async function register(username, password) {
  try {
    const response = await fetch('http://localhost:8000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user_id', data.user_id);
      updateUIForLoginStatus();
      alert('Registered and logged in successfully!');
    } else {
      const errorData = await response.json();
      alert(`Registration failed: ${errorData.detail}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Registration failed. Please try again.');
  }
}



let captchaResult;
const captchaContainer = document.getElementById('captchaContainer');
const captchaQuestion = document.getElementById('captchaQuestion');
const captchaAnswer = document.getElementById('captchaAnswer');
const submitCaptcha = document.getElementById('submitCaptcha');
const upvoteBtn = document.getElementById('upvoteBtn');
const downvoteBtn = document.getElementById('downvoteBtn');

function generateCaptcha() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  captchaResult = num1 + num2;
  captchaQuestion.textContent = `What is ${num1} + ${num2}?`;
}

function showCaptcha(voteType) {
  generateCaptcha();
  captchaContainer.style.display = 'block';
  captchaAnswer.value = '';
  submitCaptcha.onclick = () => validateCaptchaAndVote(voteType);
}

upvoteBtn.addEventListener('click', (e) => {
  e.preventDefault();
  showCaptcha();
});

downvoteBtn.addEventListener('click', (e) => {
  e.preventDefault();
  showCaptcha();
});
async function validateCaptchaAndVote(voteType) {
  if (parseInt(captchaAnswer.value) === captchaResult) {
    captchaContainer.style.display = 'none';
    const url = await getCurrentTabUrl();
    await voteSite(url, voteType);
  } else {
    alert('Incorrect CAPTCHA. Please try again.');
    generateCaptcha();
  }
}
// submitCaptcha.addEventListener('click', () => {
//     if (parseInt(captchaAnswer.value) === captchaResult) {
//         captchaContainer.style.display = 'none';
//         alert('CAPTCHA solved correctly. You can now vote!');
//         // Here you can add the logic to actually perform the upvote or downvote
//     } else {
//         alert('Incorrect CAPTCHA. Please try again.');
//         generateCaptcha();
//     }
// });