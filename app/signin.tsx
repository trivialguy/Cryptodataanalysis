"use client"

import { signIn, signOut, useSession } from 'next-auth/react';

const SignIn = () => {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div>
        <p>Signed in as {session.user?.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Sign In</h1>
      <button onClick={() => signIn('google')}>Sign in with Google</button>
    </div>
  );
};

export default SignIn;