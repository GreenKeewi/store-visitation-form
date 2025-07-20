# Production Deployment Guide

## 🚀 Your Store Visitation Tracker is now production-ready!

### MongoDB Atlas Setup Complete ✅

- **Connection String**: `mongodb+srv://indpak:<db_password>@visitor-form.2yjalqi.mongodb.net/store-visitation-tracker?retryWrites=true&w=majority&appName=Visitor-Form`
- **Database**: `store-visitation-tracker`
- **Collection**: `store-visits`

### Required Actions:

#### 1. **Set Your MongoDB Password**

In your `.env.local` file, replace `<db_password>` with your actual MongoDB Atlas password:

```env
MONGODB_URI=mongodb+srv://indpak:YOUR_ACTUAL_PASSWORD@visitor-form.2yjalqi.mongodb.net/store-visitation-tracker?retryWrites=true&w=majority&appName=Visitor-Form
```

#### 2. **Test Locally**

```bash
npm run dev
# Open http://localhost:3000
# Submit a test form to verify MongoDB connection
```

#### 3. **Deploy to Production** (Recommended: Vercel)

**Option A: Quick Deploy with Vercel**

```bash
npm install -g vercel
vercel
# Follow the prompts
# Set environment variables in Vercel dashboard
```

**Option B: GitHub + Vercel Integration**

1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Auto-deploy on every push

### Environment Variables for Production:

Set these in your hosting platform (Vercel/Netlify/etc.):

```
MONGODB_URI=mongodb+srv://indpak:YOUR_PASSWORD@visitor-form.2yjalqi.mongodb.net/store-visitation-tracker?retryWrites=true&w=majority&appName=Visitor-Form
MONGODB_DB=store-visitation-tracker
NODE_ENV=production
```

### Production Features Added:

#### 🔒 **Security**

- Rate limiting (10 requests per 15 minutes per IP)
- Input validation and sanitization
- Security headers (X-Frame-Options, etc.)
- Environment variable validation

#### 📊 **Data Management**

- Enhanced data structure with metadata
- IP address and user agent logging for audit
- Improved error handling and logging
- Structured document organization

#### ⚡ **Performance**

- Production optimizations in Next.js config
- Gzip compression enabled
- MongoDB connection pooling

#### 🛠 **Monitoring**

- Detailed error logging
- Request tracking with IP addresses
- Enhanced API responses with success messages

### API Endpoints:

#### `POST /api/submit-form`

- Submits store visit form data
- **Rate Limited**: 10 requests per 15 minutes per IP
- **Required**: Territory Manager, Store Name, Service Provider

#### `GET /api/get-submissions`

- Retrieves last 100 submissions
- Sorted by most recent first
- Includes all form data and metadata

### Data Structure in MongoDB:

```json
{
  "territoryManager": "Mason Anderson",
  "storeName": "Others 2",
  "serviceProvider": "Cambridge Heating and Cooling",
  "storeEngagement": { ... },
  "storeDisplay": { ... },
  "promoExecution": { ... },
  "storeSales": { ... },
  "comments": "...",
  "metadata": {
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "submittedAt": "2025-01-18T12:00:00.000Z",
    "createdAt": "MongoDB Date Object"
  }
}
```

### Custom Domain Setup:

1. Deploy to Vercel
2. Purchase domain (GoDaddy, Namecheap, etc.)
3. Add domain in Vercel dashboard
4. Update DNS records as instructed
5. SSL certificate automatically provided

### Next Steps:

1. ✅ Replace `<db_password>` with your MongoDB password
2. ✅ Test the form locally
3. ✅ Deploy to production
4. ✅ Set up custom domain
5. ✅ Share with your team!

Your store visitation tracker is ready for business! 🎉
