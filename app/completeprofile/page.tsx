"use client";

import { useState, useRef } from "react";
import Header from "../components/Header";
import Brand from "../public/images/brand.jpg";
import Image from "next/image";
import DefaultPic from "../public/default.jpg";
import { useSession } from "next-auth/react";

interface FormValues {
  first_name: string;
  last_name: string;
  grade_level: string;
  location: string;
  birthday: string;
  gender: string;
  sport: string;
  team: string;
  position: string;
  number: string;
  image: string | null; // Updated to store Base64 string
}

export default function Register() {
  const [formValues, setFormValues] = useState<FormValues>({
    first_name: "",
    last_name: "",
    grade_level: "",
    location: "",
    birthday: "",
    gender: "",
    sport: "",
    team: "",
    position: "",
    number: "",
    image: null,
  });

  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Partial<FormValues>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false); 
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validation
    const newErrors: Partial<FormValues> = {};
    if (!formValues.image) {
        newErrors.image = "Profile image is required";
    } else {
        // Calculate the approximate size of the base64 string
        const imageSizeInBytes = (formValues.image.length * 3) / 4;
        if (imageSizeInBytes > 2 * 1024 * 1024) {
            newErrors.image = "Image size must be less than 2MB";
        }
    }
    if (!formValues.first_name.trim()) newErrors.first_name = "First name is required.";
    if (!formValues.last_name.trim()) newErrors.last_name = "Last name is required.";
    if (!formValues.location.trim()) newErrors.location = "Location is required.";
    if (!formValues.birthday) newErrors.birthday = "Birthday is required.";
    if (!formValues.grade_level) newErrors.grade_level = "Grade level is required.";
    if (!formValues.gender) newErrors.gender = "Gender is required.";
    if (!formValues.sport) newErrors.sport = "Sport is required.";
    if (!formValues.team.trim()) newErrors.team = "Team is required.";
    if (!formValues.position.trim()) newErrors.position = "Position is required.";
    if (!formValues.number.trim()) newErrors.number = "Number is required.";

    // Set validation errors if any
    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      return;
    }

    const formData = new FormData();

    // Append all form values to FormData
    for (const key in formValues) {
      const value = formValues[key as keyof FormValues];
      formData.append(key, value as string | Blob);
    }

    if (session && session.user.id) {
      formData.append("playerID", session.user.id); // Assuming user.id is the ID
    } else {
      setError("User is not authenticated");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/register", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong!");
      }

      const data = await response.json();
      localStorage.setItem("userImage", data.image);
      window.location.href = "/dashboard"; // Redirect after successful registration
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Something went wrong!");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
    setValidationErrors({ ...validationErrors, [name]: "" }); // Clear error when input is changed
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormValues({ ...formValues, image: reader.result as string });
      };

      if (file) {
        reader.readAsDataURL(file); // Convert the image file to base64
      }
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file input click
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:space-x-6">
        <div className="w-full lg:w-1/2 justify-center bg-white-500 p-4 ">
          <div className="bg-white rounded-lg p-12  w-full m-auto ">
            <h2 className="text-3xl font-bold mb-6 text-left">Add Your Personal Information</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2 mb-4">
               
                <div className="items-center cursor-pointer" onClick={handleImageClick}>
                  <Image
                    src={formValues.image ? formValues.image : DefaultPic} 
                    alt="Profile Image"
                    width={100}
                    height={100}
                    className="rounded-full m-auto"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  {validationErrors.image && <p className="text-red-500 items-center text-sm">{validationErrors.image}</p>}
                </div>
              </div>

              {/* First Name */}
              <div>
                <label htmlFor="first_name" className="block text-gray-700 text-sm font-semibold mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                  value={formValues.first_name}
                  onChange={handleChange}
                />
                {validationErrors.first_name && <p className="text-red-500 text-sm">{validationErrors.first_name}</p>}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="last_name" className="block text-gray-700 text-sm font-semibold mb-2">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                  value={formValues.last_name}
                  onChange={handleChange}
                />
                {validationErrors.last_name && <p className="text-red-500 text-sm">{validationErrors.last_name}</p>}
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-gray-700 text-sm font-semibold mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                  value={formValues.location}
                  onChange={handleChange}
                />
                {validationErrors.location && <p className="text-red-500 text-sm">{validationErrors.location}</p>}
              </div>

              {/* Birthday */}
              <div>
                <label htmlFor="birthday" className="block text-gray-700 text-sm font-semibold mb-2">Birthday</label>
                <input
                  type="date"
                  name="birthday"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                  value={formValues.birthday}
                  onChange={handleChange}
                />
                {validationErrors.birthday && <p className="text-red-500 text-sm">{validationErrors.birthday}</p>}
              </div>

              {/* Grade Level */}
              <div>
                <label htmlFor="grade_level" className="block text-gray-700 text-sm font-semibold mb-2">Grade Level</label>
                <select
                  name="grade_level"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                  value={formValues.grade_level}
                  onChange={handleChange}
                >
                  <option value="">Select Grade Level</option>
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                </select>
                {validationErrors.grade_level && <p className="text-red-500 text-sm">{validationErrors.grade_level}</p>}
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-gray-700 text-sm font-semibold mb-2">Gender</label>
                <select
                  name="gender"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                  value={formValues.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {validationErrors.gender && <p className="text-red-500 text-sm">{validationErrors.gender}</p>}
              </div>

              {/* Sport */}
              <div>
                <label htmlFor="sport" className="block text-gray-700 text-sm font-semibold mb-2">Sport</label>
                <select
                  name="sport"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                  value={formValues.sport}
                  onChange={handleChange}
                >
                  <option value="">Select Sport</option>
                  <option value="Football">Football</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Soccer">Soccer</option>
                  <option value="Baseball">Baseball</option>
                  <option value="Volleyball">Volleyball</option>
                </select>
                {validationErrors.sport && <p className="text-red-500 text-sm">{validationErrors.sport}</p>}
              </div>

              {/* Team */}
              <div>
                <label htmlFor="team" className="block text-gray-700 text-sm font-semibold mb-2">Team</label>
                <input
                  type="text"
                  name="team"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                  value={formValues.team}
                  onChange={handleChange}
                />
                {validationErrors.team && <p className="text-red-500 text-sm">{validationErrors.team}</p>}
              </div>

              {/* Position */}
              <div>
                <label htmlFor="position" className="block text-gray-700 text-sm font-semibold mb-2">Position</label>
                <input
                  type="text"
                  name="position"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                  value={formValues.position}
                  onChange={handleChange}
                />
                {validationErrors.position && <p className="text-red-500 text-sm">{validationErrors.position}</p>}
              </div>

              {/* Number */}
              <div>
                <label htmlFor="number" className="block text-gray-700 text-sm font-semibold mb-2">Number</label>
                <input
                  type="text"
                  name="number"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                  value={formValues.number}
                  onChange={handleChange}
                />
                {validationErrors.number && <p className="text-red-500 text-sm">{validationErrors.number}</p>}
              </div>

              {/* Submit Button */}
              <div className="col-span-2">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                  disabled={loading}
                >
                   {loading ? 'Completing Your profile...' : 'Submit & Complete Profile'}
                  
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="hidden md:block flex-1 bg-gray-100 relative">
          <Image src={Brand} alt="Brand Image" layout="fill" objectFit="cover" />
        </div>
      </div>
    </>
  );
}
