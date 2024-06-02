async function signup(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User created:', user);

    // Optionally add user data to Firestore (replace with your schema)
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      // Add other user profile details here
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    // Handle errors appropriately (e.g., display error messages to the user)
  }
}
