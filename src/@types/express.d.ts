declare module 'express' {
  interface Request {
    language?: string;

    user?: {
      id: number;
      code: string;
      name: string;
      phone: string;
      role: 'ADMIN' | 'USER';
    };
  }
}
