export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('User');
    window.location.href = '/admin/login';
};