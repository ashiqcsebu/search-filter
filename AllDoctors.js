import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import AllDoctorsCard from "./AllDoctorsCard";

const AllDoctors = () => {
  // const [doctors, setDoctor] = useState([]);
  // useEffect(() => {
  //   fetch("http://localhost:5000/doctors")
  //     .then((res) => res.json())
  //     .then((data) => setDoctor(data));
  // }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [location, setLocation] = useState(searchParams.get("location") || "");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    updateSearchParameters({ search: event.target.value });
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
    updateSearchParameters({ location: event.target.value });
  };

  const updateSearchParameters = (params) => {
    setSearchParams({ ...searchParams, ...params });
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/search-doctor?search=${searchTerm}&&location=${location}`
        );
        const data = await response.json();
        console.log(data.doctor);
        setDoctors(data.doctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, [searchTerm, location]);

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="container mx-auto p-4 text-right">
        <h1 className="text-3xl font-bold mb-4 text-end">Search Your Doctor</h1>
        <input
          type="text"
          placeholder="Search by Speciality"
          value={searchTerm}
          onChange={handleSearchChange}
          className="border p-2 mb-4"
        />
        <select
          value={location}
          onChange={handleLocationChange}
          className="border p-2 mb-4"
        >
          <option value="">Any Location</option>
          <option value="Dhaka">Dhaka</option>
          <option value="Barishal">Barishal</option>
          <option value="Khulna">Khulna</option>
          <option value="Rajshahi">Rajshahi</option>
          <option value="Sylhet">Sylhet</option>
          <option value="Chittagong">Chittagong</option>
          <option value="Mymensing">Mymensing</option>
          <option value="Rangpur">Rangpur</option>
        </select>
      </div>
      <div>
        <div className="text-center mb-4 mt-6">
          <h2 className="text-5xl font-bold text-cyan-600">All Doctors</h2>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doc) => (
            <AllDoctorsCard key={doc._id} doc={doc}></AllDoctorsCard>
          ))}
        </div>
      </div>
    </>
  );
};

export default AllDoctors;
