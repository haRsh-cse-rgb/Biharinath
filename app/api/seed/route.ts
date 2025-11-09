import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import User from '@/models/User';
import Booking from '@/models/Booking';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import Address from '@/models/Address';
import Review from '@/models/Review';
import Coupon from '@/models/Coupon';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    console.log('Seeding: Starting...');
    await connectDB();
    console.log('Seeding: Database connected');

    console.log('Seeding: Clearing existing data...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    await Booking.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});
    await Address.deleteMany({});
    await Review.deleteMany({});
    await Coupon.deleteMany({});

    console.log('Seeding: Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = await User.insertMany([
      {
        email: 'admin@biharinath.com',
        password: hashedPassword,
        fullName: 'Admin User',
        phone: '+91 9876543210',
        role: 'admin',
        isActive: true
      },
      {
        email: 'rajesh.kumar@example.com',
        password: hashedPassword,
        fullName: 'Rajesh Kumar',
        phone: '+91 9876543211',
        role: 'customer',
        isActive: true
      },
      {
        email: 'priya.sharma@example.com',
        password: hashedPassword,
        fullName: 'Priya Sharma',
        phone: '+91 9876543212',
        role: 'customer',
        isActive: true
      },
      {
        email: 'amit.singh@example.com',
        password: hashedPassword,
        fullName: 'Amit Singh',
        phone: '+91 9876543213',
        role: 'customer',
        isActive: true
      }
    ]);

    console.log('Seeding: Creating categories...');
    const categories = await Category.insertMany([
      {
        name: 'Organic Vegetables',
        slug: 'organic-vegetables',
        description: 'Fresh organic vegetables from our farm',
        image: 'https://images.pexels.com/photos/1400172/pexels-photo-1400172.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Organic Fruits',
        slug: 'organic-fruits',
        description: 'Naturally ripened organic fruits',
        image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Grains & Pulses',
        slug: 'grains-pulses',
        description: 'Organic grains and pulses',
        image: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Dairy Products',
        slug: 'dairy-products',
        description: 'Fresh organic dairy from our farm',
        image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Spices & Herbs',
        slug: 'spices-herbs',
        description: 'Aromatic organic spices and herbs',
        image: 'https://images.pexels.com/photos/531446/pexels-photo-531446.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Honey & Jaggery',
        slug: 'honey-jaggery',
        description: 'Pure honey and organic jaggery',
        image: 'https://images.pexels.com/photos/4021867/pexels-photo-4021867.jpeg?auto=compress&cs=tinysrgb&w=800'
      }
    ]);

    console.log('Seeding: Creating products...');
    const products = await Product.insertMany([
      {
        categoryId: categories[0]._id,
        name: 'Organic Tomatoes',
        slug: 'organic-tomatoes',
        description: 'Fresh, juicy organic tomatoes grown without pesticides. Perfect for salads and cooking.',
        price: 60,
        compareAtPrice: 80,
        images: ['https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=800'],
        stockQuantity: 100,
        sku: 'VEG-TOM-001',
        isFeatured: true,
        isActive: true
      },
      {
        categoryId: categories[0]._id,
        name: 'Organic Spinach',
        slug: 'organic-spinach',
        description: 'Nutrient-rich organic spinach, freshly harvested from our farm.',
        price: 40,
        compareAtPrice: 55,
        images: ['https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=800'],
        stockQuantity: 80,
        sku: 'VEG-SPI-001',
        isFeatured: true,
        isActive: true
      },
      {
        categoryId: categories[0]._id,
        name: 'Organic Carrots',
        slug: 'organic-carrots',
        description: 'Sweet and crunchy organic carrots, rich in beta-carotene.',
        price: 50,
        images: ['https://images.pexels.com/photos/3650647/pexels-photo-3650647.jpeg?auto=compress&cs=tinysrgb&w=800'],
        stockQuantity: 120,
        sku: 'VEG-CAR-001',
        isFeatured: false,
        isActive: true
      },
      {
        categoryId: categories[1]._id,
        name: 'Organic Mangoes',
        slug: 'organic-mangoes',
        description: 'Naturally ripened organic Alphonso mangoes, the king of fruits.',
        price: 180,
        compareAtPrice: 250,
        images: ['https://images.pexels.com/photos/2294471/pexels-photo-2294471.jpeg?auto=compress&cs=tinysrgb&w=800'],
        stockQuantity: 50,
        sku: 'FRU-MAN-001',
        isFeatured: true,
        isActive: true
      },
      {
        categoryId: categories[1]._id,
        name: 'Organic Bananas',
        slug: 'organic-bananas',
        description: 'Fresh organic bananas, perfect for a healthy snack.',
        price: 50,
        images: ['https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=800'],
        stockQuantity: 200,
        sku: 'FRU-BAN-001',
        isFeatured: false,
        isActive: true
      },
      {
        categoryId: categories[2]._id,
        name: 'Organic Brown Rice',
        slug: 'organic-brown-rice',
        description: 'Nutritious organic brown rice, high in fiber and minerals.',
        price: 120,
        compareAtPrice: 150,
        images: ['https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=800'],
        stockQuantity: 150,
        sku: 'GRA-RIC-001',
        isFeatured: true,
        isActive: true
      },
      {
        categoryId: categories[2]._id,
        name: 'Organic Moong Dal',
        slug: 'organic-moong-dal',
        description: 'Premium quality organic moong dal, protein-rich and easy to digest.',
        price: 140,
        images: ['https://images.pexels.com/photos/4110255/pexels-photo-4110255.jpeg?auto=compress&cs=tinysrgb&w=800'],
        stockQuantity: 100,
        sku: 'GRA-MOO-001',
        isFeatured: false,
        isActive: true
      },
      {
        categoryId: categories[3]._id,
        name: 'Organic Cow Milk',
        slug: 'organic-cow-milk',
        description: 'Fresh organic cow milk from grass-fed cows.',
        price: 70,
        images: ['https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=800'],
        stockQuantity: 80,
        sku: 'DAI-MIL-001',
        unit: 'liter',
        isFeatured: true,
        isActive: true
      },
      {
        categoryId: categories[3]._id,
        name: 'Organic Ghee',
        slug: 'organic-ghee',
        description: 'Pure A2 organic ghee made from cow milk using traditional methods.',
        price: 650,
        compareAtPrice: 800,
        images: ['https://images.pexels.com/photos/4551832/pexels-photo-4551832.jpeg?auto=compress&cs=tinysrgb&w=800'],
        stockQuantity: 40,
        sku: 'DAI-GHE-001',
        unit: 'liter',
        isFeatured: true,
        isActive: true
      },
      {
        categoryId: categories[4]._id,
        name: 'Organic Turmeric Powder',
        slug: 'organic-turmeric-powder',
        description: 'Pure organic turmeric powder with high curcumin content.',
        price: 200,
        images: ['https://images.pexels.com/photos/531446/pexels-photo-531446.jpeg?auto=compress&cs=tinysrgb&w=800'],
        stockQuantity: 60,
        sku: 'SPI-TUR-001',
        isFeatured: false,
        isActive: true
      },
      {
        categoryId: categories[5]._id,
        name: 'Pure Organic Honey',
        slug: 'pure-organic-honey',
        description: 'Raw, unprocessed organic honey from our own bee farms.',
        price: 450,
        compareAtPrice: 550,
        images: ['https://images.pexels.com/photos/4021867/pexels-photo-4021867.jpeg?auto=compress&cs=tinysrgb&w=800'],
        stockQuantity: 70,
        sku: 'HON-HON-001',
        unit: 'liter',
        isFeatured: true,
        isActive: true
      },
      {
        categoryId: categories[5]._id,
        name: 'Organic Jaggery',
        slug: 'organic-jaggery',
        description: 'Natural organic jaggery made from sugarcane without chemicals.',
        price: 80,
        images: ['https://images.pexels.com/photos/4022090/pexels-photo-4022090.jpeg?auto=compress&cs=tinysrgb&w=800'],
        stockQuantity: 150,
        sku: 'HON-JAG-001',
        isFeatured: false,
        isActive: true
      }
    ]);

    console.log('Seeding: Creating addresses...');
    const addresses = await Address.insertMany([
      {
        userId: users[1]._id,
        fullName: 'Rajesh Kumar',
        phone: '+91 9876543211',
        addressLine1: '123, MG Road',
        addressLine2: 'Near City Mall',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
        isDefault: true,
        type: 'shipping'
      },
      {
        userId: users[2]._id,
        fullName: 'Priya Sharma',
        phone: '+91 9876543212',
        addressLine1: '456, Sector 15',
        addressLine2: 'Apartment 3B',
        city: 'Pune',
        state: 'Maharashtra',
        postalCode: '411001',
        country: 'India',
        isDefault: true,
        type: 'shipping'
      }
    ]);

    console.log('Seeding: Creating bookings...');
    const bookings = await Booking.insertMany([
      {
        userId: users[1]._id,
        bookingNumber: 'VISIT' + Date.now(),
        fullName: 'Rajesh Kumar',
        email: 'rajesh.kumar@example.com',
        phone: '+91 9876543211',
        preferredDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        preferredTimeSlot: 'morning',
        numberOfGuests: 4,
        notes: 'Interested in learning about organic farming practices',
        status: 'pending'
      },
      {
        userId: users[2]._id,
        bookingNumber: 'VISIT' + (Date.now() + 1),
        fullName: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        phone: '+91 9876543212',
        preferredDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        preferredTimeSlot: 'afternoon',
        numberOfGuests: 2,
        notes: 'Want to see the dairy farm',
        status: 'approved'
      },
      {
        bookingNumber: 'VISIT' + (Date.now() + 2),
        fullName: 'Suresh Patel',
        email: 'suresh.patel@example.com',
        phone: '+91 9876543214',
        preferredDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        preferredTimeSlot: 'evening',
        numberOfGuests: 6,
        notes: 'School field trip for children',
        status: 'pending'
      }
    ]);

    console.log('Seeding: Creating coupons...');
    const coupons = await Coupon.insertMany([
      {
        code: 'WELCOME10',
        description: 'Welcome discount for new customers',
        discountType: 'percentage',
        discountValue: 10,
        minPurchaseAmount: 500,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        usageCount: 0,
        isActive: true
      },
      {
        code: 'ORGANIC20',
        description: '20% off on all organic products',
        discountType: 'percentage',
        discountValue: 20,
        minPurchaseAmount: 1000,
        maxDiscountAmount: 500,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        usageLimit: 100,
        usageCount: 15,
        isActive: true
      },
      {
        code: 'FLAT100',
        description: 'Flat Rs. 100 off',
        discountType: 'fixed',
        discountValue: 100,
        minPurchaseAmount: 800,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        usageCount: 0,
        isActive: true
      }
    ]);

    console.log('Seeding: Creating orders...');
    const orders = await Order.insertMany([
      {
        userId: users[1]._id,
        orderNumber: 'ORD' + Date.now(),
        items: [
          {
            productId: products[0]._id,
            productName: products[0].name,
            productImage: products[0].images[0],
            unitPrice: products[0].price,
            quantity: 2,
            totalPrice: products[0].price * 2
          },
          {
            productId: products[3]._id,
            productName: products[3].name,
            productImage: products[3].images[0],
            unitPrice: products[3].price,
            quantity: 1,
            totalPrice: products[3].price
          }
        ],
        shippingAddress: {
          fullName: 'Rajesh Kumar',
          phone: '+91 9876543211',
          addressLine1: '123, MG Road',
          addressLine2: 'Near City Mall',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India'
        },
        subtotal: 300,
        shippingAmount: 50,
        taxAmount: 35,
        discountAmount: 0,
        totalAmount: 385,
        paymentMethod: 'COD',
        paymentStatus: 'pending',
        status: 'processing'
      },
      {
        userId: users[2]._id,
        orderNumber: 'ORD' + (Date.now() + 1),
        items: [
          {
            productId: products[10]._id,
            productName: products[10].name,
            productImage: products[10].images[0],
            unitPrice: products[10].price,
            quantity: 1,
            totalPrice: products[10].price
          }
        ],
        shippingAddress: {
          fullName: 'Priya Sharma',
          phone: '+91 9876543212',
          addressLine1: '456, Sector 15',
          addressLine2: 'Apartment 3B',
          city: 'Pune',
          state: 'Maharashtra',
          postalCode: '411001',
          country: 'India'
        },
        subtotal: 450,
        shippingAmount: 0,
        taxAmount: 45,
        discountAmount: 45,
        couponCode: 'WELCOME10',
        totalAmount: 450,
        paymentMethod: 'Online',
        paymentStatus: 'completed',
        paymentId: 'pay_' + Date.now(),
        status: 'delivered'
      }
    ]);

    console.log('Seeding: Creating reviews...');
    const reviews = await Review.insertMany([
      {
        userId: users[2]._id,
        productId: products[10]._id,
        orderId: orders[1]._id,
        rating: 5,
        title: 'Excellent Quality!',
        comment: 'The honey is pure and delicious. Worth every penny!',
        isVerifiedPurchase: true,
        isApproved: true,
        helpfulCount: 12
      },
      {
        userId: users[1]._id,
        productId: products[0]._id,
        rating: 4,
        title: 'Fresh and Organic',
        comment: 'Good quality tomatoes. Very fresh and tasty.',
        isVerifiedPurchase: false,
        isApproved: true,
        helpfulCount: 5
      },
      {
        userId: users[3]._id,
        productId: products[8]._id,
        rating: 5,
        title: 'Best Ghee Ever!',
        comment: 'Traditional taste and aroma. This is authentic A2 ghee.',
        isVerifiedPurchase: false,
        isApproved: true,
        helpfulCount: 18
      }
    ]);

    console.log('Seeding: Creating carts...');
    const carts = await Cart.insertMany([
      {
        userId: users[3]._id,
        items: [
          {
            productId: products[5]._id.toString(),
            quantity: 2,
            price: products[5].price
          },
          {
            productId: products[7]._id.toString(),
            quantity: 1,
            price: products[7].price
          }
        ]
      }
    ]);

    console.log('Seeding: Complete!');
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with sample data',
      data: {
        users: users.length,
        categories: categories.length,
        products: products.length,
        addresses: addresses.length,
        bookings: bookings.length,
        coupons: coupons.length,
        orders: orders.length,
        reviews: reviews.length,
        carts: carts.length
      },
      credentials: {
        admin: { email: 'admin@biharinath.com', password: 'password123' },
        customer: { email: 'rajesh.kumar@example.com', password: 'password123' }
      }
    });
  } catch (error: any) {
    console.error('Seeding error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({
      success: false,
      error: 'Failed to seed database',
      details: error.message
    }, { status: 500 });
  }
}
