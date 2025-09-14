// Events page JavaScript
let allEvents = [];
let currentFilter = 'upcoming';

// Load events data when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
});

// Load events from JSON
async function loadEvents() {
    const loading = document.getElementById('loading');
    const eventsGrid = document.getElementById('eventsGrid');
    
    try {
        loading.style.display = 'block';
        eventsGrid.style.display = 'none';
        
        const response = await fetch('data/events.json');
        if (!response.ok) {
            throw new Error('Failed to load events data');
        }
        
        allEvents = await response.json();
        
        updateEventStats();
        showEvents('upcoming');
        
        loading.style.display = 'none';
        eventsGrid.style.display = 'grid';
        
    } catch (error) {
        console.error('Error loading events:', error);
        loading.innerHTML = `
            <div style="color: #dc3545; text-align: center;">
                <h3>তথ্য লোড করতে সমস্যা হয়েছে</h3>
                <p>পরে আবার চেষ্টা করুন।</p>
                <button onclick="loadEvents()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #2c5530; color: white; border: none; border-radius: 5px; cursor: pointer;">আবার চেষ্টা করুন</button>
            </div>
        `;
    }
}

// Show events based on status
function showEvents(status) {
    currentFilter = status;
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    if (status === 'upcoming') {
        document.getElementById('upcomingBtn').classList.add('active');
    } else {
        document.getElementById('completedBtn').classList.add('active');
    }
    
    // Filter and display events
    const filteredEvents = allEvents.filter(event => event.status === status);
    displayEvents(filteredEvents);
}

// Display events
function displayEvents(events) {
    const eventsGrid = document.getElementById('eventsGrid');
    const noResults = document.getElementById('noResults');
    
    if (events.length === 0) {
        eventsGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    eventsGrid.style.display = 'grid';
    eventsGrid.innerHTML = '';
    
    events.forEach((event, index) => {
        const eventCard = createEventCard(event, index);
        eventsGrid.appendChild(eventCard);
    });
}

// Create event card element
function createEventCard(event, index) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const isUpcoming = event.status === 'upcoming';
    const statusClass = isUpcoming ? 'status-upcoming' : 'status-completed';
    const statusText = isUpcoming ? 'আসন্ন' : 'সম্পন্ন';
    
    card.innerHTML = `
        <div class="event-image">
            <img src="${event.image}" alt="${event.title}" onerror="handleImageError(this)">
            <div class="event-status ${statusClass}">${statusText}</div>
        </div>
        <div class="event-content">
            <div class="event-date">
                <span>📅</span>
                <span>${formattedDate}</span>
            </div>
            <h3 class="event-title">${event.title}</h3>
            <div class="event-location">
                <span>📍</span>
                <span>${event.location}</span>
            </div>
            <p class="event-description">${event.description}</p>
            <div class="event-footer">
                <button class="read-more-btn" onclick="showEventModal('${event.id}')">
                    বিস্তারিত দেখুন
                </button>
            </div>
        </div>
    `;
    
    // Add click handler for the entire card
    card.addEventListener('click', function(e) {
        if (!e.target.classList.contains('read-more-btn')) {
            showEventModal(event.id);
        }
    });
    
    return card;
}

// Handle image loading errors
function handleImageError(img) {
    img.style.display = 'none';
    img.parentElement.style.background = 'linear-gradient(135deg, #e9ecef, #dee2e6)';
    img.parentElement.style.display = 'flex';
    img.parentElement.style.alignItems = 'center';
    img.parentElement.style.justifyContent = 'center';
    img.parentElement.innerHTML += '<span style="font-size: 3rem; color: #6c757d;">📅</span>';
}

