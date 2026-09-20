import { useState, useEffect } from "react";
import api from '../axios';

const Animales = () => {
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
        enPeligro: false
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
            if (filtros.continente) params.continente = filtros.continente;
            if (filtros.pesoMin !== '') params.pesoMin = filtros.pesoMin;
            if (filtros.pesoMax !== '') params.pesoMax = filtros.pesoMax;
            if (filtros.enPeligro) params.enPeligro = true;

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
            enPeligro: false
        });
    };

    return (
        <div>
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

                    <button type="submit" disabled={loading}>
                        {loading ? 'Filtrando...' : 'Filtrar'}
                    </button>
                    <button type="button" onClick={handleLimpiar}>
                        Limpiar filtros
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Animales;