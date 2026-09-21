import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../axios';
import PasswordInput from '../components/PasswordInput';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Signup | Buscador de animales';
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/auth/signup', { email, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrar usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <header className="auth-header">
                <h1>Buscador de animales</h1>
            </header>
            <h2>Crear Cuenta</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email: </label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <PasswordInput label="Contraseña (minimo 6 caracteres):" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" disabled={loading}>
                    {loading ? 'Registrando...' : "Registrarse"}
                </button>
            </form>
            <p>¿Ya tenés cuenta? <Link to="/login">Inicia sesion</Link></p>
        </div>
    );
};

export default Signup;