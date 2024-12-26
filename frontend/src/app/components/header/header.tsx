import AuthFormSwitcher from "../authFormSwitcher";
import { SlidingPanel } from "./slidingPanel";
import CartItem from "../cartItem";
import HeaderInteractions from "./headerInteractions";
import HamburgerNavLinks from "./hamburgerNavLinks";

export function Header() {
  return (
    <header>
      <HeaderInteractions />

      <AuthFormSwitcher />

      <SlidingPanel side="left">
        <div className="p-4 h-full flex grow flex-col justify-between">
          <h2 className="text-xl font-bold mb-4">Menu</h2>
          <HamburgerNavLinks />
        </div>
      </SlidingPanel>

      <SlidingPanel side="right">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
          <CartItem />
        </div>
      </SlidingPanel>
    </header>
  );
}
