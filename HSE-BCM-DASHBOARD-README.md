# HSE-BCM Calendar 2026 - Interactive Dashboard

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-production-success.svg)

An advanced, interactive dashboard for tracking Health, Safety, Environment, Energy & Business Continuity (HSE-BCM) events throughout 2026, featuring UAE National and Global International Observances.

## 🌟 Features

### 🎨 Enhanced User Interface
- **Modern Design**: Beautiful gradient backgrounds, smooth animations, and professional typography
- **Responsive Layout**: Fully optimized for desktop, tablet, and mobile devices
- **Dark Mode Support**: Coming soon
- **Print-Friendly**: Special print styles for generating reports
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

### 📊 Interactive Visualizations
- **Chart.js Integration**: Beautiful, animated charts powered by Chart.js
- **4 Chart Types**:
  - Monthly Distribution (Bar Chart)
  - Category Breakdown (Doughnut Chart)
  - Priority Analysis (Pie Chart)
  - Scope Distribution (Bar Chart)
- **Real-time Updates**: Charts update instantly when filters are applied

### 🔍 Advanced Filtering
- **Multi-Criteria Filtering**:
  - Category (Health, Safety, Environment, Energy, BCM)
  - Priority (High, Medium, Low)
  - Scope (Global, UAE National)
  - Month (January - December)
  - Text Search (Search across titles, descriptions, and organizers)
- **One-Click Filters**: Click stat cards to instantly filter by category
- **Smart Search**: Debounced search for optimal performance

### 👁️ Multiple View Modes
1. **Cards View**: Detailed cards with all event information
2. **Calendar View**: Month-by-month grid layout
3. **Timeline View**: Chronological timeline with visual indicators
4. **Analytics View**: Comprehensive charts and statistics

### 📤 Export Capabilities
- **CSV Export**: Spreadsheet-compatible format
- **JSON Export**: For developers and data integration
- **iCal Export**: Import entire calendar into Google Calendar, Outlook, etc.
- **Individual Events**: Add single events to your calendar
- **Print Export**: Print-optimized layout

### 🔄 Data Synchronization
- **API Integration**: Connect to WHO, UN, ILO, UNEP, and UAE Government APIs
- **Auto-Sync**: Automatic synchronization every 24 hours
- **Manual Sync**: User-triggered synchronization
- **Fallback Data**: Built-in dataset ensures functionality even offline
- **Error Handling**: Graceful degradation when APIs are unavailable

### 💬 Interactive Elements
- **Modal Dialogs**: Detailed event information in beautiful modals
- **Notifications**: Toast notifications for user actions
- **Share Functionality**: Share events via Web Share API or clipboard
- **Calendar Integration**: One-click add to calendar
- **Hover Effects**: Interactive cards with smooth transitions
- **Click Actions**: Quick access to event details and external sources

### 🎯 Professional Features
- **Loading States**: Elegant loading animations
- **Error Messages**: User-friendly error handling
- **No Results State**: Helpful messages when filters return no results
- **Statistics Dashboard**: Real-time event statistics
- **Icon System**: Font Awesome icons for better visual communication
- **Custom Scrollbars**: Styled scrollbars for modern browsers

### 🚀 Performance Optimizations
- **Lazy Loading**: Charts loaded only when needed
- **Debounced Search**: Reduces unnecessary re-renders
- **Memory Management**: Proper cleanup of chart instances
- **Caching**: LocalStorage caching for API responses
- **Rate Limiting**: Prevents API abuse

---

## 📋 Event Categories

The dashboard tracks events across 5 main categories:

### 1. 🫀 Occupational Health / Public Health
- World Health Day
- World Cancer Day
- World Mental Health Day
- World AIDS Day
- World Diabetes Day
- And more...

### 2. 🦺 Occupational Safety
- World Day for Safety and Health at Work
- International Day for Disaster Risk Reduction
- Civil Defence events

### 3. 🌱 Environment
- World Environment Day
- World Water Day
- World Oceans Day
- World Wildlife Day
- World Wetlands Day
- And more...

### 4. ⚡ Energy and Sustainability
- World Bicycle Day
- World Cities Day
- Sustainable development events

### 5. 🛡️ Business Continuity / Resilience
- World Civil Defence Day
- World Tsunami Awareness Day
- World Humanitarian Day
- Emergency preparedness events

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for CDN resources and API sync)
- Optional: API keys for WHO, UN, ILO, UNEP, UAE portals

### Installation

