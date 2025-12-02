const { validationResult, body, param } = require('express-validator');
const Product = require('../models/Product');

const parseBoolean = (value) => {
  if (value === undefined) return undefined;
  if (typeof value === 'boolean') return value;
  return ['true', '1', 'yes'].includes(String(value).toLowerCase());
};

const normalizeImages = (images = []) =>
  images.map((image) => (typeof image === 'string' ? { url: image } : image));

const baseQueryBuilder = (query) => {
  const {
    search,
    category,
    isFeatured,
    isNewArrival,
    inStock,
    minPrice,
    maxPrice,
  } = query;

  const filter = {};

  if (search) {
    filter.$text = { $search: search };
  }
  if (category) {
    filter.category = category;
  }
  const featured = parseBoolean(isFeatured);
  if (typeof featured === 'boolean') {
    filter.isFeatured = featured;
  }
  const newArrival = parseBoolean(isNewArrival);
  if (typeof newArrival === 'boolean') {
    filter.isNewArrival = newArrival;
  }
  const stock = parseBoolean(inStock);
  if (typeof stock === 'boolean') {
    filter.stockQuantity = stock ? { $gt: 0 } : 0;
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  return filter;
};

const sharedValidators = [
  body('name').optional().trim().notEmpty().withMessage('Name is required'),
  body('slug').optional().trim().notEmpty().withMessage('Slug is required'),
  body('description').optional().trim().notEmpty().withMessage('Description is required'),
  body('price').optional().isNumeric().withMessage('Price must be numeric'),
  body('category').optional().trim().notEmpty().withMessage('Category is required'),
  body('images').optional().isArray().withMessage('Images must be an array'),
];

exports.createProductValidators = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('slug').trim().notEmpty().withMessage('Slug is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be numeric'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('images').optional().isArray().withMessage('Images must be an array'),
];

exports.updateProductValidators = sharedValidators;

exports.validateProductId = [param('id').isMongoId().withMessage('Invalid product id')];

exports.getProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 20;
    const sort = req.query.sort || '-createdAt';

    const filter = baseQueryBuilder(req.query);

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    res.json({
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const payload = {
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
      detailedDescription: req.body.detailedDescription,
      price: req.body.price,
      discountPrice: req.body.discountPrice,
      category: req.body.category,
      subcategory: req.body.subcategory,
      images: normalizeImages(req.body.images),
      ingredients: req.body.ingredients,
      benefits: req.body.benefits,
      usageInstructions: req.body.usageInstructions,
      stockQuantity: req.body.stockQuantity,
      minStockLevel: req.body.minStockLevel,
      isFeatured: req.body.isFeatured,
      isNewArrival: req.body.isNewArrival,
      rating: req.body.rating,
      tags: req.body.tags,
      metaTitle: req.body.metaTitle,
      metaDescription: req.body.metaDescription,
      createdBy: req.user?._id,
    };

    const product = await Product.create(payload);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const payload = {
      ...req.body,
    };

    if (req.body.images) {
      payload.images = normalizeImages(req.body.images);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...payload, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

