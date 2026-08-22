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

## Next.js Server Action Invalid Origin Error

* Symptom: Server action requests fail with a 500 status code and the error "Invalid Server Actions request."
* Root Cause: Next.js verifies the origin header against the host header for Server Actions CSRF protection. In forwarded dev environments like Codespaces, these do not match.
* Resolution: Configured `experimental.serverActions.allowedOrigins` in `next.config.ts` to allow forwarded host wildcards like `*.github.dev` and `*.app.github.dev`.

## Next.js Use Server Export Restriction

* Symptom: Compilation fails with "A 'use server' file can only export async functions, found object."
* Root Cause: Files with the `"use server"` directive at the top are treated as Server Action modules and are only allowed to export async functions.
* Resolution: Removed the `"use server"` directive from helper files like `youtube-search.ts` that export non-function object configurations (like LangChain tools).
