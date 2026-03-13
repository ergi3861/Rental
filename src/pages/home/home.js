import Navigimi from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import "./home.css";
import G from "../../assets/v.mp4"
import Trade from "../../assets/trade.jpg" 
import { useEffect, useRef } from "react";
import { useState } from "react";
import CarBrands from "../../components/carousel/carousel";
import Mirage from "../../assets/mitsubishi-mirage-car-d.jpg";
import Toyota from "../../assets/toyota.webp"
import Hyundai from "../../assets/hyundai.webp"
import Glc300 from "../../assets/glc300.png"
import volvo from "../../assets/volvo.jpeg"
import Tesla from "../../assets/tesla.avif"
import Contact from "../contact/contact"
import Faq from "../faq/faq"
import Reservation from "../reservation/reservation"
import sales from "../sales/sales"
import Buy from "../buy/buy"
import Cars from "../cars/cars"
import ReservationForm from "../../components/reservation/reservation";

  
function Home(){

    const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
  }, []);
  // ====== CALENDAR (FIX) ======

const [isOpen, setIsOpen] = useState(false);

const [currentDate, setCurrentDate] = useState(() => {
  const d = new Date();
  d.setDate(1);
  return d;
});

const year = currentDate.getFullYear();
const month = currentDate.getMonth();

const firstDayOfMonth = new Date(year, month, 1).getDay();
const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
const daysInMonth = new Date(year, month + 1, 0).getDate();

const prevMonth = () => {
  setCurrentDate(new Date(year, month - 1, 1));
};

const nextMonth = () => {
  setCurrentDate(new Date(year, month + 1, 1));
};
const months = [ "Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor" ];

const [isTimeOpen, setIsTimeOpen] = useState(false);
// 👉 hap / mbyll oren

const [selectedTime, setSelectedTime] = useState(null);
// 👉 ora e zgjedhur

const times = [
  "00:00", "01:00", "02:00", "03:00",
  "04:00", "05:00", "06:00", "07:00",
  "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00",
  "20:00", "21:00", "22:00", "23:00"
];

