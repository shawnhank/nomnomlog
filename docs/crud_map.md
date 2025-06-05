## 🗺️ RESTful Routes Table (NomNomLog – MVP + Icebox Features)

### `users` routes

  | Method | Path                         | Description                |
  | ------ | ---------------------------- | -------------------------- |
  | `GET`  | `/users/:id`                 | Show user profile          |
  | `GET`  | `/users/:id/edit`            | Edit user profile form     |
  | `PUT`  | `/users/:id`                 | Update user profile        |
  | `GET`  | `/users/:id/change-password` | Change password form       |
  | `PUT`  | `/users/:id/change-password` | Update password            |
  | `GET`  | `/users/:id/favorites`       | View user's favorite meals |
  | `GET`  | `/users/:id/tags`            | View tags used by user     |

### `auth` routes

  | Method | Path        | Description         |
  | ------ | ----------- | ------------------- |
  | `GET`  | `/register` | Registration form   |
  | `POST` | `/register` | Handle registration |
  | `GET`  | `/login`    | Login form          |
  | `POST` | `/login`    | Handle login        |
  | `GET`  | `/logout`   | Logout user         |

### `restaurants` routes

  | Method   | Path                             | Description                               |
  | -------- | -------------------------------- | ----------------------------------------- |
  | `GET`    | `/restaurants`                   | Index – list all restaurants              |
  | `GET`    | `/restaurants/new`               | Form – create new restaurant              |
  | `POST`   | `/restaurants`                   | Create new restaurant                     |
  | `GET`    | `/restaurants/:id`               | Show – view one restaurant                |
  | `GET`    | `/restaurants/:id/edit`          | Form – edit restaurant                    |
  | `PUT`    | `/restaurants/:id`               | Update restaurant                         |
  | `DELETE` | `/restaurants/:id`               | Delete restaurant                         |
  | `GET`    | `/api/restaurants/search?query=` | Icebox: Search restaurant via Yelp API    |

### `meals` routes

  | Method   | Path                  | Description                              |
  | -------- | --------------------- | ---------------------------------------- |
  | `GET`    | `/meals`              | Index – list all meals                   |
  | `GET`    | `/meals/favorites`    | List favorited meals                     |
  | `GET`    | `/meals/new`          | Form – create new meal                   |
  | `POST`   | `/meals`              | Create new meal                          |
  | `GET`    | `/meals/:id`          | Show – view one meal                     |
  | `GET`    | `/meals/:id/edit`     | Form – edit meal                         |
  | `PUT`    | `/meals/:id`          | Update meal                              |
  | `DELETE` | `/meals/:id`          | Delete meal                              |
  | `POST`   | `/meals/:id/favorite` | Mark as favorite                         |
  | `DELETE` | `/meals/:id/favorite` | Unmark favorite                          |
  | `POST`   | `/meals/:id/photo`    | Upload meal photo                        |
  | `DELETE` | `/meals/:id/photo`    | Remove meal photo                        |
  | `GET`    | `/meals/search?q=`    | Search meals by keyword, restaurant, tag |

### `tags` routes

  | Method   | Path        | Description                       |
  | -------- | ----------- | --------------------------------- |
  | `GET`    | `/tags`     | List all tags for current user    |
  | `POST`   | `/tags`     | Create new tag (if doesn't exist) |
  | `DELETE` | `/tags/:id` | Delete a tag by ID                |

### `mealTags` routes (Meal–Tag relationships)

  | Method   | Path                  | Description                          |
  | -------- | --------------------- | ------------------------------------ |
  | `POST`   | `/meal-tags`          | Create link between a meal and a tag |
  | `DELETE` | `/meal-tags/:id`      | Remove meal–tag relationship by ID   |
  | `GET`    | `/meals/:mealId/tags` | List tags linked to a specific meal  |
  | `GET`    | `/tags/:tagId/meals`  | List meals linked to a specific tag  |

### `restaurantTags` routes (Restaurant–Tag relationships)

  | Method   | Path                              | Description                                |
  | -------- | --------------------------------- | ------------------------------------------ |
  | `POST`   | `/restaurant-tags`                | Create link between a restaurant and a tag |
  | `DELETE` | `/restaurant-tags/:id`            | Remove restaurant–tag relationship by ID   |
  | `GET`    | `/restaurants/:restaurantId/tags` | List tags linked to a specific restaurant  |
  | `GET`    | `/tags/:tagId/restaurants`        | List restaurants linked to a specific tag  |



## 🗾 Additional RESTful Routes for Lookup Tables

### `mealMethods` routes

| Method   | Path                | Description                |
| -------- | ------------------- | -------------------------- |
| `GET`    | `/meal-methods`     | List all meal methods      |
| `POST`   | `/meal-methods`     | Create new meal method     |
| `DELETE` | `/meal-methods/:id` | Delete a meal method by ID |

---

### `mealCategories` routes

| Method   | Path                   | Description                  |
| -------- | ---------------------- | ---------------------------- |
| `GET`    | `/meal-categories`     | List all meal categories     |
| `POST`   | `/meal-categories`     | Create new meal category     |
| `DELETE` | `/meal-categories/:id` | Delete a meal category by ID |

---

### `restaurantCategories` routes

| Method   | Path                         | Description                      |
| -------- | ---------------------------- | -------------------------------- |
| `GET`    | `/restaurant-categories`     | List all restaurant categories   |
| `POST`   | `/restaurant-categories`     | Create new restaurant category   |
| `DELETE` | `/restaurant-categories/:id` | Delete restaurant category by ID |

---

### `deliveryServices` routes

| Method   | Path                     | Description                   |
| -------- | ------------------------ | ----------------------------- |
| `GET`    | `/delivery-services`     | List all delivery services    |
| `POST`   | `/delivery-services`     | Create new delivery service   |
| `DELETE` | `/delivery-services/:id` | Delete delivery service by ID |

---

### `deliveryTiers` routes

| Method   | Path                  | Description                |
| -------- | --------------------- | -------------------------- |
| `GET`    | `/delivery-tiers`     | List all delivery tiers    |
| `POST`   | `/delivery-tiers`     | Create new delivery tier   |
| `DELETE` | `/delivery-tiers/:id` | Delete delivery tier by ID |

---

### `captureStatuses` routes

| Method   | Path                    | Description                     |
| -------- | ----------------------- | ------------------------------- |
| `GET`    | `/capture-statuses`     | List all voice capture statuses |
| `POST`   | `/capture-statuses`     | Create new voice capture status |
| `DELETE` | `/capture-statuses/:id` | Delete capture status by ID     |
