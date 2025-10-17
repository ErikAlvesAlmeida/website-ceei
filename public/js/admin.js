document.addEventListener('DOMContentLoaded', () => {
  const token = sessionStorage.getItem('token');
  if (!token && window.location.pathname.includes('admin')) {
    window.location.href = '/login';
    return;
  }

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    setupAdminPanel();
    setupNavigation();
    setupSiteInfoForm();
    setupPartnerManagement(); 
    setupPositionManagement();
    setupPostManagement();
    setupUserManagement();
    setupProfileForm();
  }
});

async function handleLogin(e) {
  e.preventDefault();
  const login = document.getElementById('login-input').value;
  const password = document.getElementById('password-input').value;
  const errorMessage = document.getElementById('error-message');
  try {
    const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ login, password }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('userRole', data.role);
    sessionStorage.setItem('userName', data.userName);
    window.location.href = '/admin';
  } catch (error) {
    errorMessage.textContent = error.message;
    errorMessage.classList.remove('d-none');
  }
}
function setupAdminPanel() {
  const logoutButton = document.getElementById('logout-button');
  logoutButton.addEventListener('click', (e) => { e.preventDefault(); sessionStorage.clear(); window.location.href = '/login'; });
  const userRole = sessionStorage.getItem('userRole');
  if (userRole === 'MASTER') {
    document.getElementById('user-management-nav').style.display = 'block';
  }
}

function setupNavigation() {
  const navLinks = document.querySelectorAll('#sidebarMenu .nav-link');
  const views = document.querySelectorAll('main > div[id$="-view"]');
  const viewMap = {
    'Dashboard': 'dashboard-view',
    'Editar Perfil': 'profile-view',
    'Info do Site': 'site-info-view',
    'Parceiros': 'partners-view',
    'Cargos': 'positions-view',
    'Posts do Blog': 'posts-view',
    'Gerenciar Admins': 'user-management-view',
  };

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const viewId = viewMap[e.target.textContent];
      if (viewId) {
        views.forEach(view => view.classList.add('d-none'));
        document.getElementById(viewId).classList.remove('d-none');
        navLinks.forEach(nav => nav.classList.remove('active'));
        e.target.classList.add('active');

        if (viewId === 'site-info-view') loadSiteInfoData();
        if (viewId === 'partners-view') loadPartners(); 
        if (viewId === 'positions-view') loadPositions();
        if (viewId === 'posts-view') loadPosts();
        if (viewId === 'user-management-view') loadAdmins();
        if (viewId === 'profile-view') loadProfileData();
      }
    });
  });
}

