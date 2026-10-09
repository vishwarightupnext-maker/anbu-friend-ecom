import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import Product from './models/Product.js';

dotenv.config();

const initialProducts = [
  { id: "pooja-1", categoryId: "pooja", categoryName: "Pooja Products", name: "Varahi Secret Manjal Thool", unit: "1 Nos", price: 150, image: "images/products/Pooja/Pooja (1).jpeg" },
  { id: "pooja-2", categoryId: "pooja", categoryName: "Pooja Products", name: "Varahi Secret Thazhamboo Pachai Kungumam", unit: "1 Nos", price: 150, image: "images/products/Pooja/Pooja (2).jpeg" },
  { id: "pooja-3", categoryId: "pooja", categoryName: "Pooja Products", name: "Varahi Secret Thazhamboo Sivappu Kungumam", unit: "1 Nos", price: 150, image: "images/products/Pooja/Pooja (3).jpeg" },
  { id: "pooja-4", categoryId: "pooja", categoryName: "Pooja Products", name: "Varahi Secret Seera Vaham Tharum Yaga Viboothi", unit: "1 Nos", price: 150, image: "images/products/Pooja/Pooja (4).jpeg" },
  { id: "pooja-5", categoryId: "pooja", categoryName: "Pooja Products", name: "Varahi Secret Kan Thrishti Mai", unit: "1 Nos", price: 500, image: "images/products/Pooja/Pooja (5).png" },
  { id: "pooja-6", categoryId: "pooja", categoryName: "Pooja Products", name: "Original Aragaja", unit: "1 Nos", price: 600, image: "images/products/Pooja/Pooja (6).jpeg" },

  { id: "shampoo-1", categoryId: "shampoo", categoryName: "Shampoo", name: "Varahi Secret Shampoo", unit: "200 ml", price: 250, image: "images/products/Shampoo/Shampoo (1).png" },
  { id: "shampoo-2", categoryId: "shampoo", categoryName: "Shampoo", name: "Varahi Secret Shampoo", unit: "500 ml", price: 500, image: "images/products/Shampoo/Shampoo (2).png" },
  { id: "shampoo-3", categoryId: "shampoo", categoryName: "Shampoo", name: "Varahi Secret Shampoo", unit: "1 Litre", price: 900, image: "images/products/Shampoo/Shampoo (3).jpeg" },

  { id: "oil-1", categoryId: "hair-oil", categoryName: "Hair Oil", name: "Varahi Secret Beauty Oil", unit: "30 ml", price: 349, image: "images/products/Hair/Hair (1).png" },
  { id: "oil-2", categoryId: "hair-oil", categoryName: "Hair Oil", name: "Varahi Secret Hair Oil", unit: "100 ml", price: 299, image: "images/products/Hair/Hair (2).png" },
  { id: "oil-3", categoryId: "hair-oil", categoryName: "Hair Oil", name: "Varahi Secret Hair Oil", unit: "200 ml", price: 499, image: "images/products/Hair/Hair (3).png" },
  { id: "oil-4", categoryId: "hair-oil", categoryName: "Hair Oil", name: "Varahi Secret Hair Oil", unit: "500 ml", price: 999, image: "images/products/Hair/Hair (4).jpeg" },
  { id: "oil-5", categoryId: "hair-oil", categoryName: "Hair Oil", name: "Varahi Secret Hair Oil", unit: "1 Litre", price: 1599, image: "images/products/Hair/Hair (5).jpeg" },
  { id: "oil-6", categoryId: "hair-oil", categoryName: "Hair Oil", name: "Varahi Secret Aragaja Oil", unit: "30 ml", price: 500, image: "images/products/Hair/Hair (6).jpeg" },
  { id: "oil-7", categoryId: "hair-oil", categoryName: "Hair Oil", name: "Varahi Secret Punugu Oil", unit: "30 ml", price: 500, image: "images/products/Hair/Hair (7).jpeg" },
  { id: "oil-8", categoryId: "hair-oil", categoryName: "Hair Oil", name: "Varahi Secret Kasthuri Oil", unit: "30 ml", price: 500, image: "images/products/Hair/Hair (8).jpeg" },
  { id: "oil-9", categoryId: "hair-oil", categoryName: "Hair Oil", name: "Varahi Secret Javadhu Oil", unit: "30 ml", price: 500, image: "images/products/Hair/Hair (9).png" },

  { id: "acc-1", categoryId: "accessories", categoryName: "Accessories", name: "Varahi Secret Kan Drishti Thaayathu", unit: "1 Nos", price: 1001, image: "images/products/Accessories/Accessories (1).jpeg" },
  { id: "acc-2", categoryId: "accessories", categoryName: "Accessories", name: "Murugan Silai", unit: "1 Nos", price: 300, image: "images/products/Accessories/Accessories (2).jpeg" },
  { id: "acc-3", categoryId: "accessories", categoryName: "Accessories", name: "Murugan Silai", unit: "1 Nos", price: 300, image: "images/products/Accessories/Accessories (3).jpeg" },
  { id: "acc-4", categoryId: "accessories", categoryName: "Accessories", name: "Karungali Malai (Kambiyal Kadiyadhu)", unit: "1 Nos", price: 2000, image: "images/products/Accessories/Accessories (4).png" },
  { id: "acc-5", categoryId: "accessories", categoryName: "Accessories", name: "Karungali Malai (Noolil Kadiyadhu)", unit: "1 Nos", price: 1000, image: "images/products/Accessories/Accessories (5).jpeg" },
  { id: "acc-6", categoryId: "accessories", categoryName: "Accessories", name: "Vetrivel Murugan", unit: "1 Nos", price: 150, image: "images/products/Accessories/Accessories (6).jpeg" },
  { id: "acc-7", categoryId: "accessories", categoryName: "Accessories", name: "Vetrivel Murugan", unit: "1 Nos", price: 150, image: "images/products/Accessories/Accessories (7).jpeg" },
  { id: "acc-8", categoryId: "accessories", categoryName: "Accessories", name: "Vetrivel Murugan", unit: "1 Nos", price: 150, image: "images/products/Accessories/Accessories (8).jpeg" },
  { id: "acc-9", categoryId: "accessories", categoryName: "Accessories", name: "Vetrivel Murugan", unit: "1 Nos", price: 70, image: "images/products/Accessories/Accessories (9).png" },

  { id: "yantra-1", categoryId: "kan-drishti", categoryName: "Kan Drishti Yantra", name: "Kan Drishti Yantra", unit: "3×3", price: 600, image: "images/products/Kan Dhristi/Kan Dhristi (1).jpeg" },
  { id: "yantra-2", categoryId: "kan-drishti", categoryName: "Kan Drishti Yantra", name: "Kan Drishti Yantra", unit: "6×6", price: 1500, image: "images/products/Kan Dhristi/Kan Dhristi (2).png" },
  { id: "yantra-3", categoryId: "kan-drishti", categoryName: "Kan Drishti Yantra", name: "Kan Drishti Yantra", unit: "8×8", price: 2000, image: "images/products/Kan Dhristi/Kan Dhristi (3).png" },
  { id: "yantra-3b", categoryId: "kan-drishti", categoryName: "Kan Drishti Yantra", name: "Kan Drishti Yantra", unit: "10×10", price: 2000, image: "images/products/Kan Dhristi/Kan Dhristi (6).jpeg" },
  { id: "yantra-4", categoryId: "kan-drishti", categoryName: "Kan Drishti Yantra", name: "Kan Drishti Yantra", unit: "20×20", price: 3000, image: "images/products/Kan Dhristi/Kan Dhristi (4).png" },
  { id: "yantra-5", categoryId: "kan-drishti", categoryName: "Kan Drishti Yantra", name: "Pana Vasiya Yantra", unit: "1 Nos", price: 1200, image: "images/products/Kan Dhristi/Kan Dhristi (5).jpeg" },
  { id: "yantra-6", categoryId: "kan-drishti", categoryName: "Kan Drishti Yantra", name: "Kubera Mahalakshmi Yantra", unit: "1 Nos", price: 1300, image: "images/products/Kan Dhristi/Kan Dhristi (12).jpeg" },
  { id: "yantra-7", categoryId: "kan-drishti", categoryName: "Kan Drishti Yantra", name: "Sarva Vasya Thadai Nivarthi", unit: "1 Nos", price: 1400, image: "images/products/Kan Dhristi/Kan Dhristi (7).png" },
  { id: "yantra-8", categoryId: "kan-drishti", categoryName: "Kan Drishti Yantra", name: "Kuthirai Ladam", unit: "1 Nos", price: 500, image: "images/products/Kan Dhristi/Kan Dhristi (8).jpeg" },
  { id: "yantra-9", categoryId: "kan-drishti", categoryName: "Kan Drishti Yantra", name: "Nava Kunjaram", unit: "1 Nos", price: 200, image: "images/products/Kan Dhristi/Kan Dhristi (9).jpeg" },
  { id: "yantra-10", categoryId: "kan-drishti", categoryName: "Kan Drishti Yantra", name: "Nava Kunjaram", unit: "1 Nos", price: 200, image: "images/products/Kan Dhristi/Kan Dhristi (10).png" },

  { id: "kubera-1", categoryId: "kubera", categoryName: "Kubera Pokisam", name: "Kubera Mahalakshmi Mahasakthi Pokisam", unit: "Small", price: 1000, image: "images/products/Pokisam/Pokisam (1).jpeg" },
  { id: "kubera-2", categoryId: "kubera", categoryName: "Kubera Pokisam", name: "Kubera Mahalakshmi Mahasakthi Pokisam", unit: "Medium", price: 1500, image: "images/products/Pokisam/Pokisam (2).png" },
  { id: "kubera-3", categoryId: "kubera", categoryName: "Kubera Pokisam", name: "Kubera Mahalakshmi Mahasakthi Pokisam", unit: "Large", price: 2000, image: "images/products/Pokisam/Pokisam (3).png" },
  { id: "kubera-4", categoryId: "kubera", categoryName: "Kubera Pokisam", name: "Kubera Mahalakshmi Mahasakthi Pokisam", unit: "Large", price: 3000, image: "images/products/Pokisam/Pokisam (12).jpeg" },
  { id: "kubera-5", categoryId: "kubera", categoryName: "Kubera Pokisam", name: "Kubera Mahalakshmi Mahasakthi Pokisam", unit: "Large", price: 3500, image: "images/products/Pokisam/Pokisam (4).png" },
  { id: "kubera-6", categoryId: "kubera", categoryName: "Kubera Pokisam", name: "Kubera Mahalakshmi Mahasakthi Pokisam", unit: "Large", price: 7000, image: "images/products/Pokisam/Pokisam (5).jpeg" },
  { id: "kubera-7", categoryId: "kubera", categoryName: "Kubera Pokisam", name: "Kubera Mahalakshmi Mahasakthi Pokisam", unit: "Large", price: 10000, image: "images/products/Pokisam/Pokisam (6).png" },
  { id: "kubera-8", categoryId: "kubera", categoryName: "Kubera Pokisam", name: "Kubera Mahalakshmi Mahasakthi Pokisam", unit: "Large", price: 10000, image: "images/products/Pokisam/Pokisam (7).jpeg" },
  { id: "kubera-9", categoryId: "kubera", categoryName: "Kubera Pokisam", name: "Kubera Mahalakshmi Mahasakthi Pokisam", unit: "Large", price: 12000, image: "images/products/Pokisam/Pokisam (8).png" },
  { id: "kubera-10", categoryId: "kubera", categoryName: "Kubera Pokisam", name: "Kubera Mahalakshmi Mahasakthi Pokisam", unit: "Large", price: 9000, image: "images/products/Pokisam/Pokisam (9).jpeg" },
  { id: "kubera-11", categoryId: "kubera", categoryName: "Kubera Pokisam", name: "Kubera Mahalakshmi Mahasakthi Pokisam", unit: "Large", price: 12000, image: "images/products/Pokisam/Pokisam (10).png" },
  { id: "kubera-12", categoryId: "kubera", categoryName: "Kubera Pokisam", name: "Kubera Mahalakshmi Mahasakthi Pokisam", unit: "Large", price: 12000, image: "images/products/Pokisam/Pokisam (11).png" },

  { id: "vs-1", categoryId: "varahi-secret", categoryName: "Varahi Secret", name: "Varahi Secret Weight Loss Powder", unit: "500 gm", price: 600, image: "images/products/Secret/Varahi (1).jpeg" },
  { id: "vs-2", categoryId: "varahi-secret", categoryName: "Varahi Secret", name: "Varahi Secret Weight Loss Powder", unit: "1 kg", price: 1200, image: "images/products/Secret/Varahi (2).jpeg" },
  { id: "vs-4", categoryId: "varahi-secret", categoryName: "Varahi Secret", name: "Varahi Secret Sukku Mali Coffee Powder", unit: "100 gm", price: 399, image: "images/products/Secret/Varahi (3).jpeg" },
  { id: "vs-3", categoryId: "varahi-secret", categoryName: "Varahi Secret", name: "Varahi Secret Pain Oil", unit: "100 gm", price: 499, image: "images/products/Secret/Varahi (4).png" },
  { id: "vs-5", categoryId: "varahi-secret", categoryName: "Varahi Secret", name: "Varahi Secret (Sori, Sirangu, Padai, Themal, Vishakkati) Maranthu", unit: "100 gm", price: 499, image: "images/products/Secret/Varahi (5).jpeg" },
];

const productsToInsert = initialProducts.map(p => ({
  _id: p.id,
  name: p.name,
  description: `Pure and authentic ${p.name} prepared traditionally according to Siddhar wisdom.`,
  price: p.price,
  originalPrice: p.price,
  discount: 0,
  image: p.image,
  category: p.categoryName,
  categoryId: p.categoryId,
  categoryName: p.categoryName,
  unit: p.unit,
  stock: 50,
  soldOut: false,
  offer: false,
  rating: 5,
  reviewsCount: 24,
  inStock: true,
  specifications: {
    "Origin": "Theni, Tamil Nadu",
    "Purity": "100% Organic & Chemical-Free",
    "Usage": "Use as directed by Siddhar guidelines"
  }
}));

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/varahi');
    console.log('Connected to MongoDB...'.yellow);

    await Product.deleteMany({});
    console.log('Cleared existing products...'.red);

    await Product.insertMany(productsToInsert);
    console.log('Seeded products successfully!'.green.bold);

    mongoose.connection.close();
    console.log('Database connection closed.'.cyan);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`.red.bold);
    process.exit(1);
  }
};

seedDB();
