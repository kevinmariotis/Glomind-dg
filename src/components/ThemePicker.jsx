import React, { useEffect } from 'react';

function ThemePicker({ children, tipo, titulo }) {
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = localStorage.getItem('theme');

  useEffect(() => {
    if (currentTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else if (currentTheme === 'light') {
      document.body.classList.add('light-theme');
    }
  }, [currentTheme]);

  const handleThemeToggle = () => {
    if (prefersDarkScheme.matches) {
      document.body.classList.toggle('light-theme');
      const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
      localStorage.setItem('theme', theme);
    } else {
      document.body.classList.toggle('dark-theme');
      const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
    }
  };

  return (
    <div>
      <button className={`theme-picker-btn ${tipo}`} title={titulo} onClick={handleThemeToggle}>
        {children}
      </button>
    </div>
  );
}

export default ThemePicker;