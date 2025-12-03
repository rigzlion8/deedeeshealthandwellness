const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

router.post('/', productController.createProductValidators, productController.createProduct);

router.put(
  '/:id',
  productController.updateProductValidators,
  productController.updateProduct
);

router.delete(
  '/:id',
  productController.validateProductId,
  productController.deleteProduct
);

module.exports = router;

