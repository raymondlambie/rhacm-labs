meBarista in Ionic2.

This is the codebase used to make the iOS meBarista App. It also builds for Android, but support is limited to Bluetooth Classic devices for now ( no BLE ). I think it is feasible to support BLE on Android by adding a BLE plugin.

On Android ( with Classic devices ) there is no auto-pairing : you need to pair your meCoffee through the system Bluetooth settings.

I hope to get it working on OSX and Windows to replace the Google Chrome App.

Build:

- Install NPM
- Install Ionic2 and Cordova
- Clone the repository
- npm install

- ionic platform add android
- ionic run android

- ionic platform add ios
- ionic run ios --device

- For Android, use Google Chrome "chrome://inspect" to connect to the app
- For iOS, use XCode to attach the debugger

Release iOS:
- bump version in config.xml
- copy of plist ( permissions )
- Open in XCode
- Enter developer keys
- Build, archive
- Go to https://appstoreconnect.apple.com/

To get provision profile
 - Get Apple Developer Account : https://developer.apple.com/account/
 - Go into "Certificates, Identifiers & Profiles"
 - Create keys and provision profiles

