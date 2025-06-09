Screens needed for MVP + Icebox features. For each screen, we are defining an laying out:

1. **Primary purpose / route**
2. **Main content & components (mobile-first)**
3. **Changes for medium (md) and large (lg) screens**

---

Starting with the **authenticated user experience** as that is core.

### **1.**  **Meal Index Page**

- **Route:** /meals

- **Purpose:** Show all meals the user has logged

- **Mobile Layout:**

  - Sticky top nav bar
  - Search + filter toggle
  - List or card view of meals:
    - Thumbnail (optional), meal name
    - Date eaten, restaurant name
    - Icons for thumbs, stars, favorite
    - Tag chips
  - FAB (floating action button) for “+ Log Meal”

  

- **Tablet/Desktop Changes:**

  - Filters (tags, category, restaurant) appear in sidebar
  - Grid layout for meals (2–4 columns)
  - Search and sort options visible inline (not in toggle drawer)

  

------

### **2.**  **Meal Detail Page**

- **Route:** /meals/:id

- **Purpose:** Show full info for a single meal

- **Mobile Layout:**

  - Meal photo (or placeholder)
  - Meal name, restaurant, tags
  - Star rating, thumbs, favorite toggle
  - Delivery or dine-in info
  - Notes
  - Edit/Delete buttons

  

- **Tablet/Desktop Changes:**

  - Layout becomes 2-column:
    - Left: Photo, tags, delivery
    - Right: Notes, ratings, metadata
  - Persistent edit/delete buttons in header

  

------

### **3.**  **Meal Form Page (Create/Edit)**

- **Route:** /meals/new, /meals/:id/edit

- **Purpose:** Log or update a meal

- **Mobile Layout:**

  - Step-by-step vertical form:

    - Dish name
    - Restaurant (search/select)
    - Meal category (dropdown)
    - Meal method (dropdown)
    - Star rating, thumbs
    - Favorite toggle
    - Tags (multi-select chips or input)
    - Notes (textarea)
    - Photo upload
    - Delivery info section (if delivery chosen)

    

- **Tablet/Desktop Changes:**

  - Multi-column form layout
  - Tags and rating may appear inline with name
  - Sticky sidebar for submit/save actions

  

------

### **4.**  **Restaurant Index Page**

- **Route:** /restaurants

- **Purpose:** Show all restaurants added by the user

- **Mobile Layout:**

  - Search input
  - List view: Name, tags, optional address
  - Button to add new restaurant

  

- **Tablet/Desktop Changes:**

  

  - Grid or table layout with columns (Name, Tags, Meals logged)
  - Sidebar filter for category or tag
  - “Add Restaurant” button shown top-right

  

------

### **5.**  **Restaurant Detail Page**

- **Route:** /restaurants/:id

- **Purpose:** Show restaurant info + meals logged there

- **Mobile Layout:**

  - Name, tags, address, phone, website link
  - Option to view on map (if applicable)
  - List of meals eaten at this restaurant
  - Button to edit restaurant

  

- **Tablet/Desktop Changes:**

  - Layout becomes 2-column
  - Left: restaurant info, map
  - Right: meals list (sortable)

  

------

### **6.**  **Restaurant Form Page (Create/Edit)**

- **Route:** /restaurants/new, /restaurants/:id/edit

- **Mobile Layout:**

  - Vertical form:

    - Name
    - Address
    - Phone
    - Website
    - Category (dropdown)
    - Tags (chips or select)

    Save/Cancel buttons

  

- **Tablet/Desktop Changes:**

  - Form may be split into 2 shorter columns
  - Persistent sidebar or top bar with “Save” action

  

------

### **7.**   **Tag Index Page (User’s Tags)**

- **Route:** /users/:id/tags

- **Mobile Layout:**

  - List or chip view of tags (used across meals/restaurants)
  - Each tag links to a filtered meal list
  - Option to delete tag (if unused)

  

- **Tablet/Desktop Changes:**

  - Tag usage counts shown inline
  - Table layout with columns: Tag, Meals, Restaurants, Delete

  

------

### **8.**   **Meal Favorites Page**

- **Route:** /users/:id/favorites or /meals/favorites

- **Mobile Layout:**

  - Grid or list of meals marked favorite
  - Similar layout to meal index
  - Sorting options (most recent, star rating)

  

- **Tablet/Desktop Changes:**

  - Multi-column grid with sort dropdown
  - Possibly filter by tag or category

  

------

### **9.**   **User Profile Page**

- **Route:** /users/:id

- **Mobile Layout:**

  - Avatar, email, “Edit profile” button
  - Links to: My Meals, Favorites, Tags

  

- **Tablet/Desktop Changes:**

  - Profile info in sidebar
  - Main area used for latest meals/favorites

  

