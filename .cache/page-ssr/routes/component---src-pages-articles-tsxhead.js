exports.id = "component---src-pages-articles-tsxhead";
exports.ids = ["component---src-pages-articles-tsxhead"];
exports.modules = {

/***/ "./node_modules/camelcase/index.js":
/*!*****************************************!*\
  !*** ./node_modules/camelcase/index.js ***!
  \*****************************************/
/***/ ((module) => {

"use strict";


const UPPERCASE = /[\p{Lu}]/u;
const LOWERCASE = /[\p{Ll}]/u;
const LEADING_CAPITAL = /^[\p{Lu}](?![\p{Lu}])/gu;
const IDENTIFIER = /([\p{Alpha}\p{N}_]|$)/u;
const SEPARATORS = /[_.\- ]+/;

const LEADING_SEPARATORS = new RegExp('^' + SEPARATORS.source);
const SEPARATORS_AND_IDENTIFIER = new RegExp(SEPARATORS.source + IDENTIFIER.source, 'gu');
const NUMBERS_AND_IDENTIFIER = new RegExp('\\d+' + IDENTIFIER.source, 'gu');

const preserveCamelCase = (string, toLowerCase, toUpperCase) => {
	let isLastCharLower = false;
	let isLastCharUpper = false;
	let isLastLastCharUpper = false;

	for (let i = 0; i < string.length; i++) {
		const character = string[i];

		if (isLastCharLower && UPPERCASE.test(character)) {
			string = string.slice(0, i) + '-' + string.slice(i);
			isLastCharLower = false;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = true;
			i++;
		} else if (isLastCharUpper && isLastLastCharUpper && LOWERCASE.test(character)) {
			string = string.slice(0, i - 1) + '-' + string.slice(i - 1);
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = false;
			isLastCharLower = true;
		} else {
			isLastCharLower = toLowerCase(character) === character && toUpperCase(character) !== character;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = toUpperCase(character) === character && toLowerCase(character) !== character;
		}
	}

	return string;
};

const preserveConsecutiveUppercase = (input, toLowerCase) => {
	LEADING_CAPITAL.lastIndex = 0;

	return input.replace(LEADING_CAPITAL, m1 => toLowerCase(m1));
};

const postProcess = (input, toUpperCase) => {
	SEPARATORS_AND_IDENTIFIER.lastIndex = 0;
	NUMBERS_AND_IDENTIFIER.lastIndex = 0;

	return input.replace(SEPARATORS_AND_IDENTIFIER, (_, identifier) => toUpperCase(identifier))
		.replace(NUMBERS_AND_IDENTIFIER, m => toUpperCase(m));
};

const camelCase = (input, options) => {
	if (!(typeof input === 'string' || Array.isArray(input))) {
		throw new TypeError('Expected the input to be `string | string[]`');
	}

	options = {
		pascalCase: false,
		preserveConsecutiveUppercase: false,
		...options
	};

	if (Array.isArray(input)) {
		input = input.map(x => x.trim())
			.filter(x => x.length)
			.join('-');
	} else {
		input = input.trim();
	}

	if (input.length === 0) {
		return '';
	}

	const toLowerCase = options.locale === false ?
		string => string.toLowerCase() :
		string => string.toLocaleLowerCase(options.locale);
	const toUpperCase = options.locale === false ?
		string => string.toUpperCase() :
		string => string.toLocaleUpperCase(options.locale);

	if (input.length === 1) {
		return options.pascalCase ? toUpperCase(input) : toLowerCase(input);
	}

	const hasUpperCase = input !== toLowerCase(input);

	if (hasUpperCase) {
		input = preserveCamelCase(input, toLowerCase, toUpperCase);
	}

	input = input.replace(LEADING_SEPARATORS, '');

	if (options.preserveConsecutiveUppercase) {
		input = preserveConsecutiveUppercase(input, toLowerCase);
	} else {
		input = toLowerCase(input);
	}

	if (options.pascalCase) {
		input = toUpperCase(input.charAt(0)) + input.slice(1);
	}

	return postProcess(input, toUpperCase);
};

module.exports = camelCase;
// TODO: Remove this for the next major release
module.exports["default"] = camelCase;


/***/ }),

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

/***/ "./src/components/Card/card.module.css":
/*!*********************************************!*\
  !*** ./src/components/Card/card.module.css ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   card: () => (/* binding */ card)
/* harmony export */ });
// Exports
var card = "card-module--card--f512c";


/***/ }),

/***/ "./src/components/Content/content.module.css":
/*!***************************************************!*\
  !*** ./src/components/Content/content.module.css ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   content: () => (/* binding */ content)
/* harmony export */ });
// Exports
var content = "content-module--content--cee89";


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

/***/ "./node_modules/gatsby-plugin-image/dist/gatsby-image.module.js":
/*!**********************************************************************!*\
  !*** ./node_modules/gatsby-plugin-image/dist/gatsby-image.module.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GatsbyImage: () => (/* binding */ X),
/* harmony export */   MainImage: () => (/* binding */ D),
/* harmony export */   Placeholder: () => (/* binding */ C),
/* harmony export */   StaticImage: () => (/* binding */ Z),
/* harmony export */   generateImageData: () => (/* binding */ b),
/* harmony export */   getImage: () => (/* binding */ I),
/* harmony export */   getImageData: () => (/* binding */ R),
/* harmony export */   getLowResolutionImageURL: () => (/* binding */ y),
/* harmony export */   getSrc: () => (/* binding */ W),
/* harmony export */   getSrcSet: () => (/* binding */ j),
/* harmony export */   withArtDirection: () => (/* binding */ _)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var camelcase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! camelcase */ "./node_modules/camelcase/index.js");
/* harmony import */ var camelcase__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(camelcase__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);




function n() {
  return n = Object.assign ? Object.assign.bind() : function (e) {
    for (var t = 1; t < arguments.length; t++) {
      var a = arguments[t];
      for (var i in a) Object.prototype.hasOwnProperty.call(a, i) && (e[i] = a[i]);
    }
    return e;
  }, n.apply(this, arguments);
}
function o(e, t) {
  if (null == e) return {};
  var a,
    i,
    r = {},
    n = Object.keys(e);
  for (i = 0; i < n.length; i++) t.indexOf(a = n[i]) >= 0 || (r[a] = e[a]);
  return r;
}
var s = [.25, .5, 1, 2],
  l = [750, 1080, 1366, 1920],
  u = [320, 654, 768, 1024, 1366, 1600, 1920, 2048, 2560, 3440, 3840, 4096],
  d = 800,
  c = 800,
  h = 4 / 3,
  g = function (e) {
    return console.warn(e);
  },
  p = function (e, t) {
    return e - t;
  },
  m = function (e, t) {
    switch (t) {
      case "constrained":
        return "(min-width: " + e + "px) " + e + "px, 100vw";
      case "fixed":
        return e + "px";
      case "fullWidth":
        return "100vw";
      default:
        return;
    }
  },
  f = function (e) {
    return e.map(function (e) {
      return e.src + " " + e.width + "w";
    }).join(",\n");
  };
