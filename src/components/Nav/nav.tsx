import { useEffect, useRef, useState } from "react";
import { Link } from "gatsby";
import { nav, loginBtn, loginForm, loginInput, loginSubmit, loginError as loginErrorCls, loggedIn } from './nav.module.css';
import logo from "@/images/logo.svg";
import { useAuth } from "@/components/Auth/auth-context";

const Hamburger = () =>
  <svg width="16" height="10" viewBox="0 0 16 10">
    <title>Open mobile navigation</title>
    <g fill="darkslategray" fillRule="evenodd">
      <rect y="8" width="16" height="2" rx="1"></rect>
      <rect width="16" height="2" rx="1"></rect>
    </g>
  </svg>

const X = () =>
  <svg width="12" height="12" viewBox="0 0 12 12" stroke="darkslategray" strokeWidth="2" strokeLinecap="round">
    <title>Close mobile navigation</title>
    <line x1="11" y1="1" x2="1" y2="11"></line>
    <line x1="1" y1="1" x2="11" y2="11"></line>
  </svg>

export default function Nav() {
  const navRef = useRef<HTMLLIElement>(null);
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAdmin, userName, login, logout } = useAuth();

  useEffect(() => {
    function onClickOutHandler(event: MouseEvent) {
      const elementHeight = navRef?.current?.offsetHeight || 0;
      const elementTop = navRef?.current?.offsetTop || 0;
      const mouseYOffset = event?.pageY;

      if (elementHeight + elementTop < mouseYOffset) setOpen(false);
    }

    window.addEventListener('click', onClickOutHandler);

    return () => window.removeEventListener('click', onClickOutHandler)
  }, []);

  return (
    <ul className={ `${nav} ${open ? "open" : "closed"}` }>
      <li>
        <Link to="/">
          <div>STRONG TOWNS</div>
          <img src={logo} width="60" alt="Strong Towns Oceanside Logo" />
        </Link>
      </li>
      <li>
        <button onClick={ () => setOpen(!open) }>
          { open ? <X /> : <Hamburger /> }
        </button>
      </li>
      <li>
        <Link to="/articles">
          <span>Articles</span>
        </Link>
      </li>
      <li>
        <Link to="/events">
          <span>Events</span>
        </Link>
      </li>
      <li>
        <Link to="/walk">
          <span>Walk</span>
        </Link>
      </li>
      <li ref={navRef}>
        <Link to="/about">
          <span>About</span>
        </Link>
      </li>
      <li>
        {isAdmin ? (
          <span className={loggedIn}>
            {userName} <button className={loginBtn} onClick={logout}>Log out</button>
          </span>
        ) : showLogin ? (
          <form className={loginForm} onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            setError("");
            const err = await login(email, pass);
            setLoading(false);
            if (err) { setError(err); } else { setShowLogin(false); setEmail(""); setPass(""); }
          }}>
            <input className={loginInput} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input className={loginInput} type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} required />
            <button className={loginSubmit} type="submit" disabled={loading}>{loading ? "..." : "Log in"}</button>
            <button className={loginBtn} type="button" onClick={() => { setShowLogin(false); setError(""); }}>Cancel</button>
            {error && <span className={loginErrorCls}>{error}</span>}
          </form>
        ) : (
          <button className={loginBtn} onClick={() => setShowLogin(true)}>Log in</button>
        )}
      </li>
    </ul>
  )
}
