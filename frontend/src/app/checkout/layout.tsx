import CheckoutHeader from "../components/header/checkoutHeader";
import Provider from "../providers";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Provider>
        <CheckoutHeader></CheckoutHeader>
        <main className="flex min-h-screen flex-col p-4">{children}</main>
      </Provider>
    </>
  );
}