function v(e) {
  var t = e.lastIndexOf(".");
  if (-1 !== t) {
    var a = e.slice(t + 1);
    if ("jpeg" === a) return "jpg";
    if (3 === a.length || 4 === a.length) return a;
  }
}
function w(e) {
  var t = e.layout,
    i = void 0 === t ? "constrained" : t,
    r = e.width,
    o = e.height,
    s = e.sourceMetadata,
    l = e.breakpoints,
    u = e.aspectRatio,
    d = e.formats,
    g = void 0 === d ? ["auto", "webp"] : d;
  return g = g.map(function (e) {
    return e.toLowerCase();
  }), i = camelcase__WEBPACK_IMPORTED_MODULE_1___default()(i), r && o ? n({}, e, {
    formats: g,
    layout: i,
    aspectRatio: r / o
  }) : (s.width && s.height && !u && (u = s.width / s.height), "fullWidth" === i ? (r = r || s.width || l[l.length - 1], o = o || Math.round(r / (u || h))) : (r || (r = o && u ? o * u : s.width ? s.width : o ? Math.round(o / h) : c), u && !o ? o = Math.round(r / u) : u || (u = r / o)), n({}, e, {
    width: r,
    height: o,
    aspectRatio: u,
    layout: i,
    formats: g
  }));
}
function y(e, t) {
  var a;
  return void 0 === t && (t = 20), null == (a = (0, (e = w(e)).generateImageSource)(e.filename, t, Math.round(t / e.aspectRatio), e.sourceMetadata.format || "jpg", e.fit, e.options)) ? void 0 : a.src;
}
function b(e) {
  var t,
    a = (e = w(e)).pluginName,
    i = e.sourceMetadata,
    r = e.generateImageSource,
    o = e.layout,
    u = e.fit,
    d = e.options,
    h = e.width,
    p = e.height,
    y = e.filename,
    b = e.reporter,
    S = void 0 === b ? {
      warn: g
    } : b,
    N = e.backgroundColor,
    x = e.placeholderURL;
  if (a || S.warn('[gatsby-plugin-image] "generateImageData" was not passed a plugin name'), "function" != typeof r) throw new Error("generateImageSource must be a function");
  i && (i.width || i.height) ? i.format || (i.format = v(y)) : i = {
    width: h,
    height: p,
    format: (null == (t = i) ? void 0 : t.format) || v(y) || "auto"
  };
  var I = new Set(e.formats);
  (0 === I.size || I.has("auto") || I.has("")) && (I.delete("auto"), I.delete(""), I.add(i.format)), I.has("jpg") && I.has("png") && (S.warn("[" + a + "] Specifying both 'jpg' and 'png' formats is not supported. Using 'auto' instead"), I.delete("jpg" === i.format ? "png" : "jpg"));
  var W = function (e) {
      var t = e.filename,
        a = e.layout,
        i = void 0 === a ? "constrained" : a,
        r = e.sourceMetadata,
        o = e.reporter,
        u = void 0 === o ? {
          warn: g
        } : o,
        d = e.breakpoints,
        h = void 0 === d ? l : d,
        p = Object.entries({
          width: e.width,
          height: e.height
        }).filter(function (e) {
          var t = e[1];
          return "number" == typeof t && t < 1;
        });
      if (p.length) throw new Error("Specified dimensions for images must be positive numbers (> 0). Problem dimensions you have are " + p.map(function (e) {
        return e.join(": ");
      }).join(", "));
      return "fixed" === i ? function (e) {
        var t = e.filename,
          a = e.sourceMetadata,
          i = e.width,
          r = e.height,
          n = e.fit,
          o = void 0 === n ? "cover" : n,
          l = e.outputPixelDensities,
          u = e.reporter,
          d = void 0 === u ? {
            warn: g
          } : u,
          h = a.width / a.height,
          p = k(void 0 === l ? s : l);
        if (i && r) {
          var m = M(a, {
            width: i,
            height: r,
            fit: o
          });
          i = m.width, r = m.height, h = m.aspectRatio;
        }
        i ? r || (r = Math.round(i / h)) : i = r ? Math.round(r * h) : c;
        var f = i;
        if (a.width < i || a.height < r) {
          var v = a.width < i ? "width" : "height";
          d.warn("\nThe requested " + v + ' "' + ("width" === v ? i : r) + 'px" for the image ' + t + " was larger than the actual image " + v + " of " + a[v] + "px. If possible, replace the current image with a larger one."), "width" === v ? (i = a.width, r = Math.round(i / h)) : i = (r = a.height) * h;
        }
        return {
          sizes: p.filter(function (e) {
            return e >= 1;
          }).map(function (e) {
            return Math.round(e * i);
          }).filter(function (e) {
            return e <= a.width;
          }),
          aspectRatio: h,
          presentationWidth: f,
          presentationHeight: Math.round(f / h),
          unscaledWidth: i
        };
      }(e) : "constrained" === i ? E(e) : "fullWidth" === i ? E(n({
        breakpoints: h
      }, e)) : (u.warn("No valid layout was provided for the image at " + t + ". Valid image layouts are fixed, fullWidth, and constrained. Found " + i), {
        sizes: [r.width],
        presentationWidth: r.width,
        presentationHeight: r.height,
        aspectRatio: r.width / r.height,
        unscaledWidth: r.width
      });
    }(n({}, e, {
      sourceMetadata: i
    })),
    j = {
      sources: []
    },
    R = e.sizes;
  R || (R = m(W.presentationWidth, o)), I.forEach(function (e) {
    var t = W.sizes.map(function (t) {
      var i = r(y, t, Math.round(t / W.aspectRatio), e, u, d);
      if (null != i && i.width && i.height && i.src && i.format) return i;
      S.warn("[" + a + "] The resolver for image " + y + " returned an invalid value.");
    }).filter(Boolean);
    if ("jpg" === e || "png" === e || "auto" === e) {
      var i = t.find(function (e) {
        return e.width === W.unscaledWidth;
      }) || t[0];
      i && (j.fallback = {
        src: i.src,
        srcSet: f(t),
        sizes: R
      });
    } else {
      var n;
      null == (n = j.sources) || n.push({
        srcSet: f(t),
        sizes: R,
        type: "image/" + e
      });
    }
  });
  var _ = {
    images: j,
    layout: o,
    backgroundColor: N
  };
  switch (x && (_.placeholder = {
    fallback: x
  }), o) {
    case "fixed":
      _.width = W.presentationWidth, _.height = W.presentationHeight;
      break;
    case "fullWidth":
      _.width = 1, _.height = 1 / W.aspectRatio;
      break;
    case "constrained":
      _.width = e.width || W.presentationWidth || 1, _.height = (_.width || 1) / W.aspectRatio;
  }
  return _;
}
var k = function (e) {
  return Array.from(new Set([1].concat(e))).sort(p);
};
function E(e) {
  var t,
    a = e.sourceMetadata,
    i = e.width,
    r = e.height,
    n = e.fit,
    o = void 0 === n ? "cover" : n,
    l = e.outputPixelDensities,
    u = e.breakpoints,
    c = e.layout,
    h = a.width / a.height,
    g = k(void 0 === l ? s : l);
  if (i && r) {
    var m = M(a, {
      width: i,
      height: r,
      fit: o
    });
    i = m.width, r = m.height, h = m.aspectRatio;
  }
  i = i && Math.min(i, a.width), r = r && Math.min(r, a.height), i || r || (r = (i = Math.min(d, a.width)) / h), i || (i = r * h);
  var f = i;
  return (a.width < i || a.height < r) && (i = a.width, r = a.height), i = Math.round(i), (null == u ? void 0 : u.length) > 0 ? (t = u.filter(function (e) {
    return e <= a.width;
  })).length < u.length && !t.includes(a.width) && t.push(a.width) : t = (t = g.map(function (e) {
    return Math.round(e * i);
  })).filter(function (e) {
    return e <= a.width;
  }), "constrained" !== c || t.includes(i) || t.push(i), {
    sizes: t = t.sort(p),
    aspectRatio: h,
    presentationWidth: f,
    presentationHeight: Math.round(f / h),
    unscaledWidth: i
  };
}
function M(e, t) {
  var a = e.width / e.height,
    i = t.width,
    r = t.height;
  switch (t.fit) {
    case "fill":
      i = t.width ? t.width : e.width, r = t.height ? t.height : e.height;
      break;
    case "inside":
      var n = t.width ? t.width : Number.MAX_SAFE_INTEGER,
        o = t.height ? t.height : Number.MAX_SAFE_INTEGER;
      i = Math.min(n, Math.round(o * a)), r = Math.min(o, Math.round(n / a));
      break;
    case "outside":
      var s = t.width ? t.width : 0,
        l = t.height ? t.height : 0;
      i = Math.max(s, Math.round(l * a)), r = Math.max(l, Math.round(s / a));
      break;
    default:
      t.width && !t.height && (i = t.width, r = Math.round(t.width / a)), t.height && !t.width && (i = Math.round(t.height * a), r = t.height);
  }
  return {
    width: i,
    height: r,
    aspectRatio: i / r
  };
}
var S = ["baseUrl", "urlBuilder", "sourceWidth", "sourceHeight", "pluginName", "formats", "breakpoints", "options"],
  N = ["images", "placeholder"];
