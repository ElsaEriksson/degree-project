import CheckoutHeader from "../components/header/checkoutHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CheckoutHeader></CheckoutHeader>
      <main className="flex min-h-screen flex-col p-4">{children}</main>
    </>
  );
}
