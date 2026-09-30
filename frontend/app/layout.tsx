import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
export const metadata = { title:"TIVRA AI", description:"AI-powered sales & lead automation platform." };
export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="en" suppressHydrationWarning><body><ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>{children}</ThemeProvider></body></html>;
}