function x() {
  return "undefined" != typeof GATSBY___IMAGE && GATSBY___IMAGE;
}
var I = function (e) {
    var t;
    return function (e) {
      var t, a;
      return Boolean(null == e || null == (t = e.images) || null == (a = t.fallback) ? void 0 : a.src);
    }(e) ? e : function (e) {
      return Boolean(null == e ? void 0 : e.gatsbyImageData);
    }(e) ? e.gatsbyImageData : function (e) {
      return Boolean(null == e ? void 0 : e.gatsbyImage);
    }(e) ? e.gatsbyImage : null == e || null == (t = e.childImageSharp) ? void 0 : t.gatsbyImageData;
  },
  W = function (e) {
    var t, a, i;
    return null == (t = I(e)) || null == (a = t.images) || null == (i = a.fallback) ? void 0 : i.src;
  },
  j = function (e) {
    var t, a, i;
    return null == (t = I(e)) || null == (a = t.images) || null == (i = a.fallback) ? void 0 : i.srcSet;
  };
function R(e) {
  var t,
    a = e.baseUrl,
    i = e.urlBuilder,
    r = e.sourceWidth,
    s = e.sourceHeight,
    l = e.pluginName,
    d = void 0 === l ? "getImageData" : l,
    c = e.formats,
    h = void 0 === c ? ["auto"] : c,
    g = e.breakpoints,
    p = e.options,
    m = o(e, S);
  return null != (t = g) && t.length || "fullWidth" !== m.layout && "FULL_WIDTH" !== m.layout || (g = u), b(n({}, m, {
    pluginName: d,
    generateImageSource: function (e, t, a, r) {
      return {
        width: t,
        height: a,
        format: r,
        src: i({
          baseUrl: e,
          width: t,
          height: a,
          options: p,
          format: r
        })
      };
    },
    filename: a,
    formats: h,
    breakpoints: g,
    sourceMetadata: {
      width: r,
      height: s,
      format: "auto"
    }
  }));
}
function _(e, t) {
  var a,
    i,
    r,
    s = e.images,
    l = e.placeholder,
    u = n({}, o(e, N), {
      images: n({}, s, {
        sources: []
      }),
      placeholder: l && n({}, l, {
        sources: []
      })
    });
  return t.forEach(function (t) {
    var a,
      i = t.media,
      r = t.image;
    i ? (r.layout !== e.layout && "development" === "development" && console.warn('[gatsby-plugin-image] Mismatched image layout: expected "' + e.layout + '" but received "' + r.layout + '". All art-directed images use the same layout as the default image'), (a = u.images.sources).push.apply(a, r.images.sources.map(function (e) {
      return n({}, e, {
        media: i
      });
    }).concat([{
      media: i,
      srcSet: r.images.fallback.srcSet
    }])), u.placeholder && u.placeholder.sources.push({
      media: i,
      srcSet: r.placeholder.fallback
    })) :  true && console.warn("[gatsby-plugin-image] All art-directed images passed to must have a value set for `media`. Skipping.");
  }), (a = u.images.sources).push.apply(a, s.sources), null != l && l.sources && (null == (i = u.placeholder) || (r = i.sources).push.apply(r, l.sources)), u;
}
var A,
  O = ["src", "srcSet", "loading", "alt", "shouldLoad"],
  T = ["fallback", "sources", "shouldLoad"],
  z = function (t) {
    var a = t.src,
      i = t.srcSet,
      r = t.loading,
      s = t.alt,
      l = void 0 === s ? "" : s,
      u = t.shouldLoad,
      d = o(t, O);
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", n({}, d, {
      decoding: "async",
      loading: r,
      src: u ? a : void 0,
      "data-src": u ? void 0 : a,
      srcSet: u ? i : void 0,
      "data-srcset": u ? void 0 : i,
      alt: l
    }));
  },
  L = function (t) {
    var a = t.fallback,
      i = t.sources,
      r = void 0 === i ? [] : i,
      s = t.shouldLoad,
      l = void 0 === s || s,
      u = o(t, T),
      d = u.sizes || (null == a ? void 0 : a.sizes),
      c = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(z, n({}, u, a, {
        sizes: d,
        shouldLoad: l
      }));
    return r.length ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("picture", null, r.map(function (t) {
      var a = t.media,
        i = t.srcSet,
        r = t.type;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("source", {
        key: a + "-" + r + "-" + i,
        type: r,
        media: a,
        srcSet: l ? i : void 0,
        "data-srcset": l ? void 0 : i,
        sizes: d
      });
    }), c) : c;
  };
