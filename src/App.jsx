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
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const originRef = useRef("");
  const destinationRef = useRef("");

  if (!isLoaded) return <div class="loader"></div>;

  const calculateRoute = async () => {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      toast("Please enter both origin and destination", {
        icon: "🚨",
      });
      return;
    }
    const directionsService = new google.maps.DirectionsService();

    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true,
    });

    setDirections(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
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
            </div>
            <div>
              <button onClick={calculateRoute}>Calculate</button>
            </div>
          </div>
          <div className="distance">
            <div className="distance-top">
              <p>Distance</p>
              <h1> {distance}</h1>
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
                    </b> is <b> {distance} </b>
                  </p>

                  <p>
                    {" "}
                    Duration will be <b> {duration}</b>{" "}
                  </p>
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
