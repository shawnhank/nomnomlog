## 🔗 RESTful Routes Table (NomNomLog – MVP + Icebox Features)

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
