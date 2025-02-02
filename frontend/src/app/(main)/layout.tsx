import Footer from "../components/footer";
import Header from "../components/header/header";
import { HeaderProvider } from "../providers";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderProvider>
        <Header />
      </HeaderProvider>
      <main className="flex flex-col">{children}</main>
      <Footer></Footer>
    </>
  );
}
