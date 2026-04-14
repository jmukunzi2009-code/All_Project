import React, { useState, useEffect, useRef } from "react";
import { navbarStyles } from "../assets/dummyStyles";
import { useLocation, Link } from "react-router-dom";
import { User, Key, Menu, X, Search, MapPin, Phone, Clock } from 'lucide-react';
import { SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/clerk-react';
import logo from "../assets/logo.png";

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navRef = useRef(null);
  const searchRef = useRef(null);
  const location = useLocation();

    useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Doctors", href: "/doctors" },
    { label: "Services", href: "/services" },
    { label: "Appointments", href: "/appointments" },
    { label: "Contact", href: "/contact" },
  ];

  // Search data
  const searchData = [
    { id: 1, type: "page", title: "Home", subtitle: "Main page", href: "/" },
    { id: 2, type: "page", title: "Doctors", subtitle: "Find healthcare professionals", href: "/doctors" },
    { id: 3, type: "page", title: "Services", subtitle: "Medical services offered", href: "/services" },
    { id: 4, type: "page", title: "Appointments", subtitle: "Book your appointment", href: "/appointments" },
    { id: 5, type: "page", title: "Contact", subtitle: "Get in touch with us", href: "/contact" },
    { id: 6, type: "service", title: "Emergency Care", subtitle: "24/7 emergency services", href: "/services" },
    { id: 7, type: "service", title: "Primary Care", subtitle: "General healthcare services", href: "/services" },
    { id: 8, type: "service", title: "Cardiology", subtitle: "Heart health specialists", href: "/doctors" },
    { id: 9, type: "service", title: "Dermatology", subtitle: "Skin care specialists", href: "/doctors" },
    { id: 10, type: "contact", title: "Phone: (555) 123-4567", subtitle: "Call us for appointments", href: "/contact" },
    { id: 11, type: "contact", title: "Emergency: 911", subtitle: "For medical emergencies", href: "/contact" },
  ];

  // Filter search results
  const filteredResults = searchData.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
  };

  const handleSearchSelect = (item) => {
    setSearchQuery("");
    setShowSearchResults(false);
    setShowMobileSearch(false);
    setIsOpen(false);
    // Navigate to the selected item
    window.location.href = item.href;
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className={navbarStyles.navbarBorder}></div>

      <nav
        ref={navRef}
        className={`${navbarStyles.navbarContainer} ${
          showNavbar ? navbarStyles.navbarVisible : navbarStyles.navbarHidden
        }`}
      >
        <div className={navbarStyles.contentWrapper}>
          <div className={navbarStyles.flexContainer}>
            {/* Logo */}
            <Link to="/" className={navbarStyles.logoLink}>
              <div className={navbarStyles.logoContainer}>
                <div className={navbarStyles.logoImageWrapper}>
                  <img
                    src={logo}
                    alt="Logo"
                    className={navbarStyles.logoImage}
                  />
                </div>
              </div>

              <div className={navbarStyles.logoTextContainer}>
                <h1 className={navbarStyles.logoTitle}>MediCare</h1>
                <p className={navbarStyles.logoSubtitle}>Healthcare Solutions</p>
              </div>
            </Link>

            <div className={navbarStyles.desktopNav}>
              <div className={navbarStyles.navItemsContainer}>
                {navItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`${navbarStyles.navItem} ${isActive ? navbarStyles.navItemActive : navbarStyles.navItemInactive}`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Search */}
            <div className={navbarStyles.searchContainer} ref={searchRef}>
              <div className="relative">
                <Search className={navbarStyles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search doctors, services..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className={navbarStyles.searchInput}
                />
                {showSearchResults && filteredResults.length > 0 && (
                  <div className={navbarStyles.searchResults}>
                    {filteredResults.slice(0, 6).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSearchSelect(item)}
                        className={navbarStyles.searchResultItem}
                      >
                        <div className={navbarStyles.searchResultTitle}>{item.title}</div>
                        <div className={navbarStyles.searchResultSubtitle}>{item.subtitle}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile search toggle */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className={navbarStyles.mobileSearchToggle}
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={navbarStyles.mobileToggle}
            >
              {isOpen ? <X className={navbarStyles.toggleIcon} /> : <Menu className={navbarStyles.toggleIcon} />}
            </button>
            {/* right side */}

            <div className={navbarStyles.rightContainer}>
              <SignedOut>
                <Link to="/doctor-admin/login" className={navbarStyles.doctorAdminButton}>
                  <User className={navbarStyles.doctorAdminIcon} />
                  <span className={navbarStyles.doctorAdminText}>Doctor Admin</span>
                </Link>

                <SignInButton mode="modal">
                  <button className={navbarStyles.loginButton}>
                    <Key className={navbarStyles.loginIcon} />
                    <span className={navbarStyles.loginText}>Patient Login</span>
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <Link to="/patient/dashboard" className={navbarStyles.dashboardButton}>
                  <User className={navbarStyles.dashboardIcon} />
                  <span className={navbarStyles.dashboardText}>Dashboard</span>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <div className={navbarStyles.mobileMenu}>
              {/* Mobile search */}
              {showMobileSearch && (
                <div className={navbarStyles.mobileSearchContainer}>
                  <div className="relative">
                    <Search className={navbarStyles.searchIcon} />
                    <input
                      type="text"
                      placeholder="Search doctors, services..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className={navbarStyles.mobileSearchInput}
                    />
                  </div>
                  {showSearchResults && filteredResults.length > 0 && (
                    <div className={navbarStyles.searchResults}>
                      {filteredResults.slice(0, 4).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSearchSelect(item)}
                          className={navbarStyles.searchResultItem}
                        >
                          <div className={navbarStyles.searchResultTitle}>{item.title}</div>
                          <div className={navbarStyles.searchResultSubtitle}>{item.subtitle}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`${navbarStyles.mobileMenuItem} ${isActive ? navbarStyles.mobileMenuItemActive : navbarStyles.mobileMenuItemInactive}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <SignedOut>

                <Link to="/doctor-admin/login"
                className={navbarStyles.mobileDoctorAdminButton}
                onClick={() => setIsOpen(false)}>
                  Doctor Admin
                </Link>

                <div className={navbarStyles.mobileLoginContainer}>

                  <SignInButton mode="modal">
                    <button onClick={()=> setIsOpen(false)} className={navbarStyles.mobileLoginButton}
                    >
                      Login
                    </button>
                  </SignInButton>
                </div>
              </SignedOut>
            </div>
          )}
        </div>

        <style>{navbarStyles.animationStyles}</style>
      </nav>
    </>
  );
};

export default Navbar;