# Amana Organic E-commerce Store

A React-based e-commerce frontend application built with Vite.

## Backend Configuration

The application is configured to connect to the live backend at:
**https://backend-two-orpin.vercel.app**

### Environment Variables

The backend URL is configured via the `VITE_BACKEND_URL` environment variable in the `.env` file:

```
VITE_BACKEND_URL=https://backend-two-orpin.vercel.app
```

### Available API Endpoints

The backend provides the following API endpoints:

**User Management:**
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `POST /api/user/admin` - Admin login

**Products:**
- `GET /api/product` - Get all products
- `POST /api/product` - Add new product
- `GET /api/product/:id` - Get specific product

**Cart:**
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add items to cart
- `PUT /api/cart` - Update cart

**Orders:**
- `GET /api/order` - Get orders
- `POST /api/order` - Place order

## Development

This project uses:
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) for Fast Refresh
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
