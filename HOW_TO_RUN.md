# How to Run English Grammar Master

## ⚠️ Important: Don't Open HTML File Directly!

Opening `index.html` directly from your file system (`file://` protocol) will cause errors:
- ❌ CORS errors (can't load manifest.json)
- ❌ Service Worker won't work
- ❌ PWA features disabled
- ❌ localStorage issues

## ✅ Correct Ways to Run

### Option 1: Using Node.js serve (Recommended)

```bash
# Install serve globally (one-time)
npm install -g serve

# Navigate to project directory
cd /home/qnking/Desktop/Jang_pagloo/English

# Start server
serve .

# App will be available at:
# http://localhost:3000
```

### Option 2: Using Python (Already installed on Kali)

```bash
# Navigate to project directory
cd /home/qnking/Desktop/Jang_pagloo/English

# Python 3
python3 -m http.server 8000

# App will be available at:
# http://localhost:8000
```

### Option 3: Using PHP

```bash
# Navigate to project directory
cd /home/qnking/Desktop/Jang_pagloo/English

# Start PHP server
php -S localhost:8080

# App will be available at:
# http://localhost:8080
```

### Option 4: Using Vite (Development Mode)

```bash
# Install dependencies (if not done)
npm install

# Start dev server with hot reload
npm run dev

# App will open automatically at:
# http://localhost:3000
```

### Option 5: Using VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. App opens at `http://127.0.0.1:5500`

---

## 🚀 After Starting Server

1. Open browser and go to the URL shown (e.g., `http://localhost:3000`)
2. You should see NO console errors
3. Service Worker will register successfully
4. PWA features will work
5. You can install the app!

---

## 📱 Testing PWA Features

### Install as App
1. Look for install icon in address bar (Chrome/Edge)
2. Click "Install English Grammar Master"
3. App will open in standalone window

### Test Offline Mode
1. Open DevTools (F12)
2. Go to Network tab
3. Check "Offline" checkbox
4. Refresh page
5. App should still work!

### Check Service Worker
1. Open DevTools (F12)
2. Go to Application tab
3. Click "Service Workers"
4. Should show "Activated and is running"

---

## 🔧 Troubleshooting

### Still Getting Errors?

**Clear Browser Cache:**
```bash
# In Chrome DevTools:
1. Application tab
2. Storage section
3. Click "Clear site data"
4. Refresh page
```

**Unregister Old Service Workers:**
```javascript
// In browser console:
navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(reg => reg.unregister());
});
// Then refresh page
```

**Check Server is Running:**
```bash
# You should see something like:
# Accepting connections at http://localhost:3000

# If not, restart the server
```

---

## 🎯 Quick Start Commands

Copy-paste one of these based on what you have installed:

```bash
# If you have Node.js:
npx serve .

# If you have Python 3:
cd /home/qnking/Desktop/Jang_pagloo/English && python3 -m http.server 8000

# If you have npm dependencies installed:
cd /home/qnking/Desktop/Jang_pagloo/English && npm run dev
```

Then open: **http://localhost:3000** (or the port shown)

---

## ✅ Success Checklist

After starting the server, verify:
- [ ] No CORS errors in console
- [ ] No "file://" protocol warnings
- [ ] Service Worker registered (check console)
- [ ] Manifest.json loaded successfully
- [ ] App displays correctly
- [ ] All features work

---

## 💡 Pro Tips

1. **Bookmark the localhost URL** for quick access
2. **Use Chrome/Edge** for best PWA support
3. **Test on mobile**: Use your computer's IP address
   ```bash
   # Find your IP:
   ip addr show | grep inet
   
   # On mobile browser:
   http://YOUR_IP:3000
   ```
4. **Keep server running** in background while developing
5. **Use `npm run dev`** for auto-reload during development

---

## 🐛 Common Issues Fixed

### Issue: "Failed to get 'lang': Unexpected token 'r'"
**Fixed!** Storage module now handles both JSON and plain text.

### Issue: "CORS policy blocked"
**Solution:** Use a local server (see above).

### Issue: "ServiceWorker registration failed"
**Solution:** Must use HTTP/HTTPS protocol, not file://.

---

**Need Help?** Check the console for specific error messages and refer to this guide.
