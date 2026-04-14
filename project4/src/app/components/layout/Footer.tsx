import { Link } from "react-router";
import { BookOpen, Twitter, Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-400 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl text-white" style={{ fontWeight: 700 }}>
                Edu<span className="text-blue-400">Connect</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Connecting students, teachers, and schools to transform education through collaboration, mentorship, and community engagement.
            </p>
            <div className="flex gap-3">
              {[Twitter, Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white text-sm mb-4" style={{ fontWeight: 600 }}>Platform</h4>
            <ul className="space-y-2">
              {["For Students", "For Teachers", "For Schools", "Community Projects", "Events", "Leaderboards"].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-sm hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white text-sm mb-4" style={{ fontWeight: 600 }}>Resources</h4>
            <ul className="space-y-2">
              {["Help Center", "Documentation", "Blog", "Webinars", "Research", "Privacy Policy", "Terms of Service"].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-sm hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm mb-4" style={{ fontWeight: 600 }}>Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <Mail className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                hello@educonnect.io
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Phone className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                +1 (800) 123-4567
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                123 Learning Lane, San Francisco, CA 94102
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-xs text-slate-500 mb-2">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">© 2026 EduConnect. All rights reserved.</p>
          <p className="text-sm text-slate-500">Made with ❤️ for learners everywhere</p>
        </div>
      </div>
    </footer>
  );
}
