const { createTables } = require('../config/dynamodb');

async function setupTables() {
  console.log('🚀 Setting up DynamoDB tables...');
  
  try {
    await createTables();
    console.log('✅ DynamoDB tables setup completed successfully!');
    console.log('📊 Tables created:');
    console.log('   - ipgrok-test-results');
    console.log('   - ipgrok-analytics');
    console.log('');
    console.log('🎉 Your backend is ready to use!');
  } catch (error) {
    console.error('❌ Error setting up tables:', error);
    process.exit(1);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupTables();
}

module.exports = setupTables; 