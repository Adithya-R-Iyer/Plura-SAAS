import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <ClerkProvider appearance={{ baseTheme: dark }}>{children}</ClerkProvider>
    </div>
  );
}
