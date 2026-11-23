INVENTORY MANAGEMENT SYSTEM - BEGINNER VERSION

Technology used:
- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv

HOW TO RUN:

1. Install Node.js and MongoDB.
2. Open this folder in VS Code.
3. Open the terminal.
4. Run: npm install
5. Make a copy of .env.example and name it .env
6. Start MongoDB.
7. Run: npm start
8. Open: http://localhost:5000

API ROUTES:

POST   /api/products              Add a product
GET    /api/products              See all products
GET    /api/products/:id          See one product
PUT    /api/products/:id          Update a product
PATCH  /api/products/:id/stock    Add or remove stock
DELETE /api/products/:id          Delete a product
GET    /api/products/low-stock    See products with low stock
GET    /api/products/summary      See category-wise report

SAMPLE PRODUCT JSON:

{
  "name": "Gel Pen Pack of 15",
  "sku": "STNY-PN-713",
  "category": "Stationery",
  "price": 120,
  "quantity": 48,
  "reorderLevel": 20,
  "supplier": "Cello Pens"
}

STOCK UPDATE JSON:

Add 10 items:
{ "change": 10 }

Sell 5 items:
{ "change": -5 }

For API testing, use Postman and select the correct method (GET, POST, PUT, PATCH or DELETE).
