import { useRef, useState } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import gps from "./assets/gps.png";

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAP_KEY,
    libraries: ["places"],
  });
  const center = {
    lat: 20.5937,
    lng: 78.9629,
  };
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState([]);
  const [duration, setDuration] = useState([]);
  const [startAddress, setStartAddress] = useState([]);
  const [endAddress, setEndAddress] = useState([]);
  const originRef = useRef("");
  const destinationRef = useRef("");
  const [formFields, setFormFields] = useState([]);
  const newDes = useRef([]);
  console.log(newDes.current);

  const addFields = () => {
    newDes.current.push({});
    setFormFields([]);
  };
  const removeFields = () => {
    newDes.current = [];
    setFormFields([]);
    setDistance("");
    setDuration("");
    setStartAddress("");
    setEndAddress("");
    setDirections(null);
    originRef.current.value = "";
    destinationRef.current.value = "";
  };

  if (!isLoaded) return <div class="loader"></div>;

  const calculateRoute = async () => {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      toast("Please enter both origin and destination", {
        icon: "🚨",
      });
      return;
    }
    // add multiple destinations
    const directionsService = new google.maps.DirectionsService();

    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
      waypoints: newDes.current.map((item) => {
        return {
          location: item.current.value,
          stopover: true,
        };
      }),
      provideRouteAlternatives: true,
    });

    setDirections(results);
    const distanceMap = results.routes[0].legs.map((route) => {
      return route.distance.text;
    });
    const durationMap = results.routes[0].legs.map((route) => {
      return route.duration.text;
    });

    const startAddress = results.routes[0].legs.map((route) => {
      return route.start_address.split(",")[0];
    });
    const endAddress = results.routes[0].legs.map((route) => {
      return route.end_address.split(",")[0];
    });

    setDistance(distanceMap);
    setDuration(durationMap);
    setStartAddress(startAddress);
    setEndAddress(endAddress);
  };

  return (
    <div className="map-container">
      <Navbar />
      <p className="heading">
        Let's calculate <b>distance</b> from Google maps
      </p>
      <div className="map-wrapper">
        <div className="map-left">
          <div>
            <div className="input-box">
              <div>
                <img src={gps} alt="" />
                <p>Origin</p>
                <Autocomplete>
                  <input type="text" ref={originRef} />
                </Autocomplete>
              </div>
              <div>
                <img src={gps} alt="" />
                <p>Destination</p>
                <Autocomplete>
                  <input type="text" ref={destinationRef} />
                </Autocomplete>
              </div>
              {newDes.current.map((form, index) => {
                return (
                  <div key={index}>
                    <img src={gps} alt="" />
                    <p>Destination</p>
                    <Autocomplete>
                      <input
                        type="text"
                        name="destination"
                        ref={newDes.current[index]}
                      />
                    </Autocomplete>
                  </div>
                );
              })}
            </div>
            <div className="btns">
              <div>
                <button onClick={calculateRoute} className="calc-btn">
                  Calculate
                </button>
              </div>
              <div className="two-btn">
                <button onClick={addFields} className="secondary-btn">
                  Add{" "}
                </button>
                <button onClick={removeFields} className="secondary-btn">
                  reset
                </button>
              </div>
            </div>
          </div>
          <div className="distance">
            <div className="distance-top">
              <p>Distance</p>
              <h1>{distance[0]}</h1>
            </div>
            <div className="distance-bottom">
              {originRef.current.value && destinationRef.current.value && (
                <>
                  <p>
                    The distance between{" "}
                    <b> {originRef.current.value.split(",")[0]} </b>
                    and <b>
                      {" "}
                      {destinationRef.current.value.split(",")[0]}{" "}
                    </b> is <b> </b>
                  </p>

                  <p> {/* Duration will be <b> {duration}</b>{" "} */}</p>
                  <table className="distance-table" border="1px">
                    <thead>
                      <tr>
                        <th>Origin</th>
                        <th>Destination</th>
                        <th>Distance</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {distance.map((item, index) => {
                        return (
                          <>
                            <tr>
                              <td>{startAddress[index]} </td>
                              <td>{endAddress[index]}</td>
                              <td>{item}</td>
                              <td>{duration[index]}</td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
        <div id="map" className="map-right">
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "100%",
            }}
            options={{
              disableDefaultUI: true,
              zoomControl: false,
            }}
            zoom={5}
            center={center}
          >
            <Marker position={center} />
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              className: "",
              style: {
                border: "1px solid orange",
                padding: "16px",
                color: "#713200",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
