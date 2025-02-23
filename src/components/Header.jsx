// src/components/Header.jsx
import React from 'react';
import { Menu } from '@ark-ui/react/menu';
import './Header.css';
import alexAvatar from '../assets/images/profile/alex.png'; // Importa la imagen

function Header() {
  return (
    <header className="app-header">
      <div className="logo-container">
        <img src="/logo.png" alt="Logo de la Empresa" className="logo" />
      </div>

      <div className="user-profile">
        <Menu.Root>
          <Menu.Trigger style={{ borderRadius: '5px' }}>
            <div className="user-info">
              <img
                src={alexAvatar} // Usa la variable importada
                alt="Avatar de Usuario"
                className="user-avatar"
              />
              <span>Alex Lopez</span>
            </div>
          </Menu.Trigger>
          <Menu.Positioner>
            <Menu.Content className="menu-content">
              <Menu.Item value="profile" className="menu-item">Ver Perfil</Menu.Item>
              <Menu.Item value="settings" className="menu-item">Configuración</Menu.Item>
              <Menu.Item value="dark_mode" className="menu-item">Modo oscuro</Menu.Item>
              <Menu.Separator className="menu-separator" />
              <Menu.Item value="logout" className="menu-item">Cerrar Sesión</Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      </div>
    </header>
  );
}

export default Header;
