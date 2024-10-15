// File: components/EvaluationModal.tsx

"use client"; // Ensure this is a client component
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Swal from 'sweetalert2';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface EvaluationModalProps {
  onClose: () => void;
  isOpen: boolean;
  coachId: string | null;
  playerId: string | null;
  amount: number | null;
}

const EvaluationModal: React.FC<EvaluationModalProps> = ({ isOpen, onClose, coachId, playerId,amount }) => {
  const [reviewTitle, setReviewTitle] = useState<string>('');
  const [primaryVideoUrl, setPrimaryVideoUrl] = useState<string>('');
  const [videoUrl2, setVideoUrl2] = useState<string>('');
  const [videoUrl3, setVideoUrl3] = useState<string>('');
  const [videoDescription, setVideoDescription] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);

  // Function to validate URLs
  const validateUrl = (url: string): boolean => {
    const urlPattern = new RegExp(
      '^(https?:\\/\\/)?' + // Protocol
      '((([a-zA-Z0-9$_.+!*\'(),;?&=-]+)@)?' + // Optional username
      '(([a-zA-Z0-9.-]+)\\.' + // Domain name
      '([a-zA-Z]{2,}))|' + // Extension e.g. .com, .org, etc.
      '(\\d{1,3}\\.){3}\\d{1,3}|' + // OR IP address
      '\\[([a-fA-F0-9:]+)\\])' + // OR IPv6 address
      '(\\:\\d+)?' + // Optional port
      '(\\/[-a-zA-Z0-9%_.~+@]*)*' + // Path
      '(\\?[-a-zA-Z0-9%_.~+=]*)?' + // Query string
      '(#[-a-zA-Z0-9%_.~+=]*)?$', // Fragment locator
      'i'
    );
    return urlPattern.test(url);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Reset errors

    // Client-side validation
    const newErrors: { [key: string]: string } = {};

    if (!reviewTitle) newErrors.reviewTitle = 'Review Title is required.';
    if (!primaryVideoUrl) newErrors.primaryVideoUrl = 'Primary Video URL is required.';
    if (!videoDescription) newErrors.videoDescription = 'Video Description is required.';

    // URL validation
    if (primaryVideoUrl && !validateUrl(primaryVideoUrl)) {
      newErrors.primaryVideoUrl = 'Primary Video URL is not valid. Please provide a valid URL.';
    }
    if (videoUrl2 && !validateUrl(videoUrl2)) {
      newErrors.videoUrl2 = 'Video URL #2 is not valid. Please provide a valid URL.';
    }
    if (videoUrl3 && !validateUrl(videoUrl3)) {
      newErrors.videoUrl3 = 'Video URL #3 is not valid. Please provide a valid URL.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // Simulating an API call or form submission
    try {
      const response = await fetch('/api/evaluation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewTitle,
          primaryVideoUrl,
          videoUrl2,
          videoUrl3,
          videoDescription,
          coachId,
          playerId,
        }),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      // If submission is successful, proceed to payment
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Stripe is not loaded');
      }
      const evaluationReponse=await response.json();
      console.log(evaluationReponse.result[0]);
      const paymentResponse = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ evaluationId: evaluationReponse.result[0].id, coachId:evaluationReponse.result[0].coach_id, playerId:evaluationReponse.result[0].player_id, amount:amount }), // Use the response ID from the evaluation submission
      });

      const session = await paymentResponse.json();
      console.log(session);
      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Unable to make payment right now',
          confirmButtonText: 'Proceed',
        });
      }

      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Evaluation submitted successfully. You will now be redirected for payment.',
        confirmButtonText: 'Proceed',
      });

      window.location.href = '/dashboard'; // Redirect to the dashboard after the alert is confirmed
    } catch (err: any) {
      setErrors({ general: err.message || 'An error occurred during submission.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-3/4 p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold mb-3 text-center">Submit Evaluation</h2>

        {errors.general && <p className="text-red-500 mb-4">{errors.general}</p>}

        <form onSubmit={handleSubmit}>
          {/* Review Title */}
          <div className="mb-4">
            <label htmlFor="reviewTitle" className="block text-gray-700 mb-1">
              Review Title
            </label>
            <input
  placeholder='Game against XYZ on MM/DD'
  type="text"
  id="reviewTitle"
  className={`w-full px-3 py-2 border ${errors.reviewTitle ? 'border-red-500' : 'border-gray-300'} rounded-md`}
  value={reviewTitle}
  onChange={(e) => {
    setReviewTitle(e.target.value);
    if (errors.reviewTitle) {
      const { reviewTitle, ...remainingErrors } = errors; // Remove reviewTitle from errors
      setErrors(remainingErrors);
    }
  }}
/>
            {errors.reviewTitle && <p className="text-red-500">{errors.reviewTitle}</p>}
          </div>

          {/* Video URLs in a row */}
          <div className="mb-4 flex space-x-4">
            {/* Primary Video URL */}
            <div className="flex-1">
              <label htmlFor="primaryVideoUrl" className="block text-gray-700 mb-1">
                Primary Video Link/URL
              </label>
              <input
  placeholder='www.exampleurl.com'
  type="url"
  id="primaryVideoUrl"
  className={`w-full px-3 py-2 border ${errors.primaryVideoUrl ? 'border-red-500' : 'border-gray-300'} rounded-md`}
  value={primaryVideoUrl}
  onChange={(e) => {
    setPrimaryVideoUrl(e.target.value);
    if (errors.primaryVideoUrl) {
      const { primaryVideoUrl, ...remainingErrors } = errors; // Remove primaryVideoUrl from errors
      setErrors(remainingErrors);
    }
  }}
/>

              {errors.primaryVideoUrl && <p className="text-red-500">{errors.primaryVideoUrl}</p>}
            </div>

            {/* Video URL #2 (Optional) */}
            <div className="flex-1">
              <label htmlFor="videoUrl2" className="block text-gray-700 mb-1">
                Video Link/URL #2 (Optional)
              </label>
              <input
  placeholder='www.exampleurl.com'
  type="url"
  id="videoUrl2"
  className={`w-full px-3 py-2 border ${errors.videoUrl2 ? 'border-red-500' : 'border-gray-300'} rounded-md`}
  value={videoUrl2}
  onChange={(e) => {
    setVideoUrl2(e.target.value);
    if (errors.videoUrl2) {
      const { videoUrl2, ...remainingErrors } = errors; // Remove videoUrl2 from errors
      setErrors(remainingErrors);
    }
  }}
/>
              {errors.videoUrl2 && <p className="text-red-500">{errors.videoUrl2}</p>}
            </div>

            {/* Video URL #3 (Optional) */}
            <div className="flex-1">
              <label htmlFor="videoUrl3" className="block text-gray-700 mb-1">
                Video Link/URL #3 (Optional)
              </label>
              <input
  placeholder='www.exampleurl.com'
  type="url"
  id="videoUrl3"
  className={`w-full px-3 py-2 border ${errors.videoUrl3 ? 'border-red-500' : 'border-gray-300'} rounded-md`}
  value={videoUrl3}
  onChange={(e) => {
    setVideoUrl3(e.target.value);
    if (errors.videoUrl3) {
      const { videoUrl3, ...remainingErrors } = errors; // Remove videoUrl3 from errors
      setErrors(remainingErrors);
    }
  }}
/>
              {errors.videoUrl3 && <p className="text-red-500">{errors.videoUrl3}</p>}
            </div>
          </div>

          {/* Video Description */}
          <div className="mb-4">
            <label htmlFor="videoDescription" className="block text-gray-700 mb-1">
              Video Description
            </label>
            <textarea
  id="videoDescription"
  placeholder='Provide a brief description of the video...'
  className={`w-full px-3 py-2 border ${errors.videoDescription ? 'border-red-500' : 'border-gray-300'} rounded-md`}
  value={videoDescription}
  onChange={(e) => {
    setVideoDescription(e.target.value);
    if (errors.videoDescription) {
      const { videoDescription, ...remainingErrors } = errors; // Remove videoDescription from errors
      setErrors(remainingErrors);
    }
  }}
/>
            {errors.videoDescription && <p className="text-red-500">{errors.videoDescription}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EvaluationModal;
