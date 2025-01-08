import { SlidingPanel } from "./slidingPanel";
import HeaderInteractions from "./headerInteractions";
import HamburgerNavLinks from "./hamburgerNavLinks";
import AuthFormSwitcher from "../loginAndRegistration/authFormSwitcher";
import { getCartItems, getFavorites } from "@/app/lib/actions";
import { CartItems } from "@/app/models/Cart";
import Cart from "../cart/cart";

export default async function Header() {
  const favorites = await getFavorites();
  const cartItems: CartItems[] = await getCartItems();

  const cartItemsCount = cartItems.reduce(
    (total: number, item: CartItems) => total + item.quantity,
    0
  );

  return (
    <header>
      <HeaderInteractions
        favoritesCount={favorites.length}
        cartItemsCount={cartItemsCount}
      />

      <AuthFormSwitcher />

      <SlidingPanel side="left">
        <div className="p-4 h-full flex grow flex-col justify-between">
          <HamburgerNavLinks />
        </div>
      </SlidingPanel>

      <SlidingPanel side="right">
        <Cart cartItems={cartItems} />
      </SlidingPanel>
    </header>
  );
}
