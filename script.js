// Login
function login(event) {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (username === 'admin' && password === 'password123') {
    localStorage.setItem('loggedIn', 'true');
    window.location.href = 'dashboard.html';
  } else {
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
      errorMessage.style.display = 'block';
    } else {
      alert('Invalid credentials');
    }
  }
}

// Check Authentication for Protected Pages
function checkAuth() {
  const isLoggedIn = localStorage.getItem('loggedIn');
  const isDashboardPage = window.location.pathname.includes('dashboard');
  const isCreatePage = window.location.pathname.includes('create-post');
  const isViewPage = window.location.pathname.includes('view-post');

  if (!isLoggedIn && (isDashboardPage || isCreatePage || isViewPage)) {
    window.location.href = 'login.html';
  }
}

// Logout
function logout() {
  localStorage.removeItem('loggedIn');
  window.location.href = 'login.html';
}

// Save Post
function createPost(event) {
  event.preventDefault();
  const title = document.getElementById('post-title-input').value.trim();
  const content = CKEDITOR.instances['post-content-input'].getData();

  if (!title || !content) {
    alert('Please enter both title and content.');
    return;
  }

  const post = { title, content };
  localStorage.setItem('post', JSON.stringify(post));
  window.location.href = 'view-post.html';
}

// Display Post
function displayPost() {
  const post = JSON.parse(localStorage.getItem('post'));

  if (post) {
    document.getElementById('post-title').innerText = post.title;
    document.getElementById('post-content').innerHTML = post.content;
  } else {
    document.getElementById('post-title').innerText = 'No post found';
    document.getElementById('post-content').innerText = '';
  }
}

// Delete Post
function deletePost() {
  localStorage.removeItem('post');
  alert('Post deleted.');
  window.location.href = 'dashboard.html';
}

// Edit Post
function editPost() {
  const post = JSON.parse(localStorage.getItem('post'));
  if (post) {
    window.location.href = 'create-post.html';
    setTimeout(() => {
      document.getElementById('post-title-input').value = post.title;
      CKEDITOR.instances['post-content-input'].setData(post.content);
    }, 100); // Delay to ensure CKEditor loads
  }
}

// Initialization on Load
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path.endsWith('login.html')) {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', login);
  }

  if (path.endsWith('dashboard.html')) {
    checkAuth();
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
  }

  if (path.endsWith('create-post.html')) {
    checkAuth();
    if (typeof CKEDITOR !== 'undefined') {
      CKEDITOR.replace('post-content-input', {
        height: 300,
        removePlugins: 'sourcearea',
        contentsCss: ['https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'],
        bodyClass: 'bg-white p-3'
      });
    }
    const createForm = document.getElementById('create-post-form');
    if (createForm) createForm.addEventListener('submit', createPost);
  }

  if (path.endsWith('view-post.html')) {
    checkAuth();
    displayPost();
    const deleteBtn = document.getElementById('delete-btn');
    const editBtn = document.getElementById('edit-btn');
    if (deleteBtn) deleteBtn.addEventListener('click', deletePost);
    if (editBtn) editBtn.addEventListener('click', editPost);
  }
});
