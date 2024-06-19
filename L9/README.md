# Integrating Error Tracking System in React Project

1. Install Sentry SDK
   ```bash
   npm install --save @sentry/react
   ```
2. Initialize Sentry
   ```jsx
   import { Integrations } from '@sentry/tracing';
   import * as Sentry from '@sentry/react';

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN',
      integrations: [new Integrations.BrowserTracing()],
      tracesSampleRate: 1.0,
    });

   ```
3. Images
- ![image](https://github.com/konavivekramakrishna/WD401/assets/101407963/530fcae3-e1d4-488a-b851-cafe72dbf617)
- ![image](https://github.com/konavivekramakrishna/WD401/assets/101407963/f4953c85-4aa6-4c9c-9868-ebba89945641)

4. Upload Source Maps
- To ensure readable stack traces in Sentry, upload source maps either manually or automatically using Sentry Wizard:
- `npx @sentry/wizard@latest -i sourcemaps`

logs:
```bash
Need to install the following packages:
@sentry/wizard@3.21.0
Ok to proceed? (y) y
(node:4934) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
Running Sentry Wizard...
version: 3.21.0 | sentry-cli version: 1.77.3
Sentry Wizard will help you to configure your project
Thank you for using Sentry :)
Skipping connection to Sentry due files already patched

┌   Sentry Source Maps Upload Configuration Wizard 
│
◇   ──────────────────────────────────────────────────────────────────────────────────╮
│                                                                                     │
│  This wizard will help you upload source maps to Sentry as part of your build.      │
│  Thank you for using Sentry :)                                                      │
│                                                                                     │
│  (This setup wizard sends telemetry data and crash reports to Sentry.               │
│  You can turn this off by running the wizard with the '--disable-telemetry' flag.)  │
│                                                                                     │
│  Version: 3.21.0                                                                    │
│                                                                                     │
├─────────────────────────────────────────────────────────────────────────────────────╯
│
▲  You have uncommitted or untracked files in your repo:
│  
│  - dev-dist/sw.js
│  - index.html
│  - package-lock.json
│  - package.json
│  - src/App.tsx
│  - src/components/LiveMatches/LiveMatches.tsx
│  - src/components/SportArticles/SportArticleCard.tsx
│  - src/components/SportArticles/SportsArticleModal.tsx
│  - src/components/SportArticles/index.tsx
│  - src/main.tsx
│  - src/pages/Home.tsx
│  - src/i18n.ts
│  - src/locales/
│  
│  The wizard will create and update files.
│
◇  Do you want to continue anyway?
│  Yes
│
◇  Are you using Sentry SaaS or self-hosted Sentry?
│  Sentry SaaS (sentry.io)
│
◇  Do you already have a Sentry account?
│  Yes
│
●  If the browser window didn't open automatically, please open the following link to log into Sentry:
│  
│  https://sentry.io/account/settings/wizard/h1tjmh0j0f1geq27mqjsoh4v9h0trus3rwb6nmo0xtgij2e5yezkb0sd7k0s6qik/
│
◇  Login complete.
│
◇  Select your Sentry project.
│  iare-ca19832e9/sportify
│
◇  Which framework, bundler or build tool are you using?
│  Vite
│
◇  Installed @sentry/vite-plugin with NPM.
│
◆  Added the Sentry Vite plugin to vite.config.ts and enabled source maps
│
●  We recommend checking the modified file after the wizard finished to ensure it works with your build setup.
│
◆  Created .env.sentry-build-plugin with auth token for you to test source map uploading locally.
│
◆  Added .env.sentry-build-plugin to .gitignore.
│
◇  Are you using a CI/CD tool to build and deploy your application?
│  No
│
●  No Problem! Just make sure that the Sentry auth token from .env.sentry-build-plugin is available whenever you build and deploy your app.
│
└  That's it - everything is set up!

   Test and validate your setup locally with the following Steps:

   1. Build your application in production mode.
      → For example, run npm run build.
      → You should see source map upload logs in your console.
   2. Run your application and throw a test error.
      → The error should appear in Sentry:
      → https://iare-ca19832e9.sentry.io/issues/?project=4506915022045184
   3. Open the error in Sentry and verify that it's source-mapped.
      → The stack trace should show your original source code.
   
   If you encounter any issues, please refer to the Troubleshooting Guide:
   https://docs.sentry.io/platforms/javascript/sourcemaps/troubleshooting_js

   If the guide doesn't help or you encounter a bug, please let us know:
   https://github.com/getsentry/sentry-javascript/issues



🎉  Successfully set up Sentry for your project 🎉
vivek@Vivek:~/Work/sportify$
```

## Sample Error Function
- Test the Sentry integration by intentionally throwing an error in the application. For instance:
- ```jsx
  const erroFunc = () => {
    throw new Error("This is a test error");
  }
   <button onClick={()=>erroFunc()} >CLick this to throw Error</button>
  ```
- Clicking this button throws an error, which Sentry captures and reports.
The code onClick on the button throws error the same gets reflected in sentry a post request goes to sentry with information encrypted
- ![image](https://github.com/konavivekramakrishna/WD401/assets/101407963/96c93e01-4b87-4d27-9c01-fbca8091bf92)
- ![image](https://github.com/konavivekramakrishna/WD401/assets/101407963/db1533cf-fbe5-42d6-9e6b-578eaa09b87f)

## Debuggin Error using Sentry and debugger by javascript

We can find the Error related details in sentry portal
- ![image](https://github.com/konavivekramakrishna/WD401/assets/101407963/cef64aa1-16ab-4041-a601-b5e7a888f2e9)
- ![image](https://github.com/konavivekramakrishna/WD401/assets/101407963/0166ef09-26e2-4a77-a481-4075ba94957b)
- Sentry provides detailed error reports in its dashboard. Once an error is captured, navigate to the Sentry dashboard to view error details, including stack traces, error messages, user actions leading to the error, IP address, OS, browser, and more. This information aids in diagnosing and resolving issues efficiently.

### Debugger by JS

```html
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    hi

    <div id="data"></div>
    <script>
      let x = 10;
      let y = 20;

      let z = x + y;

      debugger;

      let amount = z * y;
      document.getElementById("data").innerHTML = amount;
    </script>
  </body>
</html>
```

The above code is used for understand debugger in JS
- In addition to Sentry, JavaScript's built-in debugger can be used for debugging. Insert the debugger statement in the code where execution should pause for inspection of variables. For example:
- ![image](https://github.com/konavivekramakrishna/WD401/assets/101407963/32028450-d21a-4752-99e7-e2ee4899add4)
- Debugger helps to debug the error by stoping the flow of execution of JS, and we can extract necessary Detials such as variables names call stack etc
-When encountering the debugger statement, the browser pauses execution, allowing inspection of variables, call stack, and other relevant information using browser developer tools.

## Conclusion
Combining Sentry's error tracking system with JavaScript's debugger facilitates effective identification, tracking, and debugging of issues in React applications, ensuring stability and reliability.



