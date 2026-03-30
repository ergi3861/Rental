import React, { useEffect } from "react";
import "../faq/faq.css";
import Navigimi from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";

const FAQS = [
  {
    category: "Qira",
    items: [
      {
        q: "A mund të marr makinën me qira për vetëm 1 ditë?",
        a: "Po, rezervimet fillojnë nga 1 ditë. Nuk ka minimum ditor të detyrueshëm — ju paguani vetëm për kohën që e mbani."
      },
      {
        q: "A përfshihet sigurimi në çmim?",
        a: "Po. Çdo makinë vjen me sigurim bazë të përfshirë. Ofrojmë gjithashtu opsione shtesë si zero franshizë, mbrojtje gome dhe xhami me kosto minimale."
      },
      {
        q: "Sa kohë para duhet të rezervoj?",
        a: "Mund të rezervoni edhe 30 minuta para marrjes. Megjithatë, për datat e fundjavës dhe periudhën e verës rekomandojmë rezervim 2-3 ditë më parë."
      },
      {
        q: "A mund ta dorëzoj makinën në qytet tjetër?",
        a: "Po. Ofrojmë dorëzim dhe marrje në të gjitha qytetet kryesore. Tarifa shtesë varion sipas distancës — shiko çmimet gjatë rezervimit."
      },
    ]
  },
  {
    category: "Blerje & Shitje",
    items: [
      {
        q: "Si funksionon procesi i shitjes së makinës sime?",
        a: "Plotëso formularin me të dhënat e makinës, ekipi ynë të kontakton brenda 24 orësh me një ofertë. Nëse pranon, vijmë ta inspektojmë, paguajmë dhe marrim makinën. Pa ndërmjetës, pa komision."
      },
      {
        q: "Sa kohë zgjat vlerësimi i makinës?",
        a: "Vlerësimi fillestar bëhet online brenda 24 orësh. Inspektimi fizik zgjat 30-45 minuta. Pagesa bëhet në të njëjtën ditë pas finalizimit të dokumenteve."
      },
      {
        q: "A mund të blej makinë pa e parë fizikisht?",
        a: "Çdo makinë në flotën tonë vjen me raport të detajuar inspektimi, foto të plota dhe histori shërbimi. Ofrojmë edhe tur virtual me video për blerësit që nuk mund të vijnë personalisht."
      },
      {
        q: "Çfarë dokumentesh nevojiten për të shitur makinën?",
        a: "Nevojiten: letërnjoftimi, librezha e makinës dhe çertifikata e pronësisë. Ne merremi me të gjitha procedurat e tjera administrative dhe transferimin e pronësisë."
      },
    ]
  },
  {
    category: "Pagesa & Dokumentacion",
    items: [
      {
        q: "Cilat mënyra pagese pranoni?",
        a: "Pranojmë cash, kartë debiti/krediti (Visa, Mastercard), transfertë bankare dhe pagesa online. Për kontrata afatgjata ofrojmë edhe faturim mujor."
      },
      {
        q: "A nevojitet depozitë për qiranë?",
        a: "Depozita është opsionale dhe e ulët. Ofrojmë alternativa pa depozitë për klientë me histori të mirë ose me rezervim të konfirmuar paraprak."
      },
      {
        q: "A mund të anuloj rezervimin?",
        a: "Po. Anulimi është falas deri 24 orë para marrjes së makinës. Pas kësaj afati, mund të aplikohet një tarifë e vogël anulimi sipas politikës sonë."
      },
    ]
  },
];

export default function FAQ() {
  useEffect(() => {
    const cards = document.querySelectorAll(".faq-card");

    cards.forEach(card => {
      card.addEventListener("click", () => {
        cards.forEach(c => {
          if (c !== card && c.classList.contains("active")) {
            c.classList.add("closing");
            setTimeout(() => {
              c.classList.remove("active");
              c.classList.remove("closing");
            }, 120);
          }
        });
        card.classList.toggle("active");
      });

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--x", (e.clientX - rect.left) + "px");
        card.style.setProperty("--y", (e.clientY - rect.top) + "px");
      });
    });
  }, []);

  return (
    <>
      <Navigimi />
      <div className="faq">
        <section className="faq-section">

          <div className="background">
            <div className="orb orb1" />
            <div className="orb orb2" />
            <div className="orb orb3" />
          </div>

          <div className="faq-hero">
            <span className="faq-eyebrow">Ndihmë & Informacion</span>
            <h2 className="faq-title">Pyetje të Shpeshta</h2>
            <p className="faq-sub">
              Gjithçka që duhet të dini rreth qirasë, blerjes dhe shitjes së makinave.
            </p>
          </div>

          {FAQS.map((group, gi) => (
            <div className="faq-group" key={gi}>
              <div className="faq-group__label">
                <span>{group.category}</span>
              </div>
              <div className="faq-container">
                {group.items.map((item, ii) => (
                  <div className="faq-card" key={`${gi}-${ii}`}>
                    <div className="faq-question">
                      <span>{item.q}</span>
                      <div className="icon">+</div>
                    </div>
                    <div className="faq-answer">{item.a}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="faq-cta">
            <p>Nuk gjete përgjigjen?</p>
            <button className="faq-cta__btn">Na Kontaktoni →</button>
          </div>

        </section>
      </div>
      <Footer />
    </>
  );
}