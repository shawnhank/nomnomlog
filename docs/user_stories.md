# NomNomLog User Stories

## 📖 User Stories

  ### ✅ MVP User Stories (Trello List: “MVP User Stories”)

    1.  As a user, I want to register and log in, so that I can access my private meal log.
    2.  As a user, I want to be able to edit my profile and update my login password.
    3.  As a user, I want to add a restaurant I ate at or ordered from.
    4.  As a user, I want to add a meal I ate, so that I can remember what I ordered.
    5.  As a user, I want to attach the meal to a restaurant, so that I know where I ate the meal.
    6.  As a user, I want to view a list of my meals, so that I can see everything I’ve eaten.
    7.  As a user, I want the option to use a thumbs up/down to quickly mark a meal as "order again" (thumbs up) or "don't order again" (thumbs down). 
    8.  As a user, I want the option to mark/unmark a meal as a favorite, so that I can find my best dishes easily.
    9.  As a user, I want to upload a photo of my meal, directly using the camera, from the camera roll, from an album, or from a file manager so that I have a visual reference.
    10.  As a user, I want to filter my meals by restaurant, thumbs up or down status, favorite status or tag, so that I can find specific ones.
    11. As a user, I want to add tags and attach them to meals and restaurants, so that I can organize views/lists by these tags.
    12. As a user, I want to view all my tags, so that I can view, edit and clean them up.
    13. As a user, I want to edit/remove/delete a single or multiple tags for meals so that I can fix mistakes or clean up my meal log.
    14. As a user, I want to edit/remove/delete a single or multiple tags for restaurants so that I can fix mistakes or clean up my meal log.
    15. As a user, I want to edit/remove/delete a single or multiple meals so that I can fix mistakes or clean up my meal log.
    16. As a user, I want to edit/remove/delete a single or multiple restaurants so that I can fix mistakes or clean up my meal log.
    17. As a user, I want to see all meals I’ve logged at a restaurant, so that I remember what I’ve tried.
    18. As a user, I want to add a note with comments about a meal.
    19. As a user, I want to edit the note/comment about a meal.
    20. As a user, I want to remove/delete the note/comment about a meal

---
---

  ### 🧊 Stretch Goal User Stories

    1.  As a user, I want to log the delivery details (fees, tips, service, discounts), so that I can track my food spending.
    2.  As a user, I want to compare delivery services over time, so that I can see which one saves me more.
    3.  As a user, I want to see monthly or yearly food spending totals, so that I can reflect on habits or budget.
    4.  As a user, I want to search restaurants via API (e.g. Yelp), so that I can import details instead of typing them manually.
    5.  As a user, I want the app to remind me if I’ve eaten a meal before, so that I don’t accidentally repeat bad ones.
    6.  As a user, I want to export my meal log as a PDF or CSV, so that I can save or share it.
    7.  As a user, I want to filter my meals by “Would order again” status, so that I can build a go-to list.
    8.  As a user, I want to see my most-used tags, so that I can understand my food trends.
    9.  As a user, I want to rate a meal with using a 1 to 5 star rating so that I remember how much I liked it.
    10. As a user, I want to sort in ascending or descending order by: date, restaurant name or tag.

---
---

  ### 🧊  Icebox External Services & Smart Features

    1.  As a user, I want restaurant fields to auto-fill using Google or Yelp or other API, so that I don’t have to type addresses or phone numbers.
    2.  As a user, I want to see Yelp data like categories or ratings when I add a restaurant, so that I can get more context.
    3.  As a user, I want to tap an address for directions to a saved restaurant, so that I can navigate there quickly. (using Leafletjs.com)
    4.  As a user, I want the app to detect my location, so that I can log or find nearby restaurants and meals faster.
    5.  As a user, I want to open a delivery app link directly from a meal or restaurant, so that I can reorder faster.
    6.  As a user, I want to ask natural language questions like “What’s my best rated sushi?” so that I can discover great meals I’ve logged.
    7.  As a user, I want to filter meals using plain language like “spicy noodles I liked”, so that I don’t need advanced filters.
    8.  As a user, I want to log a meal using my voice, so that I don’t have to type on mobile.
    9.  As a user, I want the app to detect when I log the same dish repeatedly, so that I can reuse old entries.
    10. As a user, I want the app to suggest “nearby favorites” based on GPS, so that I can eat something I like.
    11. As a user, I want onboarding and tooltips to guide me, so that I understand how to use each feature.
    12. As a user, I want the app to occasionally nudge me with prompts like “Tried anything good lately?”, so that I build the habit of logging meals.
    13. As a user, I want to upgrade my account to a Pro plan via Stripe, so that I can unlock premium features like voice capture or AI filters.
    14. As a user, I want to downgrade my account to cancel premium features, so that I stop future billing.
    15. As a user, I want to view a list of all previous invoices or receipts, so that I can track past payments and check plan details.
    16. As a user, I want to contact support easily, so that I can get help when I need it.



## **🧊  Icebox Admin / Dev User Stories**

```
1. **As a developer**, I want to manage lookup tables (like Meal Categories and Delivery Services), so that I can ensure consistency across dropdowns and filters.
2. **As an admin**, I want to activate or deactivate specific lookup options (like Meal Methods or Capture Statuses), so that users only see valid choices during form entry.
3. **As a developer**, I want to view and audit AI queries submitted by users, so that I can improve parsing accuracy and NLP reliability over time.
4. **As an admin**, I want a voice capture management panel to view all audio transcripts and manually update their status if needed, so that I can troubleshoot failures or incomplete logs.
5.	As an admin, I want to search and manage user accounts, so that I can respond to support issues and moderate the platform.
6.	As an admin, I want to deactivate or delete user accounts, so that I can enforce terms of service and handle account removal requests.
7.	As a developer, I want to assign user roles (e.g., admin, tester, user), so that access to management tools can be securely controlled.
8.	As a user, I want to view my billing history and invoices, so that I can track my payments and plan changes.
9.	As an admin, I want to access and manage Stripe billing events (subscriptions, charges, refunds), so that I can support users with payment issues.
10.	As a developer, I want to merge or clean up duplicate tags (e.g., “taco” vs. “tacos”), so that user data remains consistent and searchable.
11.	As an admin, I want to export logs and activity data (e.g., meals, AI queries, delivery costs), so that I can perform audits or usage analysis.
12.	As a developer, I want to monitor the app’s system health and service status, so that I can respond quickly to outages or API errors.
```



