# CSMS Backend API

This is the backend API for the [CSMS (Campus Services Management System)](https://github.com/xditya/CampusServicesManagementSystem) project. It provides endpoints for managing vending machine orders and monitoring system data.

## Setup

1. Clone the repository
   ```bash
    git clone https://github.com/yourusername/csms-backend.git
    cd csms-backend
    ```

2. Install dependencies
- Install [Deno](https://deno.land/#installation)

3. Configure environment variables
    Create a `.env` file with:
    ```env
    MONGO_URL=your_mongodb_connection_string
    ```
4. Run the server
   ```bash
    deno run --allow-net --allow-env index.ts
    ```


## API Endpoints

### Order Management

#### Get Order Details
```http
GET /order?email={email}&hash={hash}
```
Returns order details for the given email and hash combination.

**Parameters:**
- `email`: User's email address
- `hash`: Order hash

**Response:**
```json
{
"hash": "string",
"items": {
"itemId": "quantity"
},
"timestamp": "string",
"status": "Placed|Done",
"totalCost": number
}
```

#### Complete Order
```http
GET /order/complete?email={email}&hash={hash}
```

Marks an order as completed.

**Parameters:**
- `email`: User's email address
- `hash`: Order hash

**Response:**
```json
{
"status": "success"
}
```

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 400: Bad Request (missing parameters)
- 404: Not Found (order doesn't exist)
- 500: Internal Server Error

## Technologies Used

- Deno
- Oak (web framework)
- MongoDB
- TypeScript

---

<div align="center">
  <table>
    <tr>
      <td align="center"><img src="assets/images/CSMS_coloured.png" height="60px" alt="CSMS"></td>
      <td align="center"><img src="assets/images/appwrite.png" height="60px" alt="Appwrite"></td>
      <td align="center"><img src="assets/images/mongodb.png" height="60px" alt="MongoDB"></td>
    </tr>
  </table>
</div>