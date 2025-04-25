export interface ReviewResponse {
    id: number;
    userName: string;
    productId: number;
    rating: number;
    comment: string;
    canEditOrDelete: boolean;
    createdAt:string;
    hasAccessToReview:boolean;
    
  }
  