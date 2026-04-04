export interface Review {
  id: string | number;
  rating: number;
  text: string;
  createdAt: string | Date;
  user: {
    firstName: string;
    lastName: string;
  };
}
