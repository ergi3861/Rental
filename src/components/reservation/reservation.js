import React, { useState } from "react";
import "../reservation/reservation.css"

/* LOCATIONS */

const locations = [
  "Tirana Airport",
  "Tirana Center",
  "Durres Port",
  "Vlore Downtown"
];

/* 24H TIME */

const times = Array.from({ length: 24 }, (_, i) =>
  `${i.toString().padStart(2, "0")}:00`
);

export default function ReservationForm() {

  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");

  const [pickupTime, setPickupTime] = useState("");
  const [dropTime, setDropTime] = useState("");

  const [pickupDate, setPickupDate] = useState("");
  const [dropDate, setDropDate] = useState("");

  const start_datetime = `${pickupDate} ${pickupTime}:00`;
  const end_datetime = `${dropDate} ${dropTime}:00`;

  const handleSubmit = async (e) => {

    e.preventDefault();

    const reservationData = {
      pickupLocation,
      pickupDate,
      pickupTime,
      dropLocation,
      dropDate,
      dropTime
    };

    try {

      const response = await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reservationData)
      });

      const data = await response.json();
      console.log(data);

    } catch (error) {

      console.error("Reservation error:", error);

    }

  };

  return (

    <div className="rentalWidget">

      <div className="rentalWidget__container">
        <h2>Rezervo tani</h2>

        <form onSubmit={handleSubmit}>

          <div className="rentalWidget__grid">

            {/* ROW 1 */}

            <div className="rentalWidget__span2">
              <Dropdown
                label="Pick-up Location"
                value={pickupLocation}
                setValue={setPickupLocation}
                items={locations}
              />
            </div>

            {/* ROW 2 */}

            <InputField
              label="Pick-up Date"
              value={pickupDate}
              setValue={setPickupDate}
              type="date"
            />

            <Dropdown
              label="Pick-up Time"
              value={pickupTime}
              setValue={setPickupTime}
              items={times}
            />

            {/* ROW 3 */}

            <div className="rentalWidget__span2">
              <Dropdown
                label="Drop-off Location"
                value={dropLocation}
                setValue={setDropLocation}
                items={locations}
              />
            </div>

            {/* ROW 4 */}

            <InputField
              label="Drop-off Date"
              value={dropDate}
              setValue={setDropDate}
              type="date"
            />

            <Dropdown
              label="Drop-off Time"
              value={dropTime}
              setValue={setDropTime}
              items={times}
            />

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            className="rentalWidget__search"
          >
            Search Cars
          </button>

        </form>

      </div>

    </div>
  );
}

/* INPUT FIELD */

function InputField({ label, value, setValue, type }) {

  return (

    <div className="rentalWidget__field">

      <label className="rentalWidget__label">
        {label}
      </label>

      <input
        className="rentalWidget__input"
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

    </div>

  );
}

/* DROPDOWN */

function Dropdown({ label, value, setValue, items }) {

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const filtered = items.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e) => {

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < filtered.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : filtered.length - 1
      );
    }

    if (e.key === "Enter") {

      if (activeIndex >= 0) {
        setValue(filtered[activeIndex]);
        setQuery("");
        setActiveIndex(-1);
      }

    }

    if (e.key === "Escape") {
      setActiveIndex(-1);
    }
  };

  return (

    <div className="rentalWidget__field rentalWidget__dropdown">

      <label className="rentalWidget__label">
        {label}
      </label>

      <div className="rentalWidget__dropdownBox">

        <input
          className="rentalWidget__input"
          value={value}
          placeholder="Select..."
          autoComplete="off"
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setQuery(e.target.value);
            setValue(e.target.value);
            setActiveIndex(-1);
          }}
        />

        <span className="rentalWidget__arrow">
          ▼
        </span>

        <div className="rentalWidget__menu">

          {filtered.map((item, index) => (

            <div
              key={item}
              className={`rentalWidget__item ${
                index === activeIndex
                  ? "rentalWidget__item--active"
                  : ""
              }`}
              onClick={() => {
                setValue(item);
                setQuery("");
                setActiveIndex(-1);
              }}
            >
              {item}
            </div>

          ))}

        </div>

      </div>

    </div>
  );
}