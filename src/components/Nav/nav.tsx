import { useEffect, useRef, useState } from "react";
import { Link } from "gatsby";
import { nav } from './nav.module.css';
import logo from "@/images/logo.svg";

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
  const navRef = useRef<HTMLLIElement>();
  const [open, setOpen] = useState(false);

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
          <div>
            STRONG
            <br/>
            TOWNS
          </div>
          <br/>
          <img src={logo} width="80" alt="Strong Towns Oceanside Logo" />
        </Link>
      </li>
      <li>
        <button onClick={ () => setOpen(!open) }>
          { open ? <X /> : <Hamburger /> }
        </button>
      </li>
      <li>
        <Link to="/articles">
          <h3>Articles</h3>
        </Link>
      </li>
      <li>
        <Link to="/learn">
          <h3>Learn</h3>
        </Link>
      </li>
      <li>
        <Link to="/events">
          <h3>Events</h3>
        </Link>
      </li>
      <li ref={navRef}>
        <Link to="/about">
          <h3>About</h3>
        </Link>
      </li>
    </ul>
  )
}
