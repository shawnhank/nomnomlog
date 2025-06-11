require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

async function migrateUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users that don't have fullName but have fname or lname
    const users = await User.find({
      fullName: { $exists: false },
      $or: [
        { fname: { $exists: true, $ne: null } },
        { lname: { $exists: true, $ne: null } }
      ]
    });

    console.log(`Found ${users.length} users to migrate`);

    // Update each user
    for (const user of users) {
      // Combine fname and lname into fullName
      user.fullName = [user.fname, user.lname].filter(Boolean).join(' ');
      
      // If fullName is empty, use name or email as fallback
      if (!user.fullName) {
        user.fullName = user.name || user.email;
      }
      
      await user.save();
      console.log(`Migrated user: ${user.email} -> fullName: "${user.fullName}"`);
    }

    console.log('Migration completed successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Migration failed:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

migrateUsers();