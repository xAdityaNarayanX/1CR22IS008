🔗 URL Shortener App

A simple React-based URL Shortener with local storage persistence and built-in click tracking & statistics.

✨ Features

Shorten long URLs into unique short codes.

Store shortened URLs in Local Storage (no backend needed).

Set expiration time for shortened links.

Track:

Total number of clicks.

Click details (timestamp, browser/user agent).

Automatic redirect when visiting a short URL.

Simple and clean UI built with React.

🛠️ Tech Stack

React.js (Frontend framework)

React Router DOM (Routing)

Local Storage (Persistence)

Custom Logging Middleware (for structured logs)

📂 Project Structure
src/
 ├── components/
 │   ├── URLShortener.js   # Main form for shortening URLs
 │   ├── Redirect.js       # Handles redirection from short links
 │   ├── Statistics.js     # Shows usage stats for shortened URLs
 │
 ├── services/
 │   └── StorageService.js # Handles localStorage CRUD operations
 │
 ├── utils/
 │   └── LoggingMiddleware.js # Centralized logging system
 │
 ├── App.js                # Main app routing
 └── index.js              # React entry point

📍 URL Shortener Form
 <img width="1897" height="540" alt="Screenshot 2025-08-26 000433" src="https://github.com/user-attachments/assets/4e5963fa-8068-41e5-9ff8-c965208ecd0a" />
📍 Statistics Page
<img width="1444" height="840" alt="Screenshot 2025-08-26 001044" src="https://github.com/user-attachments/assets/0fc3e855-da5d-42d5-b2ea-cbc69a3b6e7a" />

🚀 Getting Started
1. Clone the repository
git clone https://github.com/xAdityaNarayanX/1CR22IS008.git
cd 1CR22IS008

2. Install dependencies
npm install

3. Run the development server
npm start

4. Build for production
npm run build

📊 Usage

Go to the URL Shortener page → Enter a long URL → Get a short code.

Use the short code in your browser → It will redirect to the original URL.

Visit the Statistics page → View all shortened URLs, click counts, and expiration dates.

Inspect detailed data in Local Storage under the key:

shortenedUrls

