/**
 * Privacy Policy content
 * Version: 1.0
 * Date: May 13, 2025
 */

export const PRIVACY_POLICY_VERSION = "1.0";

export const PRIVACY_POLICY = `
## Privacy Policy

**Effective Date:** May 13 2025

We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and store your personal data when you use our App.

### 1. Data Collection

We collect the following data:

- **Spotify User ID** (via Spotify login)
- **API Access Token** and **Refresh Token** (both stored securely in encrypted form)
- **Track and Playlist Data** created within the App
- **Session Cookies** to maintain your login session
    

### 2. How We Collect Data

We collect data through:

- The **Spotify authentication process**
    
- Cookies and local storage used by your browser to maintain session state
    
- Forms or inputs you provide in the App
    

### 3. How We Use Your Data

We use your data to:

- Authenticate you with Spotify
    
- Enable collaboration with other users
- Create and save playlists to your Spotify account
    
- Maintain your session while using the App
    

### 4. Data Sharing

We do **not sell or share** your personal data with third parties, except:

- With Spotify, as part of authentication and playlist creation
    
- As required by law or to protect our legal rights

### 5. Data Security
  We implement security measures to protect your data:

  - Spotify access and refresh tokens are encrypted at rest in our database
  - We use secure HTTPS connections for all data transfers
  - We implement CSRF protection to prevent cross-site request forgery
  - Session data is stored securely and expires after 24 hours

### 6. Cookies and Local Storage

We use:
  - **Session cookies** to maintain your login state
  - **CSRF cookies** to protect against cross-site request forgery
  - **Local storage** for temporary data caching to improve performance
    

We do **not allow third parties** to place cookies or collect data about your browsing activity through the App.
    

We do **not allow third parties to place cookies** to track browsing behaviour across other websites.

### 7. Cookie Management

You can manage cookies and local storage settings through your browser preferences. Disabling these may affect the functionality of the App.

### 8. Data Retention and Deletion
  We retain your data only as long as your account is active or as needed to provide services. You can:

  - Delete your account at any time through the app settings, this deletes all your data from our servers
  - Revoke our app's access to your Spotify account through your Spotify account settings

### 9. Your Rights
  You have the right to:

  - Access the personal data we hold about you
  - Correct inaccurate personal data
  - Request deletion of your personal data
  - Object to or restrict our processing of your data
  - Data portability (receive your data in a structured format)

### 9. Contact Us

For any privacy-related questions or data deletion requests, contact us at:  
songday.contact@gmail.com
`;

export default {
  version: PRIVACY_POLICY_VERSION,
  content: PRIVACY_POLICY
};