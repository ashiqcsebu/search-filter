import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loading from "../../Shared/Loading/Loading";

const AddDoctor = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const imageHostKey = process.env.REACT_APP_imgbb_key;

  const navigate = useNavigate();

  const { data: specialties, isLoading } = useQuery({
    queryKey: ["specialty"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/appointmentSpecialty");
      const data = await res.json();
      // console.log(data);
      return data;
    },
  });

  const locations = [
    { id: 1, location: "Dhaka" },
    { id: 2, location: "Barishal" },
    { id: 3, location: "Khulna" },
    { id: 4, location: "Rajshahi" },
    { id: 5, location: "Sylhet" },
    { id: 6, location: "Chittagong" },
    { id: 7, location: "Mymensing" },
    { id: 8, location: "Rangpur" },

  ];

  const handleAddDoctor = (data) => {
    const image = data.image[0];
    const formData = new FormData();
    formData.append("image", image);
    const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;
    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((imgData) => {
        if (imgData.success) {
          const doctor = {
            name: data.name,
            email: data.email,
            specialty: data.specialty,
            biodata: data.biodata,
            experience: data.experience,
            location: data.location,
            image: imgData.data.url,
          };

          // save doctor information to the database
          fetch("http://localhost:5000/doctors", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: `bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify(doctor),
          })
            .then((res) => res.json())
            .then((result) => {
              //  console.log(result);
              toast.success(`${data.name} is added successfully`);
              navigate("/dashboard/manage-doctors");
            });
        }
      });
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <div>
      <h1 className="text-3xl text-center font-bold text-primary">
        Add New Doctor
      </h1>
      <div className="grid justify-items-center ">
        <form onSubmit={handleSubmit(handleAddDoctor)}>
          <div className="form-control w-full max-w-xs ">
            <label className="label">
              {" "}
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter Doctor's Name"
              {...register("name", {
                required: "Name is Required",
              })}
              className="input input-bordered w-full max-w-xs"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              {" "}
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter Doctor's Email"
              {...register("email", {
                required: true,
              })}
              className="input input-bordered w-full max-w-xs"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              {" "}
              <span className="label-text">Specialty</span>
            </label>
            <select
              {...register("specialty")}
              className="select input-bordered w-full max-w-xs"
            >
              {specialties.map((specialty) => (
                <option key={specialty._id} value={specialty.name}>
                  {specialty.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              {" "}
              <span className="label-text">Location</span>
            </label>
            <select
              {...register("location")}
              className="select input-bordered w-full max-w-xs"
            >
              {locations.map((location) => (
                <option key={location._id} value={location.name}>
                  {location.location}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              {" "}
              <span className="label-text">Years of Experience</span>
            </label>
            <input
              type="text"
              placeholder="Enter ,How Many years of Experience? "
              {...register("experience", {
                required: "Experience is Required",
              })}
              className="input input-bordered w-full max-w-xs"
            />
            {errors.experience && (
              <p className="text-red-500">{errors.experience.message}</p>
            )}
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              {" "}
              <span className="label-text">Biodata</span>
            </label>
            <input
              type="text"
              placeholder="Enter Doctor's Biodata"
              {...register("biodata", {
                required: "Biodata is Required",
              })}
              className="input input-bordered w-full max-w-xs"
            />
            {errors.biodata && (
              <p className="text-red-500">{errors.biodata.message}</p>
            )}
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              {" "}
              <span className="label-text">Photo</span>
            </label>
            <input
              type="file"
              {...register("image", {
                required: "Photo is Required",
              })}
              className="input input-bordered w-full max-w-xs"
            />
            {errors.img && <p className="text-red-500">{errors.img.message}</p>}
          </div>

          <input
            className="btn btn-primary mt-4  w-80"
            value="Add Doctor"
            type="submit"
          />
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;
