import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../axios';

const Animales = () => {
    const navigate = useNavigate();
    const [animales, setAnimales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [opciones, setOpciones] = useState({
        clases: [],
        dietas: [],
        continentes: [],
        habitats: []
    });

    const [filtros, setFiltros] = useState({
        nombre: '',
        clase: '',
        dieta: '',
        habitat: '',
        continente: '',
        pesoMin: '',
        pesoMax: '',
        enPeligro: ''
    });

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFiltros((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const fetchAnimales = async () => {
        setLoading(true);
        setError('');

        try {
            const params = {};

            if (filtros.nombre.trim()) params.nombre = filtros.nombre.trim();
            if (filtros.clase) params.clase = filtros.clase;
            if (filtros.dieta) params.dieta = filtros.dieta;
            if (filtros.habitat) params.habitat = filtros.habitat;
            if (filtros.continente) params.continente = filtros.continente;
            if (filtros.pesoMin !== '') params.pesoMin = filtros.pesoMin;
            if (filtros.pesoMax !== '') params.pesoMax = filtros.pesoMax;
            if (filtros.enPeligro !== '') params.enPeligro = filtros.enPeligro;

            const res = await api.get('/animales', { params });
            setAnimales(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar los animales');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchOpciones = async () => {
            try {
                const res = await api.get('/animales/opciones');
                setOpciones(res.data);
            } catch (error) {
                console.error('No se pudieron cargar las opciones de filtros', error);
            }
        };

        fetchOpciones();
        fetchAnimales();
    }, []);

    const handleBuscar = (e) => {
        e.preventDefault();
        fetchAnimales()
    };

    const handleLimpiar = (e) => {
        setFiltros({
            nombre: '',
            clase: '',
            dieta: '',
            habitat: '',
            continente: '',
            pesoMin: '',
            pesoMax: '',
            enPeligro: ''
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    const columnas = [...new Set(animales.flatMap((animal) => Object.keys(animal)))];

    return (
        <div>
            <button type="button" onClick={handleLogout}>Cerrar sesión</button>
            <form onSubmit={handleBuscar}>
                <div>
                    <div>
                        <label>Nombre Comun:</label>
                        <input type="text" name="nombre" value={filtros.nombre} onChange={handleChange} placeholder="Ej. Camaleón" />
                    </div>

                    <div>
                        <label>Clase:</label>
                        <select name="clase" value={filtros.clase} onChange={handleChange}>
                            <option value="">Todas</option>
                            {opciones.clases.map((clase) => (
                                <option key={clase} value={clase}>{clase}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label>Dieta:</label>
                    <select name="dieta" value={filtros.dieta} onChange={handleChange}>
                        <option value="">Todas</option>
                            {opciones.dietas.map((dieta) => (
                            <option key={dieta} value={dieta}>{dieta}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Continente:</label>
                    <select name="continente" value={filtros.continente} onChange={handleChange}>
                        <option value="">Todas</option>
                            {opciones.continentes.map((continente) => (
                            <option key={continente} value={continente}>{continente}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Habitat:</label>
                    <select name="habitat" value={filtros.habitat} onChange={handleChange}>
                        <option value="">Todas</option>
                            {opciones.habitats.map((habitat) => (
                            <option key={habitat} value={habitat}>{habitat}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="pesoMin">Peso mínimo (kg):</label>
                    <input
                        id="pesoMin"
                        type="number"
                        name="pesoMin"
                        min="0"
                        step="any"
                        value={filtros.pesoMin}
                        onChange={handleChange}
                        placeholder="Minimo"
                    />

                    <label htmlFor="pesoMax">Peso máximo (kg):</label>
                    <input
                        id="pesoMax"
                        type="number"
                        name="pesoMax"
                        min="0"
                        step="any"
                        value={filtros.pesoMax}
                        onChange={handleChange}
                        placeholder="Maximo"
                    />
                </div>

                <div>
                    <label htmlFor="enPeligro">En peligro de extinción:</label>
                    <select id="enPeligro" name="enPeligro" value={filtros.enPeligro} onChange={handleChange}>
                        <option value="">Todos</option>
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                    </select>
                </div>

                <div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Filtrando...' : 'Filtrar'}
                    </button>
                    <button type="button" onClick={handleLimpiar}>
                        Limpiar filtros
                    </button>
                </div>
            </form>
            
            {error && <p>{error}</p>}
            {loading && <p>Cargando resultados...</p>}
            {!loading && animales.length === 0 && <p>No se encontraron animales.</p>}
            {!loading && animales.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            {columnas.map((columna) => (
                                <th key={columna} scope="col">{columna}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {animales.map((animal) => (
                            <tr key={animal.id}>
                                {columnas.map((columna) => (
                                    <td key={`${animal.id}-${columna}`}>
                                        {String(animal[columna] ?? '')}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Animales;