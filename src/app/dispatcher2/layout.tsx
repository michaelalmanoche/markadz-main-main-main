import Sidebar from "../dispatcher2/components/Sidebar";
import Header from "../dispatcher2/components/Header";

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-grow p-5">
          {children}
        </div>
      </div>
    </div>
  );
}