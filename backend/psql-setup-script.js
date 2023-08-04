const { sequelize } = require('./db/models');
// checks to see if the schema name you have defined as an environment variable is already present in the database. CREATE SCHEMA IF NOT EXISTS <your-schema-name>
sequelize.showAllSchemas({ logging: false }).then(async (data) => {
  if (!data.includes(process.env.SCHEMA)) {
    await sequelize.createSchema(process.env.SCHEMA);
  }
});

// remember to add a build command to the package.json to run the setup script that you just created in deployment phase