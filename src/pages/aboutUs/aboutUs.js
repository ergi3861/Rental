// AboutUs.jsx
import "./aboutUs.css";
import Navigimi from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";

export default function AboutUs() {
  return (
    <>
    <Navigimi />
    <section className="about-page">
      {/* HERO */}
      <div className="about-hero">
        <div className="about-hero-text">
          <h1>Lëvizje pa Kompromis</h1>
          <p>
            Ne ndërtojmë një sistem qiraje makine ku çdo detaj është i menduar:
            çmime të qarta, procese të thjeshta dhe kontroll total për klientin.
          </p>

          <div className="about-cta">
            <button className="primary-btn">Shiko Flotën</button>
            <button className="secondary-btn">Rezervo Tani</button>
          </div>
        </div>

        <div className="about-hero-visual">
          <div className="floating-card">Transparencë</div>
          <div className="floating-card delay">Siguri</div>
          <div className="floating-card delay-2">Kontroll</div>
        </div>
      </div>

      {/* STORY */}
      <div className="about-story">
        <h2>Historia Jonë</h2>
        <p>
          Kjo platformë u ndërtua për të eliminuar konfuzionin në tregun e qirasë
          së makinave. Pa premtime boshe, pa kosto të fshehura, pa surpriza.
        </p>
      </div>

      {/* VALUES */}
      <div className="about-values">
        <div className="value-card">
          <h3>Çmime Reale</h3>
          <p>
            Çmimi që sheh është çmimi që paguan. Pa shtesa të fshehura.
          </p>
        </div>

        <div className="value-card">
          <h3>Flotë e Kontrolluar</h3>
          <p>
            Çdo makinë inspektohet dhe mirëmbahen rregullisht.
          </p>
        </div>

        <div className="value-card">
          <h3>Proces i Thjeshtë</h3>
          <p>
            Rezervim i shpejtë, dokumentacion minimal, konfirmim i menjëhershëm.
          </p>
        </div>

        <div className="value-card">
          <h3>Mbështetje Reale</h3>
          <p>
            Asistencë njerëzore 24/7, jo përgjigje automatike.
          </p>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="about-timeline">
        <h2>Si Funksionon</h2>

        <div className="timeline">
          <div className="step">
            <span>01</span>
            <p>Zgjedh makinën dhe datat</p>
          </div>
          <div className="step">
            <span>02</span>
            <p>Konfirmon rezervimin online</p>
          </div>
          <div className="step">
            <span>03</span>
            <p>Merr makinën në vendndodhjen tënde</p>
          </div>
          <div className="step">
            <span>04</span>
            <p>Udhëton pa stres</p>
          </div>
        </div>
      </div>

      {/* CTA STRIP */}
      <div className="about-strip">
        <h2>Gati për të marrë kontrollin e udhëtimit?</h2>
        <button className="primary-btn large">Fillo Rezervimin</button>
      </div>
    </section>
<Footer />
    </>
  );
}
