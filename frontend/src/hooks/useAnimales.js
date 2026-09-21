import { useEffect, useState } from 'react';
import api from '../axios';

const FILTROS_VACIOS = {
    nombre: '',
    clase: '',
    dieta: '',
    continente: '',
    pesoMin: '',
    pesoMax: '',
    enPeligroSi: false,
    enPeligroNo: false
};

const buildAnimalParams = (filtros) => {
    const params = {};

    if (filtros.nombre.trim()) params.nombre = filtros.nombre.trim();
    if (filtros.clase) params.clase = filtros.clase;
    if (filtros.dieta) params.dieta = filtros.dieta;
    if (filtros.continente) params.continente = filtros.continente;
    if (filtros.pesoMin !== '') params.pesoMin = filtros.pesoMin;
    if (filtros.pesoMax !== '') params.pesoMax = filtros.pesoMax;
    if (filtros.enPeligroSi !== filtros.enPeligroNo) {
        params.enPeligro = filtros.enPeligroSi;
    }

    return params;
};

const useAnimales = () => {
    const [animales, setAnimales] = useState([]);
    const [opciones, setOpciones] = useState({
        clases: [],
        dietas: [],
        continentes: []
    });
    const [filtros, setFiltros] = useState(FILTROS_VACIOS);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchAnimales = async (filtrosBusqueda = filtros) => {
        setLoading(true);
        setError('');

        try {
            const params = buildAnimalParams(filtrosBusqueda);
            const response = await api.get('/animales', { params });
            setAnimales(response.data);
        } catch (requestError) {
            setAnimales([]);
            setError(requestError.response?.data?.message || 'Error al cargar los animales');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchOpciones = async () => {
            try {
                const response = await api.get('/animales/opciones');
                setOpciones(response.data);
            } catch (requestError) {
                setError(requestError.response?.data?.message || 'Error al cargar las opciones de filtros');
            }
        };

        fetchOpciones();
        fetchAnimales();
    }, []);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFiltros((previousFilters) => ({
            ...previousFilters,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleBuscar = (event) => {
        event.preventDefault();
        fetchAnimales();
    };

    const handleLimpiar = () => {
        setFiltros(FILTROS_VACIOS);
        fetchAnimales(FILTROS_VACIOS);
    };

    return {
        animales,
        opciones,
        filtros,
        loading,
        error,
        handleChange,
        handleBuscar,
        handleLimpiar
    };
};

export default useAnimales;