z.propTypes = {
  src: prop_types__WEBPACK_IMPORTED_MODULE_2__.string.isRequired,
  alt: prop_types__WEBPACK_IMPORTED_MODULE_2__.string.isRequired,
  sizes: prop_types__WEBPACK_IMPORTED_MODULE_2__.string,
  srcSet: prop_types__WEBPACK_IMPORTED_MODULE_2__.string,
  shouldLoad: prop_types__WEBPACK_IMPORTED_MODULE_2__.bool
}, L.displayName = "Picture", L.propTypes = {
  alt: prop_types__WEBPACK_IMPORTED_MODULE_2__.string.isRequired,
  shouldLoad: prop_types__WEBPACK_IMPORTED_MODULE_2__.bool,
  fallback: prop_types__WEBPACK_IMPORTED_MODULE_2__.exact({
    src: prop_types__WEBPACK_IMPORTED_MODULE_2__.string.isRequired,
    srcSet: prop_types__WEBPACK_IMPORTED_MODULE_2__.string,
    sizes: prop_types__WEBPACK_IMPORTED_MODULE_2__.string
  }),
  sources: prop_types__WEBPACK_IMPORTED_MODULE_2__.arrayOf(prop_types__WEBPACK_IMPORTED_MODULE_2__.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_2__.exact({
    media: prop_types__WEBPACK_IMPORTED_MODULE_2__.string.isRequired,
    type: prop_types__WEBPACK_IMPORTED_MODULE_2__.string,
    sizes: prop_types__WEBPACK_IMPORTED_MODULE_2__.string,
    srcSet: prop_types__WEBPACK_IMPORTED_MODULE_2__.string.isRequired
  }), prop_types__WEBPACK_IMPORTED_MODULE_2__.exact({
    media: prop_types__WEBPACK_IMPORTED_MODULE_2__.string,
    type: prop_types__WEBPACK_IMPORTED_MODULE_2__.string.isRequired,
    sizes: prop_types__WEBPACK_IMPORTED_MODULE_2__.string,
    srcSet: prop_types__WEBPACK_IMPORTED_MODULE_2__.string.isRequired
  })]))
};
var q = ["fallback"],
  C = function (t) {
    var a = t.fallback,
      i = o(t, q);
    return a ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(L, n({}, i, {
      fallback: {
        src: a
      },
      "aria-hidden": !0,
      alt: ""
    })) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", n({}, i));
  };
