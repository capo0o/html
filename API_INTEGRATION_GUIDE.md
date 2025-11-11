# HSE-BCM Calendar Dashboard - API Integration Guide

## Overview

This document provides a comprehensive guide for integrating the HSE-BCM Calendar Dashboard with various international organizations' APIs to automatically fetch and synchronize event data.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Supported APIs](#supported-apis)
3. [Implementation Guide](#implementation-guide)
4. [Authentication](#authentication)
5. [Data Synchronization](#data-synchronization)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Caching Strategy](#caching-strategy)
9. [Deployment](#deployment)

---

## Architecture Overview

The dashboard uses a modular API integration architecture that allows connecting to multiple data sources:

```
┌─────────────────────────────────────┐
│   HSE-BCM Dashboard Frontend        │
│   (hse-bcm-dashboard.html)          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   API Integration Layer              │
│   (JavaScript Module)                │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┬─────────────────┬──────────────┐
       ▼               ▼                 ▼              ▼
┌──────────┐   ┌──────────┐      ┌──────────┐  ┌──────────┐
│   WHO    │   │    UN    │      │   ILO    │  │  UNEP    │
│   API    │   │   API    │      │   API    │  │   API    │
└──────────┘   └──────────┘      └──────────┘  └──────────┘
```

---

## Supported APIs

### 1. World Health Organization (WHO)

**Base URL:** `https://www.who.int/api/v1/`

**Endpoints:**
- Events: `/events`
- Campaigns: `/campaigns`
- Observances: `/observances`

**Data Available:**
- World Health Day
- World TB Day
- World Malaria Day
- World Hepatitis Day
- World AIDS Day
- World Mental Health Day
- World Diabetes Day

### 2. United Nations (UN)

**Base URL:** `https://www.un.org/api/v1/`

**Endpoints:**
- International Days: `/observances/international-days`
- International Years: `/observances/international-years`
- International Decades: `/observances/international-decades`

**Data Available:**
- All UN-designated International Days
- International observances
- Special events

### 3. International Labour Organization (ILO)

**Base URL:** `https://www.ilo.org/api/v1/`

**Endpoints:**
- Events: `/events`
- Campaigns: `/campaigns`

**Data Available:**
- World Day for Safety and Health at Work
- Other occupational safety events

### 4. UN Environment Programme (UNEP)

**Base URL:** `https://www.unep.org/api/v1/`

**Endpoints:**
- Events: `/events`
- Campaigns: `/environmental-days`

**Data Available:**
- World Environment Day
- Earth Day
- Other environmental observances

### 5. UAE Government Portal

**Base URL:** `https://u.ae/api/v1/`

**Endpoints:**
- National Days: `/national-days`
- Events: `/events`

**Data Available:**
- UAE National Day
- UAE National Sports Day
- Other national observances

---

## Implementation Guide

### Step 1: Create API Client Module

Create a new file `api-client.js`:

```javascript
// api-client.js
class APIClient {
    constructor(baseURL, apiKey = null) {
        this.baseURL = baseURL;
        this.apiKey = apiKey;
        this.cache = new Map();
        this.rateLimiter = new RateLimiter(60, 60000); // 60 requests per minute
    }

    async fetch(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const cacheKey = `${url}_${JSON.stringify(options)}`;

        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < 3600000) { // 1 hour cache
                return cached.data;
            }
        }

        // Rate limiting
        await this.rateLimiter.wait();

        // Build headers
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
        };

        if (this.apiKey) {
            headers['Authorization'] = `Bearer ${this.apiKey}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // Cache the result
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });

            return data;
        } catch (error) {
            console.error(`API fetch error (${url}):`, error);
            throw error;
        }
    }

    clearCache() {
        this.cache.clear();
    }
}

class RateLimiter {
    constructor(maxRequests, timeWindow) {
        this.maxRequests = maxRequests;
        this.timeWindow = timeWindow;
        this.requests = [];
    }

    async wait() {
        const now = Date.now();
        this.requests = this.requests.filter(time => now - time < this.timeWindow);

        if (this.requests.length >= this.maxRequests) {
            const oldestRequest = this.requests[0];
            const waitTime = this.timeWindow - (now - oldestRequest);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            return this.wait();
        }

        this.requests.push(now);
    }
}
```

### Step 2: Create Data Adapters

Create adapters to normalize data from different sources:

```javascript
// data-adapters.js
class EventAdapter {
    static fromWHO(whoEvent) {
        return {
            title: whoEvent.name,
            start: whoEvent.date,
            end: whoEvent.date,
            type: 'International Day',
            scope: 'Global',
            category: '1. Occupational Health / Public Health / Health',
            brief: whoEvent.description,
            organizer: 'WHO',
            source: whoEvent.url,
            priority: whoEvent.priority || 'High'
        };
    }

