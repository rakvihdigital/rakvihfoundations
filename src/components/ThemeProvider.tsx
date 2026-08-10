"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Suppresses the next-themes false-positive script tag warning in Next.js development mode
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) {
return;
    }
originalConsoleError.apply(console, args);
  };
}

export default function ThemeProvider({
children,
...props
}: React.ComponentProps<typeof NextThemesProvider>) {
return (
<NextThemesProvider
attribute="class"
defaultTheme="dark"
enableSystem={false}
disableTransitionOnChange
storageKey="theme-v2"
{...props}
>
{children}
</NextThemesProvider>
  );
}