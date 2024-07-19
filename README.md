# roziroti

# Install server-side dependencies
cd server
npm install

# Install client-side dependencies
cd ../client
npm install

# Register first for new user
route /register
## Database Configuration

This project uses MongoDB as its database. Follow the steps below to set up the database:

1. **MongoDB Account:** Create a MongoDB account and set up a new cluster.

2. **Database URL:** Obtain the MongoDB connection URL from your MongoDB dashboard.

3. **Environment Variable:**

    - Create a new file named `.env` in the project root.

    - Add the following line to the `.env` file, replacing `<YOUR_MONGODB_URL>` with your actual MongoDB connection URL:

        ```env
        MONGOURL=<YOUR_MONGOURL>
        ```

    - Save the `.env` file.

Now, your project is configured to use your MongoDB database. Make sure to keep your `.env` file secure and never share it publicly.
