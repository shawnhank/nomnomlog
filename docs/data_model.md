## **🧠 What Is a Data Model?**

A **data model** is a structured blueprint of all the entities (like users, restaurants, meals) in your app, what data each one stores (fields), and how they relate to each other (relationships).  It defines:

- **What** information your app tracks
- **How** it’s organized
- **How** different types of data are linked



## **🔧 Why Is a Data Model Important in Web Apps?**

### 1.  **It’s the foundation of your database**

Your data model defines how your database is structured. Every MongoDB collection, every field, and every ObjectId relationship comes from this.  Without a solid model, your data becomes:

- Messy
- Redundant
- Hard to query
- Painful to scale

### 2.  **It drives how your app works**

The data model controls:

- What you show on screens (e.g., a meal with its tags and restaurant)
- What gets saved when a user submits a form
- What data flows through your API

Every CRUD route, every user interaction, and every piece of logic depends on the model.

### **3.**  **It keeps your team aligned**

A shared data model gives your dev team, designers, and stakeholders one single source of truth.  Without it, you risk:

- Conflicting assumptions
- Bad queries
- Poor performance
- Broken features

### **4.**  **It helps you plan the right relationships**

Good data models think about:

- Ownership (who created this?)
- Reuse (can multiple users tag things the same way?)
- Search/filtering (can we query this field efficiently?)

This is why we define things like:

- One-to-Many: One user → many meals
- Many-to-Many: Meals and Tags via MealTag

## **💡 In Plain English:**

The data model is your app’s brain.  It’s what tells your app *what it knows*, *how it stores it*, and *how it connects it all together.*

Every form you build, every API you design, and every page you render depends on it.



---

# 💁🏼  Data Model for NomNomLog



  ```
User (MVP)
  - _id : ObjectId (PK)
  - fname : string (optional)
  - lname : string (optional)
  - email : string
  - passwordHash : string
  - socialLoginId : string (optional)
  - createdAt : date
  - updatedAt : date

Restaurant (MVP)
  - _id : ObjectId (PK)
  - userId : ObjectId (FK → User)
  - name : string
  - address : string (optional)
  - phone : string (optional)
  - website : string (optional)
  - lat : number (optional)
  - long : number (optional)
  - categoryId : ObjectId (FK → RestaurantCategory)
  - createdAt : date
  - updatedAt : date

Meal  (MVP)
  - _id : ObjectId (PK)
  - userId : ObjectId (FK → User)
  - restaurantId : ObjectId (FK → Restaurant)
  - mealName : string
  - mealCategoryId : ObjectId (FK → MealCategory)
  - mealMethodId : ObjectId (FK → MealMethod)
  - thumbsRating : boolean
  - starRating : number (optional)
  - favorite : boolean
  - photoUrl : string (optional)
  - notes : string
  - dateEaten : date
  - createdAt : date
  - updatedAt : date

Tag (MVP)
  - _id : ObjectId (PK)
  - userId : ObjectId (FK → User)
  - name : string

MealTag (Join Table)
  - _id : ObjectId (PK)
  - mealId : ObjectId (FK → Meal)
  - tagId : ObjectId (FK → Tag)

RestaurantTag (Join Table)
  - _id : ObjectId (PK)
  - restaurantId : ObjectId (FK → Restaurant)
  - tagId : ObjectId (FK → Tag)

DeliveryLog (Icebox)
  - _id : ObjectId (PK)
  - userId : ObjectId (FK → User)
  - mealId : ObjectId (FK → Meal)
  - deliveryServiceId : ObjectId (FK → DeliveryService)
  - serviceTierId : ObjectId (FK → DeliveryTier)
  - deliveryFee : number
  - tip : number
  - tax : number
  - discountAmount : number
  - totalCost : number
  - createdAt : date
  - updatedAt : date

VoiceCapture (Icebox)
  - _id : ObjectId (PK)
  - userId : ObjectId (FK → User)
  - mealId : ObjectId (FK → Meal)
  - restaurantId : ObjectId (FK → Restaurant)
  - tagId : ObjectId (FK → Tag)
  - statusId : ObjectId (FK → CaptureStatus)
  - transcript : string
  - audioFileUrl : string
  - createdAt : date
  - updatedAt : date

AIQuery (Icebox)
  - _id : ObjectId (PK)
  - userId : ObjectId (FK → User)
  - inputText : string
  - parsedIntent : string
  - filters : string
  - resultIds : string
  - createdAt : date
  - updatedAt : date

AnalyticsLog (Icebox)
  - _id : ObjectId (PK)
  - userId : ObjectId (FK → User)
  - action : string
  - targetType : string
  - targetId : string
  - timestamp : date
  - createdAt : date
  - updatedAt : date
  
RestaurantCategory (Lookup Table)
  - _id : ObjectId (PK)
  - yelpSlug : string
  - displayName : string
  
RestaurantCategory (Lookup Table)
  - _id : ObjectId (PK)
  - yelpSlug : string
  - displayName : string

MealCategory (Lookup Table)
  - _id : ObjectId (PK)
  - name : string

MealMethod (Lookup Table)
  - _id : ObjectId (PK)
  - name : string

DeliveryService (Lookup Table)
  - _id : ObjectId (PK)
  - name : string
  - description : string
  - isActive : boolean
  
DeliveryTier (Lookup Table)
  - _id : ObjectId (PK)
  - name : string
  - serviceId : ObjectId (FK → DeliveryService)
  - isActive : boolean
  
CaptureStatus (Lookup Table)
  - _id : ObjectId (PK)
  - label : string
  - code : ObjectId (FK → VoiceCapture)
  - isActive : boolean

  ```