const carTypes = [
  {
    id: 1,
    name: "Ekonomike",
    description: "Ideale për lëvizje urbane, konsum i ulët dhe kosto minimale.",
    priceFrom: 6,
    people: "4–5",
    luggage: "2–3",
    doors: "4–5",
    image: Mirage
  },
  {
    id: 2,
    name: "Kompakt",
    description: "Balancë mes komoditetit dhe madhësisë, e përshtatshme për udhëtime të shkurtra.",
    priceFrom: 6,
    people: "5",
    luggage: "3",
    doors: "4–5",
    image: Toyota
  },
  {
    id: 3,
    name: "SUV",
    description: "Hapësirë më e madhe, stabilitet dhe rehati për çdo terren.",
    priceFrom: 7,
    people: "5",
    luggage: "3–4",
    doors: "4–5",
    image: Hyundai
  },
  {
    id: 4,
    name: "Luksoze",
    description: "Komoditet premium dhe eksperiencë drejtimi elitare.",
    priceFrom: 18,
    people: "4–5",
    luggage: "2–3",
    doors: "4",
    image: Glc300
  },
  {
    id: 5,
    name: "Elektrike",
    description: "Zero emetime, teknologji moderne dhe drejtim i qetë.",
    priceFrom: 30,
    people: "4–5",
    luggage: "2–3",
    doors: "4–5",
    image: Tesla
  },
  {
    id: 6,
    name: "Hibride",
    description: "Efikasitet i lartë me kombinim benzinë dhe energji elektrike.",
    priceFrom: 20,
    people: "5",
    luggage: "3",
    doors: "4–5",
    image: volvo
  }
];


    return(
        <>
        <Navigimi/>
        <div className="video-wrapper">
  <video className="video-bg" src={G} autoPlay loop muted playsInline />
  <video className="video-main" src={G} autoPlay loop muted playsInline />
</div>

<CarBrands />


<div className="reservationContainer">

<ReservationForm />

</div>
<div className="container">
  <div className="hero-header">Shërbim i thjeshtë.</div>

  <div className="hero-item">Një rezervim</div>
  <div className="hero-item">Një çelës</div>
  <div className="hero-item">Një rrugë</div>
</div>

<div className="why-rental">
  <h2 className="why-title">
    A e dini përse njerëzit zgjedhin Rental Car?
  </h2>

  <div className="why-cards">
    <div className="why-card">
      <div className="why-icon">%</div>
      <div>
        <h3>Kurseni deri në 40%</h3>
        <p>Krahasoni çmime nga disa faqe me një kërkim të vetëm.</p>
      </div>
    </div>

    <div className="why-card">
      <div className="why-icon">✓</div>
      <div>
        <h3>Falas për t’u përdorur</h3>
        <p>Nuk ka tarifa të fshehura apo pagesa shtesë.</p>
      </div>
    </div>

    <div className="why-card">
      <div className="why-icon">≡</div>
      <div>
        <h3>Filtroni ofertat</h3>
        <p>Zgjidhni sipas tipit të makinës dhe anulimit falas.</p>
      </div>
    </div>

    <div className="why-card">
      <div className="why-icon">🚗</div>
      <div>
        <h3>Zgjidhni vendin e marrjes</h3>
        <p>Marrje në aeroport, qytet ose shuttle.</p>
      </div>
    </div>
  </div>
</div>


<section className="metrics-section">
  <div className="metrics-grid">
    <div className="metric-card">
      <span className="metric-value">12+</span>
      <span className="metric-label">Vite Eksperiencë</span>
    </div>

    <div className="metric-card">
      <span className="metric-value">180+</span>
      <span className="metric-label">Makina në Flotë</span>
    </div>

    <div className="metric-card">
      <span className="metric-value">5,000+</span>
      <span className="metric-label">Rezervime të Kryera</span>
    </div>

    <div className="metric-card">
      <span className="metric-value">4.8★</span>
      <span className="metric-label">Vlerësim Mesatar</span>
    </div>
  </div>
</section>


<section> 
<div className="fleet-top">
  <div className="fleet-text">
    <h2>Llojet e Automjeteve në Flotën Tonë</h2>
    <p>Përzgjedhje sipas kategorisë, komoditetit dhe nevojave të udhëtimit.</p>
  </div>

  <button onClick={() => window.location.href = 'Cars'} className="btn-fleet">
    Shiko të gjithë flotën
  </button>
</div>

    <div className="car-grid">
      {carTypes.map(type => (
        <div className="car-card" key={type.id}>
          <div className="car-image">
            <img src={type.image} alt={type.name} />
          </div>

          <h3 className="car-title">{type.name}</h3>
          <p className="car-desc">{type.description}</p>

          <div className="car-specs">
            <span>👤 {type.people}</span>
            <span>🧳 {type.luggage}</span>
            <span>🚪 {type.doors}</span>
          </div>

          <div className="car-footer">
            <span className="car-price">
              Duke filluar nga &nbsp; ${type.priceFrom} <small>/ditë</small>
            </span>
            <button className="car-btn">Shiko Modelet</button>
          </div>
        </div>
      ))}
    </div>
</section>


    <section className="trade-section">
  <div className="trade-wrapper">
    <div className="trade-content">
      <h2>Blerje & Shitje Automjetesh</h2>
      <p>
        Makina të kontrolluara, çmime reale tregu dhe proces i thjeshtë pa
        ndërmjetës.
      </p>

      <div className="trade-actions">
        <button onClick={() => window.location.href = 'Sales'} className="btn-primary">
          Shiko makinat në shitje
        </button>
        <button onClick={() => window.location.href = 'Buy'} className="btn-outline">
          Vlerëso dhe shit makinën tënde
        </button>
      </div>
    </div>

    <div className="trade-image">
      <img src={Trade} alt="Blerje dhe shitje makinash" />
    </div>
  </div>
</section>


 <section  ref={sectionRef} className="features">
      <div className="card">
        <h3>Kontroll mbi shpenzimin</h3>

        <div className="row">
          <div className="icon">₁₀%</div>
          <div className="text">Mos paguaj më shumë sesa vlen</div>
        </div>

        <div className="row">
          <div className="icon">☂</div>
          <div className="text">Siguracion i përfshirë për çdo makinë</div>
        </div>

        <div className="row">
          <div className="icon">📄</div>
          <div className="text">Stabilitet pa surpriza financiare</div>
        </div>

        
      </div>

      <div className="card">
        <h3>Vendimi mbetet gjithmonë i joti</h3>

        <div className="row">
          <div className="icon">↩</div>
          <div className="text">Liria për të ndryshuar mëndje pa kosto shtesë</div>
        </div>

        <div className="row">
          <div className="icon">🔄</div>
          <div className="text">Zëvëndësim sipas nevojës</div>
        </div>

        <div className="row">
          <div className="icon">🚗</div>
          <div className="text">Pick Up & Delivery brenda 45km</div>
        </div>
      </div>

      <div className="card">
        <h3>Proces i drejtëpërdrejtë</h3>

        <div className="row">
          <div className="icon">🧩</div>
          <div className="text">Opsione për çdo kërkesë</div>
        </div>

        <div className="row">
          <div className="icon">⏱</div>
          <div className="text">Rezervim në pak minuta</div>
        </div>
      </div>
    </section>


    <section className="hero">
<div className="hero-image"><img src={Trade}></img></div>
<div className="hero-content">
<span className="eyebrow">SI FUNKSIONON</span>
<h1>Thjeshtë. Pastër. E Jotja.</h1>


<div className="feature">
<h3>Rezervo Makinën Tënde</h3>
<p>Zgjidh nga një gamë e larmishme markash dhe modelesh të njohura — SUV, sedanë, hibride dhe më shumë.</p>
</div>


<div className="feature">
<h3>Merr ose Dërgohet, Ti Vendos</h3>
<p>Merr makinën në aeroport ose dërgohet direkt tek dera jote.</p>
</div>


<div className="feature">
<h3>Drejto Pa Shqetësime</h3>
<p>Siguracion, mirëmbajtje dhe ndihmë rrugore të përfshira.</p>
</div>


<div className="feature">
<h3>Përshtatet Me Jetën Tënde</h3>
<p>Shto shofer, ndërro makinë ose pauzo kur të duhet.</p>
</div>


<div className="actions">
<button onClick={() => window.location.href = 'Reservation'} className="primary">Rezervo një makinë</button>
<button onClick={() => window.location.href = 'Contact'} className="secondary">Na kontaktoni</button>
</div>
</div>
</section>

<section className="info-section">
      <div className="info-card left">
        <div className="info-content">
          <h2>A keni pyetje për marrjen e makinës me qira?</h2>
          <p>
            Këtu do të gjeni përgjigje për pyetjet më të shpeshta mbi tema të ndryshme,
            për të marrë makinën me qira pa shqetësime dhe për të shijuar udhëtimin tuaj
            me qetësi të plotë.
          </p>
          <button onClick={() => window.location.href = 'Faq'} className="btn primary">Zbulo më shumë</button>
        </div>
      </div>

      <div className="info-card right">
        <div className="info-content">
          <h2>Dëshironi të dini më shumë rreth nesh?</h2>
          <p>
            Na ndiqni në rrjetet tona sociale për të qëndruar gjithmonë të përditësuar
            mbi ofertat, promovimet dhe lajmet më të fundit.
          </p>
          <div className="socials">
            <span className="icon">f</span>
            <span className="icon">i</span>
            <span className="icon">in</span>
            <span className="icon">t</span>
          </div>
        </div>
      </div>
    </section>




<section className="values">
      <div className="value">
        <h3>PËRFITUESE</h3>
        <p>
          Kush tha që duhet të paguash më shumë për të marrë më shumë?
          Ne e dimë që një klient i kënaqur është dëshmia më e mirë.
          Prandaj synojmë t’ju ofrojmë saktësisht atë që ju nevojitet:
          shërbim cilësor me çmimin e duhur.
        </p>
        <span className="underline">Qiraja që ia vlen.</span>
      </div>

      <div className="value">
        <h3>E PERSONALIZUESHME</h3>
        <p>
          Çdo udhëtim është i ndryshëm dhe çdo klient ka nevoja specifike.
          Zgjidhjet tona janë fleksibël: së bashku përcaktojmë
          makinën dhe shërbimet që ju lejojnë të përfitoni maksimumin
          nga përvoja juaj me ne.
        </p>
        <span className="underline">Qiraja që të dëgjon.</span>
      </div>

      <div className="value">
        <h3>E BESUESHME</h3>
        <p>
          Mund të na besoni plotësisht. Ju udhëzojmë dhe këshillojmë
          në zgjedhjen e makinës dhe shërbimeve.
          Sqarojmë kushtet dhe garantojmë asistencë 7 ditë në javë,
          gjatë dhe pas qirasë.
        </p>
        <span className="underline">Qiraja që të shoqëron.</span>
      </div>
    </section>

    <section className="contact-section">
      <div className="contact-content">
        <h2>Kur diçka nuk është e qartë, mos e injoro.</h2>

        <p className="contact-psychology">
          Vendimet e këqija nuk vijnë nga zgjedhje të gabuara,
          por nga pyetje që nuk u bënë kurrë.
          Nëse ke edhe një paqartësi të vetme,
          ndalo dhe sqaroje tani.
        </p>

        <a href="Contact" className="contact-main-btn">
          Na kontakto
        </a>

        <span className="contact-note">
        Ne jemi këtu vetëm për shërbimin tuaj.
        </span>
      </div>
    </section>



<Footer />
    </>
)
}

export default Home

