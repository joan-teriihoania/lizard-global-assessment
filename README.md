# Lizard Global React Developer Assessment

## Overview

The purpose of this assessment is to demonstrate:

1. An understanding of React syntax
2. Working with an API
3. Storing and manipulating React state
4. Structuring an application with multiple components
5. HTML and CSS ability
6. Responsive web development ability

### Prerequisites

In order to run the provided solution the following software will need to be installed:

- NodeJS (LTS) [here.](https://nodejs.org/en/)
- A code editor (We recommend VS Code [here.](https://code.visualstudio.com/))

### Setup

1. Fork and clone the repository
2. Open the repository folder and install the dependencies using `yarn` or `npm install`.
3. Run the development server using `yarn start` or `npm start`.

The repository contains a `App.jsx` file inside the `components` folder; this should be the starting point for your exercise. Please feel free to create more components to structure your app in a logical manner.

The repository also contains an API endpoint mocked using MirageJS. This can be accessed when running the development server at the URL `/api/posts`.

We would love to see code comments to help explain your approach and thought process, this will also be discussed in a follow-up technical interview.

Finally, the use of third party libraries and/or components is permitted - and in some cases encouraged. However, please ensure that you are still demonstrating the skills we have outlined above.

### Requirements

These are the minimum requirements for the exercies:

- [x] Retrieve the data from the mock API.
- [x] Output the data in a list, including properties from the data that are appropriate for a list view.
- [x] Implement a category filter - this can be single or multi-select.
- [x] Implement pagination - this can be traditional numbered pages or "load more".
- [x] Use semantic markup where possible.
- [x] Create a responsive layout with HTML and CSS.

### Additional Exercises

If you have time then demonstrating any of the following would be considered as a bonus:

- [ ] Use client-side routing to create a "detail" page.
- [x] Persist filter state in the query string.
- [ ] Include animated transitions between application state, e.g. when filtering.
- [x] Convert the application to use TypeScript instead of JavaScript.
- [ ] Use a CSS preprocessor or CSS-in-JS rather than plain CSS.

## Submission

Please submit your completed exercise either by supplying the URL of your forked repository - please ensure you **do not** include the `node_modules` folder.
