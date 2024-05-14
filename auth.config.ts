import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  // https://authjs.dev/reference/nextjs#pages
  pages: {
    signIn: '/login',
  },
  debug: true,
  // for capture an event during one of these shit
  events: {
    signIn({user}){
      console.log(`user ${user.name} telah login`)
    },
    signOut(){ 
      console.log('user telah logout !!')   
    }
  },
  // Callbacks allow you to implement access controls without a database or to integrate with external databases or APIs.
  // https://authjs.dev/reference/nextjs#callbacks
  callbacks: {
    // when auth method is called, this method is handle that request
    authorized({ auth, request: { nextUrl } }) {
      console.log('from auth.config: ',auth, nextUrl);
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;