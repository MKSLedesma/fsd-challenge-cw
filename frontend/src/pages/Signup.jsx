import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../axios';

const Signup = () => {
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
            await api.post('/auth/signup', { email, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrar usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Crear Cuenta</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div>
                    <label>Contrasenia (minimo 6 caracteres):</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Registrando...' : "Registrarse"}
                </button>
            </form>
            <p>Ya tenes cuenta? <Link to="/login">Inicia sesion</Link></p>
        </div>
    );
};

export default Signup;