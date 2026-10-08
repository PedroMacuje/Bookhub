import { useEffect, useState, useCallback } from "react";

// Hook para gerenciar autenticação do usuário
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para sincronizar dados do usuário com localStorage
  const syncUserData = useCallback(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erro ao processar dados do usuário:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    // Sincronização inicial
    syncUserData();

    // Listener para mudanças no localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'userData' || e.key === 'token') {
        syncUserData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [syncUserData]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  return { 
    user, 
    loading, 
    logout, 
    updateUser, 
    syncUserData 
  };
}
