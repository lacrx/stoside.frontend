import { Link } from "gatsby"
import { footer } from './footer.module.css';
import logo from "@/images/logo.svg";

export default function Footer() {
  return (
    <footer className={ footer}>
      <ul>
        <li>
          <Link to="/">
            <div>STRONG TOWNS</div>
            <img src={logo} width="60" alt="Strong Towns Oceanside Logo" />
          </Link>
        </li>
      </ul>
      <span>&copy; {new Date().getFullYear()} Strong Towns Oceanside</span>
    </footer>
  )
}
