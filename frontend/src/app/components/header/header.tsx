import { SlidingPanel } from "./slidingPanel";
import HeaderInteractions from "./headerInteractions";
import HamburgerNavLinks from "./hamburgerNavLinks";
import AuthFormSwitcher from "../loginAndRegistration/authFormSwitcher";
import { getFavorites } from "@/app/lib/actions/favorites";
import { CartItems } from "@/app/models/Cart";
import Cart from "../cart/cart";
import { getCartItems } from "@/app/lib/actions/shoppingCart";
import { auth } from "@/auth";

export default async function Header() {
  const favorites = await getFavorites();
  const cartItems: CartItems[] = await getCartItems();
  const session = await auth();
  const cartItemsCount = cartItems.reduce(
    (total: number, item: CartItems) => total + item.quantity,
    0
  );

  return (
    <header>
      {/* Header buttons, links and icons */}
      <HeaderInteractions
        favoritesCount={favorites.length}
        cartItemsCount={cartItemsCount}
        session={session}
      />

      {/* Auth form modal */}
      <AuthFormSwitcher />

      {/* Sliding panels for hamburger menu */}
      <SlidingPanel side="left">
        <div className="p-4 h-full flex grow flex-col justify-between">
          <HamburgerNavLinks session={session} />
        </div>
      </SlidingPanel>

      {/* Sliding panels for cart */}
      <SlidingPanel side="right">
        <Cart cartItems={cartItems} session={session} />
      </SlidingPanel>
    </header>
  );
}