------

### **10.**   **User Auth Pages**

- **Routes:** /register, /login, /logout

- **Mobile Layout:**

  - Vertical form layout
  - Tailwind form input + error state styling
  - Buttons to toggle to login/register

  

- **Tablet/Desktop Changes:**

  - Centered card layout
  - Side-by-side login/register split panel optional

  

------

Below are the **Icebox feature screens** for NomNomLog. These are stretch-phase layouts that expand app value but aren’t required for MVP.

### **11.**  **Subscription / Plan Upgrade Page**

- **Route:** /account/upgrade

- **Purpose:** Allow users to upgrade to paid features via Stripe

- **Mobile Layout:**

  - Feature list (voice capture, AI filters, etc.) free vs. pro
  - FAQ or benefit list below pricing
  - CTA button "Upgrade to Pro" → opens Stripe Checkout
  - Stripe Checkout opens in overlay or redirect
  - Confirmation message after success with email folowup and receipt
  - Add promo code box

  

- **Tablet/Desktop Changes:**

  - Side-by-side plan comparison table (Free vs Pro)

  - FAQ or benefit list below pricing aka “What’s included” feature grid

  - Add promo code box

  - confirmation messag and Email receipt link on success page

    

------

### **12.** **Plan Downgrade Page**

- **Route:** /account/cancel

- **Purpose:** Cancel Pro plan (no refund, access continues through end of billing)

- **Mobile Layout:**

  - Summary of plan details
  - Downgrade CTA button
  - Confirmation warning
  - Success message w/ end date

  

- **Tablet/Desktop Changes:**

  - Plan perks table fades/greys out on cancel
  - Email confirmation preview panel
  - Link to support for billing questions

---

### **13.**  **Billing History Page**

- **Route:** /account/billing

- **Purpose:** View previous payments and invoices

- **Mobile Layout:**

  - List of invoices with amount and date
  - Tap to download or email receipt
  - See current plan details

  

- **Tablet/Desktop Changes:**

  - Table of all payments
  - PDF icons for direct download
  - Billing support link at bottom

---

### **14.** **Help / Contact Page**

- **Route:** /help or /support

- **Purpose:** Contact form for support or feature help

- **Mobile Layout:**

  - “How can we help?” input
  - Option to email or launch chatbot (future)
  - Auto-reply message: “We’ll get back to you within 24 hours”

  

- **Tablet/Desktop Changes:**

  - Side-by-side layout: FAQ on left, contact form on right
  - Optional “start live chat” button if chatbot added later

---



### **15.**   **Voice Capture Log Page**

- **Route:** /voice-captures
- **Purpose:** Show past voice-based entries and their status

- **Mobile Layout:**

  - List of voice logs with:

    - Transcript (preview or full)
    - Date/time
    - Status badge (e.g., Pending, Complete, Error)
    - Linked entity: meal/restaurant/tag

    Upload/record new capture button

  

- **Tablet/Desktop Changes:**

  - Table layout with columns: Transcript, Status, Linked Item, Actions
  - Search or filter by status

  

------

### **16.**   **Smart Voice Capture Form**

- **Route:** /voice-captures/new

- **Purpose:** Let user record/upload audio to log a meal

- **Mobile Layout:**

  - “Tap to Record” button
  - Optional: upload .mp3/.wav
  - Audio preview & status
  - Transcription preview
  - Save or discard transcript

  

- **Tablet/Desktop Changes:**

  - Same layout, larger buttons
  - Recording UI may appear inline rather than modal

  

------

### **17.**   **AI Query Page (Natural Language Search)**

- **Route:** /ai-query

- **Purpose:** User asks freeform questions like “What was my best ramen?”

- **Mobile Layout:**

  - Input field with submit button
  - Display of parsed results (meals, tags, etc.)
  - Error or fallback messages if nothing found

  

- **Tablet/Desktop Changes:**

  - Input remains sticky at top
  - Results shown in multi-column grid
  - Optional: recent queries sidebar

  

------

### **18.**  **Delivery Log Breakdown View**

- **Route:** /meals/:id/delivery

- **Purpose:** View cost and service breakdown for delivery meals

- **Mobile Layout:**

  - Summary card: service, tier, total cost
  - Breakdown table: delivery fee, tip, discount, etc.
  - Linked delivery service info (e.g., Uber Eats)

  

- **Tablet/Desktop Changes:**

  - Breakdown table expanded to full-width
  - Chart or visual for cost summary (optional)

  

------

### **19.**   **Nearby Restaurants View**

- **Route:** /restaurants/nearby

- **Purpose:** Use geolocation to suggest previously saved places near user

