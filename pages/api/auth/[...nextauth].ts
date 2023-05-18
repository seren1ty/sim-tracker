import Driver from '@/models/driver.model';
import dbConnect from '@/utils/db-connect';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    // Login check to see if user has previously signed up / is authorized
    async signIn({ user, account, profile, email, credentials }) {
      try {
        await dbConnect();
        const driverExists = await Driver.exists({ email: user.email });

        if (driverExists) {
          return true;
        } else {
          console.error('User not authorized [New]: ' + user.email);
          return false;
          /* Do not support New Users at the moment
            const name = given_name;

            const newDriver = new Driver({ name, email });

            newDriver.save()
                .then(driver => res.json(driver.name))
                .catch(err => res.status(400).json('Error [Add New Driver]: ' + err));
          */
        }
      } catch (err) {
        console.error(
          'User not authorized [Error]: ' + user.email + ', Error: ' + err
        );
        // Display a default error message
        return false;
        // TODO return a URL to redirect to:
        // return '/unauthorized'
      }
    },
  },
});
