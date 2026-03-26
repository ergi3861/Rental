import { useState, useRef } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../components/context/Context";
import "../login/login.css"

const Login = () => {
  // ORIGINAL AUTH FLOW (unchanged behavior)
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
const [fingerActive, setFingerActive] = useState(false);
  // UI STATES (second code)
  const [showPass, setShowPass] = useState(false);
  const [showE1, setShowE1] = useState(false);
  const [showE2, setShowE2] = useState(false);
  const [shakeUser, setShakeUser] = useState(false);
  const [shakePass, setShakePass] = useState(false);
  const [btnText, setBtnText] = useState("Kyçu");
  const [cardStyle, setCardStyle] = useState({});
  const btnRef = useRef(null);

  function handleMouseMove(e) {
    const r = btnRef.current.getBoundingClientRect();
    btnRef.current.style.setProperty("--x", e.clientX - r.left + "px");
    btnRef.current.style.setProperty("--y", e.clientY - r.top + "px");
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e?.preventDefault?.();

    let ok = true;

    if (!form.email.trim()) {
      setShowE1(true);
      setShakeUser(true);
      ok = false;
    } else setShowE1(false);

    if (!form.password.trim()) {
      setShowE2(true);
      setShakePass(true);
      ok = false;
    } else setShowE2(false);

    setTimeout(() => {
      setShakeUser(false);
      setShakePass(false);
    }, 400);

    if (!ok) return;

    try {
      setBtnText("...");
      const res = await API.post("/auth/login", form);
      login(res.data.token);
      setFingerActive(true);

setTimeout(() => {
    navigate("/");
}, 6000);
    } catch (err) {
      setBtnText("Kyçu");
      alert(err.response?.data?.msg || "Invalid credentials");
    }
  }

  function goToSignup(e) {
    e.preventDefault();
    setCardStyle({
      transition: ".35s",
      opacity: "0",
      transform: "translateY(15px)",
    });
    setTimeout(() => {
      window.location = "/signup";
    }, 350);
    
  }

  return (
    <div className="loginForm">
    <div className="card fade-slide" id="card" style={cardStyle}>
      <h1>Kyçu</h1>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <input
            name="email"
            type="email"
            placeholder=" "
            autoComplete="off"
            value={form.email}
            onChange={handleChange}
            className={shakeUser ? "shake" : ""}
            required
          />
          <label>Email</label>
          <div className="error" style={{ display: showE1 ? "block" : "none" }}>
            Plotëso email
          </div>
        </div>

        <div className="field">
          <input
            name="password"
            type={showPass ? "text" : "password"}
            placeholder=" "
            value={form.password}
            onChange={handleChange}
            className={shakePass ? "shake" : ""}
            required
          />
          <span className="toggle" onClick={() => setShowPass(!showPass)}>
            👁
          </span>
          <label>Password</label>
          <div className="error" style={{ display: showE2 ? "block" : "none" }}>
            Plotëso password
          </div>
        </div>

        <button
          id="btn"
          ref={btnRef}
          onMouseMove={handleMouseMove}
          type="submit"
        >
          {btnText}
        </button>
      </form>

      <div className="links">
        <a href="#">Keni harruar fjalëkalimin?</a>
        <a href="signup.html" id="toSignup" onClick={goToSignup}>
          Regjistrohu
        </a>
      </div>
    </div>
    </div>
  );
};

export default Login;