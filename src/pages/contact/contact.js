import { useState } from 'react';
import Footer from '../../components/footer/footer';
import Navigimi from '../../components/navbar/navbar';
import './contact.css';
import API from '../../backendConnection/api';

const initialForm = {
  emri: '',
  mbiemri: '',
  email: '',
  telefoni: '',
  mesazhi: '',
};

const Field = ({ error, children }) => (
  <div className="contactField">
    {children}
    {error && <span className="fieldError">{error}</span>}
  </div>
);

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.emri.trim()) e.emri = 'Emri është i detyrueshëm';
    if (!form.mbiemri.trim()) e.mbiemri = 'Mbiemri është i detyrueshëm';
    if (!form.email.trim()) e.email = 'Emaili është i detyrueshëm';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email i pavlefshëm';
    if (!form.telefoni.trim()) e.telefoni = 'Telefoni është i detyrueshëm';
    if (!form.mesazhi.trim()) e.mesazhi = 'Mesazhi është i detyrueshëm';
    return e;
  };

  const handleSubmit = async (e) => {
    if (loading) return;
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      await API.post('/contacts/post', form);
      setSuccess(true);
      setForm(initialForm);
      setErrors({});
    } catch (err) {
      setServerError(err.response?.data?.error || 'Gabim. Provoni përsëri.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigimi />
      <section id="contact">
        <div className="contactHero">
          <h1>Kontakt</h1>
          <p>Komunikim i drejtpërdrejtë. Pa forma të kota. Pa pritje të panevojshme.</p>
        </div>

        <div className="contactGrid">
          <div className="contactForm">
            <h2>Na Shkruaj</h2>

            {success ? (
              <div className="contactSuccess">
                <div className="contactSuccessIcon">✓</div>
                <h3>Mesazhi u dërgua!</h3>
                <p>Do t'ju kontaktojmë së shpejti.</p>
                <button className="primaryBtn" onClick={() => setSuccess(false)}>
                  Dërgo mesazh tjetër
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="fieldRow">
                  <Field error={errors.emri}>
                    <label>Emri *</label>
                    <input
                      type="text"
                      placeholder="Emri"
                      value={form.emri}
                      onChange={handleChange('emri')}
                    />
                  </Field>
                  <Field error={errors.mbiemri}>
                    <label>Mbiemri *</label>
                    <input
                      type="text"
                      placeholder="Mbiemri"
                      value={form.mbiemri}
                      onChange={handleChange('mbiemri')}
                    />
                  </Field>
                </div>

                <Field error={errors.email}>
                  <label>Email *</label>
                  <input
                    type="email"
                    placeholder="email@domain.com"
                    value={form.email}
                    onChange={handleChange('email')}
                  />
                </Field>

                <Field error={errors.telefoni}>
                  <label>Telefoni *</label>
                  <input
                    type="tel"
                    placeholder="+355..."
                    value={form.telefoni}
                    onChange={handleChange('telefoni')}
                  />
                </Field>

                <Field error={errors.mesazhi}>
                  <label>Mesazhi *</label>
                  <textarea
                    placeholder="Shkruaj mesazhin..."
                    value={form.mesazhi}
                    onChange={handleChange('mesazhi')}
                    rows={5}
                  />
                </Field>

                {serverError && <p className="contactServerError">{serverError}</p>}

                <button type="submit" className="primaryBtn" disabled={loading}>
                  {loading ? 'Duke dërguar...' : 'Dërgo Mesazhin'}
                </button>
              </form>
            )}
          </div>

          <div className="contactInfo">
            <div className="infoCard">
              <h3>Adresa</h3>
              <p>Tiranë, Shqipëri</p>
            </div>
            <div className="infoCard">
              <h3>Telefon</h3>
              <p>+355 69 000 0000</p>
            </div>
            <div className="infoCard">
              <h3>Email</h3>
              <p>info@carrental.al</p>
            </div>
            <div className="infoCard highlight">
              <h3>Asistencë 24/7</h3>
              <p>Për rezervime dhe emergjenca rrugore</p>
            </div>
          </div>
        </div>

        <div className="contactStrip">
          <h2>Gati për të rezervuar?</h2>
          <p>Shiko flotën dhe merr makinën që të duhet sot.</p>
          <button className="primaryBtn large" onClick={() => {window.location.href = "/cars"}}>Shiko Makinat</button>
        </div>
      </section>
      <Footer />
    </>
  );
}