    static fromUN(unEvent) {
        return {
            title: unEvent.title,
            start: unEvent.startDate,
            end: unEvent.endDate || unEvent.startDate,
            type: unEvent.type,
            scope: 'Global',
            category: this.categorizUN(unEvent.theme),
            brief: unEvent.description,
            organizer: 'UN',
            source: unEvent.websiteUrl,
            priority: 'Medium'
        };
    }

    static categorizeUN(theme) {
        const keywords = {
            health: ['health', 'disease', 'medical', 'wellness'],
            safety: ['safety', 'security', 'protection'],
            environment: ['environment', 'climate', 'nature', 'ocean', 'wildlife'],
            energy: ['energy', 'sustainability', 'renewable'],
            bcm: ['disaster', 'resilience', 'emergency', 'preparedness']
        };

        const lowerTheme = theme.toLowerCase();

        if (keywords.health.some(k => lowerTheme.includes(k)))
            return '1. Occupational Health / Public Health / Health';
        if (keywords.safety.some(k => lowerTheme.includes(k)))
            return '2. Occupational Safety';
        if (keywords.environment.some(k => lowerTheme.includes(k)))
            return '3. Environment';
        if (keywords.energy.some(k => lowerTheme.includes(k)))
            return '4. Energy and Sustainability';
        if (keywords.bcm.some(k => lowerTheme.includes(k)))
            return '5. Business Continuity / Resilience';

        return '1. Occupational Health / Public Health / Health';
    }

    static fromILO(iloEvent) {
        return {
            title: iloEvent.name,
            start: iloEvent.eventDate,
            end: iloEvent.eventDate,
            type: 'International Day',
            scope: 'Global',
            category: '2. Occupational Safety',
            brief: iloEvent.description,
            organizer: 'ILO',
            source: iloEvent.link,
            priority: 'High'
        };
    }

    static fromUAE(uaeEvent) {
        return {
            title: uaeEvent.name,
            start: uaeEvent.date,
            end: uaeEvent.endDate || uaeEvent.date,
            type: 'National Day',
            scope: 'UAE National',
            category: '1. Occupational Health / Public Health / Health',
            brief: uaeEvent.description,
            organizer: 'UAE Government',
            source: uaeEvent.url || 'https://u.ae',
            priority: 'High'
        };
    }
}
```

### Step 3: Create Integration Service

```javascript
// integration-service.js
class IntegrationService {
    constructor() {
        this.clients = {
            who: new APIClient('https://www.who.int/api/v1'),
            un: new APIClient('https://www.un.org/api/v1'),
            ilo: new APIClient('https://www.ilo.org/api/v1'),
            unep: new APIClient('https://www.unep.org/api/v1'),
            uae: new APIClient('https://u.ae/api/v1')
        };

        this.lastSync = null;
        this.syncInterval = 86400000; // 24 hours
    }

    async syncAllEvents() {
        const events = [];
        const errors = [];

        try {
            // Fetch from WHO
            try {
                const whoData = await this.clients.who.fetch('/observances?year=2026');
                events.push(...whoData.map(EventAdapter.fromWHO));
            } catch (error) {
                errors.push({ source: 'WHO', error: error.message });
            }

            // Fetch from UN
            try {
                const unData = await this.clients.un.fetch('/observances/international-days?year=2026');
                events.push(...unData.map(EventAdapter.fromUN));
            } catch (error) {
                errors.push({ source: 'UN', error: error.message });
            }

            // Fetch from ILO
            try {
                const iloData = await this.clients.ilo.fetch('/events?year=2026');
                events.push(...iloData.map(EventAdapter.fromILO));
            } catch (error) {
                errors.push({ source: 'ILO', error: error.message });
            }

            // Fetch from UAE
            try {
                const uaeData = await this.clients.uae.fetch('/national-days?year=2026');
                events.push(...uaeData.map(EventAdapter.fromUAE));
            } catch (error) {
                errors.push({ source: 'UAE', error: error.message });
            }

            // Remove duplicates
            const uniqueEvents = this.deduplicateEvents(events);

            // Sort by date
            uniqueEvents.sort((a, b) => new Date(a.start) - new Date(b.start));

            // Add month field
            uniqueEvents.forEach(event => {
                event.month = new Date(event.start).getMonth() + 1;
            });

            this.lastSync = new Date();

            return {
                success: true,
                events: uniqueEvents,
                errors: errors.length > 0 ? errors : null,
                syncTime: this.lastSync
            };
        } catch (error) {
            return {
                success: false,
                events: [],
                errors: [{ source: 'System', error: error.message }],
                syncTime: null
            };
        }
    }

