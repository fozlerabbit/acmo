// Gallery page JavaScript
let allImages = [];
let filteredImages = [];
let currentFilter = 'all';
let currentPage = 0;
let imagesPerPage = 12;
let currentLightboxIndex = 0;

// Load gallery data when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadGallery();
    setupFilterButtons();
});

// Load gallery from JSON
async function loadGallery() {
    const loading = document.getElementById('loading');
    const galleryGrid = document.getElementById('galleryGrid');
    
    try {
        loading.style.display = 'block';
        galleryGrid.style.display = 'none';
        
        const response = await fetch('data/gallery.json');
        if (!response.ok) {
            throw new Error('Failed to load gallery data');
        }
        
        allImages = await response.json();
        
        // Sort images by date (newest first)
        allImages.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        filteredImages = [...allImages];
        currentPage = 0;
        
        updateGalleryStats();
        displayImages();
        
        loading.style.display = 'none';
        galleryGrid.style.display = 'grid';
        
    } catch (error) {
        console.error('Error loading gallery:', error);
        loading.innerHTML = `
            <div style="color: #dc3545; text-align: center;">
                <h3>ছবি লোড করতে সমস্যা হয়েছে</h3>
                <p>পরে আবার চেষ্টা করুন।</p>
                <button onclick="loadGallery()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #2c5530; color: white; border: none; border-radius: 5px; cursor: pointer;">আবার চেষ্টা করুন</button>
            </div>
        `;
    }
}

// Setup filter button event listeners
function setupFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            filterImages(category);
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Filter images by category
function filterImages(category) {
    currentFilter = category;
    currentPage = 0;
    
    if (category === 'all') {
        filteredImages = [...allImages];
    } else {
        filteredImages = allImages.filter(image => image.category === category);
    }
    
    updateGalleryStats();
    displayImages();
}

// Display images for current page
function displayImages(append = false) {
    const galleryGrid = document.getElementById('galleryGrid');
    const noResults = document.getElementById('noResults');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    
    if (filteredImages.length === 0) {
        galleryGrid.style.display = 'none';
        noResults.style.display = 'block';
        loadMoreContainer.style.display = 'none';
        return;
    }
    
    noResults.style.display = 'none';
    galleryGrid.style.display = 'grid';
    
    if (!append) {
        galleryGrid.innerHTML = '';
    }
    
    const startIndex = currentPage * imagesPerPage;
    const endIndex = startIndex + imagesPerPage;
    const currentImages = filteredImages.slice(startIndex, endIndex);
    
    currentImages.forEach((image, index) => {
        const imageCard = createImageCard(image, startIndex + index);
        galleryGrid.appendChild(imageCard);
    });
    
    // Update load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (endIndex >= filteredImages.length) {
        loadMoreContainer.style.display = 'none';
    } else {
        loadMoreContainer.style.display = 'block';
    }
}

// Create image card element
function createImageCard(image, globalIndex) {
    const card = document.createElement('div');
    card.className = 'gallery-item';
    card.style.animationDelay = `${(globalIndex % imagesPerPage) * 0.1}s`;
    
    const imageDate = new Date(image.date);
    const formattedDate = imageDate.toLocaleDateString('bn-BD');
    
    card.innerHTML = `
        <img src="${image.image}" alt="${image.title}" class="gallery-image" onerror="handleImageError(this)">
        <div class="gallery-overlay">
            <div class="gallery-info">
                <h3 class="gallery-title">${image.title}</h3>
                <div class="gallery-meta">
                    <span class="gallery-category">${getCategoryName(image.category)}</span>
                    <span class="gallery-date">${formattedDate}</span>
                </div>
            </div>
        </div>
    `;
    
    // Add click handler to open lightbox
    card.addEventListener('click', function() {
        openLightbox(globalIndex);
    });
    
    return card;
}

// Get category display name in Bengali
function getCategoryName(category) {
    const categoryNames = {
        'awareness': 'সচেতনতা',
        'education': 'শিক্ষা',
        'training': 'প্রশিক্ষণ',
        'campaign': 'ক্যাম্পেইন',
        'advocacy': 'অ্যাডভোকেসি',
        'empowerment': 'ক্ষমতায়ন',
        'legal': 'আইনি সহায়তা',
        'counseling': 'কাউন্সেলিং',
        'conference': 'সম্মেলন',
        'coordination': 'সমন্বয়',
        'ceremony': 'অনুষ্ঠান',
        'leadership': 'নেতৃত্ব'
    };
    
    return categoryNames[category] || category;
}

// Handle image loading errors
function handleImageError(img) {
    img.style.display = 'none';
    img.parentElement.style.background = 'linear-gradient(135deg, #e9ecef, #dee2e6)';
    img.parentElement.style.display = 'flex';
    img.parentElement.style.alignItems = 'center';
    img.parentElement.style.justifyContent = 'center';
    img.parentElement.innerHTML = '<span style="font-size: 4rem; color: #6c757d;">🖼️</span>';
}

