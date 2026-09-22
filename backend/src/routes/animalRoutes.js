const express = require('express');
const router = express.Router();
const Animal = require('../models/animales');

router.get('/', async (req, res) => {
    try {
        const { nombre, clase, dieta, continente, pesoMin, pesoMax, enPeligro } = req.query;

        const filters = {};

        if (nombre) {
            filters.nombreComun = { $regex: nombre.trim(), $options: 'i' };
        }

        if (clase) {
            filters.clase = clase.trim();
        }

        if (dieta) {
            filters.dieta = dieta.trim();
        }

        if (continente) {
            filters.continente = continente.trim();
        }

        if (pesoMax !== undefined) {
            const max = parseFloat(pesoMax);
            if (!isNaN(max)) {
                filters.pesoPromedioKg = { ...filters.pesoPromedioKg, $lte: max };
            }
        }

        if (pesoMin !== undefined) {
            const min = parseFloat(pesoMin);
            if (!isNaN(min)) {
                filters.pesoPromedioKg = { ...filters.pesoPromedioKg, $gte: min };
            }
        }

        if (enPeligro !== undefined) {
            const enPeligroBool = enPeligro === 'true'
            filters.enPeligroExtincion = enPeligroBool;
        }

        const animales = await Animal.find(filters).select('-_id').lean();
        return res.status(200).json(animales);
    } catch (error) {
        console.error('Error al obtener animales: ', error);
        return res.status(500).json({ message: 'Error interno al consultar animales' });
    }
});

router.get('/opciones', async(req, res) => {
    try {
        const animales = await Animal.find().select('-_id').lean();

        const clases =  [...new Set(animales.map(a => a.clase).filter(Boolean))].sort();
        const dietas =  [...new Set(animales.map(a => a.dieta).filter(Boolean))].sort();
        const continentes =  [...new Set(animales.map(a => a.continente).filter(Boolean))].sort();

        return res.status(200).json({
            clases,
            dietas,
            continentes
        });
    } catch (error) {
        console.error('Error al obtener las opciones de los filtros: ', error);
        return res.status(500).json({ message: 'Error al obtener las opciones de los filtros'})
    }
});

module.exports = router;