- **Mobile Layout:**

  - Map with location pins (Leaflet)
  - Scrollable list below map
  - “Open in Maps” or “Get Directions” buttons

  

- **Tablet/Desktop Changes:**

  - Map and list shown side-by-side
  - Filters for tag/category

  

------

### **20.**   **Saved Searches or AI Recommendations**

- **Route:** /recommendations or /ai-insights

- **Purpose:** Smart suggestions or auto-tagged patterns

- **Mobile Layout:**

  - List of insights like “You liked spicy dishes from Thai places”
  - CTA buttons like “Show more”, “Log similar meal”

  

- **Tablet/Desktop Changes:**

  - Grid of recommendations
  - Category charts or visual summaries (stretch)

  

------

Below are the **Admin / Developer Icebox feature screens** for NomNomLog. These are stretch-phase layouts that expand app value but aren’t required for MVP.

### **21.**  **User Management Panel**

- **Route:** /admin/users

- **Purpose:** Search, view, and moderate user accounts

- **Mobile Layout:**

  - Search bar and paginated list of users
  - Tap to view user details (profile, stats, last login)
  - Toggle to activate/deactivate users

  

- **Tablet/Desktop Changes:**

  - Side-by-side layout with user list and detail pane
  - Role assignment dropdown
  - Filter by plan, activity, or creation date

  

------

### **22.**  **Lookup Table Manager**

- **Route:** /admin/lookups

- **Purpose:** Add/edit/manage controlled vocab tables

- **Mobile Layout:**

  - Dropdown to select which lookup table (e.g. MealMethod)
  - List entries with toggle for “active” state
  - Edit and delete buttons inline

  

- **Tablet/Desktop Changes:**

  - Tabbed layout for switching between lookup tables
  - Batch add/edit form support
  - Usage count shown for each item

  

------

### **23.**  **Voice Capture Admin Panel**

- **Route:** /admin/voice-captures

- **Purpose:** Review, debug, and update voice capture records

- **Mobile Layout:**

  - List of captures showing transcript and status
  - Tap to open full transcript and playback audio
  - Dropdown to change status (e.g., Pending, Error, Complete)

  

- **Tablet/Desktop Changes:**

  - Table view with filters for status and user
  - Bulk status update
  - Linked entity preview (Meal, Restaurant, Tag)

  

------

### **24.**  **AI Query Log & Insights**

- **Route:** /admin/ai-queries

- **Purpose:** View logs of all AI/NLP queries made by users

- **Mobile Layout:**

  - Search/filter bar
  - Scrollable query cards with: input, detected intent, filters
  - Expand to view results returned

  

- **Tablet/Desktop Changes:**

  - Grid/table layout
  - Add “debug” toggle to view NLP confidence, token match, etc.
  - User and timestamp columns

  

------

### **25.**  **Stripe Billing Admin**

- **Route:** /admin/billing

- **Purpose:** View/manage billing events and plan subscriptions

- **Mobile Layout:**

  - Search by user/email
  - View current plan, last payment, upcoming renewal
  - Button to access Stripe dashboard link

  

- **Tablet/Desktop Changes:**

  - Filters by plan (free, pro, canceled)
  - Refund and cancel buttons inline
  - Summary metrics (MRR, active subscriptions)

  

------

### **26.**  **Data Cleanup: Tag Merge Tool**

- **Route:** /admin/tags/merge

- **Purpose:** Merge duplicate or similar tags (e.g., “taco” vs “tacos”)

- **Mobile Layout:**

  - Search box with auto-grouping of similar tags
  - Select tags to merge → choose destination tag
  - Confirm and apply merge

  

- **Tablet/Desktop Changes:**

  - Table of potential merges with preview of affected meals
  - Usage count before/after
  - Filter for unused or low-frequency tags

  

------

### **27.**   **Analytics & Export Dashboard**

- **Route:** /admin/analytics

- **Purpose:** Export reports and monitor high-level usage

- **Mobile Layout:**

  - Buttons for “Export Meals”, “Export Logs”, “Download CSV”
  - Daily/weekly stats with scrollable sparkline charts

  

- **Tablet/Desktop Changes:**

  - Dashboard-style layout with tabs
  - Filters by user, date range, tag, or entity type
  - API usage and activity logs

  

------

### **28.**   **System Health Monitor**

- **Route:** /admin/system-health

- **Purpose:** Monitor core services and queued tasks

- **Mobile Layout:**

  - API status indicators (green/yellow/red)
  - Voice capture queue size
  - Basic log preview for last few errors

  

- **Tablet/Desktop Changes:**

  - Live console feed (stretch goal)
  - Retry, requeue, or clear logs
  - Service uptime chart (24h, 7d, etc.)

  

------







