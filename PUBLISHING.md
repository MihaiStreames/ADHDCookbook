# Publishing Guide for ADHD Cookbook

This document outlines the process for creating new releases and publishing the app to app stores.

## Release Process

### 1. Preparing for Release

1. Ensure all intended features are merged into `main`
2. Update version numbers in:
    - `package.json`
    - `app.json` (both `version` and `versionCode`/build number)
3. Update the CHANGELOG.md with new version details
4. Create a new release branch: `release/vX.Y.Z`

### 2. Testing the Release

1. Build the release candidate
   ```bash
   eas build -p android --release-channel prod-X.Y.Z
   eas build -p ios --release-channel prod-X.Y.Z
   ```
2. Perform testing on the release builds
3. Fix any critical issues on the release branch
4. Cherry-pick fixes back to `main` if necessary

### 3. Creating GitHub Release

1. Once testing is complete, merge the release branch to `main`
2. Tag the release commit
   ```bash
   git tag -a vX.Y.Z -m "Version X.Y.Z"
   git push origin vX.Y.Z
   ```
3. Create a new release on GitHub:
    - Use the tag you just created
    - Include release notes from CHANGELOG.md
    - Attach build artifacts if appropriate

## App Store Publishing

### Google Play Store

1. Generate a signed AAB
   ```bash
   eas build -p android --release-channel prod-X.Y.Z --app-bundle
   ```
2. Download the AAB from Expo
3. Upload to Google Play Console
4. Complete store listing and release forms
5. Submit for review

### Apple App Store

1. Generate a signed IPA
   ```bash
   eas build -p ios --release-channel prod-X.Y.Z
   ```
2. Download the IPA from Expo
3. Upload to App Store Connect using Transporter or Application Loader
4. Complete App Store information and submit for review

## Post-Release

1. Announce the new release to users
2. Monitor crash reports and feedback
3. Plan next development cycle

## Store Assets

Store assets should be maintained in the `store-assets` folder:

- Screenshots (various device sizes)
- Feature graphics
- App descriptions
- Promotional images

## Version Naming Convention

We use semantic versioning (MAJOR.MINOR.PATCH):

- MAJOR: Incompatible API changes
- MINOR: Added functionality in a backward-compatible manner
- PATCH: Backward-compatible bug fixes

## Release Channels

We use the following Expo release channels:

- `default`: Development builds
- `beta`: Beta testing builds
- `prod-X.Y.Z`: Production builds, where X.Y.Z is the version number

## Emergency Hotfixes

For critical issues in production:

1. Create a hotfix branch from the release tag: `hotfix/vX.Y.Z`
2. Fix the issue and test thoroughly
3. Update version to `X.Y.(Z+1)`
4. Follow the normal release process with the expedited timeline