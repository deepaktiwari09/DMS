import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "../routes/routes";

// Create router instance
export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

// Register types for better TypeScript support
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export type Router = typeof router;

// Router component
export function AppRouter() {
  return <RouterProvider router={router} />;
}
