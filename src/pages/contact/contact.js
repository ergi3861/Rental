// Contact.jsx
import Footer from "../../components/footer/footer";
import Navigimi from "../../components/navbar/navbar";
import "./contact.css";

export default function Contact() {
  return (
    <>
    <Navigimi/>
    <section className="contact-page">
      {/* HERO */}
      <div className="contact-hero">
        <h1>Kontakt</h1>
        <p>
          Komunikim i drejtpërdrejtë. Pa forma të kota. Pa pritje të panevojshme.
        </p>
      </div>

      {/* GRID */}
      <div className="contact-grid">
        {/* FORM */}
        <div className="contact-form">
          <h2>Na Shkruaj</h2>

          <form>
            <div className="field">
              <label>Emri</label>
              <input type="text" placeholder="Emri dhe mbiemri" />
            </div>

            <div className="field">
              <label>Email</label>
              <input type="email" placeholder="email@domain.com" />
            </div>

            <div className="field">
              <label>Telefoni</label>
              <input type="tel" placeholder="+355..." />
            </div>

            <div className="field">
              <label>Mesazhi</label>
              <textarea placeholder="Shkruaj mesazhin"></textarea>
            </div>

            <button type="submit" className="primary-btn">
              Dërgo Mesazhin
            </button>
          </form>
        </div>

        {/* INFO */}
        <div className="contact-info">
          <div className="info-card">
            <h3>Adresa</h3>
            <p>Tiranë, Shqipëri</p>
          </div>

          <div className="info-card">
            <h3>Telefon</h3>
            <p>+355 69 000 0000</p>
          </div>

          <div className="info-card">
            <h3>Email</h3>
            <p>info@carrental.al</p>
          </div>

          <div className="info-card highlight">
            <h3>Asistencë 24/7</h3>
            <p>Për rezervime dhe emergjenca rrugore</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="contact-strip">
        <h2>Gati për të rezervuar?</h2>
        <p>Shiko flotën dhe merr makinën që të duhet sot.</p>
        <button className="primary-btn large">Shiko Makinat</button>
      </div>
    </section>
    <Footer />
 </> );
}
