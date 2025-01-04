import Header from "../components/header/header";
import Provider, { HeaderProvider } from "../providers";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <HeaderProvider>
        <Header />
      </HeaderProvider>
      <main className="flex min-h-screen flex-col">{children}</main>
    </Provider>
  );
}
