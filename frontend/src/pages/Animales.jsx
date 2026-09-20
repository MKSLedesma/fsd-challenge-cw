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
            if (filtros.habitat) params.habitat = filtros.habitat;
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
                console.error('No se pudieron cargar las opciones de filtros', err);
            }
        };

        fetchOpciones();
        fetchAnimales();
    }, []);
}