import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import gsap from 'gsap';
import Physics2DPlugin from 'gsap/Physics2DPlugin';

if (typeof window !== 'undefined') {
  try {gsap.registerPlugin(Physics2DPlugin);} catch{}
}
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
