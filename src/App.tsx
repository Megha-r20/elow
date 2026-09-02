import { RouterProvider } from "react-router";
import { router } from "./routes";
import { CartProvider, WishlistProvider, ToastProvider, DrawerProvider } from "./context";

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <DrawerProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </DrawerProvider>
      </WishlistProvider>
    </CartProvider>
  );
}
