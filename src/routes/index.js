const router = require('express').Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.use('/installation', require('./installationRoutes'));

module.exports = router;