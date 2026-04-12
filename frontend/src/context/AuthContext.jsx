import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = (userData, tokenStr) => {
    setUser(userData);
    setToken(tokenStr);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tokenStr);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const getRolePath = () => {
    if (!user) return '/login';
    switch (user.quyenTruyCap) {
      case 'QUAN_TRI_VIEN': return '/admin';
      case 'NHAN_VIEN_DIEU_HANH': return '/dieu-hanh';
      case 'NHAN_VIEN_NHA_GA': return '/nha-ga';
      case 'BAN_QUAN_LY': return '/quan-ly';
      default: return '/login';
    }
  };

  const getRoleLabel = () => {
    if (!user) return '';
    switch (user.quyenTruyCap) {
      case 'QUAN_TRI_VIEN': return 'Quản trị viên';
      case 'NHAN_VIEN_DIEU_HANH': return 'Điều phối viên';
      case 'NHAN_VIEN_NHA_GA': return 'Nhân viên Nhà ga';
      case 'BAN_QUAN_LY': return 'Quản lý';
      default: return '';
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, getRolePath, getRoleLabel }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
