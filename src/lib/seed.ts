import { createTestUser } from './seed-users';

export async function seedDatabase() {
  try {
    console.log('Creating test user...');
    await createTestUser();
    console.log('Test user created successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}