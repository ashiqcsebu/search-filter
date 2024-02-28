# search-filter


[
{
"_id": "64d67dcf65a8675955e1ff25",
"name": "Doctor Medicine Seven",
"email": "d7@gmail.com",
"specialty": "Medicine",
"image": "https://i.ibb.co/HLyKcmF/doc3.jpg",
"biodata": "MBBS (DMC), MRCS (England), FCPS (Medicine).Professor at Dhaka Medical College & Hospital, Dhaka.",
"experience": 3
},

{
"_id": "64d67dcf65a8675955e1ff27",
"name": "Doctor Ear Eye and Throat Nine",
"email": "d9@gmail.com",
"specialty": "Ear Eye and Throat",
"image": "https://i.ibb.co/qgcWHVG/doc4.jpg",
"biodata": "MBBS (DMC), MRCS (England), FCPS (ENT).Assistant Professor at Khulna Medical College & Hospital, Dhaka.",
"experience": 6,
"location" : "Dhaka"
},


{
"_id": "64d68ab965a8675955fba01e",
"name": "Doctor Cardiologist Ten",
"email": "d10@gmail.com",
"specialty": "Cardiologist",
"image": "https://i.ibb.co/HLyKcmF/doc3.jpg",
"biodata": "MBBS (DMC), MRCS (USA), FCPS (Cardiology).Dhaka Medical College & Hospital, Dhaka.",
"experience": 3,
"location" : "Dhaka"
},

{
"_id": "64d7e5aa204f50f6c20fa304",
"name": "Doctor Urologist Eleven",
"email": "d11@gmail.com",
"specialty": "Urologist",
"biodata": "MBBS (DMC), MRCS (England), FCPS (Urology). Associate Professor, Department of Urology, Popular Medical College & Hospital, Dhaka.",
"image": "https://i.ibb.co/G51QQ73/doc8.jpg",
"experience": 9,
"location" : "Khulna"
},


{
"_id": "64d7fd3f6b43c54bbb76980d",
"name": "Doctor Cardiologist Seven",
"email": "d7@gmail.com",
"specialty": "Cardiologist",
"biodata": "MBBS (DMC), MRCS (England), FCPS (Cardiology). Associate Professor, Department of Urology, Popular Medical College & Hospital, Dhaka.",
"image": "https://i.ibb.co/jLXkYs5/doc9.jpg",
"experience": 19
},


{
"_id": "65de2be9c655661a45f3eb7f",
"name": "Doctor Urologist Twenty",
"email": "d20@gmail.com",
"specialty": "Urologist",
"biodata": "MBBS (DMC), MRCS (England), FCPS (Cardiology). Associate Professor, Department of Urology, Popular Medical College & Hospital, Dhaka.",
"experience": "13",
"location": "Barishal",
"image": "https://i.ibb.co/hyq9kVw/13.png"
}
]




#Search doctors by location and Specialty Backend
app.get('/search-doctor', async (req, res) => {
  try {
    const {
      search = "",
      location = "",
    } = req.query;
    
    const query = {};
    if (search) {
      query.specialty = { $regex: search, $options: "i" };
    }
    if (location) {
      query.location = location;
    }
  
    const doctors = await doctorsCollection.find(query).toArray();
    
    res.json({ doctors });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
})



////////////       ////////////////

##React front end


import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const SearchDoctor = () => {

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
          `/search-doctor?search=${searchTerm}&&location=${location}`
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
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Health Connect</h1>
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

      <h2 className="text-2xl font-bold mb-2">Doctors List</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <tbody>
          {filteredDoctors.map((doctor) => (
            <tr key={doctor._id} className="mb-2">
          
            <td className="p-2">{doctor.name}</td>
              <td className="p-2">{doctor.location}</td>
              <td className="p-2">{doctor.specialty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchDoctor;