function setupSiteInfoForm() {
  const form = document.getElementById('site-info-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');
    const feedbackDiv = document.getElementById('site-info-feedback');
    const data = { aboutText: document.getElementById('about-text-input').value, contactPhone1: document.getElementById('phone1-input').value, contactPhone2: document.getElementById('phone2-input').value, contactEmail: document.getElementById('email-input').value };
    try {
      const response = await fetch('/api/site-info', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(data) });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.message); }
      feedbackDiv.innerHTML = `<div class="alert alert-success">Informações salvas com sucesso!</div>`;
    } catch (error) {
      feedbackDiv.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
  });
}
async function loadSiteInfoData() {
  try {
    const response = await fetch('/api/site-info');
    if (!response.ok) throw new Error('Falha ao carregar informações do site.');
    const data = await response.json();
    document.getElementById('about-text-input').value = data.aboutText;
    document.getElementById('phone1-input').value = data.contactPhone1;
    document.getElementById('phone2-input').value = data.contactPhone2 || '';
    document.getElementById('email-input').value = data.contactEmail;
  } catch (error) {
    document.getElementById('site-info-feedback').innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
}

function setupPartnerManagement() {
  const form = document.getElementById('partner-form');
  form.addEventListener('submit', handleAddPartner);
}

async function loadPartners() {
  const tableBody = document.getElementById('partners-table-body');
  tableBody.innerHTML = '<tr><td colspan="3">Carregando...</td></tr>';

  try {
    const response = await fetch('/api/partners');
    if (!response.ok) throw new Error('Falha ao carregar parceiros.');
    
    const partners = await response.json();
    tableBody.innerHTML = ''; 

    if (partners.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="3">Nenhum parceiro cadastrado.</td></tr>';
    } else {
      partners.forEach(partner => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><img src="${partner.imageUrl}" alt="${partner.name}" width="50"></td>
          <td>${partner.name}</td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="handleDeletePartner(${partner.id})">Excluir</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    }
  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan="3" class="text-danger">${error.message}</td></tr>`;
  }
}

async function handleAddPartner(e) {
  e.preventDefault();
  const token = sessionStorage.getItem('token');
  const feedbackDiv = document.getElementById('partner-feedback');
  const form = e.target;

  const formData = new FormData();
  formData.append('name', document.getElementById('partner-name-input').value);
  formData.append('description', document.getElementById('partner-description-input').value);
  formData.append('image', document.getElementById('partner-image-input').files[0]);

  try {
    const response = await fetch('/api/partners', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao adicionar parceiro.');
    }

    feedbackDiv.innerHTML = `<div class="alert alert-success">Parceiro adicionado com sucesso!</div>`;
    form.reset();
    loadPartners(); 
  } catch (error) {
    feedbackDiv.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
}

async function handleDeletePartner(partnerId) {
  if (!confirm('Tem certeza que deseja excluir este parceiro?')) {
    return;
  }
  
  const token = sessionStorage.getItem('token');
  try {
    const response = await fetch(`/api/partners/${partnerId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao excluir parceiro.');
    }

    loadPartners();
  } catch (error) {
    alert(error.message);
  }
}

function setupPositionManagement() {
  const form = document.getElementById('position-form');
  form.addEventListener('submit', handleSavePosition);
  
  const cancelBtn = document.getElementById('cancel-edit-position-btn');
  cancelBtn.addEventListener('click', resetPositionForm);

  const titleSelect = document.getElementById('position-title-input');
  titleSelect.addEventListener('change', (e) => {
    const detailGroup = document.getElementById('position-title-detail-group');
    if (e.target.value === 'COORDENADOR') {
      detailGroup.style.display = 'block';
    } else {
      detailGroup.style.display = 'none';
      document.getElementById('position-title-detail-input').value = ''; 
    }
  });
}

// Em public/js/admin.js, substitua apenas esta função
async function loadPositions() {
  const tableBody = document.getElementById('positions-table-body');
  tableBody.innerHTML = '<tr><td colspan="4">Carregando...</td></tr>';
  try {
    const response = await fetch('/api/positions');
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Falha ao carregar cargos. Status: ${response.status}`);
    }
    
    const positions = await response.json();
    console.log("Dados de Cargos recebidos da API:", positions);

    tableBody.innerHTML = '';
    if (positions.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="4">Nenhum cargo cadastrado.</td></tr>';
    } else {
      positions.forEach(pos => {
        const row = document.createElement('tr');
        const fullTitle = pos.titleDetail ? `${pos.title.replace('_', ' ')} ${pos.titleDetail}` : pos.title.replace('_', ' ');
        row.innerHTML = `
          <td><img src="${pos.imageUrl}" alt="${pos.memberName}" width="40" height="40" class="rounded-circle" style="object-fit: cover;"></td>
          <td>${pos.memberName}</td>
          <td>${fullTitle}</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="handleEditPosition(${pos.id})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="handleDeletePosition(${pos.id})">Excluir</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    }
  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan="4" class="text-danger">${error.message}</td></tr>`;
  }
}

async function handleSavePosition(e) {
  e.preventDefault();
  const token = sessionStorage.getItem('token');
  const feedbackDiv = document.getElementById('position-feedback');
  const positionId = document.getElementById('position-id-input').value;

  const formData = new FormData();
  formData.append('memberName', document.getElementById('position-memberName-input').value);
  formData.append('title', document.getElementById('position-title-input').value);
  formData.append('titleDetail', document.getElementById('position-title-detail-input').value);
  
  const imageFile = document.getElementById('position-image-input').files[0];
  if (imageFile) {
    formData.append('image', imageFile);
  }

  const isEditing = !!positionId;
  const url = isEditing ? `/api/positions/${positionId}` : '/api/positions';
  const method = isEditing ? 'PATCH' : 'POST';

  try {
    const response = await fetch(url, {
      method: method,
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao salvar membro.');
    }
    feedbackDiv.innerHTML = `<div class="alert alert-success">Membro salvo com sucesso!</div>`;
    resetPositionForm();
    loadPositions();
  } catch (error) {
    feedbackDiv.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
}

async function handleEditPosition(positionId) {
    resetPositionForm();
    try {
        const response = await fetch(`/api/positions`);
        if(!response.ok) throw new Error('Falha ao buscar dados do membro.');
        const positions = await response.json();
        const position = positions.find(p => p.id === positionId);

        if(position) {
            document.querySelector('#positions-view .card-header').textContent = 'Editar Membro';
            document.getElementById('position-id-input').value = position.id;
            document.getElementById('position-memberName-input').value = position.memberName;
            document.getElementById('position-title-input').value = position.title;
            
            const detailGroup = document.getElementById('position-title-detail-group');
            if (position.title === 'COORDENADOR') {
                detailGroup.style.display = 'block';
                document.getElementById('position-title-detail-input').value = position.titleDetail || '';
            } else {
                detailGroup.style.display = 'none';
            }

            document.getElementById('cancel-edit-position-btn').style.display = 'inline-block';
            document.querySelector('#positions-view .card-header').scrollIntoView({ behavior: 'smooth' });
        }
    } catch(error) {
        alert(error.message);
    }
}

function resetPositionForm() {
    document.getElementById('position-form').reset();
    document.getElementById('position-id-input').value = '';
    document.querySelector('#positions-view .card-header').textContent = 'Adicionar Novo Membro';
    document.getElementById('cancel-edit-position-btn').style.display = 'none';
    document.getElementById('position-title-detail-group').style.display = 'none';
    document.getElementById('position-feedback').innerHTML = '';
}

async function handleDeletePosition(positionId) {
    if (!confirm('Tem certeza que deseja excluir este membro?')) return;
    const token = sessionStorage.getItem('token');
    try {
        const response = await fetch(`/api/positions/${positionId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.message); }
        loadPositions();
    } catch (error) {
        alert(error.message);
    }
}
function setupPostManagement() {
  const form = document.getElementById('post-form');
  form.addEventListener('submit', handleSavePost);

  const addContentBtn = document.getElementById('add-content-pair-btn');
  addContentBtn.addEventListener('click', addContentPair);

  const cancelEditBtn = document.getElementById('cancel-edit-post-btn');
  cancelEditBtn.addEventListener('click', resetPostForm);
}

async function loadPosts() {
  const tableBody = document.getElementById('posts-table-body');
  tableBody.innerHTML = '<tr><td colspan="3">Carregando...</td></tr>';
  try {
    const response = await fetch('/api/posts');
    if (!response.ok) throw new Error('Falha ao carregar posts.');
    const posts = await response.json();
    tableBody.innerHTML = '';
    if (posts.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="3">Nenhum post publicado.</td></tr>';
    } else {
      posts.forEach(post => {
        const row = document.createElement('tr');
        const postDate = new Date(post.createdAt).toLocaleDateString('pt-BR');
        row.innerHTML = `
          <td>${post.title}</td>
          <td>${postDate}</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="handleEditPost(${post.id})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="handleDeletePost(${post.id})">Excluir</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    }
  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan="3" class="text-danger">${error.message}</td></tr>`;
  }
}

function addContentPair() {
  const container = document.getElementById('post-content-container');
  const newPair = document.createElement('div');
  newPair.className = 'content-pair mb-3 border p-3 rounded';
  newPair.innerHTML = `
    <div class="d-flex justify-content-end mb-2">
      <button type="button" class="btn-close" aria-label="Close" onclick="this.parentElement.parentElement.remove()"></button>
    </div>
    <div class="mb-2">
      <label class="form-label">Subtítulo</label>
      <input type="text" class="form-control" name="subtitle">
    </div>
    <div>
      <label class="form-label">Parágrafo</label>
      <textarea class="form-control" name="paragraph" rows="4"></textarea>
    </div>
  `;
  container.appendChild(newPair);
}

async function handleSavePost(e) {
  e.preventDefault();
  const token = sessionStorage.getItem('token');
  const feedbackDiv = document.getElementById('post-feedback');
  const form = e.target;
  const postId = document.getElementById('post-id-input').value;

  const contentPairs = [];
  document.querySelectorAll('.content-pair').forEach(pair => {
    const subtitle = pair.querySelector('input[name="subtitle"]').value;
    const paragraph = pair.querySelector('textarea[name="paragraph"]').value;
    if (subtitle || paragraph) { 
      contentPairs.push({ subtitle, paragraph });
    }
  });

  const formData = new FormData();
  formData.append('title', document.getElementById('post-title-input').value);
  formData.append('content', JSON.stringify(contentPairs)); 

  const listCoverFile = document.getElementById('post-listCover-input').files[0];
  if (listCoverFile) formData.append('listCover', listCoverFile);

  const postCoverFile = document.getElementById('post-postCover-input').files[0];
  if (postCoverFile) formData.append('postCover', postCoverFile);

  const isEditing = !!postId;
  const url = isEditing ? `/api/posts/${postId}` : '/api/posts';
  const method = isEditing ? 'PATCH' : 'POST';

  try {
    const response = await fetch(url, {
      method: method,
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao salvar post.');
    }
    feedbackDiv.innerHTML = `<div class="alert alert-success">Post salvo com sucesso!</div>`;
    resetPostForm();
    loadPosts();
  } catch (error) {
    feedbackDiv.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
}

async function handleEditPost(postId) {
  resetPostForm(); 
  try {
    const response = await fetch(`/api/posts/${postId}`);
    if (!response.ok) throw new Error('Falha ao buscar dados do post.');
    const post = await response.json();
    
    document.getElementById('post-form-title').textContent = 'Editar Post';
    document.getElementById('post-id-input').value = post.id;
    document.getElementById('post-title-input').value = post.title;
    document.getElementById('cancel-edit-post-btn').style.display = 'inline-block';

    const contentContainer = document.getElementById('post-content-container');
    contentContainer.innerHTML = ''; 
    if (post.content && post.content.length > 0) {
      post.content.forEach(pair => {
        addContentPair(); 
        const allPairs = document.querySelectorAll('.content-pair');
        const lastPair = allPairs[allPairs.length - 1]; 
        lastPair.querySelector('input[name="subtitle"]').value = pair.subtitle || '';
        lastPair.querySelector('textarea[name="paragraph"]').value = pair.paragraph || '';
      });
    } else {
      addContentPair();
    }

    document.getElementById('post-form-title').scrollIntoView({ behavior: 'smooth' });

  } catch (error) {
    alert(error.message);
  }
}

async function handleDeletePost(postId) {
  if (!confirm('Tem certeza que deseja excluir este post?')) return;
  const token = sessionStorage.getItem('token');
  try {
    const response = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao excluir post.');
    }
    loadPosts();
  } catch (error) {
    alert(error.message);
  }
}

function resetPostForm() {
  document.getElementById('post-form').reset();
  document.getElementById('post-id-input').value = '';
  document.getElementById('post-form-title').textContent = 'Criar Novo Post';
  document.getElementById('cancel-edit-post-btn').style.display = 'none';
  const contentContainer = document.getElementById('post-content-container');
  contentContainer.innerHTML = '';
  addContentPair();
  document.getElementById('post-feedback').innerHTML = '';
}

function setupUserManagement() {
  const form = document.getElementById('add-admin-form');
  if (form) {
    form.addEventListener('submit', handleAddAdmin);
  }

  const generateBtn = document.getElementById('generate-password-btn');
  const passwordInput = document.getElementById('admin-password-input');

  if (generateBtn && passwordInput) {
    generateBtn.addEventListener('click', () => {
      const newPassword = generateRandomPassword(8);
      passwordInput.value = newPassword;
      passwordInput.type = 'text'; 
    });
  }
}

function generateRandomPassword(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

async function loadAdmins() {
  const tableBody = document.getElementById('admins-table-body');
  tableBody.innerHTML = '<tr><td colspan="3">Carregando...</td></tr>';
  const token = sessionStorage.getItem('token');
  try {
    const response = await fetch('/api/users', { headers: { 'Authorization': `Bearer ${token}` } });
    if (!response.ok) throw new Error('Falha ao carregar admins.');
    const admins = await response.json();
    tableBody.innerHTML = '';
    if (admins.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="3">Nenhum admin cadastrado.</td></tr>';
    } else {
      admins.forEach(admin => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${admin.name}</td>
          <td>${admin.login}</td>
          <td><button class="btn btn-danger btn-sm" onclick="handleDeleteAdmin(${admin.id})">Excluir</button></td>
        `;
        tableBody.appendChild(row);
      });
    }
  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan="3" class="text-danger">${error.message}</td></tr>`;
  }
}

async function loadAdmins() {
  const tableBody = document.getElementById('admins-table-body');
  tableBody.innerHTML = '<tr><td colspan="3">Carregando...</td></tr>';
  const token = sessionStorage.getItem('token');
  try {
    const response = await fetch('/api/users', { headers: { 'Authorization': `Bearer ${token}` } });
    if (!response.ok) throw new Error('Falha ao carregar admins.');
    const admins = await response.json();
    tableBody.innerHTML = '';
    if (admins.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="3">Nenhum admin cadastrado.</td></tr>';
    } else {
      admins.forEach(admin => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${admin.name}</td>
          <td>${admin.login}</td>
          <td><button class="btn btn-danger btn-sm" onclick="handleDeleteAdmin(${admin.id})">Excluir</button></td>
        `;
        tableBody.appendChild(row);
      });
    }
  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan="3" class="text-danger">${error.message}</td></tr>`;
  }
}

async function handleAddAdmin(e) {
  e.preventDefault();
  const token = sessionStorage.getItem('token');
  const feedbackDiv = document.getElementById('admin-feedback');
  const data = {
    name: document.getElementById('admin-name-input').value,
    login: document.getElementById('admin-cpf-input').value,
    birthDate: document.getElementById('admin-birthdate-input').value,
    password: document.getElementById('admin-password-input').value
  };
  try {
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.message); }
    feedbackDiv.innerHTML = `<div class="alert alert-success">Admin adicionado com sucesso!</div>`;
    e.target.reset();
    loadAdmins();
  } catch (error) {
    feedbackDiv.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
}

async function handleDeleteAdmin(userId) {
  if (!confirm('Tem certeza que deseja excluir este admin?')) return;
  const token = sessionStorage.getItem('token');
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.message); }
    loadAdmins();
  } catch (error) {
    alert(error.message);
  }
}

function setupProfileForm() {
    const form = document.getElementById('profile-form');
    form.addEventListener('submit', handleUpdateProfile);

    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('profile-password-input');
    togglePassword.addEventListener('click', () => {
        togglePasswordVisibility(passwordInput, togglePassword);
    });

    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
    const confirmPasswordInput = document.getElementById('profile-confirm-password-input');
    toggleConfirmPassword.addEventListener('click', () => {
        togglePasswordVisibility(confirmPasswordInput, toggleConfirmPassword);
    });
}

function togglePasswordVisibility(input, toggleElement) {
    const icon = toggleElement.querySelector('i');
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    icon.classList.toggle('bi-eye-slash');
    icon.classList.toggle('bi-eye-fill');
}

async function loadProfileData() {
    const userName = sessionStorage.getItem('userName');
    if(userName) {
        document.getElementById('profile-name-input').value = userName;
    }
}

async function handleUpdateProfile(e) {
    e.preventDefault();
    const token = sessionStorage.getItem('token');
    const feedbackDiv = document.getElementById('profile-feedback');
    feedbackDiv.innerHTML = ''; 

    const passwordInput = document.getElementById('profile-password-input');
    const confirmPasswordInput = document.getElementById('profile-confirm-password-input');
    
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (password !== confirmPassword) {
        feedbackDiv.innerHTML = `<div class="alert alert-danger">As novas senhas não coincidem.</div>`;
        return; 
    }
    
    const dataToUpdate = {
        name: document.getElementById('profile-name-input').value,
    };

    if (password) {
        dataToUpdate.password = password;
    }

    try {
        const response = await fetch('/api/users/me', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(dataToUpdate)
        });
        if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.message); }
        
        const updatedUser = await response.json();
        sessionStorage.setItem('userName', updatedUser.name);
        feedbackDiv.innerHTML = `<div class="alert alert-success">Perfil atualizado com sucesso!</div>`;

        passwordInput.value = '';
        confirmPasswordInput.value = '';

    } catch (error) {
        feedbackDiv.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
}
