# Store Visitation Tracker

A Next.js application for tracking store visits with comprehensive form data collection and MongoDB storage.

## Features

- **Complete Store Visit Form** with sections for:

  - Territory Manager selection
  - Store Name and Number
  - Service Provider information
  - Store Engagement details
  - Store Display assessment
  - Promo Execution tracking
  - Store Sales in HVAC metrics
  - Overall comments

- **MongoDB Integration** for data storage
- **Form Validation** for required fields
- **Responsive Design** using shadcn/ui components

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up MongoDB

#### Option A: Local MongoDB

1. Install MongoDB on your local machine
2. Start MongoDB service
3. The default connection will be `mongodb://localhost:27017`

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster
3. Get your connection string
4. Update the `.env.local` file with your connection string

### 3. Environment Configuration

Create or update `.env.local` file:

```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=store-visitation-tracker

# For MongoDB Atlas (replace with your connection string)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### POST `/api/submit-form`

Submits a new store visit form to MongoDB.

**Required Fields:**

- Territory Manager
- Store Name and Number
- Service Provider

### GET `/api/get-submissions`

Retrieves the last 50 form submissions from MongoDB.

## Form Data Structure

The form data is stored in MongoDB with the following structure:

```json
{
  "territoryManager": "string",
  "storeName": "string",
  "serviceProvider": "string",
  "storeEngagement": {
    "modName": "string",
    "associateNames": "string",
    "visitPurpose": "string",
    "timeSpent": "string"
  },
  "storeDisplay": {
    "cleanliness": "yes|no",
    "pamphlets": "yes|no",
    "unitsCondition": "yes|no",
    "unitsVisible": "yes|no",
    "displayCondition": "yes|no",
    "cleanedDisplay": "yes|no|na"
  },
  "promoExecution": {
    "promoDisplayed": "yes|no",
    "promoSetup": "done"
  },
  "storeSales": {
    "totalLeads": "number",
    "closingRatio": "number",
    "sales": "number",
    "pipeline": "number"
  },
  "comments": "string",
  "submittedAt": "ISO date string",
  "createdAt": "MongoDB date"
}
```

## Usage

1. Open the application in your browser
2. Fill out all required fields (marked with \*)
3. Complete the optional sections as needed
4. Click "Submit" to save the data to MongoDB
5. The form will reset after successful submission

## Viewing Submissions

To view submitted data, you can:

1. Access the API directly: `GET /api/get-submissions`
2. Use MongoDB Compass or similar tools to connect to your database
3. Build a dashboard page (future enhancement)

## Development

The application uses:

- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **shadcn/ui** for UI components
- **MongoDB** for data storage
- **Tailwind CSS** for styling