// Load more images
function loadMoreImages() {
    currentPage++;
    displayImages(true);
}

// Open lightbox
function openLightbox(imageIndex) {
    currentLightboxIndex = imageIndex;
    const lightbox = document.getElementById('lightbox');
    const image = filteredImages[imageIndex];
    
    if (!image) return;
    
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCategory = document.getElementById('lightboxCategory');
    const lightboxDate = document.getElementById('lightboxDate');
    
    lightboxImage.src = image.image;
    lightboxImage.alt = image.title;
    lightboxTitle.textContent = image.title;
    lightboxCategory.textContent = `ক্যাটেগরি: ${getCategoryName(image.category)}`;
    
    const imageDate = new Date(image.date);
    const formattedDate = imageDate.toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    lightboxDate.textContent = `তারিখ: ${formattedDate}`;
    
    // Update navigation buttons
    updateLightboxNavigation();
    
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add keyboard event listener
    document.addEventListener('keydown', handleLightboxKeyboard);
}

// Close lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Remove keyboard event listener
    document.removeEventListener('keydown', handleLightboxKeyboard);
}

// Previous image in lightbox
function previousImage() {
    if (currentLightboxIndex > 0) {
        currentLightboxIndex--;
        updateLightboxContent();
    }
}

// Next image in lightbox
function nextImage() {
    if (currentLightboxIndex < filteredImages.length - 1) {
        currentLightboxIndex++;
        updateLightboxContent();
    }
}

// Update lightbox content
function updateLightboxContent() {
    const image = filteredImages[currentLightboxIndex];
    if (!image) return;
    
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCategory = document.getElementById('lightboxCategory');
    const lightboxDate = document.getElementById('lightboxDate');
    
    lightboxImage.src = image.image;
    lightboxImage.alt = image.title;
    lightboxTitle.textContent = image.title;
    lightboxCategory.textContent = `ক্যাটেগরি: ${getCategoryName(image.category)}`;
    
    const imageDate = new Date(image.date);
    const formattedDate = imageDate.toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    lightboxDate.textContent = `তারিখ: ${formattedDate}`;
    
    updateLightboxNavigation();
}

// Update lightbox navigation buttons
function updateLightboxNavigation() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    prevBtn.disabled = currentLightboxIndex === 0;
    nextBtn.disabled = currentLightboxIndex === filteredImages.length - 1;
}

// Handle keyboard navigation in lightbox
function handleLightboxKeyboard(e) {
    switch(e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            previousImage();
            break;
        case 'ArrowRight':
            e.preventDefault();
            nextImage();
            break;
    }
}

// Update gallery statistics
function updateGalleryStats() {
    const totalImages = document.getElementById('totalImages');
    const visibleImages = document.getElementById('visibleImages');
    
    totalImages.textContent = allImages.length;
    visibleImages.textContent = filteredImages.length;
    
    // Animate counters
    animateCounter(totalImages, allImages.length);
    animateCounter(visibleImages, filteredImages.length);
}

// Animate counter numbers
function animateCounter(element, target) {
    const duration = 1000;
    const start = performance.now();
    const startValue = 0;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(progress * target);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Close lightbox when clicking outside
document.getElementById('lightbox').addEventListener('click', function(e) {
    if (e.target === this) {
        closeLightbox();
    }
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.getElementById('lightbox').addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.getElementById('lightbox').addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next image
            nextImage();
        } else {
            // Swipe right - previous image
            previousImage();
        }
    }
}

// Search functionality (can be added later)
function searchImages(query) {
    const searchFiltered = allImages.filter(image => 
        image.title.toLowerCase().includes(query.toLowerCase()) ||
        getCategoryName(image.category).toLowerCase().includes(query.toLowerCase())
    );
    
    filteredImages = searchFiltered;
    currentPage = 0;
    updateGalleryStats();
    displayImages();
}

// Get images by category (utility function)
function getImagesByCategory(category) {
    return allImages.filter(image => image.category === category);
}

// Get recent images (utility function)
function getRecentImages(limit = 6) {
    return allImages
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
}

// Export gallery data (utility function)
function exportGallery() {
    const dataStr = JSON.stringify(filteredImages, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'acmo_gallery.json';
    link.click();
    URL.revokeObjectURL(url);
}

// Initialize lazy loading for better performance
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialize gallery features
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl + number keys for category filters
        if (e.ctrlKey && e.key >= '1' && e.key <= '9') {
            e.preventDefault();
            const filterBtns = document.querySelectorAll('.filter-btn');
            const index = parseInt(e.key) - 1;
            if (filterBtns[index]) {
                filterBtns[index].click();
            }
        }
    });
});

// Auto-refresh gallery every 30 minutes
setInterval(() => {
    loadGallery();
}, 30 * 60 * 1000);