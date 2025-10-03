# Brand Color Reference

## Your 3 Brand Colors

### 1. Primary - Dark Blue
```
HEX: #223142
RGB: rgb(34, 49, 66)
Usage: Headers, borders, primary text, dark mode header
```

### 2. Accent - Orange  
```
HEX: #EEA73B
RGB: rgb(238, 167, 59)
Usage: Buttons, links, highlights, hover states
```

### 3. Background - White
```
HEX: #fff / #ffffff
RGB: rgb(255, 255, 255)
Usage: Main background, light sections
```

## Additional Shades (Auto-generated for depth)

### Light Orange (for backgrounds)
```
HEX: #FFF5E6
Usage: Tag backgrounds, hover states
```

### Dark Gray (for dark mode)
```
#1a1a1a - Body background
#2d2d2d - Card/item backgrounds  
#3d3d3d - Borders in dark mode
```

## Color Usage Map

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| **Body Background** | #fff | #1a1a1a |
| **Header** | Theme default | #223142 |
| **Primary Text** | #223142 | #e0e0e0 |
| **Links** | #223142 | #EEA73B |
| **Buttons** | #223142 background | #223142 background |
| **Button Hover** | #EEA73B | #EEA73B |
| **Borders** | #223142 | #3d3d3d |
| **Tag Background** | #FFF5E6 | #223142 |
| **Tag Text** | #223142 | #EEA73B |
| **Gradients** | #223142 → #EEA73B | Same |

## Examples

### Button Gradient
```css
background: linear-gradient(135deg, #223142 0%, #EEA73B 100%);
```

### Border Accent
```css
border-left: 4px solid #223142;
```

### Tag Style
```css
background: #FFF5E6;
color: #223142;
```

### Link Hover
```css
color: #223142; /* default */
hover: color: #EEA73B;
```

## Design Principles

✅ **Minimal**: Only 3 colors + their shades
✅ **Consistent**: Same colors throughout
✅ **Accessible**: Good contrast ratios
✅ **Clean**: No unnecessary decorations
