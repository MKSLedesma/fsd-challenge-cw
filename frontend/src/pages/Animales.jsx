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
        enPeligroSi: false,
        enPeligroNo: false
    });

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFiltros((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const fetchAnimales = async (filtrosBusqueda = filtros) => {
        setLoading(true);
        setError('');

        try {
            const params = {};

            if (filtrosBusqueda.nombre.trim()) params.nombre = filtrosBusqueda.nombre.trim();
            if (filtrosBusqueda.clase) params.clase = filtrosBusqueda.clase;
            if (filtrosBusqueda.dieta) params.dieta = filtrosBusqueda.dieta;
            if (filtrosBusqueda.habitat) params.habitat = filtrosBusqueda.habitat;
            if (filtrosBusqueda.continente) params.continente = filtrosBusqueda.continente;
            if (filtrosBusqueda.pesoMin !== '') params.pesoMin = filtrosBusqueda.pesoMin;
            if (filtrosBusqueda.pesoMax !== '') params.pesoMax = filtrosBusqueda.pesoMax;
            if (filtrosBusqueda.enPeligroSi !== filtrosBusqueda.enPeligroNo) {
                params.enPeligro = filtrosBusqueda.enPeligroSi;
            }

            const res = await api.get('/animales', { params });
            setAnimales(res.data);
        } catch (err) {
            setAnimales([]);
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

    const handleLimpiar = () => {
        const filtrosVacios = {
            nombre: '',
            clase: '',
            dieta: '',
            habitat: '',
            continente: '',
            pesoMin: '',
            pesoMax: '',
            enPeligroSi: false,
            enPeligroNo: false
        };

        setFiltros(filtrosVacios);
        fetchAnimales(filtrosVacios);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    const columnas = [...new Set(animales.flatMap((animal) => Object.keys(animal)))];

    return (
        <div className="animals-page">
            <header className="animals-header">
                <h1>Buscador de animales</h1>
                <button type="button" onClick={handleLogout}>Cerrar sesión</button>
            </header>
            <form onSubmit={handleBuscar}>
                <div>
                    <h2>Filtros</h2>
                <div>
                    <div className="filter-item">
                        <label>Nombre Comun:</label>
                        <input type="text" name="nombre" value={filtros.nombre} onChange={handleChange} placeholder="Ej. Camaleón" />
                    </div>

                    <div className="filter-item">
                        <label>Clase:</label>
                        <select name="clase" value={filtros.clase} onChange={handleChange}>
                            <option value="">Todas</option>
                            {opciones.clases.map((clase) => (
                                <option key={clase} value={clase}>{clase}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="filter-item">
                    <label>Dieta:</label>
                    <select name="dieta" value={filtros.dieta} onChange={handleChange}>
                        <option value="">Todas</option>
                            {opciones.dietas.map((dieta) => (
                            <option key={dieta} value={dieta}>{dieta}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-item">
                    <label>Continente:</label>
                    <select name="continente" value={filtros.continente} onChange={handleChange}>
                        <option value="">Todas</option>
                            {opciones.continentes.map((continente) => (
                            <option key={continente} value={continente}>{continente}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-item">
                    <label>Habitat:</label>
                    <select name="habitat" value={filtros.habitat} onChange={handleChange}>
                        <option value="">Todas</option>
                            {opciones.habitats.map((habitat) => (
                            <option key={habitat} value={habitat}>{habitat}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-item">
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

                <div className="filter-item">
                    <span>En peligro de extinción:</span>
                    <label>
                        <input
                            type="checkbox"
                            name="enPeligroSi"
                            checked={filtros.enPeligroSi}
                            onChange={handleChange}
                        />
                        Sí
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="enPeligroNo"
                            checked={filtros.enPeligroNo}
                            onChange={handleChange}
                        />
                        No
                    </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Filtrando...' : 'Filtrar'}
                    </button>
                    <button type="button" onClick={handleLimpiar}>
                        Limpiar filtros
                    </button>
                </div>
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