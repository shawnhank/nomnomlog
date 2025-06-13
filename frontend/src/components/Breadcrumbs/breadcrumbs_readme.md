# 📘 BreadcrumbsWithRouter Component README

## ✅ Overview

This React component automatically generates breadcrumb navigation using React Router v7+'s `useMatches()` API. It supports:

- Tailwind CSS styling (with dark mode)
- Optional Heroicons per route
- Auto-highlight for the current page
- Horizontal scroll support on mobile
- Smooth hover transitions

---

## 🧩 Prerequisites

- React 18+
- React Router v7+ (core API, not `react-router-dom`)
- Tailwind CSS configured with dark mode support
- Heroicons (recommended via `@heroicons/react`)

---

## 📦 Installation

1. **Install dependencies:**

```bash
npm install @heroicons/react
```

2. **Confirm React Router is installed and set up with **``**.**

---

## 🛠 Usage

### 1. Define Breadcrumb Metadata in Routes

In your router configuration, add `handle.breadcrumb` objects with a `name` and optional `icon`:

```js
import { Cog6ToothIcon } from '@heroicons/react/20/solid'

{
  path: 'settings',
  element: <SettingsPage />,
  handle: {
    breadcrumb: { name: 'Settings', icon: Cog6ToothIcon }
  }
}
```

### 2. Include the Component in a Layout or Page

```jsx
import Breadcrumbs from './BreadcrumbsWithRouter'

function AppLayout() {
  return (
    <>
      <Breadcrumbs />
      <Outlet />
    </>
  )
}
```

---

## 🌐 Responsive & Dark Mode Support

- On small screens, the breadcrumb trail scrolls horizontally.
- Colors adapt automatically to light or dark mode using Tailwind’s `dark:` classes.
- Smooth transitions are applied for hover states.

---

## 🛡 Best Practices

- Define breadcrumb `handle` only for pages that should be visible in the trail.
- Use concise names for small screens.
- Only add icons where helpful — not every breadcrumb needs one.
- Avoid long labels unless you truncate them.

---

## 🔄 Future Enhancements

-

---

## ✅ Summary

This breadcrumb system helps users stay oriented across your app, adapts to mobile and dark mode automatically, and minimizes config by deriving breadcrumbs directly from route metadata.

Let us know if you want to extend this for tabs, nested menus, or multi-app support!

