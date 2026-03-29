# Portfolio Content Guide

This guide explains how to update your portfolio content without any coding knowledge. All changes are made in one file: `src/lib/constants/data.ts`

## 📍 File Location
Find this file: `src/lib/constants/data.ts`

---

## 🔧 What You Can Change

### 1. **Loading Screen Messages**
```javascript
export const loadertext = [
  { text: "Hi I'm Berket" },           // Change your name here
  { text: "Welcome to my portfolio" }, // Change welcome message
];
```
**What it does:** Shows messages when your website loads

---

### 2. **Your Email Address**
```javascript
export const email = "hello@bekistuios@com";
```
**What it does:** Your contact email that appears throughout the site

---

### 3. **Navigation Menu**
```javascript
export const menuItems = [
  { name: "Thumbnails", href: "/thumbnails", image: "/assets/img1.jpg" },
  { name: "Flayer Designs", href: "/flayers-designs", image: "/assets/img2.jpg" },
  // Add more menu items here
];
```
**What to change:**
- `name`: Menu item text
- `image`: Preview image (must be in `/public/assets/` folder)

---

### 4. **Social Media Links**
```javascript
export const socialItems = [
  { name: "Dribble", href: "#" },     // Replace "#" with your Dribbble URL
  { name: "Linkdin", href: "#" },     // Replace "#" with your LinkedIn URL
  { name: "Behance", href: "#" },     // Replace "#" with your Behance URL
  { name: "Instagram", href: "#" },   // Replace "#" with your Instagram URL
];
```

---

### 5. **Home Page Slides**
```javascript
export const slideData = [
  {
    title: "Thumbnails",              // Project category name
    image: "/assets/slider1.jpg",     // Main slide image
    bgColor: "#311512",               // Background color (hex code)
    to: "/thumbnails",                // Page link
    year: 2022,                       // Project year
  },
];
```

---

### 6. **About Page Content**
```javascript
export const texts = [
  {
    title: "About Me",
    content: "Your about me text here...",
  },
  {
    title: "What I Do", 
    content: "Describe what you do...",
  },
  {
    title: "My Process",
    content: "Explain your work process...",
  },
];
```

---

### 7. **Project Images**
Replace image file names with your own:

```javascript
// Thumbnail images
export const thumbnailImages = [
  "/assets/img1.jpg",    // Replace with your image names
  "/assets/img2.jpg",
  "/assets/img3.jpg",
];

// Flayer design images  
export const flayersImages = [
  "/assets/img1.jpg",    // Replace with your image names
];

// Social media post images
export const socialMediaPostsImages = [
  "/assets/img1.jpg",    // Replace with your image names
];

// Sticker design images
export const stickerDesignImages = [
  "/assets/img1.jpg",    // Replace with your image names
];
```

---

### 8. **Contact Page Information**
```javascript
export const contactSections = [
  {
    id: "01",
    title: "Get In Touch",
    items: [
      { text: "Book Your Consultation", isLink: false, href: "" },
      { text: "your-email@domain.com", isLink: true, href: "mailto:your-email@domain.com" },
    ],
  },
  {
    id: "02", 
    title: "Location",
    items: [
      { text: "Your Company Name", isLink: false, href: "" },
      { text: "Your Address", isLink: false, href: "" },
      { text: "Your City", isLink: false, href: "" },
    ],
  },
  {
    id: "03",
    title: "Social",
    items: [
      { text: "Instagram", isLink: true, href: "https://instagram.com/yourusername" },
      { text: "LinkedIn", isLink: true, href: "https://linkedin.com/in/yourusername" },
    ],
  },
];
```

---

## 📁 Adding Images

1. Put your images in the `public/assets/` folder
2. Name them clearly (e.g., `thumbnail1.jpg`, `logo.png`)
3. Update the image paths in the data file
4. Use formats: `.jpg`, `.png`, `.webp`

---

## ⚠️ Important Rules

1. **Keep the structure:** Don't remove commas, brackets, or quotes
2. **Image paths:** Always start with `/assets/`
3. **Colors:** Use hex codes like `#FF5733`
4. **Links:** Use full URLs like `https://instagram.com/username`
5. **Email links:** Use `mailto:your-email@domain.com`

---

## 🚀 After Making Changes

1. Save the file
2. Refresh your website
3. Check if everything looks correct
4. If something breaks, undo your last change

---

## 💡 Quick Tips

- **Test one change at a time**
- **Keep backups of your original file**
- **Use simple, clear file names for images**
- **Double-check all commas and quotes**

---

## 🆘 Common Issues

### Problem: Website shows broken images
**Solution:** Check image file names and paths in `/public/assets/`

### Problem: Links don't work
**Solution:** Make sure URLs start with `https://` and email links use `mailto:`

### Problem: Text doesn't appear
**Solution:** Check for missing commas or quotes in the content

### Problem: Colors don't change
**Solution:** Use proper hex color codes like `#FF5733`

---

## 📞 Need Help?

If you encounter issues:
1. Double-check your syntax (commas, quotes, brackets)
2. Verify image files exist in the correct folder
3. Test one change at a time
4. Keep a backup of the working version