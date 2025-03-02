import React from 'react';
import { Menu } from '@ark-ui/react/menu';
import './Header.css';
import alexAvatar from '../assets/images/profile/alex.png'; 
import logo from '../assets/images/profile/logo.png';
import dark_mode from '../assets/images/icons/dark_mode.svg';
import light_mode from '../assets/images/icons/light_mode.svg';
import settings from '../assets/images/icons/settings.svg';
import profile from '../assets/images/icons/account.svg';
import { useTheme } from '../contexts/ThemeContext';

function Header() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <header className="app-header">
      <div className="logo-container">
        <img src={logo} alt="Logo Rebbing" className="logo" />
      </div>

      <div className="user-profile">
        <Menu.Root>
          <Menu.Trigger style={{ borderRadius: '5px' }}>
            <div className="user-info">
              <img
                src={alexAvatar}
                alt="Avatar de Usuario"
                className="user-avatar"
              />
              <span>Alex Lopez</span>
            </div>
          </Menu.Trigger>
          <Menu.Positioner>
            <Menu.Content className="menu-content">
              <Menu.Item value="profile" className="menu-item"><img src={profile} alt="" className="menu-item-icon" />Profile</Menu.Item>
              <Menu.Item value="settings" className="menu-item"><img src={settings} alt="" className="menu-item-icon" />Settings</Menu.Item>
              <Menu.Item value="dark_mode" className="menu-item" onClick={toggleDarkMode}>
                
                {isDarkMode ? <img src={light_mode} alt="" className="menu-item-icon" /> : <img src={dark_mode} alt="" className="menu-item-icon" />}
                {isDarkMode ? <span>Light mode</span> : <span>Dark mode</span>}
              </Menu.Item>
              <Menu.Separator className="menu-separator" />
              <Menu.Item value="logout" className="menu-item">Log out</Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      </div>
    </header>
  );
}

export default Header;
