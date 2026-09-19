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
            animales = animales.filter(a => a.clase.toLowerCase().includes(clase.toLowerCase().trim()));
        }

        if (dieta) {
            animales = animales.filter(a => a.dieta.toLowerCase().includes(dieta.toLowerCase().trim()));
        }

        if (continente) {
            animales = animales.filter(a => a.continente.toLowerCase().includes(continente.toLowerCase().trim()));
        }

        if (pesoMin !== undefined) {
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

module.exports = router;