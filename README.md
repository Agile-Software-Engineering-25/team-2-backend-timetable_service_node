# Teams 2 Backend

Hier kann irgendwer was reinschreiben
## Installation

Download [node](https://nodejs.org/en/download) to run app. 

Before the first start you have to do npm install.

Start command: npm run script start or node app.js

## Open API
Open API Docs can be seen at http://localhost:4000/api/v1/docs/#/Schedule/get_api_v1_schedule when NODE_ENV=dev.

## Sample .env File 
You have to create a .env file in the directory to run the api
```env
NODE_ENV = dev
LOG_LEVEL = info

TEST_PORT = 4000
PROD_PORT = 3000
APP_DIR = C:\Users\Azb-dSt\Desktop\team-2-backend-timetable_service_node


DB_PASSWORD = 
DB_USER = 
AUTH_DB_NAME = 
DB_NAME = Prod
DB_TEST = Test
ACCESS_TOKEN_LIFETIME=3600       # Access-Token-Lebensdauer, z. B. 15 Minuten
REFRESH_TOKEN_LIFETIME=360000    # Refresh-Token-Lebensdauer, z. B. 7 Tage
```

## Contributing
Schreib was rein oder lass sein

## Usage/Examples

DB Querys are made by importing the query function from the getCon module in helpers.
It is essential that we create ids as randomUUIDs since it is not a default datatype of our test DB SqlLite. When we create a table we definde the ids as text so we just have to change date type when migrating to PostgresDB for Prod. 
When working with TestDB the placeholders in the query are ?. These will be replaced by $1, $2 ... $n etc for Prod. 
The UUIDs are created with the randomUUID function from crypto package.

```javascript
    
    await query(`
        CREATE TABLE IF NOT EXISTS users (
                  id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `)

    const id = randomUUID()
    // Insert User 
    await query(
        "INSERT INTO users (id, name, email) VALUES (?, ?, ?)", // SQLite-Syntax
        [id, "Alice", "alice@example.com"]
    ).catch(() => { console.log("exists") }) // Catch Error if query goes wrong. 
    
    await query(
      "INSERT INTO users (name, email) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING",
      ["Alice", "alice@example.com"]
    )
    // Users auslesen
    const users = await query("SELECT * FROM users")
   
```

# Working with Roles - Endpoint creation
The string transmittet to require role, is the required role. I checks in the JWT, if the user has this role. If yes, the code will be executed. If no it will be rejected with code 403.
All Endpoint should be created as in the following example.
```javascript
//Will be rejected
router.get("/", requireRole("view-prfffofile"), (req, res) => {
  //Will not be executed
  //Will not be executed
  //Will not be executed

});
//Will work
router.get("/", requireRole("view-profile"), (req, res) => {
  //Some Code here
  //Some Code here
  //Some Code here

});
```

## Testing 

To get test JWT-Tokens you can call: http://localhost:4000/api/v1/login in Browser and copy it to e.g. Postmann. For API Requests you have to add Baerer Token. 
