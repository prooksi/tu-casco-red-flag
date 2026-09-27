# TU CASCO ES RED FLAG — V3

Landing de campaña con buscador de marca + modelo y consulta del listado oficial de cascos acreditados de CONASET.

## Ejecutar localmente
1. Instalar Node.js 20+.
2. En esta carpeta ejecutar `npm install`.
3. Ejecutar `npm start`.
4. Abrir `http://localhost:3000`.

## Fuente
https://www.conaset.cl/cascos-acreditados/

La página oficial consultada indica fecha de última actualización 14/09/2026.

## Producción
- Mantener HTTPS.
- Cachear el listado (actualmente 6 horas).
- Registrar fecha/hora de la última sincronización.
- No interpretar una ausencia de coincidencia como prueba definitiva de no acreditación.
- Validar logos, textos y claims con el equipo responsable de campaña.
