import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

// Only use this in development environment
export const createTestAccounts = async () => {
  if (import.meta.env.DEV) {
    try {
      // Test accounts with different roles
      const testUsers = [
        { 
          email: 'admin@rescue.com', 
          password: 'test123', 
          displayName: 'Admin User',
          role: 'admin'
        },
        { 
          email: 'agency@rescue.com', 
          password: 'test123', 
          displayName: 'Agency User',
          role: 'agency'
        },
        { 
          email: 'user@rescue.com', 
          password: 'test123', 
          displayName: 'Regular User',
          role: 'individual'
        }
      ];

      for (const user of testUsers) {
        try {
          // Create the user in Firebase Auth
          const userCredential = await createUserWithEmailAndPassword(
            auth, 
            user.email, 
            user.password
          );
          
          // Update profile with display name
          await updateProfile(userCredential.user, {
            displayName: user.displayName
          });
          
          // Store additional user data in Firestore
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            email: user.email,
            displayName: user.displayName,
            role: user.role,
            createdAt: new Date(),
            isTestAccount: true
          });
          
          console.log(`Created test user: ${user.email} (${user.role})`);
        } catch (error) {
          // Skip if user already exists (Firebase will throw an error)
          if (error.code === 'auth/email-already-in-use') {
            console.log(`Test user already exists: ${user.email}`);
          } else {
            console.error(`Error creating test user ${user.email}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Error creating test accounts:', error);
    }
  }
};