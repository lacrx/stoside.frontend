exports.id = "component---src-pages-404-tsx";
exports.ids = ["component---src-pages-404-tsx"];
exports.modules = {

/***/ "./src/assets/styles/global.module.css":
/*!*********************************************!*\
  !*** ./src/assets/styles/global.module.css ***!
  \*********************************************/
/***/ (() => {

// Exports


/***/ }),

/***/ "./src/assets/styles/reset.module.css":
/*!********************************************!*\
  !*** ./src/assets/styles/reset.module.css ***!
  \********************************************/
/***/ (() => {

// Exports


/***/ }),

/***/ "./src/components/Footer/footer.module.css":
/*!*************************************************!*\
  !*** ./src/components/Footer/footer.module.css ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   footer: () => (/* binding */ footer)
/* harmony export */ });
// Exports
var footer = "footer-module--footer--2b30a";


/***/ }),

/***/ "./src/components/Hero/hero.module.css":
/*!*********************************************!*\
  !*** ./src/components/Hero/hero.module.css ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hero: () => (/* binding */ hero)
/* harmony export */ });
// Exports
var hero = "hero-module--hero--c42c6";


/***/ }),

/***/ "./src/components/Nav/nav.module.css":
/*!*******************************************!*\
  !*** ./src/components/Nav/nav.module.css ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   nav: () => (/* binding */ nav)
/* harmony export */ });
// Exports
var nav = "nav-module--nav--7755c";


/***/ }),

/***/ "./src/components/Footer/footer.tsx":
/*!******************************************!*\
  !*** ./src/components/Footer/footer.tsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Footer)
/* harmony export */ });
/* harmony import */ var gatsby__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gatsby */ "./.cache/gatsby-browser-entry.js");
/* harmony import */ var _footer_module_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./footer.module.css */ "./src/components/Footer/footer.module.css");
/* harmony import */ var _images_logo_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/images/logo.svg */ "./src/assets/images/logo.svg");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");





function Footer() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("footer", {
    className: _footer_module_css__WEBPACK_IMPORTED_MODULE_1__.footer,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("ul", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("li", {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(gatsby__WEBPACK_IMPORTED_MODULE_0__.Link, {
          to: "/",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            children: "STRONG TOWNS"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("img", {
            src: _images_logo_svg__WEBPACK_IMPORTED_MODULE_2__["default"],
            width: "80",
            alt: "Strong Towns Oceanside Logo"
          })]
        })
      })
    })
  });
}

/***/ }),

/***/ "./src/components/Head/head.tsx":
/*!**************************************!*\
  !*** ./src/components/Head/head.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Head: () => (/* binding */ Head),
/* harmony export */   siteTitleQuery: () => (/* binding */ siteTitleQuery)
/* harmony export */ });
/* harmony import */ var _public_page_data_sq_d_3649515864_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../public/page-data/sq/d/3649515864.json */ "./public/page-data/sq/d/3649515864.json");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");




const siteTitleQuery = "3649515864";
function SEO({
  subheading,
  children
}) {
  const {
    site: {
      siteMetadata: {
        title
      }
    }
  } = _public_page_data_sq_d_3649515864_json__WEBPACK_IMPORTED_MODULE_0__.data;
  const text = (!!subheading ? subheading + " | " : "") + title;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("title", {
      children: text
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("meta", {
      name: "description",
      content: text
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("link", {
      id: "icon",
      rel: "icon",
      href: ""
    }), children]
  });
}
const Head = ({
  subheading,
  location
}) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(SEO, {
  subheading: subheading,
  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("body", {
    className: (location === null || location === void 0 ? void 0 : location.pathname) === "/" ? "home" : location === null || location === void 0 ? void 0 : location.pathname.replaceAll("/", "")
  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("link", {
    id: "icon",
    rel: "icon",
    href: ""
  })]
});

/***/ }),

/***/ "./src/components/Hero/hero.tsx":
/*!**************************************!*\
  !*** ./src/components/Hero/hero.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Hero)
/* harmony export */ });
/* harmony import */ var gatsby__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gatsby */ "./.cache/gatsby-browser-entry.js");
/* harmony import */ var _hero_module_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./hero.module.css */ "./src/components/Hero/hero.module.css");
/* harmony import */ var _images_pelican_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/images/pelican.svg */ "./src/assets/images/pelican.svg");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");





