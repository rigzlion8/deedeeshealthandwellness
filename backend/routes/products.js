const express = require('express');
const { adminAuth } = require('../middleware/auth');
const productController = require('../controllers/productController');

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

router.post('/', adminAuth, productController.createProductValidators, productController.createProduct);

router.put(
  '/:id',
  adminAuth,
  productController.updateProductValidators,
  productController.updateProduct
);

router.delete(
  '/:id',
  adminAuth,
  productController.validateProductId,
  productController.deleteProduct
);

module.exports = router;

