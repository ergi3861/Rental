// Services.jsx
import Footer from "../../components/footer/footer";
import Navigimi from "../../components/navbar/navbar";
import "./services.css";

const services = [
  { title: "Qira Makine Afatshkurtër", desc: "Makina ditore dhe javore për përdorim urban dhe turistik." },
  { title: "Qira Makine Afatgjatë", desc: "Zgjidhje mujore dhe vjetore për individë dhe biznese." },
  { title: "Rezervim Online", desc: "Rezervim i drejtpërdrejtë me datë, orë, vendndodhje dhe konfirmim të menjëhershëm." },
  { title: "Dorëzim & Marrje Makine", desc: "Dorëzim në aeroport, hotel ose adresë private. Marrje fleksibël." },
  { title: "Qira Makine me Shofer", desc: "Shërbim premium për evente, udhëtime biznesi dhe transport VIP." },
  { title: "Flotë e Segmentuar", desc: "Makina ekonomike, familjare dhe luksoze sipas nevojës reale." },
  { title: "Asistencë 24/7", desc: "Mbështetje teknike dhe rrugore gjatë gjithë kohës së qirasë." },
  { title: "Siguracione të Plota", desc: "Sigurim bazë dhe opsione shtesë për mbulim maksimal." },
  { title: "Pa Depozitë / Depozitë e Ulët", desc: "Kushte fleksibël pa barriera financiare." },
  { title: "Anulim Fleksibël", desc: "Anulim ose ndryshim rezervimi pa penalitete të panevojshme." },
  { title: "Shërbime Shtesë", desc: "GPS, karrige për fëmijë, Wi-Fi, goma dimri, zinxhirë." },
  { title: "Ofertë për Biznese", desc: "Kontrata korporative dhe çmime të personalizuara." },
  { title: "Turizëm & Udhëtime", desc: "Makina për ture, guida lokale dhe udhëtime ndërqytetëse." },
  { title: "Pagesa të Sigurta", desc: "Cash, kartë dhe pagesa online." },

  /* shtesa strategjike */
  { title: "Rezervim pa Kartë Krediti", desc: "Alternativë për klientë pa kartë krediti." },
  { title: "Makina të Reja & të Mirëmbajtura", desc: "Flotë moderne me kontroll teknik të vazhdueshëm." },
  { title: "Çmime Transparente", desc: "Pa kosto të fshehura, pa surpriza." },
  { title: "Mbështetje për Turistë të Huaj", desc: "Dokumentacion i thjeshtuar dhe asistencë shumëgjuhëshe." }
];

export default function Services() {
  return (
    <>
    <Navigimi />
    <section className="services">
      <h2 className="services-title">Shërbimet</h2>

      <div className="services-grid">
        {services.map((s, i) => (
          <div className="service-card" key={i}>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
<Footer />
    </>
  );
}
