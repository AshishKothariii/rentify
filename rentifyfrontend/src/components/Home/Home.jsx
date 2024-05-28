import { useEffect, useState } from "react";
import Navbar from "../NavBar/Navbar";
import "./Home.css";

import LogNavbar from "../NavBar/LogNavbar";
import { useAuth } from "../../AuthContext";
import axios from "axios";
const data = await getData();

async function getData() {
  const data = await axios.get("http://localhost:8080/listings");

  return data.data.listings;
}
const Home = () => {
  const { isLoggedIn } = useAuth();

  let [searchlocation, setsearchlocation] = useState([]);
  let [searchbhk, setsearchbhk] = useState([]);
  let [searchrent, setsearchrent] = useState(50000);
  const [searchdata, setsearchdata] = useState(null);
  const [outputdata, setoutputdata] = useState(data);
  const [locationisExpanded, setlocationisExpanded] = useState(false);
  const [bhkisExpanded, setbhkisExpanded] = useState(false);
  const [rentisExpanded, setrentisExpanded] = useState(false);

  const handlerentChange = (event) => {
    setsearchrent(parseInt(event.target.value)); // Update the state with the new slider value
  };
  const handlelocationToggle = () => {
    setlocationisExpanded(!locationisExpanded);
  };
  const handlebhkToggle = () => {
    setbhkisExpanded(!bhkisExpanded);
  };
  const handlerentToggle = () => {
    setrentisExpanded(!rentisExpanded);
  };

  const handleLocationChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setsearchlocation([...searchlocation, value]);
    } else {
      setsearchlocation(searchlocation.filter((loc) => loc !== value));
    }
  };

  const handleBhkChange = (e) => {
    const { value, checked } = e.target;
    const bhkvalue = parseInt(value);
    if (checked) {
      setsearchbhk([...searchbhk, bhkvalue]);
    } else {
      setsearchbhk(searchbhk.filter((bhk) => bhk !== bhkvalue));
    }
  };
  const handlesearch = () => {
    setsearchdata({
      location: searchlocation,
      bhk: searchbhk,
      budget: searchrent,
    });
  };
  useEffect(() => {
    const ans = [];
    if (
      !searchdata ||
      (searchdata.location.length === 0 &&
        searchdata.bhk.length === 0 &&
        searchdata.budget === 0)
    ) {
      // If no search criteria are selected, show all data
      setoutputdata(data);
    } else {
      for (var i = 0; i < data.length; i++) {
        const property = data[i];
        let locationMatch = true;
        let bhkMatch = true;
        let budgetMatch = true;

        if (searchdata.location.length > 0) {
          locationMatch = searchdata.location.includes(property.city);
        }
        if (searchdata.bhk.length > 0) {
          bhkMatch = searchdata.bhk.includes(property.bhk);
        }
        if (searchdata.budget > 0) {
          budgetMatch = searchdata.budget >= property.regular_price;
        }

        if (locationMatch && bhkMatch && budgetMatch) {
          ans.push(property);
        }
      }
      setoutputdata(ans);
    }
  }, [searchdata]);

  return (
    <div style={{ overflowX: "hidden" }}>
      {isLoggedIn ? <LogNavbar></LogNavbar> : <Navbar />}
      <div className="contentbody">
        <div className="verticalbar1">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{ display: "flex", cursor: "pointer" }}
              onClick={handlelocationToggle}
            >
              <span>Select Location</span>
              <span style={{ marginLeft: "138px" }}>
                {locationisExpanded ? "▲" : "▼"}
              </span>
            </div>
            {locationisExpanded && (
              <div style={{ marginLeft: "20px" }}>
                <div className="location-checkboxes">
                  <label>
                    <input
                      type="checkbox"
                      value="Hyderabad"
                      onChange={handleLocationChange}
                    />
                    Hyderabad
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="Mumbai"
                      onChange={handleLocationChange}
                    />
                    Mumbai
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="Gurugram"
                      onChange={handleLocationChange}
                    />
                    Gurugram
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="Bangalore"
                      onChange={handleLocationChange}
                    />
                    Bangalore
                  </label>
                </div>
              </div>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{ display: "flex", cursor: "pointer" }}
              onClick={handlebhkToggle}
            >
              <span>BHK</span>
              <span style={{ marginLeft: "230px" }}>
                {bhkisExpanded ? "▲" : "▼"}
              </span>
            </div>
            {bhkisExpanded && (
              <div style={{ marginLeft: "20px" }}>
                <div className="location-checkboxes">
                  <label>
                    <input
                      type="checkbox"
                      value="1"
                      onChange={handleBhkChange}
                    />
                    1 BHK
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="2"
                      onChange={handleBhkChange}
                    />
                    2 BHK
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="3"
                      onChange={handleBhkChange}
                    />
                    3 BHK
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="4"
                      onChange={handleBhkChange}
                    />
                    4 BHK
                  </label>
                </div>
              </div>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{ display: "flex", cursor: "pointer" }}
              onClick={handlerentToggle}
            >
              <span>Maximum Budget</span>
              <span style={{ marginLeft: "135px" }}>
                {rentisExpanded ? "▲" : "▼"}
              </span>
            </div>
            {rentisExpanded && (
              <div style={{ marginLeft: "80px" }}>
                <div className="Budgetslidercontainer">
                  <input
                    type="range"
                    min={1000}
                    max={50000}
                    step={1000} // You can adjust the step size as needed
                    value={searchrent}
                    onChange={handlerentChange}
                    className="Budgetslider"
                  />
                  <p>Value: {searchrent} ₹</p>
                </div>
              </div>
            )}
          </div>
          <div
            style={{
              position: "relative",
              justifySelf: "center",
              alignSelf: "center",
            }}
          >
            <button style={{ width: "240px" }} onClick={handlesearch}>
              Search
            </button>
          </div>
        </div>

        <div className="container">
          {/* Display Property Cards */}
          {outputdata.length === 0 ? (
            <p
              style={{
                marginTop: "200px",
                marginLeft: "210px",
                fontFamily: "monospace",
                fontSize: "70px",
              }}
            >
              No Property found
            </p>
          ) : (
            <div className="property-cards">
              {/* Mapping data to Propertycard component */}
              {outputdata.map((item, index) => (
                <Propertycard key={index} d={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Propertycard = ({ d }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const leftarrow = "<";
  const rightarrow = ">";

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? d.image_urls.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === d.image_urls.length - 1 ? 0 : prevIndex + 1
    );
  };
  const { isLoggedIn } = useAuth();

  return (
    <div className="property-card">
      <div className="image-slider">
        <img
          className="slide-image"
          src={d.image_urls[currentImageIndex]}
          style={{ width: "100%", height: "94%", paddingTop: "2%" }}
          alt={`Property ${d.bhk} BHK`}
        ></img>
        {/* Previous and Next buttons */}
        <button
          onClick={prevImage}
          style={{
            position: "relative",
            bottom: "50%",
            backgroundColor: "transparent",
            color: "white",
            fontSize: "22px",
          }}
        >
          {leftarrow}
        </button>
        <button
          onClick={nextImage}
          style={{
            position: "relative",
            bottom: "50%",
            left: "83%",
            backgroundColor: "transparent",
            color: "white",
            fontSize: "22px",
          }}
        >
          {rightarrow}
        </button>
      </div>
      <div className="propertydetails">
        <p className="title" style={{ fontFamily: "cursive" }}>
          {d.bhk} Bhk House in {d.city}, {d.address}
        </p>
        <div className="RTB">
          <h3 style={{ flex: "0 0 33.3333%", fontFamily: "cursive" }}>
            ₹ {d.regular_price}
          </h3>
          <h3 style={{ flex: "0 0 33.3333%", fontFamily: "cursive" }}>
            {" "}
            {d.city}
          </h3>
          <h3 style={{ flex: "0 0 33.3333%", fontFamily: "cursive" }}>
            {" "}
            {d.bhk} BHK
          </h3>
        </div>
        <div className="propertydetail3">
          <button>
            <a
              href={isLoggedIn ? `/listing/id/${d.id.toString()}` : "/login"}
              style={{ fontFamily: "monospace" }}
            >
              View Details
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};
export default Home;