C.displayName = "Placeholder", C.propTypes = {
  fallback: prop_types__WEBPACK_IMPORTED_MODULE_2__.string,
  sources: null == (A = L.propTypes) ? void 0 : A.sources,
  alt: function (e, t, a) {
    return e[t] ? new Error("Invalid prop `" + t + "` supplied to `" + a + "`. Validation failed.") : null;
  }
};
var D = function (t) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(L, n({}, t)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("noscript", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(L, n({}, t, {
    shouldLoad: !0
  }))));
};
D.displayName = "MainImage", D.propTypes = L.propTypes;
var P = ["children"],
  H = function () {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("script", {
      type: "module",
      dangerouslySetInnerHTML: {
        __html: 'const t="undefined"!=typeof HTMLImageElement&&"loading"in HTMLImageElement.prototype;if(t){const t=document.querySelectorAll("img[data-main-image]");for(let e of t){e.dataset.src&&(e.setAttribute("src",e.dataset.src),e.removeAttribute("data-src")),e.dataset.srcset&&(e.setAttribute("srcset",e.dataset.srcset),e.removeAttribute("data-srcset"));const t=e.parentNode.querySelectorAll("source[data-srcset]");for(let e of t)e.setAttribute("srcset",e.dataset.srcset),e.removeAttribute("data-srcset");e.complete&&(e.style.opacity=1,e.parentNode.parentNode.querySelector("[data-placeholder-image]").style.opacity=0)}}'
      }
    });
  },
  F = function (t) {
    var a = t.layout,
      i = t.width,
      r = t.height;
    return "fullWidth" === a ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      "aria-hidden": !0,
      style: {
        paddingTop: r / i * 100 + "%"
      }
    }) : "constrained" === a ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      style: {
        maxWidth: i,
        display: "block"
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
      alt: "",
      role: "presentation",
      "aria-hidden": "true",
      src: "data:image/svg+xml;charset=utf-8,%3Csvg%20height='" + r + "'%20width='" + i + "'%20xmlns='http://www.w3.org/2000/svg'%20version='1.1'%3E%3C/svg%3E",
      style: {
        maxWidth: "100%",
        display: "block",
        position: "static"
      }
    })) : null;
  },
  B = function (a) {
    var i = a.children,
      r = o(a, P);
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(F, n({}, r)), i, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(H, null));
  },
  G = ["as", "className", "class", "style", "image", "loading", "imgClassName", "imgStyle", "backgroundColor", "objectFit", "objectPosition"],
  V = ["style", "className"],
  U = function (e) {
    return e.replace(/\n/g, "");
  },
  X = function (t) {
    var a = t.as,
      i = void 0 === a ? "div" : a,
      r = t.className,
      s = t.class,
      l = t.style,
      u = t.image,
      d = t.loading,
      c = void 0 === d ? "lazy" : d,
      h = t.imgClassName,
      g = t.imgStyle,
      p = t.backgroundColor,
      m = t.objectFit,
      f = t.objectPosition,
      v = o(t, G);
    if (!u) return console.warn("[gatsby-plugin-image] Missing image prop"), null;
    s && (r = s), g = n({
      objectFit: m,
      objectPosition: f,
      backgroundColor: p
    }, g);
    var w = u.width,
      y = u.height,
      b = u.layout,
      k = u.images,
      E = u.placeholder,
      M = u.backgroundColor,
      S = function (e, t, a) {
        var i = {},
          r = "gatsby-image-wrapper";
        return x() || (i.position = "relative", i.overflow = "hidden"), "fixed" === a ? (i.width = e, i.height = t) : "constrained" === a && (x() || (i.display = "inline-block", i.verticalAlign = "top"), r = "gatsby-image-wrapper gatsby-image-wrapper-constrained"), {
          className: r,
          "data-gatsby-image-wrapper": "",
          style: i
        };
      }(w, y, b),
      N = S.style,
      I = S.className,
      W = o(S, V),
      j = {
        fallback: void 0,
        sources: []
      };
    return k.fallback && (j.fallback = n({}, k.fallback, {
      srcSet: k.fallback.srcSet ? U(k.fallback.srcSet) : void 0
    })), k.sources && (j.sources = k.sources.map(function (e) {
      return n({}, e, {
        srcSet: U(e.srcSet)
      });
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(i, n({}, W, {
      style: n({}, N, l, {
        backgroundColor: p
      }),
      className: I + (r ? " " + r : "")
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(B, {
      layout: b,
      width: w,
      height: y
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(C, n({}, function (e, t, a, i, r, o, s, l) {
      var u = {};
      o && (u.backgroundColor = o, "fixed" === a ? (u.width = i, u.height = r, u.backgroundColor = o, u.position = "relative") : ("constrained" === a || "fullWidth" === a) && (u.position = "absolute", u.top = 0, u.left = 0, u.bottom = 0, u.right = 0)), s && (u.objectFit = s), l && (u.objectPosition = l);
      var d = n({}, e, {
        "aria-hidden": !0,
        "data-placeholder-image": "",
        style: n({
          opacity: 1,
          transition: "opacity 500ms linear"
        }, u)
      });
      return x() || (d.style = {
        height: "100%",
        left: 0,
        position: "absolute",
        top: 0,
        width: "100%"
      }), d;
    }(E, 0, b, w, y, M, m, f))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(D, n({
      "data-gatsby-image-ssr": "",
      className: h
    }, v, function (e, t, a, i, r) {
      return void 0 === r && (r = {}), x() || (r = n({
        height: "100%",
        left: 0,
        position: "absolute",
        top: 0,
        transform: "translateZ(0)",
        transition: "opacity 250ms linear",
        width: "100%",
        willChange: "opacity"
      }, r)), n({}, a, {
        loading: i,
        shouldLoad: e,
        "data-main-image": "",
        style: n({}, r, {
          opacity: 0
        })
      });
    }("eager" === c, 0, j, c, g)))));
  },
  Y = ["src", "__imageData", "__error", "width", "height", "aspectRatio", "tracedSVGOptions", "placeholder", "formats", "quality", "transformOptions", "jpgOptions", "pngOptions", "webpOptions", "avifOptions", "blurredOptions", "breakpoints", "outputPixelDensities"],
  Z = function (t) {
    return function (a) {
      var i = a.src,
        r = a.__imageData,
        s = a.__error,
        l = o(a, Y);
      return s && console.warn(s), r ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(t, n({
        image: r
      }, l)) : (console.warn("Image not loaded", i), s || "development" !== "development" || console.warn('Please ensure that "gatsby-plugin-image" is included in the plugins array in gatsby-config.js, and that your version of gatsby is at least 2.24.78'), null);
    };
  }(X),
  J = function (e, t) {
    return "fullWidth" !== e.layout || "width" !== t && "height" !== t || !e[t] ? prop_types__WEBPACK_IMPORTED_MODULE_2___default().number.apply((prop_types__WEBPACK_IMPORTED_MODULE_2___default()), [e, t].concat([].slice.call(arguments, 2))) : new Error('"' + t + '" ' + e[t] + " may not be passed when layout is fullWidth.");
  },
  K = new Set(["fixed", "fullWidth", "constrained"]),
  Q = {
    src: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string).isRequired,
    alt: function (e, t, a) {
      return e.alt || "" === e.alt ? prop_types__WEBPACK_IMPORTED_MODULE_2___default().string.apply((prop_types__WEBPACK_IMPORTED_MODULE_2___default()), [e, t, a].concat([].slice.call(arguments, 3))) : new Error('The "alt" prop is required in ' + a + '. If the image is purely presentational then pass an empty string: e.g. alt="". Learn more: https://a11y-style-guide.com/style-guide/section-media.html');
    },
    width: J,
    height: J,
    sizes: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
    layout: function (e) {
      if (void 0 !== e.layout && !K.has(e.layout)) return new Error("Invalid value " + e.layout + '" provided for prop "layout". Defaulting to "constrained". Valid values are "fixed", "fullWidth" or "constrained".');
    }
  };
Z.displayName = "StaticImage", Z.propTypes = Q;


/***/ }),

/***/ "./src/components/Card/card.tsx":
/*!**************************************!*\
  !*** ./src/components/Card/card.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Card)
/* harmony export */ });
/* harmony import */ var gatsby__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gatsby */ "./.cache/gatsby-browser-entry.js");
/* harmony import */ var gatsby_plugin_image__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! gatsby-plugin-image */ "./node_modules/gatsby-plugin-image/dist/gatsby-image.module.js");
/* harmony import */ var _card_module_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./card.module.css */ "./src/components/Card/card.module.css");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");





function Card({
  link,
  title,
  description,
  image
}) {
  const img = typeof image === "string" ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("img", {
    src: image,
    width: "100",
    alt: title
  }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(gatsby_plugin_image__WEBPACK_IMPORTED_MODULE_3__.GatsbyImage, {
    image: (0,gatsby_plugin_image__WEBPACK_IMPORTED_MODULE_3__.getImage)(image),
    alt: title
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("tr", {
    className: _card_module_css__WEBPACK_IMPORTED_MODULE_1__.card,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("td", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(gatsby__WEBPACK_IMPORTED_MODULE_0__.Link, {
        to: link,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h2", {
          children: title
        })
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("td", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(gatsby__WEBPACK_IMPORTED_MODULE_0__.Link, {
        to: link,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h4", {
          children: description
        })
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("td", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(gatsby__WEBPACK_IMPORTED_MODULE_0__.Link, {
        to: link,
        children: img
      })
    })]
  });
}
;

/***/ }),

/***/ "./src/components/Content/content.tsx":
/*!********************************************!*\
  !*** ./src/components/Content/content.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Content)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _content_module_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./content.module.css */ "./src/components/Content/content.module.css");


function Content({
  type,
  children
}) {
  return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(type, {
    className: `${_content_module_css__WEBPACK_IMPORTED_MODULE_1__.content} container`
  }, children);
}
;

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

