"use client"; // Ensure this is a client component

import { useEffect, useState } from 'react';
import { Metadata } from 'next';
import { API_URL, BASEURL, SECRET_KEY } from '../../../lib/constants';
import Image from 'next/image';
import LoginModal from '../../components/LoginModal'; // Import the modal
import EvaluationModal from '@/app/components/EvaluationModal';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Loading from '@/app/components/Loading';

interface CoachData {
  id: string; // or number depending on your data structure
  firstName: string;
  lastName: string;
  image: string;
  rating: number;
  createdAt: string; // or Date if your API returns a Date object
  expectedCharge: number;
  slug: string; // If slug is part of the response
}

interface CoachProfileProps {
  params: {
    slug: string;
  };
}

// Coach profile component
const CoachProfile = ({ params }: CoachProfileProps) => {
  const { slug } = params;

  // State for managing coach data and modal visibility
  const [coachData, setCoachData] = useState<CoachData | null>(null); // Use CoachData type
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isevaludationModalopen, setIsevaluationModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const { data: session } = useSession();
  // Fetch coach data
  useEffect(() => {
    const payload={
      slug:slug
    }
    const fetchCoachData = async () => {
      try {
        const response = await fetch(`/api/coachprofile/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Coach not found');
        }


        const data: CoachData = await response.json(); // Specify the type of data
        console.log(data); // Log the entire data object to inspect its structure
        setCoachData(data);
      } catch (err) {
        setError("Some error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoachData();
    setPlayerId(session?.user?.id || null);
  
  }, [session,slug]); // Only re-run the effect if the slug changes

  // Handle loading and error states
  if (loading) {
    return <Loading/>; // Loading indicator
  }
  if (error) return <div>{error}</div>;
  if (!coachData) return <div>Coach not found</div>;

  const joiningDate = new Date(coachData.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 flex items-center justify-center">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
          <div className="flex justify-center mb-6">
            {/* Profile Picture */}
            <div className="relative w-32 h-32">
              
              <Image
                src={coachData.image}
                alt="Profile Picture"
                className="rounded-full"
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>
          </div>

          <div className="text-center">
            {/* Name */}
            <h1 className="text-2xl font-bold text-gray-800">{coachData.firstName} {coachData.lastName}</h1>
            {/* Website */}
            <p className="text-sm text-gray-500">socaltraining.com</p>

            {/* Rating */}
            <div className="mt-4">
              <div className="flex justify-center items-center space-x-1">
                {/* Stars (use icons here if you'd like) */}
                {[...Array(5)].map((_, i) => (
                   <span key={i} className={i < coachData.rating ? 'text-yellow-500' : 'text-gray-400'}>
                   ★
                 </span>
                ))}
              </div>
            </div>

            {/* Average completion time */}
            <div className="mt-4 flex justify-center items-center text-sm text-gray-500">
              <span>⏱</span>
              <p className="ml-2">Average completion time: 2 days</p>
            </div>

            {/* Join Date */}
            <div className="mt-2 flex justify-center items-center text-sm text-gray-500">
              <span>📅</span>
              <p className="ml-2">Joined {joiningDate}</p>
            </div>
            {session ? (
              <div className="mt-2 flex justify-center items-center text-sm text-gray-500">
                <span>Rate</span>
                <p className="ml-2">  ${coachData.expectedCharge}</p>
              </div>
            ) : (
              <></>
            )}

            {!session ? (
              <>
                <button
                  onClick={() => setIsModalOpen(true)} // Open modal on click
                  className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Sign in to book
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsevaluationModalOpen(true)} // Open modal on click
                className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Proceed to Evaluation
              </button>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <LoginModal isOpen={isModalOpen} coachslug={coachData.slug} onClose={() => setIsModalOpen(false)} />
      )}

{isevaludationModalopen && playerId && (
  <EvaluationModal
  amount={coachData.expectedCharge}
    isOpen={isevaludationModalopen}
    coachId={coachData.id} 
    playerId={playerId} 
    onClose={() => setIsevaluationModalOpen(false)} 
  />
)}
    </>
  );
};

export default CoachProfile;
