import { RouterProvider } from "react-router";
import { router } from "./routes";
import { CartProvider, WishlistProvider, ToastProvider, DrawerProvider, AuthProvider } from "./context";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
    return (
      <ErrorBoundary>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <DrawerProvider>
                <ToastProvider>
                  <RouterProvider router={router}/>
                </ToastProvider>
              </DrawerProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ErrorBoundary>
    );
}