---



##  🔗 Relationships

- **User → Restaurants**: One-to-Many
- **User → Meals**: One-to-Many
- **User → Tags**: One-to-Many
- **User → DeliveryLogs / VoiceCaptures / Queries / Logs**: One-to-Many
- **Restaurant → Meals**: One-to-Many
- **Meal → Tags**: Many-to-Many (via MealTag)
- **Restaurant → Tags**: Many-to-Many (via RestaurantTag)
- **Meal → MealCategory**: Many-to-One
- **Meal → MealMethod**: Many-to-One
- **Restaurant → RestaurantCategory**: Many-to-One
- **DeliveryLog → DeliveryService**: Many-to-One
- **DeliveryLog → DeliveryTier**: Many-to-One
- **DeliveryTier → DeliveryService**: Many-to-One
- **VoiceCapture → CaptureStatus**: Many-to-One



---



## **🎯 The Role of Lookup Tables in a Data-Driven Web App**

Lookup tables act as **controlled vocabularies** or **reference sets**.  They keep the app **consistent**, **scalable**, and **user-friendly** across forms, filters, relationships, and analytics.

Typical use cases for lookup tables include form inputs, allowing filtering meals by dining method or category, database driven drop-downs that allow fetching lookup values dyamically in the front end.

Lookup tables are the backbone of all dropdowns, filters, analytics, and joins where your app needs **predefined options**, not free-form data.  They give you clean control over:

- What users can select
- How you filter data
- How relationships are stored



## 📦 Lookup Tables in NomNomLog

| **Table**          | **Purpose**                                                  |
| ------------------ | ------------------------------------------------------------ |
| MealMethod         | Defines how meals were consumed (Dine-In, Pickup, Delivery). Prevents typos and enables analytics by method. |
| MealCategory       | Categorizes meals into structured, filterable groups like “Ramen”, “Tacos”, etc. |
| RestaurantCategory | Mirrors Yelp or user-created groupings for restaurant types. |
| DeliveryService    | Prevents typo-filled serviceName strings. Represents services like Uber Eats, GrubHub, DoorDash. |
| DeliveryTier       | Represents tiers like “Standard”, “Priority”, “Express” tied to a specific delivery service. |
| CaptureStatus      | Tracks processing stages of voice captures, such as “Pending”, “Complete”, “Error”. |



---

## **🔗 Join Tables in a Data-Driven Web App**

Join tables allow data-driven web apps to model **many-to-many (M:N)** relationships without duplication or data sprawl.  They don’t hold content themselves — they link two records together, and are essential for **reusable, flexible tagging**.

They’re crucial when **multiple items on one side can relate to multiple on the other** — like:

- A meal having several tags
- A tag belonging to many meals

Join tables act as the glue between entities — ensuring relationships are **efficient**, **queryable**, and **scalable**. They also enable:

- Clean Mongo queries across relationships
- Flexible tagging, filtering, and analytics
- The ability to later add metadata to relationships (like tag priority, user-created notes, etc.)

You cannot achieve this cleanly using arrays inside one model. Join tables normalize your structure for long-term growth.



## **🔗 Join Tables** in NomNomLog

| **Table**     | **Purpose**                                                  |
| ------------- | ------------------------------------------------------------ |
| MealTag       | Links meals and tags. Enables one meal to have many tags and reuse tags across meals. |
| RestaurantTag | Links restaurants and tags. Supports filtering/searching across restaurant metadata like cuisine, atmosphere, or dietary options. |



## **💡 Why Join Tables Matter**

**Without Join Tables**

You might store an array like tags = ['spicy', 'late night'] inside a meal. This:

- Allows typos / inconsistent casing

- Makes queries expensive and fuzzy

- Cannot enforce tag uniqueness or ownership

- Doesn’t support searching *“all spicy ramen meals”*

  

**With Join Tables + Tag Model**

- Tags become real entities you can validate, browse, or edit
- Relationships become efficient and scalable
- Queries like *“meals tagged as gluten-free”* are fast and clean
- Tag reuse across meals and restaurants becomes seamless

