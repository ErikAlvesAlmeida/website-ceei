document.addEventListener('DOMContentLoaded', function() {

  const navbar = document.querySelector('.navbar');
  if (navbar) { 
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  if (document.getElementById('latest-posts-container')) {
    loadLatestPosts();
    loadSiteInfo();
    loadPartners();
  }
  if (document.getElementById('positions-list-container')) {
    loadPositionsPage();
  }
  if (document.getElementById('blog-posts-container')) {
    loadBlogListPage();
  }
  if (document.getElementById('post-content-body')) {
    loadSinglePostPage();
  }
  setupInPageSearch();
  setupContactForm();
});

async function loadLatestPosts() {
  const container = document.getElementById('latest-posts-container');
  container.innerHTML = '<p class="text-center">Carregando notícias...</p>';

  try {
    const response = await fetch('/api/posts');
    if (!response.ok) throw new Error('Não foi possível carregar as notícias.');
    
    const posts = await response.json();
    const latestPosts = posts.slice(0, 3); 
    
    container.innerHTML = '';

    if (latestPosts.length === 0) {
      container.innerHTML = '<p class="text-center">Nenhuma notícia publicada ainda.</p>';
      return;
    }
    
    latestPosts.forEach(post => {
      const postLink = `/blog/${post.id}`; 
      
      const postCard = `
        <div class="col-lg-4 col-md-6 mb-4">
          <a href="${postLink}" class="text-decoration-none news-card-link">
            <div class="card border-0 shadow-sm h-100">
              <img src="${post.listCoverUrl}" class="card-img-top" alt="${post.title}">
            </div>
          </a>
        </div>
      `;
      container.innerHTML += postCard;
    });
  } catch (error) {
    container.innerHTML = `<p class="text-center text-danger">${error.message}</p>`;
  }
}
async function loadSiteInfo() {
  try {
    const response = await fetch('/api/site-info');
    if (!response.ok) throw new Error('Não foi possível carregar informações do site.');

    const info = await response.json();

    const aboutText = document.getElementById('about-text-placeholder');
    if (aboutText) {
      aboutText.textContent = info.aboutText;
    }

    const footerPhone = document.getElementById('footer-phone');
    if (footerPhone) {
      footerPhone.textContent = info.contactPhone1;
    }
    const footerEmail = document.getElementById('footer-email');
    if (footerEmail) {
      footerEmail.textContent = info.contactEmail;
      footerEmail.href = `mailto:${info.contactEmail}`;
    }

  } catch (error) {
    console.error(error);
  }
}

async function loadPartners() {
  const container = document.getElementById('partners-container');
  try {
    const response = await fetch('/api/partners');
    if (!response.ok) throw new Error('Não foi possível carregar os parceiros.');

    const partners = await response.json();
    container.innerHTML = ''; 

    partners.forEach(partner => {
      const partnerCard = `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
          <div class="partner-card rounded shadow" style="background-image: url('${partner.imageUrl}')">
            <div class="partner-card-content">
              <h5 class="partner-name">${partner.name}</h5>
              <p class="partner-description">${partner.description}</p>
            </div>
          </div>
        </div>
      `;
      container.innerHTML += partnerCard;
    });

  } catch (error) {
    container.innerHTML = `<p class="text-danger">${error.message}</p>`;
  }
}

async function loadPositionsPage() {
  const container = document.getElementById('positions-list-container');
  if (!container) return; 

  container.innerHTML = '<p class="text-center">Carregando equipe...</p>';
  try {
    const response = await fetch('/api/positions');
    if (!response.ok) throw new Error('Não foi possível carregar a equipe.');

    const positions = await response.json();
    container.innerHTML = '';

    if (positions.length === 0) {
      container.innerHTML = '<p class="text-center">Nenhum membro da administração cadastrado.</p>';
    } else {
      positions.forEach(pos => {
        // --- LÓGICA DE FORMATAÇÃO DO TÍTULO ---
        let displayTitle = pos.title.replace('_', ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase());

        if (pos.title === 'COORDENADOR' && pos.titleDetail) {
          displayTitle = `${displayTitle} ${pos.titleDetail}`;
        }
        // --- FIM DA LÓGICA ---

        const positionCard = `
          <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="card text-center border-0 shadow-sm h-100 position-card bg-ceei-primary">
              <img src="${pos.imageUrl}" class="card-img-top p-4" alt="${pos.memberName}" style="object-fit: contain; height: 200px;">
              <div class="card-body">
                <h5 class="card-title text-white">${pos.memberName}</h5>
                <p class="card-text text-white">${displayTitle}</p>
              </div>
            </div>
          </div>
        `;
        container.innerHTML += positionCard;
      });
    }
  } catch (error) {
    container.innerHTML = `<p class="text-center text-danger">${error.message}</p>`;
  }
}

async function loadBlogListPage() {
  const container = document.getElementById('blog-posts-container');
  if (!container) return; 

  container.innerHTML = '<p class="text-center">Carregando posts...</p>';
  try {
    const response = await fetch('/api/posts');
    if (!response.ok) throw new Error('Não foi possível carregar os posts.');

    const posts = await response.json();
    container.innerHTML = '';

    if (posts.length === 0) {
      container.innerHTML = '<p class="text-center">Nenhum post publicado ainda.</p>';
    } else {
      posts.forEach(post => {
        const postLink = `/blog/${post.id}`; 
        const excerpt = post.content[0]?.paragraph.substring(0, 100) + '...' || 'Clique para ler mais.';
        const postDate = new Date(post.createdAt).toLocaleDateString('pt-BR');

        const postCard = `
          <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 shadow-sm news-card-link">
              <a href="${postLink}" class="text-decoration-none text-dark">
                <img src="${post.listCoverUrl}" class="card-img-top" alt="${post.title}">
                <div class="card-body">
                  <h5 class="card-title text-ceei-primary">${post.title}</h5>
                  <p class="card-text text-muted small">${excerpt}</p>
                </div>
                <div class="card-footer bg-white border-0">
                   <small class="text-muted">Publicado em ${postDate}</small>
                </div>
              </a>
            </div>
          </div>
        `;
        container.innerHTML += postCard;
      });
    }
  } catch (error) {
    container.innerHTML = `<p class="text-center text-danger">${error.message}</p>`;
  }
}

async function loadSinglePostPage() {
  const postContentBody = document.getElementById('post-content-body');
  if (!postContentBody) return; 

  const pathParts = window.location.pathname.split('/');
  const postId = pathParts[pathParts.length - 1];

  try {
    const response = await fetch(`/api/posts/${postId}`);
    if (!response.ok) throw new Error('Post não encontrado.');

    const post = await response.json();

    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-date').textContent = `Publicado em ${new Date(post.createdAt).toLocaleDateString('pt-BR')}`;
    const coverImage = document.getElementById('post-cover-image');
    coverImage.src = post.postCoverUrl;
    coverImage.alt = post.title;

    postContentBody.innerHTML = '';
    if (post.content && Array.isArray(post.content)) {
      post.content.forEach(block => {
        let htmlBlock = '';
        if (block.subtitle) {
          htmlBlock += `<h3 class="mt-4 mb-3">${block.subtitle}</h3>`;
        }
        if (block.paragraph) {
          htmlBlock += `<p class="text-justify">${block.paragraph}</p>`;
        }
        postContentBody.innerHTML += htmlBlock;
      });
    }
  } catch (error) {
    postContentBody.innerHTML = `<p class="text-center text-danger h3">${error.message}</p>`;
  }
}
function setupInPageSearch() {
  const form = document.getElementById('search-form');
  const input = document.getElementById('search-input');
  const resultsNav = document.getElementById('search-results-nav');
  const countEl = document.getElementById('search-count');
  const prevBtn = document.getElementById('search-prev-btn');
  const nextBtn = document.getElementById('search-next-btn');
  const searchScope = document.querySelector('main');

  let matches = [];
  let currentIndex = -1;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    removeHighlights();
    const searchTerm = input.value.trim();

    if (!searchTerm) {
      resultsNav.classList.add('d-none');
      return;
    }

    highlightText(searchScope, searchTerm.toLowerCase());
    matches = searchScope.querySelectorAll('.highlight');
    
    if (matches.length > 0) {
      currentIndex = 0;
      navigateToMatch();
      resultsNav.classList.remove('d-none');
    } else {
      countEl.textContent = '0/0';
      resultsNav.classList.add('d-none');
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (matches.length > 0) {
      currentIndex = (currentIndex + 1) % matches.length;
      navigateToMatch();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (matches.length > 0) {
      currentIndex = (currentIndex - 1 + matches.length) % matches.length;
      navigateToMatch();
    }
  });

  function navigateToMatch() {
    matches.forEach(match => match.classList.remove('current-match'));
    const currentMatch = matches[currentIndex];
    currentMatch.classList.add('current-match');
    countEl.textContent = `${currentIndex + 1}/${matches.length}`;
    currentMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function highlightText(node, searchTerm) {
    if (node.nodeType === 3) { 
      const text = node.textContent.toLowerCase();
      const matchIndex = text.indexOf(searchTerm);
      if (matchIndex !== -1) {
        const span = document.createElement('span');
        span.className = 'highlight';
        
        const middleBit = node.splitText(matchIndex);
        const endBit = middleBit.splitText(searchTerm.length);
        
        span.textContent = middleBit.textContent;
        middleBit.parentNode.replaceChild(span, middleBit);
      }
    } else if (node.nodeType === 1 && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
      Array.from(node.childNodes).forEach(child => highlightText(child, searchTerm));
    }
  }

  function removeHighlights() {
    const highlighted = searchScope.querySelectorAll('.highlight');
    highlighted.forEach(el => {
      el.parentNode.replaceChild(document.createTextNode(el.textContent), el);
    });
    searchScope.normalize();
  }
}

function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = 'Enviando...';

    const data = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value,
    };

    try {
      const response = await fetch('/api/contact/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      alert('Mensagem enviada com sucesso!');
      form.reset();
    } catch (error) {
      alert(`Erro: ${error.message}`);
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  });
}