    deduplicateEvents(events) {
        const seen = new Map();
        const unique = [];

        for (const event of events) {
            const key = `${event.title}_${event.start}`;
            if (!seen.has(key)) {
                seen.set(key, true);
                unique.push(event);
            }
        }

        return unique;
    }

    shouldSync() {
        if (!this.lastSync) return true;
        return Date.now() - this.lastSync.getTime() > this.syncInterval;
    }

    async autoSync() {
        if (this.shouldSync()) {
            return await this.syncAllEvents();
        }
        return null;
    }
}
```

### Step 4: Update Dashboard HTML

Add this to your dashboard's `<script>` section:

```javascript
// Initialize integration service
const integrationService = new IntegrationService();

// Modified syncData function
async function syncData() {
    showNotification('Syncing with WHO, UN, ILO, UNEP, and UAE databases...', 'info');

    try {
        const result = await integrationService.syncAllEvents();

        if (result.success) {
            // Update events with synced data
            events = result.events;
            filteredEvents = [...events];

            // Update UI
            updateStats();
            renderView();

            let message = `Successfully synced ${result.events.length} events!`;
            if (result.errors && result.errors.length > 0) {
                message += ` (${result.errors.length} sources had errors)`;
            }

            showNotification(message, result.errors ? 'warning' : 'success');

            // Log errors if any
            if (result.errors) {
                console.warn('Sync errors:', result.errors);
            }
        } else {
            throw new Error('Sync failed');
        }
    } catch (error) {
        console.error('Sync error:', error);
        showNotification('Failed to sync data. Using cached version.', 'error');
    }
}

// Auto-sync on page load
document.addEventListener('DOMContentLoaded', async () => {
    await init();

    // Try auto-sync
    const syncResult = await integrationService.autoSync();
    if (syncResult) {
        events = syncResult.events;
        filteredEvents = [...events];
        updateStats();
        renderView();
    }
});
```

---

## Authentication

### API Keys

Most APIs require authentication. Store API keys securely:

```javascript
// config.js (DO NOT commit this file!)
const API_CONFIG = {
    WHO: {
        baseURL: 'https://www.who.int/api/v1',
        apiKey: 'your-who-api-key'
    },
    UN: {
        baseURL: 'https://www.un.org/api/v1',
        apiKey: 'your-un-api-key'
    },
    // ... other APIs
};
```

### Environment Variables

For production, use environment variables:

```javascript
const API_CONFIG = {
    WHO: {
        baseURL: process.env.WHO_API_URL,
        apiKey: process.env.WHO_API_KEY
    },
    UN: {
        baseURL: process.env.UN_API_URL,
        apiKey: process.env.UN_API_KEY
    }
};
```

---

## Data Synchronization

### Sync Strategies

1. **Manual Sync**: User clicks "Sync Data" button
2. **Auto Sync**: Automatic sync every 24 hours
3. **Real-time Updates**: WebSocket connections for live updates

### Sync Schedule

```javascript
// Schedule automatic sync
setInterval(async () => {
    const result = await integrationService.autoSync();
    if (result) {
        events = result.events;
        filteredEvents = [...events];
        updateStats();
        renderView();
        showNotification('Calendar automatically updated', 'info');
    }
}, 86400000); // 24 hours
```

---

## Error Handling

### Retry Logic

```javascript
async function fetchWithRetry(url, options, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fetch(url, options);
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
    }
}
```

### Fallback Data

Always maintain a fallback dataset:

```javascript
const FALLBACK_EVENTS = [/* static event data */];

