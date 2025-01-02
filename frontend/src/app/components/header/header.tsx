import { SlidingPanel } from "./slidingPanel";
import CartItem from "../cart/cartItem";
import HeaderInteractions from "./headerInteractions";
import HamburgerNavLinks from "./hamburgerNavLinks";
import AuthFormSwitcher from "../loginAndRegistration/authFormSwitcher";
import { getFavorites } from "@/app/lib/actions";

export default async function Header() {
  const favorites = await getFavorites();

  return (
    <header>
      <HeaderInteractions favoritesCount={favorites.length} />

      <AuthFormSwitcher />

      <SlidingPanel side="left">
        <div className="p-4 h-full flex grow flex-col justify-between">
          <h2 className="text-xl font-bold mb-4">Menu</h2>
          <HamburgerNavLinks />
        </div>
      </SlidingPanel>

      <SlidingPanel side="right">
        <CartItem />
      </SlidingPanel>
    </header>
  );
}
