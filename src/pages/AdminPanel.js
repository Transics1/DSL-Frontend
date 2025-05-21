import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/adminPanel.css";
import { POST_OPTIONS } from "../constants/posts";
import { CATEGORY_OPTIONS } from "../constants/posts";
import dsl from "../assets/dsl.png";

export default function AdminPanel() {
  const [applications, setApplications] = useState([]);
  const [filterPost, setFilterPost] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showDocuments, setShowDocuments] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/applications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setApplications(res.data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location = "/";
  };

  const handlePdfDownload = async (appId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/application/pdf/${appId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `application_${appId}.pdf`);

      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Failed to download PDF:", error);
      alert("Failed to download PDF. Please try again.");
    }
  };

  const viewDocuments = (app) => {
    setSelectedDocs({
      education: app.education,
      achievements: app.achievements,
      optionalDocs: app.optionalDocs,
    });
    setShowDocuments(true);
  };

  const filteredApps = applications.filter((app) => {
    return (
      (filterPost ? app.postApplied === filterPost : true) &&
      (filterCategory ? app.general?.category === filterCategory : true)
    );
  });

  return (
    <div className="container">
      <div className="logo-header">
        <img src={dsl} alt="Dyal Singh College" className="college-logo" />
      </div>
      <div className="section">
        <div className="section-title">
          <h2>Admin Panel</h2>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        <div className="filters">
          <select
            className="form-input"
            value={filterPost}
            onChange={(e) => setFilterPost(e.target.value)}
          >
            <option value="">All Posts</option>
            {POST_OPTIONS.map((post) => (
              <option key={post} value={post}>
                {post}
              </option>
            ))}
          </select>
          <select
            className="form-input"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Post Applied</th>
              <th>Documents</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredApps.map((app) => (
              <tr key={app._id}>
                <td>{app.general.name}</td>
                <td>{app.general.email}</td>
                <td>
                  <span className="status-badge">{app.postApplied}</span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => viewDocuments(app)}
                      className="btn btn-secondary"
                    >
                      View
                    </button>
                    {app.general.photo && (
                      <a
                        href={`${process.env.REACT_APP_API_URL}/${app.general.photo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                      >
                        Photo
                      </a>
                    )}
                    {app.signature && (
                      <a
                        href={`${process.env.REACT_APP_API_URL}/${app.signature}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                      >
                        Signature
                      </a>
                    )}
                  </div>
                </td>
                {showDocuments && selectedDocs && (
                  <div className="modal">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h2>Application Documents</h2>
                        <button
                          onClick={() => setShowDocuments(false)}
                          className="close-btn"
                        >
                          &times;
                        </button>
                      </div>
                      <div className="modal-body">
                        <h3>Education Documents</h3>
                        {selectedDocs.education.map((edu, index) => (
                          <div key={index} className="document-item">
                            <p>
                              <strong>{edu.examination}:</strong>
                            </p>
                            {edu.document && (
                              <a
                                href={`${process.env.REACT_APP_API_URL}/${edu.document}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary"
                              >
                                View Document
                              </a>
                            )}
                          </div>
                        ))}

                        <h3>Achievement Documents</h3>
                        {selectedDocs.achievements.map((ach, index) => (
                          <div key={index} className="document-item">
                            <p>
                              <strong>{ach.title}:</strong>
                            </p>
                            {ach.document && (
                              <a
                                href={`${process.env.REACT_APP_API_URL}/${ach.document}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary"
                              >
                                View Document
                              </a>
                            )}
                          </div>
                        ))}

                        {selectedDocs.optionalDocs && selectedDocs.optionalDocs.length > 0 ? (
                          <>
                            <h3>Optional Documents</h3>
                            {selectedDocs.optionalDocs.map((doc, index) => (
                              <div key={index} className="document-item">
                                <p>
                                  <strong>{doc.title}:</strong>
                                </p>
                                {doc.document && (
                                  <a
                                    href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${doc.document}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary"
                                  >
                                    View Document
                                  </a>
                                )}
                              </div>
                            ))}
                          </>
                        ) : "Hey"}

                        <div style={{ textAlign: "right", marginTop: "20px" }}>
                          <button
                            onClick={() => setShowDocuments(false)}
                            className="btn btn-danger"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => handlePdfDownload(app._id)}
                      className="btn btn-primary"
                    >
                      Download PDF
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
