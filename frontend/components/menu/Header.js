import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Settings, User, Shield, Building2 } from 'lucide-react';
import styles from './Header.module.css';
import ThemeToggle from './ThemeToggle';

// Hook personalizado para detectar o tema atual
const useTheme = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Função para verificar o tema atual
    const checkTheme = () => {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
      setIsDark(isDarkMode);
    };

    // Verificar tema inicial
    checkTheme();

    // Listener para mudanças no tema do sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkTheme);

    // Listener para mudanças no localStorage
    const handleStorageChange = () => checkTheme();
    window.addEventListener('storage', handleStorageChange);

    // Listener para mudanças no atributo data-theme (mudanças via toggle)
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setIsDark(currentTheme === 'dark');
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => {
      mediaQuery.removeEventListener('change', checkTheme);
      window.removeEventListener('storage', handleStorageChange);
      observer.disconnect();
    };
  }, []);

  return isDark;
};

export default function Header({ auth }) {
  const router = useRouter();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const isDark = useTheme();

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserDropdown && !event.target.closest('.userAvatar') && !event.target.closest('.dropdown')) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  function handleLogout() {
    console.log('Logout executado');

    // Fechar dropdown
    setShowUserDropdown(false);

    // Remover dados de autenticação do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userData');

    console.log('LocalStorage limpo, redirecionando para login');

    // Redirecionar para login
    router.push("/login");
  }

  const handleNavigateToHome = () => {
    router.push('/');
  };

  const handleNavigateToSettings = () => {
    router.push('/ajustes');
  };

  const handleNavigateToSuperadmin = () => {
    router.push('/superadmin');
  };

  const handleNavigateToAdmin = () => {
    router.push('/admin');
  };

  // Função para verificar se uma aba está ativa
  const isActiveTab = (path) => {
    return router.pathname === path;
  };

  const handleEditProfile = () => {
    setShowUserDropdown(false);
    router.push('/perfil');
  };

  // Verificar se auth e user estão disponíveis
  if (!auth || !auth.user) {
    return null;
  }

  const { user } = auth;
  const isSuperadmin = user?.role === 'Superadmin' || user?.userRole === 'Superadmin';
  const isAdmin = user?.role === 'Administrador' || user?.userRole === 'Administrador';

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {/* Logo e Navegação */}
        <div className={styles.leftSection}>
          <div className={styles.logo} onClick={handleNavigateToHome} role="button" tabIndex={0}>
            <span className={styles.logoText}>Bookhub</span>
          </div>

          {/* Navegação */}
          <div className={styles.navigation}>
            <button
              className={`${styles.navButton} ${isActiveTab('/ajustes') ? styles.navButtonActive : ''}`}
              onClick={handleNavigateToSettings}
              title="Ajustes"
            >
              <Settings size={20} />
              <span>Ajustes</span>
            </button>

            {isAdmin && (
              <button
                className={`${styles.navButton} ${isActiveTab('/admin') ? styles.navButtonActive : ''}`}
                onClick={handleNavigateToAdmin}
                title="Admin"
              >
                <Building2 size={20} />
                <span>Admin</span>
              </button>
            )}

            {isSuperadmin && (
              <button
                className={`${styles.navButton} ${isActiveTab('/superadmin') ? styles.navButtonActive : ''}`}
                onClick={handleNavigateToSuperadmin}
                title="Superadmin"
              >
                <Shield size={20} />
                <span>Superadmin</span>
              </button>
            )}
          </div>
        </div>

        {/* Usuário e Dropdown */}
        <div className={styles.userSection}>
          {/* Toggle de Tema */}
          <ThemeToggle />

          <div className={styles.userInfo}>
            <div className={`${styles.userAvatar} userAvatar`} onClick={() => setShowUserDropdown(!showUserDropdown)}>
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt="Avatar"
                  className={styles.avatarImage}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {user.nome ? user.nome.charAt(0).toUpperCase() : (user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U')}
                </div>
              )}
              <div className={styles.userDetails}>
                <span className={styles.userName}>{user.nome || user.full_name || user.name}</span>
              </div>
              <svg className={styles.dropdownArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Dropdown */}
          {showUserDropdown && (
            <div className={`${styles.dropdown} dropdown`}>
              <div className={styles.dropdownItem} onClick={handleEditProfile}>
                <User className={styles.dropdownIcon} size={16} />
                Editar Perfil
              </div>
              <div className={styles.dropdownItem} onClick={handleLogout}>
                <svg className={styles.dropdownIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
