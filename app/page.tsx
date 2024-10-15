"use client";
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import SocccerField from './public/images/soccer-field.jpg';
import Footer from './components/Footer';
import Head from 'next/head';
import ProfileCard from './components/ProfileCard';
import Loading from './components/Loading';

// Define the types for the coaches' data

export default function Home(): JSX.Element {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [profiles, setProfiles] = useState<any[]>([]); // Initialize as an empty array
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Scroll handling
  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= 300;
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += 300;
    }
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch('/api/coach/signup'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch profiles');
        }
        const data = await response.json();
        console.log(data);
        setProfiles(data); // Assuming the data is an array of profiles
      } catch (err) {
        setError("Some error occured");
      } finally {
        setLoading(false); // Set loading to false after the fetch is complete
      }
    };

    fetchProfiles();
  }, []);

  if (loading) {
    return <Loading/>; // Loading indicator
  }

  if (error) {
    return <div>Error: {error}</div>; // Error message
  }

  return (
    <>
      <Head>
        <title>Home - My Next App</title>
        <meta name="description" content="This is the home page of my Next.js application." />
      </Head>
      <div className="max-w-7xl mx-auto px-4 mt-24 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center py-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Find coaches that specialize in{' '}
            <span className="text-blue-600">Youth Soccer</span>
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            D1 Notes is setting the standard for game film evaluation that offers
            young athletes the edge they have been missing.
          </p>
        </div>

        {/* Scrollable Thumbnails Section */}
        <div className="relative">
          {/* Horizontal scrolling container */}
          <div
            className="flex overflow-x-auto space-x-4 scrollbar-hide scroll-smooth snap-x snap-mandatory"
            ref={scrollRef}
          >
            {profiles.map((coach, index) => (
              <ProfileCard
              key={coach.id || index}
              name={coach.firstName}
              image={coach.image}
              organization={coach.clubName}
              rating={coach.rating}
              slug={coach.slug}
              
              /> 
              
               
            ))}
          </div>

          {/* Scroll Buttons */}
          <button
            onClick={handleScrollLeft}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full z-10"
          >
            ←
          </button>
          <button
            onClick={handleScrollRight}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full z-10"
          >
            →
          </button>
        </div>
      </div>
      
      {/* Additional content like "How it Works" and Footer... */}
    </>
  );
}
