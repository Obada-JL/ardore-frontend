# Frontend Price Per Size Migration Guide

## What Changed

The frontend has been updated to support the new price-per-size structure from the backend API.

### Old Structure:
```javascript
perfume: {
  title: { ar: "عطر", en: "Perfume" },
  price: 50,
  sizes: [30, 50, 100]
}
```

### New Structure:
```javascript
perfume: {
  title: { ar: "عطر", en: "Perfume" },
  sizesPricing: [
    { size: 30, price: 45 },
    { size: 50, price: 65 },
    { size: 100, price: 95 }
  ],
  sizes: [30, 50, 100] // Kept for backward compatibility
}
```

## Updated Components

### 1. **Perfume Detail Page** (`app/[locale]/perfume/[urlName]/page.js`)
- **Price Display**: Shows selected size price or price range
- **Size Selection**: Each size button now shows its price
- **Cart Integration**: Uses correct price for selected size

### 2. **Perfumes Listing** (`app/[locale]/perfumes/page.js`)
- **Price Range Display**: Shows "$45 - $95" or single price if all same
- **Size Badges**: Hovering shows individual size prices

### 3. **Home Page** (`app/[locale]/page.js`)
- **Favorites Display**: Shows price ranges for perfumes

### 4. **Cart & Favorites Sidebars**
- **Price Calculation**: Uses size-specific pricing
- **Backward Compatibility**: Falls back to old structure if needed

### 5. **Checkout & Orders**
- **Order Items**: Correctly displays size-based prices
- **Price Calculations**: Uses stored item prices from orders

## Helper Functions Added

### Price Display Helper
```javascript
const getPerfumePriceDisplay = (perfume) => {
  if (perfume.sizesPricing && perfume.sizesPricing.length > 0) {
    const prices = perfume.sizesPricing.map(sp => sp.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (minPrice === maxPrice) {
      return `$${minPrice}`;
    } else {
      return `$${minPrice} - $${maxPrice}`;
    }
  }
  return `$${perfume.price || 0}`;
};
```

### Size-Specific Price Helper
```javascript
const getPriceForSize = (perfume, size) => {
  if (perfume?.sizesPricing && perfume.sizesPricing.length > 0) {
    const sizePricing = perfume.sizesPricing.find(sp => sp.size === size);
    return sizePricing ? sizePricing.price : null;
  }
  return perfume?.price || 0;
};
```

## Backward Compatibility

All components maintain backward compatibility with the old pricing structure:

```javascript
// Always check for new structure first, fallback to old
const price = perfume.sizesPricing?.find(sp => sp.size === selectedSize)?.price 
  || perfume.price 
  || 0;
```

## Cart Functionality

When adding items to cart with new structure:

```javascript
const handleAddToCart = (perfume, size, quantity) => {
  let price;
  
  if (perfume.sizesPricing?.length > 0) {
    const sizePricing = perfume.sizesPricing.find(sp => sp.size === size);
    price = sizePricing?.price || perfume.price || 0;
  } else {
    price = perfume.price || 0;
  }
  
  // Add to cart with calculated price
  addToCart(perfume, quantity, size, quality, price);
};
```

## Testing

1. **New Perfumes**: Should display individual prices per size
2. **Old Perfumes**: Should fall back to original price for all sizes
3. **Cart Operations**: Should use correct pricing for each size
4. **Order Display**: Should show accurate historical prices

## Benefits

1. **Flexible Pricing**: Different prices for different sizes
2. **Better UX**: Clear price display per size option
3. **Accurate Pricing**: Size-specific pricing in cart and orders
4. **Backward Compatibility**: Existing perfumes continue to work
5. **Price Transparency**: Users see exact prices before selection 