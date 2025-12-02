const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'Natural Kenyan Herbal Products' },
    subtitle: {
      type: String,
      default: 'Pure, Organic & Sustainable wellness crafted in Kenya.',
    },
    ctaText: { type: String, default: 'Shop Now' },
    ctaLink: { type: String, default: '/products' },
    imageUrl: { type: String, default: '/hero-banner.jpg' },
    stats: [
      {
        label: String,
        value: String,
      },
    ],
  },
  { _id: false }
);

const siteSettingsSchema = new mongoose.Schema(
  {
    hero: { type: heroSchema, default: () => ({}) },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

siteSettingsSchema.statics.getOrCreate = async function () {
  const existing = await this.findOne();
  if (existing) return existing;
  return this.create({});
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);

