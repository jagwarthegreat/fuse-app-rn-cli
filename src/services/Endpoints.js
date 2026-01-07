export default {
    LOGIN: '/api/v1/login',  // Changed to API route
    SIGNUP: '/api/v1/signup',
    USER_DATA: '/api/v1/client/info?member_account=',
    UPDATE_DEVICE_SETTINGS: '/api/v1/client/device-settings/update',
    CHECKOUT: '/api/v1/payments/checkout',
    PROFILE_UPDATE: '/api/v1/updatenewmember/',
    PROFILE_DEACTIVATE: '/api/v1/client/', // append {id}/deactivate
    ALL_LOCATIONS: '/api/v1/client/location/all',
    CHARGERS_IN_LOCATION: '/api/v1/client/charger-list/', // append {location_id}
    CHARGE_SESSIONS: '/api/v1/client/transactions?id=', // append {member_account}
    CSRF_COOKIE: '/sanctum/csrf-cookie',
  }