import { Pipe, PipeTransform } from '@angular/core';
import { ReviewResponse } from '../../models/review-response.model';

@Pipe({
  name: 'avgRating',
  standalone: false
})
export class AvgRatingPipe implements PipeTransform {

  transform(reviews: ReviewResponse[]): number {
    if (!reviews || reviews.length === 0) {
      return 0;
    }
    
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }

}