// Show event modal
function showEventModal(eventId) {
    const event = allEvents.find(e => e.id === eventId);
    if (!event) return;
    
    const modal = document.getElementById('eventModal');
    const modalBody = document.getElementById('modalBody');
    
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('bn-BD', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const isUpcoming = event.status === 'upcoming';
    const statusText = isUpcoming ? 'আসন্ন ইভেন্ট' : 'সম্পন্ন ইভেন্ট';
    const statusColor = isUpcoming ? '#28a745' : '#6c757d';
    
    modalBody.innerHTML = `
        <img src="${event.image}" alt="${event.title}" class="modal-event-image" onerror="this.style.display='none'">
        <h2 class="modal-event-title">${event.title}</h2>
        <div class="modal-event-meta">
            <div class="modal-meta-item">
                <span>📅</span>
                <span><strong>তারিখ:</strong> ${formattedDate}</span>
            </div>
            <div class="modal-meta-item">
                <span>📍</span>
                <span><strong>স্থান:</strong> ${event.location}</span>
            </div>
            <div class="modal-meta-item">
                <span>🏷️</span>
                <span><strong>অবস্থা:</strong> <span style="color: ${statusColor}; font-weight: 600;">${statusText}</span></span>
            </div>
        </div>
        <div class="modal-event-description">
            <h3 style="color: #2c5530; margin-bottom: 1rem;">বিস্তারিত বিবরণ</h3>
            <p>${event.description}</p>
            ${isUpcoming ? `
                <div style="margin-top: 2rem; padding: 1rem; background: #e8f5e8; border-radius: 10px; border-left: 4px solid #28a745;">
                    <h4 style="color: #155724; margin-bottom: 0.5rem;">📢 অংশগ্রহণের তথ্য</h4>
                    <p style="color: #155724; margin: 0;">আরও বিস্তারিত জানতে এবং অংশগ্রহণের জন্য আমাদের সাথে যোগাযোগ করুন।</p>
                </div>
            ` : ''}
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('eventModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
document.getElementById('eventModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Close modal with escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Update event statistics
function updateEventStats() {
    const upcomingEvents = allEvents.filter(event => event.status === 'upcoming');
    const completedEvents = allEvents.filter(event => event.status === 'completed');
    const uniqueLocations = [...new Set(allEvents.map(event => event.location))];
    
    // Update counters in navigation
    document.getElementById('upcomingCount').textContent = upcomingEvents.length;
    document.getElementById('completedCount').textContent = completedEvents.length;
    
    // Update statistics section
    animateCounter(document.getElementById('totalEvents'), allEvents.length);
    animateCounter(document.getElementById('upcomingEvents'), upcomingEvents.length);
    animateCounter(document.getElementById('completedEvents'), completedEvents.length);
    animateCounter(document.getElementById('eventLocations'), uniqueLocations.length);
}

// Animate counter numbers
function animateCounter(element, target) {
    if (!element) return;
    
    const duration = 2000;
    const start = performance.now();
    const startValue = 0;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Search functionality (can be added later)
function searchEvents(query) {
    const filteredEvents = allEvents.filter(event => 
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase()) ||
        event.location.toLowerCase().includes(query.toLowerCase())
    );
    
    displayEvents(filteredEvents);
}

// Filter events by date range
function filterEventsByDateRange(startDate, endDate) {
    const filteredEvents = allEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= startDate && eventDate <= endDate;
    });
    
    displayEvents(filteredEvents);
}

// Get events by location
function getEventsByLocation(location) {
    return allEvents.filter(event => event.location === location);
}

// Get upcoming events (utility function)
function getUpcomingEvents(limit = null) {
    const upcoming = allEvents
        .filter(event => event.status === 'upcoming')
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return limit ? upcoming.slice(0, limit) : upcoming;
}

// Get recent events (utility function)
function getRecentEvents(limit = 5) {
    const completed = allEvents
        .filter(event => event.status === 'completed')
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return completed.slice(0, limit);
}

// Export events data (utility function for admins)
function exportEvents() {
    const dataStr = JSON.stringify(allEvents, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'acmo_events.json';
    link.click();
    URL.revokeObjectURL(url);
}

// Initialize intersection observer for animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('event-stats')) {
                    updateEventStats();
                }
            }
        });
    }, observerOptions);
    
    // Observe statistics section
    const statsSection = document.querySelector('.event-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + 1 for upcoming events
    if (e.ctrlKey && e.key === '1') {
        e.preventDefault();
        showEvents('upcoming');
    }
    
    // Ctrl + 2 for completed events
    if (e.ctrlKey && e.key === '2') {
        e.preventDefault();
        showEvents('completed');
    }
});

// Auto-refresh for upcoming events (check every 24 hours)
setInterval(() => {
    if (currentFilter === 'upcoming') {
        loadEvents();
    }
}, 24 * 60 * 60 * 1000);