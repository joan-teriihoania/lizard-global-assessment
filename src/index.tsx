import React from 'react';
import ReactDOM from 'react-dom';

/**
 * This file can be ignored, please work in ./components/App.jsx
 */

// Include mock API.
import './mock';

// Include styles.
import './styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Include application component.
import App from './components/App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