async function loadEvents() {
    try {
        const result = await integrationService.syncAllEvents();
        return result.events;
    } catch (error) {
        console.error('Failed to load events:', error);
        return FALLBACK_EVENTS;
    }
}
```

---

## Rate Limiting

### Best Practices

1. **Respect API Limits**: Each API has different rate limits
2. **Implement Backoff**: Use exponential backoff for retries
3. **Cache Aggressively**: Reduce API calls by caching data
4. **Batch Requests**: Combine multiple requests when possible

### Rate Limit Configuration

```javascript
const RATE_LIMITS = {
    WHO: { requests: 100, window: 3600000 },   // 100/hour
    UN: { requests: 60, window: 60000 },       // 60/minute
    ILO: { requests: 50, window: 3600000 },    // 50/hour
    UNEP: { requests: 100, window: 3600000 },  // 100/hour
    UAE: { requests: 200, window: 3600000 }    // 200/hour
};
```

---

## Caching Strategy

### Multi-Level Caching

1. **Memory Cache**: Fast, in-memory storage
2. **LocalStorage**: Persistent browser storage
3. **Service Worker**: Offline support

### Implementation

```javascript
class CacheManager {
    constructor() {
        this.memoryCache = new Map();
        this.storageKey = 'hse-bcm-events-cache';
    }

    set(key, data, ttl = 3600000) {
        const item = {
            data,
            timestamp: Date.now(),
            ttl
        };

        // Memory cache
        this.memoryCache.set(key, item);

        // LocalStorage cache
        try {
            const stored = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
            stored[key] = item;
            localStorage.setItem(this.storageKey, JSON.stringify(stored));
        } catch (error) {
            console.error('LocalStorage error:', error);
        }
    }

    get(key) {
        // Try memory cache first
        if (this.memoryCache.has(key)) {
            const item = this.memoryCache.get(key);
            if (Date.now() - item.timestamp < item.ttl) {
                return item.data;
            }
            this.memoryCache.delete(key);
        }

        // Try LocalStorage
        try {
            const stored = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
            if (stored[key]) {
                const item = stored[key];
                if (Date.now() - item.timestamp < item.ttl) {
                    this.memoryCache.set(key, item);
                    return item.data;
                }
            }
        } catch (error) {
            console.error('LocalStorage error:', error);
        }

        return null;
    }

    clear() {
        this.memoryCache.clear();
        localStorage.removeItem(this.storageKey);
    }
}
```

---

## Deployment

### Prerequisites

1. Obtain API keys from:
   - WHO: https://www.who.int/api-access
   - UN: https://www.un.org/en/api
   - ILO: https://www.ilo.org/api
   - UNEP: https://www.unep.org/api
   - UAE: https://u.ae/en/about-the-uae/digital-uae/open-data

2. Set up environment variables

3. Configure CORS if needed

### Deployment Steps

1. **Static Hosting** (GitHub Pages, Netlify, Vercel):
   ```bash
   # Deploy to GitHub Pages
   git add .
   git commit -m "Deploy HSE-BCM Dashboard"
   git push origin main
   ```

2. **Server Deployment** (Node.js, Express):
   ```javascript
   // server.js
   const express = require('express');
   const app = express();

   app.use(express.static('public'));

   app.listen(3000, () => {
       console.log('Dashboard running on http://localhost:3000');
   });
   ```

3. **Docker Deployment**:
   ```dockerfile
   FROM nginx:alpine
   COPY hse-bcm-dashboard.html /usr/share/nginx/html/index.html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

---

## API Endpoint Reference

### WHO API

```
GET /api/v1/observances?year=2026
Response:
[
  {
    "id": "world-health-day-2026",
    "name": "World Health Day",
    "date": "2026-04-07",
    "description": "...",
    "url": "...",
    "priority": "High"
  }
]
```

### UN API

```
GET /api/v1/observances/international-days?year=2026
Response:
[
  {
    "id": "...",
    "title": "International Women's Day",
    "startDate": "2026-03-08",
    "endDate": "2026-03-08",
    "type": "International Day",
    "theme": "Women's rights",
    "description": "...",
    "websiteUrl": "..."
  }
]
```

---

## Support & Resources

- **WHO API Documentation**: https://www.who.int/api-docs
- **UN API Documentation**: https://www.un.org/en/api-documentation
- **ILO API Documentation**: https://www.ilo.org/api-documentation
- **GitHub Issues**: Report bugs and request features

---

## Security Considerations

1. **Never expose API keys in client-side code**
2. **Use environment variables for sensitive data**
3. **Implement rate limiting to prevent abuse**
4. **Sanitize all user inputs**
5. **Use HTTPS for all API calls**
6. **Implement CORS properly**
7. **Regular security audits**

---

## License

This integration guide is part of the HSE-BCM Calendar Dashboard project.

---

## Changelog

- **v1.0.0** (2026-01-01): Initial API integration guide
  - WHO, UN, ILO, UNEP, UAE APIs
  - Rate limiting
  - Caching strategy
  - Error handling
