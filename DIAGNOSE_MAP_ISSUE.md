# Quick Map Issue Diagnosis

## Check Android Logcat for Detailed Errors

Run this command to see detailed map errors:

```bash
cd test
adb logcat | grep -i "maps\|google\|api.*key"
```

Or for more detailed output:
```bash
adb logcat *:E | grep -i "maps\|google"
```

## Most Common Issues (in order of likelihood)

### 1. API Key Restrictions (90% of cases)

**Symptom:** Map says "ready" but no tiles load

**Fix:**
1. Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
2. Click your API key: `AIzaSyARBujlq3JoHWrZxyAVq_uXfv8Y7o3bh5A`
3. Under "Application restrictions", temporarily select **"None"**
4. Click **Save**
5. Wait 2-3 minutes for changes to propagate
6. Rebuild app: `cd test && npm run android`

**If this fixes it:** The issue is API key restrictions. Add proper restrictions back:
- Package name: `com.test`
- SHA-1: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`

### 2. Maps SDK Not Enabled

**Check:**
1. Go to [Google Cloud Console - API Library](https://console.cloud.google.com/apis/library)
2. Search for "Maps SDK for Android"
3. If it says "Enable", click it
4. Wait 2-3 minutes
5. Rebuild app

### 3. Google Play Services Missing

**Check on emulator:**
1. Open Play Store app
2. If it doesn't open or shows error → emulator doesn't have Google Play Services
3. **Fix:** Create new emulator with "Google Play" system image (not "Google APIs")

**Or test on physical device** - it should work if Google Play Services is installed

### 4. Billing Not Enabled

**Check:**
1. Go to [Google Cloud Console - Billing](https://console.cloud.google.com/billing)
2. Ensure billing is enabled (free tier is fine)
3. Maps SDK requires billing to be enabled

## Quick Test Commands

### Verify API Key in App
```bash
cd test/android/app/src/main
grep -r "API_KEY" AndroidManifest.xml
```

Should show: `android:value="AIzaSyARBujlq3JoHWrZxyAVq_uXfv8Y7o3bh5A"`

### Check Google Play Services on Emulator
```bash
adb shell pm list packages | grep -i "google"
```

Should show multiple Google packages including `com.google.android.gms`

### Clean Rebuild
```bash
cd test/android
./gradlew clean
cd ../..
npm run android
```

## What to Look For in Logcat

If you see errors like:
- `API key not valid` → Wrong API key or restrictions
- `Google Play Services not available` → Emulator issue
- `Maps SDK not enabled` → Enable in Google Cloud Console
- `Billing not enabled` → Enable billing

## Still Not Working?

1. **Try a physical device** - eliminates emulator issues
2. **Check API key in Google Cloud Console** - verify it's active and not deleted
3. **Create a new API key** - sometimes keys get corrupted
4. **Check network** - ensure emulator/device has internet connection

