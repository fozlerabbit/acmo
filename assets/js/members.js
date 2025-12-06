// Members page JavaScript
let allMembers = [];
let filteredMembers = [];
let currentPage = 1;
const membersPerPage = 12;

// Load members data when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadMembers();
});

// Load members from JSON
async function loadMembers() {
    const loading = document.getElementById('loading');
    const membersGrid = document.getElementById('membersGrid');
    
    try {
        loading.style.display = 'block';
        membersGrid.style.display = 'none';
        
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error('Failed to load members data');
        }
        
        allMembers = await response.json();
        filteredMembers = [...allMembers];
        
        updateMembersStats();
        displayMembers();
        setupPagination();
        
        loading.style.display = 'none';
        membersGrid.style.display = 'grid';
        
    } catch (error) {
        console.error('Error loading members:', error);
        loading.innerHTML = `
            <div style="color: #dc3545; text-align: center;">
                <h3>তথ্য লোড করতে সমস্যা হয়েছে</h3>
                <p>পরে আবার চেষ্টা করুন।</p>
                <button onclick="loadMembers()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #2c5530; color: white; border: none; border-radius: 5px; cursor: pointer;">আবার চেষ্টা করুন</button>
            </div>
        `;
    }
}

// Display members for current page
function displayMembers() {
    const membersGrid = document.getElementById('membersGrid');
    const noResults = document.getElementById('noResults');
    
    if (filteredMembers.length === 0) {
        membersGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    membersGrid.style.display = 'grid';
    
    const startIndex = (currentPage - 1) * membersPerPage;
    const endIndex = startIndex + membersPerPage;
    const currentMembers = filteredMembers.slice(startIndex, endIndex);
    
    membersGrid.innerHTML = '';
    
    currentMembers.forEach((member, index) => {
        const memberCard = createMemberCard(member, index);
        membersGrid.appendChild(memberCard);
    });
}

// Create member card element
function createMemberCard(member, index) {
    const card = document.createElement('div');
    card.className = 'member-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const joinedDate = new Date(member.joined_date);
    const formattedDate = joinedDate.toLocaleDateString('bn-BD');
    
    card.innerHTML = `
        <img src="${member.photo}" alt="${member.name}" class="member-photo" onerror="handleImageError(this)">
        <h3 class="member-name">${member.name}</h3>
        <span class="member-id">ACMO-2025-${member.id}</span>
        <div class="member-info">
            <div class="info-item">
                <span class="info-icon">📍</span>
                <span>পদ: ${member.position}, ${member.division}</span>
            </div>
            <div class="info-item">
                <span class="info-icon">📍</span>
                <span>${member.division}, ${member.address}</span>
            </div>
            <div class="info-item">
                <span class="info-icon">📧</span>
                <a href="mailto:${member.email}" class="member-email">${member.email}</a>
            </div>
        </div>
    `;
    
    return card;
}

// Handle image loading errors
function handleImageError(img) {
    img.classList.add('error');
    img.style.background = 'linear-gradient(135deg, #e9ecef, #dee2e6)';
    img.style.display = 'flex';
    img.style.alignItems = 'center';
    img.style.justifyContent = 'center';
    img.innerHTML = '👤';
    img.src = '';
}

// Filter members based on search and filters
function filterMembers() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const divisionFilter = document.getElementById('divisionFilter').value;
    const yearFilter = document.getElementById('yearFilter').value;
    
    filteredMembers = allMembers.filter(member => {
        const nameMatch = member.name.toLowerCase().includes(searchInput);
        const divisionMatch = !divisionFilter || member.division === divisionFilter;
        const yearMatch = !yearFilter || member.joined_date.startsWith(yearFilter);
        
        return nameMatch && divisionMatch && yearMatch;
    });
    
    currentPage = 1;
    updateMembersStats();
    displayMembers();
    setupPagination();
}

// Update members statistics
function updateMembersStats() {
    const totalMembers = document.getElementById('totalMembers');
    const visibleMembers = document.getElementById('visibleMembers');
    
    totalMembers.textContent = allMembers.length;
    visibleMembers.textContent = filteredMembers.length;
    
    // Animate counters
    animateCounter(totalMembers, allMembers.length);
    animateCounter(visibleMembers, filteredMembers.length);
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

// Setup pagination
function setupPagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <a href="#" class="page-btn ${currentPage === 1 ? 'disabled' : ''}" 
           onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? '' : ''}>
            ◀ পূর্ববর্তী
        </a>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            paginationHTML += `
                <a href="#" class="page-btn ${i === currentPage ? 'active' : ''}" 
                   onclick="changePage(${i})">${i}</a>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            paginationHTML += '<span class="page-btn disabled">...</span>';
        }
    }
    
    // Next button
    paginationHTML += `
        <a href="#" class="page-btn ${currentPage === totalPages ? 'disabled' : ''}" 
           onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? '' : ''}>
            পরবর্তী ▶
        </a>
    `;
    
    pagination.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayMembers();
    setupPagination();
    
    // Scroll to top of members section
    document.querySelector('.members-section').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Search functionality
document.getElementById('searchInput').addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
        filterMembers();
    }
});

// Real-time search (debounced)
let searchTimeout;
document.getElementById('searchInput').addEventListener('input', function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        filterMembers();
    }, 300);
});

// Export members data (utility function for admins)
function exportMembers() {
    const dataStr = JSON.stringify(filteredMembers, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'acmo_members.json';
    link.click();
    URL.revokeObjectURL(url);
}

// Advanced search functionality
function setupAdvancedSearch() {
    const searchInput = document.getElementById('searchInput');
    
    // Add placeholder animation
    const placeholders = [
        'সদস্যের নাম খুঁজুন...',
        'সদস্য ID দিয়ে খুঁজুন...',
        'ইমেইল দিয়ে খুঁজুন...'
    ];
    
    let placeholderIndex = 0;
    setInterval(() => {
        placeholderIndex = (placeholderIndex + 1) % placeholders.length;
        searchInput.placeholder = placeholders[placeholderIndex];
    }, 3000);
}

// Initialize advanced features
document.addEventListener('DOMContentLoaded', function() {
    setupAdvancedSearch();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl + F to focus search
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
        
        // Arrow keys for pagination
        if (e.key === 'ArrowLeft' && e.ctrlKey) {
            e.preventDefault();
            changePage(currentPage - 1);
        } else if (e.key === 'ArrowRight' && e.ctrlKey) {
            e.preventDefault();
            changePage(currentPage + 1);
        }
    });
});

// Utility function to get member by ID
function getMemberById(id) {
    return allMembers.find(member => member.id === id);
}

// Utility function to get members by division
function getMembersByDivision(division) {
    return allMembers.filter(member => member.division === division);
}

// Statistics helper functions
function getMembersStats() {
    const stats = {
        total: allMembers.length,
        byDivision: {},
        byYear: {},
        recentJoins: []
    };
    
    allMembers.forEach(member => {
        // By division
        stats.byDivision[member.division] = (stats.byDivision[member.division] || 0) + 1;
        
        // By year
        const year = member.joined_date.split('-')[0];
        stats.byYear[year] = (stats.byYear[year] || 0) + 1;
        
        // Recent joins (last 30 days)
        const joinDate = new Date(member.joined_date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        if (joinDate >= thirtyDaysAgo) {
            stats.recentJoins.push(member);
        }
    });
    
    return stats;

}