#### Option 1: Direct Use
1. Download `hse-bcm-dashboard.html`
2. Open in your web browser
3. Done! The dashboard is fully functional

#### Option 2: Web Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000/hse-bcm-dashboard.html`

#### Option 3: GitHub Pages
1. Fork this repository
2. Enable GitHub Pages in repository settings
3. Access via: `https://your-username.github.io/repository-name/hse-bcm-dashboard.html`

---

## 📖 Usage Guide

### Basic Operations

#### Filtering Events
1. **By Category**: Select from dropdown or click stat cards
2. **By Priority**: Choose High, Medium, or Low priority
3. **By Scope**: Filter Global or UAE National events
4. **By Month**: Select specific month
5. **By Search**: Type keywords to search

#### Viewing Events
1. **Cards View**: See all events as detailed cards
2. **Calendar View**: Browse by month
3. **Timeline View**: See chronological progression
4. **Analytics View**: Analyze event distribution

#### Exporting Data
1. Click "Export CSV" for spreadsheet format
2. Click "Export iCal" for calendar import
3. Click "Export JSON" for data integration
4. Click "Print" for hard copy

#### Adding to Calendar
1. Click any event card to open details
2. Click "Add to Calendar" button
3. Import the downloaded .ics file into your calendar app

#### Sharing Events
1. Open event details modal
2. Click "Share" button
3. Use native share or copy to clipboard

### Advanced Features

#### API Synchronization
1. Click "Sync Data" button in header
2. Dashboard fetches latest data from:
   - World Health Organization
   - United Nations
   - International Labour Organization
   - UN Environment Programme
   - UAE Government Portal
3. Events are automatically updated

#### Keyboard Shortcuts
- `ESC`: Close modal dialogs
- `Ctrl/Cmd + P`: Print dashboard
- `Ctrl/Cmd + F`: Focus search box (browser default)

---

## 🔧 Configuration

### API Integration

To enable API synchronization, configure API endpoints in the dashboard:

```javascript
const API_CONFIG = {
    WHO: 'https://www.who.int/api/events',
    UN: 'https://www.un.org/api/observances',
    ILO: 'https://www.ilo.org/api/events',
    UNEP: 'https://www.unep.org/api/environmental-days',
    UAE: 'https://u.ae/api/national-days'
};
```

See [API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md) for detailed instructions.

### Customization

#### Colors
Modify CSS variables in the `<style>` section:

```css
:root {
    --primary-color: #1F4E78;
    --accent-color: #667eea;
    --health-color: #e74c3c;
    --safety-color: #f39c12;
    --environment-color: #27ae60;
    --energy-color: #3498db;
    --bcm-color: #9b59b6;
}
```

#### Events Data
Update the `events` array in the JavaScript section to add/modify events:

```javascript
const events = [
    {
        month: 1,
        title: "Your Event Name",
        type: "International Day",
        scope: "Global",
        category: "1. Occupational Health / Public Health / Health",
        brief: "Event description",
        organizer: "Organization Name",
        source: "https://event-url.com",
        priority: "High",
        start: "2026-01-15",
        end: "2026-01-15"
    },
    // ... more events
];
```

---

## 🏗️ Architecture

### Technology Stack
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with custom properties, flexbox, grid
- **JavaScript (ES6+)**: Vanilla JS, no framework dependencies
- **Chart.js 4.4.0**: Data visualization
- **Anime.js 3.2.1**: Advanced animations
- **Font Awesome 6.4.0**: Icon library

### File Structure
```
html/
├── hse-bcm-dashboard.html     # Main dashboard file
├── HSE-BCM-DASHBOARD-README.md # This file
├── API_INTEGRATION_GUIDE.md   # API integration documentation
└── assets/                     # Optional assets folder
    ├── images/
    └── data/
```

### Code Organization
```javascript
// Global State
let events = [];
let filteredEvents = [];
let currentView = 'cards';
let charts = {};

// Utility Functions
getCategoryClass()
formatDate()
debounce()

// Core Functions
updateStats()
applyFilters()
renderView()

// View Renderers
renderCardsView()
renderCalendarView()
renderTimelineView()
renderChartsView()

// Chart Functions
initCharts()

// Export Functions
exportToCSV()
exportToJSON()
exportToICal()

// Modal Functions
showEventDetails()
closeModal()

// Integration Functions
syncData()
```

---

## 📊 Statistics

### Current Dataset (2026)
- **Total Events**: 42
- **Health Events**: 20
- **Safety Events**: 1
- **Environment Events**: 12
- **Energy Events**: 2
- **BCM Events**: 5
- **UAE National**: 2
- **Global Events**: 40

