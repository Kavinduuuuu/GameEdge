import ReviewModeration from '../components/reviews/ReviewModeration';

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Review Moderation</h1>
      </div>
      <ReviewModeration />
    </div>
  );
}
