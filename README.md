# ACMO Website - Anti Child Marriage Organization

A fully responsive, professional website for ACMO (Anti Child Marriage Organization) built with pure HTML, CSS, and JavaScript.

## 🌟 Features

- **Fully Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Interactive Statistics** - Animated counters and Chart.js pie chart for district-wise data
- **Dynamic Member Management** - Search, filter, and pagination for member directory
- **Event Management** - Upcoming and past events with detailed information
- **Image Gallery** - Responsive gallery with category filtering
- **Contact Form** - Ready for integration with Formspree/EmailJS
- **Multi-language Support** - Bengali and English content
- **SEO Optimized** - Proper meta tags and semantic HTML
- **GitHub Pages Ready** - No backend dependencies

## 🚀 Quick Start

1. **Clone or Download** this repository
2. **Open `index.html`** in your web browser
3. **Upload to GitHub Pages** or any static hosting service

```bash
# Clone the repository
git clone https://github.com/your-username/acmo-website.git

# Navigate to the project directory
cd acmo-website

# Open in browser (or use a local server)
open index.html
```

## 📁 Project Structure

```
acmo-website/
├── assets/
│   ├── images/
│   │   ├── logo.png                 # ACMO logo
│   │   ├── members/                 # Member photos
│   │   │   ├── rabbi.jpg
│   │   │   ├── fatema.jpg
│   │   │   └── ...
│   │   └── gallery/                 # Gallery images
│   │       ├── community_awareness.jpg
│   │       ├── school_visit.jpg
│   │       └── ...
│   ├── css/
│   │   ├── navbar.css               # Navigation styles
│   │   ├── footer.css               # Footer styles
│   │   ├── home.css                 # Homepage styles
│   │   ├── members.css              # Members page styles
│   │   ├── events.css               # Events page styles
│   │   ├── about.css                # About page styles
│   │   ├── contact.css              # Contact page styles
│   │   ├── gallery.css              # Gallery page styles
│   │   └── stats.css                # Statistics section styles
│   └── js/
│       ├── main.js                  # Main JavaScript functionality
│       ├── members.js               # Members page functionality
│       ├── events.js                # Events page functionality
│       ├── gallery.js               # Gallery page functionality
│       └── chart.js                 # Chart.js configuration
├── data/
│   ├── members.json                 # Members data
│   ├── events.json                  # Events data
│   └── gallery.json                 # Gallery data
├── index.html                       # Homepage
├── members.html                     # Members directory
├── about.html                       # About ACMO
├── events.html                      # Events listing
├── contact.html                     # Contact form
├── gallery.html                     # Image gallery
└── README.md                        # This file
```

## 🖼️ Adding Images

### Logo
Place your ACMO logo at:
```
assets/images/logo.png
```
**Recommended size:** 200x200px, transparent background

### Member Photos
Add member photos to:
```
assets/images/members/[member-name].jpg
```
**Recommended size:** 400x400px, square aspect ratio

### Gallery Images
Add gallery images to:
```
assets/images/gallery/[image-name].jpg
```
**Recommended size:** 1200x800px or similar high-resolution

### Event Images
Add event images to:
```
assets/images/events/[event-name].jpg
```
**Recommended size:** 1200x600px, landscape orientation

## 📊 Updating Data

### Adding New Members

Edit `data/members.json`:

```json
{
    "id": "ACMO-XXX",
    "name": "Member Name",
    "division": "Dhaka",
    "address": "Full Address",
    "joined_date": "2025-01-01",
    "email": "email@example.com",
    "photo": "assets/images/members/photo.jpg"
}
```

### Adding New Events

Edit `data/events.json`:

```json
{
    "id": "event-XXX",
    "title": "Event Title",
    "date": "2025-12-31",
    "location": "Location Name",
    "description": "Event description...",
    "image": "assets/images/events/event.jpg",
    "status": "upcoming" // or "completed"
}
```

### Adding Gallery Images

Edit `data/gallery.json`:

```json
{
    "id": "gallery-XXX",
    "title": "Image Title",
    "image": "assets/images/gallery/image.jpg",
    "category": "awareness",
    "date": "2025-01-01"
}
```

### Updating Statistics Chart

Edit the data in `assets/js/chart.js`:

```javascript
const chartData = {
    labels: ['District 1', 'District 2', ...],
    datasets: [{
        data: [31, 27, 23, ...], // Update these numbers
        // ... other configurations
    }]
};
```

## 🎨 Customization

### Colors
The website uses a consistent color scheme defined in CSS custom properties. Main colors:
- **Primary Green:** `#2c5530`
- **Secondary Green:** `#4a7c59`
- **Accent Orange:** `#ff6b35`
- **Secondary Orange:** `#f7931e`

### Fonts
Default font stack: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`

### Responsive Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

## 🚀 Deployment

### GitHub Pages
1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select source branch (main/master)
4. Your site will be available at `https://username.github.io/repository-name`

### Other Hosting Services
The website works with any static hosting service:
- Netlify
- Vercel
- Firebase Hosting
- AWS S3
- Any web server

## 🔧 Technical Features

### Performance Optimizations
- Lazy loading for images
- Minified CSS and JS
- Optimized animations
- Efficient DOM manipulation

### Accessibility
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- High contrast colors
- Screen reader friendly

### SEO Features
- Meta tags for social sharing
- Structured data markup
- Proper heading hierarchy
- Alt text for images
- Fast loading times

## 🛠️ Development

### Local Development Server
For better development experience, use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📞 Support & Contact

For technical support or questions about the website:
- **Email:** acmou.18@gmail.com
- **Facebook:** [facebook.com/acmou.18](https://facebook.com/acmou.18)

## 📝 License

This project is created for ACMO (Anti Child Marriage Organization). All rights reserved.

## 🤝 Contributing

To contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📋 Changelog

### Version 1.0.0 (2025-01-01)
- Initial release
- Complete responsive design
- Member management system
- Event management system
- Gallery with filtering
- Statistics dashboard
- Contact form integration ready

---

**Built with ❤️ for ACMO - Anti Child Marriage Organization**

*সচেতনতার দীপ্তিতে বাল্যবিবাহমুক্ত ভবিষ্যতের পথচলা*