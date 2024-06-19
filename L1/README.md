## Problem Statement:

You've been assigned to a project that involves enhancing a critical feature for a web application. The team places a strong emphasis on the pull-request workflow, with a focus on code reviews, merge conflict resolution, and the recent integration of CI/CD. As you navigate through the development task, you encounter challenges such as feedback during code reviews and discussions on effective merge conflict resolution. The team looks to you to demonstrate your understanding of these challenges and your ability to adapt to the added complexity of CI/CD integration.

## Handling Code Review Feedback:

```javascript
const handlesubmit = async (event: React.FormEvent<HTMLFormElement>) => {
event.preventDefault();

try {

    const response = await fetch(`${API_ENDPOINT}/organisations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data,
      // Assign the payload to a variable
    });

    if (!response.ok) {
      throw new Error(`Sign-up failed with status`);
    }
    console.log('Sign-up successful');

    const data = await response.json();
    //Use then clause
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('userData', =JSON.stringify(data.user));
    navigate("/dashboard");

} catch (error) {
console.error('Sign-up failed:');
}
};
```


```javascript
// use camelCase syntax for better readability.
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  // make code more readable and understandable
  const data = JSON.stringify({
    name: organisationName,
    user_name: userName,
    email: userEmail,
    password: userPassword,
  });

  try {
    const response = await fetch(`${API_ENDPOINT}/organisations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
      // Assign the payload to a variable
    });

    if (!response.ok) {
      // show status code with the error
      throw new Error(
        `Sign-up failed with status ${response.status} and error ${response.error}`
      );
    }

    // remove console.log after testing in production it is not necessary

    const data = await response.json();
  
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("userData", JSON.stringify(data.user));
    navigate("/dashboard");
  } catch (error) {
    //show the error
    console.error("Sign-up failed:", error);
  }
};
```

## Iterative Development Process Flowchart:

1.Create a minimum viable feature with basic implementation, focusing initially on functionality rather than optimization, refinement, or styling.

2.Create a draft pull request (PR) and share the thought process with code reviewers.

3.Work on implementing the suggested changes and reviews.

4.Push the changes and, based on their feedback, continue working on further changes.

5.Improve code standards, including possible enhancements and optimizations.

6.Finally, convert the draft PR to one that is ready for review.

![image](https://github.com/konavivekramakrishna/WD401/assets/101407963/3af7b2f9-d90e-4a5a-8924-8324f7b46c4f)

## Resolving Merge Conflicts

When working with Git, conflicts may arise when merging changes from different branches. This guide outlines the process of resolving merge conflicts manually.



 
## Scenario

Consider two developers, A and B, working on separate branches (Branch A and Branch B) with changes to the `handleSubmit` function.

### Developer A's changes (Branch A):

```javascript
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  try {
    const response = await fetch(`${API_ENDPOINT}/organizations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: organizationName, user_name: userName, email: userEmail, password: userPassword }),
    });

    // ... (additional code)

  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```


### Developer B's changes (Branch B):

```javascript
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  try {
    const response = await fetch(`${API_ENDPOINT}/organizations/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organization_name: organizationName, username: userName, email: userEmail, password: userPassword }),
    });

    // ... (additional code)

  } catch (error) {
    console.error('Signup failed:', error);
  }
};

```



## Steps to Resolve Merge Conflicts

1. **Initiate the merge:**

    ```bash
    git checkout main
    git pull origin main
    git merge BranchA
    ```

2. **Conflict Resolution:**

    Git will notify you of conflicts. Open the file with conflicts (e.g., `handleSubmit.js`). You'll see conflict markers like `<<<<<<<`, `=======`, and `>>>>>>>`. Manually resolve the conflicts.

    ```javascript
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        <<<<<<< HEAD
        const response = await fetch(`${API_ENDPOINT}/organizations`, {
        ======= 
        const response = await fetch(`${API_ENDPOINT}/organizations/signup`, {
        >>>>>>> BranchA

        // Resolve additional conflicts if present
      } catch (error) {
        console.error('Resolved message:', error);
      }
    };
    ```

3. **Mark changes as resolved:**

    ```bash
    git add path/to/handleSubmit.js
    git merge --continue
    ```

4. **Complete the merge commit (if necessary):**

    If there are additional conflicts, Git will prompt you to complete the merge commit manually. Open the file, resolve conflicts, and then:

    ```bash
    git add path/to/handleSubmit.js
    git commit
    ```

5. **Push the changes:**

    After resolving conflicts, push the changes to the main branch.

    ```bash
    git push origin main
    ```

Now, the conflicting changes from Branch A are successfully merged into the main branch, and the `handleSubmit` function is resolved.

## CI/CD Integration:

> Using node packages like prettier, eslint, jest, and husky to formate the code and these ensure the code quality standards.
> These tests run after committing the changes to the files.

### This is basic CI/CD integration with test suites:

- Here, I have taken creating a new sport and new session from my previous project.

```javascript
// Test suite for creating a new sport
test("creating a new sport", async () => {
  const agent = request.agent(server);
  // ... (your test logic here)
});

// Test suite for creating a new session
test("creating a new session", async () => {
  const agent = request.agent(server);
  // ... (your test logic here)
});
```

> If these test suites fail then merging and pushing for the pull-request is denied this ensures the code quality checks and expected working.

## Using Github Actions for Tests and Quality checks and also to deploy:

CI/CD Integration
For Continuous Integration and Continuous Development:

1. I use GitHub Actions for automatic testing when a PR is made.

2. I integrate preview deployments for each PR.

3. I use testing frameworks such as Cypress.

4. I integrate tools like CodeClimate and CircleCI to help identify code smells and avoid repetition in the code by following the DRY (Don't Repeat Yourself) principle.


