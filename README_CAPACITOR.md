# Capacitor Mobile App Setup

Your Next.js app is now configured to work as a mobile app using Capacitor!

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Build Your App

```bash
npm run build
```

### 3. Initialize Capacitor (First Time)

```bash
npx cap init
```

When prompted:
- **App name**: `Biharinath Organic Farms`
- **App ID**: `com.biharinath.organicfarms`
- **Web dir**: `out`

### 4. Add Platforms

**For iOS:**
```bash
npm run cap:add:ios
```

**For Android:**
```bash
npm run cap:add:android
```

### 5. Sync and Open

**iOS:**
```bash
npm run cap:build:ios
```

**Android:**
```bash
npm run cap:build:android
```

## Platform Detection

The app automatically detects the platform and applies different styles:

- **Web** - Standard browser
- **PWA** - Progressive Web App (installed)
- **iOS** - Native iOS app
- **Android** - Native Android app

### Using Platform Detection in Components

```tsx
import { usePlatform } from '@/lib/platform';

function MyComponent() {
  const { platform, isNative, isPWA, isWeb } = usePlatform();

  if (isNative) {
    // Native app specific code
  }

  return (
    <div className={isNative ? 'native-style' : 'web-style'}>
      {/* Your content */}
    </div>
  );
}
```

## Platform-Specific Styling

CSS classes are automatically added to the `<body>` tag:

- `.platform-web` - Web browser
- `.platform-pwa` - PWA installed
- `.platform-ios` - iOS native
- `.platform-android` - Android native
- `.is-native` - Any native app
- `.is-pwa` - PWA mode

You can customize styles in `app/globals.css`:

```css
.platform-ios .navbar {
  /* iOS specific navbar styles */
}

.platform-android .navbar {
  /* Android specific navbar styles */
}

.platform-pwa .navbar {
  /* PWA specific navbar styles */
}
```

## Building for App Stores

### iOS App Store

1. Open Xcode: `npm run cap:open:ios`
2. Configure signing in Xcode
3. Product > Archive
4. Upload to App Store Connect

### Google Play Store

1. Open Android Studio: `npm run cap:open:android`
2. Build > Generate Signed Bundle / APK
3. Follow the wizard
4. Upload to Google Play Console

## PWA Installation

Users can install your app as a PWA:
- On mobile browsers, they'll see an "Add to Home Screen" prompt
- The app will work offline (with service worker)
- Custom splash screen and theme colors

## Development Setup

### Running with Local Server

**Important**: Since your app uses API routes, you need to run a Next.js server.

1. **Start your Next.js dev server:**
   ```bash
   npm run dev
   ```

2. **For Android Emulator:**
   - The config uses `http://10.0.2.2:3000` (Android emulator's special IP for host machine)
   - Make sure your dev server is running on port 3000
   - Sync and run: `npm run cap:sync && npm run cap:open:android`

3. **For iOS Simulator:**
   - Update `capacitor.config.json` to use `http://localhost:3000` (iOS simulator can access localhost)
   - Or use your local network IP: `http://192.168.x.x:3000`
   - Sync and run: `npm run cap:sync && npm run cap:open:ios`

4. **For Physical Devices:**
   - Find your computer's local IP address (e.g., `192.168.1.100`)
   - Update `capacitor.config.json` server URL to: `http://192.168.1.100:3000`
   - Make sure your phone and computer are on the same WiFi network
   - Make sure Windows Firewall allows connections on port 3000

### Production Setup

For production builds, update `capacitor.config.json`:

```json
{
  "server": {
    "url": "https://your-deployed-app.vercel.app",
    "androidScheme": "https",
    "iosScheme": "https"
  }
}
```

Then sync and build:
```bash
npm run cap:sync
npm run cap:open:android  # or cap:open:ios
```

## Troubleshooting

**Android Emulator: "ERR_CONNECTION_REFUSED" or "Webpage not available":**
- ✅ Make sure `npm run dev` is running on your computer
- ✅ The config should use `http://10.0.2.2:3000` (not `localhost`)
- ✅ Run `npm run cap:sync` after changing the config
- ✅ Restart the app in the emulator

**iOS Simulator: Connection issues:**
- Use `http://localhost:3000` or your local network IP
- Make sure the dev server is running

**Physical Device: Can't connect:**
- Find your computer's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- Update config with your IP: `http://192.168.x.x:3000`
- Ensure phone and computer are on the same WiFi
- Check Windows Firewall settings

**Build fails:**
- Make sure you run `npm run build` before `cap sync` (for production)
- For development, you don't need to build - just run `npm run dev`

**Platform not detected:**
- Platform detection runs client-side
- Check browser console for errors
- Ensure `PlatformWrapper` is in your layout

**Styles not applying:**
- Check that platform classes are added to `<body>`
- Verify CSS in `app/globals.css`
- Use browser dev tools to inspect classes

