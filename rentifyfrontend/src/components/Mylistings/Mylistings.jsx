import axios from "axios";
import { useEffect, useState } from "react";
import LogNavbar from "../NavBar/LogNavbar";
import "./Mylistings.css";

export default function Mylistings() {
  const [mylist, setMylist] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/mylistings", {
        withCredentials: true, // Send cookies with the request
      });
      setMylist(response.data.listings);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div style={{ overflowX: "hidden" }}>
      <LogNavbar />
      <div className="mylistingcontainer">
        {mylist.length === 0 ? (
          <p
            style={{
              position: "relative",
              marginLeft: "400px",
              marginTop: "200px",
              fontFamily: "monospace",
              fontSize: "50px",
            }}
          >
            {" "}
            {mylist === null ? "Loading..." : "Currently No listings"}
          </p>
        ) : (
          mylist.map((item, index) => <Propertycard key={index} data={item} />)
        )}
      </div>
    </div>
  );
}

const Propertycard = ({ data }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/listings/id/${data.id}`, {
        withCredentials: true,
      });
      // If deletion is successful, set 'deleted' state to true
    } catch (error) {
      console.error("Error deleting listing:", error);
      // Handle error (e.g., show error message to user)
    }
  };
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const leftarrow = "<";
  const rightarrow = ">";

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? data.image_urls.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === data.image_urls.length - 1 ? 0 : prevIndex + 1
    );
  };
  return (
    <div
      className="propertycontainer"
      style={{
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        height: "340px",
        width: "80%",
        margin: "10px",
        backgroundColor: "wheat",
      }}
    >
      <div
        className="property-card"
        style={{
          height: "250px",
          gap: "10px",
          backgroundColor: "whitesmoke",
          width: "98%",
          display: "flex",
        }}
      >
        <div
          className="image-container"
          style={{
            height: "100%",
            overflow: "hidden",
          }}
        >
          <img
            src={data.image_urls[currentImageIndex]}
            style={{ width: "600px", height: "100%", objectFit: "cover" }}
          ></img>
          <button
            style={{
              position: "relative",
              bottom: "50%",
              backgroundColor: "yellow",
              color: "black",
              fontSize: "22px",
            }}
            onClick={prevImage}
          >
            {leftarrow}
          </button>
          <button
            style={{
              position: "relative",
              bottom: "51%",
              left: "89%",
              backgroundColor: "yellow",
              color: "black",
              fontSize: "22px",
            }}
            onClick={nextImage}
          >
            {rightarrow}
          </button>
        </div>
        <div
          className="property-details-container"
          style={{
            width: "66%",
            display: "flex",
            justifyContent: "space-evenly",
            height: "auto",
            flexDirection: "column",
          }}
        >
          <div
            className="details1"
            style={{
              display: "flex",
              width: "auto",
              marginTop: "2%",
              marginLeft: "2%",
              justifyContent: "space-around",
              flexDirection: "row",
              overflowY: "auto",
              flexWrap: "wrap",
            }}
          >
            <div
              className="location-details"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ alignSelf: "center" }}>City</div>
              <div style={{ alignSelf: "center" }}>{data.city}</div>
            </div>
            <div
              className="bhk-details"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ alignSelf: "center" }}>BHK</div>
              <div style={{ alignSelf: "center" }}>{data.bhk} BHK</div>
            </div>{" "}
            <div
              className="price-details"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ alignSelf: "center" }}>price</div>
              <div style={{ alignSelf: "center" }}> ₹ {data.regular_price}</div>
            </div>
          </div>
          <div
            className="details2"
            style={{
              display: "flex",
              width: "auto",
              marginTop: "2%",
              marginLeft: "2%",
              justifyContent: "space-around",
              flexDirection: "row",
              overflowY: "auto",
              flexWrap: "wrap",
            }}
          >
            <div
              className="furnished-details"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ alignSelf: "center" }}>furnished</div>
              <div style={{ alignSelf: "center" }}>
                {data.furnished ? "Yes" : "No"}
              </div>
            </div>
            <div
              className="parking-details"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ alignSelf: "center" }}>Parking</div>
              <div style={{ alignSelf: "center" }}>
                {data.parking ? "Yes" : "No"}
              </div>
            </div>{" "}
            <div
              className="bachelors-details"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ alignSelf: "center" }}>Bachelors</div>
              <div style={{ alignSelf: "center" }}>
                {data.bachelors ? "Allowed" : "Not Allowed"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "100%",

          marginLeft: "10px",
          backgroundColor: "smokewhite",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <div className="description-details" style={{}}>
          {data.description}
        </div>
        <div className="deletebutton" style={{ marginLeft: "70%" }}>
          <button style={{ width: "100px" }} onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
