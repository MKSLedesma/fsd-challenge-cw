import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/animales');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <header className="auth-header">
                <h1>Buscador de animales</h1>
            </header>
            <h2>Ingresar a su cuenta</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email: </label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div>
                    <label>Contraseña: </label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Iniciando sesión...' : "Iniciar sesión"}
                </button>
            </form>
            <p>¿No tenés cuenta? <Link to="/signup">Crear cuenta</Link></p>
        </div>
    );
};

export default Login;