import './style.css'

// Load all components
async function loadComponents() {
  const components = [
    'navbar',
    'hero',
    'about',
    'products',
    'location',
    'footer'
  ];

  let html = '';
  
  for (const component of components) {
    try {
      const response = await fetch(`/src/components/${component}.html`);
      const componentHTML = await response.text();
      html += componentHTML;
    } catch (error) {
      console.error(`Error loading component ${component}:`, error);
    }
  }

  document.querySelector('#app').innerHTML = html;
  
  // Load and render products after components are loaded
  await loadProducts();
  
  // Initialize after components are loaded
  initializeApp();
}

// Load products from JSON and render them
async function loadProducts() {
  try {
    const response = await fetch('/src/data/products.json');
    const products = await response.json();
    const track = document.getElementById('productsTrack');
    
    if (!track) return;
    
    // Clear existing content
    track.innerHTML = '';
    
    // Render products
    products.forEach(product => {
      const prefix = product.whatsappPrefix || 'saya ingin memesan';
      const whatsappMessage = encodeURIComponent(`Halo Kue Lestari, ${prefix} ${product.whatsappMessage}`);
      const whatsappUrl = `https://wa.me/60165751343?text=${whatsappMessage}`;
      
      const productCard = document.createElement('div');
      productCard.className = 'product-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden';
      productCard.innerHTML = `
        <div class="h-64 relative bg-gradient-to-br ${product.gradientFrom} ${product.gradientTo} flex items-center justify-center overflow-hidden">
          <img src="${product.image}" alt="${product.name}" class="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div class="p-6">
          <h3 class="text-2xl font-bold text-cream-900 mb-2">${product.name}</h3>
          <p class="text-cream-700 mb-4">${product.description}</p>
          <div class="flex items-center justify-between">
            <span class="text-xl font-semibold text-cream-900">${product.price}</span>
            <a 
              href="${whatsappUrl}" 
              target="_blank"
              rel="noopener noreferrer"
              class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-semibold transition-colors"
            >
              Order Now
            </a>
          </div>
        </div>
      `;
      
      track.appendChild(productCard);
    });
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

// Mobile menu toggle
function setupMobileMenu() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Initialize horizontal scroll for products with infinite scrolling
function initProductsScroll() {
  const wrapper = document.getElementById('productsScrollWrapper');
  const container = document.querySelector('.products-scroll-container');
  const track = document.querySelector('.products-scroll-track');
  const leftBtn = document.getElementById('scrollLeft');
  const rightBtn = document.getElementById('scrollRight');
  
  if (!wrapper || !container || !track) return;
  
  const originalCards = Array.from(track.children);
  const gap = 32;
  const getCardWidth = () => originalCards[0]?.offsetWidth || 350;
  const getSectionWidth = () => originalCards.length * (getCardWidth() + gap);
  
  // Clone cards for infinite scroll
  originalCards.forEach(card => {
    track.insertBefore(card.cloneNode(true), track.firstChild);
    track.appendChild(card.cloneNode(true));
  });
  
  // Set initial scroll position
  wrapper.scrollLeft = getSectionWidth();
  
  // Handle infinite scroll loop
  function handleInfiniteScroll() {
    const currentScroll = wrapper.scrollLeft;
    const sectionWidth = getSectionWidth();
    
    if (currentScroll >= sectionWidth * 2) {
      wrapper.scrollLeft = currentScroll - sectionWidth;
    } else if (currentScroll <= 0) {
      wrapper.scrollLeft = currentScroll + sectionWidth;
    }
  }
  
  // Mouse drag to scroll
  let isDown = false;
  let startX;
  let scrollLeft;
  
  wrapper.addEventListener('mousedown', (e) => {
    if (e.target.closest('a, button')) return;
    
    isDown = true;
    wrapper.classList.add('grabbing');
    startX = e.pageX - wrapper.offsetLeft;
    scrollLeft = wrapper.scrollLeft;
  });
  
  wrapper.addEventListener('mouseup', () => {
    isDown = false;
    wrapper.classList.remove('grabbing');
  });
  
  wrapper.addEventListener('mouseleave', () => {
    isDown = false;
    wrapper.classList.remove('grabbing');
  });
  
  wrapper.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    wrapper.scrollLeft = scrollLeft - (e.pageX - wrapper.offsetLeft - startX) * 1.5;
  });
  
  // Button scroll
  const scrollAmount = 400;
  const scrollBtn = (direction) => {
    wrapper.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    setTimeout(handleInfiniteScroll, 500);
  };
  
  leftBtn?.addEventListener('click', () => scrollBtn(-1));
  rightBtn?.addEventListener('click', () => scrollBtn(1));
  
  // Show indicators and fade effect
  leftBtn?.classList.add('visible');
  rightBtn?.classList.add('visible');
  container.classList.add('show-fade');
  
  // Scroll event
  wrapper.addEventListener('scroll', handleInfiniteScroll);
  
  // Resize handler
  window.addEventListener('resize', () => {
    wrapper.scrollLeft = getSectionWidth();
  });
}

// Initialize the application
function initializeApp() {
  setupMobileMenu();
  setupSmoothScrolling();
  initProductsScroll();
}

// Load components when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadComponents);
} else {
  loadComponents();
}