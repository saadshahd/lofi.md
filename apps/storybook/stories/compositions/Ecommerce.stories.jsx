import { LofiPreview } from "../LofiPreview";

export default {
  title: "Compositions/Ecommerce",
  component: LofiPreview,
};

export const ProductCard = {
  args: {
    source: `card
  image src="https://picsum.photos/400/300" alt="Product"
  grid flow="horizontal" align="between"
    badge "New" type="success"
    text "$99.00"
  heading "Product Name"
  text "Short product description goes here." muted=1
  grid flow="horizontal" gap="2"
    button "Add to Cart" primary=1
    button "Wishlist"`,
  },
};

export const ProductGrid = {
  args: {
    source: `page "Products"
  grid flow="vertical" gap="4"
    grid align="between" items="center"
      grid
        link "All"
        link "Electronics" active=1
        link "Clothing"
        link "Home"
      input placeholder="Search products..."
    grid cols="3" gap="4"
      card
        grid flow="vertical" gap=3
          image src="https://picsum.photos/400/300?1" alt="Product 1"
          heading "Headphones"
          text "$129.00"
          button "Add to Cart" primary=1
      card
        grid flow="vertical" gap=3
          image src="https://picsum.photos/400/300?2" alt="Product 2"
          heading "Smart Watch"
          text "$299.00"
          button "Add to Cart" primary=1
      card
        grid flow="vertical" gap=3
          image src="https://picsum.photos/400/300?3" alt="Product 3"
          heading "Bluetooth Speaker"
          text "$79.00"
          button "Add to Cart" primary=1`,
  },
};

export const Checkout = {
  args: {
    source: `page "Checkout"
  breadcrumb
    link "Cart"
    link "Shipping"
    link "Payment"
  grid cols="2" gap="4"
    card
      heading "Payment"
      form
        input "Card Number" placeholder="1234 5678 9012 3456"
        grid cols="2" gap="2"
          input "Expiry" placeholder="MM/YY"
          input "CVC" placeholder="123"
        button "Place Order" primary=1
    card
      heading "Order Summary"
      md
        | Item | Price |
        |------|-------|
        | Product 1 | $99.00 |
        | Product 2 | $49.00 |
        | Shipping | $9.00 |
        | **Total** | **$157.00** |
    card
      heading "Shipping Address"
      form
        input "Full Name"
        input "Address"
        grid cols="2" gap="2"
          input "City"
          input "Zip Code"
        dropdown "Country" options="USA,Canada,UK"`,
  },
};
