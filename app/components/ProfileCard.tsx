import React from 'react';
import Image from 'next/image';

interface ProfileCardProps {
  slug: string;
  name: string;
  organization: string;
  image: string;
  rating: number;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, organization, image, rating,slug }) => {
  const handleRedirect = (slug: string) => {
    //console.log(slug);
    window.location.href = `/coach/${slug}`;
  };
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < rating ? 'text-yellow-500' : 'text-gray-300'}>★</span>
  ));

  return (
    <>
    <div  onClick={() => handleRedirect(slug)} className="min-w-[250px] w-[250px] bg-white rounded-lg shadow-md p-4 flex-shrink-0 snap-start"
            >
              <Image
                src={image}
                alt={name}
                width={200}
                height={200}
                className="rounded-lg object-cover w-full h-[200px]"
              />
              <div className="text-center mt-4">
                <h3 className="text-lg font-semibold">{name}</h3>
                <p className="text-gray-500">{organization}</p>
                <div className="mt-2 flex justify-center">
                <div className="mt-2">{stars}</div>
                </div>
              </div>
            </div>
    
    </>
  );
};

export default ProfileCard;
