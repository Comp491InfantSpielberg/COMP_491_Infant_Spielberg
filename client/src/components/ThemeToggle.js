import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import IconButton from '@mui/material/IconButton';
import { FaMoon } from 'react-icons/fa';  // Moon icon from Font Awesome
import { FaSun } from 'react-icons/fa';   // Sun icon from Font Awesome

export default function ThemeToggle() {
  const { mode, toggleColorMode } = useContext(ThemeContext);

  return (
    <IconButton onClick={toggleColorMode} color="inherit">
      {mode === 'dark' ? <FaSun /> : <FaMoon />}
    </IconButton>
  );
} 