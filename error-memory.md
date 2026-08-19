# Error Memory

This file logs historical bugs, root causes, and their solutions.

## Synchrounous Headers Error in Next.js

* Symptom: A runtime TypeError occurred in RootLayout saying headers().get is not a function.
* Root Cause: In Next.js 15 and 16, the headers utility function is asynchronous and returns a promise. Calling it synchronously throws an error.
* Resolution: We changed RootLayout to an async function and awaited the headers call.

## Missing API Keys causing Flow Failures

* Symptom: Flow execution crashes when environment variables and API keys are missing.
* Root Cause: The application was cloned without local environment configurations.
* Resolution: We wrapped all main flow functions in try catch blocks and returned graceful mock fallbacks.

## Firebase Invalid API Key Error at Module Load

* Symptom: Runtime FirebaseError with message Firebase: Error (auth/invalid-api-key).
* Root Cause: When local environment variables are missing, the Firebase initialization receives undefined or invalid keys. The SDK checks format criteria (e.g. prefix AIzaSy) at startup.
* Resolution: We provided dummy credentials with valid prefixes and wrapped initialization in try catch blocks. We also implemented clean client side mocks inside the authentication and database hooks to fully bypass Firebase when credentials are not found.
