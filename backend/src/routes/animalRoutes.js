const express = require('express');
const router = express.Router();
const { readAnimals } = require('../utils/db')

router.get('/', async (req, res) => {
    try {
        const { nombre, clase, dieta, continente, pesoMin, pesoMax, enPeligro } = req.query;

        let animales = await readAnimals();

        if (nombre) {
            animales = animales.filter(a => a.nombreComun.toLowerCase().includes(nombre.toLowerCase().trim()));
        }

        if (clase) {
            animales = animales.filter(a => a.clase.toLowerCase() === clase.toLowerCase().trim());
        }

        if (dieta) {
            animales = animales.filter(a => a.dieta.toLowerCase() === dieta.toLowerCase().trim());
        }

        if (continente) {
            animales = animales.filter(a => a.continente.toLowerCase() === continente.toLowerCase().trim());
        }

        if (pesoMax !== undefined) {
            const max = parseFloat(pesoMax);
            if (!isNaN(max)) {
                animales = animales.filter(a => a.pesoPromedioKg <= max);
            }
        }

        if (pesoMin !== undefined) {
            const min = parseFloat(pesoMin);
            if (!isNaN(min)) {
                animales = animales.filter(a => a.pesoPromedioKg >= min);
            }
        }

        if (enPeligro !== undefined) {
            const enPeligroBool = enPeligro === 'true'
            animales = animales.filter(a => a.enPeligroExtincion === enPeligroBool);
        }

        return res.status(200).json(animales);
    } catch (error) {
        console.error('Error al obtener animales: ', error);
        return res.status(500).json({ message: 'Error interno al consultar animales' });
    }
});

router.get('/opciones', async(req, res) => {
    try {
        const animales = await readAnimals();

        const clases =  [...new Set(animales.map(a => a.clase).filter(Boolean))].sort();
        const dietas =  [...new Set(animales.map(a => a.dieta).filter(Boolean))].sort();
        const continentes =  [...new Set(animales.map(a => a.continente).filter(Boolean))].sort();
        const habitats = [...new Set(animales.map(a => a.habitat).filter(Boolean))].sort();

        return res.status(200).json({
            clases,
            dietas,
            continentes,
            habitats
        });
    } catch (error) {
        console.error('Error al obtener las opciones de los filtros: ', error);
        return res.status(500).json({ message: 'Error al obtener las opciones de los filtros'})
    }
});

module.exports = router;