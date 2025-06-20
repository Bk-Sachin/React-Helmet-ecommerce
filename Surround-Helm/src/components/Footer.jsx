import React from "react";
import "./Footer.css";
import helmetLight from "../assets/logo-light.png";
import helmetDark from "../assets/logo-dark.png";
import { FaXTwitter, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa6";

export function Footer({ mode }) {
  const footerLogo = mode === "dark" ? helmetDark : helmetLight;

  return (
    <footer className={`footer-section ${mode === 'dark' ? 'dark-mode' : 'light-mode'}`}>
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-info">
            <img src={footerLogo} alt="Helmet Logo" className="footer-logo" />
            <p className="footer-description">
              Helmet empowers teams to transform raw data into clear, compelling
              visuals — making insights easier to share, understand, and act on.
            </p>
            <div className="footer-social-icons">
              <a href="#" aria-label="Twitter"><FaXTwitter /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
              <a href="#" aria-label="Github"><FaGithub /></a>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4 className="footer-column-title">Product</h4>
              <a href="#">Features</a>
              <a href="#">Pricing</a>
              <a href="#">Integrations</a>
              <a href="#">Changelog</a>
            </div>
            <div className="footer-column">
              <h4 className="footer-column-title">Resources</h4>
              <a href="#">Documentation</a>
              <a href="#">Tutorials</a>
              <a href="#">Blog</a>
              <a href="#">Support</a>
            </div>
            <div className="footer-column">
              <h4 className="footer-column-title">Company</h4>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
              <a href="#">Partners</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p className="footer-copyright">© 2025 Helmet. All rights reserved.</p>
          <div className="footer-legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookies Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
