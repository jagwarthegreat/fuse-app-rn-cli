const version = 'v.1.1.1';

const ENV = {
  dev: {
    env: 'development',
    appVersion: `${version} [Dev]`,
    apiUrl: {
      // For Android Emulator: Use 10.0.2.2 (maps to host's localhost)
      // For Physical Device: Use your machine's IP address (e.g., 192.168.x.x)
      // For iOS Simulator: Can use localhost
      app: 'https://controller.rechargefuse.com',
    },
  },
  devlocal: {
    env: 'local',
    appVersion: `${version} [Dev Local]`,
    apiUrl: {
      // Using nip.io - after adding ServerAlias to Apache virtual host
      // This should now serve your Laravel app
      app: 'https://controller.rechargefuse.com',
    },
  },
  devlocalDevice: {
    env: 'local-device',
    appVersion: `${version} [Dev Device]`,
    apiUrl: {
      // For physical devices or iOS simulator
      // Replace with your machine's actual IP address on your local network
      // Find it by running: ipconfig (Windows) or ifconfig (Mac/Linux)
      app: 'https://controller.rechargefuse.com',  // Replace with your actual IP
    },
  },
  prod: {
    env: 'production',
    appVersion: version,
    apiUrl: {
      app: 'https://controller.rechargefuse.com',
    },
  },
}

// Change this to switch between environments
// Options: ENV.dev, ENV.devlocal, ENV.devlocalDevice, ENV.prod
export const getEnvVars = () => {
  return ENV.devlocal;  // For Android Emulator
  // return ENV.devlocalDevice;  // For Physical Device or iOS Simulator
}