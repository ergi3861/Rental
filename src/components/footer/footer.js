import "../footer/footer.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function Footer({ variant }) {

  const revealOnScroll = () => {
    const reveals = document.querySelectorAll(".reveal");
    const trigger = window.innerHeight * 0.9;

    reveals.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < trigger) {
        el.classList.add("active");
      }
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", revealOnScroll);
    return () => window.removeEventListener("scroll", revealOnScroll);
  }, []);

  return (
    <footer id="footer">

      <div className="footerCta">
        <div className="ctaBox">
          <h2>Rezervo makinën tënde tani</h2>
          <Link to="/" className="ctaBtn">Rezervo</Link>
        </div>
      </div>

      <div className="footerContainer">

        <div className="footerGrid">

          <div className="footerBrand reveal">
            <h3>Rental & Sales</h3>

            <p>
              Platformë moderne për marrjen me qira, blerjen dhe shitjen e automjeteve.
              Proces i shpejtë dhe pa ndërmjetës.
            </p>

            <div className="socials">
              <Link to="/"><i className="fab fa-facebook-f"></i></Link>
              <Link to="/"><i className="fab fa-instagram"></i></Link>
              <Link to="/"><i className="fab fa-linkedin-in"></i></Link>
              <Link to="/"><i className="fab fa-twitter"></i></Link>
            </div>
          </div>

          <div className="footerLinks reveal">
            <h4>Navigim</h4>

            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/">Makinat</Link></li>
              <li><Link to="/">Rezervim</Link></li>
              <li><Link to="/">Shitje</Link></li>
              <li><Link to="/">Blerje</Link></li>
              <li><Link to="/">Shërbime</Link></li>
              <li><Link to="/">FAQ</Link></li>
              <li><Link to="/">Kontakt</Link></li>
            </ul>
          </div>

          <div className="footerLinks reveal">
            <h4>Shërbime</h4>

            <ul>
              <li><Link to="/">Car Rental</Link></li>
              <li><Link to="/">Car Sales</Link></li>
              <li><Link to="/">Airport Pickup</Link></li>
              <li><Link to="/">Long Term Rental</Link></li>
              <li><Link to="/">Business Rental</Link></li>
            </ul>
          </div>

          <div className="footerContact reveal">
            <h4>Kontakt</h4>

            <p>📞 +355 69 123 4567</p>
            <p>✉ info@rentalsales.com</p>
            <p>📍 Tirana, Albania</p>
            <p>🕒 Mon – Sun 08:00 – 22:00</p>
          </div>

          <div className="footerNewsletter reveal">
            <h4>Newsletter</h4>

            <p>Merr ofertat dhe makinat e reja.</p>

            <form id="newsletterForm">
              <input type="email" placeholder="Email address" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>

        </div>

        <div className="footerBottom">

          <p>© 2026 Rental & Sales</p>

          <div className="footerPolicy">
            <Link to="/">Privacy</Link>
            <Link to="/">Terms</Link>
            <Link to="/">Cookies</Link>
          </div>

        </div>

      </div>

    </footer>
  );
}