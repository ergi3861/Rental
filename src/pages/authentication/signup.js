import { useState, useEffect } from "react";
import API from "../../backendConnection/api";
import "../authentication/auth.css";
import { Link } from "react-router-dom";

export default function Signup() {
  const [firstName,       setFirstName]       = useState("");
  const [lastName,        setLastName]        = useState("");
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [password2,       setPassword2]       = useState("");
  const [errors,          setErrors]          = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [strength,        setStrength]        = useState({ width: "0%", text: "Weak", color: "var(--danger)" });
  const [loading,         setLoading]         = useState(false);
  const [success,         setSuccess]         = useState(false);

  function validate() {
    let ok = true;
    const newErr = {};

    if (!firstName.trim())  { newErr.firstName = "Kërkohet emri";    ok = false; }
    if (!lastName.trim())   { newErr.lastName  = "Kërkohet mbiemri"; ok = false; }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) { newErr.email = "Email i pasaktë"; ok = false; }

    if (password.length < 8)     { newErr.password  = "Min 8 karaktere";  ok = false; }
    if (password !== password2)  { newErr.password2 = "Nuk përputhen";    ok = false; }

    setErrors(newErr);
    return ok;
  }

  function updateStrength(v) {
    let s = 0;
    if (v.length >= 8)  s++;
    if (/[A-Z]/.test(v)) s++;
    if (/\d/.test(v))   s++;
    if (/\W/.test(v))   s++;

    if (s <= 1) setStrength({ width: "25%",  text: "Weak",   color: "var(--danger)"  });
    else if (s <= 3) setStrength({ width: "60%",  text: "Medium", color: "var(--warning)" });
    else             setStrength({ width: "100%", text: "Strong", color: "var(--success)" });
  }

  useEffect(() => { updateStrength(password); }, [password]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!validate()) return;

    setLoading(true);

    try {
      await API.post("/auth/signup", {
        firstName: firstName.trim(),
        lastName:  lastName.trim(),
        email:     email.trim(),
        password,
      });

      setSuccess(true);
      setFirstName(""); setLastName(""); setEmail("");
      setPassword(""); setPassword2("");
      setStrength({ width: "0%", text: "Weak", color: "var(--danger)" });
      setErrors({}); setSubmitAttempted(false);

    } catch (err) {
      setErrors(prev => ({
        ...prev,
        api: err.response?.data?.message || "Gabim gjatë regjistrimit"
      }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="signupForm">
      <div className="card">
        <h2>Regjistrim</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="formGrid">

            <div className="formGroup">
              <input placeholder=" " value={firstName} onChange={e => setFirstName(e.target.value)} />
              <label>Emër</label>
              <div className={`error ${submitAttempted && errors.firstName ? "shake" : ""}`}>
                {errors.firstName || ""}
              </div>
            </div>

            <div className="formGroup">
              <input placeholder=" " value={lastName} onChange={e => setLastName(e.target.value)} />
              <label>Mbiemër</label>
              <div className={`error ${submitAttempted && errors.lastName ? "shake" : ""}`}>
                {errors.lastName || ""}
              </div>
            </div>

            <div className="formGroup full">
              <input type="email" placeholder=" " value={email} onChange={e => setEmail(e.target.value)} />
              <label>Email</label>
              <div className={`error ${submitAttempted && errors.email ? "shake" : ""}`}>
                {errors.email || ""}
              </div>
            </div>

            <div className="formGroup full">
              <input type="password" placeholder=" " value={password} onChange={e => setPassword(e.target.value)} />
              <label>Password</label>
              <div id="strengthBar" style={{ width: strength.width, background: strength.color }}></div>
              <div id="strengthText">{strength.text}</div>
              <div className={`error ${submitAttempted && errors.password ? "shake" : ""}`}>
                {errors.password || ""}
              </div>
            </div>

            <div className="formGroup full">
              <input type="password" placeholder=" " value={password2} onChange={e => setPassword2(e.target.value)} />
              <label>Repeat Password</label>
              <div className={`error ${submitAttempted && errors.password2 ? "shake" : ""}`}>
                {errors.password2 || ""}
              </div>
            </div>

          </div>

          {errors.api && <div className="error">{errors.api}</div>}

          <button type="submit" disabled={loading} className={loading ? "loading" : ""}>
            Regjistrohu
          </button>
        </form>

        {success && <div id="success">Regjistrimi u krye me sukses!</div>}
        <Link to="/login">Kthehu te Login</Link>
      </div>
    </div>
  );
} 