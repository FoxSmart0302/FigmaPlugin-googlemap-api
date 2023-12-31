import * as React from "react";
import { useRef, useEffect, useState } from "react";
import { Select, Input, Checkbox } from "figma-styled-components";

import { useGoogleMapContext } from "../hooks/useGoogleMap";
import { Line } from "./Line";
import { Label } from "./Label";
// import { Autocomplete } from "react-google-autocomplete";

const GoogleMapInputs = () => {
  const [store, dispatch] = useGoogleMapContext();
  const [zoomLevel, setZoomLevel] = useState(store.options.zoom);
  const [address, setAddress] = useState("");
  const input = useRef<HTMLInputElement>(null);
  

  useEffect(() => {
    if (input.current) {
      input.current.focus();
    }
  }, []);

  useEffect(() => {
    const handleScroll = (event: { deltaY: number }) => {
      if (event.deltaY > 0) {
        // Zoom out
        setZoomLevel((prevZoomLevel: number) => {
          if (prevZoomLevel > 0) {
            return prevZoomLevel - 1;
          } else {
            return prevZoomLevel;
          }
        });
      } else {
        // Zoom in
        setZoomLevel((prevZoomLevel: number) => {
          if(prevZoomLevel < 21){
            return prevZoomLevel + 1
          } else{
            return prevZoomLevel
          }
        });
      }
    };

    // Add event listener to the component
    window.addEventListener("wheel", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, []);

  useEffect(() => {
    dispatch({
      type: "INPUT_ZOOM",
      value: zoomLevel,
    });
  }, [zoomLevel]);

  return (
    <div>
      <div>
        <Label label="Address"></Label>
        <div style={{ padding: "0 8px" }}>
          <input
            ref={input}
            className="input"
            id="autocomplete-input"
            placeholder="Search for a location"
            value={address}
            onChange={(e) => {setAddress(e.target.value)}}
            // value={store.options.address}
            // onInput={(e: any) =>
            //   dispatch({ type: "INPUT_ADDRESS", value: e.target.value })
            // }
          />
        </div>
      </div>
      <Line />
      <div>
        <Label label="Map Type"></Label>
        <div style={{ padding: "4px 8px 0" }}>
          <Select
            onChange={({ value }: { value: string }) => {
              if (
                "roadmap" === value ||
                "satellite" === value ||
                "hybrid" === value ||
                "terrain" === value
              ) {
                dispatch({
                  type: "INPUT_MAP_TYPE",
                  value,
                });
              }
            }}
            value={store.options.type}
            options={[
              { label: "Roadmap", value: "roadmap" },
              { label: "Satellite", value: "satellite" },
              { label: "Hybrid", value: "hybrid" },
              { label: "Terrain", value: "terrain" },
            ]}
          ></Select>
        </div>
      </div>
      <Line />
      <div>
        <Label label="Zoom Level"></Label>
        <div style={{ padding: "4px 8px 0" }}>
          <Input
            type="number"
            onChange={(e: any) => {
              const val = e.target.value;
              if (val < 0) return;
              if (val !== "") {
                dispatch({
                  type: "INPUT_ZOOM",
                  value: Number(e.target.value),
                });
              } else {
                dispatch({
                  type: "INPUT_ZOOM",
                  value: "",
                });
              }
            }}
            value={store.options.zoom}
          />
        </div>
      </div>
      <div style={{ padding: "0 6px" }}>
        <Checkbox
          checked={store.options.marker}
          label="Show Marker"
          onChange={(e: any) => {
            console.log(e.target.checked);
            dispatch({
              type: "INPUT_MARKER",
              value: e.target.checked,
            });
          }}
        />
      </div>
      <Line />
      <div className="d-flex">
        <div>
          <Label label="Width"></Label>
          <div style={{ padding: "4px 8px 0" }}>
            <Input
              type="number"
              onChange={(e: any) => {
                const val = e.target.value;
                if (val !== "") {
                  dispatch({
                    type: "INPUT_WIDTH",
                    value: Number(e.target.value),
                  });
                } else {
                  dispatch({
                    type: "INPUT_WIDTH",
                    value: "",
                  });
                }
              }}
              value={store.options.width}
            />
          </div>
        </div>
        <div>
          <Label label="Height"></Label>
          <div style={{ padding: "4px 8px 0" }}>
            <Input
              type="number"
              onChange={(e: any) => {
                const val = e.target.value;
                if (val !== "") {
                  dispatch({
                    type: "INPUT_HEIGHT",
                    value: Number(e.target.value),
                  });
                } else {
                  dispatch({
                    type: "INPUT_HEIGHT",
                    value: "",
                  });
                }
              }}
              value={store.options.height}
            />
          </div>
        </div>
      </div>
      <div>
        <div style={{ padding: "4px 18px 0" }}>
          <p className="type--12-pos">
            Find at more here:{" "}
            <a target="__blank" href="https://snazzymaps.com/explore">
              Snazzy Map
            </a>{" "}
            <a target="__blank" href="https://mapstyle.withgoogle.com/">
              Google Official Map Style
            </a>
          </p>
        </div>
        {/* <Label label="Custom Style"></Label>
        <textarea
          className="textarea"
          onInput={(e: any) =>
            dispatch({ type: "INPUT_JSON", value: e.target.value })
          }
          style={{ width: "100%", margin: 0 }}
          rows={5}
          placeholder="Paste Your JSON here."
        >
          {store.options.json}
        </textarea>
        {store.jsonIsInvalid && (
          <p className="type--12-pos" style={{ color: "#f24822" }}>
            Invalid JSON. Please check your format.
          </p>
        )} */}
      </div>
    </div>
  );
};

export { GoogleMapInputs };
