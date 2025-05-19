# mobile

This is the mobile application for the TadiranApp system, developed using React Native and Expo. The app provides a seamless experience for users to interact with the Tadiran system on their mobile devices.

## Installation

Install the application dependencies by running:

```sh
cd TadiranApp/mobile
npm install
```

Set up environment variables: 

```sh
EXPO_PUBLIC_API_URL="https://tadiran-backend.onrender.com/api"
```

## Development

Start the application in development mode by running:

```sh
npx expo start
```
Then you will see link for web and barcode for mobile app

## Production

Build the application in production mode by running:

```sh
expo build:android
expo build:ios
```

Follow the prompts to configure the build.
Once the build is complete, download the APK (for Android) or the IPA (for iOS) file.