### Coverage
- **Organizations**: WHO, UN, ILO, UNEP, ICDO, UNESCO, FAO, IDF, UICC, and more
- **Event Types**: International Days, National Days, International Months
- **Priority Levels**: High (17), Medium (21), Low (4)

---

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Opera | 76+ | ✅ Fully Supported |
| Mobile Safari | iOS 14+ | ✅ Fully Supported |
| Chrome Mobile | Android 90+ | ✅ Fully Supported |

---

## 📱 Mobile Support

The dashboard is fully responsive and optimized for:
- 📱 Smartphones (320px+)
- 📱 Phablets (480px+)
- 📱 Tablets (768px+)
- 💻 Laptops (1024px+)
- 🖥️ Desktops (1440px+)
- 🖥️ Large Displays (1920px+)

---

## 🔒 Security

- ✅ No sensitive data stored
- ✅ HTTPS recommended for production
- ✅ Input sanitization implemented
- ✅ CORS-compliant API requests
- ✅ No external tracking scripts
- ✅ Privacy-focused design

---

## 🚧 Roadmap

### Version 2.1 (Q2 2026)
- [ ] Dark mode toggle
- [ ] Multi-language support (Arabic, French, Spanish)
- [ ] Notification system for upcoming events
- [ ] Email reminders
- [ ] Custom event creation

### Version 2.2 (Q3 2026)
- [ ] User accounts and preferences
- [ ] Event bookmarking
- [ ] Social media integration
- [ ] RSS feed
- [ ] Mobile app (PWA)

### Version 3.0 (Q4 2026)
- [ ] AI-powered event recommendations
- [ ] Integration with organizational calendars
- [ ] Advanced analytics dashboard
- [ ] Custom reporting tools
- [ ] Multi-year support (2027, 2028+)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report Bugs**: Open an issue with bug details
2. **Suggest Features**: Share your ideas in issues
3. **Submit Pull Requests**: Fork, develop, and PR
4. **Improve Documentation**: Help us make docs better
5. **Share Events**: Contribute new event data

### Development Setup
```bash
# Clone repository
git clone https://github.com/your-org/hse-bcm-calendar.git

# Navigate to directory
cd hse-bcm-calendar

# Start local server
python -m http.server 8000

# Open in browser
# http://localhost:8000/hse-bcm-dashboard.html
```

---

## 📞 Support

### Documentation
- [User Guide](#usage-guide)
- [API Integration Guide](API_INTEGRATION_GUIDE.md)
- [FAQ](#faq)

### Contact
- **Email**: support@hse-bcm-calendar.com
- **GitHub Issues**: Report bugs and request features
- **Website**: https://hse-bcm-calendar.com

---

## ❓ FAQ

### Q: Do I need an internet connection?
**A**: The dashboard works offline with the built-in dataset. Internet is needed for API sync and external links.

### Q: How often is data updated?
**A**: Automatic sync occurs every 24 hours when enabled. Manual sync is always available.

### Q: Can I add my own events?
**A**: Currently, you can modify the events array in the code. User-created events coming in v2.1.

### Q: Is my data private?
**A**: Yes! All data is processed locally in your browser. No tracking or analytics.

### Q: Can I use this for commercial purposes?
**A**: Yes! This project is MIT licensed.

### Q: How do I report a bug?
**A**: Open an issue on GitHub with details about the bug and steps to reproduce.

### Q: Can I customize the colors?
**A**: Yes! Modify the CSS variables in the style section.

### Q: Does it work on mobile?
**A**: Absolutely! Fully responsive design optimized for all screen sizes.

---

## 🎉 Acknowledgments

Special thanks to:
- All international organizations providing event data
- Open source community
- Early testers and contributors
- You, for using this dashboard!

---

## 📈 Updates

### v2.0.0 (2026-01-01)
- ✨ Complete UI redesign
- 📊 Added Chart.js visualizations
- 🔄 API integration framework
- 📤 Export functionality (CSV, JSON, iCal)
- 💬 Modal dialogs
- 🔔 Notification system
- 📱 Enhanced mobile support
- ♿ Accessibility improvements
- 🎨 Modern animations

### v1.0.0 (2025-12-01)
- 🎉 Initial release
- 📅 Basic calendar functionality
- 🔍 Simple filtering
- 📋 Static event data

---

<div align="center">

**Made with ❤️ for HSE-BCM professionals worldwide**

⭐ Star this project | 🐛 Report Bug | 💡 Request Feature

</div>
