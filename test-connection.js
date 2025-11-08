// test-connection.js
import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://phanisrikarkusumba:sinema123@cluster0.vuqmhtp.mongodb.net/sinema-reborn';

async function testConnection() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({ name: String });
    const TestModel = mongoose.model('Test', testSchema);
    
    const testDoc = new TestModel({ name: 'Connection Test' });
    await testDoc.save();
    
    console.log('✅ Test document created successfully!');
    console.log('✅ Database "sinema-reborn" created automatically!');
    
    // Clean up
    await TestModel.deleteOne({ name: 'Connection Test' });
    await mongoose.connection.close();
    console.log('✅ Connection test completed!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();