const express = require('express');
const router = express.Router();
const schemaController = require('../../controllers/admin/schemaController');
const { authenticateAdmin } = require('../../middleware/auth');

// Apply admin authentication middleware to all routes
router.use(authenticateAdmin);

// Schema management routes
router.get('/', schemaController.getAllSchemas);
router.post('/', schemaController.createSchema);
router.get('/:id', schemaController.getSchemaById);
router.put('/:id', schemaController.updateSchema);
router.delete('/:id', schemaController.deleteSchema);
router.get('/migrations', schemaController.getAllMigrations);
router.post('/migrations', schemaController.createMigration);
router.post('/migrations/:id/run', schemaController.runMigration);
router.post('/migrations/:id/rollback', schemaController.rollbackMigration);

module.exports = router; 