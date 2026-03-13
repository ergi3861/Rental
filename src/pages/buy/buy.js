import React from "react";
import "./buy.css";
import Navigimi from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";


export default function Buy() {
  
const carsData = [
  {
    id: 1,
    brand: "BMW",
    name: "BMW X5",
    year: 2021,
    fuel: "Dizel",
    transmission: "Automatik",
    km: "45,000 km",
    price: "€32,500",
    image: "/bmw-x5.jpg"
  },
  {
    id: 2,
    brand: "Audi",
    name: "Audi Q7",
    year: 2020,
    fuel: "Benzinë",
    transmission: "Automatik",
    km: "38,000 km",
    price: "€29,800",
    image: "/audi-q7.jpg"
  }
];


  return (
    <>
    <Navigimi />
    <section className="sell-page">

      {/* HEADER */}
      <header className="sell-header">
        <h1>Shes makinën time</h1>
        <p>Vlerësim falas · Pagesë e shpejtë · Pa ndërmjetës</p>
      </header>

      {/* STEPS */}
      <div className="sell-steps">
        <div className="step">
          <span>1</span>
          <p>Plotëso të dhënat</p>
        </div>
        <div className="step">
          <span>2</span>
          <p>Ju kontaktojmë</p>
        </div>
        <div className="step">
          <span>3</span>
          <p>Blerje e menjëhershme</p>
        </div>
      </div>

      {/* FORM */}
      <form className="sell-form">
        <h2>Të dhënat e automjetit</h2>

        <div className="form-group">
          <label>Marka</label>
          <input type="text" placeholder="p.sh. BMW" />
        </div>

        <div className="form-group">
          <label>Modeli</label>
          <input type="text" placeholder="p.sh. X5" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Viti</label>
            <input type="number" placeholder="2020" />
          </div>

          <div className="form-group">
            <label>Kilometra</label>
            <input type="number" placeholder="150000" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Karburanti</label>
            <select>
              <option>Dizel</option>
              <option>Benzinë</option>
              <option>Hybrid</option>
              <option>Elektrike</option>
            </select>
          </div>

          <div className="form-group">
            <label>Transmisioni</label>
            <select>
              <option>Automatik</option>
              <option>Manual</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Gjendja / Defekte</label>
          <textarea placeholder="Përshkruani shkurt gjendjen e makinës"></textarea>
        </div>

        <h2>Kontakt</h2>

        <div className="form-group">
          <label>Emri</label>
          <input type="text" placeholder="Emri juaj" />
        </div>

        <div className="form-group">
          <label>Telefoni</label>
          <input type="tel" placeholder="+355..." />
        </div>

        <div className="form-group">
          <label>Qyteti</label>
          <input type="text" placeholder="Tiranë" />
        </div>

        <button type="submit" className="sell-btn">
          Dërgo për vlerësim
        </button>
      </form>

      {/* GUARANTEES */}
      <div className="sell-guarantees">
        <span>Pa detyrim shitjeje</span>
        <span>Të dhënat ruhen private</span>
        <span>Përgjigje brenda 24 orësh</span>
      </div>

    </section>
    <Footer />
</> 
  );
}
