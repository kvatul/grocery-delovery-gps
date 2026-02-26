declare module "next-auth" {
  interface User {
    name: string;
    id: string;
    email: string;
    role: string;
  }
}
export {};
