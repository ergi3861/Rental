import "../footer/footer.css"

export default function Footer({ variant }) {

  const revealOnScroll = () => {
    const reveals = document.querySelectorAll(".reveal")
    const trigger = window.innerHeight * 0.9

    reveals.forEach(el => {
      const top = el.getBoundingClientRect().top
      if (top < trigger) {
        el.classList.add("active")
      }
    })
  }

  window.addEventListener("scroll", revealOnScroll)

  return (
    <footer id="footer">

      <div className="footerCta">
        <div className="ctaBox">
          <h2>Rezervo makinën tënde tani</h2>
          <a href="#" className="ctaBtn">Rezervo</a>
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
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
            </div>
          </div>

          <div className="footerLinks reveal">
            <h4>Navigim</h4>

            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Makinat</a></li>
              <li><a href="#">Rezervim</a></li>
              <li><a href="#">Shitje</a></li>
              <li><a href="#">Blerje</a></li>
              <li><a href="#">Shërbime</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Kontakt</a></li>
            </ul>
          </div>

          <div className="footerLinks reveal">
            <h4>Shërbime</h4>

            <ul>
              <li><a href="#">Car Rental</a></li>
              <li><a href="#">Car Sales</a></li>
              <li><a href="#">Airport Pickup</a></li>
              <li><a href="#">Long Term Rental</a></li>
              <li><a href="#">Business Rental</a></li>
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
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>

        </div>

      </div>

    </footer>
  )
}