/***/ "./src/pages/articles.tsx?export=head":
/*!********************************************!*\
  !*** ./src/pages/articles.tsx?export=head ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Head: () => (/* reexport safe */ _components_Head_head__WEBPACK_IMPORTED_MODULE_6__.Head),
/* harmony export */   "default": () => (/* binding */ Articles)
/* harmony export */ });
/* harmony import */ var _public_page_data_sq_d_4179646897_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../public/page-data/sq/d/4179646897.json */ "./public/page-data/sq/d/4179646897.json");
/* harmony import */ var _components_Layout_layout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/components/Layout/layout */ "./src/components/Layout/layout.tsx");
/* harmony import */ var _components_Hero_hero__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/components/Hero/hero */ "./src/components/Hero/hero.tsx");
/* harmony import */ var _components_Content_content__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/components/Content/content */ "./src/components/Content/content.tsx");
/* harmony import */ var _components_Card_card__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/components/Card/card */ "./src/components/Card/card.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var _components_Head_head__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/components/Head/head */ "./src/components/Head/head.tsx");







const query = "4179646897";
const heroProps = {
  title: "We've put pen to paper.",
  showBuddy: true
};
const contentProps = {
  type: "table"
};
function Articles() {
  const {
    allGatsbyArticle: {
      nodes
    }
  } = _public_page_data_sq_d_4179646897_json__WEBPACK_IMPORTED_MODULE_0__.data;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_components_Layout_layout__WEBPACK_IMPORTED_MODULE_1__["default"], {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_components_Hero_hero__WEBPACK_IMPORTED_MODULE_2__["default"], {
      ...heroProps
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_components_Content_content__WEBPACK_IMPORTED_MODULE_3__["default"], {
      ...contentProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("tbody", {
        children: nodes.map(({
          slug,
          title,
          description,
          image
        }, i) => {
          const cardProps = {
            link: slug,
            title,
            description,
            image
          };
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_components_Card_card__WEBPACK_IMPORTED_MODULE_4__["default"], {
            ...cardProps
          }, i);
        })
      })
    })]
  });
}
;


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

/***/ }),

