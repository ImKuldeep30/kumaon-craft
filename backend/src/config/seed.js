import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Inquiry from '../models/Inquiry.js';

dotenv.config();

const defaultProducts = [
  {
    name: 'Panchachuli Handspun Tweed Woolen Fabric',
    category: 'Handloom',
    price: '₹2,400 / Meter',
    minOrder: 15,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop',
    artisan: 'Bhagwati Devi, Munsyari',
    description: 'Traditionally spun and hand-woven pure sheep wool fabric, colored with organic wild herb dyes. Ideal for premium winter coats and jackets.'
  },
  {
    name: 'Traditional Almora Tamta Copper Water Jug',
    category: 'Copperware',
    price: '₹1,950 / Unit',
    minOrder: 20,
    image: 'https://images.unsplash.com/photo-1576016770956-debb63d900bb?q=80&w=600&auto=format&fit=crop',
    artisan: 'Ram Chandra Tamta, Almora',
    description: 'Exquisitely hand-hammered pure copper water container using traditional beating techniques passed down through generations of Tamta coppersmiths.'
  },
  {
    name: 'Ringaal Bamboo Handwoven Basket Set',
    category: 'Woodcraft',
    price: '₹750 / Set',
    minOrder: 30,
    image: 'https://images.unsplash.com/photo-1531835551805-16d864c8d311?q=80&w=600&auto=format&fit=crop',
    artisan: 'Dhyan Singh, Bageshwar',
    description: 'Eco-friendly and durable nesting storage baskets woven intricately from wild hill bamboo (Ringaal). Lightweight and biodegradable.'
  },
  {
    name: 'Decorative Handpainted Aipan Wood Chowki',
    category: 'Aipan Art',
    price: '₹1,500 / Piece',
    minOrder: 10,
    image: 'https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=600&auto=format&fit=crop',
    artisan: 'Kavita Pandey, Nainital',
    description: 'Traditional ritual floor drawing art (Aipan) handpainted on a premium wooden base using authentic brick-red (Geru) and white rice paste colors.'
  },
  {
    name: 'Wild Himalayan Giant Nettle (Kandali) Scarf',
    category: 'Handloom',
    price: '₹1,850 / Unit',
    minOrder: 15,
    image: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=600&auto=format&fit=crop',
    artisan: 'Sunita Bisht, Dharchula',
    description: 'Organic, ethically harvested wild nettle fibers blended with soft organic cotton, woven on traditional Himalayan frame looms.'
  },
  {
    name: 'Likhai Hand-Carved Wooden Wall Panel',
    category: 'Woodcraft',
    price: '₹8,500 / Piece',
    minOrder: 5,
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=600&auto=format&fit=crop',
    artisan: 'Harish Ram, Jageshwar',
    description: 'Intricately hand-carved cedar wood block displaying traditional Himalayan "Likhai" architectural motifs, perfect for high-end boutique interiors.'
  }
];

const defaultInquiries = [
  {
    buyerName: 'FabIndia Sourcing Dept',
    buyerEmail: 'procurement@fabindia.com',
    productName: 'Panchachuli Handspun Tweed Woolen Fabric',
    quantity: 60,
    status: 'Pending Review'
  },
  {
    buyerName: 'Organic Weaves Mumbai',
    buyerEmail: 'hello@organicweaves.in',
    productName: 'Wild Himalayan Giant Nettle (Kandali) Scarf',
    quantity: 45,
    status: 'Quote Sent'
  },
  {
    buyerName: 'Craft & Heritage Boutique NYC',
    buyerEmail: 'imports@craftheritage.org',
    productName: 'Likhai Hand-Carved Wooden Wall Panel',
    quantity: 8,
    status: 'In Discussion'
  }
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/kumaon-craft';
    console.log(`Connecting to database for seeding...`);
    await mongoose.connect(mongoUri);

    // Clear existing data
    await Product.deleteMany();
    await Inquiry.deleteMany();
    console.log('Existing products and inquiries deleted.');

    // Seed products
    await Product.insertMany(defaultProducts);
    console.log(`${defaultProducts.length} default products seeded successfully.`);

    // Seed inquiries
    await Inquiry.insertMany(defaultInquiries);
    console.log(`${defaultInquiries.length} default inquiries seeded successfully.`);

    console.log('Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
