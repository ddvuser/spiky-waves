import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";

function ProfilePage() {
  let { user, authTokens } = useContext(AuthContext);
  let [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch my profile
  const getMyProfile = async () => {
    try {
      let response = await fetch(
        `http://127.0.0.1:8000/chat/api/profile/${user.user_id}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        setProfile(data);
      } else {
        console.log("Error fetching profile");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyProfile();
  }, []);

  // Form values
  const [profileName, setProfileName] = useState("");
  const [profileSurname, setProfileSurname] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (profile) {
      setProfileName(profile.full_name.split(" ")[0]);
      setProfileSurname(profile.full_name.split(" ")[1]);
      setProfileBio(profile.bio);
      setProfileImage(profile.image);
    }
  }, [profile]);

  const handleEditProfile = async (e) => {
    e.preventDefault();
    // If values have changed
    console.log(profile);
    if (
      profile &&
      (profile.full_name !== profileName + " " + profileSurname ||
        profile.bio !== profileBio ||
        profile.image !== profileImage)
    ) {
      console.log([profileName, profileSurname, profileBio, profileImage]);
      const formData = new FormData();
      formData.append("user", user.user_id);
      formData.append("full_name", profileName + " " + profileSurname);
      formData.append("bio", profileBio);
      formData.append("image", profileImage);
      try {
        let response = await fetch(
          `http://127.0.0.1:8000/chat/api/profile/${user.user_id}/`,
          {
            method: "PUT",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: formData,
          }
        );
        console.log(response.status);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
      // Values have not changed
    } else {
      console.log("nothing is changed");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="row">
      <div className="col"></div>
      <div className="col-6">
        <h2>Profile settings</h2>
        {profile && (
          <form>
            <div className="d-flex justify-content-center">
              <img
                src={profile.image}
                className="rounded-circle me-2"
                alt={profile.full_name}
                style={{ width: "65px", height: "65px" }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="formFile" className="form-label">
                Profile image:
              </label>
              <input
                className="form-control"
                name="image"
                type="file"
                id="formFile"
                onChange={(e) => {
                  const filename = e.target.files[0];
                  setProfileImage(filename);
                }}
              />
            </div>
            <div className="form-group mt-2">
              <label className="mb-1" htmlFor="profile-name">
                Name:
              </label>
              <input
                className="form-control"
                type="text"
                name="name"
                id="profile-name"
                value={profileName}
                onChange={(e) => {
                  setProfileName(e.target.value);
                }}
                placeholder="..."
              />
            </div>
            <div className="form-group">
              <label className="mb-1" htmlFor="profile-surname">
                Surname:
              </label>
              <input
                className="form-control"
                type="text"
                name="surname"
                id="profile-surname"
                value={profileSurname}
                onChange={(e) => {
                  setProfileSurname(e.target.value);
                }}
                placeholder="..."
              />
            </div>
            <div className="form-group">
              <label className="mb-1" htmlFor="profile-bio">
                Bio:
              </label>
              <input
                className="form-control"
                type="text"
                name="bio"
                id="profile-bio"
                value={profileBio}
                onChange={(e) => {
                  setProfileBio(e.target.value);
                }}
                placeholder="..."
              />
            </div>
            <button
              type="button"
              onClick={handleEditProfile}
              className="btn btn-primary mt-2"
            >
              Edit
            </button>
          </form>
        )}
      </div>
      <div className="col"></div>
    </div>
  );
}

export default ProfilePage;