/***/ "./public/page-data/sq/d/4179646897.json":
/*!***********************************************!*\
  !*** ./public/page-data/sq/d/4179646897.json ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"data":{"allGatsbyArticle":{"nodes":[{"title":"What Does a Nation of Strong Towns Look Like?","description":"There is someone out there desperate for their community to change, and Strong Towns exists to help them.","slug":"what-does-a-nation-of-strong-towns-look-like","image":{"childImageSharp":{"gatsbyImageData":{"layout":"constrained","placeholder":{"fallback":"data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAAUABQDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAMBBP/EABYBAQEBAAAAAAAAAAAAAAAAAAIDAP/aAAwDAQACEAMQAAAB2DmO70UXa5YaDT//xAAbEAACAgMBAAAAAAAAAAAAAAABAgADERIhE//aAAgBAQABBQJs6s0D8duAbHxxKK1e2ypA+s//xAAYEQADAQEAAAAAAAAAAAAAAAAAAQIQYf/aAAgBAwEBPwGuCp4j/8QAFxEAAwEAAAAAAAAAAAAAAAAAAAEQEv/aAAgBAgEBPwEwoz//xAAfEAACAQMFAQAAAAAAAAAAAAAAAQIRQZEQEiExMnH/2gAIAQEABj8CrwbraNREkuy+B1IpKnw9Syf/xAAaEAEBAQEBAQEAAAAAAAAAAAABEQAhQRBh/9oACAEBAAE/IUaFHR802XrzGhHQZtt3fxxTRT+Z1GgUPkTjnD//2gAMAwEAAgADAAAAEA8//P/EABYRAQEBAAAAAAAAAAAAAAAAAAEAEf/aAAgBAwEBPxAi7MdkDC//xAAYEQADAQEAAAAAAAAAAAAAAAAAASExEf/aAAgBAgEBPxDVR98ENWf/xAAcEAACAgMBAQAAAAAAAAAAAAABEQAhMUFRgZH/2gAIAQEAAT8QcuwbLQO3FgRKjt25SwPaUBmUADgO37GYEFh8Aa+yzqsaBqDgbGEG4OQCbIg5ikYux//Z"},"images":{"fallback":{"src":"/static/3b2cace955511aeeebe0dc9e28a96ff4/e07e1/a_bug_is_becoming_a_meme_on_the_internet_d0cea4797e.jpg","srcSet":"/static/3b2cace955511aeeebe0dc9e28a96ff4/74ef0/a_bug_is_becoming_a_meme_on_the_internet_d0cea4797e.jpg 25w,\\n/static/3b2cace955511aeeebe0dc9e28a96ff4/6ac16/a_bug_is_becoming_a_meme_on_the_internet_d0cea4797e.jpg 50w,\\n/static/3b2cace955511aeeebe0dc9e28a96ff4/e07e1/a_bug_is_becoming_a_meme_on_the_internet_d0cea4797e.jpg 100w,\\n/static/3b2cace955511aeeebe0dc9e28a96ff4/dd515/a_bug_is_becoming_a_meme_on_the_internet_d0cea4797e.jpg 200w","sizes":"(min-width: 100px) 100px, 100vw"},"sources":[{"srcSet":"/static/3b2cace955511aeeebe0dc9e28a96ff4/2fa99/a_bug_is_becoming_a_meme_on_the_internet_d0cea4797e.webp 25w,\\n/static/3b2cace955511aeeebe0dc9e28a96ff4/dbc4a/a_bug_is_becoming_a_meme_on_the_internet_d0cea4797e.webp 50w,\\n/static/3b2cace955511aeeebe0dc9e28a96ff4/d8057/a_bug_is_becoming_a_meme_on_the_internet_d0cea4797e.webp 100w,\\n/static/3b2cace955511aeeebe0dc9e28a96ff4/2e34e/a_bug_is_becoming_a_meme_on_the_internet_d0cea4797e.webp 200w","type":"image/webp","sizes":"(min-width: 100px) 100px, 100vw"}]},"width":100,"height":100}}}},{"title":"What\'s inside a Black Hole","description":"Maybe the answer is in this article, or not...","slug":"what-s-inside-a-black-hole","image":{"childImageSharp":{"gatsbyImageData":{"layout":"constrained","placeholder":{"fallback":"data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAAUABQDASIAAhEBAxEB/8QAGAABAAMBAAAAAAAAAAAAAAAAAAECBAX/xAAXAQADAQAAAAAAAAAAAAAAAAAAAQMC/9oADAMBAAIQAxAAAAHhWtpnXCNzAUBn/8QAGhAAAwADAQAAAAAAAAAAAAAAAQIDABASIP/aAAgBAQABBQLCpGptw9aTK+P/xAAWEQEBAQAAAAAAAAAAAAAAAAABAiD/2gAIAQMBAT8BCUx//8QAFhEBAQEAAAAAAAAAAAAAAAAAAREg/9oACAECAQE/AVbj/8QAGhAAAgIDAAAAAAAAAAAAAAAAAREAAhAgMf/aAAgBAQAGPwLIKcVKp91//8QAGxABAAICAwAAAAAAAAAAAAAAAQARITEQIEH/2gAIAQEAAT8hC2jc2vGMVPGZWCtPX//aAAwDAQACAAMAAAAQHCD9/8QAFxEAAwEAAAAAAAAAAAAAAAAAAREgMf/aAAgBAwEBPxB5Ox//xAAWEQEBAQAAAAAAAAAAAAAAAAABICH/2gAIAQIBAT8QGQMj/8QAHRABAAIABwAAAAAAAAAAAAAAAQARECAhMUFRYf/aAAgBAQABPxByC1sQqzgLIHfAxS+0q9ejzL//2Q=="},"images":{"fallback":{"src":"/static/4c516f33e6e3298ce7a5e312da05d070/e07e1/what_s_inside_a_black_hole_a4daf5634e.jpg","srcSet":"/static/4c516f33e6e3298ce7a5e312da05d070/74ef0/what_s_inside_a_black_hole_a4daf5634e.jpg 25w,\\n/static/4c516f33e6e3298ce7a5e312da05d070/6ac16/what_s_inside_a_black_hole_a4daf5634e.jpg 50w,\\n/static/4c516f33e6e3298ce7a5e312da05d070/e07e1/what_s_inside_a_black_hole_a4daf5634e.jpg 100w,\\n/static/4c516f33e6e3298ce7a5e312da05d070/dd515/what_s_inside_a_black_hole_a4daf5634e.jpg 200w","sizes":"(min-width: 100px) 100px, 100vw"},"sources":[{"srcSet":"/static/4c516f33e6e3298ce7a5e312da05d070/2fa99/what_s_inside_a_black_hole_a4daf5634e.webp 25w,\\n/static/4c516f33e6e3298ce7a5e312da05d070/dbc4a/what_s_inside_a_black_hole_a4daf5634e.webp 50w,\\n/static/4c516f33e6e3298ce7a5e312da05d070/d8057/what_s_inside_a_black_hole_a4daf5634e.webp 100w,\\n/static/4c516f33e6e3298ce7a5e312da05d070/2e34e/what_s_inside_a_black_hole_a4daf5634e.webp 200w","type":"image/webp","sizes":"(min-width: 100px) 100px, 100vw"}]},"width":100,"height":100}}}},{"title":"Beautiful picture","description":"Description of a beautiful picture","slug":"beautiful-picture","image":{"childImageSharp":{"gatsbyImageData":{"layout":"constrained","placeholder":{"fallback":"data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAAUABQDASIAAhEBAxEB/8QAGQABAAIDAAAAAAAAAAAAAAAAAAQFAQIG/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/9oADAMBAAIQAxAAAAGZIod9YvXOlg4JQP/EABwQAAEFAAMAAAAAAAAAAAAAAAEAAgMREhMgIv/aAAgBAQABBQKNtLIXlcr8iY0ZT0//xAAXEQADAQAAAAAAAAAAAAAAAAAAEBES/9oACAEDAQE/Aaaf/8QAFhEBAQEAAAAAAAAAAAAAAAAAEQAQ/9oACAECAQE/ASN//8QAGxAAAgEFAAAAAAAAAAAAAAAAAAEQICIxMqH/2gAIAQEABj8CnPS5m7o//8QAGhAAAwEAAwAAAAAAAAAAAAAAAAERIUFhkf/aAAgBAQABPyFOGTWMUKVCY2LwEo16KM8CsrKf/9oADAMBAAIAAwAAABBHBzz/xAAZEQABBQAAAAAAAAAAAAAAAAARAAEQQVH/2gAIAQMBAT8QJqRZP//EABkRAAEFAAAAAAAAAAAAAAAAAAABEBFBcf/aAAgBAgEBPxCC2bf/xAAbEAEAAgMBAQAAAAAAAAAAAAABABEhMWFBgf/aAAgBAQABPxAgUxpWWNIbc3KYEHYFnqVLOBEF2mNk++xWk7NGlnaWn//Z"},"images":{"fallback":{"src":"/static/03b86a3f0fa157735ff405db49fd51a9/e07e1/beautiful_picture_0c6a09afce.jpg","srcSet":"/static/03b86a3f0fa157735ff405db49fd51a9/74ef0/beautiful_picture_0c6a09afce.jpg 25w,\\n/static/03b86a3f0fa157735ff405db49fd51a9/6ac16/beautiful_picture_0c6a09afce.jpg 50w,\\n/static/03b86a3f0fa157735ff405db49fd51a9/e07e1/beautiful_picture_0c6a09afce.jpg 100w,\\n/static/03b86a3f0fa157735ff405db49fd51a9/dd515/beautiful_picture_0c6a09afce.jpg 200w","sizes":"(min-width: 100px) 100px, 100vw"},"sources":[{"srcSet":"/static/03b86a3f0fa157735ff405db49fd51a9/2fa99/beautiful_picture_0c6a09afce.webp 25w,\\n/static/03b86a3f0fa157735ff405db49fd51a9/dbc4a/beautiful_picture_0c6a09afce.webp 50w,\\n/static/03b86a3f0fa157735ff405db49fd51a9/d8057/beautiful_picture_0c6a09afce.webp 100w,\\n/static/03b86a3f0fa157735ff405db49fd51a9/2e34e/beautiful_picture_0c6a09afce.webp 200w","type":"image/webp","sizes":"(min-width: 100px) 100px, 100vw"}]},"width":100,"height":100}}}},{"title":"This shrimp is awesome","description":"Mantis shrimps, or stomatopods, are marine crustaceans of the order Stomatopoda.","slug":"this-shrimp-is-awesome","image":{"childImageSharp":{"gatsbyImageData":{"layout":"constrained","placeholder":{"fallback":"data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAAUABQDASIAAhEBAxEB/8QAGQABAAMBAQAAAAAAAAAAAAAAAAIDBQEE/8QAFwEBAQEBAAAAAAAAAAAAAAAAAgEAA//aAAwDAQACEAMQAAAB8s4WC5rrXWpAs0dT/8QAGhAAAwADAQAAAAAAAAAAAAAAAQIDAAQSIv/aAAgBAQABBQIyRGtrA4UKmiHNf0lCweB6TXoWrQ9U/8QAGBEBAQADAAAAAAAAAAAAAAAAAAERITH/2gAIAQMBAT8Bky0vVf/EABcRAQEBAQAAAAAAAAAAAAAAAAABIUH/2gAIAQIBAT8Bta4j/8QAHxAAAgICAQUAAAAAAAAAAAAAAAECERIhAyIxQWGR/9oACAEBAAY/Ao31WZcfwqWmZxWvbHva82NZEYvaJWlTXahtn//EABwQAQEBAQACAwAAAAAAAAAAAAERADEhQWGB8P/aAAgBAQABPyHtJ355ry+rn06necEivR0jVDuI5bUj0c8GtInxcBpo9B+uftl3/9oADAMBAAIAAwAAABDU78D/xAAbEQACAQUAAAAAAAAAAAAAAAAAAREhMVGR8P/aAAgBAwEBPxBzRkaRxPbKVLj/xAAXEQEBAQEAAAAAAAAAAAAAAAABABEx/9oACAECAQE/EMgSNmx1cX//xAAdEAEBAAICAwEAAAAAAAAAAAABEQAhMUFRYXGR/9oACAEBAAE/ELyvEMB71huzApsPuPljzzH3HA+gL2Q7DxkbAQkN4LvvFBynQcGWigdAB+uDSBQUEiHXLGj3lms//9k="},"images":{"fallback":{"src":"/static/6f0e13bb06edd9d632a5b4ebd296d748/e07e1/this_shrimp_is_awesome_b9af01fb9d.jpg","srcSet":"/static/6f0e13bb06edd9d632a5b4ebd296d748/74ef0/this_shrimp_is_awesome_b9af01fb9d.jpg 25w,\\n/static/6f0e13bb06edd9d632a5b4ebd296d748/6ac16/this_shrimp_is_awesome_b9af01fb9d.jpg 50w,\\n/static/6f0e13bb06edd9d632a5b4ebd296d748/e07e1/this_shrimp_is_awesome_b9af01fb9d.jpg 100w,\\n/static/6f0e13bb06edd9d632a5b4ebd296d748/dd515/this_shrimp_is_awesome_b9af01fb9d.jpg 200w","sizes":"(min-width: 100px) 100px, 100vw"},"sources":[{"srcSet":"/static/6f0e13bb06edd9d632a5b4ebd296d748/2fa99/this_shrimp_is_awesome_b9af01fb9d.webp 25w,\\n/static/6f0e13bb06edd9d632a5b4ebd296d748/dbc4a/this_shrimp_is_awesome_b9af01fb9d.webp 50w,\\n/static/6f0e13bb06edd9d632a5b4ebd296d748/d8057/this_shrimp_is_awesome_b9af01fb9d.webp 100w,\\n/static/6f0e13bb06edd9d632a5b4ebd296d748/2e34e/this_shrimp_is_awesome_b9af01fb9d.webp 200w","type":"image/webp","sizes":"(min-width: 100px) 100px, 100vw"}]},"width":100,"height":100}}}},{"title":"The internet\'s Own boy","description":"Follow the story of Aaron Swartz, the boy who could change the world","slug":"the-internet-s-own-boy","image":{"childImageSharp":{"gatsbyImageData":{"layout":"constrained","placeholder":{"fallback":"data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAAUABQDASIAAhEBAxEB/8QAGQABAAIDAAAAAAAAAAAAAAAAAAEEAgMF/8QAFgEBAQEAAAAAAAAAAAAAAAAAAgEA/9oADAMBAAIQAxAAAAHnTWBSza14Kdgi/8QAGRABAQADAQAAAAAAAAAAAAAAAQIAAxEQ/9oACAEBAAEFAjATbXVK5VW0tTT4Z//EABURAQEAAAAAAAAAAAAAAAAAABEg/9oACAEDAQE/AWP/xAAVEQEBAAAAAAAAAAAAAAAAAAARIP/aAAgBAgEBPwEj/8QAHBAAAQMFAAAAAAAAAAAAAAAAARAREgACIEGB/9oACAEBAAY/AmNRJQXDSPFu4f/EABwQAQACAwADAAAAAAAAAAAAAAEAESExQRBhkf/aAAgBAQABPyFjS54zUhVxJV+xDB6Oo5Vj3a4eF5gEn//aAAwDAQACAAMAAAAQp+/9/8QAGBEAAgMAAAAAAAAAAAAAAAAAAAEQESH/2gAIAQMBAT8QYuEsP//EABgRAAIDAAAAAAAAAAAAAAAAAAABECEx/9oACAECAQE/EEMhuz//xAAeEAEAAgIBBQAAAAAAAAAAAAABABEhYTFBUXGB0f/aAAgBAQABPxA/IMbdyju7bXAF3C6C+0bhUIVryRolvSsGq7ahv42WBg4KZbQ3mC+oBUtn/9k="},"images":{"fallback":{"src":"/static/05b3298e7ea2e75108482fe178c5040d/e07e1/the_internet_s_own_boy_0b99280fe1.jpg","srcSet":"/static/05b3298e7ea2e75108482fe178c5040d/74ef0/the_internet_s_own_boy_0b99280fe1.jpg 25w,\\n/static/05b3298e7ea2e75108482fe178c5040d/6ac16/the_internet_s_own_boy_0b99280fe1.jpg 50w,\\n/static/05b3298e7ea2e75108482fe178c5040d/e07e1/the_internet_s_own_boy_0b99280fe1.jpg 100w,\\n/static/05b3298e7ea2e75108482fe178c5040d/dd515/the_internet_s_own_boy_0b99280fe1.jpg 200w","sizes":"(min-width: 100px) 100px, 100vw"},"sources":[{"srcSet":"/static/05b3298e7ea2e75108482fe178c5040d/2fa99/the_internet_s_own_boy_0b99280fe1.webp 25w,\\n/static/05b3298e7ea2e75108482fe178c5040d/dbc4a/the_internet_s_own_boy_0b99280fe1.webp 50w,\\n/static/05b3298e7ea2e75108482fe178c5040d/d8057/the_internet_s_own_boy_0b99280fe1.webp 100w,\\n/static/05b3298e7ea2e75108482fe178c5040d/2e34e/the_internet_s_own_boy_0b99280fe1.webp 200w","type":"image/webp","sizes":"(min-width: 100px) 100px, 100vw"}]},"width":100,"height":100}}}}],"max":null}}}');

/***/ })

};
;
//# sourceMappingURL=component---src-pages-articles-tsxhead.js.map