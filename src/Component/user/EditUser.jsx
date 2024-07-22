import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUser, FaEnvelope, FaPhone, FaFileImage } from "react-icons/fa";
import { FaComputer } from "react-icons/fa6";
import "./EditUser.scss";

const EditUser = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [image, setImage] = useState(null);

    const onSubmit = async (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => formData.append(key, data[key]));
        if (image) {
            formData.append("photo", image);
        }

        try {
            const response = await fetch("/api/users/update", {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            setImage(URL.createObjectURL(file));
        } else {
            setImage(null);
        }
    };

    return (
        <div className="edit-user-form">
            <h2>Edit User</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor="name">
                        <FaUser /> Name:
                    </label>
                    <input
                        id="name"
                        type="text"
                        {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && <p>{errors.name.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="firstname">
                        <FaUser /> First Name:
                    </label>
                    <input
                        id="firstname"
                        type="text"
                        {...register("firstname", { required: "First name is required" })}
                    />
                    {errors.firstname && <p>{errors.firstname.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">
                        <FaEnvelope /> Email:
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && <p>{errors.email.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">
                        <FaUser /> Password:
                    </label>
                    <input
                        id="password"
                        type="password"
                        {...register("password", { required: "Password is required" })}
                    />
                    {errors.password && <p>{errors.password.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="job">
                        <FaComputer/> Job:
                    </label>
                    <input
                        id="job"
                        type="text"
                        {...register("job")}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="contact">
                        <FaPhone /> Contact:
                    </label>
                    <input
                        id="contact"
                        type="text"
                        {...register("contact")}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="photo">
                        <FaFileImage /> Photo:
                    </label>
                    <input
                        id="photo"
                        type="file"
                        {...register("photo")}
                        onChange={handleImageChange}
                    />
                    {image && <img src={image} alt="Preview" className="image-preview" />}
                </div>
                <div className="form-group">
                    <label htmlFor="role">
                        <FaUser /> Role:
                    </label>
                    <select
                        id="role"
                        {...register("role", { required: "Role is required" })} 
                        className="roleSA"
                    >
                        <option value="superAdmin">Super Admin</option>
                        <option value="Admin">Admin</option>
                    </select>
                    {errors.role && <p>{errors.role.message}</p>}
                </div>

                <button type="submit" className="btnSave">Save Changes</button>
                <button type="submit" className="btnDelete">Delete</button>
            </form>
        </div>
    );
};

export default EditUser;
