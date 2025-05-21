import React, { useState } from "react";
import axios from "axios";
import "../styles/Dashboard.css";
import { POST_OPTIONS } from "../constants/posts";
import { CATEGORY_OPTIONS } from "../constants/posts";
import { GENDER_OPTIONS } from "../constants/posts";
import { useEffect } from "react";
import dsl from "../assets/dsl.png";

const getFormDataKey = () => {
  const userEmail = localStorage.getItem("userEmail");
  return `applicationFormData_${userEmail}`;
};


export default function ApplicationForm() {
  const [general, setGeneral] = useState({
    name: "",
    dob: "",
    age: "",
    fatherName: "",
    contact: "",
    category: "",
    gender: "",
    nationality: "",
    email: "",
    address: "",
    permanentAddress: "",
  });
  const [photo, setPhoto] = useState(null);

  const [education, setEducation] = useState([
    {
      examination: "10th",
      passingYear: "",
      course: "",
      duration: "",
      subjects: "",
      percentage: "",
      boardName: "",
      document: null,
    },
    {
      examination: "12th",
      passingYear: "",
      course: "",
      duration: "",
      subjects: "",
      percentage: "",
      boardName: "",
      document: null,
    },
    {
      examination: "Graduation",
      passingYear: "",
      course: "",
      duration: "",
      subjects: "",
      percentage: "",
      boardName: "",
      document: null,
    },
  ]);

  const [experience, setExperience] = useState([
    { organization: "", designation: "", from: "", to: "" },
  ]);
  const [achievements, setAchievements] = useState([
    { title: "", document: null },
  ]);
  const [postApplied, setPostApplied] = useState("");
  const [optionalDocs, setOptionalDocs] = useState([
    {
      title: "",
      document: null,
    },
  ]);
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const [signature, setSignature] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || user.role !== "user") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        window.location = "/";
      }
    }, 1000); 

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      const key = `applicationFormData_${userEmail}`;
      const savedData = localStorage.getItem(key);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setGeneral(parsedData.general || {});
          setEducation(parsedData.education || []);
          setExperience(parsedData.experience || []);
          setAchievements(parsedData.achievements || []);
          setPostApplied(parsedData.postApplied || "");
          setOptionalDocs(parsedData.optionalDocs || []);
          setDeclarationChecked(parsedData.declarationChecked || false);
        } catch (error) {
          console.error("Error loading saved form data:", error);
        }
      }
    }
  }, []);
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const response = await axios.get("/api/application/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Authentication test successful:", response.data);
      } catch (error) {
        console.error(
          "Authentication test failed:",
          error.response?.data || error.message
        );
      }
    };

    checkAuthStatus();
  }, []);

  const saveFormData = () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) return;

      const formData = {
        general,
        education,
        experience,
        achievements,
        postApplied,
        optionalDocs,
        declarationChecked,
      };
      const key = `applicationFormData_${userEmail}`;
      localStorage.setItem(key, JSON.stringify(formData));
    } catch (error) {
      console.error("Error saving form data:", error);
    }
  };

  const loadFormData = () => {
    const savedData = localStorage.getItem(getFormDataKey());
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setGeneral(parsedData.general || {});
        setEducation(parsedData.education || []);
        setExperience(parsedData.experience || []);
        setAchievements(parsedData.achievements || []);
        setPostApplied(parsedData.postApplied || "");
        setOptionalDocs(parsedData.optionalDocs || []);
        setDeclarationChecked(parsedData.declarationChecked || false);
      } catch (error) {
        console.error("Error loading saved form data:", error);
      }
    }
  };

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    const updatedGeneral = { ...general, [name]: value };
    setGeneral(updatedGeneral);
    saveFormData();
  };

  const handleEducationChange = (idx, e) => {
    const updated = [...education];
    if (e.target.type === "file") {
      updated[idx][e.target.name] = e.target.files[0];
    } else {
      updated[idx][e.target.name] = e.target.value;
    }
    setEducation(updated);
    saveFormData();
  };

  const handleExperienceChange = (idx, e) => {
    const updated = [...experience];
    updated[idx][e.target.name] = e.target.value;
    setExperience(updated);
    saveFormData();
  };

  const handleAchievementsChange = (idx, e) => {
    const updated = [...achievements];
    if (e.target.type === "file") {
      updated[idx][e.target.name] = e.target.files[0];
    } else {
      updated[idx][e.target.name] = e.target.value;
    }
    setAchievements(updated);
    saveFormData();
  };

  const handleLogout = () => {
    try {
      const formData = {
        general,
        education,
        experience,
        achievements,
        postApplied,
        optionalDocs,
        declarationChecked,
      };
      const userEmail = localStorage.getItem("userEmail");
      const key = `applicationFormData_${userEmail}`;
      localStorage.setItem(key, JSON.stringify(formData));

      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");

      window.location = "/";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const addExperience = () => {
    const updated = [
      ...experience,
      { organization: "", designation: "", from: "", to: "" },
    ];
    setExperience(updated);
    saveFormData();
  };

  const removeExperience = (indexToRemove) => {
    const updated = experience.filter((_, index) => index !== indexToRemove);
    setExperience(updated);
    saveFormData();
  };

  const handleLoginSuccess = (response) => {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("userEmail", response.data.email);
    window.location = "/dashboard";
  };

  const addAchievement = () => {
    const updated = [...achievements, { title: "", document: null }];
    setAchievements(updated);
    saveFormData();
  };

  const removeAchievement = (indexToRemove) => {
    const updated = achievements.filter((_, index) => index !== indexToRemove);
    setAchievements(updated);
    saveFormData();
  };

  const handleOptionalDocs = (e) => setOptionalDocs([...e.target.files]);

  const handleOptionalDocsChange = (index, e) => {
    const updated = [...optionalDocs];
    if (e.target.type === "file") {
      updated[index] = { ...updated[index], document: e.target.files[0] };
    } else {
      updated[index] = { ...updated[index], [e.target.name]: e.target.value };
    }
    setOptionalDocs(updated);
    saveFormData();
  };

  const addOptionalDoc = () => {
    const updated = [...optionalDocs, { title: "", document: null }];
    setOptionalDocs(updated);
    saveFormData();
  };

  const removeOptionalDoc = (indexToRemove) => {
    if (optionalDocs.length > 1) {
      const updated = optionalDocs.filter(
        (_, index) => index !== indexToRemove
      );
      setOptionalDocs(updated);
      saveFormData();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      const generalData = { ...general };
      formData.append("general", JSON.stringify(generalData));

      if (photo instanceof File) {
        formData.append("photo", photo);
      }

      formData.append(
        "education",
        JSON.stringify(
          education.map((edu) => {
            const { document, ...rest } = edu;
            return rest;
          })
        )
      );

      education.forEach((edu, index) => {
        if (edu.document instanceof File) {
          formData.append(`educationDoc_${index}`, edu.document);
        }
      });

      formData.append("experience", JSON.stringify(experience));

      formData.append(
        "achievements",
        JSON.stringify(
          achievements.map((ach) => {
            const { document, ...rest } = ach;
            return rest;
          })
        )
      );

      achievements.forEach((ach, index) => {
        if (ach.document instanceof File) {
          formData.append(`achievementDoc_${index}`, ach.document);
        }
      });

      formData.append(
        "optionalDocs",
        JSON.stringify(
          optionalDocs.map((doc) => {
            const { document, ...rest } = doc;
            return rest;
          })
        )
      );

      optionalDocs.forEach((doc, index) => {
        if (doc.document instanceof File) {
          formData.append(`optionalDoc_${index}`, doc.document);
        }
      });

      formData.append("postApplied", postApplied);
      formData.append("declarationChecked", declarationChecked.toString());

      if (signature instanceof File) {
        formData.append("signature", signature);
      }

      formData.append("userEmail", localStorage.getItem("userEmail"));

      console.log("Submitting form data...");
      for (let pair of formData.entries()) {
        console.log(
          pair[0] + ": " + (pair[1] instanceof File ? pair[1].name : pair[1])
        );
      }

      const response = await axios.post("/api/application/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        timeout: 60000, 
      });

      if (response.data.success) {
        const userEmail = localStorage.getItem("userEmail");
        const key = `applicationFormData_${userEmail}`;
        localStorage.removeItem(key);
        alert("Application submitted successfully!");
        window.location = "/dashboard";
      }
    } catch (err) {
      console.error("Submission error:", err);

      if (err.response) {
        console.error("Response error data:", err.response.data);
        console.error("Response error status:", err.response.status);

        if (err.response.data?.error) {
          alert(`Error: ${err.response.data.error}`);
        } else {
          alert(`Submission error: ${err.response.status}`);
        }
      } else if (err.request) {
        console.error("Request error:", err.request);
        if (err.code === "ECONNABORTED") {
          alert(
            "Request timed out. Your form may be too large or your connection too slow."
          );
        } else {
          alert(
            "No response received from server. Please check your connection and try again."
          );
        }
      } else {
        alert(`Error preparing request: ${err.message}`);
      }

      saveFormData();
    }
  };

  return (
    <>
      <div className="logo-header">
        <img src={dsl} alt="Dyal Singh College" className="college-logo" />
      </div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="section">
          <div className="section-header">
            <h2>General Details</h2>
            <button type="button" className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
          <div className="form-row">
            <input
              name="name"
              className="form-input"
              placeholder="Name"
              value={general.name || ""}
              onChange={handleGeneralChange}
              required
            />
            <p>Date of Birth:</p>
            <input
              name="dob"
              type="date"
              className="form-input"
              placeholder="Date of Birth"
              value={general.dob || ""}
              onChange={handleGeneralChange}
              required
            />
            <input
              name="age"
              className="form-input"
              placeholder="Age"
              value={general.age || ""}
              onChange={handleGeneralChange}
              required
            />
            <input
              name="fatherName"
              className="form-input"
              placeholder="Father's Name"
              value={general.fatherName || ""}
              onChange={handleGeneralChange}
              required
            />
            <input
              name="contact"
              className="form-input"
              placeholder="Contact"
              value={general.contact || ""}
              onChange={handleGeneralChange}
              required
            />
            <select
              name="category"
              className="form-input"
              value={general.category || ""}
              onChange={handleGeneralChange}
              required
            >
              <option value="">Select Category</option>
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              name="gender"
              className="form-input"
              value={general.gender || ""}
              onChange={handleGeneralChange}
              required
            >
              <option value="">Gender</option>
              {GENDER_OPTIONS.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>

            <input
              name="nationality"
              className="form-input"
              placeholder="Nationality"
              value={general.nationality || ""}
              onChange={handleGeneralChange}
              required
            />
            <input
              name="email"
              className="form-input"
              type="email"
              placeholder="Email"
              value={general.email || ""}
              onChange={handleGeneralChange}
              required
            />
            <input
              name="address"
              className="form-input"
              placeholder="Correspondence Address"
              value={general.address || ""}
              onChange={handleGeneralChange}
              required
            />
            <input
              name="permanentAddress"
              className="form-input"
              placeholder="Permanent Address"
              value={general.permanentAddress || ""}
              onChange={handleGeneralChange}
              required
            />
            <div className="file-input-wrapper">
              <label className="file-input-label">
                Passport Size Photo
                <input
                  type="file"
                  className="file-input"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  required
                />
              </label>
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Education Details</h2>
          {education.map((edu, idx) => (
            <div key={idx} className="education-section">
              <h4>{edu.examination}</h4>
              <div className="form-row">
                <input
                  name="passingYear"
                  className="form-input"
                  placeholder="Passing Year"
                  value={edu.passingYear || ""}
                  onChange={(e) => handleEducationChange(idx, e)}
                  required
                />
                <input
                  name="course"
                  className="form-input"
                  placeholder="Course"
                  value={edu.course || ""}
                  onChange={(e) => handleEducationChange(idx, e)}
                  required
                />
                <input
                  name="duration"
                  className="form-input"
                  placeholder="Duration"
                  value={edu.duration || ""}
                  onChange={(e) => handleEducationChange(idx, e)}
                  required
                />
                <input
                  name="subjects"
                  className="form-input"
                  placeholder="Subjects"
                  value={edu.subjects || ""}
                  onChange={(e) => handleEducationChange(idx, e)}
                  required
                />
                <input
                  name="percentage"
                  className="form-input"
                  placeholder="Percentage / CGPA"
                  value={edu.percentage || ""}
                  onChange={(e) => handleEducationChange(idx, e)}
                  required
                />
                <input
                  name="boardName"
                  className="form-input"
                  placeholder="Board Name"
                  value={edu.boardName || ""}
                  onChange={(e) => handleEducationChange(idx, e)}
                  required
                />
                <div className="file-input-wrapper">
                  <label className="file-input-label">
                    Supporting Document
                    <input
                      type="file"
                      className="file-input"
                      onChange={(e) => handleEducationChange(idx, e)}
                      name="document"
                      required={edu.examination === "10th"}
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="section">
          <h2 className="section-title">Working Experience</h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="experience-section">
              <div className="card-header">
                <h4>Experience {idx + 1}</h4>
                {idx > 0 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeExperience(idx)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="form-row">
                <input
                  name="organization"
                  className="form-input"
                  placeholder="Organization"
                  value={exp.organization || ""}
                  onChange={(e) => handleExperienceChange(idx, e)}
                />
                <input
                  name="designation"
                  className="form-input"
                  placeholder="Designation"
                  value={exp.designation || ""}
                  onChange={(e) => handleExperienceChange(idx, e)}
                />
                <div className="date-input">
                  <label>From:</label>
                  <input
                    name="from"
                    type="date"
                    className="form-input"
                    value={exp.from || ""}
                    onChange={(e) => handleExperienceChange(idx, e)}
                  />
                </div>
                <div className="date-input">
                  <label>To:</label>
                  <input
                    name="to"
                    type="date"
                    className="form-input"
                    value={exp.to || ""}
                    onChange={(e) => handleExperienceChange(idx, e)}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="add-more-btn"
            onClick={addExperience}
          >
            +
          </button>
        </div>

        <div className="section">
          <h2 className="section-title">Achievements</h2>
          {achievements.map((ach, idx) => (
            <div key={idx} className="achievement-section">
              <div className="card-header">
                <h4>Achievement {idx + 1}</h4>
                {idx > 0 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeAchievement(idx)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="form-row">
                <input
                  name="title"
                  className="form-input"
                  placeholder="Award/Achievement"
                  value={ach.title || ""}
                  onChange={(e) => handleAchievementsChange(idx, e)}
                />
                <div className="file-input-wrapper">
                  <label className="file-input-label">
                    Supporting Document
                    <input
                      type="file"
                      className="file-input"
                      name="document"
                      onChange={(e) => handleAchievementsChange(idx, e)}
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="add-more-btn"
            onClick={addAchievement}
          >
            +
          </button>
        </div>

        <div className="section">
          <h2 className="section-title">Post Applied For</h2>
          <div className="form-row">
            <select
              className="form-input"
              value={postApplied}
              onChange={(e) => {
                setPostApplied(e.target.value);
                saveFormData();
              }}
              required
            >
              <option value="">Select Post to Apply</option>
              {POST_OPTIONS.map((post) => (
                <option key={post} value={post}>
                  {post}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Optional Documents</h2>
          {optionalDocs.map((doc, idx) => (
            <div key={idx} className="optional-doc-section">
              <div className="card-header">
                <h4>Document {idx + 1}</h4>
                {idx > 0 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeOptionalDoc(idx)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="form-row">
                <input
                  name="title"
                  className="form-input"
                  placeholder="Document Description"
                  value={doc.title}
                  onChange={(e) => handleOptionalDocsChange(idx, e)}
                />
                <div className="file-input-wrapper">
                  <label className="file-input-label">
                    Upload Document
                    <input
                      type="file"
                      className="file-input"
                      name="document"
                      onChange={(e) => handleOptionalDocsChange(idx, e)}
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="optn-doc-add"
            onClick={addOptionalDoc}
          >
            +
          </button>
        </div>

        <div className="section">
          <h2 className="section-title">Declaration</h2>
          <div className="declaration-wrapper">
            <div className="declaration-text">
              "Certified that the information given above is true to the best of
              my knowledge and belief.<br></br> In case any of the information
              given above is found incorrect, I will abide by the decision of
              the College."
            </div>
            <div className="declaration-checkbox">
              <input
                type="checkbox"
                id="declaration"
                checked={declarationChecked}
                onChange={(e) => setDeclarationChecked(e.target.checked)}
                required
              />
              <label htmlFor="declaration">
                I agree to the above declaration
              </label>
            </div>
          </div>
        </div>

        <h2>Signature</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSignature(e.target.files[0])}
          required
        />

        <button type="submit">Submit Application</button>
        <button type="button" className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </form>
    </>
  );
}