const link = text => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(gatsby__WEBPACK_IMPORTED_MODULE_0__.Link, {
  to: "https://www.meetup.com/oceanside-strong-towns/",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h2", {
    children: text
  })
});
const h3 = text => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h4", {
  children: text
});
const buddyStyle = {
  position: "absolute",
  bottom: "-6px",
  right: "-5px"
};
function Hero({
  title,
  cta,
  description,
  style = {
    paddingBottom: "5rem"
  },
  showBuddy = false
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("header", {
    className: _hero_module_css__WEBPACK_IMPORTED_MODULE_1__.hero,
    style: style,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h1", {
      children: title
    }), description && h3(description), cta && link(cta), showBuddy && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(gatsby__WEBPACK_IMPORTED_MODULE_0__.Link, {
      to: "https://www.instagram.com/oceansidecleanup/?ref=post",
      style: buddyStyle,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("img", {
        src: _images_pelican_svg__WEBPACK_IMPORTED_MODULE_2__["default"],
        width: "60",
        alt: "Oceanside Cleanup Instagram"
      })
    })]
  });
}

/***/ }),

/***/ "./src/components/Layout/layout.tsx":
/*!******************************************!*\
  !*** ./src/components/Layout/layout.tsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Layout)
/* harmony export */ });
/* harmony import */ var _components_Nav_nav__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/components/Nav/nav */ "./src/components/Nav/nav.tsx");
/* harmony import */ var _components_Footer_footer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/components/Footer/footer */ "./src/components/Footer/footer.tsx");
/* harmony import */ var _styles_reset_module_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/styles/reset.module.css */ "./src/assets/styles/reset.module.css");
/* harmony import */ var _styles_reset_module_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_reset_module_css__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _styles_global_module_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/styles/global.module.css */ "./src/assets/styles/global.module.css");
/* harmony import */ var _styles_global_module_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_global_module_css__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");






function Layout({
  children
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("main", {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components_Nav_nav__WEBPACK_IMPORTED_MODULE_0__["default"], {}), children, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components_Footer_footer__WEBPACK_IMPORTED_MODULE_1__["default"], {})]
  });
}
;

/***/ }),

/***/ "./src/components/Nav/nav.tsx":
/*!************************************!*\
  !*** ./src/components/Nav/nav.tsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Nav)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var gatsby__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gatsby */ "./.cache/gatsby-browser-entry.js");
/* harmony import */ var _nav_module_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./nav.module.css */ "./src/components/Nav/nav.module.css");
/* harmony import */ var _images_logo_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/images/logo.svg */ "./src/assets/images/logo.svg");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");






