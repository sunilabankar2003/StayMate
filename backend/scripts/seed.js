const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../src/models/User');
const Property = require('../src/models/Property');
const MessService = require('../src/models/MessService');
const Review = require('../src/models/Review');
const Favorite = require('../src/models/Favorite');
const Conversation = require('../src/models/Conversation');
const Message = require('../src/models/Message');
const Report = require('../src/models/Report');
const ConnectionRequest = require('../src/models/ConnectionRequest');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/staymate_db';
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing StayMate database records...');
    await Promise.all([
      User.deleteMany(),
      Property.deleteMany(),
      MessService.deleteMany(),
      Review.deleteMany(),
      Favorite.deleteMany(),
      Conversation.deleteMany(),
      Message.deleteMany(),
      Report.deleteMany(),
      ConnectionRequest.deleteMany(),
    ]);

    console.log('Creating Users (Admin, Owners, Students)...');

    // 1. Admin
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@staymate.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '+91 98765 43210',
      occupation: 'Platform Administrator',
      bio: 'Administrator account for StayMate platform moderation and analytics.',
      isVerified: true,
    });

    // 2. Owners
    const owner1 = await User.create({
      name: 'Rajesh Sharma',
      email: 'owner1@staymate.com',
      password: 'Owner@123',
      role: 'owner',
      phone: '+91 98111 22334',
      occupation: 'Property Manager',
      bio: 'Managing clean, student-friendly PGs and flats near Tech Parks and Colleges in Bangalore for 8+ years.',
      isVerified: true,
    });

    const owner2 = await User.create({
      name: 'Sunita Rao',
      email: 'owner2@staymate.com',
      password: 'Owner@123',
      role: 'owner',
      phone: '+91 98222 33445',
      occupation: 'Real Estate Host',
      bio: 'Providing safe, comfortable shared accommodations for college students and working professionals.',
      isVerified: true,
    });

    // 3. Students
    const student1 = await User.create({
      name: 'Aarav Patel',
      email: 'student1@staymate.com',
      password: 'Student@123',
      role: 'student',
      phone: '+91 99001 12233',
      occupation: 'MCA Student',
      collegeOrCompany: 'PES University, Bangalore',
      bio: 'Final year MCA student looking for a quiet, organized flatmate. Early sleeper, tech enthusiast.',
      gender: 'male',
      budgetMin: 6000,
      budgetMax: 12000,
      preferredCity: 'Bangalore',
      preferredLocality: 'Koramangala',
      preferredAccommodationType: 'Flat',
      roommatePreferences: {
        cleanliness: 'very_clean',
        foodHabit: 'vegetarian',
        smoking: 'non_smoker',
        sleepSchedule: 'early_bird',
        studyWorkRoutine: 'quiet_studious',
        preferredGender: 'male',
        moveInDate: new Date('2026-11-01'),
      },
      isVerified: true,
    });

    const student2 = await User.create({
      name: 'Ananya Sen',
      email: 'student2@staymate.com',
      password: 'Student@123',
      role: 'student',
      phone: '+91 99002 23344',
      occupation: 'Software Engineer Trainee',
      collegeOrCompany: 'Infosys Bangalore',
      bio: 'Recently moved to Bangalore for software trainee job. Love reading, friendly and respectful of privacy.',
      gender: 'female',
      budgetMin: 7000,
      budgetMax: 14000,
      preferredCity: 'Bangalore',
      preferredLocality: 'HSR Layout',
      preferredAccommodationType: 'PG',
      roommatePreferences: {
        cleanliness: 'very_clean',
        foodHabit: 'non_vegetarian',
        smoking: 'non_smoker',
        sleepSchedule: 'flexible',
        studyWorkRoutine: 'moderate',
        preferredGender: 'female',
        moveInDate: new Date('2026-11-05'),
      },
      isVerified: true,
    });

    const student3 = await User.create({
      name: 'Rohan Verma',
      email: 'student3@staymate.com',
      password: 'Student@123',
      role: 'student',
      phone: '+91 99003 34455',
      occupation: 'B.Tech CS Student',
      collegeOrCompany: 'BMS College of Engineering',
      bio: 'Coding enthusiast looking for a flatmate near Koramangala or HSR. Clean and cooperative.',
      gender: 'male',
      budgetMin: 5000,
      budgetMax: 11000,
      preferredCity: 'Bangalore',
      preferredLocality: 'Koramangala',
      preferredAccommodationType: 'Flat',
      roommatePreferences: {
        cleanliness: 'very_clean',
        foodHabit: 'vegetarian',
        smoking: 'non_smoker',
        sleepSchedule: 'early_bird',
        studyWorkRoutine: 'quiet_studious',
        preferredGender: 'male',
        moveInDate: new Date('2026-11-01'),
      },
      isVerified: true,
    });

    const student4 = await User.create({
      name: 'Priya Nair',
      email: 'student4@staymate.com',
      password: 'Student@123',
      role: 'student',
      phone: '+91 99004 45566',
      occupation: 'UI/UX Design Intern',
      collegeOrCompany: 'Design Studio Bangalore',
      bio: 'Design student interning in Indiranagar. Looking for a neat space and good vibe roommate.',
      gender: 'female',
      budgetMin: 8000,
      budgetMax: 16000,
      preferredCity: 'Bangalore',
      preferredLocality: 'Indiranagar',
      preferredAccommodationType: 'PG',
      roommatePreferences: {
        cleanliness: 'moderate',
        foodHabit: 'any',
        smoking: 'non_smoker',
        sleepSchedule: 'night_owl',
        studyWorkRoutine: 'moderate',
        preferredGender: 'female',
        moveInDate: new Date('2026-11-10'),
      },
      isVerified: true,
    });

    console.log('Creating Properties...');

    const property1 = await Property.create({
      owner: owner1._id,
      title: 'Green Meadows Luxury PG for Men & Students',
      description: 'Fully furnished premium executive PG located in the heart of Koramangala. Walking distance from major IT companies, bus stop, and top cafes. Includes high-speed Wi-Fi (300 Mbps), 3 times home-style food, power backup, daily housekeeping, and individual study desks.',
      propertyType: 'PG',
      monthlyRent: 8500,
      securityDeposit: 15000,
      address: '45/2, 5th Block, near Jyoti Nivas College Road',
      locality: 'Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560095',
      coordinates: { lat: 12.9352, lng: 77.6245 },
      availableRooms: 3,
      totalRooms: 10,
      occupancyType: 'Double',
      genderPreference: 'Male',
      amenities: ['WiFi', 'AC', 'Geyser', 'RO Water', 'Power Backup', 'Laundry', 'CCTV', 'Attached Washroom', 'Housekeeping', 'Refrigerators'],
      foodAvailability: true,
      foodType: 'Both',
      mealsIncluded: ['Breakfast', 'Lunch', 'Dinner'],
      images: [
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
      ],
      verificationStatus: 'approved',
      isAvailable: true,
      averageRating: 4.8,
      reviewCount: 3,
    });

    const property2 = await Property.create({
      owner: owner2._id,
      title: 'Serene Heights 2BHK Shared Flat for Girls',
      description: 'Spacious and sunlit 2BHK flat in HSR Layout Sector 2. Semi-furnished with modular kitchen, wardrobes, sofa, balcony garden, and gated society security. Looking for working women or students who maintain cleanliness.',
      propertyType: 'Flat',
      monthlyRent: 11000,
      securityDeposit: 25000,
      address: 'Plot 108, 14th Main, Sector 2',
      locality: 'HSR Layout',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560102',
      coordinates: { lat: 12.9116, lng: 77.6389 },
      availableRooms: 1,
      totalRooms: 2,
      occupancyType: 'Single',
      genderPreference: 'Female',
      amenities: ['WiFi', 'Geyser', 'Power Backup', 'Parking', 'Security', 'Attached Washroom', 'Modular Kitchen', 'Washing Machine'],
      foodAvailability: false,
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
      ],
      verificationStatus: 'approved',
      isAvailable: true,
      averageRating: 4.5,
      reviewCount: 2,
    });

    const property3 = await Property.create({
      owner: owner1._id,
      title: 'St. Jude Youth Hostel & Student Residence',
      description: 'Affordable, secure student hostel located close to Indiranagar Metro Station. Ideal for college students with quiet study areas, library access, 24/7 warden, fingerprint biometric entry, and healthy north and south Indian meals.',
      propertyType: 'Hostel',
      monthlyRent: 6500,
      securityDeposit: 10000,
      address: '22/B, 100 Feet Road, HAL 2nd Stage',
      locality: 'Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038',
      coordinates: { lat: 12.9784, lng: 77.6408 },
      availableRooms: 5,
      totalRooms: 20,
      occupancyType: 'Triple',
      genderPreference: 'Any',
      amenities: ['WiFi', 'RO Water', 'Security', 'CCTV', 'Housekeeping', 'Study Hall', 'Power Backup'],
      foodAvailability: true,
      foodType: 'Veg',
      mealsIncluded: ['Breakfast', 'Dinner'],
      images: [
        'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1540518614846-7ede433c4ef3?auto=format&fit=crop&w=800&q=80',
      ],
      verificationStatus: 'approved',
      isAvailable: true,
      averageRating: 4.2,
      reviewCount: 1,
    });

    const property4 = await Property.create({
      owner: owner2._id,
      title: 'Elite Studio Apartment - Whitefield IT Hub',
      description: 'Chic 1RK studio apartment ideal for IT professionals working in ITPL or Prestige Shantiniketan. Includes king bed, kitchenette, smart TV, high speed fiber optic broadband, and covered bike parking.',
      propertyType: 'Flat',
      monthlyRent: 13500,
      securityDeposit: 30000,
      address: 'Tower C, Hope Farm Junction',
      locality: 'Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560066',
      coordinates: { lat: 12.9833, lng: 77.7500 },
      availableRooms: 1,
      totalRooms: 1,
      occupancyType: 'Single',
      genderPreference: 'Any',
      amenities: ['WiFi', 'AC', 'Geyser', 'RO Water', 'Parking', 'Security', 'CCTV', 'TV', 'Refrigerator'],
      foodAvailability: false,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80',
      ],
      verificationStatus: 'approved',
      isAvailable: true,
      averageRating: 4.9,
      reviewCount: 1,
    });

    const property5 = await Property.create({
      owner: owner1._id,
      title: 'New Sunrise PG for Women - Viman Nagar Pune',
      description: 'Newly constructed girls PG near Symbiosis International University. Safe residential area with full biometric security, hygienic 3-time meals, RO water on every floor, attached balconies, and study tables.',
      propertyType: 'PG',
      monthlyRent: 7500,
      securityDeposit: 12000,
      address: 'Lane 4, Near Dutta Mandir Chowk',
      locality: 'Viman Nagar',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411014',
      coordinates: { lat: 18.5679, lng: 73.9143 },
      availableRooms: 4,
      totalRooms: 12,
      occupancyType: 'Double',
      genderPreference: 'Female',
      amenities: ['WiFi', 'Geyser', 'RO Water', 'Power Backup', 'Laundry', 'Security', 'CCTV', 'Attached Washroom', 'Housekeeping'],
      foodAvailability: true,
      foodType: 'Both',
      mealsIncluded: ['Breakfast', 'Lunch', 'Dinner'],
      images: [
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      ],
      verificationStatus: 'approved',
      isAvailable: true,
      averageRating: 4.6,
      reviewCount: 1,
    });

    const propertyPending = await Property.create({
      owner: owner2._id,
      title: 'Shivaji Nagar Modern Co-living Space',
      description: 'Contemporary co-living space with gaming lounge, high speed Wi-Fi, and terrace gym. Newly registered property awaiting administrator review and site verification.',
      propertyType: 'PG',
      monthlyRent: 9000,
      securityDeposit: 18000,
      address: '77, FC Road, near Fergusson College',
      locality: 'Shivaji Nagar',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411005',
      coordinates: { lat: 18.5314, lng: 73.8446 },
      availableRooms: 2,
      totalRooms: 8,
      occupancyType: 'Single',
      genderPreference: 'Any',
      amenities: ['WiFi', 'AC', 'Geyser', 'RO Water', 'Power Backup', 'Security', 'Gym', 'Laundry'],
      foodAvailability: true,
      foodType: 'Veg',
      mealsIncluded: ['Breakfast', 'Dinner'],
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      ],
      verificationStatus: 'pending',
      isAvailable: true,
      averageRating: 0,
      reviewCount: 0,
    });

    console.log('Creating Mess and Tiffin Services...');

    const mess1 = await MessService.create({
      name: 'Annapurna Homestyle Veg & Jain Mess',
      description: 'Authentic pure vegetarian and Jain home-cooked thali. Prepared with minimal oil and fresh vegetables every single day. Special sunday feast with sweets.',
      address: 'Shop 12, 7th Cross, 4th Block',
      locality: 'Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
      coordinates: { lat: 12.9345, lng: 77.6256 },
      contactNumber: '+91 98450 11223',
      mealTypes: ['Lunch', 'Dinner'],
      foodType: 'Veg',
      monthlyPrice: 3200,
      dailyPrice: 120,
      mealTimings: {
        breakfast: 'Not Available',
        lunch: '12:00 PM - 3:00 PM',
        dinner: '7:30 PM - 10:30 PM',
      },
      operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      menu: {
        monday: 'Dal Fry, Mix Veg, Phulka (4 pcs), Jeera Rice, Salad',
        tuesday: 'Kadai Paneer, Roti, Dal Tadka, Steamed Rice, Buttermilk',
        wednesday: 'Rajma Masala, Steamed Rice, Roti, Seasonal Sabzi, Pickle',
        thursday: 'Aloo Gobi, Gujarati Kadhi, Khichdi, Phulka, Papad',
        friday: 'Dal Makhani, Matar Paneer, Steamed Rice, Roti, Salad',
        saturday: 'Chole Masala, Poori/Bhature, Veg Pulao, Boondi Raita',
        sunday: 'Special Royal Thali: Shahi Paneer, Pulao, Gulab Jamun, Dal, Roti',
      },
      images: [
        'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      ],
      isVerified: true,
      isAvailable: true,
      averageRating: 4.8,
      reviewCount: 15,
      createdBy: admin._id,
    });

    const mess2 = await MessService.create({
      name: 'Spice Route Kitchen & Tiffin Hub',
      description: 'Delivering delicious North & South Indian meals directly to your PG or flat doorstep. Both vegetarian and non-vegetarian menus with egg, chicken, and paneer options.',
      address: '24th Main Road, Sector 1',
      locality: 'HSR Layout',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560102',
      coordinates: { lat: 12.9128, lng: 77.6432 },
      contactNumber: '+91 98450 99887',
      mealTypes: ['Breakfast', 'Lunch', 'Dinner'],
      foodType: 'Both',
      monthlyPrice: 4200,
      dailyPrice: 160,
      mealTimings: {
        breakfast: '7:30 AM - 9:30 AM',
        lunch: '12:30 PM - 2:30 PM',
        dinner: '8:00 PM - 10:30 PM',
      },
      operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      menu: {
        monday: 'Idli Sambar / Poha, Dal Tadka, Aloo Shimla Mirch, Rice, Roti',
        tuesday: 'Egg Curry / Paneer Bhurji, Steamed Rice, Roti, Salad',
        wednesday: 'Chicken Masala / Kadai Mushroom, Jeera Rice, Tawa Roti',
        thursday: 'Dal Palak, Bhindi Masala, Steamed Rice, Roti, Curd',
        friday: 'Butter Chicken / Paneer Butter Masala, Roti, Rice, Sweet',
        saturday: 'Hyderabadi Chicken/Veg Biryani, Mirchi ka Salan, Raita',
        sunday: 'Closed',
      },
      images: [
        'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
      ],
      isVerified: true,
      isAvailable: true,
      averageRating: 4.6,
      reviewCount: 22,
      createdBy: admin._id,
    });

    const mess3 = await MessService.create({
      name: 'Punekar Classic Student Mess',
      description: 'Pithla Bhakri, Chapati-Bhaji, and delicious Maharashtrian & North Indian meal boxes designed especially for college students with budget-friendly subscription plans.',
      address: 'Near Goodluck Cafe, FC Road',
      locality: 'Shivaji Nagar',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411004',
      coordinates: { lat: 18.5284, lng: 73.8415 },
      contactNumber: '+91 97654 32190',
      mealTypes: ['Lunch', 'Dinner'],
      foodType: 'Veg',
      monthlyPrice: 2800,
      dailyPrice: 100,
      mealTimings: {
        breakfast: 'Not Available',
        lunch: '11:30 AM - 3:00 PM',
        dinner: '7:00 PM - 10:00 PM',
      },
      operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      images: [
        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      ],
      isVerified: true,
      isAvailable: true,
      averageRating: 4.5,
      reviewCount: 8,
      createdBy: admin._id,
    });

    console.log('Creating Reviews...');

    await Review.create({
      property: property1._id,
      user: student1._id,
      rating: 5,
      comment: 'Excellent PG! Super fast Wi-Fi, clean washrooms, and the food tastes just like home. Mr. Rajesh is very prompt with any maintenance requests.',
    });

    await Review.create({
      property: property1._id,
      user: student3._id,
      rating: 5,
      comment: 'Very quiet study atmosphere. Great location near Koramangala 5th block. Highly recommended for students!',
    });

    await Review.create({
      property: property2._id,
      user: student2._id,
      rating: 5,
      comment: 'Sunita ma’am is extremely kind and cooperative. The flat is well ventilated and safe for girls. Loved staying here.',
    });

    console.log('Creating Favorites...');

    await Favorite.create({
      user: student1._id,
      property: property1._id,
    });
    await Favorite.create({
      user: student1._id,
      property: property3._id,
    });
    await Favorite.create({
      user: student2._id,
      property: property2._id,
    });

    console.log('Creating Connection Requests & Conversations...');

    // Student 1 connects with Student 3
    const conn1 = await ConnectionRequest.create({
      sender: student1._id,
      receiver: student3._id,
      status: 'accepted',
      message: 'Hi Rohan! Saw your profile and your preferences for quiet study and Koramangala flat align 92% with mine. Would love to team up!',
    });

    const conversation1 = await Conversation.create({
      participants: [student1._id, student3._id],
      lastMessageAt: new Date(),
    });

    const msg1 = await Message.create({
      conversation: conversation1._id,
      sender: student1._id,
      receiver: student3._id,
      content: 'Hey Rohan! Are you still looking for a flat in Koramangala for next month?',
    });

    const msg2 = await Message.create({
      conversation: conversation1._id,
      sender: student3._id,
      receiver: student1._id,
      content: 'Hey Aarav! Yes, absolutely. I visited a 2BHK near 5th Block yesterday. Rent is around 20k total. We could split it 10k each!',
    });

    conversation1.lastMessage = msg2._id;
    await conversation1.save();

    // Student 1 inquires with Owner 1 about Property 1
    const conversationOwner = await Conversation.create({
      participants: [student1._id, owner1._id],
      property: property1._id,
      lastMessageAt: new Date(),
    });

    const msgOwner1 = await Message.create({
      conversation: conversationOwner._id,
      sender: student1._id,
      receiver: owner1._id,
      content: 'Hello Rajesh sir, is the double sharing room in Green Meadows PG available for move-in from Nov 1st?',
    });

    const msgOwner2 = await Message.create({
      conversation: conversationOwner._id,
      sender: owner1._id,
      receiver: student1._id,
      content: 'Hello Aarav, yes it is available! You can visit tomorrow between 11 AM to 6 PM to inspect the room.',
    });

    conversationOwner.lastMessage = msgOwner2._id;
    await conversationOwner.save();

    console.log('Creating Sample Moderation Report...');

    await Report.create({
      reporter: student2._id,
      reportedItemType: 'Property',
      reportedItemId: property3._id,
      reason: 'Incorrect pricing details listed',
      details: 'Old monthly fee was listed on external flyer as 6000, please clarify.',
      status: 'pending',
    });

    console.log('========================================================');
    console.log(' StayMate Database Seeded Successfully!');
    console.log(' Demo Accounts Created:');
    console.log('   Admin:    admin@staymate.com    / Admin@123');
    console.log('   Owner 1:  owner1@staymate.com   / Owner@123');
    console.log('   Owner 2:  owner2@staymate.com   / Owner@123');
    console.log('   Student 1: student1@staymate.com / Student@123');
    console.log('   Student 2: student2@staymate.com / Student@123');
    console.log('   Student 3: student3@staymate.com / Student@123');
    console.log('   Student 4: student4@staymate.com / Student@123');
    console.log('========================================================');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
