import { TiArrowRight } from "react-icons/ti";
import { SlSocialLinkedin } from "react-icons/sl";
import { SlSocialGithub } from "react-icons/sl";
import { SlSocialInstagram } from "react-icons/sl";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="min-h-fit w-full md:max-w-[1500px] lg:max-w-[1800px] mx-auto mt-30 mb-8">
      <h2 className=" text-center text-3xl md:text-[9rem] font-black leading-none tracking-tighter uppercase">
        LOKASTAY- CONTACT
      </h2>
      <div className="flex flex-col items-center mt-8">
        <div className="flex gap-8 text-lg sm:gap-20 items-center flex-row font-semibold">
          <p className="flex flex-row items-center">
            About us <TiArrowRight size={20} className="ml-2" />
          </p>
          <p className="flex flex-row items-center">
            FAQ <TiArrowRight size={20} className="ml-2" />
          </p>
          <p className="flex flex-row items-center">
            Contact us <TiArrowRight size={20} className="ml-2" />
          </p>
        </div>
        <p className="text-sm font-normal text-gray-500 text-center leading-relaxed max-w-xs mt-8">
          with our dedication and expertise in hospitality, we strive to offer
          stays that go beyond just a room, providing a comforting journey
          toward relaxation and unforgettable experiences
        </p>
        <div className="flex flex-col sm:flex-row w-full items-center justify-between gap-4 mt-8 text-xs sm:text-md">
          <a href="#">Helpline: +1234 567 890</a>

          <nav aria-label="Social media">
            <ul className="flex gap-6">
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Lokastay on LinkedIn"
                >
                  <SlSocialLinkedin size={20} />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Lokastay on GitHub"
                >
                  <SlSocialGithub size={20} />
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Lokastay on Instagram"
                >
                  <SlSocialInstagram size={20} />
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Lokastay on X (Twitter)"
                >
                  <FaXTwitter size={20} />
                </a>
              </li>
            </ul>
          </nav>

          <p>© {new Date().getFullYear()} Lokastay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
