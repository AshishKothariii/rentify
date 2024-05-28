import { useState } from "react";
import Searchcomp from "./Searchcomp";
function Search() {
  const [bhkType, setBhkType] = useState("");
  const [bachelorsAllowed, setBachelorsAllowed] = useState(false);
  const [parkingAvailable, setParkingAvailable] = useState(false);

  return (
    <div className="filter-container" style={{ width: "100%" }}>
      <Searchcomp></Searchcomp>
      <div className="filter-options">
        <select value={bhkType} onChange={(e) => setBhkType(e.target.value)}>
          <option value="">BHK Type</option>
          <option value="1BHK">1 BHK</option>
          <option value="2BHK">2 BHK</option>
          <option value="3BHK">3 BHK</option>
        </select>

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={bachelorsAllowed}
              onChange={(e) => setBachelorsAllowed(e.target.checked)}
            />{" "}
            Bachelors Allowed
          </label>
        </div>

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={parkingAvailable}
              onChange={(e) => setParkingAvailable(e.target.checked)}
            />{" "}
            Parking Available
          </label>
        </div>
      </div>
    </div>
  );
}

export default Search;
