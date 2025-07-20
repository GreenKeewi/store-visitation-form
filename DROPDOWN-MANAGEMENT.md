# Dynamic Dropdown Management

Your Store Visitation Tracker now uses MongoDB to manage dropdown options for Territory Managers, Stores, and Service Providers. This means you can add, edit, or remove options without changing any code!

## 📊 Database Collections

### 1. Territory Managers (`territory-managers`)

```javascript
{
  _id: ObjectId,
  name: "John Smith",        // Display name
  active: true,              // Whether to show in dropdown
  createdAt: Date,
  updatedAt: Date            // Optional
}
```

### 2. Stores (`stores`)

```javascript
{
  _id: ObjectId,
  name: "Cambridge Heating and Cooling",  // Store name
  number: "CHC001",                       // Store number
  address: "123 Main St, Cambridge",     // Store address
  active: true,                           // Whether to show in dropdown
  createdAt: Date,
  updatedAt: Date                         // Optional
}
```

### 3. Service Providers (`service-providers`)

```javascript
{
  _id: ObjectId,
  name: "Cambridge Heating and Cooling",  // Provider name
  type: "HVAC",                           // Service type
  contact: "service@cambridge-hvac.com",  // Contact info
  active: true,                           // Whether to show in dropdown
  createdAt: Date,
  updatedAt: Date                         // Optional
}
```

## 🔧 Managing Dropdown Data

### Option 1: Using MongoDB Compass (Recommended)

1. Download and install [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your MongoDB Atlas connection string
3. Navigate to your database: `store-visitation-tracker`
4. Edit any of the three collections:
   - `territory-managers`
   - `stores`
   - `service-providers`

### Option 2: Using MongoDB Atlas Web Interface

1. Log into [MongoDB Atlas](https://cloud.mongodb.com/)
2. Go to your cluster
3. Click "Browse Collections"
4. Edit the collections directly

### Option 3: Using the MongoDB Shell

```bash
# Connect to your database
mongosh "your-connection-string"

# Add a new territory manager
db['territory-managers'].insertOne({
  name: "Sarah Johnson",
  active: true,
  createdAt: new Date()
})

# Add a new store
db.stores.insertOne({
  name: "North Side HVAC",
  number: "NSH001",
  address: "456 North Ave, Toronto",
  active: true,
  createdAt: new Date()
})

# Disable a service provider (hide from dropdown)
db['service-providers'].updateOne(
  { name: "Old Provider" },
  { $set: { active: false, updatedAt: new Date() } }
)
```

## 🚀 How It Works

1. **Automatic Loading**: When the form loads, it fetches fresh data from MongoDB
2. **Real-time Updates**: Changes in MongoDB appear immediately on page refresh
3. **Error Handling**: If MongoDB is unavailable, the dropdowns show "Loading..." state
4. **Sorting**: All options are automatically sorted alphabetically

## 📝 Adding New Items

### Add Territory Manager:

```javascript
{
  name: "New Manager Name",
  active: true,
  createdAt: new Date()
}
```

### Add Store:

```javascript
{
  name: "New Store Name",
  number: "NST001",           // Optional but recommended
  address: "Store Address",   // Optional
  active: true,
  createdAt: new Date()
}
```

### Add Service Provider:

```javascript
{
  name: "New Service Provider",
  type: "HVAC",              // Optional: HVAC, Electrical, Plumbing, etc.
  contact: "email@domain.com", // Optional
  active: true,
  createdAt: new Date()
}
```

## 🔄 Refreshing Data

The form automatically loads fresh data when:

- Page is refreshed
- Component is remounted
- You can also add a "Refresh" button if needed

## 💡 Tips

1. **Keep `active: true`** for items you want to show
2. **Set `active: false`** to hide items without deleting them
3. **Use consistent naming** for better user experience
4. **Store numbers** help identify stores uniquely
5. **Regular cleanup** of inactive items keeps the database tidy

## 🛡️ Best Practices

- Always backup before making bulk changes
- Test changes in a development environment first
- Use descriptive names that users will recognize
- Keep the data synchronized across environments
- Monitor form performance if you have many items (>100)

Your dropdowns will now automatically update whenever you change the MongoDB data! 🎉
