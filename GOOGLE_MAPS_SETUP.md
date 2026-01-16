# Google Maps API Setup Checklist

## Your App Details
- **Package Name:** `com.test`
- **Debug SHA-1 Fingerprint:** `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
- **API Key:** `AIzaSyARBujlq3JoHWrZxyAVq_uXfv8Y7o3bh5A`

## Steps to Fix Map Loading Issue

### 1. Verify API Key Restrictions in Google Cloud Console

Go to: [Google Cloud Console - APIs & Services - Credentials](https://console.cloud.google.com/apis/credentials)

1. Click on your API key (`AIzaSyARBujlq3JoHWrZxyAVq_uXfv8Y7o3bh5A`)
2. Under **Application restrictions**, you have two options:

#### Option A: No restrictions (for testing)
- Select **None** (not recommended for production)
- Click **Save**

#### Option B: Android app restrictions (recommended)
- Select **Android apps**
- Click **Add an item**
- Enter:
  - **Package name:** `com.test`
  - **SHA-1 certificate fingerprint:** `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
- Click **Save**

### 2. Verify API is Enabled

Go to: [Google Cloud Console - APIs & Services - Library](https://console.cloud.google.com/apis/library)

Ensure these APIs are **ENABLED**:
- ✅ **Maps SDK for Android** (most important)
- ✅ Maps SDK for iOS (if needed)
- ✅ Maps JavaScript API (if needed)

### 3. Check API Quotas

- Go to: [Google Cloud Console - APIs & Services - Dashboard](https://console.cloud.google.com/apis/dashboard)
- Check if you've exceeded any quotas
- Ensure billing is enabled (required for Maps SDK)

### 4. Rebuild the App

After making changes in Google Cloud Console:
```bash
cd test
npm run android
```

Or clean and rebuild: s
```bash
cd test/android
./gradlew clean
cd ../..
npm run android
```

### 5. Check Emulator/Device

- **Emulator:** Ensure it has Google Play Services installed
  - Create a new emulator with **Google Play** system image (not just Google APIs)
  - Or install Google Play Services manually on existing emulator
- **Physical Device:** Should work if Google Play Services is up to date

**To verify Google Play Services on emulator:**
1. Open Play Store app on emulator
2. If it opens, Google Play Services is installed
3. If it doesn't open or shows error, you need a different emulator image

### 6. Verify AndroidManifest.xml

The API key should be in: `test/android/app/src/main/AndroidManifest.xml`

```xml
<meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="AIzaSyARBujlq3JoHWrZxyAVq_uXfv8Y7o3bh5A"/>
```

## Common Issues

1. **API key restrictions don't match** - Most common issue
   - Package name must be exactly `com.test`
   - SHA-1 must match exactly (including colons)
   - **Quick fix:** Temporarily set restrictions to "None" to test, then add restrictions back

2. **Maps SDK not enabled** - Check API Library
   - Go to [APIs & Services > Library](https://console.cloud.google.com/apis/library)
   - Search for "Maps SDK for Android"
   - Click "Enable" if not already enabled

3. **Billing not enabled** - Maps SDK requires billing
   - Go to [Billing](https://console.cloud.google.com/billing)
   - Enable billing for your project (free tier available)

4. **Wrong API key** - Verify the key in AndroidManifest matches Cloud Console
   - Check `test/android/app/src/main/AndroidManifest.xml`
   - Key should be: `AIzaSyARBujlq3JoHWrZxyAVq_uXfv8Y7o3bh5A`

5. **App not rebuilt** - Must rebuild after changing API key restrictions
   ```bash
   cd test/android
   ./gradlew clean
   cd ../..
   npm run android
   ```

6. **Google Play Services missing** - Emulator doesn't have Google Play Services
   - Use an emulator with "Google Play" system image (not just "Google APIs")
   - Or test on a physical device with Google Play Services

7. **Map shows "ready" but no tiles** - Usually API key or Google Play Services issue
   - Check console for error messages
   - Verify API key restrictions allow the app
   - Ensure Google Play Services is installed on emulator

## Testing

After setup, check the console logs for:
- `✅ Map is ready` - Map loaded successfully
- `❌ Map error:` - Check error message for details
- `📍 MapScreen mounted` - Component loaded

## Getting SHA-1 for Release Build

For production, you'll need the SHA-1 from your release keystore:
```bash
keytool -list -v -keystore your-release-key.keystore -alias your-key-alias
```

