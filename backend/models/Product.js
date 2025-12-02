const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  detailedDescription: String,
  price: {
    type: Number,
    required: true
  },
  discountPrice: Number,
  category: {
    type: String,
    required: true,
    enum: ['herbal', 'skincare', 'supplements', 'teas', 'oils']
  },
  subcategory: String,
  images: [{
    url: String,
    publicId: String
  }],
  ingredients: [String],
  benefits: [String],
  usageInstructions: String,
  stockQuantity: {
    type: Number,
    required: true,
    default: 0
  },
  minStockLevel: {
    type: Number,
    default: 10
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    createdAt: Date
  }],
  tags: [String],
  metaTitle: String,
  metaDescription: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if product is in stock
productSchema.virtual('inStock').get(function() {
  return this.stockQuantity > 0;
});

// Index for search
productSchema.index({ 
  name: 'text', 
  description: 'text', 
  ingredients: 'text', 
  tags: 'text' 
});

module.exports = mongoose.model('Product', productSchema);