import Driver from '@/models/driver.model';
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
    async jwt({ token }) {
      console.dir(token, { depth: null });

      await Driver.findOne({ email: token.email })
        .then((driver) => {
          if (driver) {
            token = {
              ...token,
              _id: driver._id,
              name: driver.name,
              isAdmin: driver.isAdmin,
            };
          } else {
            console.log('Error [Driver Not Setup]: ' + token.email);
            /* Do not support New Users at the moment
                const newDriver = new Driver({ name, email });

                newDriver.save()
                    .then(driver => res.json(driver.name))
                    .catch(err => res.status(400).json('Error [Add New Driver]: ' + err)); */
          }
        })
        .catch((err) => {
          console.log('Error [Get Driver]: ' + err);
        });

      return token;
    },
  },
});