const Hamburger = () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("svg", {
  width: "16",
  height: "10",
  viewBox: "0 0 16 10",
  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("title", {
    children: "Open mobile navigation"
  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("g", {
    fill: "darkslategray",
    fillRule: "evenodd",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("rect", {
      y: "8",
      width: "16",
      height: "2",
      rx: "1"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("rect", {
      width: "16",
      height: "2",
      rx: "1"
    })]
  })]
});
const X = () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("svg", {
  width: "12",
  height: "12",
  viewBox: "0 0 12 12",
  stroke: "darkslategray",
  strokeWidth: "2",
  strokeLinecap: "round",
  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("title", {
    children: "Close mobile navigation"
  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("line", {
    x1: "11",
    y1: "1",
    x2: "1",
    y2: "11"
  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("line", {
    x1: "1",
    y1: "1",
    x2: "11",
    y2: "11"
  })]
});
function Nav() {
  const navRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const {
    0: open,
    1: setOpen
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    function onClickOutHandler(event) {
      var _navRef$current, _navRef$current2;
      const elementHeight = (navRef === null || navRef === void 0 ? void 0 : (_navRef$current = navRef.current) === null || _navRef$current === void 0 ? void 0 : _navRef$current.offsetHeight) || 0;
      const elementTop = (navRef === null || navRef === void 0 ? void 0 : (_navRef$current2 = navRef.current) === null || _navRef$current2 === void 0 ? void 0 : _navRef$current2.offsetTop) || 0;
      const mouseYOffset = event === null || event === void 0 ? void 0 : event.pageY;
      if (elementHeight + elementTop < mouseYOffset) setOpen(false);
    }
    window.addEventListener('click', onClickOutHandler);
    return () => window.removeEventListener('click', onClickOutHandler);
  }, []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("ul", {
    className: `${_nav_module_css__WEBPACK_IMPORTED_MODULE_2__.nav} ${open ? "open" : "closed"}`,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("li", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(gatsby__WEBPACK_IMPORTED_MODULE_1__.Link, {
        to: "/",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          children: ["STRONG", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("br", {}), "TOWNS"]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("br", {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("img", {
          src: _images_logo_svg__WEBPACK_IMPORTED_MODULE_3__["default"],
          width: "80",
          alt: "Strong Towns Oceanside Logo"
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("li", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
        onClick: () => setOpen(!open),
        children: open ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(X, {}) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(Hamburger, {})
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("li", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(gatsby__WEBPACK_IMPORTED_MODULE_1__.Link, {
        to: "/articles",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h3", {
          children: "Articles"
        })
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("li", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(gatsby__WEBPACK_IMPORTED_MODULE_1__.Link, {
        to: "/learn",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h3", {
          children: "Learn"
        })
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("li", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(gatsby__WEBPACK_IMPORTED_MODULE_1__.Link, {
        to: "/events",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h3", {
          children: "Events"
        })
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("li", {
      ref: navRef,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(gatsby__WEBPACK_IMPORTED_MODULE_1__.Link, {
        to: "/about",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h3", {
          children: "About"
        })
      })
    })]
  });
}

/***/ }),

/***/ "./src/pages/404.tsx?export=default":
/*!******************************************!*\
  !*** ./src/pages/404.tsx?export=default ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Head: () => (/* reexport safe */ _components_Head_head__WEBPACK_IMPORTED_MODULE_3__.Head),
/* harmony export */   "default": () => (/* binding */ NotFound)
/* harmony export */ });
/* harmony import */ var _components_Layout_layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/components/Layout/layout */ "./src/components/Layout/layout.tsx");
/* harmony import */ var _components_Hero_hero__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/components/Hero/hero */ "./src/components/Hero/hero.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var _components_Head_head__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/components/Head/head */ "./src/components/Head/head.tsx");



const heroProps = {
  title: "Page not found."
};
function NotFound() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_components_Layout_layout__WEBPACK_IMPORTED_MODULE_0__["default"], {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_components_Hero_hero__WEBPACK_IMPORTED_MODULE_1__["default"], {
      ...heroProps
    })
  });
}


/***/ }),

/***/ "./src/assets/images/logo.svg":
/*!************************************!*\
  !*** ./src/assets/images/logo.svg ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODMuNTQ4IiBoZWlnaHQ9IjE2Ljc2OSIgdmlld0JveD0iMCAwIDgzLjU0OCAxNi43NjkiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgaWQ9InN2Z0dyb3VwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZm9udC1zaXplPSI5cHQiIHN0cm9rZT0iIzBhMjU0MCIgc3Ryb2tlLXdpZHRoPSIwIiBmaWxsPSIjMGEyNTQwIiBzdHlsZT0ic3Ryb2tlOiMwYTI1NDA7c3Ryb2tlLXdpZHRoOjA7ZmlsbDojMGEyNTQwIj48cGF0aCBkPSJNIDUwLjU2MiAxMy40MyBMIDQ5Ljc5NSAxNC4wMDUgTCA0OC45MzIgMTMuMjM4IEwgNDguOTMyIDguMDEyIEwgNDkuOSA3LjIyNyBMIDQ5LjU0NyA2Ljc5MiBMIDQ4LjcwNSA3LjQ3NSBMIDQ2LjQzOSA1LjUyOSBMIDQ0LjI0MSA3LjI0NyBMIDQyLjcgNS41MjkgTCAzOS45MiA3LjQ0NiBMIDQwLjIwOCA3LjgyOSBMIDQwLjk3NSA3LjM1IEwgNDEuNzQyIDguMjEzIEwgNDEuNzQyIDEzLjUyNiBMIDQwLjk3NSAxNC4xOTcgTCA0My4yNzUgMTYuMDE4IEwgNDUuMTkzIDE0LjI5MyBMIDQ0LjMzIDEzLjUyNiBMIDQ0LjMzIDguMDM1IEwgNDUuMTkzIDcuMzUgTCA0Ni42MzEgOC41OTYgTCA0Ni42MzEgMTMuNTI2IEwgNDUuOTYgMTQuMTk3IEwgNDcuOTczIDE2LjAxOCBMIDUwLjk0NSAxNC4wMDUgTCA1MC41NjIgMTMuNDMgWiBNIDUuNzI3IDAuMzcgTCA1LjQzNyAwIEEgOC42ODcgOC42ODcgMCAwIDAgMS4wNjcgMy45NzcgQyAwLjI1OCA1LjUxNSAtMC4wODkgNy4yODMgMC4wMTkgOS4wMTggQSA5LjEzOCA5LjEzOCAwIDAgMCAxLjcwNyAxMy44NzcgQyAyLjI3MyAxNC42NDIgMi45OTUgMTUuMzAyIDMuODQyIDE1LjczNiBBIDUuMDkgNS4wOSAwIDAgMCA2LjE1MyAxNi4yOTggQyA2LjMwNSAxNi4yOTggNi40NTYgMTYuMjkxIDYuNjA3IDE2LjI3NyBDIDcuNDA4IDE2LjIwMSA4LjE4NSAxNS45MjggOC44ODUgMTUuNTMzIEEgOS4wMDMgOS4wMDMgMCAwIDAgMTAuNzg3IDE0LjA1NyBBIDExLjI4IDExLjI4IDAgMCAwIDEzLjAzNyAxMC45MjcgQSA4LjM5IDguMzkgMCAwIDAgMTMuODcyIDcuMzQ2IEEgNy41MTEgNy41MTEgMCAwIDAgMTMuODcyIDcuMjc4IEMgMTMuODYxIDYuMDIgMTMuNTMyIDQuNzY0IDEyLjkxNyAzLjY2NyBDIDEyLjEwNiAyLjIxOCAxMC43OTQgMS4wNTYgOS4yNTcgMC40MjcgTCAzLjQ3OCAyLjkxMSBDIDMuNDkxIDIuODg4IDMuNTA0IDIuODY0IDMuNTE3IDIuODQgQyA0LjA1NSAxLjg2NCA0LjgxNSAxLjAxIDUuNzI3IDAuMzcgWiBNIDY4LjkzNiA2LjA4MiBMIDY2LjUgNy41OCBMIDY2LjUgMTMuNzI4IEwgNjkuMzg1IDE1LjcwNyBMIDczLjc3IDEzLjExNyBMIDczLjc3OSA3LjQ0OCBMIDc0LjYzNSA2Ljc1NCBMIDc0LjI4MiA2LjMxOSBMIDczLjU0MyA2LjkxOSBMIDY2LjY0NSAwLjg1IEwgNjYuNjQ1IDQuNDM3IEwgNjcuMDUzIDQuMzY3IEwgNjguOTM2IDYuMDgyIFogTSAyMS42NTMgMTQuNDM2IEwgMjIuNTM4IDEzLjcxOSBMIDI1LjUwNSAxNS45MjIgTCAyOS42MjggMTIuNTY3IEwgMjkuMzQgMTIuMDg4IEwgMjcuMTM1IDEzLjgxMyBMIDI0LjczOCAxMi4xODQgTCAyNC43MzggMTEuMzIxIEwgMjkuMDUyIDguNjM2IEwgMjkuMDUyIDguNTQxIEwgMjcuMDM5IDUuNDczIEwgMjIuMjQ2IDcuOTY1IEwgMjIuMjQ2IDEzLjIzNSBMIDIxLjMgMTQuMDAyIEwgMjEuNjUzIDE0LjQzNiBaIE0gNzUuNTczIDE0LjQzNiBMIDc2LjQ1OCAxMy43MTkgTCA3OS40MjUgMTUuOTIyIEwgODMuNTQ4IDEyLjU2NyBMIDgzLjI2IDEyLjA4OCBMIDgxLjA1NSAxMy44MTMgTCA3OC42NTggMTIuMTg0IEwgNzguNjU4IDExLjMyMSBMIDgyLjk3MiA4LjYzNiBMIDgyLjk3MiA4LjU0MSBMIDgwLjk1OSA1LjQ3MyBMIDc2LjE2NiA3Ljk2NSBMIDc2LjE2NiAxMy4yMzUgTCA3NS4yMiAxNC4wMDIgTCA3NS41NzMgMTQuNDM2IFogTSAzOS4yNDEgMTMuNTI2IEwgMzguMzc5IDE0LjEwMSBMIDM3LjQyIDEzLjE0MiBMIDM3LjQyIDguMDk5IEwgMzguNDY0IDcuMjUyIEwgMzguMTExIDYuODE3IEwgMzcuMzAzIDcuNDcyIEwgMzQuMzUyIDUuNTY5IEwgMzIuMTQ3IDYuNzE5IEMgMzEuOTE0IDYuODQxIDMxLjY4MiA2Ljk3MSAzMS40ODQgNy4xNDUgQSAxLjc4MyAxLjc4MyAwIDAgMCAzMS4wMzcgNy43MjYgQSAxLjQ4MiAxLjQ4MiAwIDAgMCAzMC44OTggOC4zNSBDIDMwLjg5OCA4LjM4MSAzMC44OTkgOC40MTMgMzAuOTAxIDguNDQ1IEMgMzAuOTE5IDguNzEgMzEuMDEzIDguOTY5IDMxLjE1NiA5LjE5MyBDIDMxLjQyOCA5LjYxOSAzMS44NjEgOS45MTggMzIuMzE4IDEwLjEzNSBBIDUuNTkzIDUuNTkzIDAgMCAwIDMyLjYxNiAxMC4yNjYgQyAzMi4xNDYgMTAuNTEgMzEuNzAxIDEwLjgwMyAzMS4zMDQgMTEuMTUyIEEgMy42OTQgMy42OTQgMCAwIDAgMzAuNTY4IDEyLjAwNiBBIDIuMzU2IDIuMzU2IDAgMCAwIDMwLjIyNCAxMy4wNzIgQSAxLjk5MyAxLjk5MyAwIDAgMCAzMC4yMiAxMy4xOTEgQSAyLjM4MiAyLjM4MiAwIDAgMCAzMC43OCAxNC42OCBDIDMxLjMwNSAxNS4zMTggMzIuMDk1IDE1LjcyIDMyLjkxNCAxNS44MjcgTCAzNS4wMjUgMTQuMjkyIEwgMzYuNTUyIDE1LjgyMiBMIDM5LjMzNiAxMy45MSBMIDM5LjI0MSAxMy41MjYgWiBNIDU5LjA5IDUuNTI3IEwgNTguNTI1IDUuNTI3IEwgNTguNTE3IDUuNTI3IEEgMC45MjMgMC45MjMgMCAwIDEgNTguMTY4IDYuMTQ4IEEgMS4wNTkgMS4wNTkgMCAwIDEgNTcuNTUxIDYuMzYgQSAxLjE1MiAxLjE1MiAwIDAgMSA1Ny41MzYgNi4zNiBDIDU3LjMxIDYuMzY0IDU3LjA4NiA2LjMwNSA1Ni44ODEgNi4yMDggQSAyLjA5NyAyLjA5NyAwIDAgMSA1Ni4wNTYgNS40ODcgTCA1MS45MjMgNy44ODcgTCA1MS45MjMgMTAuNjg3IEwgNTMuNDM2IDExLjg4IEEgMTguNDU0IDE4LjQ1NCAwIDAgMCA1Mi45NDMgMTIuMzUgQSA1LjEyMSA1LjEyMSAwIDAgMCA1MS43MTkgMTQuMDAyIEEgMi43MjMgMi43MjMgMCAwIDAgNTEuNjQ4IDE0LjIwMyBBIDIuMzYzIDIuMzYzIDAgMCAwIDUxLjU0IDE0Ljg1OCBDIDUxLjUzNSAxNS4xNTMgNTEuNTg2IDE1LjQ0OCA1MS43MDIgMTUuNzE5IEMgNTEuOTA1IDE2LjE5NCA1Mi4zMDQgMTYuNTgzIDUyLjc4NSAxNi43NjkgTCA1Mi45OCAxNi4yNDQgQyA1Mi44NjcgMTYuMTggNTIuNzc4IDE2LjA3NSA1Mi43MzIgMTUuOTU0IEMgNTIuNzA2IDE1Ljg4NSA1Mi42OTUgMTUuODEyIDUyLjY5NiAxNS43MzkgQSAwLjYzNyAwLjYzNyAwIDAgMSA1Mi43MzggMTUuNTIgQyA1Mi43OTEgMTUuMzgyIDUyLjg4OSAxNS4yNjQgNTMuMDEgMTUuMTc4IEEgMS4wNjMgMS4wNjMgMCAwIDEgNTMuNTc4IDE0Ljk5MyBBIDEuMjUyIDEuMjUyIDAgMCAxIDUzLjU5NyAxNC45OTIgQSAxLjI5OCAxLjI5OCAwIDAgMSA1My42MDYgMTQuOTkyIEMgNTMuNjE3IDE0Ljk5MSA1My42MjggMTQuOTkxIDUzLjYzOSAxNC45OTEgQSAxLjUwNCAxLjUwNCAwIDAgMSA1NC4yMDYgMTUuMTA4IEEgMS44ODcgMS44ODcgMCAwIDEgNTUuMTIgMTUuOTI3IEwgNTkuMDY4IDEzLjUyNyBMIDU5LjA2OCAxMC41MDcgTCA1Ny4zNDggOS4yMzMgQSA1LjI1MyA1LjI1MyAwIDAgMCA1Ny45NTQgOC42MTIgQSA0LjQ0OCA0LjQ0OCAwIDAgMCA1OC41MzQgNy42NTkgQSA2Ljg0IDYuODQgMCAwIDAgNTkuMDkgNS41MjcgWiBNIDE5LjI5IDEzLjYyNyBMIDIwLjQ0MyAxMi43OTMgTCAyMC43MDMgMTMuMTQzIEwgMTcuNzYgMTUuNzI3IEwgMTcuNDggMTUuNzI3IEwgMTQuNDYgMTMuNjY5IEwgMTQuNDYgNy42ODkgTCAxOC41OSA1LjM4NyBMIDIwLjcxIDcuMDg3IEwgMTguODEgOC41MjcgTCAxNy4wMyA3LjA0NyBMIDE3LjAzIDEyLjI0NyBDIDE3LjI1OSAxMi42NjggMTcuNjA2IDEzLjAyNSAxOC4wMiAxMy4yNjcgQyAxOC40MDQgMTMuNDkxIDE4Ljg0NSAxMy42MTYgMTkuMjkgMTMuNjI3IFogTSA2NS40MzIgMTMuNDMgTCA2NC41NjkgMTQuMDA1IEwgNjMuODk4IDEzLjMzNCBMIDYzLjg5OCA3LjI5NCBMIDYyLjM2NCA1LjQ3MyBMIDU5LjY4IDcuMjk0IEwgNTkuOTY4IDcuNjc4IEwgNjAuNzM1IDcuMTk4IEwgNjEuNDA2IDguMDYxIEwgNjEuNDA2IDEzLjMzNCBMIDYwLjE1OSAxNC4xOTcgTCA2MC40NDcgMTQuNTggTCA2MS4xMTggMTQuMTAxIEwgNjMuMDM1IDE1LjgyNyBMIDY1LjkxMSAxMy44MTMgTCA2NS40MzIgMTMuNDMgWiBNIDMuMTczIDEwLjcwMiBMIDYuOTUyIDkuMTEyIEwgNi45NTMgMi4wNzUgTCA2Ljk5OSAyLjA1NyBDIDcuMzAxIDIuMjMyIDcuNTk1IDIuNDIyIDcuODggMi42MjYgQyA3Ljg4IDYuNDQ5IDcuODggMTAuMjczIDcuODggMTQuMDk2IEMgNy44NzUgMTQuMDk2IDcuODcxIDE0LjA5NiA3Ljg2NyAxNC4wOTcgQSAzLjg2NSAzLjg2NSAwIDAgMSA3LjY5MiAxNC4xMDIgQyA3LjE0OCAxNC4xMDUgNi42MDQgMTMuOTk1IDYuMDk5IDEzLjc4OSBBIDQuODUzIDQuODUzIDAgMCAxIDQuNTk3IDEyLjggQSA2LjM3OSA2LjM3OSAwIDAgMSAzLjE3MyAxMC43MDIgWiBNIDY5LjA4IDYuMjEzIEwgNzEuMiA4LjE0MyBMIDcxLjIgMTQuMTUzIEwgNjkuMDggMTIuNjc5IEwgNjkuMDggNi4yMTMgWiBNIDMuMTIzIDMuNjY2IEwgNC4zNzIgMy4xNDcgQyA0LjM3MiA1LjMwMiA0LjM3MiA3LjQ1OCA0LjM3MiA5LjYxMyBMIDIuOTc5IDEwLjIwNyBDIDIuOTU4IDEwLjE0NyAyLjkzNyAxMC4wODggMi45MTggMTAuMDI4IEMgMi41NzkgOC45OSAyLjQ0MiA3Ljg5MSAyLjQ3NyA2LjggQSA5Ljk1OSA5Ljk1OSAwIDAgMSAyLjQ3OCA2Ljc4OSBBIDkuMTEgOS4xMSAwIDAgMSAzLjEyMyAzLjY2NiBaIE0gOC40NTMgMTAuMjEyIEwgMTEuNzY3IDguNTM5IEEgNi4yNTkgNi4yNTkgMCAwIDEgMTEuODI3IDkuMzIyIEMgMTEuODM4IDEwLjIxIDExLjY1NCAxMS4wOTkgMTEuMjM3IDExLjg4IEEgNC4zMjIgNC4zMjIgMCAwIDEgOS44NDQgMTMuNDM3IEEgMy45NjQgMy45NjQgMCAwIDEgOC40NTMgMTQuMDIxIEMgOC40NTMgMTIuNzUxIDguNDUzIDExLjQ4MiA4LjQ1MyAxMC4yMTIgWiBNIDU1LjM4IDEwLjkyNSBMIDU2LjQ4OCAxMS44MDggTCA1Ni40ODggMTQuNDEzIEMgNTYuMjM3IDEzLjg2MSA1NS43OTEgMTMuMzk4IDU1LjI0NiAxMy4xMzIgQSAyLjUwMyAyLjUwMyAwIDAgMCA1NC4xNTMgMTIuODc2IEMgNTQuMDg5IDEyLjg3NiA1NC4wMjQgMTIuODc5IDUzLjk2MSAxMi44ODQgQSAyLjI0NiAyLjI0NiAwIDAgMCA1Mi43NjYgMTMuMzQ1IEEgOC41NjkgOC41NjkgMCAwIDEgNTMuMzQzIDEyLjc0MyBBIDI5LjE0MiAyOS4xNDIgMCAwIDEgNTQuNjYxIDExLjU0MiBMIDU1LjM4IDEwLjkyNSBaIE0gMTEuMDAzIDYuMTg0IEwgOC40NTMgNy40NzEgQyA4LjQ1MyA2LjAwMyA4LjQ1MyA0LjUzNSA4LjQ1MyAzLjA2NiBBIDEwLjQzMyAxMC40MzMgMCAwIDEgMTAuMTU3IDQuODQgQSA5LjIyOCA5LjIyOCAwIDAgMSAxMS4wMDMgNi4xODQgWiBNIDU1LjMzIDEwLjIzIEwgNTQuNTAzIDkuMzg1IEwgNTQuNTAzIDYuNzggQSAyLjM5IDIuMzkgMCAwIDAgNTUuNzQ1IDguMDYyIEEgMi4zNTEgMi4zNTEgMCAwIDAgNTYuNjgzIDguMjU4IEMgNTYuNzg1IDguMjU5IDU2Ljg4OCA4LjI1MiA1Ni45OSA4LjIzOCBBIDIuMzAxIDIuMzAxIDAgMCAwIDU3LjY4NyA4LjAyOCBBIDMuNjA4IDMuNjA4IDAgMCAxIDU3LjUwNSA4LjI3NCBBIDUuNDczIDUuNDczIDAgMCAxIDU2LjgwMyA4Ljk2NSBMIDU1LjMzIDEwLjIzIFogTSAzMi40MzUgNy4wMDcgTCAzNC45MjcgOC41NDEgQyAzNC45MjcgOS4xNjYgMzQuOTI3IDkuNzkxIDM0LjkyNyAxMC40MTcgQSAxNy4wNjggMTcuMDY4IDAgMCAxIDMzLjg1IDEwLjEyMiBBIDguMzQyIDguMzQyIDAgMCAxIDMyLjczNCA5LjcwMSBBIDIuNzA5IDIuNzA5IDAgMCAxIDMxLjc3NCA5LjAwNyBBIDEuMjU1IDEuMjU1IDAgMCAxIDMxLjQ3NiA4LjI1MyBBIDEuMDE5IDEuMDE5IDAgMCAxIDMxLjQ3NiA4LjIzMyBBIDEuMTI0IDEuMTI0IDAgMCAxIDMxLjYyNCA3LjY4NSBBIDEuNDY5IDEuNDY5IDAgMCAxIDMyLjAxNiA3LjI0NCBBIDEuODA0IDEuODA0IDAgMCAxIDMyLjQzNSA3LjAwNyBaIE0gNjAuNzY1IDIuNzc0IEwgNjIuNDcgNC43MTYgTCA2NC4zOCAzLjAzOSBMIDYyLjY3NSAxLjA5NyBMIDYwLjc2NSAyLjc3NCBaIE0gMzQuOTI3IDEyLjUxNyBBIDE0NDc5NC43MiAxNDQ3OTQuNzIgMCAwIDAgMzQuOTI3IDEwLjk5NSBBIDExNi43NiAxMTYuNzYgMCAwIDAgMzQuMTE3IDEwLjc1MyBBIDI1My4xNjMgMjUzLjE2MyAwIDAgMSAzMy43NDQgMTAuNjQyIEEgMTA2Ljc0IDEwNi43NCAwIDAgMSAzMy42NTUgMTAuNjE2IEEgMTYuMTUgMTYuMTUgMCAwIDEgMzIuOTY1IDEwLjM5NyBBIDIuMzI2IDIuMzI2IDAgMCAwIDMyLjY1NCAxMS4yNCBBIDIuNTIyIDIuNTIyIDAgMCAwIDMyLjYyMiAxMS42NCBDIDMyLjYyMiAxMi4xMTUgMzIuNzUxIDEyLjU5MiAzMi45NzQgMTMuMDEzIEMgMzMuMTA4IDEzLjI2OCAzMy4yOCAxMy41MDYgMzMuNDk3IDEzLjY5NiBDIDMzLjcxMyAxMy44ODcgMzMuOTc3IDE0LjAyNyAzNC4yNiAxNC4wOCBBIDEuMzg0IDEuMzg0IDAgMCAwIDM0LjUxMSAxNC4xMDMgQSAxLjM4MSAxLjM4MSAwIDAgMCAzNC45MjcgMTQuMDM5IEEgMTQ0Nzk0LjcyIDE0NDc5NC43MiAwIDAgMSAzNC45MjcgMTIuNTE3IFogTSAyNC43MzggMTAuODMzIEwgMjQuNzM4IDcuMjIyIEwgMjUuMTIyIDcuMDA3IEwgMjYuODQ3IDkuNDk5IEwgMjQuNzM4IDEwLjgzMyBaIE0gNzguNjU4IDEwLjgzMyBMIDc4LjY1OCA3LjIyMiBMIDc5LjA0MiA3LjAwNyBMIDgwLjc2NyA5LjQ5OSBMIDc4LjY1OCAxMC44MzMgWiBNIDguNDUzIDguMTEzIEwgMTEuMjQ2IDYuNzAzIEEgNy40ODcgNy40ODcgMCAwIDEgMTEuNjU4IDcuOTUyIEwgOC40NTMgOS41NyBMIDguNDUzIDguMTEzIFoiIHZlY3Rvci1lZmZlY3Q9Im5vbi1zY2FsaW5nLXN0cm9rZSIvPjwvZz48L3N2Zz4=");

/***/ }),

/***/ "./src/assets/images/pelican.svg":
/*!***************************************!*\
  !*** ./src/assets/images/pelican.svg ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/static/pelican-7a309b61e949df167b9f56e72be128c6.svg");

/***/ }),

/***/ "./public/page-data/sq/d/3649515864.json":
/*!***********************************************!*\
  !*** ./public/page-data/sq/d/3649515864.json ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"data":{"site":{"siteMetadata":{"title":"Strong Towns Oceanside"}}}}');

/***/ })

};
;
//# sourceMappingURL=component---src-pages-404-tsx.js.map