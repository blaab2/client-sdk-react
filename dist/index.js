import { jsxs as re, jsx as I, Fragment as ct } from "react/jsx-runtime";
import * as y from "react";
import { useState as oe, useRef as _e, useEffect as Pe, useCallback as ye, createContext as Ll } from "react";
import Pl from "@vapi-ai/web";
/*! js-cookie v3.0.5 | MIT */
function St(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t];
    for (var r in n)
      e[r] = n[r];
  }
  return e;
}
var zl = {
  read: function(e) {
    return e[0] === '"' && (e = e.slice(1, -1)), e.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
  },
  write: function(e) {
    return encodeURIComponent(e).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    );
  }
};
function dn(e, t) {
  function n(i, o, l) {
    if (!(typeof document > "u")) {
      l = St({}, t, l), typeof l.expires == "number" && (l.expires = new Date(Date.now() + l.expires * 864e5)), l.expires && (l.expires = l.expires.toUTCString()), i = encodeURIComponent(i).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
      var a = "";
      for (var u in l)
        l[u] && (a += "; " + u, l[u] !== !0 && (a += "=" + l[u].split(";")[0]));
      return document.cookie = i + "=" + e.write(o, i) + a;
    }
  }
  function r(i) {
    if (!(typeof document > "u" || arguments.length && !i)) {
      for (var o = document.cookie ? document.cookie.split("; ") : [], l = {}, a = 0; a < o.length; a++) {
        var u = o[a].split("="), s = u.slice(1).join("=");
        try {
          var f = decodeURIComponent(u[0]);
          if (l[f] = e.read(s, f), i === f)
            break;
        } catch {
        }
      }
      return i ? l[i] : l;
    }
  }
  return Object.create(
    {
      set: n,
      get: r,
      remove: function(i, o) {
        n(
          i,
          "",
          St({}, o, {
            expires: -1
          })
        );
      },
      withAttributes: function(i) {
        return dn(this.converter, St({}, this.attributes, i));
      },
      withConverter: function(i) {
        return dn(St({}, this.converter, i), this.attributes);
      }
    },
    {
      attributes: { value: Object.freeze(t) },
      converter: { value: Object.freeze(e) }
    }
  );
}
var Tn = dn(zl, { path: "/" });
function Kr() {
  const e = window.location.hostname;
  if (e === "localhost" || e === "127.0.0.1" || /^\d+\.\d+\.\d+\.\d+$/.test(e))
    return e;
  const t = e.split(".");
  return t.length <= 2 ? e : "." + t.slice(-2).join(".");
}
const Dl = (e, t, n, r = "session") => {
  const i = t.webCallUrl || t.transport?.callUrl;
  if (!i) {
    console.warn(
      "No webCallUrl found in call object, cannot store for reconnection"
    );
    return;
  }
  const o = {
    webCallUrl: i,
    id: t.id,
    artifactPlan: t.artifactPlan,
    assistant: t.assistant,
    callOptions: n,
    timestamp: Date.now()
  };
  if (r === "session")
    sessionStorage.setItem(e, JSON.stringify(o));
  else if (r === "cookies")
    try {
      const l = Kr();
      Tn.set(e, JSON.stringify(o), {
        domain: l,
        path: "/",
        secure: !0,
        sameSite: "lax",
        expires: 1 / 24
        // 1 hour (expires takes days, so 1/24 = 1 hour)
      });
    } catch (l) {
      console.error("Failed to store call data in cookie:", l);
    }
}, Rl = (e, t = "session") => {
  try {
    if (t === "session") {
      const n = sessionStorage.getItem(e);
      return n ? JSON.parse(n) : null;
    } else if (t === "cookies") {
      const n = Tn.get(e);
      return n ? JSON.parse(n) : null;
    }
    return null;
  } catch (n) {
    return console.error("Error reading stored call data:", n), null;
  }
}, Et = (e, t = "session") => {
  if (t === "session")
    sessionStorage.removeItem(e);
  else if (t === "cookies") {
    const n = Kr();
    Tn.remove(e, {
      domain: n,
      path: "/"
    });
  }
}, Nl = (e, t) => {
  if (e === t) return !0;
  if (!e || !t) return !1;
  try {
    return JSON.stringify(e) === JSON.stringify(t);
  } catch {
    return e === t;
  }
}, Ol = ({
  publicKey: e,
  callOptions: t,
  apiUrl: n,
  enabled: r = !0,
  voiceAutoReconnect: i = !1,
  voiceReconnectStorage: o = "session",
  reconnectStorageKey: l = "vapi_widget_web_call",
  onCallStart: a,
  onCallEnd: u,
  onMessage: s,
  onError: f,
  onTranscript: c
}) => {
  const [p] = oe(
    () => e ? new Pl(e, n) : null
  ), [h, g] = oe(!1), [k, S] = oe(!1), [x, v] = oe(!1), [E, R] = oe(0), [N, w] = oe("disconnected"), P = _e({
    onCallStart: a,
    onCallEnd: u,
    onMessage: s,
    onError: f,
    onTranscript: c
  });
  Pe(() => {
    P.current = {
      onCallStart: a,
      onCallEnd: u,
      onMessage: s,
      onError: f,
      onTranscript: c
    };
  }), Pe(() => {
    if (!p)
      return;
    const A = () => {
      g(!0), w("connected"), P.current.onCallStart?.();
    }, O = () => {
      g(!1), w("disconnected"), R(0), S(!1), v(!1), Et(
        l,
        o
      ), P.current.onCallEnd?.();
    }, Z = () => {
      S(!0);
    }, J = () => {
      S(!1);
    }, q = (_) => {
      R(_);
    }, X = (_) => {
      _.type === "transcript" && _.transcriptType === "final" && (_.role === "user" || _.role === "assistant") && P.current.onTranscript?.({
        role: _.role,
        text: _.transcript,
        timestamp: /* @__PURE__ */ new Date()
      }), P.current.onMessage?.(_);
    }, d = (_) => {
      console.error("Vapi error:", _), w("disconnected"), g(!1), S(!1), P.current.onError?.(_);
    };
    return p.on("call-start", A), p.on("call-end", O), p.on("speech-start", Z), p.on("speech-end", J), p.on("volume-level", q), p.on("message", X), p.on("error", d), () => {
      p.removeListener("call-start", A), p.removeListener("call-end", O), p.removeListener("speech-start", Z), p.removeListener("speech-end", J), p.removeListener("volume-level", q), p.removeListener("message", X), p.removeListener("error", d);
    };
  }, [p, l, o]), Pe(() => () => {
    p && p.stop();
  }, [p]);
  const L = ye(async () => {
    if (!p || !r) {
      console.error("Cannot start call: no vapi instance or not enabled");
      return;
    }
    try {
      console.log("Starting call with configuration:", t), console.log("Starting call with options:", {
        voiceAutoReconnect: i
      }), w("connecting");
      const A = await p.start(
        // assistant
        t,
        // assistant overrides,
        void 0,
        // squad
        void 0,
        // workflow
        void 0,
        // workflow overrides
        void 0,
        // options
        {
          roomDeleteOnUserLeaveEnabled: !i
        }
      );
      A && i && Dl(
        l,
        A,
        t,
        o
      );
    } catch (A) {
      console.error("Error starting call:", A), w("disconnected"), P.current.onError?.(A);
    }
  }, [
    p,
    t,
    r,
    i,
    o,
    l
  ]), V = ye(
    async ({ force: A = !1 } = {}) => {
      if (!p) {
        console.log("Cannot end call: no vapi instance");
        return;
      }
      console.log("Ending call with force:", A), A ? p.end() : p.stop();
    },
    [p]
  ), b = ye(
    async ({ force: A = !1 } = {}) => {
      h ? await V({ force: A }) : await L();
    },
    [h, L, V]
  ), F = ye(() => {
    if (!p || !h) {
      console.log("Cannot toggle mute: no vapi instance or call not active");
      return;
    }
    const A = !x;
    p.setMuted(A), v(A);
  }, [p, h, x]), z = ye(async () => {
    if (!p || !r) {
      console.error("Cannot reconnect: no vapi instance or not enabled");
      return;
    }
    const A = Rl(
      l,
      o
    );
    if (!A) {
      console.warn("No stored call data found for reconnection");
      return;
    }
    if (!Nl(A.callOptions, t)) {
      console.warn(
        "CallOptions have changed since last call, clearing stored data and skipping reconnection"
      ), Et(
        l,
        o
      );
      return;
    }
    w("connecting");
    try {
      await p.reconnect({
        webCallUrl: A.webCallUrl,
        id: A.id,
        artifactPlan: A.artifactPlan,
        assistant: A.assistant
      }), console.log("Successfully reconnected to call");
    } catch (O) {
      w("disconnected"), console.error("Reconnection failed:", O), Et(
        l,
        o
      ), P.current.onError?.(O);
    }
  }, [p, r, l, o, t]), D = ye(() => {
    Et(l, o);
  }, [l, o]);
  return Pe(() => {
    !p || !r || !i || z();
  }, [p, r, i, z, l]), {
    // State
    isCallActive: h,
    isSpeaking: k,
    volumeLevel: E,
    connectionStatus: N,
    isMuted: x,
    // Handlers
    startCall: L,
    endCall: V,
    toggleCall: b,
    toggleMute: F,
    reconnect: z,
    clearStoredCall: D
  };
};
async function _l(e, t) {
  const n = e.getReader();
  let r;
  for (; !(r = await n.read()).done; )
    t(r.value);
}
function Bl(e) {
  let t, n, r, i = !1;
  return function(l) {
    t === void 0 ? (t = l, n = 0, r = -1) : t = Hl(t, l);
    const a = t.length;
    let u = 0;
    for (; n < a; ) {
      i && (t[n] === 10 && (u = ++n), i = !1);
      let s = -1;
      for (; n < a && s === -1; ++n)
        switch (t[n]) {
          case 58:
            r === -1 && (r = n - u);
            break;
          case 13:
            i = !0;
          case 10:
            s = n;
            break;
        }
      if (s === -1)
        break;
      e(t.subarray(u, s), r), u = n, r = -1;
    }
    u === a ? t = void 0 : u !== 0 && (t = t.subarray(u), n -= u);
  };
}
function Vl(e, t, n) {
  let r = lr();
  const i = new TextDecoder();
  return function(l, a) {
    if (l.length === 0)
      n?.(r), r = lr();
    else if (a > 0) {
      const u = i.decode(l.subarray(0, a)), s = a + (l[a + 1] === 32 ? 2 : 1), f = i.decode(l.subarray(s));
      switch (u) {
        case "data":
          r.data = r.data ? r.data + `
` + f : f;
          break;
        case "event":
          r.event = f;
          break;
        case "id":
          e(r.id = f);
          break;
        case "retry":
          const c = parseInt(f, 10);
          isNaN(c) || t(r.retry = c);
          break;
      }
    }
  };
}
function Hl(e, t) {
  const n = new Uint8Array(e.length + t.length);
  return n.set(e), n.set(t, e.length), n;
}
function lr() {
  return {
    data: "",
    event: "",
    id: "",
    retry: void 0
  };
}
var jl = function(e, t) {
  var n = {};
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var i = 0, r = Object.getOwnPropertySymbols(e); i < r.length; i++)
      t.indexOf(r[i]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[i]) && (n[r[i]] = e[r[i]]);
  return n;
};
const gn = "text/event-stream", Zl = 1e3, or = "last-event-id";
function $l(e, t) {
  var { signal: n, headers: r, onopen: i, onmessage: o, onclose: l, onerror: a, openWhenHidden: u, fetch: s } = t, f = jl(t, ["signal", "headers", "onopen", "onmessage", "onclose", "onerror", "openWhenHidden", "fetch"]);
  return new Promise((c, p) => {
    const h = Object.assign({}, r);
    h.accept || (h.accept = gn);
    let g;
    function k() {
      g.abort(), document.hidden || N();
    }
    u || document.addEventListener("visibilitychange", k);
    let S = Zl, x = 0;
    function v() {
      document.removeEventListener("visibilitychange", k), window.clearTimeout(x), g.abort();
    }
    n?.addEventListener("abort", () => {
      v(), c();
    });
    const E = s ?? window.fetch, R = i ?? Ul;
    async function N() {
      var w;
      g = new AbortController();
      try {
        const P = await E(e, Object.assign(Object.assign({}, f), { headers: h, signal: g.signal }));
        await R(P), await _l(P.body, Bl(Vl((L) => {
          L ? h[or] = L : delete h[or];
        }, (L) => {
          S = L;
        }, o))), l?.(), v(), c();
      } catch (P) {
        if (!g.signal.aborted)
          try {
            const L = (w = a?.(P)) !== null && w !== void 0 ? w : S;
            window.clearTimeout(x), x = window.setTimeout(N, L);
          } catch (L) {
            v(), p(L);
          }
      }
    }
    N();
  });
}
function Ul(e) {
  const t = e.headers.get("content-type");
  if (!t?.startsWith(gn))
    throw new Error(`Expected content-type to be ${gn}, Actual: ${t}`);
}
class ql extends Error {
}
class ar extends Error {
}
class Wl {
  apiUrl;
  publicKey;
  abortController = null;
  constructor(t) {
    this.publicKey = t.publicKey, this.apiUrl = t.apiUrl || "https://api.vapi.ai";
  }
  async streamChat(t, n, r, i) {
    this.abort(), this.abortController = new AbortController();
    try {
      await $l(`${this.apiUrl}/chat/web`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.publicKey}`,
          "Content-Type": "application/json",
          "X-Client-ID": "vapi-widget"
        },
        body: JSON.stringify({
          ...t,
          stream: !0
        }),
        signal: this.abortController.signal,
        // Event handlers
        async onopen(o) {
          if (!(o.ok && o.headers.get("content-type")?.includes("text/event-stream")))
            throw o.status >= 400 && o.status < 500 && o.status !== 429 ? new ar(`HTTP error! status: ${o.status}`) : new ql(`HTTP error! status: ${o.status}`);
        },
        onmessage(o) {
          if (o.data !== "[DONE]")
            try {
              const l = JSON.parse(o.data);
              (l.delta !== void 0 || l.output !== void 0 || l.path !== void 0) && n(l);
            } catch {
              console.warn(`Failed to parse SSE data: ${o.data}`);
            }
        },
        onclose() {
          i?.();
        },
        onerror(o) {
          if (o instanceof ar)
            throw r?.(o), o;
          if (o instanceof Error && o.name === "AbortError")
            throw i?.(), o;
          console.warn("Retriable error occurred, retrying...", o);
        }
      });
    } catch (o) {
      o instanceof Error && o.name !== "AbortError" && r?.(o);
    }
    return () => this.abort();
  }
  abort() {
    this.abortController && (this.abortController.abort(), this.abortController = null);
  }
}
function Xl(e) {
  return e.delta && e.path === "chat.output[0].content" ? e.delta : e.output !== void 0 ? e.output : null;
}
const Yl = (e, t, n, r, i) => {
  if (!t || !e.trim())
    throw new Error("Chat is disabled or message is empty");
  if (!n || !r)
    throw new Error(
      "Missing required configuration: publicKey and assistantId"
    );
  if (!i)
    throw new Error("Chat client not initialized");
}, Ql = (e) => ({
  role: "user",
  content: e.trim(),
  timestamp: /* @__PURE__ */ new Date()
}), Jl = (e) => ({
  role: "assistant",
  content: e,
  timestamp: /* @__PURE__ */ new Date()
}), sr = (e, t) => {
  e.current = "", t.current = null;
}, Gl = (e, t) => {
  t((n) => {
    const r = [...n];
    return e.current = r.length, r.push({
      role: "assistant",
      content: "",
      // Start with empty content
      timestamp: /* @__PURE__ */ new Date()
    }), r;
  });
}, Kl = (e, t, n, r) => {
  console.error("Stream error:", e), t(!1), n.current = null, r?.(e);
}, eo = (e, t, n, r, i, o) => {
  e.sessionId && e.sessionId !== t && n(e.sessionId);
  const l = Xl(e);
  if (l && (r.current += l, i.current !== null)) {
    const a = i.current;
    o((u) => {
      const s = [...u];
      return a < s.length && (s[a] = {
        ...s[a],
        content: r.current
      }), s;
    });
  }
}, to = (e, t, n, r) => {
  if (e(!1), t.current = null, n.current) {
    const i = Jl(
      n.current
    );
    r?.(i);
  }
}, no = ({
  enabled: e = !0,
  publicKey: t,
  assistantId: n,
  assistantOverrides: r,
  apiUrl: i,
  sessionId: o,
  firstChatMessage: l,
  onMessage: a,
  onError: u
}) => {
  const [s, f] = oe(() => e && l ? [
    {
      role: "assistant",
      content: l,
      timestamp: /* @__PURE__ */ new Date()
    }
  ] : []), [c, p] = oe(!1), [h, g] = oe(!1), [k, S] = oe(
    o
  ), x = _e(null), v = _e(null), E = _e(""), R = _e(null), N = _e(!1);
  Pe(() => (t && e && (x.current = new Wl({ publicKey: t, apiUrl: i })), () => {
    v.current?.();
  }), [t, i, e]), Pe(() => {
    o && S(o);
  }, [o]);
  const w = ye(
    (V) => {
      f((b) => [...b, V]), a?.(V);
    },
    [a]
  ), P = ye(
    async (V, b = !1) => {
      try {
        if (b) {
          if (N.current)
            return;
          N.current = !0;
        }
        if (Yl(
          V,
          e,
          t,
          n,
          x.current
        ), g(!0), !b && V.trim()) {
          const Z = Ql(V);
          w(Z);
        }
        if (!b)
          sr(
            E,
            R
          ), Gl(R, f), p(!0);
        else {
          const Z = V.trim() || "Ending chat...";
          f((J) => [
            ...J,
            {
              role: "assistant",
              content: Z,
              timestamp: /* @__PURE__ */ new Date()
            }
          ]), p(!0);
        }
        const F = (Z) => Kl(
          Z,
          p,
          R,
          u
        ), z = (Z) => eo(
          Z,
          k,
          S,
          E,
          R,
          f
        ), D = b ? () => {
          p(!1), R.current = null;
        } : () => to(
          p,
          R,
          E,
          a
        );
        let A;
        b ? A = V.trim() : l && l.trim() !== "" && s.length === 1 && s[0].role === "assistant" ? A = [
          {
            role: "assistant",
            content: l
          },
          {
            role: "user",
            content: V.trim()
          }
        ] : A = V.trim();
        const O = await x.current.streamChat(
          {
            input: A,
            assistantId: n,
            assistantOverrides: r,
            sessionId: k,
            stream: !0,
            sessionEnd: b
          },
          z,
          F,
          D
        );
        v.current = O;
      } catch (F) {
        throw console.error("Error sending message:", F), p(!1), R.current = null, u?.(F), F;
      } finally {
        g(!1), b && (N.current = !1);
      }
    },
    [
      e,
      t,
      n,
      r,
      k,
      w,
      u,
      a,
      l,
      s
    ]
  ), L = ye(() => {
    f(e && l ? [
      {
        role: "assistant",
        content: l,
        timestamp: /* @__PURE__ */ new Date()
      }
    ] : []), v.current?.(), p(!1), g(!1), sr(
      E,
      R
    ), S(void 0);
  }, [e, l]);
  return {
    // State
    messages: s,
    isTyping: c,
    isLoading: h,
    sessionId: k,
    isEnabled: e,
    // Handlers
    sendMessage: P,
    clearMessages: L
  };
}, ro = ({
  mode: e,
  publicKey: t,
  assistantId: n,
  assistant: r,
  assistantOverrides: i,
  apiUrl: o,
  firstChatMessage: l,
  voiceAutoReconnect: a = !1,
  voiceReconnectStorage: u = "session",
  reconnectStorageKey: s,
  onCallStart: f,
  onCallEnd: c,
  onMessage: p,
  onError: h
}) => {
  const [g, k] = oe(null), [S, x] = oe(!1), [v, E] = oe([]), R = () => {
    if (r)
      return r;
    if (n)
      return i ? {
        assistantId: n,
        assistantOverrides: i
      } : n;
  }, N = e === "voice" || e === "hybrid", w = Ol({
    publicKey: t,
    callOptions: R(),
    apiUrl: o,
    enabled: N,
    voiceAutoReconnect: a,
    voiceReconnectStorage: u,
    reconnectStorageKey: s,
    onCallStart: () => {
      e === "hybrid" && (L.clearMessages(), E([])), k("voice"), x(!1), f?.();
    },
    onCallEnd: () => {
      k(null), c?.();
    },
    onMessage: p,
    onError: h,
    onTranscript: (Z) => {
      const J = {
        role: Z.role,
        content: Z.text,
        timestamp: Z.timestamp
      };
      E((q) => [...q, J]);
    }
  }), P = e === "chat" || e === "hybrid", L = no({
    enabled: P,
    publicKey: P ? t : void 0,
    assistantId: P ? n : void 0,
    assistantOverrides: P ? i : void 0,
    apiUrl: o,
    onMessage: p,
    // Keep the callback for external notifications
    onError: h,
    firstChatMessage: l
  }), V = e === "voice" ? v : e === "chat" ? L.messages : [...v, ...L.messages].sort(
    (Z, J) => Z.timestamp.getTime() - J.timestamp.getTime()
  ), b = ye((Z) => {
    x(Z.length > 0);
  }, []), F = ye(
    async (Z, J = !1) => {
      e === "hybrid" && (w.isCallActive && await w.endCall({ force: !0 }), g !== "chat" && (E([]), L.clearMessages()), k("chat")), await L.sendMessage(Z, J);
    },
    [e, L, w, g]
  ), z = ye(
    async ({ force: Z } = {}) => {
      e === "hybrid" && !w.isCallActive && (L.clearMessages(), E([]), k("voice"), x(!1)), await w.toggleCall({ force: Z });
    },
    [e, w, L]
  ), D = ye(() => {
    E([]), L.clearMessages(), k(null), x(!1);
  }, [L]), A = N && !w.isCallActive && !L.isLoading, O = P && !L.isLoading;
  return {
    // Current mode and state
    mode: e,
    activeMode: g,
    conversation: V,
    // Voice state and handlers
    voice: {
      ...w,
      isAvailable: A,
      toggleCall: z
    },
    // Chat state and handlers
    chat: {
      ...L,
      isAvailable: O,
      sendMessage: F,
      handleInput: b
    },
    // Combined handlers
    clearConversation: D,
    isUserTyping: S
  };
}, io = {
  connecting: "Connecting...",
  assistantSpeaking: "Assistant Speaking...",
  listening: "Listening...",
  assistantTyping: "Assistant is typing...",
  chatActive: "Chat active",
  readyToAssist: "Ready to assist",
  connected: "Connected",
  voiceIdle: "Click the microphone to start",
  chatIdle: "Type a message below",
  hybridIdle: "Choose voice or text",
  endChat: "End Chat",
  resetConversation: "Reset conversation",
  close: "Close",
  startNewChat: "Start new chat",
  consentAccept: "Accept",
  consentCancel: "Cancel",
  sendMessage: "Send message",
  muteMicrophone: "Mute microphone",
  unmuteMicrophone: "Unmute microphone",
  startVoiceCall: "Start voice call",
  stopVoiceCall: "Stop voice call"
}, ei = {
  tiny: {
    button: { width: "3rem", height: "3rem" },
    // w-12 h-12
    expanded: { width: "18rem", height: "20rem" },
    // w-72 h-80
    icon: { width: "1.25rem", height: "1.25rem" }
    // w-5 h-5
  },
  compact: {
    button: {
      paddingLeft: "1rem",
      paddingRight: "1rem",
      paddingTop: "0.75rem",
      paddingBottom: "0.75rem",
      height: "3rem"
    },
    // px-4 py-3 h-12
    expanded: { width: "24rem", height: "32rem" },
    // w-96 h-[32rem]
    icon: { width: "1.25rem", height: "1.25rem" }
    // w-5 h-5
  },
  full: {
    button: {
      paddingLeft: "1.5rem",
      paddingRight: "1.5rem",
      paddingTop: "1rem",
      paddingBottom: "1rem",
      height: "3.5rem"
    },
    // px-6 py-4 h-14
    expanded: { width: "28rem", height: "40rem" },
    // w-[28rem] h-[40rem]
    icon: { width: "1.5rem", height: "1.5rem" }
    // w-6 h-6
  }
}, lo = {
  none: { borderRadius: "0" },
  small: { borderRadius: "0.5rem" },
  // rounded-lg
  medium: { borderRadius: "1rem" },
  // rounded-2xl
  large: { borderRadius: "1.5rem" }
  // rounded-3xl
}, oo = {
  none: { borderRadius: "0" },
  small: { borderRadius: "0.5rem" },
  // rounded-lg
  medium: { borderRadius: "1rem" },
  // rounded-2xl
  large: { borderRadius: "1.5rem" }
  // rounded-3xl
}, ao = {
  none: "rounded-none",
  small: "rounded-md",
  // 6px - subtle rounding
  medium: "rounded-lg",
  // 8px - moderate rounding
  large: "rounded-xl"
  // 12px - more rounded but not excessive
}, so = {
  "bottom-right": { bottom: "1.5rem", right: "1.5rem" },
  "bottom-left": { bottom: "1.5rem", left: "1.5rem" },
  "top-right": { top: "1.5rem", right: "1.5rem" },
  "top-left": { top: "1.5rem", left: "1.5rem" },
  "bottom-center": {
    bottom: "1.5rem",
    left: "50%",
    transform: "translateX(-50%)"
  }
}, Qt = {
  none: { borderRadius: "0" },
  small: { borderRadius: "0.5rem" },
  medium: { borderRadius: "1rem" },
  large: { borderRadius: "1.5rem" }
}, uo = ({
  consentTitle: e = "Terms and conditions",
  consentContent: t,
  onAccept: n,
  onCancel: r,
  colors: i,
  styles: o,
  radius: l,
  labels: a
}) => {
  const u = o.theme === "dark", s = u ? "#1F2937" : "#E5E7EB", f = u ? "#FFFFFF" : "#111827", c = u ? "#D1D5DB" : "#4B5563", p = {
    ...Qt[l],
    backgroundColor: i.baseColor,
    // Use configured base color
    border: `1px solid ${s}`,
    boxShadow: u ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" : "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    padding: "1rem",
    maxWidth: "360px",
    minWidth: "300px"
  }, h = {
    color: f,
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "0.75rem",
    margin: "0 0 0.75rem 0"
  }, g = {
    color: c,
    fontSize: "0.75rem",
    lineHeight: "1.5",
    marginBottom: "1rem",
    maxHeight: "120px",
    overflowY: "auto",
    // Custom scrollbar styling for dark mode
    scrollbarWidth: "thin",
    scrollbarColor: u ? "#4B5563 transparent" : "#CBD5E1 transparent"
  }, k = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "0.5rem"
  }, S = {
    ...Qt[l],
    backgroundColor: "transparent",
    border: u ? "none" : "1px solid #D1D5DB",
    // No border in dark mode
    color: u ? "#9CA3AF" : "#4B5563",
    padding: "0.5rem 1rem",
    fontSize: "0.75rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out"
  }, x = {
    ...Qt[l],
    // Invert colors based on theme - white bg in dark mode, use configured colors in light mode
    backgroundColor: u ? i.ctaButtonTextColor || "#FFFFFF" : i.ctaButtonColor || "#000000",
    color: u ? i.ctaButtonColor || "#000000" : i.ctaButtonTextColor || "#FFFFFF",
    border: "none",
    padding: "0.5rem 1rem",
    fontSize: "0.75rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out"
  };
  return /* @__PURE__ */ re("div", { style: p, children: [
    /* @__PURE__ */ I("style", { children: `
        /* Custom scrollbar styles for webkit browsers */
        .consent-terms-content::-webkit-scrollbar {
          width: 6px;
        }
        .consent-terms-content::-webkit-scrollbar-track {
          background: transparent;
        }
        .consent-terms-content::-webkit-scrollbar-thumb {
          background: ${u ? "#4B5563" : "#CBD5E1"};
          border-radius: 3px;
        }
        .consent-terms-content::-webkit-scrollbar-thumb:hover {
          background: ${u ? "#6B7280" : "#94A3B8"};
        }
        .consent-cancel-button:hover {
          background-color: ${u ? "#1F2937" : "#F9FAFB"} !important;
          ${u ? "" : "border-color: #9CA3AF !important;"}
        }
        .consent-accept-button:hover {
          opacity: 0.9;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
      ` }),
    /* @__PURE__ */ I("h3", { style: h, children: e }),
    /* @__PURE__ */ I(
      "div",
      {
        className: "consent-terms-content",
        style: g,
        dangerouslySetInnerHTML: { __html: t }
      }
    ),
    /* @__PURE__ */ re("div", { style: k, children: [
      /* @__PURE__ */ I(
        "button",
        {
          className: "consent-cancel-button",
          onClick: r,
          style: S,
          children: a.consentCancel
        }
      ),
      /* @__PURE__ */ I(
        "button",
        {
          className: "consent-accept-button",
          onClick: n,
          style: x,
          children: a.consentAccept
        }
      )
    ] })
  ] });
}, Lt = ({
  size: e = 40,
  connectionStatus: t,
  isCallActive: n,
  isSpeaking: r,
  isTyping: i,
  isError: o,
  volumeLevel: l = 0,
  baseColor: a = "#9CA3AF",
  animationType: u,
  animationSpeed: s,
  colors: f,
  barCount: c = 17,
  barWidthRatio: p = 0.08,
  barHeightRatio: h = 0.19,
  className: g = ""
}) => {
  const [k, S] = oe(0), x = n, v = x ? 5 : c, R = o ? {
    animationType: "pulse",
    colors: "#EF4444",
    // Red for errors
    animationSpeed: 300
  } : t === "connecting" ? {
    animationType: "spin",
    colors: "#FCD34D",
    // Yellow
    animationSpeed: 1e3
  } : n && r ? {
    animationType: "scale",
    colors: "#F87171",
    // Light red
    animationSpeed: 600
    // Match the SVG animation duration
  } : n ? {
    animationType: "none",
    colors: "#62F6B5",
    // Green
    animationSpeed: 1e3
  } : i ? {
    animationType: "sequential",
    colors: "#60A5FA",
    // Blue
    animationSpeed: 1e3
  } : {
    animationType: "none",
    colors: a,
    animationSpeed: 3e3
  }, N = u ?? R.animationType, w = s ?? R.animationSpeed, P = f ?? R.colors;
  Pe(() => {
    if (N !== "none") {
      const q = Date.now();
      let X;
      const d = () => {
        S((Date.now() - q) / w), X = requestAnimationFrame(d);
      };
      return X = requestAnimationFrame(d), () => cancelAnimationFrame(X);
    }
  }, [N, w]);
  const L = x ? 24 : 253, b = (() => {
    const q = L / 2, X = L / 2, d = L * 0.38;
    return Array.from({ length: v }, (_, Y) => {
      const m = Y / v * 2 * Math.PI - Math.PI / 2, G = q + d * Math.cos(m), ae = X + d * Math.sin(m), K = m * 180 / Math.PI + 90;
      return { x: G, y: ae, rotate: K };
    });
  })(), F = () => {
    const X = [0.5, 0.75, 1, 0.75, 0.5];
    return Array.from({ length: 5 }, (d, _) => {
      const G = X[_];
      return {
        x: 1 + _ * 4.8,
        y: 6,
        width: 2.8,
        baseHeight: 16 * G,
        maxHeight: 22,
        delay: _ === 2 ? 0 : Math.abs(_ - 2) * 0.2,
        // Center bar starts first
        rotate: 0
      };
    });
  }, z = (q) => Array.isArray(P) ? P[q % P.length] : P, D = (q, X) => {
    const d = k % 1;
    switch (N) {
      case "rotate-fade": {
        const _ = v, Y = d * _ % _, G = Math.min(
          Math.abs(q - Y),
          Math.abs(q - Y + _),
          Math.abs(q - Y - _)
        ) / (_ / 2);
        return { opacity: Math.max(0.14, 1 - G * 0.86), transform: "" };
      }
      case "scale": {
        if (x && "delay" in X) {
          const _ = X, Y = Math.max(0, Math.min(1, l)), m = [
            { sensitivity: 0.8, frequency: 1.2, baseActivity: 0.3 },
            // Bar 0 - Low freq, less sensitive
            { sensitivity: 1, frequency: 1.8, baseActivity: 0.4 },
            // Bar 1 - Mid-low freq
            { sensitivity: 1.2, frequency: 2.5, baseActivity: 0.5 },
            // Bar 2 - Center, most responsive
            { sensitivity: 1, frequency: 2, baseActivity: 0.4 },
            // Bar 3 - Mid-high freq
            { sensitivity: 0.9, frequency: 1.5, baseActivity: 0.35 }
            // Bar 4 - High freq
          ], G = m[q] || m[2], K = k % 1 * G.frequency % 1, pe = Math.sin(K * 2 * Math.PI) * 0.3 + Math.sin(K * 6 * Math.PI) * 0.2 + Math.sin(K * 12 * Math.PI) * 0.1, le = Y * G.sensitivity, ve = Math.max(
            0,
            Math.min(
              1,
              G.baseActivity + le * 0.6 + pe * Y * 0.4
            )
          ), ke = 0.7 + ve * 1.1, Ee = _.baseHeight * ke, Ve = 12 - Ee / 2;
          return {
            opacity: 0.4 + ve * 0.6,
            height: Ee,
            y: Ve,
            transform: ""
          };
        }
        if (!x) {
          const _ = Math.max(0, Math.min(1, l)), Y = k % 1, m = q / v * 2 * Math.PI, G = Math.sin(Y * 4 * Math.PI + m) * 0.3 + Math.sin(Y * 8 * Math.PI + m * 2) * 0.2 + Math.sin(Y * 16 * Math.PI + m * 3) * 0.1, ae = 0.7 + 0.3 * Math.sin(m + Math.PI / 4), K = Math.max(
            0,
            Math.min(
              1,
              0.3 + _ * ae * 0.5 + G * _ * 0.2
            )
          );
          return {
            opacity: 0.4 + K * 0.6,
            transform: K > 0.5 ? `scale(${1 + (K - 0.5) * 0.4})` : ""
          };
        }
        return { opacity: 1, transform: "" };
      }
      case "spin": {
        const _ = d * 2 * Math.PI % (2 * Math.PI), Y = q / v * 2 * Math.PI;
        return { opacity: 0.3 + 0.7 * (1 - Math.abs(
          (_ - Y + Math.PI) % (2 * Math.PI) - Math.PI
        ) / Math.PI), transform: "" };
      }
      case "pulse":
        return {
          opacity: 0.5 + 0.5 * Math.sin(d * 2 * Math.PI),
          transform: ""
        };
      case "sequential": {
        const _ = Math.floor(d * v) % v;
        return {
          opacity: q === _ || q === (_ + 1) % v ? 1 : 0.3,
          transform: ""
        };
      }
      case "wave": {
        const _ = d * 2 * Math.PI, Y = q / v * 2 * Math.PI;
        return {
          opacity: 0.5 + 0.5 * Math.sin(_ + Y),
          transform: ""
        };
      }
      default:
        return { opacity: 1, transform: "" };
    }
  }, A = x ? 2.8 : L * p, O = x ? 12 : L * h, Z = A / 2, J = x ? F() : b;
  return /* @__PURE__ */ I(
    "div",
    {
      className: `relative ${g}`,
      style: { width: e, height: e },
      children: /* @__PURE__ */ re(
        "svg",
        {
          width: e,
          height: e,
          viewBox: `0 0 ${L} ${x ? 24 : L + 1}`,
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          children: [
            !x && /* @__PURE__ */ I(
              "circle",
              {
                cx: L / 2,
                cy: L / 2,
                r: L * 0.38,
                fill: "none",
                stroke: a,
                strokeWidth: "1",
                opacity: "0.05"
              }
            ),
            J.map((q, X) => {
              const d = N !== "none", _ = d ? D(X, q) : { opacity: 1 }, Y = d ? z(X) : P === a ? a : z(X);
              if (x && "width" in q) {
                const m = q, G = _.y !== void 0 ? _.y : 12 - m.baseHeight / 2;
                return /* @__PURE__ */ I(
                  "rect",
                  {
                    x: m.x,
                    y: G,
                    width: m.width,
                    height: _.height !== void 0 ? _.height : m.baseHeight,
                    fill: Y,
                    opacity: _.opacity,
                    rx: m.width / 2
                  },
                  X
                );
              } else {
                const m = q;
                let G = O;
                if (N === "rotate-fade") {
                  const pe = v, le = k % 1 * pe, ke = Math.min(
                    Math.abs(X - le),
                    Math.abs(X - le + pe),
                    Math.abs(X - le - pe)
                  ) / (pe / 2), Ee = 0.4 + 0.6 * (1 - ke), Ve = Math.sin(ke * Math.PI) * 0.2;
                  G = O * (Ee + Ve);
                } else {
                  const le = 0.7 + 0.3 * (1 - Math.min(X, v - X) / (v / 2));
                  G = O * le;
                }
                const ae = m.x - A / 2, K = m.y - G / 2;
                return /* @__PURE__ */ I(
                  "rect",
                  {
                    x: ae,
                    y: K,
                    width: A,
                    height: G,
                    rx: Z,
                    fill: Y,
                    opacity: _.opacity,
                    transform: m.rotate !== 0 ? `rotate(${m.rotate} ${m.x} ${m.y})` : void 0,
                    style: {
                      transition: N === "sequential" ? "opacity 0.1s ease-in-out" : void 0
                    }
                  },
                  X
                );
              }
            })
          ]
        }
      )
    }
  );
}, co = ({
  isCallActive: e,
  connectionStatus: t,
  isSpeaking: n,
  isTyping: r,
  volumeLevel: i,
  onClick: o,
  onToggleCall: l,
  mainLabel: a,
  ctaTitle: u,
  ctaSubtitle: s,
  colors: f,
  styles: c,
  mode: p
}) => {
  const h = p === "voice" && c.size === "tiny", g = () => {
    h && l ? l() : o();
  }, k = u || a, S = {
    ...h && e ? { width: "5rem", height: "5rem" } : ei[c.size].button,
    ...oo[c.radius],
    backgroundColor: e && h ? "#ef4444" : f.ctaButtonColor,
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    // shadow-lg
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    // transition-all duration-300
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    // Adjust height when subtitle is present
    ...s && (c.size === "compact" || c.size === "full") && !h ? { height: c.size === "compact" ? "4rem" : "4.5rem" } : {}
  };
  return /* @__PURE__ */ I(
    "div",
    {
      className: `hover:scale-105 hover:-translate-y-1 hover:shadow-xl ${h && e ? "animate-glow" : ""}`,
      style: S,
      onClick: g,
      children: /* @__PURE__ */ re(
        "div",
        {
          className: "flex items-center space-x-2",
          style: {
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
            // space-x-2
          },
          children: [
            /* @__PURE__ */ I(
              Lt,
              {
                size: h && e ? 48 : c.size === "tiny" ? 24 : 28,
                connectionStatus: t,
                isCallActive: e,
                isSpeaking: n,
                isTyping: r,
                baseColor: f.accentColor,
                colors: f.accentColor,
                volumeLevel: i
              }
            ),
            (c.size === "compact" || c.size === "full") && !h && /* @__PURE__ */ re(
              "div",
              {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "center"
                },
                children: [
                  /* @__PURE__ */ I(
                    "span",
                    {
                      style: {
                        color: f.ctaButtonTextColor,
                        fontSize: "0.875rem",
                        // text-sm
                        fontWeight: "500",
                        // font-medium
                        lineHeight: "1.2"
                      },
                      children: k
                    }
                  ),
                  s && /* @__PURE__ */ I(
                    "span",
                    {
                      style: {
                        color: f.ctaButtonTextColor,
                        fontSize: "0.75rem",
                        // text-xs
                        fontWeight: "400",
                        // font-normal
                        opacity: 0.8,
                        lineHeight: "1.2",
                        marginTop: "0.125rem"
                      },
                      children: s
                    }
                  )
                ]
              }
            )
          ]
        }
      )
    }
  );
}, fo = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M228,48V96a12,12,0,0,1-12,12H168a12,12,0,0,1,0-24h19l-7.8-7.8a75.55,75.55,0,0,0-53.32-22.26h-.43A75.49,75.49,0,0,0,72.39,75.57,12,12,0,1,1,55.61,58.41a99.38,99.38,0,0,1,69.87-28.47H126A99.42,99.42,0,0,1,196.2,59.23L204,67V48a12,12,0,0,1,24,0ZM183.61,180.43a75.49,75.49,0,0,1-53.09,21.63h-.43A75.55,75.55,0,0,1,76.77,179.8L69,172H88a12,12,0,0,0,0-24H40a12,12,0,0,0-12,12v48a12,12,0,0,0,24,0V189l7.8,7.8A99.42,99.42,0,0,0,130,226.06h.56a99.38,99.38,0,0,0,69.87-28.47,12,12,0,0,0-16.78-17.16Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M216,128a88,88,0,1,1-88-88A88,88,0,0,1,216,128Z", opacity: "0.2" }), /* @__PURE__ */ y.createElement("path", { d: "M224,48V96a8,8,0,0,1-8,8H168a8,8,0,0,1,0-16h28.69L182.06,73.37a79.56,79.56,0,0,0-56.13-23.43h-.45A79.52,79.52,0,0,0,69.59,72.71,8,8,0,0,1,58.41,61.27a96,96,0,0,1,135,.79L208,76.69V48a8,8,0,0,1,16,0ZM186.41,183.29a80,80,0,0,1-112.47-.66L59.31,168H88a8,8,0,0,0,0-16H40a8,8,0,0,0-8,8v48a8,8,0,0,0,16,0V179.31l14.63,14.63A95.43,95.43,0,0,0,130,222.06h.53a95.36,95.36,0,0,0,67.07-27.33,8,8,0,0,0-11.18-11.44Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M224,48V96a8,8,0,0,1-8,8H168a8,8,0,0,1-5.66-13.66L180.65,72a79.48,79.48,0,0,0-54.72-22.09h-.45A79.52,79.52,0,0,0,69.59,72.71,8,8,0,0,1,58.41,61.27,96,96,0,0,1,192,60.7l18.36-18.36A8,8,0,0,1,224,48ZM186.41,183.29A80,80,0,0,1,75.35,184l18.31-18.31A8,8,0,0,0,88,152H40a8,8,0,0,0-8,8v48a8,8,0,0,0,13.66,5.66L64,195.3a95.42,95.42,0,0,0,66,26.76h.53a95.36,95.36,0,0,0,67.07-27.33,8,8,0,0,0-11.18-11.44Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M222,48V96a6,6,0,0,1-6,6H168a6,6,0,0,1,0-12h33.52L183.47,72a81.51,81.51,0,0,0-57.53-24h-.46A81.5,81.5,0,0,0,68.19,71.28a6,6,0,1,1-8.38-8.58,93.38,93.38,0,0,1,65.67-26.76H126a93.45,93.45,0,0,1,66,27.53l18,18V48a6,6,0,0,1,12,0ZM187.81,184.72a81.5,81.5,0,0,1-57.29,23.34h-.46a81.51,81.51,0,0,1-57.53-24L54.48,166H88a6,6,0,0,0,0-12H40a6,6,0,0,0-6,6v48a6,6,0,0,0,12,0V174.48l18,18.05a93.45,93.45,0,0,0,66,27.53h.52a93.38,93.38,0,0,0,65.67-26.76,6,6,0,1,0-8.38-8.58Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M224,48V96a8,8,0,0,1-8,8H168a8,8,0,0,1,0-16h28.69L182.06,73.37a79.56,79.56,0,0,0-56.13-23.43h-.45A79.52,79.52,0,0,0,69.59,72.71,8,8,0,0,1,58.41,61.27a96,96,0,0,1,135,.79L208,76.69V48a8,8,0,0,1,16,0ZM186.41,183.29a80,80,0,0,1-112.47-.66L59.31,168H88a8,8,0,0,0,0-16H40a8,8,0,0,0-8,8v48a8,8,0,0,0,16,0V179.31l14.63,14.63A95.43,95.43,0,0,0,130,222.06h.53a95.36,95.36,0,0,0,67.07-27.33,8,8,0,0,0-11.18-11.44Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M220,48V96a4,4,0,0,1-4,4H168a4,4,0,0,1,0-8h38.34L184.89,70.54A84,84,0,0,0,66.8,69.85a4,4,0,1,1-5.6-5.72,92,92,0,0,1,129.34.76L212,86.34V48a4,4,0,0,1,8,0ZM189.2,186.15a83.44,83.44,0,0,1-58.68,23.91h-.47a83.52,83.52,0,0,1-58.94-24.6L49.66,164H88a4,4,0,0,0,0-8H40a4,4,0,0,0-4,4v48a4,4,0,0,0,8,0V169.66l21.46,21.45A91.43,91.43,0,0,0,130,218.06h.51a91.45,91.45,0,0,0,64.28-26.19,4,4,0,1,0-5.6-5.72Z" }))
  ]
]), ho = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M128,20A108,108,0,0,0,31.85,177.23L21,209.66A20,20,0,0,0,46.34,235l32.43-10.81A108,108,0,1,0,128,20Zm0,192a84,84,0,0,1-42.06-11.27,12,12,0,0,0-6-1.62,12.1,12.1,0,0,0-3.8.62l-29.79,9.93,9.93-29.79a12,12,0,0,0-1-9.81A84,84,0,1,1,128,212Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement(
      "path",
      {
        d: "M224,128A96,96,0,0,1,79.93,211.11h0L42.54,223.58a8,8,0,0,1-10.12-10.12l12.47-37.39h0A96,96,0,1,1,224,128Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ y.createElement("path", { d: "M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M232,128A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M128,26A102,102,0,0,0,38.35,176.69L26.73,211.56a14,14,0,0,0,17.71,17.71l34.87-11.62A102,102,0,1,0,128,26Zm0,192a90,90,0,0,1-45.06-12.08,6.09,6.09,0,0,0-3-.81,6.2,6.2,0,0,0-1.9.31L40.65,217.88a2,2,0,0,1-2.53-2.53L50.58,178a6,6,0,0,0-.5-4.91A90,90,0,1,1,128,218Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M128,28A100,100,0,0,0,40.53,176.5l-11.9,35.69a12,12,0,0,0,15.18,15.18l35.69-11.9A100,100,0,1,0,128,28Zm0,192a92,92,0,0,1-46.07-12.35,4.05,4.05,0,0,0-2-.54,3.93,3.93,0,0,0-1.27.21L41.28,219.78a4,4,0,0,1-5.06-5.06l12.46-37.38a4,4,0,0,0-.33-3.27A92,92,0,1,1,128,220Z" }))
  ]
]), po = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M128,180a52.06,52.06,0,0,0,52-52V64A52,52,0,0,0,76,64v64A52.06,52.06,0,0,0,128,180ZM100,64a28,28,0,0,1,56,0v64a28,28,0,0,1-56,0Zm40,155.22V240a12,12,0,0,1-24,0V219.22A92.14,92.14,0,0,1,36,128a12,12,0,0,1,24,0,68,68,0,0,0,136,0,12,12,0,0,1,24,0A92.14,92.14,0,0,1,140,219.22Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement(
      "path",
      {
        d: "M168,64v64a40,40,0,0,1-40,40h0a40,40,0,0,1-40-40V64a40,40,0,0,1,40-40h0A40,40,0,0,1,168,64Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ y.createElement("path", { d: "M128,176a48.05,48.05,0,0,0,48-48V64a48,48,0,0,0-96,0v64A48.05,48.05,0,0,0,128,176ZM96,64a32,32,0,0,1,64,0v64a32,32,0,0,1-64,0Zm40,143.6V240a8,8,0,0,1-16,0V207.6A80.11,80.11,0,0,1,48,128a8,8,0,0,1,16,0,64,64,0,0,0,128,0,8,8,0,0,1,16,0A80.11,80.11,0,0,1,136,207.6Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M80,128V64a48,48,0,0,1,96,0v64a48,48,0,0,1-96,0Zm128,0a8,8,0,0,0-16,0,64,64,0,0,1-128,0,8,8,0,0,0-16,0,80.11,80.11,0,0,0,72,79.6V240a8,8,0,0,0,16,0V207.6A80.11,80.11,0,0,0,208,128Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M128,174a46.06,46.06,0,0,0,46-46V64a46,46,0,0,0-92,0v64A46.06,46.06,0,0,0,128,174ZM94,64a34,34,0,0,1,68,0v64a34,34,0,0,1-68,0Zm40,141.75V240a6,6,0,0,1-12,0V205.75A78.09,78.09,0,0,1,50,128a6,6,0,0,1,12,0,66,66,0,0,0,132,0,6,6,0,0,1,12,0A78.09,78.09,0,0,1,134,205.75Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M128,176a48.05,48.05,0,0,0,48-48V64a48,48,0,0,0-96,0v64A48.05,48.05,0,0,0,128,176ZM96,64a32,32,0,0,1,64,0v64a32,32,0,0,1-64,0Zm40,143.6V240a8,8,0,0,1-16,0V207.6A80.11,80.11,0,0,1,48,128a8,8,0,0,1,16,0,64,64,0,0,0,128,0,8,8,0,0,1,16,0A80.11,80.11,0,0,1,136,207.6Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M128,172a44.05,44.05,0,0,0,44-44V64a44,44,0,0,0-88,0v64A44.05,44.05,0,0,0,128,172ZM92,64a36,36,0,0,1,72,0v64a36,36,0,0,1-72,0Zm40,139.89V240a4,4,0,0,1-8,0V203.89A76.09,76.09,0,0,1,52,128a4,4,0,0,1,8,0,68,68,0,0,0,136,0,4,4,0,0,1,8,0A76.09,76.09,0,0,1,132,203.89Z" }))
  ]
]), mo = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M56.88,39.93A12,12,0,1,0,39.12,56.07L76,96.64V128a52,52,0,0,0,72.11,48l11.26,12.39A67.34,67.34,0,0,1,128,196a68.07,68.07,0,0,1-68-68,12,12,0,0,0-24,0,92.14,92.14,0,0,0,80,91.22V240a12,12,0,0,0,24,0V219.23a90.39,90.39,0,0,0,35.92-12.68l23.2,25.52a12,12,0,0,0,17.76-16.14ZM128,156a28,28,0,0,1-28-28v-5l29.9,32.89C129.27,156,128.64,156,128,156Zm63-2.42A67.63,67.63,0,0,0,196,128a12,12,0,0,1,24,0,91.48,91.48,0,0,1-6.74,34.61,12,12,0,0,1-22.23-9ZM85.7,33.75A52,52,0,0,1,180,64v56.54a12,12,0,0,1-24,0V64a28,28,0,0,0-50.79-16.28,12,12,0,0,1-19.51-14Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement(
      "path",
      {
        d: "M168,64v64a40,40,0,0,1-40,40h0a40,40,0,0,1-40-40V64a40,40,0,0,1,40-40h0A40,40,0,0,1,168,64Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ y.createElement("path", { d: "M213.92,218.62l-160-176A8,8,0,0,0,42.08,53.38L80,95.09V128a48,48,0,0,0,69.11,43.12l11.1,12.2A63.41,63.41,0,0,1,128,192a64.07,64.07,0,0,1-64-64,8,8,0,0,0-16,0,80.11,80.11,0,0,0,72,79.6V240a8,8,0,0,0,16,0V207.59a78.83,78.83,0,0,0,35.16-12.22l30.92,34a8,8,0,1,0,11.84-10.76ZM128,160a32,32,0,0,1-32-32V112.69l41.66,45.82A32,32,0,0,1,128,160Zm57.52-3.91A63.32,63.32,0,0,0,192,128a8,8,0,0,1,16,0,79.16,79.16,0,0,1-8.11,35.12,8,8,0,0,1-7.19,4.49,7.88,7.88,0,0,1-3.51-.82A8,8,0,0,1,185.52,156.09ZM84,44.87A48,48,0,0,1,176,64v64a49.19,49.19,0,0,1-.26,5,8,8,0,0,1-8,7.17,8.13,8.13,0,0,1-.84,0,8,8,0,0,1-7.12-8.79c.11-1.1.17-2.24.17-3.36V64A32,32,0,0,0,98.64,51.25,8,8,0,1,1,84,44.87Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M213.38,229.92a8,8,0,0,1-11.3-.54l-30.92-34A78.83,78.83,0,0,1,136,207.59V240a8,8,0,0,1-16,0V207.6A80.11,80.11,0,0,1,48,128a8,8,0,0,1,16,0,64.07,64.07,0,0,0,64,64,63.41,63.41,0,0,0,32.21-8.68l-11.1-12.2A48,48,0,0,1,80,128V95.09L42.08,53.38A8,8,0,0,1,53.92,42.62l160,176A8,8,0,0,1,213.38,229.92Zm-24.19-63.13a7.88,7.88,0,0,0,3.51.82,8,8,0,0,0,7.19-4.49A79.16,79.16,0,0,0,208,128a8,8,0,0,0-16,0,63.32,63.32,0,0,1-6.48,28.09A8,8,0,0,0,189.19,166.79Zm-27.33-29.22A8,8,0,0,0,175.74,133a49.49,49.49,0,0,0,.26-5V64A48,48,0,0,0,84,44.87a8,8,0,0,0,1.41,8.57Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M212.44,220,52.44,44A6,6,0,0,0,43.56,52L82,94.32V128a46,46,0,0,0,67.56,40.64l13.75,15.12A65.26,65.26,0,0,1,128,194a66.08,66.08,0,0,1-66-66,6,6,0,0,0-12,0,78.09,78.09,0,0,0,72,77.75V240a6,6,0,0,0,12,0V205.77a76.93,76.93,0,0,0,37.48-13L203.56,228a6,6,0,0,0,8.88-8.08ZM128,162a34,34,0,0,1-34-34V107.52l47.12,51.84A33.82,33.82,0,0,1,128,162Zm59.32-5A65.38,65.38,0,0,0,194,128a6,6,0,0,1,12,0,77.33,77.33,0,0,1-7.9,34.25A6,6,0,1,1,187.32,157ZM85.8,45.67A46,46,0,0,1,174,64v64a45.17,45.17,0,0,1-.25,4.81,6,6,0,0,1-6,5.38q-.31,0-.63,0a6,6,0,0,1-5.34-6.59A35.41,35.41,0,0,0,162,128V64A34,34,0,0,0,96.8,50.45a6,6,0,0,1-11-4.78Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M213.92,218.62l-160-176A8,8,0,0,0,42.08,53.38L80,95.09V128a48,48,0,0,0,69.11,43.12l11.1,12.2A63.41,63.41,0,0,1,128,192a64.07,64.07,0,0,1-64-64,8,8,0,0,0-16,0,80.11,80.11,0,0,0,72,79.6V240a8,8,0,0,0,16,0V207.59a78.83,78.83,0,0,0,35.16-12.22l30.92,34a8,8,0,1,0,11.84-10.76ZM128,160a32,32,0,0,1-32-32V112.69l41.66,45.82A32,32,0,0,1,128,160Zm57.52-3.91A63.32,63.32,0,0,0,192,128a8,8,0,0,1,16,0,79.16,79.16,0,0,1-8.11,35.12,8,8,0,0,1-7.19,4.49,7.88,7.88,0,0,1-3.51-.82A8,8,0,0,1,185.52,156.09ZM84,44.87A48,48,0,0,1,176,64v64a49.19,49.19,0,0,1-.26,5,8,8,0,0,1-8,7.17,8.13,8.13,0,0,1-.84,0,8,8,0,0,1-7.12-8.79c.11-1.1.17-2.24.17-3.36V64A32,32,0,0,0,98.64,51.25,8,8,0,1,1,84,44.87Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M211,221.31,51,45.31A4,4,0,0,0,45,50.69L84,93.55V128a44,44,0,0,0,66,38.12l16.38,18A67.21,67.21,0,0,1,128,196a68.07,68.07,0,0,1-68-68,4,4,0,0,0-8,0,76.09,76.09,0,0,0,72,75.89V240a4,4,0,0,0,8,0V203.89a75.1,75.1,0,0,0,39.79-13.77L205,226.69a4,4,0,1,0,5.92-5.38ZM128,164a36,36,0,0,1-36-36V102.35L144.43,160A35.83,35.83,0,0,1,128,164Zm61.12-6.15A67.44,67.44,0,0,0,196,128a4,4,0,0,1,8,0,75.28,75.28,0,0,1-7.7,33.37,4,4,0,0,1-7.18-3.52ZM87.63,46.46A44,44,0,0,1,172,64v64a44.2,44.2,0,0,1-.24,4.61,4,4,0,0,1-4,3.58l-.42,0a4,4,0,0,1-3.57-4.39A36.67,36.67,0,0,0,164,128V64A36,36,0,0,0,95,49.66a4,4,0,0,1-7.34-3.2Z" }))
  ]
]), go = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M230.14,25.86a20,20,0,0,0-19.57-5.11l-.22.07L18.44,79a20,20,0,0,0-3.06,37.25L99,157l40.71,83.65a19.81,19.81,0,0,0,18,11.38c.57,0,1.15,0,1.73-.07A19.82,19.82,0,0,0,177,237.56L235.18,45.65a1.42,1.42,0,0,0,.07-.22A20,20,0,0,0,230.14,25.86ZM156.91,221.07l-34.37-70.64,46-45.95a12,12,0,0,0-17-17l-46,46L34.93,99.09,210,46Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement(
      "path",
      {
        d: "M223.69,42.18l-58.22,192a8,8,0,0,1-14.92,1.25L108,148,20.58,105.45a8,8,0,0,1,1.25-14.92l192-58.22A8,8,0,0,1,223.69,42.18Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ y.createElement("path", { d: "M227.32,28.68a16,16,0,0,0-15.66-4.08l-.15,0L19.57,82.84a16,16,0,0,0-2.49,29.8L102,154l41.3,84.87A15.86,15.86,0,0,0,157.74,248q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l58.2-191.94c0-.05,0-.1,0-.15A16,16,0,0,0,227.32,28.68ZM157.83,231.85l-.05.14,0-.07-40.06-82.3,48-48a8,8,0,0,0-11.31-11.31l-48,48L24.08,98.25l-.07,0,.14,0L216,40Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M231.4,44.34s0,.1,0,.15l-58.2,191.94a15.88,15.88,0,0,1-14,11.51q-.69.06-1.38.06a15.86,15.86,0,0,1-14.42-9.15L107,164.15a4,4,0,0,1,.77-4.58l57.92-57.92a8,8,0,0,0-11.31-11.31L96.43,148.26a4,4,0,0,1-4.58.77L17.08,112.64a16,16,0,0,1,2.49-29.8l191.94-58.2.15,0A16,16,0,0,1,231.4,44.34Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M225.88,30.12a13.83,13.83,0,0,0-13.7-3.58l-.11,0L20.14,84.77A14,14,0,0,0,18,110.85l85.56,41.64L145.12,238a13.87,13.87,0,0,0,12.61,8c.4,0,.81,0,1.21-.05a13.9,13.9,0,0,0,12.29-10.09l58.2-191.93,0-.11A13.83,13.83,0,0,0,225.88,30.12Zm-8,10.4L159.73,232.43l0,.11a2,2,0,0,1-3.76.26l-40.68-83.58,49-49a6,6,0,1,0-8.49-8.49l-49,49L23.15,100a2,2,0,0,1,.31-3.74l.11,0L215.48,38.08a1.94,1.94,0,0,1,1.92.52A2,2,0,0,1,217.92,40.52Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M227.32,28.68a16,16,0,0,0-15.66-4.08l-.15,0L19.57,82.84a16,16,0,0,0-2.49,29.8L102,154l41.3,84.87A15.86,15.86,0,0,0,157.74,248q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l58.2-191.94c0-.05,0-.1,0-.15A16,16,0,0,0,227.32,28.68ZM157.83,231.85l-.05.14,0-.07-40.06-82.3,48-48a8,8,0,0,0-11.31-11.31l-48,48L24.08,98.25l-.07,0,.14,0L216,40Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M224.47,31.52a11.87,11.87,0,0,0-11.82-3L20.74,86.67a12,12,0,0,0-1.91,22.38L105,151l41.92,86.15A11.88,11.88,0,0,0,157.74,244c.34,0,.69,0,1,0a11.89,11.89,0,0,0,10.52-8.63l58.21-192,0-.08A11.85,11.85,0,0,0,224.47,31.52Zm-4.62,9.54-58.23,192a4,4,0,0,1-7.48.59l-41.3-84.86,50-50a4,4,0,1,0-5.66-5.66l-50,50-84.9-41.31a3.88,3.88,0,0,1-2.27-4,3.93,3.93,0,0,1,3-3.54L214.9,36.16A3.93,3.93,0,0,1,216,36a4,4,0,0,1,2.79,1.19A3.93,3.93,0,0,1,219.85,41.06Z" }))
  ]
]), yo = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M200,36H56A20,20,0,0,0,36,56V200a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V56A20,20,0,0,0,200,36Zm-4,160H60V60H196Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement(
      "path",
      {
        d: "M208,56V200a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8H200A8,8,0,0,1,208,56Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ y.createElement("path", { d: "M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,160H56V56H200V200Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M216,56V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,56Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M200,42H56A14,14,0,0,0,42,56V200a14,14,0,0,0,14,14H200a14,14,0,0,0,14-14V56A14,14,0,0,0,200,42Zm2,158a2,2,0,0,1-2,2H56a2,2,0,0,1-2-2V56a2,2,0,0,1,2-2H200a2,2,0,0,1,2,2Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,160H56V56H200V200Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M200,44H56A12,12,0,0,0,44,56V200a12,12,0,0,0,12,12H200a12,12,0,0,0,12-12V56A12,12,0,0,0,200,44Zm4,156a4,4,0,0,1-4,4H56a4,4,0,0,1-4-4V56a4,4,0,0,1,4-4H200a4,4,0,0,1,4,4Z" }))
  ]
]), xo = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M60,96v64a12,12,0,0,1-24,0V96a12,12,0,0,1,24,0ZM88,20A12,12,0,0,0,76,32V224a12,12,0,0,0,24,0V32A12,12,0,0,0,88,20Zm40,32a12,12,0,0,0-12,12V192a12,12,0,0,0,24,0V64A12,12,0,0,0,128,52Zm40,32a12,12,0,0,0-12,12v64a12,12,0,0,0,24,0V96A12,12,0,0,0,168,84Zm40-16a12,12,0,0,0-12,12v96a12,12,0,0,0,24,0V80A12,12,0,0,0,208,68Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M208,96v64H48V96Z", opacity: "0.2" }), /* @__PURE__ */ y.createElement("path", { d: "M56,96v64a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0ZM88,24a8,8,0,0,0-8,8V224a8,8,0,0,0,16,0V32A8,8,0,0,0,88,24Zm40,32a8,8,0,0,0-8,8V192a8,8,0,0,0,16,0V64A8,8,0,0,0,128,56Zm40,32a8,8,0,0,0-8,8v64a8,8,0,0,0,16,0V96A8,8,0,0,0,168,88Zm40-16a8,8,0,0,0-8,8v96a8,8,0,0,0,16,0V80A8,8,0,0,0,208,72Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM72,152a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32,32a8,8,0,0,1-16,0V72a8,8,0,0,1,16,0Zm32-16a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Zm32-16a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32,8a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M54,96v64a6,6,0,0,1-12,0V96a6,6,0,0,1,12,0ZM88,26a6,6,0,0,0-6,6V224a6,6,0,0,0,12,0V32A6,6,0,0,0,88,26Zm40,32a6,6,0,0,0-6,6V192a6,6,0,0,0,12,0V64A6,6,0,0,0,128,58Zm40,32a6,6,0,0,0-6,6v64a6,6,0,0,0,12,0V96A6,6,0,0,0,168,90Zm40-16a6,6,0,0,0-6,6v96a6,6,0,0,0,12,0V80A6,6,0,0,0,208,74Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M56,96v64a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0ZM88,24a8,8,0,0,0-8,8V224a8,8,0,0,0,16,0V32A8,8,0,0,0,88,24Zm40,32a8,8,0,0,0-8,8V192a8,8,0,0,0,16,0V64A8,8,0,0,0,128,56Zm40,32a8,8,0,0,0-8,8v64a8,8,0,0,0,16,0V96A8,8,0,0,0,168,88Zm40-16a8,8,0,0,0-8,8v96a8,8,0,0,0,16,0V80A8,8,0,0,0,208,72Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M52,96v64a4,4,0,0,1-8,0V96a4,4,0,0,1,8,0ZM88,28a4,4,0,0,0-4,4V224a4,4,0,0,0,8,0V32A4,4,0,0,0,88,28Zm40,32a4,4,0,0,0-4,4V192a4,4,0,0,0,8,0V64A4,4,0,0,0,128,60Zm40,32a4,4,0,0,0-4,4v64a4,4,0,0,0,8,0V96A4,4,0,0,0,168,92Zm40-16a4,4,0,0,0-4,4v96a4,4,0,0,0,8,0V80A4,4,0,0,0,208,76Z" }))
  ]
]), ko = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement(
      "path",
      {
        d: "M216,56V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,56Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ y.createElement("path", { d: "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM181.66,170.34a8,8,0,0,1-11.32,11.32L128,139.31,85.66,181.66a8,8,0,0,1-11.32-11.32L116.69,128,74.34,85.66A8,8,0,0,1,85.66,74.34L128,116.69l42.34-42.35a8,8,0,0,1,11.32,11.32L139.31,128Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M204.24,195.76a6,6,0,1,1-8.48,8.48L128,136.49,60.24,204.24a6,6,0,0,1-8.48-8.48L119.51,128,51.76,60.24a6,6,0,0,1,8.48-8.48L128,119.51l67.76-67.75a6,6,0,0,1,8.48,8.48L136.49,128Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("path", { d: "M202.83,197.17a4,4,0,0,1-5.66,5.66L128,133.66,58.83,202.83a4,4,0,0,1-5.66-5.66L122.34,128,53.17,58.83a4,4,0,0,1,5.66-5.66L128,122.34l69.17-69.17a4,4,0,1,1,5.66,5.66L133.66,128Z" }))
  ]
]), bo = Ll({
  color: "currentColor",
  size: "1em",
  weight: "regular",
  mirrored: !1
}), De = y.forwardRef(
  (e, t) => {
    const {
      alt: n,
      color: r,
      size: i,
      weight: o,
      mirrored: l,
      children: a,
      weights: u,
      ...s
    } = e, {
      color: f = "currentColor",
      size: c,
      weight: p = "regular",
      mirrored: h = !1,
      ...g
    } = y.useContext(bo);
    return /* @__PURE__ */ y.createElement(
      "svg",
      {
        ref: t,
        xmlns: "http://www.w3.org/2000/svg",
        width: i ?? c,
        height: i ?? c,
        fill: r ?? f,
        viewBox: "0 0 256 256",
        transform: l || h ? "scale(-1, 1)" : void 0,
        ...g,
        ...s
      },
      !!n && /* @__PURE__ */ y.createElement("title", null, n),
      a,
      u.get(o ?? p)
    );
  }
);
De.displayName = "IconBase";
const ti = y.forwardRef((e, t) => /* @__PURE__ */ y.createElement(De, { ref: t, ...e, weights: fo }));
ti.displayName = "ArrowsClockwiseIcon";
const ni = y.forwardRef((e, t) => /* @__PURE__ */ y.createElement(De, { ref: t, ...e, weights: ho }));
ni.displayName = "ChatCircleIcon";
const Nt = y.forwardRef((e, t) => /* @__PURE__ */ y.createElement(De, { ref: t, ...e, weights: po }));
Nt.displayName = "MicrophoneIcon";
const Mn = y.forwardRef((e, t) => /* @__PURE__ */ y.createElement(De, { ref: t, ...e, weights: mo }));
Mn.displayName = "MicrophoneSlashIcon";
const Fn = y.forwardRef((e, t) => /* @__PURE__ */ y.createElement(De, { ref: t, ...e, weights: go }));
Fn.displayName = "PaperPlaneTiltIcon";
const Ln = y.forwardRef((e, t) => /* @__PURE__ */ y.createElement(De, { ref: t, ...e, weights: yo }));
Ln.displayName = "StopIcon";
const Pn = y.forwardRef((e, t) => /* @__PURE__ */ y.createElement(De, { ref: t, ...e, weights: xo }));
Pn.displayName = "WaveformIcon";
const ri = y.forwardRef((e, t) => /* @__PURE__ */ y.createElement(De, { ref: t, ...e, weights: ko }));
ri.displayName = "XIcon";
const wo = ({
  mode: e,
  connectionStatus: t,
  isCallActive: n,
  isSpeaking: r,
  isTyping: i,
  hasActiveConversation: o,
  mainLabel: l,
  onClose: a,
  onReset: u,
  onChatComplete: s,
  showEndChatButton: f,
  colors: c,
  styles: p,
  labels: h
}) => {
  const g = () => t === "connecting" ? h.connecting : n ? r ? h.assistantSpeaking : h.listening : i ? h.assistantTyping : o ? e === "chat" ? h.chatActive : e === "hybrid" ? h.readyToAssist : h.connected : e === "voice" ? h.voiceIdle : e === "chat" ? h.chatIdle : h.hybridIdle;
  return /* @__PURE__ */ re(
    "div",
    {
      className: `relative z-10 p-4 flex items-center justify-between border-b ${p.theme === "dark" ? "text-white border-gray-800 shadow-lg" : "text-gray-900 border-gray-200 shadow-sm"}`,
      style: { backgroundColor: c.baseColor },
      children: [
        /* @__PURE__ */ re("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ I(
            Lt,
            {
              size: 40,
              connectionStatus: t,
              isCallActive: n,
              isSpeaking: r,
              isTyping: i,
              baseColor: c.accentColor,
              colors: c.accentColor
            }
          ),
          /* @__PURE__ */ re("div", { children: [
            /* @__PURE__ */ I("div", { className: "font-medium", children: l }),
            /* @__PURE__ */ I(
              "div",
              {
                className: `text-sm ${p.theme === "dark" ? "text-gray-300" : "text-gray-600"}`,
                children: g()
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ re("div", { className: "flex items-center space-x-2", children: [
          f !== !1 && e === "chat" && /* @__PURE__ */ I(
            "button",
            {
              onClick: s,
              className: "text-red-600 text-sm font-medium px-2 py-1 border border-transparent hover:border-red-600 rounded-md transition-colors",
              title: h.endChat,
              children: h.endChat
            }
          ),
          /* @__PURE__ */ I(
            "button",
            {
              onClick: u,
              className: "w-8 h-8 rounded-full flex items-center justify-center transition-all}",
              title: h.resetConversation,
              children: /* @__PURE__ */ I(ti, { size: 16, weight: "bold" })
            }
          ),
          /* @__PURE__ */ I(
            "button",
            {
              onClick: a,
              className: "w-8 h-8 rounded-full flex items-center justify-center transition-all",
              title: h.close,
              children: /* @__PURE__ */ I(ri, { size: 16, weight: "bold" })
            }
          )
        ] })
      ]
    }
  );
};
function Co(e, t) {
  const n = {};
  return (e[e.length - 1] === "" ? [...e, ""] : e).join(
    (n.padRight ? " " : "") + "," + (n.padLeft === !1 ? "" : " ")
  ).trim();
}
const vo = /^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u, So = /^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u, Eo = {};
function ur(e, t) {
  return (Eo.jsx ? So : vo).test(e);
}
const Ao = /[ \t\n\f\r]/g;
function Io(e) {
  return typeof e == "object" ? e.type === "text" ? cr(e.value) : !1 : cr(e);
}
function cr(e) {
  return e.replace(Ao, "") === "";
}
class gt {
  /**
   * @param {SchemaType['property']} property
   *   Property.
   * @param {SchemaType['normal']} normal
   *   Normal.
   * @param {Space | undefined} [space]
   *   Space.
   * @returns
   *   Schema.
   */
  constructor(t, n, r) {
    this.normal = n, this.property = t, r && (this.space = r);
  }
}
gt.prototype.normal = {};
gt.prototype.property = {};
gt.prototype.space = void 0;
function ii(e, t) {
  const n = {}, r = {};
  for (const i of e)
    Object.assign(n, i.property), Object.assign(r, i.normal);
  return new gt(n, r, t);
}
function yn(e) {
  return e.toLowerCase();
}
class xe {
  /**
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @returns
   *   Info.
   */
  constructor(t, n) {
    this.attribute = n, this.property = t;
  }
}
xe.prototype.attribute = "";
xe.prototype.booleanish = !1;
xe.prototype.boolean = !1;
xe.prototype.commaOrSpaceSeparated = !1;
xe.prototype.commaSeparated = !1;
xe.prototype.defined = !1;
xe.prototype.mustUseProperty = !1;
xe.prototype.number = !1;
xe.prototype.overloadedBoolean = !1;
xe.prototype.property = "";
xe.prototype.spaceSeparated = !1;
xe.prototype.space = void 0;
let To = 0;
const U = We(), ie = We(), xn = We(), T = We(), ne = We(), et = We(), we = We();
function We() {
  return 2 ** ++To;
}
const kn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  boolean: U,
  booleanish: ie,
  commaOrSpaceSeparated: we,
  commaSeparated: et,
  number: T,
  overloadedBoolean: xn,
  spaceSeparated: ne
}, Symbol.toStringTag, { value: "Module" })), Jt = (
  /** @type {ReadonlyArray<keyof typeof types>} */
  Object.keys(kn)
);
class zn extends xe {
  /**
   * @constructor
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @param {number | null | undefined} [mask]
   *   Mask.
   * @param {Space | undefined} [space]
   *   Space.
   * @returns
   *   Info.
   */
  constructor(t, n, r, i) {
    let o = -1;
    if (super(t, n), fr(this, "space", i), typeof r == "number")
      for (; ++o < Jt.length; ) {
        const l = Jt[o];
        fr(this, Jt[o], (r & kn[l]) === kn[l]);
      }
  }
}
zn.prototype.defined = !0;
function fr(e, t, n) {
  n && (e[t] = n);
}
function nt(e) {
  const t = {}, n = {};
  for (const [r, i] of Object.entries(e.properties)) {
    const o = new zn(
      r,
      e.transform(e.attributes || {}, r),
      i,
      e.space
    );
    e.mustUseProperty && e.mustUseProperty.includes(r) && (o.mustUseProperty = !0), t[r] = o, n[yn(r)] = r, n[yn(o.attribute)] = r;
  }
  return new gt(t, n, e.space);
}
const li = nt({
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: ie,
    ariaAutoComplete: null,
    ariaBusy: ie,
    ariaChecked: ie,
    ariaColCount: T,
    ariaColIndex: T,
    ariaColSpan: T,
    ariaControls: ne,
    ariaCurrent: null,
    ariaDescribedBy: ne,
    ariaDetails: null,
    ariaDisabled: ie,
    ariaDropEffect: ne,
    ariaErrorMessage: null,
    ariaExpanded: ie,
    ariaFlowTo: ne,
    ariaGrabbed: ie,
    ariaHasPopup: null,
    ariaHidden: ie,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: ne,
    ariaLevel: T,
    ariaLive: null,
    ariaModal: ie,
    ariaMultiLine: ie,
    ariaMultiSelectable: ie,
    ariaOrientation: null,
    ariaOwns: ne,
    ariaPlaceholder: null,
    ariaPosInSet: T,
    ariaPressed: ie,
    ariaReadOnly: ie,
    ariaRelevant: null,
    ariaRequired: ie,
    ariaRoleDescription: ne,
    ariaRowCount: T,
    ariaRowIndex: T,
    ariaRowSpan: T,
    ariaSelected: ie,
    ariaSetSize: T,
    ariaSort: null,
    ariaValueMax: T,
    ariaValueMin: T,
    ariaValueNow: T,
    ariaValueText: null,
    role: null
  },
  transform(e, t) {
    return t === "role" ? t : "aria-" + t.slice(4).toLowerCase();
  }
});
function oi(e, t) {
  return t in e ? e[t] : t;
}
function ai(e, t) {
  return oi(e, t.toLowerCase());
}
const Mo = nt({
  attributes: {
    acceptcharset: "accept-charset",
    classname: "class",
    htmlfor: "for",
    httpequiv: "http-equiv"
  },
  mustUseProperty: ["checked", "multiple", "muted", "selected"],
  properties: {
    // Standard Properties.
    abbr: null,
    accept: et,
    acceptCharset: ne,
    accessKey: ne,
    action: null,
    allow: null,
    allowFullScreen: U,
    allowPaymentRequest: U,
    allowUserMedia: U,
    alt: null,
    as: null,
    async: U,
    autoCapitalize: null,
    autoComplete: ne,
    autoFocus: U,
    autoPlay: U,
    blocking: ne,
    capture: null,
    charSet: null,
    checked: U,
    cite: null,
    className: ne,
    cols: T,
    colSpan: null,
    content: null,
    contentEditable: ie,
    controls: U,
    controlsList: ne,
    coords: T | et,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: U,
    defer: U,
    dir: null,
    dirName: null,
    disabled: U,
    download: xn,
    draggable: ie,
    encType: null,
    enterKeyHint: null,
    fetchPriority: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: U,
    formTarget: null,
    headers: ne,
    height: T,
    hidden: xn,
    high: T,
    href: null,
    hrefLang: null,
    htmlFor: ne,
    httpEquiv: ne,
    id: null,
    imageSizes: null,
    imageSrcSet: null,
    inert: U,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: U,
    itemId: null,
    itemProp: ne,
    itemRef: ne,
    itemScope: U,
    itemType: ne,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: U,
    low: T,
    manifest: null,
    max: null,
    maxLength: T,
    media: null,
    method: null,
    min: null,
    minLength: T,
    multiple: U,
    muted: U,
    name: null,
    nonce: null,
    noModule: U,
    noValidate: U,
    onAbort: null,
    onAfterPrint: null,
    onAuxClick: null,
    onBeforeMatch: null,
    onBeforePrint: null,
    onBeforeToggle: null,
    onBeforeUnload: null,
    onBlur: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onContextLost: null,
    onContextMenu: null,
    onContextRestored: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFormData: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLanguageChange: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadEnd: null,
    onLoadStart: null,
    onMessage: null,
    onMessageError: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRejectionHandled: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onScrollEnd: null,
    onSecurityPolicyViolation: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onSlotChange: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnhandledRejection: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onWheel: null,
    open: U,
    optimum: T,
    pattern: null,
    ping: ne,
    placeholder: null,
    playsInline: U,
    popover: null,
    popoverTarget: null,
    popoverTargetAction: null,
    poster: null,
    preload: null,
    readOnly: U,
    referrerPolicy: null,
    rel: ne,
    required: U,
    reversed: U,
    rows: T,
    rowSpan: T,
    sandbox: ne,
    scope: null,
    scoped: U,
    seamless: U,
    selected: U,
    shadowRootClonable: U,
    shadowRootDelegatesFocus: U,
    shadowRootMode: null,
    shape: null,
    size: T,
    sizes: null,
    slot: null,
    span: T,
    spellCheck: ie,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: null,
    start: T,
    step: null,
    style: null,
    tabIndex: T,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: U,
    useMap: null,
    value: ie,
    width: T,
    wrap: null,
    writingSuggestions: null,
    // Legacy.
    // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
    align: null,
    // Several. Use CSS `text-align` instead,
    aLink: null,
    // `<body>`. Use CSS `a:active {color}` instead
    archive: ne,
    // `<object>`. List of URIs to archives
    axis: null,
    // `<td>` and `<th>`. Use `scope` on `<th>`
    background: null,
    // `<body>`. Use CSS `background-image` instead
    bgColor: null,
    // `<body>` and table elements. Use CSS `background-color` instead
    border: T,
    // `<table>`. Use CSS `border-width` instead,
    borderColor: null,
    // `<table>`. Use CSS `border-color` instead,
    bottomMargin: T,
    // `<body>`
    cellPadding: null,
    // `<table>`
    cellSpacing: null,
    // `<table>`
    char: null,
    // Several table elements. When `align=char`, sets the character to align on
    charOff: null,
    // Several table elements. When `char`, offsets the alignment
    classId: null,
    // `<object>`
    clear: null,
    // `<br>`. Use CSS `clear` instead
    code: null,
    // `<object>`
    codeBase: null,
    // `<object>`
    codeType: null,
    // `<object>`
    color: null,
    // `<font>` and `<hr>`. Use CSS instead
    compact: U,
    // Lists. Use CSS to reduce space between items instead
    declare: U,
    // `<object>`
    event: null,
    // `<script>`
    face: null,
    // `<font>`. Use CSS instead
    frame: null,
    // `<table>`
    frameBorder: null,
    // `<iframe>`. Use CSS `border` instead
    hSpace: T,
    // `<img>` and `<object>`
    leftMargin: T,
    // `<body>`
    link: null,
    // `<body>`. Use CSS `a:link {color: *}` instead
    longDesc: null,
    // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
    lowSrc: null,
    // `<img>`. Use a `<picture>`
    marginHeight: T,
    // `<body>`
    marginWidth: T,
    // `<body>`
    noResize: U,
    // `<frame>`
    noHref: U,
    // `<area>`. Use no href instead of an explicit `nohref`
    noShade: U,
    // `<hr>`. Use background-color and height instead of borders
    noWrap: U,
    // `<td>` and `<th>`
    object: null,
    // `<applet>`
    profile: null,
    // `<head>`
    prompt: null,
    // `<isindex>`
    rev: null,
    // `<link>`
    rightMargin: T,
    // `<body>`
    rules: null,
    // `<table>`
    scheme: null,
    // `<meta>`
    scrolling: ie,
    // `<frame>`. Use overflow in the child context
    standby: null,
    // `<object>`
    summary: null,
    // `<table>`
    text: null,
    // `<body>`. Use CSS `color` instead
    topMargin: T,
    // `<body>`
    valueType: null,
    // `<param>`
    version: null,
    // `<html>`. Use a doctype.
    vAlign: null,
    // Several. Use CSS `vertical-align` instead
    vLink: null,
    // `<body>`. Use CSS `a:visited {color}` instead
    vSpace: T,
    // `<img>` and `<object>`
    // Non-standard Properties.
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    disablePictureInPicture: U,
    disableRemotePlayback: U,
    prefix: null,
    property: null,
    results: T,
    security: null,
    unselectable: null
  },
  space: "html",
  transform: ai
}), Fo = nt({
  attributes: {
    accentHeight: "accent-height",
    alignmentBaseline: "alignment-baseline",
    arabicForm: "arabic-form",
    baselineShift: "baseline-shift",
    capHeight: "cap-height",
    className: "class",
    clipPath: "clip-path",
    clipRule: "clip-rule",
    colorInterpolation: "color-interpolation",
    colorInterpolationFilters: "color-interpolation-filters",
    colorProfile: "color-profile",
    colorRendering: "color-rendering",
    crossOrigin: "crossorigin",
    dataType: "datatype",
    dominantBaseline: "dominant-baseline",
    enableBackground: "enable-background",
    fillOpacity: "fill-opacity",
    fillRule: "fill-rule",
    floodColor: "flood-color",
    floodOpacity: "flood-opacity",
    fontFamily: "font-family",
    fontSize: "font-size",
    fontSizeAdjust: "font-size-adjust",
    fontStretch: "font-stretch",
    fontStyle: "font-style",
    fontVariant: "font-variant",
    fontWeight: "font-weight",
    glyphName: "glyph-name",
    glyphOrientationHorizontal: "glyph-orientation-horizontal",
    glyphOrientationVertical: "glyph-orientation-vertical",
    hrefLang: "hreflang",
    horizAdvX: "horiz-adv-x",
    horizOriginX: "horiz-origin-x",
    horizOriginY: "horiz-origin-y",
    imageRendering: "image-rendering",
    letterSpacing: "letter-spacing",
    lightingColor: "lighting-color",
    markerEnd: "marker-end",
    markerMid: "marker-mid",
    markerStart: "marker-start",
    navDown: "nav-down",
    navDownLeft: "nav-down-left",
    navDownRight: "nav-down-right",
    navLeft: "nav-left",
    navNext: "nav-next",
    navPrev: "nav-prev",
    navRight: "nav-right",
    navUp: "nav-up",
    navUpLeft: "nav-up-left",
    navUpRight: "nav-up-right",
    onAbort: "onabort",
    onActivate: "onactivate",
    onAfterPrint: "onafterprint",
    onBeforePrint: "onbeforeprint",
    onBegin: "onbegin",
    onCancel: "oncancel",
    onCanPlay: "oncanplay",
    onCanPlayThrough: "oncanplaythrough",
    onChange: "onchange",
    onClick: "onclick",
    onClose: "onclose",
    onCopy: "oncopy",
    onCueChange: "oncuechange",
    onCut: "oncut",
    onDblClick: "ondblclick",
    onDrag: "ondrag",
    onDragEnd: "ondragend",
    onDragEnter: "ondragenter",
    onDragExit: "ondragexit",
    onDragLeave: "ondragleave",
    onDragOver: "ondragover",
    onDragStart: "ondragstart",
    onDrop: "ondrop",
    onDurationChange: "ondurationchange",
    onEmptied: "onemptied",
    onEnd: "onend",
    onEnded: "onended",
    onError: "onerror",
    onFocus: "onfocus",
    onFocusIn: "onfocusin",
    onFocusOut: "onfocusout",
    onHashChange: "onhashchange",
    onInput: "oninput",
    onInvalid: "oninvalid",
    onKeyDown: "onkeydown",
    onKeyPress: "onkeypress",
    onKeyUp: "onkeyup",
    onLoad: "onload",
    onLoadedData: "onloadeddata",
    onLoadedMetadata: "onloadedmetadata",
    onLoadStart: "onloadstart",
    onMessage: "onmessage",
    onMouseDown: "onmousedown",
    onMouseEnter: "onmouseenter",
    onMouseLeave: "onmouseleave",
    onMouseMove: "onmousemove",
    onMouseOut: "onmouseout",
    onMouseOver: "onmouseover",
    onMouseUp: "onmouseup",
    onMouseWheel: "onmousewheel",
    onOffline: "onoffline",
    onOnline: "ononline",
    onPageHide: "onpagehide",
    onPageShow: "onpageshow",
    onPaste: "onpaste",
    onPause: "onpause",
    onPlay: "onplay",
    onPlaying: "onplaying",
    onPopState: "onpopstate",
    onProgress: "onprogress",
    onRateChange: "onratechange",
    onRepeat: "onrepeat",
    onReset: "onreset",
    onResize: "onresize",
    onScroll: "onscroll",
    onSeeked: "onseeked",
    onSeeking: "onseeking",
    onSelect: "onselect",
    onShow: "onshow",
    onStalled: "onstalled",
    onStorage: "onstorage",
    onSubmit: "onsubmit",
    onSuspend: "onsuspend",
    onTimeUpdate: "ontimeupdate",
    onToggle: "ontoggle",
    onUnload: "onunload",
    onVolumeChange: "onvolumechange",
    onWaiting: "onwaiting",
    onZoom: "onzoom",
    overlinePosition: "overline-position",
    overlineThickness: "overline-thickness",
    paintOrder: "paint-order",
    panose1: "panose-1",
    pointerEvents: "pointer-events",
    referrerPolicy: "referrerpolicy",
    renderingIntent: "rendering-intent",
    shapeRendering: "shape-rendering",
    stopColor: "stop-color",
    stopOpacity: "stop-opacity",
    strikethroughPosition: "strikethrough-position",
    strikethroughThickness: "strikethrough-thickness",
    strokeDashArray: "stroke-dasharray",
    strokeDashOffset: "stroke-dashoffset",
    strokeLineCap: "stroke-linecap",
    strokeLineJoin: "stroke-linejoin",
    strokeMiterLimit: "stroke-miterlimit",
    strokeOpacity: "stroke-opacity",
    strokeWidth: "stroke-width",
    tabIndex: "tabindex",
    textAnchor: "text-anchor",
    textDecoration: "text-decoration",
    textRendering: "text-rendering",
    transformOrigin: "transform-origin",
    typeOf: "typeof",
    underlinePosition: "underline-position",
    underlineThickness: "underline-thickness",
    unicodeBidi: "unicode-bidi",
    unicodeRange: "unicode-range",
    unitsPerEm: "units-per-em",
    vAlphabetic: "v-alphabetic",
    vHanging: "v-hanging",
    vIdeographic: "v-ideographic",
    vMathematical: "v-mathematical",
    vectorEffect: "vector-effect",
    vertAdvY: "vert-adv-y",
    vertOriginX: "vert-origin-x",
    vertOriginY: "vert-origin-y",
    wordSpacing: "word-spacing",
    writingMode: "writing-mode",
    xHeight: "x-height",
    // These were camelcased in Tiny. Now lowercased in SVG 2
    playbackOrder: "playbackorder",
    timelineBegin: "timelinebegin"
  },
  properties: {
    about: we,
    accentHeight: T,
    accumulate: null,
    additive: null,
    alignmentBaseline: null,
    alphabetic: T,
    amplitude: T,
    arabicForm: null,
    ascent: T,
    attributeName: null,
    attributeType: null,
    azimuth: T,
    bandwidth: null,
    baselineShift: null,
    baseFrequency: null,
    baseProfile: null,
    bbox: null,
    begin: null,
    bias: T,
    by: null,
    calcMode: null,
    capHeight: T,
    className: ne,
    clip: null,
    clipPath: null,
    clipPathUnits: null,
    clipRule: null,
    color: null,
    colorInterpolation: null,
    colorInterpolationFilters: null,
    colorProfile: null,
    colorRendering: null,
    content: null,
    contentScriptType: null,
    contentStyleType: null,
    crossOrigin: null,
    cursor: null,
    cx: null,
    cy: null,
    d: null,
    dataType: null,
    defaultAction: null,
    descent: T,
    diffuseConstant: T,
    direction: null,
    display: null,
    dur: null,
    divisor: T,
    dominantBaseline: null,
    download: U,
    dx: null,
    dy: null,
    edgeMode: null,
    editable: null,
    elevation: T,
    enableBackground: null,
    end: null,
    event: null,
    exponent: T,
    externalResourcesRequired: null,
    fill: null,
    fillOpacity: T,
    fillRule: null,
    filter: null,
    filterRes: null,
    filterUnits: null,
    floodColor: null,
    floodOpacity: null,
    focusable: null,
    focusHighlight: null,
    fontFamily: null,
    fontSize: null,
    fontSizeAdjust: null,
    fontStretch: null,
    fontStyle: null,
    fontVariant: null,
    fontWeight: null,
    format: null,
    fr: null,
    from: null,
    fx: null,
    fy: null,
    g1: et,
    g2: et,
    glyphName: et,
    glyphOrientationHorizontal: null,
    glyphOrientationVertical: null,
    glyphRef: null,
    gradientTransform: null,
    gradientUnits: null,
    handler: null,
    hanging: T,
    hatchContentUnits: null,
    hatchUnits: null,
    height: null,
    href: null,
    hrefLang: null,
    horizAdvX: T,
    horizOriginX: T,
    horizOriginY: T,
    id: null,
    ideographic: T,
    imageRendering: null,
    initialVisibility: null,
    in: null,
    in2: null,
    intercept: T,
    k: T,
    k1: T,
    k2: T,
    k3: T,
    k4: T,
    kernelMatrix: we,
    kernelUnitLength: null,
    keyPoints: null,
    // SEMI_COLON_SEPARATED
    keySplines: null,
    // SEMI_COLON_SEPARATED
    keyTimes: null,
    // SEMI_COLON_SEPARATED
    kerning: null,
    lang: null,
    lengthAdjust: null,
    letterSpacing: null,
    lightingColor: null,
    limitingConeAngle: T,
    local: null,
    markerEnd: null,
    markerMid: null,
    markerStart: null,
    markerHeight: null,
    markerUnits: null,
    markerWidth: null,
    mask: null,
    maskContentUnits: null,
    maskUnits: null,
    mathematical: null,
    max: null,
    media: null,
    mediaCharacterEncoding: null,
    mediaContentEncodings: null,
    mediaSize: T,
    mediaTime: null,
    method: null,
    min: null,
    mode: null,
    name: null,
    navDown: null,
    navDownLeft: null,
    navDownRight: null,
    navLeft: null,
    navNext: null,
    navPrev: null,
    navRight: null,
    navUp: null,
    navUpLeft: null,
    navUpRight: null,
    numOctaves: null,
    observer: null,
    offset: null,
    onAbort: null,
    onActivate: null,
    onAfterPrint: null,
    onBeforePrint: null,
    onBegin: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnd: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFocusIn: null,
    onFocusOut: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadStart: null,
    onMessage: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onMouseWheel: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRepeat: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onShow: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onZoom: null,
    opacity: null,
    operator: null,
    order: null,
    orient: null,
    orientation: null,
    origin: null,
    overflow: null,
    overlay: null,
    overlinePosition: T,
    overlineThickness: T,
    paintOrder: null,
    panose1: null,
    path: null,
    pathLength: T,
    patternContentUnits: null,
    patternTransform: null,
    patternUnits: null,
    phase: null,
    ping: ne,
    pitch: null,
    playbackOrder: null,
    pointerEvents: null,
    points: null,
    pointsAtX: T,
    pointsAtY: T,
    pointsAtZ: T,
    preserveAlpha: null,
    preserveAspectRatio: null,
    primitiveUnits: null,
    propagate: null,
    property: we,
    r: null,
    radius: null,
    referrerPolicy: null,
    refX: null,
    refY: null,
    rel: we,
    rev: we,
    renderingIntent: null,
    repeatCount: null,
    repeatDur: null,
    requiredExtensions: we,
    requiredFeatures: we,
    requiredFonts: we,
    requiredFormats: we,
    resource: null,
    restart: null,
    result: null,
    rotate: null,
    rx: null,
    ry: null,
    scale: null,
    seed: null,
    shapeRendering: null,
    side: null,
    slope: null,
    snapshotTime: null,
    specularConstant: T,
    specularExponent: T,
    spreadMethod: null,
    spacing: null,
    startOffset: null,
    stdDeviation: null,
    stemh: null,
    stemv: null,
    stitchTiles: null,
    stopColor: null,
    stopOpacity: null,
    strikethroughPosition: T,
    strikethroughThickness: T,
    string: null,
    stroke: null,
    strokeDashArray: we,
    strokeDashOffset: null,
    strokeLineCap: null,
    strokeLineJoin: null,
    strokeMiterLimit: T,
    strokeOpacity: T,
    strokeWidth: null,
    style: null,
    surfaceScale: T,
    syncBehavior: null,
    syncBehaviorDefault: null,
    syncMaster: null,
    syncTolerance: null,
    syncToleranceDefault: null,
    systemLanguage: we,
    tabIndex: T,
    tableValues: null,
    target: null,
    targetX: T,
    targetY: T,
    textAnchor: null,
    textDecoration: null,
    textRendering: null,
    textLength: null,
    timelineBegin: null,
    title: null,
    transformBehavior: null,
    type: null,
    typeOf: we,
    to: null,
    transform: null,
    transformOrigin: null,
    u1: null,
    u2: null,
    underlinePosition: T,
    underlineThickness: T,
    unicode: null,
    unicodeBidi: null,
    unicodeRange: null,
    unitsPerEm: T,
    values: null,
    vAlphabetic: T,
    vMathematical: T,
    vectorEffect: null,
    vHanging: T,
    vIdeographic: T,
    version: null,
    vertAdvY: T,
    vertOriginX: T,
    vertOriginY: T,
    viewBox: null,
    viewTarget: null,
    visibility: null,
    width: null,
    widths: null,
    wordSpacing: null,
    writingMode: null,
    x: null,
    x1: null,
    x2: null,
    xChannelSelector: null,
    xHeight: T,
    y: null,
    y1: null,
    y2: null,
    yChannelSelector: null,
    z: null,
    zoomAndPan: null
  },
  space: "svg",
  transform: oi
}), si = nt({
  properties: {
    xLinkActuate: null,
    xLinkArcRole: null,
    xLinkHref: null,
    xLinkRole: null,
    xLinkShow: null,
    xLinkTitle: null,
    xLinkType: null
  },
  space: "xlink",
  transform(e, t) {
    return "xlink:" + t.slice(5).toLowerCase();
  }
}), ui = nt({
  attributes: { xmlnsxlink: "xmlns:xlink" },
  properties: { xmlnsXLink: null, xmlns: null },
  space: "xmlns",
  transform: ai
}), ci = nt({
  properties: { xmlBase: null, xmlLang: null, xmlSpace: null },
  space: "xml",
  transform(e, t) {
    return "xml:" + t.slice(3).toLowerCase();
  }
}), Lo = {
  classId: "classID",
  dataType: "datatype",
  itemId: "itemID",
  strokeDashArray: "strokeDasharray",
  strokeDashOffset: "strokeDashoffset",
  strokeLineCap: "strokeLinecap",
  strokeLineJoin: "strokeLinejoin",
  strokeMiterLimit: "strokeMiterlimit",
  typeOf: "typeof",
  xLinkActuate: "xlinkActuate",
  xLinkArcRole: "xlinkArcrole",
  xLinkHref: "xlinkHref",
  xLinkRole: "xlinkRole",
  xLinkShow: "xlinkShow",
  xLinkTitle: "xlinkTitle",
  xLinkType: "xlinkType",
  xmlnsXLink: "xmlnsXlink"
}, Po = /[A-Z]/g, hr = /-[a-z]/g, zo = /^data[-\w.:]+$/i;
function Do(e, t) {
  const n = yn(t);
  let r = t, i = xe;
  if (n in e.normal)
    return e.property[e.normal[n]];
  if (n.length > 4 && n.slice(0, 4) === "data" && zo.test(t)) {
    if (t.charAt(4) === "-") {
      const o = t.slice(5).replace(hr, No);
      r = "data" + o.charAt(0).toUpperCase() + o.slice(1);
    } else {
      const o = t.slice(4);
      if (!hr.test(o)) {
        let l = o.replace(Po, Ro);
        l.charAt(0) !== "-" && (l = "-" + l), t = "data" + l;
      }
    }
    i = zn;
  }
  return new i(r, t);
}
function Ro(e) {
  return "-" + e.toLowerCase();
}
function No(e) {
  return e.charAt(1).toUpperCase();
}
const Oo = ii([li, Mo, si, ui, ci], "html"), Dn = ii([li, Fo, si, ui, ci], "svg");
function _o(e) {
  return e.join(" ").trim();
}
function fi(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Je = {}, Gt, pr;
function Bo() {
  if (pr) return Gt;
  pr = 1;
  var e = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, t = /\n/g, n = /^\s*/, r = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/, i = /^:\s*/, o = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/, l = /^[;\s]*/, a = /^\s+|\s+$/g, u = `
`, s = "/", f = "*", c = "", p = "comment", h = "declaration";
  Gt = function(k, S) {
    if (typeof k != "string")
      throw new TypeError("First argument must be a string");
    if (!k) return [];
    S = S || {};
    var x = 1, v = 1;
    function E(D) {
      var A = D.match(t);
      A && (x += A.length);
      var O = D.lastIndexOf(u);
      v = ~O ? D.length - O : v + D.length;
    }
    function R() {
      var D = { line: x, column: v };
      return function(A) {
        return A.position = new N(D), L(), A;
      };
    }
    function N(D) {
      this.start = D, this.end = { line: x, column: v }, this.source = S.source;
    }
    N.prototype.content = k;
    function w(D) {
      var A = new Error(
        S.source + ":" + x + ":" + v + ": " + D
      );
      if (A.reason = D, A.filename = S.source, A.line = x, A.column = v, A.source = k, !S.silent) throw A;
    }
    function P(D) {
      var A = D.exec(k);
      if (A) {
        var O = A[0];
        return E(O), k = k.slice(O.length), A;
      }
    }
    function L() {
      P(n);
    }
    function V(D) {
      var A;
      for (D = D || []; A = b(); )
        A !== !1 && D.push(A);
      return D;
    }
    function b() {
      var D = R();
      if (!(s != k.charAt(0) || f != k.charAt(1))) {
        for (var A = 2; c != k.charAt(A) && (f != k.charAt(A) || s != k.charAt(A + 1)); )
          ++A;
        if (A += 2, c === k.charAt(A - 1))
          return w("End of comment missing");
        var O = k.slice(2, A - 2);
        return v += 2, E(O), k = k.slice(A), v += 2, D({
          type: p,
          comment: O
        });
      }
    }
    function F() {
      var D = R(), A = P(r);
      if (A) {
        if (b(), !P(i)) return w("property missing ':'");
        var O = P(o), Z = D({
          type: h,
          property: g(A[0].replace(e, c)),
          value: O ? g(O[0].replace(e, c)) : c
        });
        return P(l), Z;
      }
    }
    function z() {
      var D = [];
      V(D);
      for (var A; A = F(); )
        A !== !1 && (D.push(A), V(D));
      return D;
    }
    return L(), z();
  };
  function g(k) {
    return k ? k.replace(a, c) : c;
  }
  return Gt;
}
var mr;
function Vo() {
  if (mr) return Je;
  mr = 1;
  var e = Je && Je.__importDefault || function(r) {
    return r && r.__esModule ? r : { default: r };
  };
  Object.defineProperty(Je, "__esModule", { value: !0 }), Je.default = n;
  var t = e(Bo());
  function n(r, i) {
    var o = null;
    if (!r || typeof r != "string")
      return o;
    var l = (0, t.default)(r), a = typeof i == "function";
    return l.forEach(function(u) {
      if (u.type === "declaration") {
        var s = u.property, f = u.value;
        a ? i(s, f, u) : f && (o = o || {}, o[s] = f);
      }
    }), o;
  }
  return Je;
}
var ot = {}, dr;
function Ho() {
  if (dr) return ot;
  dr = 1, Object.defineProperty(ot, "__esModule", { value: !0 }), ot.camelCase = void 0;
  var e = /^--[a-zA-Z0-9_-]+$/, t = /-([a-z])/g, n = /^[^-]+$/, r = /^-(webkit|moz|ms|o|khtml)-/, i = /^-(ms)-/, o = function(s) {
    return !s || n.test(s) || e.test(s);
  }, l = function(s, f) {
    return f.toUpperCase();
  }, a = function(s, f) {
    return "".concat(f, "-");
  }, u = function(s, f) {
    return f === void 0 && (f = {}), o(s) ? s : (s = s.toLowerCase(), f.reactCompat ? s = s.replace(i, a) : s = s.replace(r, a), s.replace(t, l));
  };
  return ot.camelCase = u, ot;
}
var at, gr;
function jo() {
  if (gr) return at;
  gr = 1;
  var e = at && at.__importDefault || function(i) {
    return i && i.__esModule ? i : { default: i };
  }, t = e(Vo()), n = Ho();
  function r(i, o) {
    var l = {};
    return !i || typeof i != "string" || (0, t.default)(i, function(a, u) {
      a && u && (l[(0, n.camelCase)(a, o)] = u);
    }), l;
  }
  return r.default = r, at = r, at;
}
var Zo = jo();
const $o = /* @__PURE__ */ fi(Zo), hi = pi("end"), Rn = pi("start");
function pi(e) {
  return t;
  function t(n) {
    const r = n && n.position && n.position[e] || {};
    if (typeof r.line == "number" && r.line > 0 && typeof r.column == "number" && r.column > 0)
      return {
        line: r.line,
        column: r.column,
        offset: typeof r.offset == "number" && r.offset > -1 ? r.offset : void 0
      };
  }
}
function Uo(e) {
  const t = Rn(e), n = hi(e);
  if (t && n)
    return { start: t, end: n };
}
function ft(e) {
  return !e || typeof e != "object" ? "" : "position" in e || "type" in e ? yr(e.position) : "start" in e || "end" in e ? yr(e) : "line" in e || "column" in e ? bn(e) : "";
}
function bn(e) {
  return xr(e && e.line) + ":" + xr(e && e.column);
}
function yr(e) {
  return bn(e && e.start) + "-" + bn(e && e.end);
}
function xr(e) {
  return e && typeof e == "number" ? e : 1;
}
class he extends Error {
  /**
   * Create a message for `reason`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {Options | null | undefined} [options]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | Options | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns
   *   Instance of `VFileMessage`.
   */
  // eslint-disable-next-line complexity
  constructor(t, n, r) {
    super(), typeof n == "string" && (r = n, n = void 0);
    let i = "", o = {}, l = !1;
    if (n && ("line" in n && "column" in n ? o = { place: n } : "start" in n && "end" in n ? o = { place: n } : "type" in n ? o = {
      ancestors: [n],
      place: n.position
    } : o = { ...n }), typeof t == "string" ? i = t : !o.cause && t && (l = !0, i = t.message, o.cause = t), !o.ruleId && !o.source && typeof r == "string") {
      const u = r.indexOf(":");
      u === -1 ? o.ruleId = r : (o.source = r.slice(0, u), o.ruleId = r.slice(u + 1));
    }
    if (!o.place && o.ancestors && o.ancestors) {
      const u = o.ancestors[o.ancestors.length - 1];
      u && (o.place = u.position);
    }
    const a = o.place && "start" in o.place ? o.place.start : o.place;
    this.ancestors = o.ancestors || void 0, this.cause = o.cause || void 0, this.column = a ? a.column : void 0, this.fatal = void 0, this.file, this.message = i, this.line = a ? a.line : void 0, this.name = ft(o.place) || "1:1", this.place = o.place || void 0, this.reason = this.message, this.ruleId = o.ruleId || void 0, this.source = o.source || void 0, this.stack = l && o.cause && typeof o.cause.stack == "string" ? o.cause.stack : "", this.actual, this.expected, this.note, this.url;
  }
}
he.prototype.file = "";
he.prototype.name = "";
he.prototype.reason = "";
he.prototype.message = "";
he.prototype.stack = "";
he.prototype.column = void 0;
he.prototype.line = void 0;
he.prototype.ancestors = void 0;
he.prototype.cause = void 0;
he.prototype.fatal = void 0;
he.prototype.place = void 0;
he.prototype.ruleId = void 0;
he.prototype.source = void 0;
const Nn = {}.hasOwnProperty, qo = /* @__PURE__ */ new Map(), Wo = /[A-Z]/g, Xo = /* @__PURE__ */ new Set(["table", "tbody", "thead", "tfoot", "tr"]), Yo = /* @__PURE__ */ new Set(["td", "th"]), mi = "https://github.com/syntax-tree/hast-util-to-jsx-runtime";
function Qo(e, t) {
  if (!t || t.Fragment === void 0)
    throw new TypeError("Expected `Fragment` in options");
  const n = t.filePath || void 0;
  let r;
  if (t.development) {
    if (typeof t.jsxDEV != "function")
      throw new TypeError(
        "Expected `jsxDEV` in options when `development: true`"
      );
    r = ia(n, t.jsxDEV);
  } else {
    if (typeof t.jsx != "function")
      throw new TypeError("Expected `jsx` in production options");
    if (typeof t.jsxs != "function")
      throw new TypeError("Expected `jsxs` in production options");
    r = ra(n, t.jsx, t.jsxs);
  }
  const i = {
    Fragment: t.Fragment,
    ancestors: [],
    components: t.components || {},
    create: r,
    elementAttributeNameCase: t.elementAttributeNameCase || "react",
    evaluater: t.createEvaluater ? t.createEvaluater() : void 0,
    filePath: n,
    ignoreInvalidStyle: t.ignoreInvalidStyle || !1,
    passKeys: t.passKeys !== !1,
    passNode: t.passNode || !1,
    schema: t.space === "svg" ? Dn : Oo,
    stylePropertyNameCase: t.stylePropertyNameCase || "dom",
    tableCellAlignToStyle: t.tableCellAlignToStyle !== !1
  }, o = di(i, e, void 0);
  return o && typeof o != "string" ? o : i.create(
    e,
    i.Fragment,
    { children: o || void 0 },
    void 0
  );
}
function di(e, t, n) {
  if (t.type === "element")
    return Jo(e, t, n);
  if (t.type === "mdxFlowExpression" || t.type === "mdxTextExpression")
    return Go(e, t);
  if (t.type === "mdxJsxFlowElement" || t.type === "mdxJsxTextElement")
    return ea(e, t, n);
  if (t.type === "mdxjsEsm")
    return Ko(e, t);
  if (t.type === "root")
    return ta(e, t, n);
  if (t.type === "text")
    return na(e, t);
}
function Jo(e, t, n) {
  const r = e.schema;
  let i = r;
  t.tagName.toLowerCase() === "svg" && r.space === "html" && (i = Dn, e.schema = i), e.ancestors.push(t);
  const o = yi(e, t.tagName, !1), l = la(e, t);
  let a = _n(e, t);
  return Xo.has(t.tagName) && (a = a.filter(function(u) {
    return typeof u == "string" ? !Io(u) : !0;
  })), gi(e, l, o, t), On(l, a), e.ancestors.pop(), e.schema = r, e.create(t, o, l, n);
}
function Go(e, t) {
  if (t.data && t.data.estree && e.evaluater) {
    const r = t.data.estree.body[0];
    return r.type, /** @type {Child | undefined} */
    e.evaluater.evaluateExpression(r.expression);
  }
  mt(e, t.position);
}
function Ko(e, t) {
  if (t.data && t.data.estree && e.evaluater)
    return (
      /** @type {Child | undefined} */
      e.evaluater.evaluateProgram(t.data.estree)
    );
  mt(e, t.position);
}
function ea(e, t, n) {
  const r = e.schema;
  let i = r;
  t.name === "svg" && r.space === "html" && (i = Dn, e.schema = i), e.ancestors.push(t);
  const o = t.name === null ? e.Fragment : yi(e, t.name, !0), l = oa(e, t), a = _n(e, t);
  return gi(e, l, o, t), On(l, a), e.ancestors.pop(), e.schema = r, e.create(t, o, l, n);
}
function ta(e, t, n) {
  const r = {};
  return On(r, _n(e, t)), e.create(t, e.Fragment, r, n);
}
function na(e, t) {
  return t.value;
}
function gi(e, t, n, r) {
  typeof n != "string" && n !== e.Fragment && e.passNode && (t.node = r);
}
function On(e, t) {
  if (t.length > 0) {
    const n = t.length > 1 ? t : t[0];
    n && (e.children = n);
  }
}
function ra(e, t, n) {
  return r;
  function r(i, o, l, a) {
    const s = Array.isArray(l.children) ? n : t;
    return a ? s(o, l, a) : s(o, l);
  }
}
function ia(e, t) {
  return n;
  function n(r, i, o, l) {
    const a = Array.isArray(o.children), u = Rn(r);
    return t(
      i,
      o,
      l,
      a,
      {
        columnNumber: u ? u.column - 1 : void 0,
        fileName: e,
        lineNumber: u ? u.line : void 0
      },
      void 0
    );
  }
}
function la(e, t) {
  const n = {};
  let r, i;
  for (i in t.properties)
    if (i !== "children" && Nn.call(t.properties, i)) {
      const o = aa(e, i, t.properties[i]);
      if (o) {
        const [l, a] = o;
        e.tableCellAlignToStyle && l === "align" && typeof a == "string" && Yo.has(t.tagName) ? r = a : n[l] = a;
      }
    }
  if (r) {
    const o = (
      /** @type {Style} */
      n.style || (n.style = {})
    );
    o[e.stylePropertyNameCase === "css" ? "text-align" : "textAlign"] = r;
  }
  return n;
}
function oa(e, t) {
  const n = {};
  for (const r of t.attributes)
    if (r.type === "mdxJsxExpressionAttribute")
      if (r.data && r.data.estree && e.evaluater) {
        const o = r.data.estree.body[0];
        o.type;
        const l = o.expression;
        l.type;
        const a = l.properties[0];
        a.type, Object.assign(
          n,
          e.evaluater.evaluateExpression(a.argument)
        );
      } else
        mt(e, t.position);
    else {
      const i = r.name;
      let o;
      if (r.value && typeof r.value == "object")
        if (r.value.data && r.value.data.estree && e.evaluater) {
          const a = r.value.data.estree.body[0];
          a.type, o = e.evaluater.evaluateExpression(a.expression);
        } else
          mt(e, t.position);
      else
        o = r.value === null ? !0 : r.value;
      n[i] = /** @type {Props[keyof Props]} */
      o;
    }
  return n;
}
function _n(e, t) {
  const n = [];
  let r = -1;
  const i = e.passKeys ? /* @__PURE__ */ new Map() : qo;
  for (; ++r < t.children.length; ) {
    const o = t.children[r];
    let l;
    if (e.passKeys) {
      const u = o.type === "element" ? o.tagName : o.type === "mdxJsxFlowElement" || o.type === "mdxJsxTextElement" ? o.name : void 0;
      if (u) {
        const s = i.get(u) || 0;
        l = u + "-" + s, i.set(u, s + 1);
      }
    }
    const a = di(e, o, l);
    a !== void 0 && n.push(a);
  }
  return n;
}
function aa(e, t, n) {
  const r = Do(e.schema, t);
  if (!(n == null || typeof n == "number" && Number.isNaN(n))) {
    if (Array.isArray(n) && (n = r.commaSeparated ? Co(n) : _o(n)), r.property === "style") {
      let i = typeof n == "object" ? n : sa(e, String(n));
      return e.stylePropertyNameCase === "css" && (i = ua(i)), ["style", i];
    }
    return [
      e.elementAttributeNameCase === "react" && r.space ? Lo[r.property] || r.property : r.attribute,
      n
    ];
  }
}
function sa(e, t) {
  try {
    return $o(t, { reactCompat: !0 });
  } catch (n) {
    if (e.ignoreInvalidStyle)
      return {};
    const r = (
      /** @type {Error} */
      n
    ), i = new he("Cannot parse `style` attribute", {
      ancestors: e.ancestors,
      cause: r,
      ruleId: "style",
      source: "hast-util-to-jsx-runtime"
    });
    throw i.file = e.filePath || void 0, i.url = mi + "#cannot-parse-style-attribute", i;
  }
}
function yi(e, t, n) {
  let r;
  if (!n)
    r = { type: "Literal", value: t };
  else if (t.includes(".")) {
    const i = t.split(".");
    let o = -1, l;
    for (; ++o < i.length; ) {
      const a = ur(i[o]) ? { type: "Identifier", name: i[o] } : { type: "Literal", value: i[o] };
      l = l ? {
        type: "MemberExpression",
        object: l,
        property: a,
        computed: !!(o && a.type === "Literal"),
        optional: !1
      } : a;
    }
    r = l;
  } else
    r = ur(t) && !/^[a-z]/.test(t) ? { type: "Identifier", name: t } : { type: "Literal", value: t };
  if (r.type === "Literal") {
    const i = (
      /** @type {string | number} */
      r.value
    );
    return Nn.call(e.components, i) ? e.components[i] : i;
  }
  if (e.evaluater)
    return e.evaluater.evaluateExpression(r);
  mt(e);
}
function mt(e, t) {
  const n = new he(
    "Cannot handle MDX estrees without `createEvaluater`",
    {
      ancestors: e.ancestors,
      place: t,
      ruleId: "mdx-estree",
      source: "hast-util-to-jsx-runtime"
    }
  );
  throw n.file = e.filePath || void 0, n.url = mi + "#cannot-handle-mdx-estrees-without-createevaluater", n;
}
function ua(e) {
  const t = {};
  let n;
  for (n in e)
    Nn.call(e, n) && (t[ca(n)] = e[n]);
  return t;
}
function ca(e) {
  let t = e.replace(Wo, fa);
  return t.slice(0, 3) === "ms-" && (t = "-" + t), t;
}
function fa(e) {
  return "-" + e.toLowerCase();
}
const Kt = {
  action: ["form"],
  cite: ["blockquote", "del", "ins", "q"],
  data: ["object"],
  formAction: ["button", "input"],
  href: ["a", "area", "base", "link"],
  icon: ["menuitem"],
  itemId: null,
  manifest: ["html"],
  ping: ["a", "area"],
  poster: ["video"],
  src: [
    "audio",
    "embed",
    "iframe",
    "img",
    "input",
    "script",
    "source",
    "track",
    "video"
  ]
}, ha = {};
function Bn(e, t) {
  const n = ha, r = typeof n.includeImageAlt == "boolean" ? n.includeImageAlt : !0, i = typeof n.includeHtml == "boolean" ? n.includeHtml : !0;
  return xi(e, r, i);
}
function xi(e, t, n) {
  if (pa(e)) {
    if ("value" in e)
      return e.type === "html" && !n ? "" : e.value;
    if (t && "alt" in e && e.alt)
      return e.alt;
    if ("children" in e)
      return kr(e.children, t, n);
  }
  return Array.isArray(e) ? kr(e, t, n) : "";
}
function kr(e, t, n) {
  const r = [];
  let i = -1;
  for (; ++i < e.length; )
    r[i] = xi(e[i], t, n);
  return r.join("");
}
function pa(e) {
  return !!(e && typeof e == "object");
}
const br = document.createElement("i");
function Vn(e) {
  const t = "&" + e + ";";
  br.innerHTML = t;
  const n = br.textContent;
  return (
    // @ts-expect-error: TypeScript is wrong that `textContent` on elements can
    // yield `null`.
    n.charCodeAt(n.length - 1) === 59 && e !== "semi" || n === t ? !1 : n
  );
}
function Ce(e, t, n, r) {
  const i = e.length;
  let o = 0, l;
  if (t < 0 ? t = -t > i ? 0 : i + t : t = t > i ? i : t, n = n > 0 ? n : 0, r.length < 1e4)
    l = Array.from(r), l.unshift(t, n), e.splice(...l);
  else
    for (n && e.splice(t, n); o < r.length; )
      l = r.slice(o, o + 1e4), l.unshift(t, 0), e.splice(...l), o += 1e4, t += 1e4;
}
function Se(e, t) {
  return e.length > 0 ? (Ce(e, e.length, 0, t), e) : t;
}
const wr = {}.hasOwnProperty;
function ki(e) {
  const t = {};
  let n = -1;
  for (; ++n < e.length; )
    ma(t, e[n]);
  return t;
}
function ma(e, t) {
  let n;
  for (n in t) {
    const i = (wr.call(e, n) ? e[n] : void 0) || (e[n] = {}), o = t[n];
    let l;
    if (o)
      for (l in o) {
        wr.call(i, l) || (i[l] = []);
        const a = o[l];
        da(
          // @ts-expect-error Looks like a list.
          i[l],
          Array.isArray(a) ? a : a ? [a] : []
        );
      }
  }
}
function da(e, t) {
  let n = -1;
  const r = [];
  for (; ++n < t.length; )
    (t[n].add === "after" ? e : r).push(t[n]);
  Ce(e, 0, 0, r);
}
function bi(e, t) {
  const n = Number.parseInt(e, t);
  return (
    // C0 except for HT, LF, FF, CR, space.
    n < 9 || n === 11 || n > 13 && n < 32 || // Control character (DEL) of C0, and C1 controls.
    n > 126 && n < 160 || // Lone high surrogates and low surrogates.
    n > 55295 && n < 57344 || // Noncharacters.
    n > 64975 && n < 65008 || /* eslint-disable no-bitwise */
    (n & 65535) === 65535 || (n & 65535) === 65534 || /* eslint-enable no-bitwise */
    // Out of range
    n > 1114111 ? "�" : String.fromCodePoint(n)
  );
}
function Fe(e) {
  return e.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
}
const de = Be(/[A-Za-z]/), fe = Be(/[\dA-Za-z]/), ga = Be(/[#-'*+\--9=?A-Z^-~]/);
function Pt(e) {
  return (
    // Special whitespace codes (which have negative values), C0 and Control
    // character DEL
    e !== null && (e < 32 || e === 127)
  );
}
const wn = Be(/\d/), ya = Be(/[\dA-Fa-f]/), xa = Be(/[!-/:-@[-`{-~]/);
function H(e) {
  return e !== null && e < -2;
}
function te(e) {
  return e !== null && (e < 0 || e === 32);
}
function W(e) {
  return e === -2 || e === -1 || e === 32;
}
const Ot = Be(new RegExp("\\p{P}|\\p{S}", "u")), qe = Be(/\s/);
function Be(e) {
  return t;
  function t(n) {
    return n !== null && n > -1 && e.test(String.fromCharCode(n));
  }
}
function rt(e) {
  const t = [];
  let n = -1, r = 0, i = 0;
  for (; ++n < e.length; ) {
    const o = e.charCodeAt(n);
    let l = "";
    if (o === 37 && fe(e.charCodeAt(n + 1)) && fe(e.charCodeAt(n + 2)))
      i = 2;
    else if (o < 128)
      /[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(o)) || (l = String.fromCharCode(o));
    else if (o > 55295 && o < 57344) {
      const a = e.charCodeAt(n + 1);
      o < 56320 && a > 56319 && a < 57344 ? (l = String.fromCharCode(o, a), i = 1) : l = "�";
    } else
      l = String.fromCharCode(o);
    l && (t.push(e.slice(r, n), encodeURIComponent(l)), r = n + i + 1, l = ""), i && (n += i, i = 0);
  }
  return t.join("") + e.slice(r);
}
function Q(e, t, n, r) {
  const i = r ? r - 1 : Number.POSITIVE_INFINITY;
  let o = 0;
  return l;
  function l(u) {
    return W(u) ? (e.enter(n), a(u)) : t(u);
  }
  function a(u) {
    return W(u) && o++ < i ? (e.consume(u), a) : (e.exit(n), t(u));
  }
}
const ka = {
  tokenize: ba
};
function ba(e) {
  const t = e.attempt(this.parser.constructs.contentInitial, r, i);
  let n;
  return t;
  function r(a) {
    if (a === null) {
      e.consume(a);
      return;
    }
    return e.enter("lineEnding"), e.consume(a), e.exit("lineEnding"), Q(e, t, "linePrefix");
  }
  function i(a) {
    return e.enter("paragraph"), o(a);
  }
  function o(a) {
    const u = e.enter("chunkText", {
      contentType: "text",
      previous: n
    });
    return n && (n.next = u), n = u, l(a);
  }
  function l(a) {
    if (a === null) {
      e.exit("chunkText"), e.exit("paragraph"), e.consume(a);
      return;
    }
    return H(a) ? (e.consume(a), e.exit("chunkText"), o) : (e.consume(a), l);
  }
}
const wa = {
  tokenize: Ca
}, Cr = {
  tokenize: va
};
function Ca(e) {
  const t = this, n = [];
  let r = 0, i, o, l;
  return a;
  function a(E) {
    if (r < n.length) {
      const R = n[r];
      return t.containerState = R[1], e.attempt(R[0].continuation, u, s)(E);
    }
    return s(E);
  }
  function u(E) {
    if (r++, t.containerState._closeFlow) {
      t.containerState._closeFlow = void 0, i && v();
      const R = t.events.length;
      let N = R, w;
      for (; N--; )
        if (t.events[N][0] === "exit" && t.events[N][1].type === "chunkFlow") {
          w = t.events[N][1].end;
          break;
        }
      x(r);
      let P = R;
      for (; P < t.events.length; )
        t.events[P][1].end = {
          ...w
        }, P++;
      return Ce(t.events, N + 1, 0, t.events.slice(R)), t.events.length = P, s(E);
    }
    return a(E);
  }
  function s(E) {
    if (r === n.length) {
      if (!i)
        return p(E);
      if (i.currentConstruct && i.currentConstruct.concrete)
        return g(E);
      t.interrupt = !!(i.currentConstruct && !i._gfmTableDynamicInterruptHack);
    }
    return t.containerState = {}, e.check(Cr, f, c)(E);
  }
  function f(E) {
    return i && v(), x(r), p(E);
  }
  function c(E) {
    return t.parser.lazy[t.now().line] = r !== n.length, l = t.now().offset, g(E);
  }
  function p(E) {
    return t.containerState = {}, e.attempt(Cr, h, g)(E);
  }
  function h(E) {
    return r++, n.push([t.currentConstruct, t.containerState]), p(E);
  }
  function g(E) {
    if (E === null) {
      i && v(), x(0), e.consume(E);
      return;
    }
    return i = i || t.parser.flow(t.now()), e.enter("chunkFlow", {
      _tokenizer: i,
      contentType: "flow",
      previous: o
    }), k(E);
  }
  function k(E) {
    if (E === null) {
      S(e.exit("chunkFlow"), !0), x(0), e.consume(E);
      return;
    }
    return H(E) ? (e.consume(E), S(e.exit("chunkFlow")), r = 0, t.interrupt = void 0, a) : (e.consume(E), k);
  }
  function S(E, R) {
    const N = t.sliceStream(E);
    if (R && N.push(null), E.previous = o, o && (o.next = E), o = E, i.defineSkip(E.start), i.write(N), t.parser.lazy[E.start.line]) {
      let w = i.events.length;
      for (; w--; )
        if (
          // The token starts before the line ending…
          i.events[w][1].start.offset < l && // …and either is not ended yet…
          (!i.events[w][1].end || // …or ends after it.
          i.events[w][1].end.offset > l)
        )
          return;
      const P = t.events.length;
      let L = P, V, b;
      for (; L--; )
        if (t.events[L][0] === "exit" && t.events[L][1].type === "chunkFlow") {
          if (V) {
            b = t.events[L][1].end;
            break;
          }
          V = !0;
        }
      for (x(r), w = P; w < t.events.length; )
        t.events[w][1].end = {
          ...b
        }, w++;
      Ce(t.events, L + 1, 0, t.events.slice(P)), t.events.length = w;
    }
  }
  function x(E) {
    let R = n.length;
    for (; R-- > E; ) {
      const N = n[R];
      t.containerState = N[1], N[0].exit.call(t, e);
    }
    n.length = E;
  }
  function v() {
    i.write([null]), o = void 0, i = void 0, t.containerState._closeFlow = void 0;
  }
}
function va(e, t, n) {
  return Q(e, e.attempt(this.parser.constructs.document, t, n), "linePrefix", this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
}
function tt(e) {
  if (e === null || te(e) || qe(e))
    return 1;
  if (Ot(e))
    return 2;
}
function _t(e, t, n) {
  const r = [];
  let i = -1;
  for (; ++i < e.length; ) {
    const o = e[i].resolveAll;
    o && !r.includes(o) && (t = o(t, n), r.push(o));
  }
  return t;
}
const Cn = {
  name: "attention",
  resolveAll: Sa,
  tokenize: Ea
};
function Sa(e, t) {
  let n = -1, r, i, o, l, a, u, s, f;
  for (; ++n < e.length; )
    if (e[n][0] === "enter" && e[n][1].type === "attentionSequence" && e[n][1]._close) {
      for (r = n; r--; )
        if (e[r][0] === "exit" && e[r][1].type === "attentionSequence" && e[r][1]._open && // If the markers are the same:
        t.sliceSerialize(e[r][1]).charCodeAt(0) === t.sliceSerialize(e[n][1]).charCodeAt(0)) {
          if ((e[r][1]._close || e[n][1]._open) && (e[n][1].end.offset - e[n][1].start.offset) % 3 && !((e[r][1].end.offset - e[r][1].start.offset + e[n][1].end.offset - e[n][1].start.offset) % 3))
            continue;
          u = e[r][1].end.offset - e[r][1].start.offset > 1 && e[n][1].end.offset - e[n][1].start.offset > 1 ? 2 : 1;
          const c = {
            ...e[r][1].end
          }, p = {
            ...e[n][1].start
          };
          vr(c, -u), vr(p, u), l = {
            type: u > 1 ? "strongSequence" : "emphasisSequence",
            start: c,
            end: {
              ...e[r][1].end
            }
          }, a = {
            type: u > 1 ? "strongSequence" : "emphasisSequence",
            start: {
              ...e[n][1].start
            },
            end: p
          }, o = {
            type: u > 1 ? "strongText" : "emphasisText",
            start: {
              ...e[r][1].end
            },
            end: {
              ...e[n][1].start
            }
          }, i = {
            type: u > 1 ? "strong" : "emphasis",
            start: {
              ...l.start
            },
            end: {
              ...a.end
            }
          }, e[r][1].end = {
            ...l.start
          }, e[n][1].start = {
            ...a.end
          }, s = [], e[r][1].end.offset - e[r][1].start.offset && (s = Se(s, [["enter", e[r][1], t], ["exit", e[r][1], t]])), s = Se(s, [["enter", i, t], ["enter", l, t], ["exit", l, t], ["enter", o, t]]), s = Se(s, _t(t.parser.constructs.insideSpan.null, e.slice(r + 1, n), t)), s = Se(s, [["exit", o, t], ["enter", a, t], ["exit", a, t], ["exit", i, t]]), e[n][1].end.offset - e[n][1].start.offset ? (f = 2, s = Se(s, [["enter", e[n][1], t], ["exit", e[n][1], t]])) : f = 0, Ce(e, r - 1, n - r + 3, s), n = r + s.length - f - 2;
          break;
        }
    }
  for (n = -1; ++n < e.length; )
    e[n][1].type === "attentionSequence" && (e[n][1].type = "data");
  return e;
}
function Ea(e, t) {
  const n = this.parser.constructs.attentionMarkers.null, r = this.previous, i = tt(r);
  let o;
  return l;
  function l(u) {
    return o = u, e.enter("attentionSequence"), a(u);
  }
  function a(u) {
    if (u === o)
      return e.consume(u), a;
    const s = e.exit("attentionSequence"), f = tt(u), c = !f || f === 2 && i || n.includes(u), p = !i || i === 2 && f || n.includes(r);
    return s._open = !!(o === 42 ? c : c && (i || !p)), s._close = !!(o === 42 ? p : p && (f || !c)), t(u);
  }
}
function vr(e, t) {
  e.column += t, e.offset += t, e._bufferIndex += t;
}
const Aa = {
  name: "autolink",
  tokenize: Ia
};
function Ia(e, t, n) {
  let r = 0;
  return i;
  function i(h) {
    return e.enter("autolink"), e.enter("autolinkMarker"), e.consume(h), e.exit("autolinkMarker"), e.enter("autolinkProtocol"), o;
  }
  function o(h) {
    return de(h) ? (e.consume(h), l) : h === 64 ? n(h) : s(h);
  }
  function l(h) {
    return h === 43 || h === 45 || h === 46 || fe(h) ? (r = 1, a(h)) : s(h);
  }
  function a(h) {
    return h === 58 ? (e.consume(h), r = 0, u) : (h === 43 || h === 45 || h === 46 || fe(h)) && r++ < 32 ? (e.consume(h), a) : (r = 0, s(h));
  }
  function u(h) {
    return h === 62 ? (e.exit("autolinkProtocol"), e.enter("autolinkMarker"), e.consume(h), e.exit("autolinkMarker"), e.exit("autolink"), t) : h === null || h === 32 || h === 60 || Pt(h) ? n(h) : (e.consume(h), u);
  }
  function s(h) {
    return h === 64 ? (e.consume(h), f) : ga(h) ? (e.consume(h), s) : n(h);
  }
  function f(h) {
    return fe(h) ? c(h) : n(h);
  }
  function c(h) {
    return h === 46 ? (e.consume(h), r = 0, f) : h === 62 ? (e.exit("autolinkProtocol").type = "autolinkEmail", e.enter("autolinkMarker"), e.consume(h), e.exit("autolinkMarker"), e.exit("autolink"), t) : p(h);
  }
  function p(h) {
    if ((h === 45 || fe(h)) && r++ < 63) {
      const g = h === 45 ? p : c;
      return e.consume(h), g;
    }
    return n(h);
  }
}
const yt = {
  partial: !0,
  tokenize: Ta
};
function Ta(e, t, n) {
  return r;
  function r(o) {
    return W(o) ? Q(e, i, "linePrefix")(o) : i(o);
  }
  function i(o) {
    return o === null || H(o) ? t(o) : n(o);
  }
}
const wi = {
  continuation: {
    tokenize: Fa
  },
  exit: La,
  name: "blockQuote",
  tokenize: Ma
};
function Ma(e, t, n) {
  const r = this;
  return i;
  function i(l) {
    if (l === 62) {
      const a = r.containerState;
      return a.open || (e.enter("blockQuote", {
        _container: !0
      }), a.open = !0), e.enter("blockQuotePrefix"), e.enter("blockQuoteMarker"), e.consume(l), e.exit("blockQuoteMarker"), o;
    }
    return n(l);
  }
  function o(l) {
    return W(l) ? (e.enter("blockQuotePrefixWhitespace"), e.consume(l), e.exit("blockQuotePrefixWhitespace"), e.exit("blockQuotePrefix"), t) : (e.exit("blockQuotePrefix"), t(l));
  }
}
function Fa(e, t, n) {
  const r = this;
  return i;
  function i(l) {
    return W(l) ? Q(e, o, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(l) : o(l);
  }
  function o(l) {
    return e.attempt(wi, t, n)(l);
  }
}
function La(e) {
  e.exit("blockQuote");
}
const Ci = {
  name: "characterEscape",
  tokenize: Pa
};
function Pa(e, t, n) {
  return r;
  function r(o) {
    return e.enter("characterEscape"), e.enter("escapeMarker"), e.consume(o), e.exit("escapeMarker"), i;
  }
  function i(o) {
    return xa(o) ? (e.enter("characterEscapeValue"), e.consume(o), e.exit("characterEscapeValue"), e.exit("characterEscape"), t) : n(o);
  }
}
const vi = {
  name: "characterReference",
  tokenize: za
};
function za(e, t, n) {
  const r = this;
  let i = 0, o, l;
  return a;
  function a(c) {
    return e.enter("characterReference"), e.enter("characterReferenceMarker"), e.consume(c), e.exit("characterReferenceMarker"), u;
  }
  function u(c) {
    return c === 35 ? (e.enter("characterReferenceMarkerNumeric"), e.consume(c), e.exit("characterReferenceMarkerNumeric"), s) : (e.enter("characterReferenceValue"), o = 31, l = fe, f(c));
  }
  function s(c) {
    return c === 88 || c === 120 ? (e.enter("characterReferenceMarkerHexadecimal"), e.consume(c), e.exit("characterReferenceMarkerHexadecimal"), e.enter("characterReferenceValue"), o = 6, l = ya, f) : (e.enter("characterReferenceValue"), o = 7, l = wn, f(c));
  }
  function f(c) {
    if (c === 59 && i) {
      const p = e.exit("characterReferenceValue");
      return l === fe && !Vn(r.sliceSerialize(p)) ? n(c) : (e.enter("characterReferenceMarker"), e.consume(c), e.exit("characterReferenceMarker"), e.exit("characterReference"), t);
    }
    return l(c) && i++ < o ? (e.consume(c), f) : n(c);
  }
}
const Sr = {
  partial: !0,
  tokenize: Ra
}, Er = {
  concrete: !0,
  name: "codeFenced",
  tokenize: Da
};
function Da(e, t, n) {
  const r = this, i = {
    partial: !0,
    tokenize: N
  };
  let o = 0, l = 0, a;
  return u;
  function u(w) {
    return s(w);
  }
  function s(w) {
    const P = r.events[r.events.length - 1];
    return o = P && P[1].type === "linePrefix" ? P[2].sliceSerialize(P[1], !0).length : 0, a = w, e.enter("codeFenced"), e.enter("codeFencedFence"), e.enter("codeFencedFenceSequence"), f(w);
  }
  function f(w) {
    return w === a ? (l++, e.consume(w), f) : l < 3 ? n(w) : (e.exit("codeFencedFenceSequence"), W(w) ? Q(e, c, "whitespace")(w) : c(w));
  }
  function c(w) {
    return w === null || H(w) ? (e.exit("codeFencedFence"), r.interrupt ? t(w) : e.check(Sr, k, R)(w)) : (e.enter("codeFencedFenceInfo"), e.enter("chunkString", {
      contentType: "string"
    }), p(w));
  }
  function p(w) {
    return w === null || H(w) ? (e.exit("chunkString"), e.exit("codeFencedFenceInfo"), c(w)) : W(w) ? (e.exit("chunkString"), e.exit("codeFencedFenceInfo"), Q(e, h, "whitespace")(w)) : w === 96 && w === a ? n(w) : (e.consume(w), p);
  }
  function h(w) {
    return w === null || H(w) ? c(w) : (e.enter("codeFencedFenceMeta"), e.enter("chunkString", {
      contentType: "string"
    }), g(w));
  }
  function g(w) {
    return w === null || H(w) ? (e.exit("chunkString"), e.exit("codeFencedFenceMeta"), c(w)) : w === 96 && w === a ? n(w) : (e.consume(w), g);
  }
  function k(w) {
    return e.attempt(i, R, S)(w);
  }
  function S(w) {
    return e.enter("lineEnding"), e.consume(w), e.exit("lineEnding"), x;
  }
  function x(w) {
    return o > 0 && W(w) ? Q(e, v, "linePrefix", o + 1)(w) : v(w);
  }
  function v(w) {
    return w === null || H(w) ? e.check(Sr, k, R)(w) : (e.enter("codeFlowValue"), E(w));
  }
  function E(w) {
    return w === null || H(w) ? (e.exit("codeFlowValue"), v(w)) : (e.consume(w), E);
  }
  function R(w) {
    return e.exit("codeFenced"), t(w);
  }
  function N(w, P, L) {
    let V = 0;
    return b;
    function b(O) {
      return w.enter("lineEnding"), w.consume(O), w.exit("lineEnding"), F;
    }
    function F(O) {
      return w.enter("codeFencedFence"), W(O) ? Q(w, z, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(O) : z(O);
    }
    function z(O) {
      return O === a ? (w.enter("codeFencedFenceSequence"), D(O)) : L(O);
    }
    function D(O) {
      return O === a ? (V++, w.consume(O), D) : V >= l ? (w.exit("codeFencedFenceSequence"), W(O) ? Q(w, A, "whitespace")(O) : A(O)) : L(O);
    }
    function A(O) {
      return O === null || H(O) ? (w.exit("codeFencedFence"), P(O)) : L(O);
    }
  }
}
function Ra(e, t, n) {
  const r = this;
  return i;
  function i(l) {
    return l === null ? n(l) : (e.enter("lineEnding"), e.consume(l), e.exit("lineEnding"), o);
  }
  function o(l) {
    return r.parser.lazy[r.now().line] ? n(l) : t(l);
  }
}
const en = {
  name: "codeIndented",
  tokenize: Oa
}, Na = {
  partial: !0,
  tokenize: _a
};
function Oa(e, t, n) {
  const r = this;
  return i;
  function i(s) {
    return e.enter("codeIndented"), Q(e, o, "linePrefix", 5)(s);
  }
  function o(s) {
    const f = r.events[r.events.length - 1];
    return f && f[1].type === "linePrefix" && f[2].sliceSerialize(f[1], !0).length >= 4 ? l(s) : n(s);
  }
  function l(s) {
    return s === null ? u(s) : H(s) ? e.attempt(Na, l, u)(s) : (e.enter("codeFlowValue"), a(s));
  }
  function a(s) {
    return s === null || H(s) ? (e.exit("codeFlowValue"), l(s)) : (e.consume(s), a);
  }
  function u(s) {
    return e.exit("codeIndented"), t(s);
  }
}
function _a(e, t, n) {
  const r = this;
  return i;
  function i(l) {
    return r.parser.lazy[r.now().line] ? n(l) : H(l) ? (e.enter("lineEnding"), e.consume(l), e.exit("lineEnding"), i) : Q(e, o, "linePrefix", 5)(l);
  }
  function o(l) {
    const a = r.events[r.events.length - 1];
    return a && a[1].type === "linePrefix" && a[2].sliceSerialize(a[1], !0).length >= 4 ? t(l) : H(l) ? i(l) : n(l);
  }
}
const Ba = {
  name: "codeText",
  previous: Ha,
  resolve: Va,
  tokenize: ja
};
function Va(e) {
  let t = e.length - 4, n = 3, r, i;
  if ((e[n][1].type === "lineEnding" || e[n][1].type === "space") && (e[t][1].type === "lineEnding" || e[t][1].type === "space")) {
    for (r = n; ++r < t; )
      if (e[r][1].type === "codeTextData") {
        e[n][1].type = "codeTextPadding", e[t][1].type = "codeTextPadding", n += 2, t -= 2;
        break;
      }
  }
  for (r = n - 1, t++; ++r <= t; )
    i === void 0 ? r !== t && e[r][1].type !== "lineEnding" && (i = r) : (r === t || e[r][1].type === "lineEnding") && (e[i][1].type = "codeTextData", r !== i + 2 && (e[i][1].end = e[r - 1][1].end, e.splice(i + 2, r - i - 2), t -= r - i - 2, r = i + 2), i = void 0);
  return e;
}
function Ha(e) {
  return e !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
}
function ja(e, t, n) {
  let r = 0, i, o;
  return l;
  function l(c) {
    return e.enter("codeText"), e.enter("codeTextSequence"), a(c);
  }
  function a(c) {
    return c === 96 ? (e.consume(c), r++, a) : (e.exit("codeTextSequence"), u(c));
  }
  function u(c) {
    return c === null ? n(c) : c === 32 ? (e.enter("space"), e.consume(c), e.exit("space"), u) : c === 96 ? (o = e.enter("codeTextSequence"), i = 0, f(c)) : H(c) ? (e.enter("lineEnding"), e.consume(c), e.exit("lineEnding"), u) : (e.enter("codeTextData"), s(c));
  }
  function s(c) {
    return c === null || c === 32 || c === 96 || H(c) ? (e.exit("codeTextData"), u(c)) : (e.consume(c), s);
  }
  function f(c) {
    return c === 96 ? (e.consume(c), i++, f) : i === r ? (e.exit("codeTextSequence"), e.exit("codeText"), t(c)) : (o.type = "codeTextData", s(c));
  }
}
class Za {
  /**
   * @param {ReadonlyArray<T> | null | undefined} [initial]
   *   Initial items (optional).
   * @returns
   *   Splice buffer.
   */
  constructor(t) {
    this.left = t ? [...t] : [], this.right = [];
  }
  /**
   * Array access;
   * does not move the cursor.
   *
   * @param {number} index
   *   Index.
   * @return {T}
   *   Item.
   */
  get(t) {
    if (t < 0 || t >= this.left.length + this.right.length)
      throw new RangeError("Cannot access index `" + t + "` in a splice buffer of size `" + (this.left.length + this.right.length) + "`");
    return t < this.left.length ? this.left[t] : this.right[this.right.length - t + this.left.length - 1];
  }
  /**
   * The length of the splice buffer, one greater than the largest index in the
   * array.
   */
  get length() {
    return this.left.length + this.right.length;
  }
  /**
   * Remove and return `list[0]`;
   * moves the cursor to `0`.
   *
   * @returns {T | undefined}
   *   Item, optional.
   */
  shift() {
    return this.setCursor(0), this.right.pop();
  }
  /**
   * Slice the buffer to get an array;
   * does not move the cursor.
   *
   * @param {number} start
   *   Start.
   * @param {number | null | undefined} [end]
   *   End (optional).
   * @returns {Array<T>}
   *   Array of items.
   */
  slice(t, n) {
    const r = n ?? Number.POSITIVE_INFINITY;
    return r < this.left.length ? this.left.slice(t, r) : t > this.left.length ? this.right.slice(this.right.length - r + this.left.length, this.right.length - t + this.left.length).reverse() : this.left.slice(t).concat(this.right.slice(this.right.length - r + this.left.length).reverse());
  }
  /**
   * Mimics the behavior of Array.prototype.splice() except for the change of
   * interface necessary to avoid segfaults when patching in very large arrays.
   *
   * This operation moves cursor is moved to `start` and results in the cursor
   * placed after any inserted items.
   *
   * @param {number} start
   *   Start;
   *   zero-based index at which to start changing the array;
   *   negative numbers count backwards from the end of the array and values
   *   that are out-of bounds are clamped to the appropriate end of the array.
   * @param {number | null | undefined} [deleteCount=0]
   *   Delete count (default: `0`);
   *   maximum number of elements to delete, starting from start.
   * @param {Array<T> | null | undefined} [items=[]]
   *   Items to include in place of the deleted items (default: `[]`).
   * @return {Array<T>}
   *   Any removed items.
   */
  splice(t, n, r) {
    const i = n || 0;
    this.setCursor(Math.trunc(t));
    const o = this.right.splice(this.right.length - i, Number.POSITIVE_INFINITY);
    return r && st(this.left, r), o.reverse();
  }
  /**
   * Remove and return the highest-numbered item in the array, so
   * `list[list.length - 1]`;
   * Moves the cursor to `length`.
   *
   * @returns {T | undefined}
   *   Item, optional.
   */
  pop() {
    return this.setCursor(Number.POSITIVE_INFINITY), this.left.pop();
  }
  /**
   * Inserts a single item to the high-numbered side of the array;
   * moves the cursor to `length`.
   *
   * @param {T} item
   *   Item.
   * @returns {undefined}
   *   Nothing.
   */
  push(t) {
    this.setCursor(Number.POSITIVE_INFINITY), this.left.push(t);
  }
  /**
   * Inserts many items to the high-numbered side of the array.
   * Moves the cursor to `length`.
   *
   * @param {Array<T>} items
   *   Items.
   * @returns {undefined}
   *   Nothing.
   */
  pushMany(t) {
    this.setCursor(Number.POSITIVE_INFINITY), st(this.left, t);
  }
  /**
   * Inserts a single item to the low-numbered side of the array;
   * Moves the cursor to `0`.
   *
   * @param {T} item
   *   Item.
   * @returns {undefined}
   *   Nothing.
   */
  unshift(t) {
    this.setCursor(0), this.right.push(t);
  }
  /**
   * Inserts many items to the low-numbered side of the array;
   * moves the cursor to `0`.
   *
   * @param {Array<T>} items
   *   Items.
   * @returns {undefined}
   *   Nothing.
   */
  unshiftMany(t) {
    this.setCursor(0), st(this.right, t.reverse());
  }
  /**
   * Move the cursor to a specific position in the array. Requires
   * time proportional to the distance moved.
   *
   * If `n < 0`, the cursor will end up at the beginning.
   * If `n > length`, the cursor will end up at the end.
   *
   * @param {number} n
   *   Position.
   * @return {undefined}
   *   Nothing.
   */
  setCursor(t) {
    if (!(t === this.left.length || t > this.left.length && this.right.length === 0 || t < 0 && this.left.length === 0))
      if (t < this.left.length) {
        const n = this.left.splice(t, Number.POSITIVE_INFINITY);
        st(this.right, n.reverse());
      } else {
        const n = this.right.splice(this.left.length + this.right.length - t, Number.POSITIVE_INFINITY);
        st(this.left, n.reverse());
      }
  }
}
function st(e, t) {
  let n = 0;
  if (t.length < 1e4)
    e.push(...t);
  else
    for (; n < t.length; )
      e.push(...t.slice(n, n + 1e4)), n += 1e4;
}
function Si(e) {
  const t = {};
  let n = -1, r, i, o, l, a, u, s;
  const f = new Za(e);
  for (; ++n < f.length; ) {
    for (; n in t; )
      n = t[n];
    if (r = f.get(n), n && r[1].type === "chunkFlow" && f.get(n - 1)[1].type === "listItemPrefix" && (u = r[1]._tokenizer.events, o = 0, o < u.length && u[o][1].type === "lineEndingBlank" && (o += 2), o < u.length && u[o][1].type === "content"))
      for (; ++o < u.length && u[o][1].type !== "content"; )
        u[o][1].type === "chunkText" && (u[o][1]._isInFirstContentOfListItem = !0, o++);
    if (r[0] === "enter")
      r[1].contentType && (Object.assign(t, $a(f, n)), n = t[n], s = !0);
    else if (r[1]._container) {
      for (o = n, i = void 0; o--; )
        if (l = f.get(o), l[1].type === "lineEnding" || l[1].type === "lineEndingBlank")
          l[0] === "enter" && (i && (f.get(i)[1].type = "lineEndingBlank"), l[1].type = "lineEnding", i = o);
        else if (!(l[1].type === "linePrefix" || l[1].type === "listItemIndent")) break;
      i && (r[1].end = {
        ...f.get(i)[1].start
      }, a = f.slice(i, n), a.unshift(r), f.splice(i, n - i + 1, a));
    }
  }
  return Ce(e, 0, Number.POSITIVE_INFINITY, f.slice(0)), !s;
}
function $a(e, t) {
  const n = e.get(t)[1], r = e.get(t)[2];
  let i = t - 1;
  const o = [];
  let l = n._tokenizer;
  l || (l = r.parser[n.contentType](n.start), n._contentTypeTextTrailing && (l._contentTypeTextTrailing = !0));
  const a = l.events, u = [], s = {};
  let f, c, p = -1, h = n, g = 0, k = 0;
  const S = [k];
  for (; h; ) {
    for (; e.get(++i)[1] !== h; )
      ;
    o.push(i), h._tokenizer || (f = r.sliceStream(h), h.next || f.push(null), c && l.defineSkip(h.start), h._isInFirstContentOfListItem && (l._gfmTasklistFirstContentOfListItem = !0), l.write(f), h._isInFirstContentOfListItem && (l._gfmTasklistFirstContentOfListItem = void 0)), c = h, h = h.next;
  }
  for (h = n; ++p < a.length; )
    // Find a void token that includes a break.
    a[p][0] === "exit" && a[p - 1][0] === "enter" && a[p][1].type === a[p - 1][1].type && a[p][1].start.line !== a[p][1].end.line && (k = p + 1, S.push(k), h._tokenizer = void 0, h.previous = void 0, h = h.next);
  for (l.events = [], h ? (h._tokenizer = void 0, h.previous = void 0) : S.pop(), p = S.length; p--; ) {
    const x = a.slice(S[p], S[p + 1]), v = o.pop();
    u.push([v, v + x.length - 1]), e.splice(v, 2, x);
  }
  for (u.reverse(), p = -1; ++p < u.length; )
    s[g + u[p][0]] = g + u[p][1], g += u[p][1] - u[p][0] - 1;
  return s;
}
const Ua = {
  resolve: Wa,
  tokenize: Xa
}, qa = {
  partial: !0,
  tokenize: Ya
};
function Wa(e) {
  return Si(e), e;
}
function Xa(e, t) {
  let n;
  return r;
  function r(a) {
    return e.enter("content"), n = e.enter("chunkContent", {
      contentType: "content"
    }), i(a);
  }
  function i(a) {
    return a === null ? o(a) : H(a) ? e.check(qa, l, o)(a) : (e.consume(a), i);
  }
  function o(a) {
    return e.exit("chunkContent"), e.exit("content"), t(a);
  }
  function l(a) {
    return e.consume(a), e.exit("chunkContent"), n.next = e.enter("chunkContent", {
      contentType: "content",
      previous: n
    }), n = n.next, i;
  }
}
function Ya(e, t, n) {
  const r = this;
  return i;
  function i(l) {
    return e.exit("chunkContent"), e.enter("lineEnding"), e.consume(l), e.exit("lineEnding"), Q(e, o, "linePrefix");
  }
  function o(l) {
    if (l === null || H(l))
      return n(l);
    const a = r.events[r.events.length - 1];
    return !r.parser.constructs.disable.null.includes("codeIndented") && a && a[1].type === "linePrefix" && a[2].sliceSerialize(a[1], !0).length >= 4 ? t(l) : e.interrupt(r.parser.constructs.flow, n, t)(l);
  }
}
function Ei(e, t, n, r, i, o, l, a, u) {
  const s = u || Number.POSITIVE_INFINITY;
  let f = 0;
  return c;
  function c(x) {
    return x === 60 ? (e.enter(r), e.enter(i), e.enter(o), e.consume(x), e.exit(o), p) : x === null || x === 32 || x === 41 || Pt(x) ? n(x) : (e.enter(r), e.enter(l), e.enter(a), e.enter("chunkString", {
      contentType: "string"
    }), k(x));
  }
  function p(x) {
    return x === 62 ? (e.enter(o), e.consume(x), e.exit(o), e.exit(i), e.exit(r), t) : (e.enter(a), e.enter("chunkString", {
      contentType: "string"
    }), h(x));
  }
  function h(x) {
    return x === 62 ? (e.exit("chunkString"), e.exit(a), p(x)) : x === null || x === 60 || H(x) ? n(x) : (e.consume(x), x === 92 ? g : h);
  }
  function g(x) {
    return x === 60 || x === 62 || x === 92 ? (e.consume(x), h) : h(x);
  }
  function k(x) {
    return !f && (x === null || x === 41 || te(x)) ? (e.exit("chunkString"), e.exit(a), e.exit(l), e.exit(r), t(x)) : f < s && x === 40 ? (e.consume(x), f++, k) : x === 41 ? (e.consume(x), f--, k) : x === null || x === 32 || x === 40 || Pt(x) ? n(x) : (e.consume(x), x === 92 ? S : k);
  }
  function S(x) {
    return x === 40 || x === 41 || x === 92 ? (e.consume(x), k) : k(x);
  }
}
function Ai(e, t, n, r, i, o) {
  const l = this;
  let a = 0, u;
  return s;
  function s(h) {
    return e.enter(r), e.enter(i), e.consume(h), e.exit(i), e.enter(o), f;
  }
  function f(h) {
    return a > 999 || h === null || h === 91 || h === 93 && !u || // To do: remove in the future once we’ve switched from
    // `micromark-extension-footnote` to `micromark-extension-gfm-footnote`,
    // which doesn’t need this.
    // Hidden footnotes hook.
    /* c8 ignore next 3 */
    h === 94 && !a && "_hiddenFootnoteSupport" in l.parser.constructs ? n(h) : h === 93 ? (e.exit(o), e.enter(i), e.consume(h), e.exit(i), e.exit(r), t) : H(h) ? (e.enter("lineEnding"), e.consume(h), e.exit("lineEnding"), f) : (e.enter("chunkString", {
      contentType: "string"
    }), c(h));
  }
  function c(h) {
    return h === null || h === 91 || h === 93 || H(h) || a++ > 999 ? (e.exit("chunkString"), f(h)) : (e.consume(h), u || (u = !W(h)), h === 92 ? p : c);
  }
  function p(h) {
    return h === 91 || h === 92 || h === 93 ? (e.consume(h), a++, c) : c(h);
  }
}
function Ii(e, t, n, r, i, o) {
  let l;
  return a;
  function a(p) {
    return p === 34 || p === 39 || p === 40 ? (e.enter(r), e.enter(i), e.consume(p), e.exit(i), l = p === 40 ? 41 : p, u) : n(p);
  }
  function u(p) {
    return p === l ? (e.enter(i), e.consume(p), e.exit(i), e.exit(r), t) : (e.enter(o), s(p));
  }
  function s(p) {
    return p === l ? (e.exit(o), u(l)) : p === null ? n(p) : H(p) ? (e.enter("lineEnding"), e.consume(p), e.exit("lineEnding"), Q(e, s, "linePrefix")) : (e.enter("chunkString", {
      contentType: "string"
    }), f(p));
  }
  function f(p) {
    return p === l || p === null || H(p) ? (e.exit("chunkString"), s(p)) : (e.consume(p), p === 92 ? c : f);
  }
  function c(p) {
    return p === l || p === 92 ? (e.consume(p), f) : f(p);
  }
}
function ht(e, t) {
  let n;
  return r;
  function r(i) {
    return H(i) ? (e.enter("lineEnding"), e.consume(i), e.exit("lineEnding"), n = !0, r) : W(i) ? Q(e, r, n ? "linePrefix" : "lineSuffix")(i) : t(i);
  }
}
const Qa = {
  name: "definition",
  tokenize: Ga
}, Ja = {
  partial: !0,
  tokenize: Ka
};
function Ga(e, t, n) {
  const r = this;
  let i;
  return o;
  function o(h) {
    return e.enter("definition"), l(h);
  }
  function l(h) {
    return Ai.call(
      r,
      e,
      a,
      // Note: we don’t need to reset the way `markdown-rs` does.
      n,
      "definitionLabel",
      "definitionLabelMarker",
      "definitionLabelString"
    )(h);
  }
  function a(h) {
    return i = Fe(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1)), h === 58 ? (e.enter("definitionMarker"), e.consume(h), e.exit("definitionMarker"), u) : n(h);
  }
  function u(h) {
    return te(h) ? ht(e, s)(h) : s(h);
  }
  function s(h) {
    return Ei(
      e,
      f,
      // Note: we don’t need to reset the way `markdown-rs` does.
      n,
      "definitionDestination",
      "definitionDestinationLiteral",
      "definitionDestinationLiteralMarker",
      "definitionDestinationRaw",
      "definitionDestinationString"
    )(h);
  }
  function f(h) {
    return e.attempt(Ja, c, c)(h);
  }
  function c(h) {
    return W(h) ? Q(e, p, "whitespace")(h) : p(h);
  }
  function p(h) {
    return h === null || H(h) ? (e.exit("definition"), r.parser.defined.push(i), t(h)) : n(h);
  }
}
function Ka(e, t, n) {
  return r;
  function r(a) {
    return te(a) ? ht(e, i)(a) : n(a);
  }
  function i(a) {
    return Ii(e, o, n, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(a);
  }
  function o(a) {
    return W(a) ? Q(e, l, "whitespace")(a) : l(a);
  }
  function l(a) {
    return a === null || H(a) ? t(a) : n(a);
  }
}
const es = {
  name: "hardBreakEscape",
  tokenize: ts
};
function ts(e, t, n) {
  return r;
  function r(o) {
    return e.enter("hardBreakEscape"), e.consume(o), i;
  }
  function i(o) {
    return H(o) ? (e.exit("hardBreakEscape"), t(o)) : n(o);
  }
}
const ns = {
  name: "headingAtx",
  resolve: rs,
  tokenize: is
};
function rs(e, t) {
  let n = e.length - 2, r = 3, i, o;
  return e[r][1].type === "whitespace" && (r += 2), n - 2 > r && e[n][1].type === "whitespace" && (n -= 2), e[n][1].type === "atxHeadingSequence" && (r === n - 1 || n - 4 > r && e[n - 2][1].type === "whitespace") && (n -= r + 1 === n ? 2 : 4), n > r && (i = {
    type: "atxHeadingText",
    start: e[r][1].start,
    end: e[n][1].end
  }, o = {
    type: "chunkText",
    start: e[r][1].start,
    end: e[n][1].end,
    contentType: "text"
  }, Ce(e, r, n - r + 1, [["enter", i, t], ["enter", o, t], ["exit", o, t], ["exit", i, t]])), e;
}
function is(e, t, n) {
  let r = 0;
  return i;
  function i(f) {
    return e.enter("atxHeading"), o(f);
  }
  function o(f) {
    return e.enter("atxHeadingSequence"), l(f);
  }
  function l(f) {
    return f === 35 && r++ < 6 ? (e.consume(f), l) : f === null || te(f) ? (e.exit("atxHeadingSequence"), a(f)) : n(f);
  }
  function a(f) {
    return f === 35 ? (e.enter("atxHeadingSequence"), u(f)) : f === null || H(f) ? (e.exit("atxHeading"), t(f)) : W(f) ? Q(e, a, "whitespace")(f) : (e.enter("atxHeadingText"), s(f));
  }
  function u(f) {
    return f === 35 ? (e.consume(f), u) : (e.exit("atxHeadingSequence"), a(f));
  }
  function s(f) {
    return f === null || f === 35 || te(f) ? (e.exit("atxHeadingText"), a(f)) : (e.consume(f), s);
  }
}
const ls = [
  "address",
  "article",
  "aside",
  "base",
  "basefont",
  "blockquote",
  "body",
  "caption",
  "center",
  "col",
  "colgroup",
  "dd",
  "details",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "iframe",
  "legend",
  "li",
  "link",
  "main",
  "menu",
  "menuitem",
  "nav",
  "noframes",
  "ol",
  "optgroup",
  "option",
  "p",
  "param",
  "search",
  "section",
  "summary",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "title",
  "tr",
  "track",
  "ul"
], Ar = ["pre", "script", "style", "textarea"], os = {
  concrete: !0,
  name: "htmlFlow",
  resolveTo: us,
  tokenize: cs
}, as = {
  partial: !0,
  tokenize: hs
}, ss = {
  partial: !0,
  tokenize: fs
};
function us(e) {
  let t = e.length;
  for (; t-- && !(e[t][0] === "enter" && e[t][1].type === "htmlFlow"); )
    ;
  return t > 1 && e[t - 2][1].type === "linePrefix" && (e[t][1].start = e[t - 2][1].start, e[t + 1][1].start = e[t - 2][1].start, e.splice(t - 2, 2)), e;
}
function cs(e, t, n) {
  const r = this;
  let i, o, l, a, u;
  return s;
  function s(m) {
    return f(m);
  }
  function f(m) {
    return e.enter("htmlFlow"), e.enter("htmlFlowData"), e.consume(m), c;
  }
  function c(m) {
    return m === 33 ? (e.consume(m), p) : m === 47 ? (e.consume(m), o = !0, k) : m === 63 ? (e.consume(m), i = 3, r.interrupt ? t : d) : de(m) ? (e.consume(m), l = String.fromCharCode(m), S) : n(m);
  }
  function p(m) {
    return m === 45 ? (e.consume(m), i = 2, h) : m === 91 ? (e.consume(m), i = 5, a = 0, g) : de(m) ? (e.consume(m), i = 4, r.interrupt ? t : d) : n(m);
  }
  function h(m) {
    return m === 45 ? (e.consume(m), r.interrupt ? t : d) : n(m);
  }
  function g(m) {
    const G = "CDATA[";
    return m === G.charCodeAt(a++) ? (e.consume(m), a === G.length ? r.interrupt ? t : z : g) : n(m);
  }
  function k(m) {
    return de(m) ? (e.consume(m), l = String.fromCharCode(m), S) : n(m);
  }
  function S(m) {
    if (m === null || m === 47 || m === 62 || te(m)) {
      const G = m === 47, ae = l.toLowerCase();
      return !G && !o && Ar.includes(ae) ? (i = 1, r.interrupt ? t(m) : z(m)) : ls.includes(l.toLowerCase()) ? (i = 6, G ? (e.consume(m), x) : r.interrupt ? t(m) : z(m)) : (i = 7, r.interrupt && !r.parser.lazy[r.now().line] ? n(m) : o ? v(m) : E(m));
    }
    return m === 45 || fe(m) ? (e.consume(m), l += String.fromCharCode(m), S) : n(m);
  }
  function x(m) {
    return m === 62 ? (e.consume(m), r.interrupt ? t : z) : n(m);
  }
  function v(m) {
    return W(m) ? (e.consume(m), v) : b(m);
  }
  function E(m) {
    return m === 47 ? (e.consume(m), b) : m === 58 || m === 95 || de(m) ? (e.consume(m), R) : W(m) ? (e.consume(m), E) : b(m);
  }
  function R(m) {
    return m === 45 || m === 46 || m === 58 || m === 95 || fe(m) ? (e.consume(m), R) : N(m);
  }
  function N(m) {
    return m === 61 ? (e.consume(m), w) : W(m) ? (e.consume(m), N) : E(m);
  }
  function w(m) {
    return m === null || m === 60 || m === 61 || m === 62 || m === 96 ? n(m) : m === 34 || m === 39 ? (e.consume(m), u = m, P) : W(m) ? (e.consume(m), w) : L(m);
  }
  function P(m) {
    return m === u ? (e.consume(m), u = null, V) : m === null || H(m) ? n(m) : (e.consume(m), P);
  }
  function L(m) {
    return m === null || m === 34 || m === 39 || m === 47 || m === 60 || m === 61 || m === 62 || m === 96 || te(m) ? N(m) : (e.consume(m), L);
  }
  function V(m) {
    return m === 47 || m === 62 || W(m) ? E(m) : n(m);
  }
  function b(m) {
    return m === 62 ? (e.consume(m), F) : n(m);
  }
  function F(m) {
    return m === null || H(m) ? z(m) : W(m) ? (e.consume(m), F) : n(m);
  }
  function z(m) {
    return m === 45 && i === 2 ? (e.consume(m), Z) : m === 60 && i === 1 ? (e.consume(m), J) : m === 62 && i === 4 ? (e.consume(m), _) : m === 63 && i === 3 ? (e.consume(m), d) : m === 93 && i === 5 ? (e.consume(m), X) : H(m) && (i === 6 || i === 7) ? (e.exit("htmlFlowData"), e.check(as, Y, D)(m)) : m === null || H(m) ? (e.exit("htmlFlowData"), D(m)) : (e.consume(m), z);
  }
  function D(m) {
    return e.check(ss, A, Y)(m);
  }
  function A(m) {
    return e.enter("lineEnding"), e.consume(m), e.exit("lineEnding"), O;
  }
  function O(m) {
    return m === null || H(m) ? D(m) : (e.enter("htmlFlowData"), z(m));
  }
  function Z(m) {
    return m === 45 ? (e.consume(m), d) : z(m);
  }
  function J(m) {
    return m === 47 ? (e.consume(m), l = "", q) : z(m);
  }
  function q(m) {
    if (m === 62) {
      const G = l.toLowerCase();
      return Ar.includes(G) ? (e.consume(m), _) : z(m);
    }
    return de(m) && l.length < 8 ? (e.consume(m), l += String.fromCharCode(m), q) : z(m);
  }
  function X(m) {
    return m === 93 ? (e.consume(m), d) : z(m);
  }
  function d(m) {
    return m === 62 ? (e.consume(m), _) : m === 45 && i === 2 ? (e.consume(m), d) : z(m);
  }
  function _(m) {
    return m === null || H(m) ? (e.exit("htmlFlowData"), Y(m)) : (e.consume(m), _);
  }
  function Y(m) {
    return e.exit("htmlFlow"), t(m);
  }
}
function fs(e, t, n) {
  const r = this;
  return i;
  function i(l) {
    return H(l) ? (e.enter("lineEnding"), e.consume(l), e.exit("lineEnding"), o) : n(l);
  }
  function o(l) {
    return r.parser.lazy[r.now().line] ? n(l) : t(l);
  }
}
function hs(e, t, n) {
  return r;
  function r(i) {
    return e.enter("lineEnding"), e.consume(i), e.exit("lineEnding"), e.attempt(yt, t, n);
  }
}
const ps = {
  name: "htmlText",
  tokenize: ms
};
function ms(e, t, n) {
  const r = this;
  let i, o, l;
  return a;
  function a(d) {
    return e.enter("htmlText"), e.enter("htmlTextData"), e.consume(d), u;
  }
  function u(d) {
    return d === 33 ? (e.consume(d), s) : d === 47 ? (e.consume(d), N) : d === 63 ? (e.consume(d), E) : de(d) ? (e.consume(d), L) : n(d);
  }
  function s(d) {
    return d === 45 ? (e.consume(d), f) : d === 91 ? (e.consume(d), o = 0, g) : de(d) ? (e.consume(d), v) : n(d);
  }
  function f(d) {
    return d === 45 ? (e.consume(d), h) : n(d);
  }
  function c(d) {
    return d === null ? n(d) : d === 45 ? (e.consume(d), p) : H(d) ? (l = c, J(d)) : (e.consume(d), c);
  }
  function p(d) {
    return d === 45 ? (e.consume(d), h) : c(d);
  }
  function h(d) {
    return d === 62 ? Z(d) : d === 45 ? p(d) : c(d);
  }
  function g(d) {
    const _ = "CDATA[";
    return d === _.charCodeAt(o++) ? (e.consume(d), o === _.length ? k : g) : n(d);
  }
  function k(d) {
    return d === null ? n(d) : d === 93 ? (e.consume(d), S) : H(d) ? (l = k, J(d)) : (e.consume(d), k);
  }
  function S(d) {
    return d === 93 ? (e.consume(d), x) : k(d);
  }
  function x(d) {
    return d === 62 ? Z(d) : d === 93 ? (e.consume(d), x) : k(d);
  }
  function v(d) {
    return d === null || d === 62 ? Z(d) : H(d) ? (l = v, J(d)) : (e.consume(d), v);
  }
  function E(d) {
    return d === null ? n(d) : d === 63 ? (e.consume(d), R) : H(d) ? (l = E, J(d)) : (e.consume(d), E);
  }
  function R(d) {
    return d === 62 ? Z(d) : E(d);
  }
  function N(d) {
    return de(d) ? (e.consume(d), w) : n(d);
  }
  function w(d) {
    return d === 45 || fe(d) ? (e.consume(d), w) : P(d);
  }
  function P(d) {
    return H(d) ? (l = P, J(d)) : W(d) ? (e.consume(d), P) : Z(d);
  }
  function L(d) {
    return d === 45 || fe(d) ? (e.consume(d), L) : d === 47 || d === 62 || te(d) ? V(d) : n(d);
  }
  function V(d) {
    return d === 47 ? (e.consume(d), Z) : d === 58 || d === 95 || de(d) ? (e.consume(d), b) : H(d) ? (l = V, J(d)) : W(d) ? (e.consume(d), V) : Z(d);
  }
  function b(d) {
    return d === 45 || d === 46 || d === 58 || d === 95 || fe(d) ? (e.consume(d), b) : F(d);
  }
  function F(d) {
    return d === 61 ? (e.consume(d), z) : H(d) ? (l = F, J(d)) : W(d) ? (e.consume(d), F) : V(d);
  }
  function z(d) {
    return d === null || d === 60 || d === 61 || d === 62 || d === 96 ? n(d) : d === 34 || d === 39 ? (e.consume(d), i = d, D) : H(d) ? (l = z, J(d)) : W(d) ? (e.consume(d), z) : (e.consume(d), A);
  }
  function D(d) {
    return d === i ? (e.consume(d), i = void 0, O) : d === null ? n(d) : H(d) ? (l = D, J(d)) : (e.consume(d), D);
  }
  function A(d) {
    return d === null || d === 34 || d === 39 || d === 60 || d === 61 || d === 96 ? n(d) : d === 47 || d === 62 || te(d) ? V(d) : (e.consume(d), A);
  }
  function O(d) {
    return d === 47 || d === 62 || te(d) ? V(d) : n(d);
  }
  function Z(d) {
    return d === 62 ? (e.consume(d), e.exit("htmlTextData"), e.exit("htmlText"), t) : n(d);
  }
  function J(d) {
    return e.exit("htmlTextData"), e.enter("lineEnding"), e.consume(d), e.exit("lineEnding"), q;
  }
  function q(d) {
    return W(d) ? Q(e, X, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(d) : X(d);
  }
  function X(d) {
    return e.enter("htmlTextData"), l(d);
  }
}
const Hn = {
  name: "labelEnd",
  resolveAll: xs,
  resolveTo: ks,
  tokenize: bs
}, ds = {
  tokenize: ws
}, gs = {
  tokenize: Cs
}, ys = {
  tokenize: vs
};
function xs(e) {
  let t = -1;
  const n = [];
  for (; ++t < e.length; ) {
    const r = e[t][1];
    if (n.push(e[t]), r.type === "labelImage" || r.type === "labelLink" || r.type === "labelEnd") {
      const i = r.type === "labelImage" ? 4 : 2;
      r.type = "data", t += i;
    }
  }
  return e.length !== n.length && Ce(e, 0, e.length, n), e;
}
function ks(e, t) {
  let n = e.length, r = 0, i, o, l, a;
  for (; n--; )
    if (i = e[n][1], o) {
      if (i.type === "link" || i.type === "labelLink" && i._inactive)
        break;
      e[n][0] === "enter" && i.type === "labelLink" && (i._inactive = !0);
    } else if (l) {
      if (e[n][0] === "enter" && (i.type === "labelImage" || i.type === "labelLink") && !i._balanced && (o = n, i.type !== "labelLink")) {
        r = 2;
        break;
      }
    } else i.type === "labelEnd" && (l = n);
  const u = {
    type: e[o][1].type === "labelLink" ? "link" : "image",
    start: {
      ...e[o][1].start
    },
    end: {
      ...e[e.length - 1][1].end
    }
  }, s = {
    type: "label",
    start: {
      ...e[o][1].start
    },
    end: {
      ...e[l][1].end
    }
  }, f = {
    type: "labelText",
    start: {
      ...e[o + r + 2][1].end
    },
    end: {
      ...e[l - 2][1].start
    }
  };
  return a = [["enter", u, t], ["enter", s, t]], a = Se(a, e.slice(o + 1, o + r + 3)), a = Se(a, [["enter", f, t]]), a = Se(a, _t(t.parser.constructs.insideSpan.null, e.slice(o + r + 4, l - 3), t)), a = Se(a, [["exit", f, t], e[l - 2], e[l - 1], ["exit", s, t]]), a = Se(a, e.slice(l + 1)), a = Se(a, [["exit", u, t]]), Ce(e, o, e.length, a), e;
}
function bs(e, t, n) {
  const r = this;
  let i = r.events.length, o, l;
  for (; i--; )
    if ((r.events[i][1].type === "labelImage" || r.events[i][1].type === "labelLink") && !r.events[i][1]._balanced) {
      o = r.events[i][1];
      break;
    }
  return a;
  function a(p) {
    return o ? o._inactive ? c(p) : (l = r.parser.defined.includes(Fe(r.sliceSerialize({
      start: o.end,
      end: r.now()
    }))), e.enter("labelEnd"), e.enter("labelMarker"), e.consume(p), e.exit("labelMarker"), e.exit("labelEnd"), u) : n(p);
  }
  function u(p) {
    return p === 40 ? e.attempt(ds, f, l ? f : c)(p) : p === 91 ? e.attempt(gs, f, l ? s : c)(p) : l ? f(p) : c(p);
  }
  function s(p) {
    return e.attempt(ys, f, c)(p);
  }
  function f(p) {
    return t(p);
  }
  function c(p) {
    return o._balanced = !0, n(p);
  }
}
function ws(e, t, n) {
  return r;
  function r(c) {
    return e.enter("resource"), e.enter("resourceMarker"), e.consume(c), e.exit("resourceMarker"), i;
  }
  function i(c) {
    return te(c) ? ht(e, o)(c) : o(c);
  }
  function o(c) {
    return c === 41 ? f(c) : Ei(e, l, a, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(c);
  }
  function l(c) {
    return te(c) ? ht(e, u)(c) : f(c);
  }
  function a(c) {
    return n(c);
  }
  function u(c) {
    return c === 34 || c === 39 || c === 40 ? Ii(e, s, n, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(c) : f(c);
  }
  function s(c) {
    return te(c) ? ht(e, f)(c) : f(c);
  }
  function f(c) {
    return c === 41 ? (e.enter("resourceMarker"), e.consume(c), e.exit("resourceMarker"), e.exit("resource"), t) : n(c);
  }
}
function Cs(e, t, n) {
  const r = this;
  return i;
  function i(a) {
    return Ai.call(r, e, o, l, "reference", "referenceMarker", "referenceString")(a);
  }
  function o(a) {
    return r.parser.defined.includes(Fe(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1))) ? t(a) : n(a);
  }
  function l(a) {
    return n(a);
  }
}
function vs(e, t, n) {
  return r;
  function r(o) {
    return e.enter("reference"), e.enter("referenceMarker"), e.consume(o), e.exit("referenceMarker"), i;
  }
  function i(o) {
    return o === 93 ? (e.enter("referenceMarker"), e.consume(o), e.exit("referenceMarker"), e.exit("reference"), t) : n(o);
  }
}
const Ss = {
  name: "labelStartImage",
  resolveAll: Hn.resolveAll,
  tokenize: Es
};
function Es(e, t, n) {
  const r = this;
  return i;
  function i(a) {
    return e.enter("labelImage"), e.enter("labelImageMarker"), e.consume(a), e.exit("labelImageMarker"), o;
  }
  function o(a) {
    return a === 91 ? (e.enter("labelMarker"), e.consume(a), e.exit("labelMarker"), e.exit("labelImage"), l) : n(a);
  }
  function l(a) {
    return a === 94 && "_hiddenFootnoteSupport" in r.parser.constructs ? n(a) : t(a);
  }
}
const As = {
  name: "labelStartLink",
  resolveAll: Hn.resolveAll,
  tokenize: Is
};
function Is(e, t, n) {
  const r = this;
  return i;
  function i(l) {
    return e.enter("labelLink"), e.enter("labelMarker"), e.consume(l), e.exit("labelMarker"), e.exit("labelLink"), o;
  }
  function o(l) {
    return l === 94 && "_hiddenFootnoteSupport" in r.parser.constructs ? n(l) : t(l);
  }
}
const tn = {
  name: "lineEnding",
  tokenize: Ts
};
function Ts(e, t) {
  return n;
  function n(r) {
    return e.enter("lineEnding"), e.consume(r), e.exit("lineEnding"), Q(e, t, "linePrefix");
  }
}
const Ft = {
  name: "thematicBreak",
  tokenize: Ms
};
function Ms(e, t, n) {
  let r = 0, i;
  return o;
  function o(s) {
    return e.enter("thematicBreak"), l(s);
  }
  function l(s) {
    return i = s, a(s);
  }
  function a(s) {
    return s === i ? (e.enter("thematicBreakSequence"), u(s)) : r >= 3 && (s === null || H(s)) ? (e.exit("thematicBreak"), t(s)) : n(s);
  }
  function u(s) {
    return s === i ? (e.consume(s), r++, u) : (e.exit("thematicBreakSequence"), W(s) ? Q(e, a, "whitespace")(s) : a(s));
  }
}
const ge = {
  continuation: {
    tokenize: zs
  },
  exit: Rs,
  name: "list",
  tokenize: Ps
}, Fs = {
  partial: !0,
  tokenize: Ns
}, Ls = {
  partial: !0,
  tokenize: Ds
};
function Ps(e, t, n) {
  const r = this, i = r.events[r.events.length - 1];
  let o = i && i[1].type === "linePrefix" ? i[2].sliceSerialize(i[1], !0).length : 0, l = 0;
  return a;
  function a(h) {
    const g = r.containerState.type || (h === 42 || h === 43 || h === 45 ? "listUnordered" : "listOrdered");
    if (g === "listUnordered" ? !r.containerState.marker || h === r.containerState.marker : wn(h)) {
      if (r.containerState.type || (r.containerState.type = g, e.enter(g, {
        _container: !0
      })), g === "listUnordered")
        return e.enter("listItemPrefix"), h === 42 || h === 45 ? e.check(Ft, n, s)(h) : s(h);
      if (!r.interrupt || h === 49)
        return e.enter("listItemPrefix"), e.enter("listItemValue"), u(h);
    }
    return n(h);
  }
  function u(h) {
    return wn(h) && ++l < 10 ? (e.consume(h), u) : (!r.interrupt || l < 2) && (r.containerState.marker ? h === r.containerState.marker : h === 41 || h === 46) ? (e.exit("listItemValue"), s(h)) : n(h);
  }
  function s(h) {
    return e.enter("listItemMarker"), e.consume(h), e.exit("listItemMarker"), r.containerState.marker = r.containerState.marker || h, e.check(
      yt,
      // Can’t be empty when interrupting.
      r.interrupt ? n : f,
      e.attempt(Fs, p, c)
    );
  }
  function f(h) {
    return r.containerState.initialBlankLine = !0, o++, p(h);
  }
  function c(h) {
    return W(h) ? (e.enter("listItemPrefixWhitespace"), e.consume(h), e.exit("listItemPrefixWhitespace"), p) : n(h);
  }
  function p(h) {
    return r.containerState.size = o + r.sliceSerialize(e.exit("listItemPrefix"), !0).length, t(h);
  }
}
function zs(e, t, n) {
  const r = this;
  return r.containerState._closeFlow = void 0, e.check(yt, i, o);
  function i(a) {
    return r.containerState.furtherBlankLines = r.containerState.furtherBlankLines || r.containerState.initialBlankLine, Q(e, t, "listItemIndent", r.containerState.size + 1)(a);
  }
  function o(a) {
    return r.containerState.furtherBlankLines || !W(a) ? (r.containerState.furtherBlankLines = void 0, r.containerState.initialBlankLine = void 0, l(a)) : (r.containerState.furtherBlankLines = void 0, r.containerState.initialBlankLine = void 0, e.attempt(Ls, t, l)(a));
  }
  function l(a) {
    return r.containerState._closeFlow = !0, r.interrupt = void 0, Q(e, e.attempt(ge, t, n), "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(a);
  }
}
function Ds(e, t, n) {
  const r = this;
  return Q(e, i, "listItemIndent", r.containerState.size + 1);
  function i(o) {
    const l = r.events[r.events.length - 1];
    return l && l[1].type === "listItemIndent" && l[2].sliceSerialize(l[1], !0).length === r.containerState.size ? t(o) : n(o);
  }
}
function Rs(e) {
  e.exit(this.containerState.type);
}
function Ns(e, t, n) {
  const r = this;
  return Q(e, i, "listItemPrefixWhitespace", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 5);
  function i(o) {
    const l = r.events[r.events.length - 1];
    return !W(o) && l && l[1].type === "listItemPrefixWhitespace" ? t(o) : n(o);
  }
}
const Ir = {
  name: "setextUnderline",
  resolveTo: Os,
  tokenize: _s
};
function Os(e, t) {
  let n = e.length, r, i, o;
  for (; n--; )
    if (e[n][0] === "enter") {
      if (e[n][1].type === "content") {
        r = n;
        break;
      }
      e[n][1].type === "paragraph" && (i = n);
    } else
      e[n][1].type === "content" && e.splice(n, 1), !o && e[n][1].type === "definition" && (o = n);
  const l = {
    type: "setextHeading",
    start: {
      ...e[r][1].start
    },
    end: {
      ...e[e.length - 1][1].end
    }
  };
  return e[i][1].type = "setextHeadingText", o ? (e.splice(i, 0, ["enter", l, t]), e.splice(o + 1, 0, ["exit", e[r][1], t]), e[r][1].end = {
    ...e[o][1].end
  }) : e[r][1] = l, e.push(["exit", l, t]), e;
}
function _s(e, t, n) {
  const r = this;
  let i;
  return o;
  function o(s) {
    let f = r.events.length, c;
    for (; f--; )
      if (r.events[f][1].type !== "lineEnding" && r.events[f][1].type !== "linePrefix" && r.events[f][1].type !== "content") {
        c = r.events[f][1].type === "paragraph";
        break;
      }
    return !r.parser.lazy[r.now().line] && (r.interrupt || c) ? (e.enter("setextHeadingLine"), i = s, l(s)) : n(s);
  }
  function l(s) {
    return e.enter("setextHeadingLineSequence"), a(s);
  }
  function a(s) {
    return s === i ? (e.consume(s), a) : (e.exit("setextHeadingLineSequence"), W(s) ? Q(e, u, "lineSuffix")(s) : u(s));
  }
  function u(s) {
    return s === null || H(s) ? (e.exit("setextHeadingLine"), t(s)) : n(s);
  }
}
const Bs = {
  tokenize: Vs
};
function Vs(e) {
  const t = this, n = e.attempt(
    // Try to parse a blank line.
    yt,
    r,
    // Try to parse initial flow (essentially, only code).
    e.attempt(this.parser.constructs.flowInitial, i, Q(e, e.attempt(this.parser.constructs.flow, i, e.attempt(Ua, i)), "linePrefix"))
  );
  return n;
  function r(o) {
    if (o === null) {
      e.consume(o);
      return;
    }
    return e.enter("lineEndingBlank"), e.consume(o), e.exit("lineEndingBlank"), t.currentConstruct = void 0, n;
  }
  function i(o) {
    if (o === null) {
      e.consume(o);
      return;
    }
    return e.enter("lineEnding"), e.consume(o), e.exit("lineEnding"), t.currentConstruct = void 0, n;
  }
}
const Hs = {
  resolveAll: Mi()
}, js = Ti("string"), Zs = Ti("text");
function Ti(e) {
  return {
    resolveAll: Mi(e === "text" ? $s : void 0),
    tokenize: t
  };
  function t(n) {
    const r = this, i = this.parser.constructs[e], o = n.attempt(i, l, a);
    return l;
    function l(f) {
      return s(f) ? o(f) : a(f);
    }
    function a(f) {
      if (f === null) {
        n.consume(f);
        return;
      }
      return n.enter("data"), n.consume(f), u;
    }
    function u(f) {
      return s(f) ? (n.exit("data"), o(f)) : (n.consume(f), u);
    }
    function s(f) {
      if (f === null)
        return !0;
      const c = i[f];
      let p = -1;
      if (c)
        for (; ++p < c.length; ) {
          const h = c[p];
          if (!h.previous || h.previous.call(r, r.previous))
            return !0;
        }
      return !1;
    }
  }
}
function Mi(e) {
  return t;
  function t(n, r) {
    let i = -1, o;
    for (; ++i <= n.length; )
      o === void 0 ? n[i] && n[i][1].type === "data" && (o = i, i++) : (!n[i] || n[i][1].type !== "data") && (i !== o + 2 && (n[o][1].end = n[i - 1][1].end, n.splice(o + 2, i - o - 2), i = o + 2), o = void 0);
    return e ? e(n, r) : n;
  }
}
function $s(e, t) {
  let n = 0;
  for (; ++n <= e.length; )
    if ((n === e.length || e[n][1].type === "lineEnding") && e[n - 1][1].type === "data") {
      const r = e[n - 1][1], i = t.sliceStream(r);
      let o = i.length, l = -1, a = 0, u;
      for (; o--; ) {
        const s = i[o];
        if (typeof s == "string") {
          for (l = s.length; s.charCodeAt(l - 1) === 32; )
            a++, l--;
          if (l) break;
          l = -1;
        } else if (s === -2)
          u = !0, a++;
        else if (s !== -1) {
          o++;
          break;
        }
      }
      if (t._contentTypeTextTrailing && n === e.length && (a = 0), a) {
        const s = {
          type: n === e.length || u || a < 2 ? "lineSuffix" : "hardBreakTrailing",
          start: {
            _bufferIndex: o ? l : r.start._bufferIndex + l,
            _index: r.start._index + o,
            line: r.end.line,
            column: r.end.column - a,
            offset: r.end.offset - a
          },
          end: {
            ...r.end
          }
        };
        r.end = {
          ...s.start
        }, r.start.offset === r.end.offset ? Object.assign(r, s) : (e.splice(n, 0, ["enter", s, t], ["exit", s, t]), n += 2);
      }
      n++;
    }
  return e;
}
const Us = {
  42: ge,
  43: ge,
  45: ge,
  48: ge,
  49: ge,
  50: ge,
  51: ge,
  52: ge,
  53: ge,
  54: ge,
  55: ge,
  56: ge,
  57: ge,
  62: wi
}, qs = {
  91: Qa
}, Ws = {
  [-2]: en,
  [-1]: en,
  32: en
}, Xs = {
  35: ns,
  42: Ft,
  45: [Ir, Ft],
  60: os,
  61: Ir,
  95: Ft,
  96: Er,
  126: Er
}, Ys = {
  38: vi,
  92: Ci
}, Qs = {
  [-5]: tn,
  [-4]: tn,
  [-3]: tn,
  33: Ss,
  38: vi,
  42: Cn,
  60: [Aa, ps],
  91: As,
  92: [es, Ci],
  93: Hn,
  95: Cn,
  96: Ba
}, Js = {
  null: [Cn, Hs]
}, Gs = {
  null: [42, 95]
}, Ks = {
  null: []
}, eu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  attentionMarkers: Gs,
  contentInitial: qs,
  disable: Ks,
  document: Us,
  flow: Xs,
  flowInitial: Ws,
  insideSpan: Js,
  string: Ys,
  text: Qs
}, Symbol.toStringTag, { value: "Module" }));
function tu(e, t, n) {
  let r = {
    _bufferIndex: -1,
    _index: 0,
    line: n && n.line || 1,
    column: n && n.column || 1,
    offset: n && n.offset || 0
  };
  const i = {}, o = [];
  let l = [], a = [];
  const u = {
    attempt: P(N),
    check: P(w),
    consume: v,
    enter: E,
    exit: R,
    interrupt: P(w, {
      interrupt: !0
    })
  }, s = {
    code: null,
    containerState: {},
    defineSkip: k,
    events: [],
    now: g,
    parser: e,
    previous: null,
    sliceSerialize: p,
    sliceStream: h,
    write: c
  };
  let f = t.tokenize.call(s, u);
  return t.resolveAll && o.push(t), s;
  function c(F) {
    return l = Se(l, F), S(), l[l.length - 1] !== null ? [] : (L(t, 0), s.events = _t(o, s.events, s), s.events);
  }
  function p(F, z) {
    return ru(h(F), z);
  }
  function h(F) {
    return nu(l, F);
  }
  function g() {
    const {
      _bufferIndex: F,
      _index: z,
      line: D,
      column: A,
      offset: O
    } = r;
    return {
      _bufferIndex: F,
      _index: z,
      line: D,
      column: A,
      offset: O
    };
  }
  function k(F) {
    i[F.line] = F.column, b();
  }
  function S() {
    let F;
    for (; r._index < l.length; ) {
      const z = l[r._index];
      if (typeof z == "string")
        for (F = r._index, r._bufferIndex < 0 && (r._bufferIndex = 0); r._index === F && r._bufferIndex < z.length; )
          x(z.charCodeAt(r._bufferIndex));
      else
        x(z);
    }
  }
  function x(F) {
    f = f(F);
  }
  function v(F) {
    H(F) ? (r.line++, r.column = 1, r.offset += F === -3 ? 2 : 1, b()) : F !== -1 && (r.column++, r.offset++), r._bufferIndex < 0 ? r._index++ : (r._bufferIndex++, r._bufferIndex === // Points w/ non-negative `_bufferIndex` reference
    // strings.
    /** @type {string} */
    l[r._index].length && (r._bufferIndex = -1, r._index++)), s.previous = F;
  }
  function E(F, z) {
    const D = z || {};
    return D.type = F, D.start = g(), s.events.push(["enter", D, s]), a.push(D), D;
  }
  function R(F) {
    const z = a.pop();
    return z.end = g(), s.events.push(["exit", z, s]), z;
  }
  function N(F, z) {
    L(F, z.from);
  }
  function w(F, z) {
    z.restore();
  }
  function P(F, z) {
    return D;
    function D(A, O, Z) {
      let J, q, X, d;
      return Array.isArray(A) ? (
        /* c8 ignore next 1 */
        Y(A)
      ) : "tokenize" in A ? (
        // Looks like a construct.
        Y([
          /** @type {Construct} */
          A
        ])
      ) : _(A);
      function _(K) {
        return pe;
        function pe(le) {
          const ve = le !== null && K[le], ke = le !== null && K.null, Ee = [
            // To do: add more extension tests.
            /* c8 ignore next 2 */
            ...Array.isArray(ve) ? ve : ve ? [ve] : [],
            ...Array.isArray(ke) ? ke : ke ? [ke] : []
          ];
          return Y(Ee)(le);
        }
      }
      function Y(K) {
        return J = K, q = 0, K.length === 0 ? Z : m(K[q]);
      }
      function m(K) {
        return pe;
        function pe(le) {
          return d = V(), X = K, K.partial || (s.currentConstruct = K), K.name && s.parser.constructs.disable.null.includes(K.name) ? ae() : K.tokenize.call(
            // If we do have fields, create an object w/ `context` as its
            // prototype.
            // This allows a “live binding”, which is needed for `interrupt`.
            z ? Object.assign(Object.create(s), z) : s,
            u,
            G,
            ae
          )(le);
        }
      }
      function G(K) {
        return F(X, d), O;
      }
      function ae(K) {
        return d.restore(), ++q < J.length ? m(J[q]) : Z;
      }
    }
  }
  function L(F, z) {
    F.resolveAll && !o.includes(F) && o.push(F), F.resolve && Ce(s.events, z, s.events.length - z, F.resolve(s.events.slice(z), s)), F.resolveTo && (s.events = F.resolveTo(s.events, s));
  }
  function V() {
    const F = g(), z = s.previous, D = s.currentConstruct, A = s.events.length, O = Array.from(a);
    return {
      from: A,
      restore: Z
    };
    function Z() {
      r = F, s.previous = z, s.currentConstruct = D, s.events.length = A, a = O, b();
    }
  }
  function b() {
    r.line in i && r.column < 2 && (r.column = i[r.line], r.offset += i[r.line] - 1);
  }
}
function nu(e, t) {
  const n = t.start._index, r = t.start._bufferIndex, i = t.end._index, o = t.end._bufferIndex;
  let l;
  if (n === i)
    l = [e[n].slice(r, o)];
  else {
    if (l = e.slice(n, i), r > -1) {
      const a = l[0];
      typeof a == "string" ? l[0] = a.slice(r) : l.shift();
    }
    o > 0 && l.push(e[i].slice(0, o));
  }
  return l;
}
function ru(e, t) {
  let n = -1;
  const r = [];
  let i;
  for (; ++n < e.length; ) {
    const o = e[n];
    let l;
    if (typeof o == "string")
      l = o;
    else switch (o) {
      case -5: {
        l = "\r";
        break;
      }
      case -4: {
        l = `
`;
        break;
      }
      case -3: {
        l = `\r
`;
        break;
      }
      case -2: {
        l = t ? " " : "	";
        break;
      }
      case -1: {
        if (!t && i) continue;
        l = " ";
        break;
      }
      default:
        l = String.fromCharCode(o);
    }
    i = o === -2, r.push(l);
  }
  return r.join("");
}
function iu(e) {
  const r = {
    constructs: (
      /** @type {FullNormalizedExtension} */
      ki([eu, ...(e || {}).extensions || []])
    ),
    content: i(ka),
    defined: [],
    document: i(wa),
    flow: i(Bs),
    lazy: {},
    string: i(js),
    text: i(Zs)
  };
  return r;
  function i(o) {
    return l;
    function l(a) {
      return tu(r, o, a);
    }
  }
}
function lu(e) {
  for (; !Si(e); )
    ;
  return e;
}
const Tr = /[\0\t\n\r]/g;
function ou() {
  let e = 1, t = "", n = !0, r;
  return i;
  function i(o, l, a) {
    const u = [];
    let s, f, c, p, h;
    for (o = t + (typeof o == "string" ? o.toString() : new TextDecoder(l || void 0).decode(o)), c = 0, t = "", n && (o.charCodeAt(0) === 65279 && c++, n = void 0); c < o.length; ) {
      if (Tr.lastIndex = c, s = Tr.exec(o), p = s && s.index !== void 0 ? s.index : o.length, h = o.charCodeAt(p), !s) {
        t = o.slice(c);
        break;
      }
      if (h === 10 && c === p && r)
        u.push(-3), r = void 0;
      else
        switch (r && (u.push(-5), r = void 0), c < p && (u.push(o.slice(c, p)), e += p - c), h) {
          case 0: {
            u.push(65533), e++;
            break;
          }
          case 9: {
            for (f = Math.ceil(e / 4) * 4, u.push(-2); e++ < f; ) u.push(-1);
            break;
          }
          case 10: {
            u.push(-4), e = 1;
            break;
          }
          default:
            r = !0, e = 1;
        }
      c = p + 1;
    }
    return a && (r && u.push(-5), t && u.push(t), u.push(null)), u;
  }
}
const au = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
function su(e) {
  return e.replace(au, uu);
}
function uu(e, t, n) {
  if (t)
    return t;
  if (n.charCodeAt(0) === 35) {
    const i = n.charCodeAt(1), o = i === 120 || i === 88;
    return bi(n.slice(o ? 2 : 1), o ? 16 : 10);
  }
  return Vn(n) || e;
}
const Fi = {}.hasOwnProperty;
function cu(e, t, n) {
  return typeof t != "string" && (n = t, t = void 0), fu(n)(lu(iu(n).document().write(ou()(e, t, !0))));
}
function fu(e) {
  const t = {
    transforms: [],
    canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
    enter: {
      autolink: o(Xe),
      autolinkProtocol: V,
      autolinkEmail: V,
      atxHeading: o(bt),
      blockQuote: o(ke),
      characterEscape: V,
      characterReference: V,
      codeFenced: o(Ee),
      codeFencedFenceInfo: l,
      codeFencedFenceMeta: l,
      codeIndented: o(Ee, l),
      codeText: o(Ve, l),
      codeTextData: V,
      data: V,
      codeFlowValue: V,
      definition: o(kt),
      definitionDestinationString: l,
      definitionLabelString: l,
      definitionTitleString: l,
      emphasis: o(jt),
      hardBreakEscape: o(wt),
      hardBreakTrailing: o(wt),
      htmlFlow: o(Ct, l),
      htmlFlowData: V,
      htmlText: o(Ct, l),
      htmlTextData: V,
      image: o(Zt),
      label: l,
      link: o(Xe),
      listItem: o($t),
      listItemValue: p,
      listOrdered: o(Ye, c),
      listUnordered: o(Ye),
      paragraph: o(Ut),
      reference: m,
      referenceString: l,
      resourceDestinationString: l,
      resourceTitleString: l,
      setextHeading: o(bt),
      strong: o(it),
      thematicBreak: o(He)
    },
    exit: {
      atxHeading: u(),
      atxHeadingSequence: N,
      autolink: u(),
      autolinkEmail: ve,
      autolinkProtocol: le,
      blockQuote: u(),
      characterEscapeValue: b,
      characterReferenceMarkerHexadecimal: ae,
      characterReferenceMarkerNumeric: ae,
      characterReferenceValue: K,
      characterReference: pe,
      codeFenced: u(S),
      codeFencedFence: k,
      codeFencedFenceInfo: h,
      codeFencedFenceMeta: g,
      codeFlowValue: b,
      codeIndented: u(x),
      codeText: u(O),
      codeTextData: b,
      data: b,
      definition: u(),
      definitionDestinationString: R,
      definitionLabelString: v,
      definitionTitleString: E,
      emphasis: u(),
      hardBreakEscape: u(z),
      hardBreakTrailing: u(z),
      htmlFlow: u(D),
      htmlFlowData: b,
      htmlText: u(A),
      htmlTextData: b,
      image: u(J),
      label: X,
      labelText: q,
      lineEnding: F,
      link: u(Z),
      listItem: u(),
      listOrdered: u(),
      listUnordered: u(),
      paragraph: u(),
      referenceString: G,
      resourceDestinationString: d,
      resourceTitleString: _,
      resource: Y,
      setextHeading: u(L),
      setextHeadingLineSequence: P,
      setextHeadingText: w,
      strong: u(),
      thematicBreak: u()
    }
  };
  Li(t, (e || {}).mdastExtensions || []);
  const n = {};
  return r;
  function r(C) {
    let M = {
      type: "root",
      children: []
    };
    const j = {
      stack: [M],
      tokenStack: [],
      config: t,
      enter: a,
      exit: s,
      buffer: l,
      resume: f,
      data: n
    }, $ = [];
    let ee = -1;
    for (; ++ee < C.length; )
      if (C[ee][1].type === "listOrdered" || C[ee][1].type === "listUnordered")
        if (C[ee][0] === "enter")
          $.push(ee);
        else {
          const be = $.pop();
          ee = i(C, be, ee);
        }
    for (ee = -1; ++ee < C.length; ) {
      const be = t[C[ee][0]];
      Fi.call(be, C[ee][1].type) && be[C[ee][1].type].call(Object.assign({
        sliceSerialize: C[ee][2].sliceSerialize
      }, j), C[ee][1]);
    }
    if (j.tokenStack.length > 0) {
      const be = j.tokenStack[j.tokenStack.length - 1];
      (be[1] || Mr).call(j, void 0, be[0]);
    }
    for (M.position = {
      start: Oe(C.length > 0 ? C[0][1].start : {
        line: 1,
        column: 1,
        offset: 0
      }),
      end: Oe(C.length > 0 ? C[C.length - 2][1].end : {
        line: 1,
        column: 1,
        offset: 0
      })
    }, ee = -1; ++ee < t.transforms.length; )
      M = t.transforms[ee](M) || M;
    return M;
  }
  function i(C, M, j) {
    let $ = M - 1, ee = -1, be = !1, Ae, Ie, je, Ze;
    for (; ++$ <= j; ) {
      const se = C[$];
      switch (se[1].type) {
        case "listUnordered":
        case "listOrdered":
        case "blockQuote": {
          se[0] === "enter" ? ee++ : ee--, Ze = void 0;
          break;
        }
        case "lineEndingBlank": {
          se[0] === "enter" && (Ae && !Ze && !ee && !je && (je = $), Ze = void 0);
          break;
        }
        case "linePrefix":
        case "listItemValue":
        case "listItemMarker":
        case "listItemPrefix":
        case "listItemPrefixWhitespace":
          break;
        default:
          Ze = void 0;
      }
      if (!ee && se[0] === "enter" && se[1].type === "listItemPrefix" || ee === -1 && se[0] === "exit" && (se[1].type === "listUnordered" || se[1].type === "listOrdered")) {
        if (Ae) {
          let Ne = $;
          for (Ie = void 0; Ne--; ) {
            const Te = C[Ne];
            if (Te[1].type === "lineEnding" || Te[1].type === "lineEndingBlank") {
              if (Te[0] === "exit") continue;
              Ie && (C[Ie][1].type = "lineEndingBlank", be = !0), Te[1].type = "lineEnding", Ie = Ne;
            } else if (!(Te[1].type === "linePrefix" || Te[1].type === "blockQuotePrefix" || Te[1].type === "blockQuotePrefixWhitespace" || Te[1].type === "blockQuoteMarker" || Te[1].type === "listItemIndent")) break;
          }
          je && (!Ie || je < Ie) && (Ae._spread = !0), Ae.end = Object.assign({}, Ie ? C[Ie][1].start : se[1].end), C.splice(Ie || $, 0, ["exit", Ae, se[2]]), $++, j++;
        }
        if (se[1].type === "listItemPrefix") {
          const Ne = {
            type: "listItem",
            _spread: !1,
            start: Object.assign({}, se[1].start),
            // @ts-expect-error: we’ll add `end` in a second.
            end: void 0
          };
          Ae = Ne, C.splice($, 0, ["enter", Ne, se[2]]), $++, j++, je = void 0, Ze = !0;
        }
      }
    }
    return C[M][1]._spread = be, j;
  }
  function o(C, M) {
    return j;
    function j($) {
      a.call(this, C($), $), M && M.call(this, $);
    }
  }
  function l() {
    this.stack.push({
      type: "fragment",
      children: []
    });
  }
  function a(C, M, j) {
    this.stack[this.stack.length - 1].children.push(C), this.stack.push(C), this.tokenStack.push([M, j || void 0]), C.position = {
      start: Oe(M.start),
      // @ts-expect-error: `end` will be patched later.
      end: void 0
    };
  }
  function u(C) {
    return M;
    function M(j) {
      C && C.call(this, j), s.call(this, j);
    }
  }
  function s(C, M) {
    const j = this.stack.pop(), $ = this.tokenStack.pop();
    if ($)
      $[0].type !== C.type && (M ? M.call(this, C, $[0]) : ($[1] || Mr).call(this, C, $[0]));
    else throw new Error("Cannot close `" + C.type + "` (" + ft({
      start: C.start,
      end: C.end
    }) + "): it’s not open");
    j.position.end = Oe(C.end);
  }
  function f() {
    return Bn(this.stack.pop());
  }
  function c() {
    this.data.expectingFirstListItemValue = !0;
  }
  function p(C) {
    if (this.data.expectingFirstListItemValue) {
      const M = this.stack[this.stack.length - 2];
      M.start = Number.parseInt(this.sliceSerialize(C), 10), this.data.expectingFirstListItemValue = void 0;
    }
  }
  function h() {
    const C = this.resume(), M = this.stack[this.stack.length - 1];
    M.lang = C;
  }
  function g() {
    const C = this.resume(), M = this.stack[this.stack.length - 1];
    M.meta = C;
  }
  function k() {
    this.data.flowCodeInside || (this.buffer(), this.data.flowCodeInside = !0);
  }
  function S() {
    const C = this.resume(), M = this.stack[this.stack.length - 1];
    M.value = C.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, ""), this.data.flowCodeInside = void 0;
  }
  function x() {
    const C = this.resume(), M = this.stack[this.stack.length - 1];
    M.value = C.replace(/(\r?\n|\r)$/g, "");
  }
  function v(C) {
    const M = this.resume(), j = this.stack[this.stack.length - 1];
    j.label = M, j.identifier = Fe(this.sliceSerialize(C)).toLowerCase();
  }
  function E() {
    const C = this.resume(), M = this.stack[this.stack.length - 1];
    M.title = C;
  }
  function R() {
    const C = this.resume(), M = this.stack[this.stack.length - 1];
    M.url = C;
  }
  function N(C) {
    const M = this.stack[this.stack.length - 1];
    if (!M.depth) {
      const j = this.sliceSerialize(C).length;
      M.depth = j;
    }
  }
  function w() {
    this.data.setextHeadingSlurpLineEnding = !0;
  }
  function P(C) {
    const M = this.stack[this.stack.length - 1];
    M.depth = this.sliceSerialize(C).codePointAt(0) === 61 ? 1 : 2;
  }
  function L() {
    this.data.setextHeadingSlurpLineEnding = void 0;
  }
  function V(C) {
    const j = this.stack[this.stack.length - 1].children;
    let $ = j[j.length - 1];
    (!$ || $.type !== "text") && ($ = Qe(), $.position = {
      start: Oe(C.start),
      // @ts-expect-error: we’ll add `end` later.
      end: void 0
    }, j.push($)), this.stack.push($);
  }
  function b(C) {
    const M = this.stack.pop();
    M.value += this.sliceSerialize(C), M.position.end = Oe(C.end);
  }
  function F(C) {
    const M = this.stack[this.stack.length - 1];
    if (this.data.atHardBreak) {
      const j = M.children[M.children.length - 1];
      j.position.end = Oe(C.end), this.data.atHardBreak = void 0;
      return;
    }
    !this.data.setextHeadingSlurpLineEnding && t.canContainEols.includes(M.type) && (V.call(this, C), b.call(this, C));
  }
  function z() {
    this.data.atHardBreak = !0;
  }
  function D() {
    const C = this.resume(), M = this.stack[this.stack.length - 1];
    M.value = C;
  }
  function A() {
    const C = this.resume(), M = this.stack[this.stack.length - 1];
    M.value = C;
  }
  function O() {
    const C = this.resume(), M = this.stack[this.stack.length - 1];
    M.value = C;
  }
  function Z() {
    const C = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      const M = this.data.referenceType || "shortcut";
      C.type += "Reference", C.referenceType = M, delete C.url, delete C.title;
    } else
      delete C.identifier, delete C.label;
    this.data.referenceType = void 0;
  }
  function J() {
    const C = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      const M = this.data.referenceType || "shortcut";
      C.type += "Reference", C.referenceType = M, delete C.url, delete C.title;
    } else
      delete C.identifier, delete C.label;
    this.data.referenceType = void 0;
  }
  function q(C) {
    const M = this.sliceSerialize(C), j = this.stack[this.stack.length - 2];
    j.label = su(M), j.identifier = Fe(M).toLowerCase();
  }
  function X() {
    const C = this.stack[this.stack.length - 1], M = this.resume(), j = this.stack[this.stack.length - 1];
    if (this.data.inReference = !0, j.type === "link") {
      const $ = C.children;
      j.children = $;
    } else
      j.alt = M;
  }
  function d() {
    const C = this.resume(), M = this.stack[this.stack.length - 1];
    M.url = C;
  }
  function _() {
    const C = this.resume(), M = this.stack[this.stack.length - 1];
    M.title = C;
  }
  function Y() {
    this.data.inReference = void 0;
  }
  function m() {
    this.data.referenceType = "collapsed";
  }
  function G(C) {
    const M = this.resume(), j = this.stack[this.stack.length - 1];
    j.label = M, j.identifier = Fe(this.sliceSerialize(C)).toLowerCase(), this.data.referenceType = "full";
  }
  function ae(C) {
    this.data.characterReferenceType = C.type;
  }
  function K(C) {
    const M = this.sliceSerialize(C), j = this.data.characterReferenceType;
    let $;
    j ? ($ = bi(M, j === "characterReferenceMarkerNumeric" ? 10 : 16), this.data.characterReferenceType = void 0) : $ = Vn(M);
    const ee = this.stack[this.stack.length - 1];
    ee.value += $;
  }
  function pe(C) {
    const M = this.stack.pop();
    M.position.end = Oe(C.end);
  }
  function le(C) {
    b.call(this, C);
    const M = this.stack[this.stack.length - 1];
    M.url = this.sliceSerialize(C);
  }
  function ve(C) {
    b.call(this, C);
    const M = this.stack[this.stack.length - 1];
    M.url = "mailto:" + this.sliceSerialize(C);
  }
  function ke() {
    return {
      type: "blockquote",
      children: []
    };
  }
  function Ee() {
    return {
      type: "code",
      lang: null,
      meta: null,
      value: ""
    };
  }
  function Ve() {
    return {
      type: "inlineCode",
      value: ""
    };
  }
  function kt() {
    return {
      type: "definition",
      identifier: "",
      label: null,
      title: null,
      url: ""
    };
  }
  function jt() {
    return {
      type: "emphasis",
      children: []
    };
  }
  function bt() {
    return {
      type: "heading",
      // @ts-expect-error `depth` will be set later.
      depth: 0,
      children: []
    };
  }
  function wt() {
    return {
      type: "break"
    };
  }
  function Ct() {
    return {
      type: "html",
      value: ""
    };
  }
  function Zt() {
    return {
      type: "image",
      title: null,
      url: "",
      alt: null
    };
  }
  function Xe() {
    return {
      type: "link",
      title: null,
      url: "",
      children: []
    };
  }
  function Ye(C) {
    return {
      type: "list",
      ordered: C.type === "listOrdered",
      start: null,
      spread: C._spread,
      children: []
    };
  }
  function $t(C) {
    return {
      type: "listItem",
      spread: C._spread,
      checked: null,
      children: []
    };
  }
  function Ut() {
    return {
      type: "paragraph",
      children: []
    };
  }
  function it() {
    return {
      type: "strong",
      children: []
    };
  }
  function Qe() {
    return {
      type: "text",
      value: ""
    };
  }
  function He() {
    return {
      type: "thematicBreak"
    };
  }
}
function Oe(e) {
  return {
    line: e.line,
    column: e.column,
    offset: e.offset
  };
}
function Li(e, t) {
  let n = -1;
  for (; ++n < t.length; ) {
    const r = t[n];
    Array.isArray(r) ? Li(e, r) : hu(e, r);
  }
}
function hu(e, t) {
  let n;
  for (n in t)
    if (Fi.call(t, n))
      switch (n) {
        case "canContainEols": {
          const r = t[n];
          r && e[n].push(...r);
          break;
        }
        case "transforms": {
          const r = t[n];
          r && e[n].push(...r);
          break;
        }
        case "enter":
        case "exit": {
          const r = t[n];
          r && Object.assign(e[n], r);
          break;
        }
      }
}
function Mr(e, t) {
  throw e ? new Error("Cannot close `" + e.type + "` (" + ft({
    start: e.start,
    end: e.end
  }) + "): a different token (`" + t.type + "`, " + ft({
    start: t.start,
    end: t.end
  }) + ") is open") : new Error("Cannot close document, a token (`" + t.type + "`, " + ft({
    start: t.start,
    end: t.end
  }) + ") is still open");
}
function pu(e) {
  const t = this;
  t.parser = n;
  function n(r) {
    return cu(r, {
      ...t.data("settings"),
      ...e,
      // Note: these options are not in the readme.
      // The goal is for them to be set by plugins on `data` instead of being
      // passed by users.
      extensions: t.data("micromarkExtensions") || [],
      mdastExtensions: t.data("fromMarkdownExtensions") || []
    });
  }
}
function mu(e, t) {
  const n = {
    type: "element",
    tagName: "blockquote",
    properties: {},
    children: e.wrap(e.all(t), !0)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function du(e, t) {
  const n = { type: "element", tagName: "br", properties: {}, children: [] };
  return e.patch(t, n), [e.applyData(t, n), { type: "text", value: `
` }];
}
function gu(e, t) {
  const n = t.value ? t.value + `
` : "", r = {};
  t.lang && (r.className = ["language-" + t.lang]);
  let i = {
    type: "element",
    tagName: "code",
    properties: r,
    children: [{ type: "text", value: n }]
  };
  return t.meta && (i.data = { meta: t.meta }), e.patch(t, i), i = e.applyData(t, i), i = { type: "element", tagName: "pre", properties: {}, children: [i] }, e.patch(t, i), i;
}
function yu(e, t) {
  const n = {
    type: "element",
    tagName: "del",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function xu(e, t) {
  const n = {
    type: "element",
    tagName: "em",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function ku(e, t) {
  const n = typeof e.options.clobberPrefix == "string" ? e.options.clobberPrefix : "user-content-", r = String(t.identifier).toUpperCase(), i = rt(r.toLowerCase()), o = e.footnoteOrder.indexOf(r);
  let l, a = e.footnoteCounts.get(r);
  a === void 0 ? (a = 0, e.footnoteOrder.push(r), l = e.footnoteOrder.length) : l = o + 1, a += 1, e.footnoteCounts.set(r, a);
  const u = {
    type: "element",
    tagName: "a",
    properties: {
      href: "#" + n + "fn-" + i,
      id: n + "fnref-" + i + (a > 1 ? "-" + a : ""),
      dataFootnoteRef: !0,
      ariaDescribedBy: ["footnote-label"]
    },
    children: [{ type: "text", value: String(l) }]
  };
  e.patch(t, u);
  const s = {
    type: "element",
    tagName: "sup",
    properties: {},
    children: [u]
  };
  return e.patch(t, s), e.applyData(t, s);
}
function bu(e, t) {
  const n = {
    type: "element",
    tagName: "h" + t.depth,
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function wu(e, t) {
  if (e.options.allowDangerousHtml) {
    const n = { type: "raw", value: t.value };
    return e.patch(t, n), e.applyData(t, n);
  }
}
function Pi(e, t) {
  const n = t.referenceType;
  let r = "]";
  if (n === "collapsed" ? r += "[]" : n === "full" && (r += "[" + (t.label || t.identifier) + "]"), t.type === "imageReference")
    return [{ type: "text", value: "![" + t.alt + r }];
  const i = e.all(t), o = i[0];
  o && o.type === "text" ? o.value = "[" + o.value : i.unshift({ type: "text", value: "[" });
  const l = i[i.length - 1];
  return l && l.type === "text" ? l.value += r : i.push({ type: "text", value: r }), i;
}
function Cu(e, t) {
  const n = String(t.identifier).toUpperCase(), r = e.definitionById.get(n);
  if (!r)
    return Pi(e, t);
  const i = { src: rt(r.url || ""), alt: t.alt };
  r.title !== null && r.title !== void 0 && (i.title = r.title);
  const o = { type: "element", tagName: "img", properties: i, children: [] };
  return e.patch(t, o), e.applyData(t, o);
}
function vu(e, t) {
  const n = { src: rt(t.url) };
  t.alt !== null && t.alt !== void 0 && (n.alt = t.alt), t.title !== null && t.title !== void 0 && (n.title = t.title);
  const r = { type: "element", tagName: "img", properties: n, children: [] };
  return e.patch(t, r), e.applyData(t, r);
}
function Su(e, t) {
  const n = { type: "text", value: t.value.replace(/\r?\n|\r/g, " ") };
  e.patch(t, n);
  const r = {
    type: "element",
    tagName: "code",
    properties: {},
    children: [n]
  };
  return e.patch(t, r), e.applyData(t, r);
}
function Eu(e, t) {
  const n = String(t.identifier).toUpperCase(), r = e.definitionById.get(n);
  if (!r)
    return Pi(e, t);
  const i = { href: rt(r.url || "") };
  r.title !== null && r.title !== void 0 && (i.title = r.title);
  const o = {
    type: "element",
    tagName: "a",
    properties: i,
    children: e.all(t)
  };
  return e.patch(t, o), e.applyData(t, o);
}
function Au(e, t) {
  const n = { href: rt(t.url) };
  t.title !== null && t.title !== void 0 && (n.title = t.title);
  const r = {
    type: "element",
    tagName: "a",
    properties: n,
    children: e.all(t)
  };
  return e.patch(t, r), e.applyData(t, r);
}
function Iu(e, t, n) {
  const r = e.all(t), i = n ? Tu(n) : zi(t), o = {}, l = [];
  if (typeof t.checked == "boolean") {
    const f = r[0];
    let c;
    f && f.type === "element" && f.tagName === "p" ? c = f : (c = { type: "element", tagName: "p", properties: {}, children: [] }, r.unshift(c)), c.children.length > 0 && c.children.unshift({ type: "text", value: " " }), c.children.unshift({
      type: "element",
      tagName: "input",
      properties: { type: "checkbox", checked: t.checked, disabled: !0 },
      children: []
    }), o.className = ["task-list-item"];
  }
  let a = -1;
  for (; ++a < r.length; ) {
    const f = r[a];
    (i || a !== 0 || f.type !== "element" || f.tagName !== "p") && l.push({ type: "text", value: `
` }), f.type === "element" && f.tagName === "p" && !i ? l.push(...f.children) : l.push(f);
  }
  const u = r[r.length - 1];
  u && (i || u.type !== "element" || u.tagName !== "p") && l.push({ type: "text", value: `
` });
  const s = { type: "element", tagName: "li", properties: o, children: l };
  return e.patch(t, s), e.applyData(t, s);
}
function Tu(e) {
  let t = !1;
  if (e.type === "list") {
    t = e.spread || !1;
    const n = e.children;
    let r = -1;
    for (; !t && ++r < n.length; )
      t = zi(n[r]);
  }
  return t;
}
function zi(e) {
  const t = e.spread;
  return t ?? e.children.length > 1;
}
function Mu(e, t) {
  const n = {}, r = e.all(t);
  let i = -1;
  for (typeof t.start == "number" && t.start !== 1 && (n.start = t.start); ++i < r.length; ) {
    const l = r[i];
    if (l.type === "element" && l.tagName === "li" && l.properties && Array.isArray(l.properties.className) && l.properties.className.includes("task-list-item")) {
      n.className = ["contains-task-list"];
      break;
    }
  }
  const o = {
    type: "element",
    tagName: t.ordered ? "ol" : "ul",
    properties: n,
    children: e.wrap(r, !0)
  };
  return e.patch(t, o), e.applyData(t, o);
}
function Fu(e, t) {
  const n = {
    type: "element",
    tagName: "p",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function Lu(e, t) {
  const n = { type: "root", children: e.wrap(e.all(t)) };
  return e.patch(t, n), e.applyData(t, n);
}
function Pu(e, t) {
  const n = {
    type: "element",
    tagName: "strong",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function zu(e, t) {
  const n = e.all(t), r = n.shift(), i = [];
  if (r) {
    const l = {
      type: "element",
      tagName: "thead",
      properties: {},
      children: e.wrap([r], !0)
    };
    e.patch(t.children[0], l), i.push(l);
  }
  if (n.length > 0) {
    const l = {
      type: "element",
      tagName: "tbody",
      properties: {},
      children: e.wrap(n, !0)
    }, a = Rn(t.children[1]), u = hi(t.children[t.children.length - 1]);
    a && u && (l.position = { start: a, end: u }), i.push(l);
  }
  const o = {
    type: "element",
    tagName: "table",
    properties: {},
    children: e.wrap(i, !0)
  };
  return e.patch(t, o), e.applyData(t, o);
}
function Du(e, t, n) {
  const r = n ? n.children : void 0, o = (r ? r.indexOf(t) : 1) === 0 ? "th" : "td", l = n && n.type === "table" ? n.align : void 0, a = l ? l.length : t.children.length;
  let u = -1;
  const s = [];
  for (; ++u < a; ) {
    const c = t.children[u], p = {}, h = l ? l[u] : void 0;
    h && (p.align = h);
    let g = { type: "element", tagName: o, properties: p, children: [] };
    c && (g.children = e.all(c), e.patch(c, g), g = e.applyData(c, g)), s.push(g);
  }
  const f = {
    type: "element",
    tagName: "tr",
    properties: {},
    children: e.wrap(s, !0)
  };
  return e.patch(t, f), e.applyData(t, f);
}
function Ru(e, t) {
  const n = {
    type: "element",
    tagName: "td",
    // Assume body cell.
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
const Fr = 9, Lr = 32;
function Nu(e) {
  const t = String(e), n = /\r?\n|\r/g;
  let r = n.exec(t), i = 0;
  const o = [];
  for (; r; )
    o.push(
      Pr(t.slice(i, r.index), i > 0, !0),
      r[0]
    ), i = r.index + r[0].length, r = n.exec(t);
  return o.push(Pr(t.slice(i), i > 0, !1)), o.join("");
}
function Pr(e, t, n) {
  let r = 0, i = e.length;
  if (t) {
    let o = e.codePointAt(r);
    for (; o === Fr || o === Lr; )
      r++, o = e.codePointAt(r);
  }
  if (n) {
    let o = e.codePointAt(i - 1);
    for (; o === Fr || o === Lr; )
      i--, o = e.codePointAt(i - 1);
  }
  return i > r ? e.slice(r, i) : "";
}
function Ou(e, t) {
  const n = { type: "text", value: Nu(String(t.value)) };
  return e.patch(t, n), e.applyData(t, n);
}
function _u(e, t) {
  const n = {
    type: "element",
    tagName: "hr",
    properties: {},
    children: []
  };
  return e.patch(t, n), e.applyData(t, n);
}
const Bu = {
  blockquote: mu,
  break: du,
  code: gu,
  delete: yu,
  emphasis: xu,
  footnoteReference: ku,
  heading: bu,
  html: wu,
  imageReference: Cu,
  image: vu,
  inlineCode: Su,
  linkReference: Eu,
  link: Au,
  listItem: Iu,
  list: Mu,
  paragraph: Fu,
  // @ts-expect-error: root is different, but hard to type.
  root: Lu,
  strong: Pu,
  table: zu,
  tableCell: Ru,
  tableRow: Du,
  text: Ou,
  thematicBreak: _u,
  toml: At,
  yaml: At,
  definition: At,
  footnoteDefinition: At
};
function At() {
}
const Di = -1, Bt = 0, pt = 1, zt = 2, jn = 3, Zn = 4, $n = 5, Un = 6, Ri = 7, Ni = 8, zr = typeof self == "object" ? self : globalThis, Vu = (e, t) => {
  const n = (i, o) => (e.set(o, i), i), r = (i) => {
    if (e.has(i))
      return e.get(i);
    const [o, l] = t[i];
    switch (o) {
      case Bt:
      case Di:
        return n(l, i);
      case pt: {
        const a = n([], i);
        for (const u of l)
          a.push(r(u));
        return a;
      }
      case zt: {
        const a = n({}, i);
        for (const [u, s] of l)
          a[r(u)] = r(s);
        return a;
      }
      case jn:
        return n(new Date(l), i);
      case Zn: {
        const { source: a, flags: u } = l;
        return n(new RegExp(a, u), i);
      }
      case $n: {
        const a = n(/* @__PURE__ */ new Map(), i);
        for (const [u, s] of l)
          a.set(r(u), r(s));
        return a;
      }
      case Un: {
        const a = n(/* @__PURE__ */ new Set(), i);
        for (const u of l)
          a.add(r(u));
        return a;
      }
      case Ri: {
        const { name: a, message: u } = l;
        return n(new zr[a](u), i);
      }
      case Ni:
        return n(BigInt(l), i);
      case "BigInt":
        return n(Object(BigInt(l)), i);
      case "ArrayBuffer":
        return n(new Uint8Array(l).buffer, l);
      case "DataView": {
        const { buffer: a } = new Uint8Array(l);
        return n(new DataView(a), l);
      }
    }
    return n(new zr[o](l), i);
  };
  return r;
}, Dr = (e) => Vu(/* @__PURE__ */ new Map(), e)(0), Ge = "", { toString: Hu } = {}, { keys: ju } = Object, ut = (e) => {
  const t = typeof e;
  if (t !== "object" || !e)
    return [Bt, t];
  const n = Hu.call(e).slice(8, -1);
  switch (n) {
    case "Array":
      return [pt, Ge];
    case "Object":
      return [zt, Ge];
    case "Date":
      return [jn, Ge];
    case "RegExp":
      return [Zn, Ge];
    case "Map":
      return [$n, Ge];
    case "Set":
      return [Un, Ge];
    case "DataView":
      return [pt, n];
  }
  return n.includes("Array") ? [pt, n] : n.includes("Error") ? [Ri, n] : [zt, n];
}, It = ([e, t]) => e === Bt && (t === "function" || t === "symbol"), Zu = (e, t, n, r) => {
  const i = (l, a) => {
    const u = r.push(l) - 1;
    return n.set(a, u), u;
  }, o = (l) => {
    if (n.has(l))
      return n.get(l);
    let [a, u] = ut(l);
    switch (a) {
      case Bt: {
        let f = l;
        switch (u) {
          case "bigint":
            a = Ni, f = l.toString();
            break;
          case "function":
          case "symbol":
            if (e)
              throw new TypeError("unable to serialize " + u);
            f = null;
            break;
          case "undefined":
            return i([Di], l);
        }
        return i([a, f], l);
      }
      case pt: {
        if (u) {
          let p = l;
          return u === "DataView" ? p = new Uint8Array(l.buffer) : u === "ArrayBuffer" && (p = new Uint8Array(l)), i([u, [...p]], l);
        }
        const f = [], c = i([a, f], l);
        for (const p of l)
          f.push(o(p));
        return c;
      }
      case zt: {
        if (u)
          switch (u) {
            case "BigInt":
              return i([u, l.toString()], l);
            case "Boolean":
            case "Number":
            case "String":
              return i([u, l.valueOf()], l);
          }
        if (t && "toJSON" in l)
          return o(l.toJSON());
        const f = [], c = i([a, f], l);
        for (const p of ju(l))
          (e || !It(ut(l[p]))) && f.push([o(p), o(l[p])]);
        return c;
      }
      case jn:
        return i([a, l.toISOString()], l);
      case Zn: {
        const { source: f, flags: c } = l;
        return i([a, { source: f, flags: c }], l);
      }
      case $n: {
        const f = [], c = i([a, f], l);
        for (const [p, h] of l)
          (e || !(It(ut(p)) || It(ut(h)))) && f.push([o(p), o(h)]);
        return c;
      }
      case Un: {
        const f = [], c = i([a, f], l);
        for (const p of l)
          (e || !It(ut(p))) && f.push(o(p));
        return c;
      }
    }
    const { message: s } = l;
    return i([a, { name: u, message: s }], l);
  };
  return o;
}, Rr = (e, { json: t, lossy: n } = {}) => {
  const r = [];
  return Zu(!(t || n), !!t, /* @__PURE__ */ new Map(), r)(e), r;
}, Dt = typeof structuredClone == "function" ? (
  /* c8 ignore start */
  (e, t) => t && ("json" in t || "lossy" in t) ? Dr(Rr(e, t)) : structuredClone(e)
) : (e, t) => Dr(Rr(e, t));
function $u(e, t) {
  const n = [{ type: "text", value: "↩" }];
  return t > 1 && n.push({
    type: "element",
    tagName: "sup",
    properties: {},
    children: [{ type: "text", value: String(t) }]
  }), n;
}
function Uu(e, t) {
  return "Back to reference " + (e + 1) + (t > 1 ? "-" + t : "");
}
function qu(e) {
  const t = typeof e.options.clobberPrefix == "string" ? e.options.clobberPrefix : "user-content-", n = e.options.footnoteBackContent || $u, r = e.options.footnoteBackLabel || Uu, i = e.options.footnoteLabel || "Footnotes", o = e.options.footnoteLabelTagName || "h2", l = e.options.footnoteLabelProperties || {
    className: ["sr-only"]
  }, a = [];
  let u = -1;
  for (; ++u < e.footnoteOrder.length; ) {
    const s = e.footnoteById.get(
      e.footnoteOrder[u]
    );
    if (!s)
      continue;
    const f = e.all(s), c = String(s.identifier).toUpperCase(), p = rt(c.toLowerCase());
    let h = 0;
    const g = [], k = e.footnoteCounts.get(c);
    for (; k !== void 0 && ++h <= k; ) {
      g.length > 0 && g.push({ type: "text", value: " " });
      let v = typeof n == "string" ? n : n(u, h);
      typeof v == "string" && (v = { type: "text", value: v }), g.push({
        type: "element",
        tagName: "a",
        properties: {
          href: "#" + t + "fnref-" + p + (h > 1 ? "-" + h : ""),
          dataFootnoteBackref: "",
          ariaLabel: typeof r == "string" ? r : r(u, h),
          className: ["data-footnote-backref"]
        },
        children: Array.isArray(v) ? v : [v]
      });
    }
    const S = f[f.length - 1];
    if (S && S.type === "element" && S.tagName === "p") {
      const v = S.children[S.children.length - 1];
      v && v.type === "text" ? v.value += " " : S.children.push({ type: "text", value: " " }), S.children.push(...g);
    } else
      f.push(...g);
    const x = {
      type: "element",
      tagName: "li",
      properties: { id: t + "fn-" + p },
      children: e.wrap(f, !0)
    };
    e.patch(s, x), a.push(x);
  }
  if (a.length !== 0)
    return {
      type: "element",
      tagName: "section",
      properties: { dataFootnotes: !0, className: ["footnotes"] },
      children: [
        {
          type: "element",
          tagName: o,
          properties: {
            ...Dt(l),
            id: "footnote-label"
          },
          children: [{ type: "text", value: i }]
        },
        { type: "text", value: `
` },
        {
          type: "element",
          tagName: "ol",
          properties: {},
          children: e.wrap(a, !0)
        },
        { type: "text", value: `
` }
      ]
    };
}
const Vt = (
  // Note: overloads in JSDoc can’t yet use different `@template`s.
  /**
   * @type {(
   *   (<Condition extends string>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & {type: Condition}) &
   *   (<Condition extends Props>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Condition) &
   *   (<Condition extends TestFunction>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Predicate<Condition, Node>) &
   *   ((test?: null | undefined) => (node?: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node) &
   *   ((test?: Test) => Check)
   * )}
   */
  /**
   * @param {Test} [test]
   * @returns {Check}
   */
  function(e) {
    if (e == null)
      return Qu;
    if (typeof e == "function")
      return Ht(e);
    if (typeof e == "object")
      return Array.isArray(e) ? Wu(e) : Xu(e);
    if (typeof e == "string")
      return Yu(e);
    throw new Error("Expected function, string, or object as test");
  }
);
function Wu(e) {
  const t = [];
  let n = -1;
  for (; ++n < e.length; )
    t[n] = Vt(e[n]);
  return Ht(r);
  function r(...i) {
    let o = -1;
    for (; ++o < t.length; )
      if (t[o].apply(this, i)) return !0;
    return !1;
  }
}
function Xu(e) {
  const t = (
    /** @type {Record<string, unknown>} */
    e
  );
  return Ht(n);
  function n(r) {
    const i = (
      /** @type {Record<string, unknown>} */
      /** @type {unknown} */
      r
    );
    let o;
    for (o in e)
      if (i[o] !== t[o]) return !1;
    return !0;
  }
}
function Yu(e) {
  return Ht(t);
  function t(n) {
    return n && n.type === e;
  }
}
function Ht(e) {
  return t;
  function t(n, r, i) {
    return !!(Ju(n) && e.call(
      this,
      n,
      typeof r == "number" ? r : void 0,
      i || void 0
    ));
  }
}
function Qu() {
  return !0;
}
function Ju(e) {
  return e !== null && typeof e == "object" && "type" in e;
}
const Oi = [], Gu = !0, vn = !1, Ku = "skip";
function _i(e, t, n, r) {
  let i;
  typeof t == "function" && typeof n != "function" ? (r = n, n = t) : i = t;
  const o = Vt(i), l = r ? -1 : 1;
  a(e, void 0, [])();
  function a(u, s, f) {
    const c = (
      /** @type {Record<string, unknown>} */
      u && typeof u == "object" ? u : {}
    );
    if (typeof c.type == "string") {
      const h = (
        // `hast`
        typeof c.tagName == "string" ? c.tagName : (
          // `xast`
          typeof c.name == "string" ? c.name : void 0
        )
      );
      Object.defineProperty(p, "name", {
        value: "node (" + (u.type + (h ? "<" + h + ">" : "")) + ")"
      });
    }
    return p;
    function p() {
      let h = Oi, g, k, S;
      if ((!t || o(u, s, f[f.length - 1] || void 0)) && (h = ec(n(u, f)), h[0] === vn))
        return h;
      if ("children" in u && u.children) {
        const x = (
          /** @type {UnistParent} */
          u
        );
        if (x.children && h[0] !== Ku)
          for (k = (r ? x.children.length : -1) + l, S = f.concat(x); k > -1 && k < x.children.length; ) {
            const v = x.children[k];
            if (g = a(v, k, S)(), g[0] === vn)
              return g;
            k = typeof g[1] == "number" ? g[1] : k + l;
          }
      }
      return h;
    }
  }
}
function ec(e) {
  return Array.isArray(e) ? e : typeof e == "number" ? [Gu, e] : e == null ? Oi : [e];
}
function qn(e, t, n, r) {
  let i, o, l;
  typeof t == "function" && typeof n != "function" ? (o = void 0, l = t, i = n) : (o = t, l = n, i = r), _i(e, o, a, i);
  function a(u, s) {
    const f = s[s.length - 1], c = f ? f.children.indexOf(u) : void 0;
    return l(u, c, f);
  }
}
const Sn = {}.hasOwnProperty, tc = {};
function nc(e, t) {
  const n = t || tc, r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), l = { ...Bu, ...n.handlers }, a = {
    all: s,
    applyData: ic,
    definitionById: r,
    footnoteById: i,
    footnoteCounts: o,
    footnoteOrder: [],
    handlers: l,
    one: u,
    options: n,
    patch: rc,
    wrap: oc
  };
  return qn(e, function(f) {
    if (f.type === "definition" || f.type === "footnoteDefinition") {
      const c = f.type === "definition" ? r : i, p = String(f.identifier).toUpperCase();
      c.has(p) || c.set(p, f);
    }
  }), a;
  function u(f, c) {
    const p = f.type, h = a.handlers[p];
    if (Sn.call(a.handlers, p) && h)
      return h(a, f, c);
    if (a.options.passThrough && a.options.passThrough.includes(p)) {
      if ("children" in f) {
        const { children: k, ...S } = f, x = Dt(S);
        return x.children = a.all(f), x;
      }
      return Dt(f);
    }
    return (a.options.unknownHandler || lc)(a, f, c);
  }
  function s(f) {
    const c = [];
    if ("children" in f) {
      const p = f.children;
      let h = -1;
      for (; ++h < p.length; ) {
        const g = a.one(p[h], f);
        if (g) {
          if (h && p[h - 1].type === "break" && (!Array.isArray(g) && g.type === "text" && (g.value = Nr(g.value)), !Array.isArray(g) && g.type === "element")) {
            const k = g.children[0];
            k && k.type === "text" && (k.value = Nr(k.value));
          }
          Array.isArray(g) ? c.push(...g) : c.push(g);
        }
      }
    }
    return c;
  }
}
function rc(e, t) {
  e.position && (t.position = Uo(e));
}
function ic(e, t) {
  let n = t;
  if (e && e.data) {
    const r = e.data.hName, i = e.data.hChildren, o = e.data.hProperties;
    if (typeof r == "string")
      if (n.type === "element")
        n.tagName = r;
      else {
        const l = "children" in n ? n.children : [n];
        n = { type: "element", tagName: r, properties: {}, children: l };
      }
    n.type === "element" && o && Object.assign(n.properties, Dt(o)), "children" in n && n.children && i !== null && i !== void 0 && (n.children = i);
  }
  return n;
}
function lc(e, t) {
  const n = t.data || {}, r = "value" in t && !(Sn.call(n, "hProperties") || Sn.call(n, "hChildren")) ? { type: "text", value: t.value } : {
    type: "element",
    tagName: "div",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, r), e.applyData(t, r);
}
function oc(e, t) {
  const n = [];
  let r = -1;
  for (t && n.push({ type: "text", value: `
` }); ++r < e.length; )
    r && n.push({ type: "text", value: `
` }), n.push(e[r]);
  return t && e.length > 0 && n.push({ type: "text", value: `
` }), n;
}
function Nr(e) {
  let t = 0, n = e.charCodeAt(t);
  for (; n === 9 || n === 32; )
    t++, n = e.charCodeAt(t);
  return e.slice(t);
}
function Or(e, t) {
  const n = nc(e, t), r = n.one(e, void 0), i = qu(n), o = Array.isArray(r) ? { type: "root", children: r } : r || { type: "root", children: [] };
  return i && o.children.push({ type: "text", value: `
` }, i), o;
}
function ac(e, t) {
  return e && "run" in e ? async function(n, r) {
    const i = (
      /** @type {HastRoot} */
      Or(n, { file: r, ...t })
    );
    await e.run(i, r);
  } : function(n, r) {
    return (
      /** @type {HastRoot} */
      Or(n, { file: r, ...e || t })
    );
  };
}
function _r(e) {
  if (e)
    throw e;
}
var nn, Br;
function sc() {
  if (Br) return nn;
  Br = 1;
  var e = Object.prototype.hasOwnProperty, t = Object.prototype.toString, n = Object.defineProperty, r = Object.getOwnPropertyDescriptor, i = function(s) {
    return typeof Array.isArray == "function" ? Array.isArray(s) : t.call(s) === "[object Array]";
  }, o = function(s) {
    if (!s || t.call(s) !== "[object Object]")
      return !1;
    var f = e.call(s, "constructor"), c = s.constructor && s.constructor.prototype && e.call(s.constructor.prototype, "isPrototypeOf");
    if (s.constructor && !f && !c)
      return !1;
    var p;
    for (p in s)
      ;
    return typeof p > "u" || e.call(s, p);
  }, l = function(s, f) {
    n && f.name === "__proto__" ? n(s, f.name, {
      enumerable: !0,
      configurable: !0,
      value: f.newValue,
      writable: !0
    }) : s[f.name] = f.newValue;
  }, a = function(s, f) {
    if (f === "__proto__")
      if (e.call(s, f)) {
        if (r)
          return r(s, f).value;
      } else return;
    return s[f];
  };
  return nn = function u() {
    var s, f, c, p, h, g, k = arguments[0], S = 1, x = arguments.length, v = !1;
    for (typeof k == "boolean" && (v = k, k = arguments[1] || {}, S = 2), (k == null || typeof k != "object" && typeof k != "function") && (k = {}); S < x; ++S)
      if (s = arguments[S], s != null)
        for (f in s)
          c = a(k, f), p = a(s, f), k !== p && (v && p && (o(p) || (h = i(p))) ? (h ? (h = !1, g = c && i(c) ? c : []) : g = c && o(c) ? c : {}, l(k, { name: f, newValue: u(v, g, p) })) : typeof p < "u" && l(k, { name: f, newValue: p }));
    return k;
  }, nn;
}
var uc = sc();
const rn = /* @__PURE__ */ fi(uc);
function En(e) {
  if (typeof e != "object" || e === null)
    return !1;
  const t = Object.getPrototypeOf(e);
  return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e);
}
function cc() {
  const e = [], t = { run: n, use: r };
  return t;
  function n(...i) {
    let o = -1;
    const l = i.pop();
    if (typeof l != "function")
      throw new TypeError("Expected function as last argument, not " + l);
    a(null, ...i);
    function a(u, ...s) {
      const f = e[++o];
      let c = -1;
      if (u) {
        l(u);
        return;
      }
      for (; ++c < i.length; )
        (s[c] === null || s[c] === void 0) && (s[c] = i[c]);
      i = s, f ? fc(f, a)(...s) : l(null, ...s);
    }
  }
  function r(i) {
    if (typeof i != "function")
      throw new TypeError(
        "Expected `middelware` to be a function, not " + i
      );
    return e.push(i), t;
  }
}
function fc(e, t) {
  let n;
  return r;
  function r(...l) {
    const a = e.length > l.length;
    let u;
    a && l.push(i);
    try {
      u = e.apply(this, l);
    } catch (s) {
      const f = (
        /** @type {Error} */
        s
      );
      if (a && n)
        throw f;
      return i(f);
    }
    a || (u && u.then && typeof u.then == "function" ? u.then(o, i) : u instanceof Error ? i(u) : o(u));
  }
  function i(l, ...a) {
    n || (n = !0, t(l, ...a));
  }
  function o(l) {
    i(null, l);
  }
}
const Le = { basename: hc, dirname: pc, extname: mc, join: dc, sep: "/" };
function hc(e, t) {
  if (t !== void 0 && typeof t != "string")
    throw new TypeError('"ext" argument must be a string');
  xt(e);
  let n = 0, r = -1, i = e.length, o;
  if (t === void 0 || t.length === 0 || t.length > e.length) {
    for (; i--; )
      if (e.codePointAt(i) === 47) {
        if (o) {
          n = i + 1;
          break;
        }
      } else r < 0 && (o = !0, r = i + 1);
    return r < 0 ? "" : e.slice(n, r);
  }
  if (t === e)
    return "";
  let l = -1, a = t.length - 1;
  for (; i--; )
    if (e.codePointAt(i) === 47) {
      if (o) {
        n = i + 1;
        break;
      }
    } else
      l < 0 && (o = !0, l = i + 1), a > -1 && (e.codePointAt(i) === t.codePointAt(a--) ? a < 0 && (r = i) : (a = -1, r = l));
  return n === r ? r = l : r < 0 && (r = e.length), e.slice(n, r);
}
function pc(e) {
  if (xt(e), e.length === 0)
    return ".";
  let t = -1, n = e.length, r;
  for (; --n; )
    if (e.codePointAt(n) === 47) {
      if (r) {
        t = n;
        break;
      }
    } else r || (r = !0);
  return t < 0 ? e.codePointAt(0) === 47 ? "/" : "." : t === 1 && e.codePointAt(0) === 47 ? "//" : e.slice(0, t);
}
function mc(e) {
  xt(e);
  let t = e.length, n = -1, r = 0, i = -1, o = 0, l;
  for (; t--; ) {
    const a = e.codePointAt(t);
    if (a === 47) {
      if (l) {
        r = t + 1;
        break;
      }
      continue;
    }
    n < 0 && (l = !0, n = t + 1), a === 46 ? i < 0 ? i = t : o !== 1 && (o = 1) : i > -1 && (o = -1);
  }
  return i < 0 || n < 0 || // We saw a non-dot character immediately before the dot.
  o === 0 || // The (right-most) trimmed path component is exactly `..`.
  o === 1 && i === n - 1 && i === r + 1 ? "" : e.slice(i, n);
}
function dc(...e) {
  let t = -1, n;
  for (; ++t < e.length; )
    xt(e[t]), e[t] && (n = n === void 0 ? e[t] : n + "/" + e[t]);
  return n === void 0 ? "." : gc(n);
}
function gc(e) {
  xt(e);
  const t = e.codePointAt(0) === 47;
  let n = yc(e, !t);
  return n.length === 0 && !t && (n = "."), n.length > 0 && e.codePointAt(e.length - 1) === 47 && (n += "/"), t ? "/" + n : n;
}
function yc(e, t) {
  let n = "", r = 0, i = -1, o = 0, l = -1, a, u;
  for (; ++l <= e.length; ) {
    if (l < e.length)
      a = e.codePointAt(l);
    else {
      if (a === 47)
        break;
      a = 47;
    }
    if (a === 47) {
      if (!(i === l - 1 || o === 1)) if (i !== l - 1 && o === 2) {
        if (n.length < 2 || r !== 2 || n.codePointAt(n.length - 1) !== 46 || n.codePointAt(n.length - 2) !== 46) {
          if (n.length > 2) {
            if (u = n.lastIndexOf("/"), u !== n.length - 1) {
              u < 0 ? (n = "", r = 0) : (n = n.slice(0, u), r = n.length - 1 - n.lastIndexOf("/")), i = l, o = 0;
              continue;
            }
          } else if (n.length > 0) {
            n = "", r = 0, i = l, o = 0;
            continue;
          }
        }
        t && (n = n.length > 0 ? n + "/.." : "..", r = 2);
      } else
        n.length > 0 ? n += "/" + e.slice(i + 1, l) : n = e.slice(i + 1, l), r = l - i - 1;
      i = l, o = 0;
    } else a === 46 && o > -1 ? o++ : o = -1;
  }
  return n;
}
function xt(e) {
  if (typeof e != "string")
    throw new TypeError(
      "Path must be a string. Received " + JSON.stringify(e)
    );
}
const xc = { cwd: kc };
function kc() {
  return "/";
}
function An(e) {
  return !!(e !== null && typeof e == "object" && "href" in e && e.href && "protocol" in e && e.protocol && // @ts-expect-error: indexing is fine.
  e.auth === void 0);
}
function bc(e) {
  if (typeof e == "string")
    e = new URL(e);
  else if (!An(e)) {
    const t = new TypeError(
      'The "path" argument must be of type string or an instance of URL. Received `' + e + "`"
    );
    throw t.code = "ERR_INVALID_ARG_TYPE", t;
  }
  if (e.protocol !== "file:") {
    const t = new TypeError("The URL must be of scheme file");
    throw t.code = "ERR_INVALID_URL_SCHEME", t;
  }
  return wc(e);
}
function wc(e) {
  if (e.hostname !== "") {
    const r = new TypeError(
      'File URL host must be "localhost" or empty on darwin'
    );
    throw r.code = "ERR_INVALID_FILE_URL_HOST", r;
  }
  const t = e.pathname;
  let n = -1;
  for (; ++n < t.length; )
    if (t.codePointAt(n) === 37 && t.codePointAt(n + 1) === 50) {
      const r = t.codePointAt(n + 2);
      if (r === 70 || r === 102) {
        const i = new TypeError(
          "File URL path must not include encoded / characters"
        );
        throw i.code = "ERR_INVALID_FILE_URL_PATH", i;
      }
    }
  return decodeURIComponent(t);
}
const ln = (
  /** @type {const} */
  [
    "history",
    "path",
    "basename",
    "stem",
    "extname",
    "dirname"
  ]
);
class Bi {
  /**
   * Create a new virtual file.
   *
   * `options` is treated as:
   *
   * *   `string` or `Uint8Array` — `{value: options}`
   * *   `URL` — `{path: options}`
   * *   `VFile` — shallow copies its data over to the new file
   * *   `object` — all fields are shallow copied over to the new file
   *
   * Path related fields are set in the following order (least specific to
   * most specific): `history`, `path`, `basename`, `stem`, `extname`,
   * `dirname`.
   *
   * You cannot set `dirname` or `extname` without setting either `history`,
   * `path`, `basename`, or `stem` too.
   *
   * @param {Compatible | null | undefined} [value]
   *   File value.
   * @returns
   *   New instance.
   */
  constructor(t) {
    let n;
    t ? An(t) ? n = { path: t } : typeof t == "string" || Cc(t) ? n = { value: t } : n = t : n = {}, this.cwd = "cwd" in n ? "" : xc.cwd(), this.data = {}, this.history = [], this.messages = [], this.value, this.map, this.result, this.stored;
    let r = -1;
    for (; ++r < ln.length; ) {
      const o = ln[r];
      o in n && n[o] !== void 0 && n[o] !== null && (this[o] = o === "history" ? [...n[o]] : n[o]);
    }
    let i;
    for (i in n)
      ln.includes(i) || (this[i] = n[i]);
  }
  /**
   * Get the basename (including extname) (example: `'index.min.js'`).
   *
   * @returns {string | undefined}
   *   Basename.
   */
  get basename() {
    return typeof this.path == "string" ? Le.basename(this.path) : void 0;
  }
  /**
   * Set basename (including extname) (`'index.min.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   *
   * @param {string} basename
   *   Basename.
   * @returns {undefined}
   *   Nothing.
   */
  set basename(t) {
    an(t, "basename"), on(t, "basename"), this.path = Le.join(this.dirname || "", t);
  }
  /**
   * Get the parent path (example: `'~'`).
   *
   * @returns {string | undefined}
   *   Dirname.
   */
  get dirname() {
    return typeof this.path == "string" ? Le.dirname(this.path) : void 0;
  }
  /**
   * Set the parent path (example: `'~'`).
   *
   * Cannot be set if there’s no `path` yet.
   *
   * @param {string | undefined} dirname
   *   Dirname.
   * @returns {undefined}
   *   Nothing.
   */
  set dirname(t) {
    Vr(this.basename, "dirname"), this.path = Le.join(t || "", this.basename);
  }
  /**
   * Get the extname (including dot) (example: `'.js'`).
   *
   * @returns {string | undefined}
   *   Extname.
   */
  get extname() {
    return typeof this.path == "string" ? Le.extname(this.path) : void 0;
  }
  /**
   * Set the extname (including dot) (example: `'.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be set if there’s no `path` yet.
   *
   * @param {string | undefined} extname
   *   Extname.
   * @returns {undefined}
   *   Nothing.
   */
  set extname(t) {
    if (on(t, "extname"), Vr(this.dirname, "extname"), t) {
      if (t.codePointAt(0) !== 46)
        throw new Error("`extname` must start with `.`");
      if (t.includes(".", 1))
        throw new Error("`extname` cannot contain multiple dots");
    }
    this.path = Le.join(this.dirname, this.stem + (t || ""));
  }
  /**
   * Get the full path (example: `'~/index.min.js'`).
   *
   * @returns {string}
   *   Path.
   */
  get path() {
    return this.history[this.history.length - 1];
  }
  /**
   * Set the full path (example: `'~/index.min.js'`).
   *
   * Cannot be nullified.
   * You can set a file URL (a `URL` object with a `file:` protocol) which will
   * be turned into a path with `url.fileURLToPath`.
   *
   * @param {URL | string} path
   *   Path.
   * @returns {undefined}
   *   Nothing.
   */
  set path(t) {
    An(t) && (t = bc(t)), an(t, "path"), this.path !== t && this.history.push(t);
  }
  /**
   * Get the stem (basename w/o extname) (example: `'index.min'`).
   *
   * @returns {string | undefined}
   *   Stem.
   */
  get stem() {
    return typeof this.path == "string" ? Le.basename(this.path, this.extname) : void 0;
  }
  /**
   * Set the stem (basename w/o extname) (example: `'index.min'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   *
   * @param {string} stem
   *   Stem.
   * @returns {undefined}
   *   Nothing.
   */
  set stem(t) {
    an(t, "stem"), on(t, "stem"), this.path = Le.join(this.dirname || "", t + (this.extname || ""));
  }
  // Normal prototypal methods.
  /**
   * Create a fatal message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `true` (error; file not usable)
   * and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {never}
   *   Never.
   * @throws {VFileMessage}
   *   Message.
   */
  fail(t, n, r) {
    const i = this.message(t, n, r);
    throw i.fatal = !0, i;
  }
  /**
   * Create an info message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `undefined` (info; change
   * likely not needed) and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  info(t, n, r) {
    const i = this.message(t, n, r);
    return i.fatal = void 0, i;
  }
  /**
   * Create a message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `false` (warning; change may be
   * needed) and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  message(t, n, r) {
    const i = new he(
      // @ts-expect-error: the overloads are fine.
      t,
      n,
      r
    );
    return this.path && (i.name = this.path + ":" + i.name, i.file = this.path), i.fatal = !1, this.messages.push(i), i;
  }
  /**
   * Serialize the file.
   *
   * > **Note**: which encodings are supported depends on the engine.
   * > For info on Node.js, see:
   * > <https://nodejs.org/api/util.html#whatwg-supported-encodings>.
   *
   * @param {string | null | undefined} [encoding='utf8']
   *   Character encoding to understand `value` as when it’s a `Uint8Array`
   *   (default: `'utf-8'`).
   * @returns {string}
   *   Serialized file.
   */
  toString(t) {
    return this.value === void 0 ? "" : typeof this.value == "string" ? this.value : new TextDecoder(t || void 0).decode(this.value);
  }
}
function on(e, t) {
  if (e && e.includes(Le.sep))
    throw new Error(
      "`" + t + "` cannot be a path: did not expect `" + Le.sep + "`"
    );
}
function an(e, t) {
  if (!e)
    throw new Error("`" + t + "` cannot be empty");
}
function Vr(e, t) {
  if (!e)
    throw new Error("Setting `" + t + "` requires `path` to be set too");
}
function Cc(e) {
  return !!(e && typeof e == "object" && "byteLength" in e && "byteOffset" in e);
}
const vc = (
  /**
   * @type {new <Parameters extends Array<unknown>, Result>(property: string | symbol) => (...parameters: Parameters) => Result}
   */
  /** @type {unknown} */
  /**
   * @this {Function}
   * @param {string | symbol} property
   * @returns {(...parameters: Array<unknown>) => unknown}
   */
  function(e) {
    const r = (
      /** @type {Record<string | symbol, Function>} */
      // Prototypes do exist.
      // type-coverage:ignore-next-line
      this.constructor.prototype
    ), i = r[e], o = function() {
      return i.apply(o, arguments);
    };
    return Object.setPrototypeOf(o, r), o;
  }
), Sc = {}.hasOwnProperty;
class Wn extends vc {
  /**
   * Create a processor.
   */
  constructor() {
    super("copy"), this.Compiler = void 0, this.Parser = void 0, this.attachers = [], this.compiler = void 0, this.freezeIndex = -1, this.frozen = void 0, this.namespace = {}, this.parser = void 0, this.transformers = cc();
  }
  /**
   * Copy a processor.
   *
   * @deprecated
   *   This is a private internal method and should not be used.
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   New *unfrozen* processor ({@linkcode Processor}) that is
   *   configured to work the same as its ancestor.
   *   When the descendant processor is configured in the future it does not
   *   affect the ancestral processor.
   */
  copy() {
    const t = (
      /** @type {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>} */
      new Wn()
    );
    let n = -1;
    for (; ++n < this.attachers.length; ) {
      const r = this.attachers[n];
      t.use(...r);
    }
    return t.data(rn(!0, {}, this.namespace)), t;
  }
  /**
   * Configure the processor with info available to all plugins.
   * Information is stored in an object.
   *
   * Typically, options can be given to a specific plugin, but sometimes it
   * makes sense to have information shared with several plugins.
   * For example, a list of HTML elements that are self-closing, which is
   * needed during all phases.
   *
   * > **Note**: setting information cannot occur on *frozen* processors.
   * > Call the processor first to create a new unfrozen processor.
   *
   * > **Note**: to register custom data in TypeScript, augment the
   * > {@linkcode Data} interface.
   *
   * @example
   *   This example show how to get and set info:
   *
   *   ```js
   *   import {unified} from 'unified'
   *
   *   const processor = unified().data('alpha', 'bravo')
   *
   *   processor.data('alpha') // => 'bravo'
   *
   *   processor.data() // => {alpha: 'bravo'}
   *
   *   processor.data({charlie: 'delta'})
   *
   *   processor.data() // => {charlie: 'delta'}
   *   ```
   *
   * @template {keyof Data} Key
   *
   * @overload
   * @returns {Data}
   *
   * @overload
   * @param {Data} dataset
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {Key} key
   * @returns {Data[Key]}
   *
   * @overload
   * @param {Key} key
   * @param {Data[Key]} value
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @param {Data | Key} [key]
   *   Key to get or set, or entire dataset to set, or nothing to get the
   *   entire dataset (optional).
   * @param {Data[Key]} [value]
   *   Value to set (optional).
   * @returns {unknown}
   *   The current processor when setting, the value at `key` when getting, or
   *   the entire dataset when getting without key.
   */
  data(t, n) {
    return typeof t == "string" ? arguments.length === 2 ? (cn("data", this.frozen), this.namespace[t] = n, this) : Sc.call(this.namespace, t) && this.namespace[t] || void 0 : t ? (cn("data", this.frozen), this.namespace = t, this) : this.namespace;
  }
  /**
   * Freeze a processor.
   *
   * Frozen processors are meant to be extended and not to be configured
   * directly.
   *
   * When a processor is frozen it cannot be unfrozen.
   * New processors working the same way can be created by calling the
   * processor.
   *
   * It’s possible to freeze processors explicitly by calling `.freeze()`.
   * Processors freeze automatically when `.parse()`, `.run()`, `.runSync()`,
   * `.stringify()`, `.process()`, or `.processSync()` are called.
   *
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   The current processor.
   */
  freeze() {
    if (this.frozen)
      return this;
    const t = (
      /** @type {Processor} */
      /** @type {unknown} */
      this
    );
    for (; ++this.freezeIndex < this.attachers.length; ) {
      const [n, ...r] = this.attachers[this.freezeIndex];
      if (r[0] === !1)
        continue;
      r[0] === !0 && (r[0] = void 0);
      const i = n.call(t, ...r);
      typeof i == "function" && this.transformers.use(i);
    }
    return this.frozen = !0, this.freezeIndex = Number.POSITIVE_INFINITY, this;
  }
  /**
   * Parse text to a syntax tree.
   *
   * > **Note**: `parse` freezes the processor if not already *frozen*.
   *
   * > **Note**: `parse` performs the parse phase, not the run phase or other
   * > phases.
   *
   * @param {Compatible | undefined} [file]
   *   file to parse (optional); typically `string` or `VFile`; any value
   *   accepted as `x` in `new VFile(x)`.
   * @returns {ParseTree extends undefined ? Node : ParseTree}
   *   Syntax tree representing `file`.
   */
  parse(t) {
    this.freeze();
    const n = Tt(t), r = this.parser || this.Parser;
    return sn("parse", r), r(String(n), n);
  }
  /**
   * Process the given file as configured on the processor.
   *
   * > **Note**: `process` freezes the processor if not already *frozen*.
   *
   * > **Note**: `process` performs the parse, run, and stringify phases.
   *
   * @overload
   * @param {Compatible | undefined} file
   * @param {ProcessCallback<VFileWithOutput<CompileResult>>} done
   * @returns {undefined}
   *
   * @overload
   * @param {Compatible | undefined} [file]
   * @returns {Promise<VFileWithOutput<CompileResult>>}
   *
   * @param {Compatible | undefined} [file]
   *   File (optional); typically `string` or `VFile`]; any value accepted as
   *   `x` in `new VFile(x)`.
   * @param {ProcessCallback<VFileWithOutput<CompileResult>> | undefined} [done]
   *   Callback (optional).
   * @returns {Promise<VFile> | undefined}
   *   Nothing if `done` is given.
   *   Otherwise a promise, rejected with a fatal error or resolved with the
   *   processed file.
   *
   *   The parsed, transformed, and compiled value is available at
   *   `file.value` (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most
   *   > compilers return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  process(t, n) {
    const r = this;
    return this.freeze(), sn("process", this.parser || this.Parser), un("process", this.compiler || this.Compiler), n ? i(void 0, n) : new Promise(i);
    function i(o, l) {
      const a = Tt(t), u = (
        /** @type {HeadTree extends undefined ? Node : HeadTree} */
        /** @type {unknown} */
        r.parse(a)
      );
      r.run(u, a, function(f, c, p) {
        if (f || !c || !p)
          return s(f);
        const h = (
          /** @type {CompileTree extends undefined ? Node : CompileTree} */
          /** @type {unknown} */
          c
        ), g = r.stringify(h, p);
        Ic(g) ? p.value = g : p.result = g, s(
          f,
          /** @type {VFileWithOutput<CompileResult>} */
          p
        );
      });
      function s(f, c) {
        f || !c ? l(f) : o ? o(c) : n(void 0, c);
      }
    }
  }
  /**
   * Process the given file as configured on the processor.
   *
   * An error is thrown if asynchronous transforms are configured.
   *
   * > **Note**: `processSync` freezes the processor if not already *frozen*.
   *
   * > **Note**: `processSync` performs the parse, run, and stringify phases.
   *
   * @param {Compatible | undefined} [file]
   *   File (optional); typically `string` or `VFile`; any value accepted as
   *   `x` in `new VFile(x)`.
   * @returns {VFileWithOutput<CompileResult>}
   *   The processed file.
   *
   *   The parsed, transformed, and compiled value is available at
   *   `file.value` (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most
   *   > compilers return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  processSync(t) {
    let n = !1, r;
    return this.freeze(), sn("processSync", this.parser || this.Parser), un("processSync", this.compiler || this.Compiler), this.process(t, i), jr("processSync", "process", n), r;
    function i(o, l) {
      n = !0, _r(o), r = l;
    }
  }
  /**
   * Run *transformers* on a syntax tree.
   *
   * > **Note**: `run` freezes the processor if not already *frozen*.
   *
   * > **Note**: `run` performs the run phase, not other phases.
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
   * @returns {undefined}
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {Compatible | undefined} file
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
   * @returns {undefined}
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {Compatible | undefined} [file]
   * @returns {Promise<TailTree extends undefined ? Node : TailTree>}
   *
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   *   Tree to transform and inspect.
   * @param {(
   *   RunCallback<TailTree extends undefined ? Node : TailTree> |
   *   Compatible
   * )} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} [done]
   *   Callback (optional).
   * @returns {Promise<TailTree extends undefined ? Node : TailTree> | undefined}
   *   Nothing if `done` is given.
   *   Otherwise, a promise rejected with a fatal error or resolved with the
   *   transformed tree.
   */
  run(t, n, r) {
    Hr(t), this.freeze();
    const i = this.transformers;
    return !r && typeof n == "function" && (r = n, n = void 0), r ? o(void 0, r) : new Promise(o);
    function o(l, a) {
      const u = Tt(n);
      i.run(t, u, s);
      function s(f, c, p) {
        const h = (
          /** @type {TailTree extends undefined ? Node : TailTree} */
          c || t
        );
        f ? a(f) : l ? l(h) : r(void 0, h, p);
      }
    }
  }
  /**
   * Run *transformers* on a syntax tree.
   *
   * An error is thrown if asynchronous transforms are configured.
   *
   * > **Note**: `runSync` freezes the processor if not already *frozen*.
   *
   * > **Note**: `runSync` performs the run phase, not other phases.
   *
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   *   Tree to transform and inspect.
   * @param {Compatible | undefined} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @returns {TailTree extends undefined ? Node : TailTree}
   *   Transformed tree.
   */
  runSync(t, n) {
    let r = !1, i;
    return this.run(t, n, o), jr("runSync", "run", r), i;
    function o(l, a) {
      _r(l), i = a, r = !0;
    }
  }
  /**
   * Compile a syntax tree.
   *
   * > **Note**: `stringify` freezes the processor if not already *frozen*.
   *
   * > **Note**: `stringify` performs the stringify phase, not the run phase
   * > or other phases.
   *
   * @param {CompileTree extends undefined ? Node : CompileTree} tree
   *   Tree to compile.
   * @param {Compatible | undefined} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @returns {CompileResult extends undefined ? Value : CompileResult}
   *   Textual representation of the tree (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most compilers
   *   > return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  stringify(t, n) {
    this.freeze();
    const r = Tt(n), i = this.compiler || this.Compiler;
    return un("stringify", i), Hr(t), i(t, r);
  }
  /**
   * Configure the processor to use a plugin, a list of usable values, or a
   * preset.
   *
   * If the processor is already using a plugin, the previous plugin
   * configuration is changed based on the options that are passed in.
   * In other words, the plugin is not added a second time.
   *
   * > **Note**: `use` cannot be called on *frozen* processors.
   * > Call the processor first to create a new unfrozen processor.
   *
   * @example
   *   There are many ways to pass plugins to `.use()`.
   *   This example gives an overview:
   *
   *   ```js
   *   import {unified} from 'unified'
   *
   *   unified()
   *     // Plugin with options:
   *     .use(pluginA, {x: true, y: true})
   *     // Passing the same plugin again merges configuration (to `{x: true, y: false, z: true}`):
   *     .use(pluginA, {y: false, z: true})
   *     // Plugins:
   *     .use([pluginB, pluginC])
   *     // Two plugins, the second with options:
   *     .use([pluginD, [pluginE, {}]])
   *     // Preset with plugins and settings:
   *     .use({plugins: [pluginF, [pluginG, {}]], settings: {position: false}})
   *     // Settings only:
   *     .use({settings: {position: false}})
   *   ```
   *
   * @template {Array<unknown>} [Parameters=[]]
   * @template {Node | string | undefined} [Input=undefined]
   * @template [Output=Input]
   *
   * @overload
   * @param {Preset | null | undefined} [preset]
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {PluggableList} list
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {Plugin<Parameters, Input, Output>} plugin
   * @param {...(Parameters | [boolean])} parameters
   * @returns {UsePlugin<ParseTree, HeadTree, TailTree, CompileTree, CompileResult, Input, Output>}
   *
   * @param {PluggableList | Plugin | Preset | null | undefined} value
   *   Usable value.
   * @param {...unknown} parameters
   *   Parameters, when a plugin is given as a usable value.
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   Current processor.
   */
  use(t, ...n) {
    const r = this.attachers, i = this.namespace;
    if (cn("use", this.frozen), t != null) if (typeof t == "function")
      u(t, n);
    else if (typeof t == "object")
      Array.isArray(t) ? a(t) : l(t);
    else
      throw new TypeError("Expected usable value, not `" + t + "`");
    return this;
    function o(s) {
      if (typeof s == "function")
        u(s, []);
      else if (typeof s == "object")
        if (Array.isArray(s)) {
          const [f, ...c] = (
            /** @type {PluginTuple<Array<unknown>>} */
            s
          );
          u(f, c);
        } else
          l(s);
      else
        throw new TypeError("Expected usable value, not `" + s + "`");
    }
    function l(s) {
      if (!("plugins" in s) && !("settings" in s))
        throw new Error(
          "Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither"
        );
      a(s.plugins), s.settings && (i.settings = rn(!0, i.settings, s.settings));
    }
    function a(s) {
      let f = -1;
      if (s != null) if (Array.isArray(s))
        for (; ++f < s.length; ) {
          const c = s[f];
          o(c);
        }
      else
        throw new TypeError("Expected a list of plugins, not `" + s + "`");
    }
    function u(s, f) {
      let c = -1, p = -1;
      for (; ++c < r.length; )
        if (r[c][0] === s) {
          p = c;
          break;
        }
      if (p === -1)
        r.push([s, ...f]);
      else if (f.length > 0) {
        let [h, ...g] = f;
        const k = r[p][1];
        En(k) && En(h) && (h = rn(!0, k, h)), r[p] = [s, h, ...g];
      }
    }
  }
}
const Ec = new Wn().freeze();
function sn(e, t) {
  if (typeof t != "function")
    throw new TypeError("Cannot `" + e + "` without `parser`");
}
function un(e, t) {
  if (typeof t != "function")
    throw new TypeError("Cannot `" + e + "` without `compiler`");
}
function cn(e, t) {
  if (t)
    throw new Error(
      "Cannot call `" + e + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`."
    );
}
function Hr(e) {
  if (!En(e) || typeof e.type != "string")
    throw new TypeError("Expected node, got `" + e + "`");
}
function jr(e, t, n) {
  if (!n)
    throw new Error(
      "`" + e + "` finished async. Use `" + t + "` instead"
    );
}
function Tt(e) {
  return Ac(e) ? e : new Bi(e);
}
function Ac(e) {
  return !!(e && typeof e == "object" && "message" in e && "messages" in e);
}
function Ic(e) {
  return typeof e == "string" || Tc(e);
}
function Tc(e) {
  return !!(e && typeof e == "object" && "byteLength" in e && "byteOffset" in e);
}
const Mc = "https://github.com/remarkjs/react-markdown/blob/main/changelog.md", Zr = [], $r = { allowDangerousHtml: !0 }, Fc = /^(https?|ircs?|mailto|xmpp)$/i, Lc = [
  { from: "astPlugins", id: "remove-buggy-html-in-markdown-parser" },
  { from: "allowDangerousHtml", id: "remove-buggy-html-in-markdown-parser" },
  {
    from: "allowNode",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "allowElement"
  },
  {
    from: "allowedTypes",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "allowedElements"
  },
  { from: "className", id: "remove-classname" },
  {
    from: "disallowedTypes",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "disallowedElements"
  },
  { from: "escapeHtml", id: "remove-buggy-html-in-markdown-parser" },
  { from: "includeElementIndex", id: "#remove-includeelementindex" },
  {
    from: "includeNodeIndex",
    id: "change-includenodeindex-to-includeelementindex"
  },
  { from: "linkTarget", id: "remove-linktarget" },
  { from: "plugins", id: "change-plugins-to-remarkplugins", to: "remarkPlugins" },
  { from: "rawSourcePos", id: "#remove-rawsourcepos" },
  { from: "renderers", id: "change-renderers-to-components", to: "components" },
  { from: "source", id: "change-source-to-children", to: "children" },
  { from: "sourcePos", id: "#remove-sourcepos" },
  { from: "transformImageUri", id: "#add-urltransform", to: "urlTransform" },
  { from: "transformLinkUri", id: "#add-urltransform", to: "urlTransform" }
];
function Pc(e) {
  const t = zc(e), n = Dc(e);
  return Rc(t.runSync(t.parse(n), n), e);
}
function zc(e) {
  const t = e.rehypePlugins || Zr, n = e.remarkPlugins || Zr, r = e.remarkRehypeOptions ? { ...e.remarkRehypeOptions, ...$r } : $r;
  return Ec().use(pu).use(n).use(ac, r).use(t);
}
function Dc(e) {
  const t = e.children || "", n = new Bi();
  return typeof t == "string" && (n.value = t), n;
}
function Rc(e, t) {
  const n = t.allowedElements, r = t.allowElement, i = t.components, o = t.disallowedElements, l = t.skipHtml, a = t.unwrapDisallowed, u = t.urlTransform || Nc;
  for (const f of Lc)
    Object.hasOwn(t, f.from) && ("" + f.from + (f.to ? "use `" + f.to + "` instead" : "remove it") + Mc + f.id, void 0);
  return qn(e, s), Qo(e, {
    Fragment: ct,
    components: i,
    ignoreInvalidStyle: !0,
    jsx: I,
    jsxs: re,
    passKeys: !0,
    passNode: !0
  });
  function s(f, c, p) {
    if (f.type === "raw" && p && typeof c == "number")
      return l ? p.children.splice(c, 1) : p.children[c] = { type: "text", value: f.value }, c;
    if (f.type === "element") {
      let h;
      for (h in Kt)
        if (Object.hasOwn(Kt, h) && Object.hasOwn(f.properties, h)) {
          const g = f.properties[h], k = Kt[h];
          (k === null || k.includes(f.tagName)) && (f.properties[h] = u(String(g || ""), h, f));
        }
    }
    if (f.type === "element") {
      let h = n ? !n.includes(f.tagName) : o ? o.includes(f.tagName) : !1;
      if (!h && r && typeof c == "number" && (h = !r(f, c, p)), h && p && typeof c == "number")
        return a && f.children ? p.children.splice(c, 1, ...f.children) : p.children.splice(c, 1), c;
    }
  }
}
function Nc(e) {
  const t = e.indexOf(":"), n = e.indexOf("?"), r = e.indexOf("#"), i = e.indexOf("/");
  return (
    // If there is no protocol, it’s relative.
    t === -1 || // If the first colon is after a `?`, `#`, or `/`, it’s not a protocol.
    i !== -1 && t > i || n !== -1 && t > n || r !== -1 && t > r || // It is a protocol, it should be allowed.
    Fc.test(e.slice(0, t)) ? e : ""
  );
}
function Ur(e, t) {
  const n = String(e);
  if (typeof t != "string")
    throw new TypeError("Expected character");
  let r = 0, i = n.indexOf(t);
  for (; i !== -1; )
    r++, i = n.indexOf(t, i + t.length);
  return r;
}
function Oc(e) {
  if (typeof e != "string")
    throw new TypeError("Expected a string");
  return e.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
function _c(e, t, n) {
  const i = Vt((n || {}).ignore || []), o = Bc(t);
  let l = -1;
  for (; ++l < o.length; )
    _i(e, "text", a);
  function a(s, f) {
    let c = -1, p;
    for (; ++c < f.length; ) {
      const h = f[c], g = p ? p.children : void 0;
      if (i(
        h,
        g ? g.indexOf(h) : void 0,
        p
      ))
        return;
      p = h;
    }
    if (p)
      return u(s, f);
  }
  function u(s, f) {
    const c = f[f.length - 1], p = o[l][0], h = o[l][1];
    let g = 0;
    const S = c.children.indexOf(s);
    let x = !1, v = [];
    p.lastIndex = 0;
    let E = p.exec(s.value);
    for (; E; ) {
      const R = E.index, N = {
        index: E.index,
        input: E.input,
        stack: [...f, s]
      };
      let w = h(...E, N);
      if (typeof w == "string" && (w = w.length > 0 ? { type: "text", value: w } : void 0), w === !1 ? p.lastIndex = R + 1 : (g !== R && v.push({
        type: "text",
        value: s.value.slice(g, R)
      }), Array.isArray(w) ? v.push(...w) : w && v.push(w), g = R + E[0].length, x = !0), !p.global)
        break;
      E = p.exec(s.value);
    }
    return x ? (g < s.value.length && v.push({ type: "text", value: s.value.slice(g) }), c.children.splice(S, 1, ...v)) : v = [s], S + v.length;
  }
}
function Bc(e) {
  const t = [];
  if (!Array.isArray(e))
    throw new TypeError("Expected find and replace tuple or list of tuples");
  const n = !e[0] || Array.isArray(e[0]) ? e : [e];
  let r = -1;
  for (; ++r < n.length; ) {
    const i = n[r];
    t.push([Vc(i[0]), Hc(i[1])]);
  }
  return t;
}
function Vc(e) {
  return typeof e == "string" ? new RegExp(Oc(e), "g") : e;
}
function Hc(e) {
  return typeof e == "function" ? e : function() {
    return e;
  };
}
const fn = "phrasing", hn = ["autolink", "link", "image", "label"];
function jc() {
  return {
    transforms: [Yc],
    enter: {
      literalAutolink: $c,
      literalAutolinkEmail: pn,
      literalAutolinkHttp: pn,
      literalAutolinkWww: pn
    },
    exit: {
      literalAutolink: Xc,
      literalAutolinkEmail: Wc,
      literalAutolinkHttp: Uc,
      literalAutolinkWww: qc
    }
  };
}
function Zc() {
  return {
    unsafe: [
      {
        character: "@",
        before: "[+\\-.\\w]",
        after: "[\\-.\\w]",
        inConstruct: fn,
        notInConstruct: hn
      },
      {
        character: ".",
        before: "[Ww]",
        after: "[\\-.\\w]",
        inConstruct: fn,
        notInConstruct: hn
      },
      {
        character: ":",
        before: "[ps]",
        after: "\\/",
        inConstruct: fn,
        notInConstruct: hn
      }
    ]
  };
}
function $c(e) {
  this.enter({ type: "link", title: null, url: "", children: [] }, e);
}
function pn(e) {
  this.config.enter.autolinkProtocol.call(this, e);
}
function Uc(e) {
  this.config.exit.autolinkProtocol.call(this, e);
}
function qc(e) {
  this.config.exit.data.call(this, e);
  const t = this.stack[this.stack.length - 1];
  t.type, t.url = "http://" + this.sliceSerialize(e);
}
function Wc(e) {
  this.config.exit.autolinkEmail.call(this, e);
}
function Xc(e) {
  this.exit(e);
}
function Yc(e) {
  _c(
    e,
    [
      [/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi, Qc],
      [new RegExp("(?<=^|\\s|\\p{P}|\\p{S})([-.\\w+]+)@([-\\w]+(?:\\.[-\\w]+)+)", "gu"), Jc]
    ],
    { ignore: ["link", "linkReference"] }
  );
}
function Qc(e, t, n, r, i) {
  let o = "";
  if (!Vi(i) || (/^w/i.test(t) && (n = t + n, t = "", o = "http://"), !Gc(n)))
    return !1;
  const l = Kc(n + r);
  if (!l[0]) return !1;
  const a = {
    type: "link",
    title: null,
    url: o + t + l[0],
    children: [{ type: "text", value: t + l[0] }]
  };
  return l[1] ? [a, { type: "text", value: l[1] }] : a;
}
function Jc(e, t, n, r) {
  return (
    // Not an expected previous character.
    !Vi(r, !0) || // Label ends in not allowed character.
    /[-\d_]$/.test(n) ? !1 : {
      type: "link",
      title: null,
      url: "mailto:" + t + "@" + n,
      children: [{ type: "text", value: t + "@" + n }]
    }
  );
}
function Gc(e) {
  const t = e.split(".");
  return !(t.length < 2 || t[t.length - 1] && (/_/.test(t[t.length - 1]) || !/[a-zA-Z\d]/.test(t[t.length - 1])) || t[t.length - 2] && (/_/.test(t[t.length - 2]) || !/[a-zA-Z\d]/.test(t[t.length - 2])));
}
function Kc(e) {
  const t = /[!"&'),.:;<>?\]}]+$/.exec(e);
  if (!t)
    return [e, void 0];
  e = e.slice(0, t.index);
  let n = t[0], r = n.indexOf(")");
  const i = Ur(e, "(");
  let o = Ur(e, ")");
  for (; r !== -1 && i > o; )
    e += n.slice(0, r + 1), n = n.slice(r + 1), r = n.indexOf(")"), o++;
  return [e, n];
}
function Vi(e, t) {
  const n = e.input.charCodeAt(e.index - 1);
  return (e.index === 0 || qe(n) || Ot(n)) && // If it’s an email, the previous character should not be a slash.
  (!t || n !== 47);
}
Hi.peek = uf;
function ef() {
  this.buffer();
}
function tf(e) {
  this.enter({ type: "footnoteReference", identifier: "", label: "" }, e);
}
function nf() {
  this.buffer();
}
function rf(e) {
  this.enter(
    { type: "footnoteDefinition", identifier: "", label: "", children: [] },
    e
  );
}
function lf(e) {
  const t = this.resume(), n = this.stack[this.stack.length - 1];
  n.type, n.identifier = Fe(
    this.sliceSerialize(e)
  ).toLowerCase(), n.label = t;
}
function of(e) {
  this.exit(e);
}
function af(e) {
  const t = this.resume(), n = this.stack[this.stack.length - 1];
  n.type, n.identifier = Fe(
    this.sliceSerialize(e)
  ).toLowerCase(), n.label = t;
}
function sf(e) {
  this.exit(e);
}
function uf() {
  return "[";
}
function Hi(e, t, n, r) {
  const i = n.createTracker(r);
  let o = i.move("[^");
  const l = n.enter("footnoteReference"), a = n.enter("reference");
  return o += i.move(
    n.safe(n.associationId(e), { after: "]", before: o })
  ), a(), l(), o += i.move("]"), o;
}
function cf() {
  return {
    enter: {
      gfmFootnoteCallString: ef,
      gfmFootnoteCall: tf,
      gfmFootnoteDefinitionLabelString: nf,
      gfmFootnoteDefinition: rf
    },
    exit: {
      gfmFootnoteCallString: lf,
      gfmFootnoteCall: of,
      gfmFootnoteDefinitionLabelString: af,
      gfmFootnoteDefinition: sf
    }
  };
}
function ff(e) {
  let t = !1;
  return e && e.firstLineBlank && (t = !0), {
    handlers: { footnoteDefinition: n, footnoteReference: Hi },
    // This is on by default already.
    unsafe: [{ character: "[", inConstruct: ["label", "phrasing", "reference"] }]
  };
  function n(r, i, o, l) {
    const a = o.createTracker(l);
    let u = a.move("[^");
    const s = o.enter("footnoteDefinition"), f = o.enter("label");
    return u += a.move(
      o.safe(o.associationId(r), { before: u, after: "]" })
    ), f(), u += a.move("]:"), r.children && r.children.length > 0 && (a.shift(4), u += a.move(
      (t ? `
` : " ") + o.indentLines(
        o.containerFlow(r, a.current()),
        t ? ji : hf
      )
    )), s(), u;
  }
}
function hf(e, t, n) {
  return t === 0 ? e : ji(e, t, n);
}
function ji(e, t, n) {
  return (n ? "" : "    ") + e;
}
const pf = [
  "autolink",
  "destinationLiteral",
  "destinationRaw",
  "reference",
  "titleQuote",
  "titleApostrophe"
];
Zi.peek = xf;
function mf() {
  return {
    canContainEols: ["delete"],
    enter: { strikethrough: gf },
    exit: { strikethrough: yf }
  };
}
function df() {
  return {
    unsafe: [
      {
        character: "~",
        inConstruct: "phrasing",
        notInConstruct: pf
      }
    ],
    handlers: { delete: Zi }
  };
}
function gf(e) {
  this.enter({ type: "delete", children: [] }, e);
}
function yf(e) {
  this.exit(e);
}
function Zi(e, t, n, r) {
  const i = n.createTracker(r), o = n.enter("strikethrough");
  let l = i.move("~~");
  return l += n.containerPhrasing(e, {
    ...i.current(),
    before: l,
    after: "~"
  }), l += i.move("~~"), o(), l;
}
function xf() {
  return "~";
}
function kf(e) {
  return e.length;
}
function bf(e, t) {
  const n = t || {}, r = (n.align || []).concat(), i = n.stringLength || kf, o = [], l = [], a = [], u = [];
  let s = 0, f = -1;
  for (; ++f < e.length; ) {
    const k = [], S = [];
    let x = -1;
    for (e[f].length > s && (s = e[f].length); ++x < e[f].length; ) {
      const v = wf(e[f][x]);
      if (n.alignDelimiters !== !1) {
        const E = i(v);
        S[x] = E, (u[x] === void 0 || E > u[x]) && (u[x] = E);
      }
      k.push(v);
    }
    l[f] = k, a[f] = S;
  }
  let c = -1;
  if (typeof r == "object" && "length" in r)
    for (; ++c < s; )
      o[c] = qr(r[c]);
  else {
    const k = qr(r);
    for (; ++c < s; )
      o[c] = k;
  }
  c = -1;
  const p = [], h = [];
  for (; ++c < s; ) {
    const k = o[c];
    let S = "", x = "";
    k === 99 ? (S = ":", x = ":") : k === 108 ? S = ":" : k === 114 && (x = ":");
    let v = n.alignDelimiters === !1 ? 1 : Math.max(
      1,
      u[c] - S.length - x.length
    );
    const E = S + "-".repeat(v) + x;
    n.alignDelimiters !== !1 && (v = S.length + v + x.length, v > u[c] && (u[c] = v), h[c] = v), p[c] = E;
  }
  l.splice(1, 0, p), a.splice(1, 0, h), f = -1;
  const g = [];
  for (; ++f < l.length; ) {
    const k = l[f], S = a[f];
    c = -1;
    const x = [];
    for (; ++c < s; ) {
      const v = k[c] || "";
      let E = "", R = "";
      if (n.alignDelimiters !== !1) {
        const N = u[c] - (S[c] || 0), w = o[c];
        w === 114 ? E = " ".repeat(N) : w === 99 ? N % 2 ? (E = " ".repeat(N / 2 + 0.5), R = " ".repeat(N / 2 - 0.5)) : (E = " ".repeat(N / 2), R = E) : R = " ".repeat(N);
      }
      n.delimiterStart !== !1 && !c && x.push("|"), n.padding !== !1 && // Don’t add the opening space if we’re not aligning and the cell is
      // empty: there will be a closing space.
      !(n.alignDelimiters === !1 && v === "") && (n.delimiterStart !== !1 || c) && x.push(" "), n.alignDelimiters !== !1 && x.push(E), x.push(v), n.alignDelimiters !== !1 && x.push(R), n.padding !== !1 && x.push(" "), (n.delimiterEnd !== !1 || c !== s - 1) && x.push("|");
    }
    g.push(
      n.delimiterEnd === !1 ? x.join("").replace(/ +$/, "") : x.join("")
    );
  }
  return g.join(`
`);
}
function wf(e) {
  return e == null ? "" : String(e);
}
function qr(e) {
  const t = typeof e == "string" ? e.codePointAt(0) : 0;
  return t === 67 || t === 99 ? 99 : t === 76 || t === 108 ? 108 : t === 82 || t === 114 ? 114 : 0;
}
function Cf(e, t, n, r) {
  const i = n.enter("blockquote"), o = n.createTracker(r);
  o.move("> "), o.shift(2);
  const l = n.indentLines(
    n.containerFlow(e, o.current()),
    vf
  );
  return i(), l;
}
function vf(e, t, n) {
  return ">" + (n ? "" : " ") + e;
}
function Sf(e, t) {
  return Wr(e, t.inConstruct, !0) && !Wr(e, t.notInConstruct, !1);
}
function Wr(e, t, n) {
  if (typeof t == "string" && (t = [t]), !t || t.length === 0)
    return n;
  let r = -1;
  for (; ++r < t.length; )
    if (e.includes(t[r]))
      return !0;
  return !1;
}
function Xr(e, t, n, r) {
  let i = -1;
  for (; ++i < n.unsafe.length; )
    if (n.unsafe[i].character === `
` && Sf(n.stack, n.unsafe[i]))
      return /[ \t]/.test(r.before) ? "" : " ";
  return `\\
`;
}
function Ef(e, t) {
  const n = String(e);
  let r = n.indexOf(t), i = r, o = 0, l = 0;
  if (typeof t != "string")
    throw new TypeError("Expected substring");
  for (; r !== -1; )
    r === i ? ++o > l && (l = o) : o = 1, i = r + t.length, r = n.indexOf(t, i);
  return l;
}
function Af(e, t) {
  return !!(t.options.fences === !1 && e.value && // If there’s no info…
  !e.lang && // And there’s a non-whitespace character…
  /[^ \r\n]/.test(e.value) && // And the value doesn’t start or end in a blank…
  !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(e.value));
}
function If(e) {
  const t = e.options.fence || "`";
  if (t !== "`" && t !== "~")
    throw new Error(
      "Cannot serialize code with `" + t + "` for `options.fence`, expected `` ` `` or `~`"
    );
  return t;
}
function Tf(e, t, n, r) {
  const i = If(n), o = e.value || "", l = i === "`" ? "GraveAccent" : "Tilde";
  if (Af(e, n)) {
    const c = n.enter("codeIndented"), p = n.indentLines(o, Mf);
    return c(), p;
  }
  const a = n.createTracker(r), u = i.repeat(Math.max(Ef(o, i) + 1, 3)), s = n.enter("codeFenced");
  let f = a.move(u);
  if (e.lang) {
    const c = n.enter(`codeFencedLang${l}`);
    f += a.move(
      n.safe(e.lang, {
        before: f,
        after: " ",
        encode: ["`"],
        ...a.current()
      })
    ), c();
  }
  if (e.lang && e.meta) {
    const c = n.enter(`codeFencedMeta${l}`);
    f += a.move(" "), f += a.move(
      n.safe(e.meta, {
        before: f,
        after: `
`,
        encode: ["`"],
        ...a.current()
      })
    ), c();
  }
  return f += a.move(`
`), o && (f += a.move(o + `
`)), f += a.move(u), s(), f;
}
function Mf(e, t, n) {
  return (n ? "" : "    ") + e;
}
function Xn(e) {
  const t = e.options.quote || '"';
  if (t !== '"' && t !== "'")
    throw new Error(
      "Cannot serialize title with `" + t + "` for `options.quote`, expected `\"`, or `'`"
    );
  return t;
}
function Ff(e, t, n, r) {
  const i = Xn(n), o = i === '"' ? "Quote" : "Apostrophe", l = n.enter("definition");
  let a = n.enter("label");
  const u = n.createTracker(r);
  let s = u.move("[");
  return s += u.move(
    n.safe(n.associationId(e), {
      before: s,
      after: "]",
      ...u.current()
    })
  ), s += u.move("]: "), a(), // If there’s no url, or…
  !e.url || // If there are control characters or whitespace.
  /[\0- \u007F]/.test(e.url) ? (a = n.enter("destinationLiteral"), s += u.move("<"), s += u.move(
    n.safe(e.url, { before: s, after: ">", ...u.current() })
  ), s += u.move(">")) : (a = n.enter("destinationRaw"), s += u.move(
    n.safe(e.url, {
      before: s,
      after: e.title ? " " : `
`,
      ...u.current()
    })
  )), a(), e.title && (a = n.enter(`title${o}`), s += u.move(" " + i), s += u.move(
    n.safe(e.title, {
      before: s,
      after: i,
      ...u.current()
    })
  ), s += u.move(i), a()), l(), s;
}
function Lf(e) {
  const t = e.options.emphasis || "*";
  if (t !== "*" && t !== "_")
    throw new Error(
      "Cannot serialize emphasis with `" + t + "` for `options.emphasis`, expected `*`, or `_`"
    );
  return t;
}
function dt(e) {
  return "&#x" + e.toString(16).toUpperCase() + ";";
}
function Rt(e, t, n) {
  const r = tt(e), i = tt(t);
  return r === void 0 ? i === void 0 ? (
    // Letter inside:
    // we have to encode *both* letters for `_` as it is looser.
    // it already forms for `*` (and GFMs `~`).
    n === "_" ? { inside: !0, outside: !0 } : { inside: !1, outside: !1 }
  ) : i === 1 ? (
    // Whitespace inside: encode both (letter, whitespace).
    { inside: !0, outside: !0 }
  ) : (
    // Punctuation inside: encode outer (letter)
    { inside: !1, outside: !0 }
  ) : r === 1 ? i === void 0 ? (
    // Letter inside: already forms.
    { inside: !1, outside: !1 }
  ) : i === 1 ? (
    // Whitespace inside: encode both (whitespace).
    { inside: !0, outside: !0 }
  ) : (
    // Punctuation inside: already forms.
    { inside: !1, outside: !1 }
  ) : i === void 0 ? (
    // Letter inside: already forms.
    { inside: !1, outside: !1 }
  ) : i === 1 ? (
    // Whitespace inside: encode inner (whitespace).
    { inside: !0, outside: !1 }
  ) : (
    // Punctuation inside: already forms.
    { inside: !1, outside: !1 }
  );
}
$i.peek = Pf;
function $i(e, t, n, r) {
  const i = Lf(n), o = n.enter("emphasis"), l = n.createTracker(r), a = l.move(i);
  let u = l.move(
    n.containerPhrasing(e, {
      after: i,
      before: a,
      ...l.current()
    })
  );
  const s = u.charCodeAt(0), f = Rt(
    r.before.charCodeAt(r.before.length - 1),
    s,
    i
  );
  f.inside && (u = dt(s) + u.slice(1));
  const c = u.charCodeAt(u.length - 1), p = Rt(r.after.charCodeAt(0), c, i);
  p.inside && (u = u.slice(0, -1) + dt(c));
  const h = l.move(i);
  return o(), n.attentionEncodeSurroundingInfo = {
    after: p.outside,
    before: f.outside
  }, a + u + h;
}
function Pf(e, t, n) {
  return n.options.emphasis || "*";
}
function zf(e, t) {
  let n = !1;
  return qn(e, function(r) {
    if ("value" in r && /\r?\n|\r/.test(r.value) || r.type === "break")
      return n = !0, vn;
  }), !!((!e.depth || e.depth < 3) && Bn(e) && (t.options.setext || n));
}
function Df(e, t, n, r) {
  const i = Math.max(Math.min(6, e.depth || 1), 1), o = n.createTracker(r);
  if (zf(e, n)) {
    const f = n.enter("headingSetext"), c = n.enter("phrasing"), p = n.containerPhrasing(e, {
      ...o.current(),
      before: `
`,
      after: `
`
    });
    return c(), f(), p + `
` + (i === 1 ? "=" : "-").repeat(
      // The whole size…
      p.length - // Minus the position of the character after the last EOL (or
      // 0 if there is none)…
      (Math.max(p.lastIndexOf("\r"), p.lastIndexOf(`
`)) + 1)
    );
  }
  const l = "#".repeat(i), a = n.enter("headingAtx"), u = n.enter("phrasing");
  o.move(l + " ");
  let s = n.containerPhrasing(e, {
    before: "# ",
    after: `
`,
    ...o.current()
  });
  return /^[\t ]/.test(s) && (s = dt(s.charCodeAt(0)) + s.slice(1)), s = s ? l + " " + s : l, n.options.closeAtx && (s += " " + l), u(), a(), s;
}
Ui.peek = Rf;
function Ui(e) {
  return e.value || "";
}
function Rf() {
  return "<";
}
qi.peek = Nf;
function qi(e, t, n, r) {
  const i = Xn(n), o = i === '"' ? "Quote" : "Apostrophe", l = n.enter("image");
  let a = n.enter("label");
  const u = n.createTracker(r);
  let s = u.move("![");
  return s += u.move(
    n.safe(e.alt, { before: s, after: "]", ...u.current() })
  ), s += u.move("]("), a(), // If there’s no url but there is a title…
  !e.url && e.title || // If there are control characters or whitespace.
  /[\0- \u007F]/.test(e.url) ? (a = n.enter("destinationLiteral"), s += u.move("<"), s += u.move(
    n.safe(e.url, { before: s, after: ">", ...u.current() })
  ), s += u.move(">")) : (a = n.enter("destinationRaw"), s += u.move(
    n.safe(e.url, {
      before: s,
      after: e.title ? " " : ")",
      ...u.current()
    })
  )), a(), e.title && (a = n.enter(`title${o}`), s += u.move(" " + i), s += u.move(
    n.safe(e.title, {
      before: s,
      after: i,
      ...u.current()
    })
  ), s += u.move(i), a()), s += u.move(")"), l(), s;
}
function Nf() {
  return "!";
}
Wi.peek = Of;
function Wi(e, t, n, r) {
  const i = e.referenceType, o = n.enter("imageReference");
  let l = n.enter("label");
  const a = n.createTracker(r);
  let u = a.move("![");
  const s = n.safe(e.alt, {
    before: u,
    after: "]",
    ...a.current()
  });
  u += a.move(s + "]["), l();
  const f = n.stack;
  n.stack = [], l = n.enter("reference");
  const c = n.safe(n.associationId(e), {
    before: u,
    after: "]",
    ...a.current()
  });
  return l(), n.stack = f, o(), i === "full" || !s || s !== c ? u += a.move(c + "]") : i === "shortcut" ? u = u.slice(0, -1) : u += a.move("]"), u;
}
function Of() {
  return "!";
}
Xi.peek = _f;
function Xi(e, t, n) {
  let r = e.value || "", i = "`", o = -1;
  for (; new RegExp("(^|[^`])" + i + "([^`]|$)").test(r); )
    i += "`";
  for (/[^ \r\n]/.test(r) && (/^[ \r\n]/.test(r) && /[ \r\n]$/.test(r) || /^`|`$/.test(r)) && (r = " " + r + " "); ++o < n.unsafe.length; ) {
    const l = n.unsafe[o], a = n.compilePattern(l);
    let u;
    if (l.atBreak)
      for (; u = a.exec(r); ) {
        let s = u.index;
        r.charCodeAt(s) === 10 && r.charCodeAt(s - 1) === 13 && s--, r = r.slice(0, s) + " " + r.slice(u.index + 1);
      }
  }
  return i + r + i;
}
function _f() {
  return "`";
}
function Yi(e, t) {
  const n = Bn(e);
  return !!(!t.options.resourceLink && // If there’s a url…
  e.url && // And there’s a no title…
  !e.title && // And the content of `node` is a single text node…
  e.children && e.children.length === 1 && e.children[0].type === "text" && // And if the url is the same as the content…
  (n === e.url || "mailto:" + n === e.url) && // And that starts w/ a protocol…
  /^[a-z][a-z+.-]+:/i.test(e.url) && // And that doesn’t contain ASCII control codes (character escapes and
  // references don’t work), space, or angle brackets…
  !/[\0- <>\u007F]/.test(e.url));
}
Qi.peek = Bf;
function Qi(e, t, n, r) {
  const i = Xn(n), o = i === '"' ? "Quote" : "Apostrophe", l = n.createTracker(r);
  let a, u;
  if (Yi(e, n)) {
    const f = n.stack;
    n.stack = [], a = n.enter("autolink");
    let c = l.move("<");
    return c += l.move(
      n.containerPhrasing(e, {
        before: c,
        after: ">",
        ...l.current()
      })
    ), c += l.move(">"), a(), n.stack = f, c;
  }
  a = n.enter("link"), u = n.enter("label");
  let s = l.move("[");
  return s += l.move(
    n.containerPhrasing(e, {
      before: s,
      after: "](",
      ...l.current()
    })
  ), s += l.move("]("), u(), // If there’s no url but there is a title…
  !e.url && e.title || // If there are control characters or whitespace.
  /[\0- \u007F]/.test(e.url) ? (u = n.enter("destinationLiteral"), s += l.move("<"), s += l.move(
    n.safe(e.url, { before: s, after: ">", ...l.current() })
  ), s += l.move(">")) : (u = n.enter("destinationRaw"), s += l.move(
    n.safe(e.url, {
      before: s,
      after: e.title ? " " : ")",
      ...l.current()
    })
  )), u(), e.title && (u = n.enter(`title${o}`), s += l.move(" " + i), s += l.move(
    n.safe(e.title, {
      before: s,
      after: i,
      ...l.current()
    })
  ), s += l.move(i), u()), s += l.move(")"), a(), s;
}
function Bf(e, t, n) {
  return Yi(e, n) ? "<" : "[";
}
Ji.peek = Vf;
function Ji(e, t, n, r) {
  const i = e.referenceType, o = n.enter("linkReference");
  let l = n.enter("label");
  const a = n.createTracker(r);
  let u = a.move("[");
  const s = n.containerPhrasing(e, {
    before: u,
    after: "]",
    ...a.current()
  });
  u += a.move(s + "]["), l();
  const f = n.stack;
  n.stack = [], l = n.enter("reference");
  const c = n.safe(n.associationId(e), {
    before: u,
    after: "]",
    ...a.current()
  });
  return l(), n.stack = f, o(), i === "full" || !s || s !== c ? u += a.move(c + "]") : i === "shortcut" ? u = u.slice(0, -1) : u += a.move("]"), u;
}
function Vf() {
  return "[";
}
function Yn(e) {
  const t = e.options.bullet || "*";
  if (t !== "*" && t !== "+" && t !== "-")
    throw new Error(
      "Cannot serialize items with `" + t + "` for `options.bullet`, expected `*`, `+`, or `-`"
    );
  return t;
}
function Hf(e) {
  const t = Yn(e), n = e.options.bulletOther;
  if (!n)
    return t === "*" ? "-" : "*";
  if (n !== "*" && n !== "+" && n !== "-")
    throw new Error(
      "Cannot serialize items with `" + n + "` for `options.bulletOther`, expected `*`, `+`, or `-`"
    );
  if (n === t)
    throw new Error(
      "Expected `bullet` (`" + t + "`) and `bulletOther` (`" + n + "`) to be different"
    );
  return n;
}
function jf(e) {
  const t = e.options.bulletOrdered || ".";
  if (t !== "." && t !== ")")
    throw new Error(
      "Cannot serialize items with `" + t + "` for `options.bulletOrdered`, expected `.` or `)`"
    );
  return t;
}
function Gi(e) {
  const t = e.options.rule || "*";
  if (t !== "*" && t !== "-" && t !== "_")
    throw new Error(
      "Cannot serialize rules with `" + t + "` for `options.rule`, expected `*`, `-`, or `_`"
    );
  return t;
}
function Zf(e, t, n, r) {
  const i = n.enter("list"), o = n.bulletCurrent;
  let l = e.ordered ? jf(n) : Yn(n);
  const a = e.ordered ? l === "." ? ")" : "." : Hf(n);
  let u = t && n.bulletLastUsed ? l === n.bulletLastUsed : !1;
  if (!e.ordered) {
    const f = e.children ? e.children[0] : void 0;
    if (
      // Bullet could be used as a thematic break marker:
      (l === "*" || l === "-") && // Empty first list item:
      f && (!f.children || !f.children[0]) && // Directly in two other list items:
      n.stack[n.stack.length - 1] === "list" && n.stack[n.stack.length - 2] === "listItem" && n.stack[n.stack.length - 3] === "list" && n.stack[n.stack.length - 4] === "listItem" && // That are each the first child.
      n.indexStack[n.indexStack.length - 1] === 0 && n.indexStack[n.indexStack.length - 2] === 0 && n.indexStack[n.indexStack.length - 3] === 0 && (u = !0), Gi(n) === l && f
    ) {
      let c = -1;
      for (; ++c < e.children.length; ) {
        const p = e.children[c];
        if (p && p.type === "listItem" && p.children && p.children[0] && p.children[0].type === "thematicBreak") {
          u = !0;
          break;
        }
      }
    }
  }
  u && (l = a), n.bulletCurrent = l;
  const s = n.containerFlow(e, r);
  return n.bulletLastUsed = l, n.bulletCurrent = o, i(), s;
}
function $f(e) {
  const t = e.options.listItemIndent || "one";
  if (t !== "tab" && t !== "one" && t !== "mixed")
    throw new Error(
      "Cannot serialize items with `" + t + "` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`"
    );
  return t;
}
function Uf(e, t, n, r) {
  const i = $f(n);
  let o = n.bulletCurrent || Yn(n);
  t && t.type === "list" && t.ordered && (o = (typeof t.start == "number" && t.start > -1 ? t.start : 1) + (n.options.incrementListMarker === !1 ? 0 : t.children.indexOf(e)) + o);
  let l = o.length + 1;
  (i === "tab" || i === "mixed" && (t && t.type === "list" && t.spread || e.spread)) && (l = Math.ceil(l / 4) * 4);
  const a = n.createTracker(r);
  a.move(o + " ".repeat(l - o.length)), a.shift(l);
  const u = n.enter("listItem"), s = n.indentLines(
    n.containerFlow(e, a.current()),
    f
  );
  return u(), s;
  function f(c, p, h) {
    return p ? (h ? "" : " ".repeat(l)) + c : (h ? o : o + " ".repeat(l - o.length)) + c;
  }
}
function qf(e, t, n, r) {
  const i = n.enter("paragraph"), o = n.enter("phrasing"), l = n.containerPhrasing(e, r);
  return o(), i(), l;
}
const Wf = (
  /** @type {(node?: unknown) => node is Exclude<PhrasingContent, Html>} */
  Vt([
    "break",
    "delete",
    "emphasis",
    // To do: next major: removed since footnotes were added to GFM.
    "footnote",
    "footnoteReference",
    "image",
    "imageReference",
    "inlineCode",
    // Enabled by `mdast-util-math`:
    "inlineMath",
    "link",
    "linkReference",
    // Enabled by `mdast-util-mdx`:
    "mdxJsxTextElement",
    // Enabled by `mdast-util-mdx`:
    "mdxTextExpression",
    "strong",
    "text",
    // Enabled by `mdast-util-directive`:
    "textDirective"
  ])
);
function Xf(e, t, n, r) {
  return (e.children.some(function(l) {
    return Wf(l);
  }) ? n.containerPhrasing : n.containerFlow).call(n, e, r);
}
function Yf(e) {
  const t = e.options.strong || "*";
  if (t !== "*" && t !== "_")
    throw new Error(
      "Cannot serialize strong with `" + t + "` for `options.strong`, expected `*`, or `_`"
    );
  return t;
}
Ki.peek = Qf;
function Ki(e, t, n, r) {
  const i = Yf(n), o = n.enter("strong"), l = n.createTracker(r), a = l.move(i + i);
  let u = l.move(
    n.containerPhrasing(e, {
      after: i,
      before: a,
      ...l.current()
    })
  );
  const s = u.charCodeAt(0), f = Rt(
    r.before.charCodeAt(r.before.length - 1),
    s,
    i
  );
  f.inside && (u = dt(s) + u.slice(1));
  const c = u.charCodeAt(u.length - 1), p = Rt(r.after.charCodeAt(0), c, i);
  p.inside && (u = u.slice(0, -1) + dt(c));
  const h = l.move(i + i);
  return o(), n.attentionEncodeSurroundingInfo = {
    after: p.outside,
    before: f.outside
  }, a + u + h;
}
function Qf(e, t, n) {
  return n.options.strong || "*";
}
function Jf(e, t, n, r) {
  return n.safe(e.value, r);
}
function Gf(e) {
  const t = e.options.ruleRepetition || 3;
  if (t < 3)
    throw new Error(
      "Cannot serialize rules with repetition `" + t + "` for `options.ruleRepetition`, expected `3` or more"
    );
  return t;
}
function Kf(e, t, n) {
  const r = (Gi(n) + (n.options.ruleSpaces ? " " : "")).repeat(Gf(n));
  return n.options.ruleSpaces ? r.slice(0, -1) : r;
}
const el = {
  blockquote: Cf,
  break: Xr,
  code: Tf,
  definition: Ff,
  emphasis: $i,
  hardBreak: Xr,
  heading: Df,
  html: Ui,
  image: qi,
  imageReference: Wi,
  inlineCode: Xi,
  link: Qi,
  linkReference: Ji,
  list: Zf,
  listItem: Uf,
  paragraph: qf,
  root: Xf,
  strong: Ki,
  text: Jf,
  thematicBreak: Kf
};
function eh() {
  return {
    enter: {
      table: th,
      tableData: Yr,
      tableHeader: Yr,
      tableRow: rh
    },
    exit: {
      codeText: ih,
      table: nh,
      tableData: mn,
      tableHeader: mn,
      tableRow: mn
    }
  };
}
function th(e) {
  const t = e._align;
  this.enter(
    {
      type: "table",
      align: t.map(function(n) {
        return n === "none" ? null : n;
      }),
      children: []
    },
    e
  ), this.data.inTable = !0;
}
function nh(e) {
  this.exit(e), this.data.inTable = void 0;
}
function rh(e) {
  this.enter({ type: "tableRow", children: [] }, e);
}
function mn(e) {
  this.exit(e);
}
function Yr(e) {
  this.enter({ type: "tableCell", children: [] }, e);
}
function ih(e) {
  let t = this.resume();
  this.data.inTable && (t = t.replace(/\\([\\|])/g, lh));
  const n = this.stack[this.stack.length - 1];
  n.type, n.value = t, this.exit(e);
}
function lh(e, t) {
  return t === "|" ? t : e;
}
function oh(e) {
  const t = e || {}, n = t.tableCellPadding, r = t.tablePipeAlign, i = t.stringLength, o = n ? " " : "|";
  return {
    unsafe: [
      { character: "\r", inConstruct: "tableCell" },
      { character: `
`, inConstruct: "tableCell" },
      // A pipe, when followed by a tab or space (padding), or a dash or colon
      // (unpadded delimiter row), could result in a table.
      { atBreak: !0, character: "|", after: "[	 :-]" },
      // A pipe in a cell must be encoded.
      { character: "|", inConstruct: "tableCell" },
      // A colon must be followed by a dash, in which case it could start a
      // delimiter row.
      { atBreak: !0, character: ":", after: "-" },
      // A delimiter row can also start with a dash, when followed by more
      // dashes, a colon, or a pipe.
      // This is a stricter version than the built in check for lists, thematic
      // breaks, and setex heading underlines though:
      // <https://github.com/syntax-tree/mdast-util-to-markdown/blob/51a2038/lib/unsafe.js#L57>
      { atBreak: !0, character: "-", after: "[:|-]" }
    ],
    handlers: {
      inlineCode: p,
      table: l,
      tableCell: u,
      tableRow: a
    }
  };
  function l(h, g, k, S) {
    return s(f(h, k, S), h.align);
  }
  function a(h, g, k, S) {
    const x = c(h, k, S), v = s([x]);
    return v.slice(0, v.indexOf(`
`));
  }
  function u(h, g, k, S) {
    const x = k.enter("tableCell"), v = k.enter("phrasing"), E = k.containerPhrasing(h, {
      ...S,
      before: o,
      after: o
    });
    return v(), x(), E;
  }
  function s(h, g) {
    return bf(h, {
      align: g,
      // @ts-expect-error: `markdown-table` types should support `null`.
      alignDelimiters: r,
      // @ts-expect-error: `markdown-table` types should support `null`.
      padding: n,
      // @ts-expect-error: `markdown-table` types should support `null`.
      stringLength: i
    });
  }
  function f(h, g, k) {
    const S = h.children;
    let x = -1;
    const v = [], E = g.enter("table");
    for (; ++x < S.length; )
      v[x] = c(S[x], g, k);
    return E(), v;
  }
  function c(h, g, k) {
    const S = h.children;
    let x = -1;
    const v = [], E = g.enter("tableRow");
    for (; ++x < S.length; )
      v[x] = u(S[x], h, g, k);
    return E(), v;
  }
  function p(h, g, k) {
    let S = el.inlineCode(h, g, k);
    return k.stack.includes("tableCell") && (S = S.replace(/\|/g, "\\$&")), S;
  }
}
function ah() {
  return {
    exit: {
      taskListCheckValueChecked: Qr,
      taskListCheckValueUnchecked: Qr,
      paragraph: uh
    }
  };
}
function sh() {
  return {
    unsafe: [{ atBreak: !0, character: "-", after: "[:|-]" }],
    handlers: { listItem: ch }
  };
}
function Qr(e) {
  const t = this.stack[this.stack.length - 2];
  t.type, t.checked = e.type === "taskListCheckValueChecked";
}
function uh(e) {
  const t = this.stack[this.stack.length - 2];
  if (t && t.type === "listItem" && typeof t.checked == "boolean") {
    const n = this.stack[this.stack.length - 1];
    n.type;
    const r = n.children[0];
    if (r && r.type === "text") {
      const i = t.children;
      let o = -1, l;
      for (; ++o < i.length; ) {
        const a = i[o];
        if (a.type === "paragraph") {
          l = a;
          break;
        }
      }
      l === n && (r.value = r.value.slice(1), r.value.length === 0 ? n.children.shift() : n.position && r.position && typeof r.position.start.offset == "number" && (r.position.start.column++, r.position.start.offset++, n.position.start = Object.assign({}, r.position.start)));
    }
  }
  this.exit(e);
}
function ch(e, t, n, r) {
  const i = e.children[0], o = typeof e.checked == "boolean" && i && i.type === "paragraph", l = "[" + (e.checked ? "x" : " ") + "] ", a = n.createTracker(r);
  o && a.move(l);
  let u = el.listItem(e, t, n, {
    ...r,
    ...a.current()
  });
  return o && (u = u.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, s)), u;
  function s(f) {
    return f + l;
  }
}
function fh() {
  return [
    jc(),
    cf(),
    mf(),
    eh(),
    ah()
  ];
}
function hh(e) {
  return {
    extensions: [
      Zc(),
      ff(e),
      df(),
      oh(e),
      sh()
    ]
  };
}
const ph = {
  tokenize: kh,
  partial: !0
}, tl = {
  tokenize: bh,
  partial: !0
}, nl = {
  tokenize: wh,
  partial: !0
}, rl = {
  tokenize: Ch,
  partial: !0
}, mh = {
  tokenize: vh,
  partial: !0
}, il = {
  name: "wwwAutolink",
  tokenize: yh,
  previous: ol
}, ll = {
  name: "protocolAutolink",
  tokenize: xh,
  previous: al
}, Re = {
  name: "emailAutolink",
  tokenize: gh,
  previous: sl
}, ze = {};
function dh() {
  return {
    text: ze
  };
}
let Ue = 48;
for (; Ue < 123; )
  ze[Ue] = Re, Ue++, Ue === 58 ? Ue = 65 : Ue === 91 && (Ue = 97);
ze[43] = Re;
ze[45] = Re;
ze[46] = Re;
ze[95] = Re;
ze[72] = [Re, ll];
ze[104] = [Re, ll];
ze[87] = [Re, il];
ze[119] = [Re, il];
function gh(e, t, n) {
  const r = this;
  let i, o;
  return l;
  function l(c) {
    return !In(c) || !sl.call(r, r.previous) || Qn(r.events) ? n(c) : (e.enter("literalAutolink"), e.enter("literalAutolinkEmail"), a(c));
  }
  function a(c) {
    return In(c) ? (e.consume(c), a) : c === 64 ? (e.consume(c), u) : n(c);
  }
  function u(c) {
    return c === 46 ? e.check(mh, f, s)(c) : c === 45 || c === 95 || fe(c) ? (o = !0, e.consume(c), u) : f(c);
  }
  function s(c) {
    return e.consume(c), i = !0, u;
  }
  function f(c) {
    return o && i && de(r.previous) ? (e.exit("literalAutolinkEmail"), e.exit("literalAutolink"), t(c)) : n(c);
  }
}
function yh(e, t, n) {
  const r = this;
  return i;
  function i(l) {
    return l !== 87 && l !== 119 || !ol.call(r, r.previous) || Qn(r.events) ? n(l) : (e.enter("literalAutolink"), e.enter("literalAutolinkWww"), e.check(ph, e.attempt(tl, e.attempt(nl, o), n), n)(l));
  }
  function o(l) {
    return e.exit("literalAutolinkWww"), e.exit("literalAutolink"), t(l);
  }
}
function xh(e, t, n) {
  const r = this;
  let i = "", o = !1;
  return l;
  function l(c) {
    return (c === 72 || c === 104) && al.call(r, r.previous) && !Qn(r.events) ? (e.enter("literalAutolink"), e.enter("literalAutolinkHttp"), i += String.fromCodePoint(c), e.consume(c), a) : n(c);
  }
  function a(c) {
    if (de(c) && i.length < 5)
      return i += String.fromCodePoint(c), e.consume(c), a;
    if (c === 58) {
      const p = i.toLowerCase();
      if (p === "http" || p === "https")
        return e.consume(c), u;
    }
    return n(c);
  }
  function u(c) {
    return c === 47 ? (e.consume(c), o ? s : (o = !0, u)) : n(c);
  }
  function s(c) {
    return c === null || Pt(c) || te(c) || qe(c) || Ot(c) ? n(c) : e.attempt(tl, e.attempt(nl, f), n)(c);
  }
  function f(c) {
    return e.exit("literalAutolinkHttp"), e.exit("literalAutolink"), t(c);
  }
}
function kh(e, t, n) {
  let r = 0;
  return i;
  function i(l) {
    return (l === 87 || l === 119) && r < 3 ? (r++, e.consume(l), i) : l === 46 && r === 3 ? (e.consume(l), o) : n(l);
  }
  function o(l) {
    return l === null ? n(l) : t(l);
  }
}
function bh(e, t, n) {
  let r, i, o;
  return l;
  function l(s) {
    return s === 46 || s === 95 ? e.check(rl, u, a)(s) : s === null || te(s) || qe(s) || s !== 45 && Ot(s) ? u(s) : (o = !0, e.consume(s), l);
  }
  function a(s) {
    return s === 95 ? r = !0 : (i = r, r = void 0), e.consume(s), l;
  }
  function u(s) {
    return i || r || !o ? n(s) : t(s);
  }
}
function wh(e, t) {
  let n = 0, r = 0;
  return i;
  function i(l) {
    return l === 40 ? (n++, e.consume(l), i) : l === 41 && r < n ? o(l) : l === 33 || l === 34 || l === 38 || l === 39 || l === 41 || l === 42 || l === 44 || l === 46 || l === 58 || l === 59 || l === 60 || l === 63 || l === 93 || l === 95 || l === 126 ? e.check(rl, t, o)(l) : l === null || te(l) || qe(l) ? t(l) : (e.consume(l), i);
  }
  function o(l) {
    return l === 41 && r++, e.consume(l), i;
  }
}
function Ch(e, t, n) {
  return r;
  function r(a) {
    return a === 33 || a === 34 || a === 39 || a === 41 || a === 42 || a === 44 || a === 46 || a === 58 || a === 59 || a === 63 || a === 95 || a === 126 ? (e.consume(a), r) : a === 38 ? (e.consume(a), o) : a === 93 ? (e.consume(a), i) : (
      // `<` is an end.
      a === 60 || // So is whitespace.
      a === null || te(a) || qe(a) ? t(a) : n(a)
    );
  }
  function i(a) {
    return a === null || a === 40 || a === 91 || te(a) || qe(a) ? t(a) : r(a);
  }
  function o(a) {
    return de(a) ? l(a) : n(a);
  }
  function l(a) {
    return a === 59 ? (e.consume(a), r) : de(a) ? (e.consume(a), l) : n(a);
  }
}
function vh(e, t, n) {
  return r;
  function r(o) {
    return e.consume(o), i;
  }
  function i(o) {
    return fe(o) ? n(o) : t(o);
  }
}
function ol(e) {
  return e === null || e === 40 || e === 42 || e === 95 || e === 91 || e === 93 || e === 126 || te(e);
}
function al(e) {
  return !de(e);
}
function sl(e) {
  return !(e === 47 || In(e));
}
function In(e) {
  return e === 43 || e === 45 || e === 46 || e === 95 || fe(e);
}
function Qn(e) {
  let t = e.length, n = !1;
  for (; t--; ) {
    const r = e[t][1];
    if ((r.type === "labelLink" || r.type === "labelImage") && !r._balanced) {
      n = !0;
      break;
    }
    if (r._gfmAutolinkLiteralWalkedInto) {
      n = !1;
      break;
    }
  }
  return e.length > 0 && !n && (e[e.length - 1][1]._gfmAutolinkLiteralWalkedInto = !0), n;
}
const Sh = {
  tokenize: Ph,
  partial: !0
};
function Eh() {
  return {
    document: {
      91: {
        name: "gfmFootnoteDefinition",
        tokenize: Mh,
        continuation: {
          tokenize: Fh
        },
        exit: Lh
      }
    },
    text: {
      91: {
        name: "gfmFootnoteCall",
        tokenize: Th
      },
      93: {
        name: "gfmPotentialFootnoteCall",
        add: "after",
        tokenize: Ah,
        resolveTo: Ih
      }
    }
  };
}
function Ah(e, t, n) {
  const r = this;
  let i = r.events.length;
  const o = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
  let l;
  for (; i--; ) {
    const u = r.events[i][1];
    if (u.type === "labelImage") {
      l = u;
      break;
    }
    if (u.type === "gfmFootnoteCall" || u.type === "labelLink" || u.type === "label" || u.type === "image" || u.type === "link")
      break;
  }
  return a;
  function a(u) {
    if (!l || !l._balanced)
      return n(u);
    const s = Fe(r.sliceSerialize({
      start: l.end,
      end: r.now()
    }));
    return s.codePointAt(0) !== 94 || !o.includes(s.slice(1)) ? n(u) : (e.enter("gfmFootnoteCallLabelMarker"), e.consume(u), e.exit("gfmFootnoteCallLabelMarker"), t(u));
  }
}
function Ih(e, t) {
  let n = e.length;
  for (; n--; )
    if (e[n][1].type === "labelImage" && e[n][0] === "enter") {
      e[n][1];
      break;
    }
  e[n + 1][1].type = "data", e[n + 3][1].type = "gfmFootnoteCallLabelMarker";
  const r = {
    type: "gfmFootnoteCall",
    start: Object.assign({}, e[n + 3][1].start),
    end: Object.assign({}, e[e.length - 1][1].end)
  }, i = {
    type: "gfmFootnoteCallMarker",
    start: Object.assign({}, e[n + 3][1].end),
    end: Object.assign({}, e[n + 3][1].end)
  };
  i.end.column++, i.end.offset++, i.end._bufferIndex++;
  const o = {
    type: "gfmFootnoteCallString",
    start: Object.assign({}, i.end),
    end: Object.assign({}, e[e.length - 1][1].start)
  }, l = {
    type: "chunkString",
    contentType: "string",
    start: Object.assign({}, o.start),
    end: Object.assign({}, o.end)
  }, a = [
    // Take the `labelImageMarker` (now `data`, the `!`)
    e[n + 1],
    e[n + 2],
    ["enter", r, t],
    // The `[`
    e[n + 3],
    e[n + 4],
    // The `^`.
    ["enter", i, t],
    ["exit", i, t],
    // Everything in between.
    ["enter", o, t],
    ["enter", l, t],
    ["exit", l, t],
    ["exit", o, t],
    // The ending (`]`, properly parsed and labelled).
    e[e.length - 2],
    e[e.length - 1],
    ["exit", r, t]
  ];
  return e.splice(n, e.length - n + 1, ...a), e;
}
function Th(e, t, n) {
  const r = this, i = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
  let o = 0, l;
  return a;
  function a(c) {
    return e.enter("gfmFootnoteCall"), e.enter("gfmFootnoteCallLabelMarker"), e.consume(c), e.exit("gfmFootnoteCallLabelMarker"), u;
  }
  function u(c) {
    return c !== 94 ? n(c) : (e.enter("gfmFootnoteCallMarker"), e.consume(c), e.exit("gfmFootnoteCallMarker"), e.enter("gfmFootnoteCallString"), e.enter("chunkString").contentType = "string", s);
  }
  function s(c) {
    if (
      // Too long.
      o > 999 || // Closing brace with nothing.
      c === 93 && !l || // Space or tab is not supported by GFM for some reason.
      // `\n` and `[` not being supported makes sense.
      c === null || c === 91 || te(c)
    )
      return n(c);
    if (c === 93) {
      e.exit("chunkString");
      const p = e.exit("gfmFootnoteCallString");
      return i.includes(Fe(r.sliceSerialize(p))) ? (e.enter("gfmFootnoteCallLabelMarker"), e.consume(c), e.exit("gfmFootnoteCallLabelMarker"), e.exit("gfmFootnoteCall"), t) : n(c);
    }
    return te(c) || (l = !0), o++, e.consume(c), c === 92 ? f : s;
  }
  function f(c) {
    return c === 91 || c === 92 || c === 93 ? (e.consume(c), o++, s) : s(c);
  }
}
function Mh(e, t, n) {
  const r = this, i = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
  let o, l = 0, a;
  return u;
  function u(g) {
    return e.enter("gfmFootnoteDefinition")._container = !0, e.enter("gfmFootnoteDefinitionLabel"), e.enter("gfmFootnoteDefinitionLabelMarker"), e.consume(g), e.exit("gfmFootnoteDefinitionLabelMarker"), s;
  }
  function s(g) {
    return g === 94 ? (e.enter("gfmFootnoteDefinitionMarker"), e.consume(g), e.exit("gfmFootnoteDefinitionMarker"), e.enter("gfmFootnoteDefinitionLabelString"), e.enter("chunkString").contentType = "string", f) : n(g);
  }
  function f(g) {
    if (
      // Too long.
      l > 999 || // Closing brace with nothing.
      g === 93 && !a || // Space or tab is not supported by GFM for some reason.
      // `\n` and `[` not being supported makes sense.
      g === null || g === 91 || te(g)
    )
      return n(g);
    if (g === 93) {
      e.exit("chunkString");
      const k = e.exit("gfmFootnoteDefinitionLabelString");
      return o = Fe(r.sliceSerialize(k)), e.enter("gfmFootnoteDefinitionLabelMarker"), e.consume(g), e.exit("gfmFootnoteDefinitionLabelMarker"), e.exit("gfmFootnoteDefinitionLabel"), p;
    }
    return te(g) || (a = !0), l++, e.consume(g), g === 92 ? c : f;
  }
  function c(g) {
    return g === 91 || g === 92 || g === 93 ? (e.consume(g), l++, f) : f(g);
  }
  function p(g) {
    return g === 58 ? (e.enter("definitionMarker"), e.consume(g), e.exit("definitionMarker"), i.includes(o) || i.push(o), Q(e, h, "gfmFootnoteDefinitionWhitespace")) : n(g);
  }
  function h(g) {
    return t(g);
  }
}
function Fh(e, t, n) {
  return e.check(yt, t, e.attempt(Sh, t, n));
}
function Lh(e) {
  e.exit("gfmFootnoteDefinition");
}
function Ph(e, t, n) {
  const r = this;
  return Q(e, i, "gfmFootnoteDefinitionIndent", 5);
  function i(o) {
    const l = r.events[r.events.length - 1];
    return l && l[1].type === "gfmFootnoteDefinitionIndent" && l[2].sliceSerialize(l[1], !0).length === 4 ? t(o) : n(o);
  }
}
function zh(e) {
  let n = (e || {}).singleTilde;
  const r = {
    name: "strikethrough",
    tokenize: o,
    resolveAll: i
  };
  return n == null && (n = !0), {
    text: {
      126: r
    },
    insideSpan: {
      null: [r]
    },
    attentionMarkers: {
      null: [126]
    }
  };
  function i(l, a) {
    let u = -1;
    for (; ++u < l.length; )
      if (l[u][0] === "enter" && l[u][1].type === "strikethroughSequenceTemporary" && l[u][1]._close) {
        let s = u;
        for (; s--; )
          if (l[s][0] === "exit" && l[s][1].type === "strikethroughSequenceTemporary" && l[s][1]._open && // If the sizes are the same:
          l[u][1].end.offset - l[u][1].start.offset === l[s][1].end.offset - l[s][1].start.offset) {
            l[u][1].type = "strikethroughSequence", l[s][1].type = "strikethroughSequence";
            const f = {
              type: "strikethrough",
              start: Object.assign({}, l[s][1].start),
              end: Object.assign({}, l[u][1].end)
            }, c = {
              type: "strikethroughText",
              start: Object.assign({}, l[s][1].end),
              end: Object.assign({}, l[u][1].start)
            }, p = [["enter", f, a], ["enter", l[s][1], a], ["exit", l[s][1], a], ["enter", c, a]], h = a.parser.constructs.insideSpan.null;
            h && Ce(p, p.length, 0, _t(h, l.slice(s + 1, u), a)), Ce(p, p.length, 0, [["exit", c, a], ["enter", l[u][1], a], ["exit", l[u][1], a], ["exit", f, a]]), Ce(l, s - 1, u - s + 3, p), u = s + p.length - 2;
            break;
          }
      }
    for (u = -1; ++u < l.length; )
      l[u][1].type === "strikethroughSequenceTemporary" && (l[u][1].type = "data");
    return l;
  }
  function o(l, a, u) {
    const s = this.previous, f = this.events;
    let c = 0;
    return p;
    function p(g) {
      return s === 126 && f[f.length - 1][1].type !== "characterEscape" ? u(g) : (l.enter("strikethroughSequenceTemporary"), h(g));
    }
    function h(g) {
      const k = tt(s);
      if (g === 126)
        return c > 1 ? u(g) : (l.consume(g), c++, h);
      if (c < 2 && !n) return u(g);
      const S = l.exit("strikethroughSequenceTemporary"), x = tt(g);
      return S._open = !x || x === 2 && !!k, S._close = !k || k === 2 && !!x, a(g);
    }
  }
}
class Dh {
  /**
   * Create a new edit map.
   */
  constructor() {
    this.map = [], this.index = /* @__PURE__ */ new Map();
  }
  /**
   * Create an edit: a remove and/or add at a certain place.
   *
   * @param {number} index
   *   Index at which to apply the edit.
   * @param {number} remove
   *   Count of items to remove at the index.
   * @param {Array<Event>} add
   *   Items to add at the index.
   * @returns {undefined}
   *   Nothing.
   */
  add(t, n, r) {
    Rh(this, t, n, r);
  }
  // To do: add this when moving to `micromark`.
  // /**
  //  * Create an edit: but insert `add` before existing additions.
  //  *
  //  * @param {number} index
  //  * @param {number} remove
  //  * @param {Array<Event>} add
  //  * @returns {undefined}
  //  */
  // addBefore(index, remove, add) {
  //   addImplementation(this, index, remove, add, true)
  // }
  /**
   * Done, change the events.
   *
   * @param {Array<Event>} events
   *   List of events to apply the edits to.
   * @returns {undefined}
   *   Nothing.
   */
  consume(t) {
    if (this.map.sort(function(o, l) {
      return o[0] - l[0];
    }), this.map.length === 0)
      return;
    let n = this.map.length;
    const r = [];
    for (; n > 0; )
      n -= 1, r.push(t.slice(this.map[n][0] + this.map[n][1]), this.map[n][2]), t.length = this.map[n][0];
    r.push(t.slice()), t.length = 0;
    let i = r.pop();
    for (; i; ) {
      for (const o of i)
        t.push(o);
      i = r.pop();
    }
    this.map.length = 0, this.index.clear();
  }
}
function Rh(e, t, n, r) {
  if (n === 0 && r.length === 0)
    return;
  const i = e.index.get(t);
  if (i) {
    i[1] += n, i[2].push(...r);
    return;
  }
  const o = [t, n, r];
  e.map.push(o), e.index.set(t, o);
}
function Nh(e, t) {
  let n = !1;
  const r = [];
  for (; t < e.length; ) {
    const i = e[t];
    if (n) {
      if (i[0] === "enter")
        i[1].type === "tableContent" && r.push(e[t + 1][1].type === "tableDelimiterMarker" ? "left" : "none");
      else if (i[1].type === "tableContent") {
        if (e[t - 1][1].type === "tableDelimiterMarker") {
          const o = r.length - 1;
          r[o] = r[o] === "left" ? "center" : "right";
        }
      } else if (i[1].type === "tableDelimiterRow")
        break;
    } else i[0] === "enter" && i[1].type === "tableDelimiterRow" && (n = !0);
    t += 1;
  }
  return r;
}
function Oh() {
  return {
    flow: {
      null: {
        name: "table",
        tokenize: _h,
        resolveAll: Bh
      }
    }
  };
}
function _h(e, t, n) {
  const r = this;
  let i = 0, o = 0, l;
  return a;
  function a(b) {
    let F = r.events.length - 1;
    for (; F > -1; ) {
      const {
        type: A
      } = r.events[F][1];
      if (A === "lineEnding" || // Note: markdown-rs uses `whitespace` instead of `linePrefix`
      A === "linePrefix")
        F--;
      else
        break;
    }
    const z = F > -1 ? r.events[F][1].type : null, D = z === "tableHead" || z === "tableRow" ? w : u;
    return D === w && r.parser.lazy[r.now().line] ? n(b) : D(b);
  }
  function u(b) {
    return e.enter("tableHead"), e.enter("tableRow"), s(b);
  }
  function s(b) {
    return b === 124 || (l = !0, o += 1), f(b);
  }
  function f(b) {
    return b === null ? n(b) : H(b) ? o > 1 ? (o = 0, r.interrupt = !0, e.exit("tableRow"), e.enter("lineEnding"), e.consume(b), e.exit("lineEnding"), h) : n(b) : W(b) ? Q(e, f, "whitespace")(b) : (o += 1, l && (l = !1, i += 1), b === 124 ? (e.enter("tableCellDivider"), e.consume(b), e.exit("tableCellDivider"), l = !0, f) : (e.enter("data"), c(b)));
  }
  function c(b) {
    return b === null || b === 124 || te(b) ? (e.exit("data"), f(b)) : (e.consume(b), b === 92 ? p : c);
  }
  function p(b) {
    return b === 92 || b === 124 ? (e.consume(b), c) : c(b);
  }
  function h(b) {
    return r.interrupt = !1, r.parser.lazy[r.now().line] ? n(b) : (e.enter("tableDelimiterRow"), l = !1, W(b) ? Q(e, g, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(b) : g(b));
  }
  function g(b) {
    return b === 45 || b === 58 ? S(b) : b === 124 ? (l = !0, e.enter("tableCellDivider"), e.consume(b), e.exit("tableCellDivider"), k) : N(b);
  }
  function k(b) {
    return W(b) ? Q(e, S, "whitespace")(b) : S(b);
  }
  function S(b) {
    return b === 58 ? (o += 1, l = !0, e.enter("tableDelimiterMarker"), e.consume(b), e.exit("tableDelimiterMarker"), x) : b === 45 ? (o += 1, x(b)) : b === null || H(b) ? R(b) : N(b);
  }
  function x(b) {
    return b === 45 ? (e.enter("tableDelimiterFiller"), v(b)) : N(b);
  }
  function v(b) {
    return b === 45 ? (e.consume(b), v) : b === 58 ? (l = !0, e.exit("tableDelimiterFiller"), e.enter("tableDelimiterMarker"), e.consume(b), e.exit("tableDelimiterMarker"), E) : (e.exit("tableDelimiterFiller"), E(b));
  }
  function E(b) {
    return W(b) ? Q(e, R, "whitespace")(b) : R(b);
  }
  function R(b) {
    return b === 124 ? g(b) : b === null || H(b) ? !l || i !== o ? N(b) : (e.exit("tableDelimiterRow"), e.exit("tableHead"), t(b)) : N(b);
  }
  function N(b) {
    return n(b);
  }
  function w(b) {
    return e.enter("tableRow"), P(b);
  }
  function P(b) {
    return b === 124 ? (e.enter("tableCellDivider"), e.consume(b), e.exit("tableCellDivider"), P) : b === null || H(b) ? (e.exit("tableRow"), t(b)) : W(b) ? Q(e, P, "whitespace")(b) : (e.enter("data"), L(b));
  }
  function L(b) {
    return b === null || b === 124 || te(b) ? (e.exit("data"), P(b)) : (e.consume(b), b === 92 ? V : L);
  }
  function V(b) {
    return b === 92 || b === 124 ? (e.consume(b), L) : L(b);
  }
}
function Bh(e, t) {
  let n = -1, r = !0, i = 0, o = [0, 0, 0, 0], l = [0, 0, 0, 0], a = !1, u = 0, s, f, c;
  const p = new Dh();
  for (; ++n < e.length; ) {
    const h = e[n], g = h[1];
    h[0] === "enter" ? g.type === "tableHead" ? (a = !1, u !== 0 && (Jr(p, t, u, s, f), f = void 0, u = 0), s = {
      type: "table",
      start: Object.assign({}, g.start),
      // Note: correct end is set later.
      end: Object.assign({}, g.end)
    }, p.add(n, 0, [["enter", s, t]])) : g.type === "tableRow" || g.type === "tableDelimiterRow" ? (r = !0, c = void 0, o = [0, 0, 0, 0], l = [0, n + 1, 0, 0], a && (a = !1, f = {
      type: "tableBody",
      start: Object.assign({}, g.start),
      // Note: correct end is set later.
      end: Object.assign({}, g.end)
    }, p.add(n, 0, [["enter", f, t]])), i = g.type === "tableDelimiterRow" ? 2 : f ? 3 : 1) : i && (g.type === "data" || g.type === "tableDelimiterMarker" || g.type === "tableDelimiterFiller") ? (r = !1, l[2] === 0 && (o[1] !== 0 && (l[0] = l[1], c = Mt(p, t, o, i, void 0, c), o = [0, 0, 0, 0]), l[2] = n)) : g.type === "tableCellDivider" && (r ? r = !1 : (o[1] !== 0 && (l[0] = l[1], c = Mt(p, t, o, i, void 0, c)), o = l, l = [o[1], n, 0, 0])) : g.type === "tableHead" ? (a = !0, u = n) : g.type === "tableRow" || g.type === "tableDelimiterRow" ? (u = n, o[1] !== 0 ? (l[0] = l[1], c = Mt(p, t, o, i, n, c)) : l[1] !== 0 && (c = Mt(p, t, l, i, n, c)), i = 0) : i && (g.type === "data" || g.type === "tableDelimiterMarker" || g.type === "tableDelimiterFiller") && (l[3] = n);
  }
  for (u !== 0 && Jr(p, t, u, s, f), p.consume(t.events), n = -1; ++n < t.events.length; ) {
    const h = t.events[n];
    h[0] === "enter" && h[1].type === "table" && (h[1]._align = Nh(t.events, n));
  }
  return e;
}
function Mt(e, t, n, r, i, o) {
  const l = r === 1 ? "tableHeader" : r === 2 ? "tableDelimiter" : "tableData", a = "tableContent";
  n[0] !== 0 && (o.end = Object.assign({}, Ke(t.events, n[0])), e.add(n[0], 0, [["exit", o, t]]));
  const u = Ke(t.events, n[1]);
  if (o = {
    type: l,
    start: Object.assign({}, u),
    // Note: correct end is set later.
    end: Object.assign({}, u)
  }, e.add(n[1], 0, [["enter", o, t]]), n[2] !== 0) {
    const s = Ke(t.events, n[2]), f = Ke(t.events, n[3]), c = {
      type: a,
      start: Object.assign({}, s),
      end: Object.assign({}, f)
    };
    if (e.add(n[2], 0, [["enter", c, t]]), r !== 2) {
      const p = t.events[n[2]], h = t.events[n[3]];
      if (p[1].end = Object.assign({}, h[1].end), p[1].type = "chunkText", p[1].contentType = "text", n[3] > n[2] + 1) {
        const g = n[2] + 1, k = n[3] - n[2] - 1;
        e.add(g, k, []);
      }
    }
    e.add(n[3] + 1, 0, [["exit", c, t]]);
  }
  return i !== void 0 && (o.end = Object.assign({}, Ke(t.events, i)), e.add(i, 0, [["exit", o, t]]), o = void 0), o;
}
function Jr(e, t, n, r, i) {
  const o = [], l = Ke(t.events, n);
  i && (i.end = Object.assign({}, l), o.push(["exit", i, t])), r.end = Object.assign({}, l), o.push(["exit", r, t]), e.add(n + 1, 0, o);
}
function Ke(e, t) {
  const n = e[t], r = n[0] === "enter" ? "start" : "end";
  return n[1][r];
}
const Vh = {
  name: "tasklistCheck",
  tokenize: jh
};
function Hh() {
  return {
    text: {
      91: Vh
    }
  };
}
function jh(e, t, n) {
  const r = this;
  return i;
  function i(u) {
    return (
      // Exit if there’s stuff before.
      r.previous !== null || // Exit if not in the first content that is the first child of a list
      // item.
      !r._gfmTasklistFirstContentOfListItem ? n(u) : (e.enter("taskListCheck"), e.enter("taskListCheckMarker"), e.consume(u), e.exit("taskListCheckMarker"), o)
    );
  }
  function o(u) {
    return te(u) ? (e.enter("taskListCheckValueUnchecked"), e.consume(u), e.exit("taskListCheckValueUnchecked"), l) : u === 88 || u === 120 ? (e.enter("taskListCheckValueChecked"), e.consume(u), e.exit("taskListCheckValueChecked"), l) : n(u);
  }
  function l(u) {
    return u === 93 ? (e.enter("taskListCheckMarker"), e.consume(u), e.exit("taskListCheckMarker"), e.exit("taskListCheck"), a) : n(u);
  }
  function a(u) {
    return H(u) ? t(u) : W(u) ? e.check({
      tokenize: Zh
    }, t, n)(u) : n(u);
  }
}
function Zh(e, t, n) {
  return Q(e, r, "whitespace");
  function r(i) {
    return i === null ? n(i) : t(i);
  }
}
function $h(e) {
  return ki([
    dh(),
    Eh(),
    zh(e),
    Oh(),
    Hh()
  ]);
}
const Uh = {};
function qh(e) {
  const t = (
    /** @type {Processor<Root>} */
    this
  ), n = e || Uh, r = t.data(), i = r.micromarkExtensions || (r.micromarkExtensions = []), o = r.fromMarkdownExtensions || (r.fromMarkdownExtensions = []), l = r.toMarkdownExtensions || (r.toMarkdownExtensions = []);
  i.push($h(n)), o.push(fh()), l.push(hh(n));
}
const Wh = ({
  content: e,
  isLoading: t,
  role: n
}) => /* @__PURE__ */ re("div", { className: "markdown-content", children: [
  /* @__PURE__ */ I(
    Pc,
    {
      remarkPlugins: [qh],
      components: {
        p: ({ children: r }) => /* @__PURE__ */ I("p", { className: "mb-3 last:mb-0", children: r }),
        ul: ({ children: r }) => /* @__PURE__ */ I("ul", { className: "list-disc list-inside mb-3 last:mb-0", children: r }),
        ol: ({ children: r }) => /* @__PURE__ */ I("ol", { className: "list-decimal list-inside mb-3 last:mb-0", children: r }),
        li: ({ children: r }) => /* @__PURE__ */ I("li", { className: "mb-0.5", children: r }),
        code: ({ children: r, ...i }) => !("inline" in i) || i.inline ? /* @__PURE__ */ I("code", { className: "px-1 py-0.5 rounded bg-black bg-opacity-10 text-sm", children: r }) : /* @__PURE__ */ I("pre", { className: "p-2 rounded bg-black bg-opacity-10 overflow-x-auto text-sm", children: /* @__PURE__ */ I("code", { children: r }) }),
        a: ({ children: r, href: i }) => /* @__PURE__ */ I(
          "a",
          {
            href: i,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "underline hover:opacity-80",
            children: r
          }
        ),
        strong: ({ children: r }) => /* @__PURE__ */ I("strong", { className: "font-semibold", children: r }),
        em: ({ children: r }) => /* @__PURE__ */ I("em", { className: "italic", children: r }),
        h1: ({ children: r }) => /* @__PURE__ */ I("h1", { className: "text-lg font-bold mb-1", children: r }),
        h2: ({ children: r }) => /* @__PURE__ */ I("h2", { className: "text-base font-bold mb-1", children: r }),
        h3: ({ children: r }) => /* @__PURE__ */ I("h3", { className: "text-sm font-bold mb-1", children: r }),
        blockquote: ({ children: r }) => /* @__PURE__ */ I("blockquote", { className: "border-l-2 pl-2 my-3 opacity-80", children: r }),
        // The widget's CSS reset strips input appearance, which would leave
        // GFM task-list checkboxes invisible.
        input: ({ type: r, checked: i }) => r === "checkbox" ? /* @__PURE__ */ I(
          "input",
          {
            type: "checkbox",
            checked: i,
            disabled: !0,
            className: "appearance-auto mr-1 align-middle"
          }
        ) : null,
        del: ({ children: r }) => /* @__PURE__ */ I("del", { className: "line-through", children: r }),
        // The message bubble is max-w-xs, so wide tables scroll sideways
        // instead of overflowing the widget.
        table: ({ children: r }) => /* @__PURE__ */ I("div", { className: "overflow-x-auto mb-3 last:mb-0", children: /* @__PURE__ */ I("table", { className: "border-collapse text-xs", children: r }) }),
        th: ({ children: r, style: i }) => /* @__PURE__ */ I(
          "th",
          {
            className: "border border-solid border-current bg-black bg-opacity-10 px-2 py-1 font-semibold text-left align-top",
            style: i,
            children: r
          }
        ),
        td: ({ children: r, style: i }) => /* @__PURE__ */ I(
          "td",
          {
            className: "border border-solid border-current px-2 py-1 align-top",
            style: i,
            children: r
          }
        )
      },
      children: e
    }
  ),
  t && n === "assistant" && /* @__PURE__ */ I("span", { className: "inline-block w-0.5 h-4 ml-0.5 bg-current animate-blink" })
] }), Xh = ({
  role: e,
  content: t,
  colors: n,
  styles: r,
  isLoading: i = !1
}) => /* @__PURE__ */ I("div", { className: `flex ${e === "user" ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ I(
  "div",
  {
    className: `max-w-xs px-3 py-2 ${ao[r.radius]} text-sm`,
    style: {
      backgroundColor: e === "user" ? n.accentColor : (r.theme === "dark", n.baseColor),
      color: e === "user" || r.theme === "dark" ? "#FFFFFF" : "#1F2937",
      ...e === "assistant" && {
        filter: r.theme === "dark" ? "brightness(1.5) contrast(0.9)" : "brightness(0.95) contrast(1.05)"
      }
    },
    children: /* @__PURE__ */ I(Wh, { content: t, isLoading: i, role: e })
  }
) }), Gr = ({
  mode: e,
  isCallActive: t,
  theme: n,
  voiceEmptyMessage: r,
  voiceActiveEmptyMessage: i,
  chatEmptyMessage: o,
  hybridEmptyMessage: l
}) => /* @__PURE__ */ re("div", { className: "text-center", children: [
  /* @__PURE__ */ I(
    "div",
    {
      className: `w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${n === "dark" ? "bg-gray-700" : "bg-gray-100"}`,
      children: e === "voice" ? /* @__PURE__ */ I(
        Nt,
        {
          size: 32,
          className: "text-gray-400"
        }
      ) : /* @__PURE__ */ I(
        ni,
        {
          size: 32,
          className: "text-gray-400"
        }
      )
    }
  ),
  /* @__PURE__ */ I(
    "p",
    {
      className: `text-sm ${n === "dark" ? "text-gray-400" : "text-gray-500"}`,
      children: e === "voice" ? t ? i : r : e === "chat" ? o : l
    }
  )
] }), Yh = ({
  isCallActive: e,
  connectionStatus: t,
  isAvailable: n,
  isMuted: r,
  onToggleCall: i,
  onToggleMute: o,
  startButtonText: l,
  endButtonText: a,
  colors: u,
  labels: s
}) => /* @__PURE__ */ re("div", { className: "flex items-center justify-center space-x-2", children: [
  e && t === "connected" && /* @__PURE__ */ I(
    "button",
    {
      onClick: o,
      className: "h-12 w-12 flex items-center justify-center rounded-full transition-all hover:opacity-90 active:scale-95",
      style: {
        backgroundColor: r ? "#ef4444" : u.accentColor,
        color: u.ctaButtonTextColor || "white"
      },
      title: r ? s.unmuteMicrophone : s.muteMicrophone,
      children: r ? /* @__PURE__ */ I(Mn, { size: 20, weight: "fill" }) : /* @__PURE__ */ I(Nt, { size: 20, weight: "fill" })
    }
  ),
  /* @__PURE__ */ I(
    "button",
    {
      onClick: i,
      disabled: !n && !e,
      className: `px-6 py-3 rounded-full font-medium transition-all flex items-center space-x-2 ${!n && !e ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 active:scale-95"}`,
      style: {
        backgroundColor: e ? "#ef4444" : u.accentColor,
        color: u.ctaButtonTextColor || "white"
      },
      children: t === "connecting" ? /* @__PURE__ */ re(ct, { children: [
        /* @__PURE__ */ I("div", { className: "animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" }),
        /* @__PURE__ */ I("span", { children: s.connecting })
      ] }) : e ? /* @__PURE__ */ re(ct, { children: [
        /* @__PURE__ */ I(Ln, { size: 16, weight: "fill" }),
        /* @__PURE__ */ I("span", { children: a })
      ] }) : /* @__PURE__ */ re(ct, { children: [
        /* @__PURE__ */ I(Pn, { size: 16, weight: "bold" }),
        /* @__PURE__ */ I("span", { children: l })
      ] })
    }
  )
] }), Qh = ({
  chatInput: e,
  isAvailable: t,
  onInputChange: n,
  onSendMessage: r,
  colors: i,
  styles: o,
  inputRef: l,
  placeholder: a = "Type your message...",
  // Default fallback
  labels: u
}) => /* @__PURE__ */ re("div", { className: "flex items-center space-x-2", children: [
  /* @__PURE__ */ I(
    "input",
    {
      ref: l,
      type: "text",
      value: e,
      onChange: n,
      onKeyPress: (s) => s.key === "Enter" && t && r(),
      placeholder: a,
      className: `flex-1 px-3 py-2 rounded-lg border ${o.theme === "dark" ? "border-gray-600 text-white placeholder-gray-400" : "border-gray-300 text-gray-900 placeholder-gray-500"} focus:outline-none focus:ring-2`,
      style: {
        "--tw-ring-color": o.theme === "dark" ? `${i.accentColor}33` : `${i.accentColor}80`,
        // 50% opacity in light mode
        backgroundColor: i.baseColor,
        filter: o.theme === "dark" ? "brightness(1.8)" : "brightness(0.98)"
      }
    }
  ),
  /* @__PURE__ */ I(
    "button",
    {
      onClick: r,
      disabled: !e.trim() || !t,
      className: `h-10 w-10 flex items-center justify-center rounded-lg transition-all ${!e.trim() || !t ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 active:scale-95"}`,
      style: {
        backgroundColor: i.accentColor,
        color: i.ctaButtonTextColor || "white"
      },
      title: u.sendMessage,
      children: /* @__PURE__ */ I(Fn, { size: 20, weight: "fill" })
    }
  )
] }), Jh = ({
  chatInput: e,
  isCallActive: t,
  connectionStatus: n,
  isChatAvailable: r,
  isVoiceAvailable: i,
  isMuted: o,
  onInputChange: l,
  onSendMessage: a,
  onToggleCall: u,
  onToggleMute: s,
  colors: f,
  styles: c,
  inputRef: p,
  placeholder: h = "Type your message...",
  // Default fallback
  labels: g
}) => /* @__PURE__ */ re("div", { className: "flex items-center space-x-2", children: [
  /* @__PURE__ */ I(
    "input",
    {
      ref: p,
      type: "text",
      value: e,
      onChange: l,
      onKeyPress: (k) => k.key === "Enter" && r && !t && a(),
      placeholder: h,
      disabled: t,
      className: `flex-1 px-3 py-2 rounded-lg border ${c.theme === "dark" ? "border-gray-600 text-white placeholder-gray-400" : "border-gray-300 text-gray-900 placeholder-gray-500"} focus:outline-none focus:ring-2 ${t ? "opacity-50 cursor-not-allowed" : ""}`,
      style: {
        "--tw-ring-color": c.theme === "dark" ? `${f.accentColor}33` : `${f.accentColor}80`,
        // 50% opacity in light mode
        backgroundColor: f.baseColor,
        filter: c.theme === "dark" ? "brightness(1.8)" : "brightness(0.98)"
      }
    }
  ),
  /* @__PURE__ */ I(
    "button",
    {
      onClick: a,
      disabled: !e.trim() || !r || t,
      className: `h-10 w-10 flex items-center justify-center rounded-lg transition-all ${!e.trim() || !r || t ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 active:scale-95"}`,
      style: {
        backgroundColor: f.accentColor,
        color: f.ctaButtonTextColor || "white"
      },
      title: g.sendMessage,
      children: /* @__PURE__ */ I(Fn, { size: 20, weight: "fill" })
    }
  ),
  t && n === "connected" && /* @__PURE__ */ I(
    "button",
    {
      onClick: s,
      className: "h-10 w-10 flex items-center justify-center rounded-lg transition-all hover:opacity-90 active:scale-95",
      style: {
        backgroundColor: o ? "#ef4444" : f.accentColor,
        color: f.ctaButtonTextColor || "white"
      },
      title: o ? g.unmuteMicrophone : g.muteMicrophone,
      children: o ? /* @__PURE__ */ I(Mn, { size: 20, weight: "fill" }) : /* @__PURE__ */ I(Nt, { size: 20, weight: "fill" })
    }
  ),
  /* @__PURE__ */ I(
    "button",
    {
      onClick: u,
      disabled: !i && !t,
      className: `h-10 w-10 flex items-center justify-center rounded-lg transition-all ${!i && !t ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 active:scale-95"}`,
      style: {
        backgroundColor: t ? "#ef4444" : f.accentColor,
        color: f.ctaButtonTextColor || "white"
      },
      title: n === "connecting" ? g.connecting : t ? g.stopVoiceCall : g.startVoiceCall,
      children: n === "connecting" ? /* @__PURE__ */ I("div", { className: "animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" }) : t ? /* @__PURE__ */ I(Ln, { size: 20, weight: "fill" }) : /* @__PURE__ */ I(Pn, { size: 20, weight: "bold" })
    }
  )
] }), n0 = ({
  publicKey: e,
  assistantId: t,
  assistant: n,
  assistantOverrides: r,
  apiUrl: i,
  position: o = "bottom-right",
  size: l = "full",
  borderRadius: a,
  radius: u = "medium",
  // deprecated
  mode: s = "chat",
  theme: f = "light",
  // Colors
  baseBgColor: c,
  baseColor: p,
  // deprecated
  accentColor: h,
  ctaButtonColor: g,
  buttonBaseColor: k,
  // deprecated
  ctaButtonTextColor: S,
  buttonAccentColor: x,
  // deprecated
  // Text labels
  title: v,
  mainLabel: E,
  // deprecated
  startButtonText: R,
  endButtonText: N,
  ctaTitle: w,
  ctaSubtitle: P,
  // Empty messages
  voiceEmptyMessage: L,
  emptyVoiceMessage: V = "Click the start button to begin a conversation",
  // deprecated
  voiceActiveEmptyMessage: b,
  emptyVoiceActiveMessage: F = "Listening...",
  // deprecated
  chatEmptyMessage: z,
  emptyChatMessage: D = "Type a message to start chatting",
  // deprecated
  hybridEmptyMessage: A,
  emptyHybridMessage: O = "Use voice or text to communicate",
  // deprecated
  // Chat configuration
  chatFirstMessage: Z,
  chatEndMessage: J,
  firstChatMessage: q,
  // deprecated
  chatPlaceholder: X,
  // Voice configuration
  voiceShowTranscript: d,
  showTranscript: _ = !1,
  // deprecated
  voiceAutoReconnect: Y = !1,
  voiceReconnectStorage: m = "session",
  reconnectStorageKey: G = "vapi_widget_web_call",
  // Consent configuration
  consentRequired: ae,
  requireConsent: K = !1,
  // deprecated
  consentTitle: pe,
  consentContent: le,
  termsContent: ve = 'By clicking "Agree," and each time I interact with this AI agent, I consent to the recording, storage, and sharing of my communications with third-party service providers, and as otherwise described in our Terms of Service.',
  // deprecated
  consentStorageKey: ke,
  localStorageKey: Ee = "vapi_widget_consent",
  // deprecated
  // Localization
  labels: Ve,
  // Event handlers
  onVoiceStart: kt,
  onCallStart: jt,
  // deprecated
  onVoiceEnd: bt,
  onCallEnd: wt,
  // deprecated
  onMessage: Ct,
  onError: Zt
}) => {
  const Xe = "vapi_widget_expanded", [Ye, $t] = oe(() => {
    try {
      return sessionStorage.getItem(Xe) === "true";
    } catch {
      return !1;
    }
  }), [Ut, it] = oe(!1), [Qe, He] = oe(""), [C, M] = oe(!1), j = _e(null), $ = _e(null), ee = ye(
    (ue) => {
      $t(ue);
      try {
        sessionStorage.setItem(Xe, ue.toString());
      } catch (Me) {
        console.warn("Failed to save expanded state to localStorage:", Me);
      }
    },
    [Xe]
  ), be = a ?? u, Ae = c ?? p, Ie = h ?? "#14B8A6", je = k ?? g ?? "#000000", Ze = x ?? S ?? "#FFFFFF", se = v ?? E ?? "Talk with AI", Ne = w ?? se, Te = P, ul = R ?? "Start", cl = N ?? "End Call", Jn = L ?? V, Gn = b ?? F, Kn = z ?? D, er = A ?? O, fl = Z ?? q, qt = d ?? _, Wt = ae ?? K, hl = pe, pl = le ?? ve, Xt = ke ?? Ee, ml = kt ?? jt, dl = bt ?? wt, tr = X ?? "Type your message...", gl = J ?? "This chat has ended. Thank you.", $e = { ...io, ...Ve }, B = ro({
    mode: s,
    publicKey: e,
    assistantId: t,
    assistant: n,
    assistantOverrides: r,
    apiUrl: i,
    firstChatMessage: fl,
    voiceAutoReconnect: Y,
    voiceReconnectStorage: m,
    reconnectStorageKey: G,
    onCallStart: ml,
    onCallEnd: dl,
    onMessage: Ct,
    onError: Zt
  }), ce = {
    baseColor: Ae ? f === "dark" && Ae === "#FFFFFF" ? "#000000" : Ae : f === "dark" ? "#000000" : "#FFFFFF",
    accentColor: Ie,
    ctaButtonColor: je,
    ctaButtonTextColor: Ze
  }, me = {
    size: s !== "voice" && l === "tiny" ? "compact" : l,
    radius: be,
    theme: f
  }, yl = Ye && !(s === "voice" && l === "tiny"), xl = () => ({
    ...ei[l].expanded,
    ...lo[u],
    backgroundColor: ce.baseColor,
    border: `1px solid ${me.theme === "dark" ? "#1F2937" : "#E5E7EB"}`,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: me.theme === "dark" ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" : "0 25px 50px -12px rgb(0 0 0 / 0.25)"
  }), kl = () => ({
    flex: "1 1 0%",
    padding: "1rem",
    overflowY: "auto",
    backgroundColor: ce.baseColor,
    ...me.theme === "dark" ? { filter: "brightness(1.1)" } : {}
  }), bl = () => ({
    padding: "1rem",
    borderTop: `1px solid ${me.theme === "dark" ? "#1F2937" : "#E5E7EB"}`,
    backgroundColor: ce.baseColor,
    ...me.theme === "dark" ? { filter: "brightness(1.05)" } : { filter: "brightness(0.97)" }
  }), wl = () => {
    const ue = B.conversation.length === 0, Me = !qt && B.voice.isCallActive && (s === "voice" || s === "hybrid"), lt = s === "voice" && !B.voice.isCallActive;
    return ue || Me || lt ? {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    } : {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem"
    };
  };
  Pe(() => {
    if (Wt) {
      const Me = localStorage.getItem(Xt) === "true";
      it(Me);
    } else
      it(!0);
  }, [Wt, Xt]), Pe(() => {
    j.current?.scrollIntoView({ behavior: "smooth" });
  }, [B.conversation, B.chat.isTyping]), Pe(() => {
    Ye && (s === "chat" || s === "hybrid") && setTimeout(() => {
      $.current?.focus();
    }, 100);
  }, [Ye, s]);
  const Cl = () => {
    localStorage.setItem(Xt, "true"), it(!0);
  }, vl = () => {
    ee(!1);
  }, Yt = async () => {
    await B.voice.toggleCall({ force: Y });
  }, nr = async () => {
    if (!Qe.trim()) return;
    const ue = Qe.trim();
    He(""), await B.chat.sendMessage(ue), $.current?.focus();
  }, rr = (ue) => {
    const Me = ue.target.value;
    He(Me), B.chat.handleInput(Me);
  }, Sl = () => {
    B.clearConversation(), M(!1), B.voice.isCallActive && B.voice.endCall({ force: Y }), He(""), (s === "chat" || s === "hybrid") && setTimeout(() => {
      $.current?.focus();
    }, 100);
  }, El = async () => {
    try {
      await B.chat.sendMessage("Ending chat...", !0), M(!0);
    } finally {
      He("");
    }
  }, Al = () => {
    B.clearConversation(), M(!1), (s === "chat" || s === "hybrid") && setTimeout(() => {
      $.current?.focus();
    }, 100);
  }, ir = () => {
    C && (B.clearConversation(), M(!1), He("")), ee(!1);
  }, Il = () => {
    ee(!0);
  }, vt = () => B.conversation.length === 0 ? /* @__PURE__ */ I(
    Gr,
    {
      mode: s,
      isCallActive: B.voice.isCallActive,
      theme: me.theme,
      voiceEmptyMessage: Jn,
      voiceActiveEmptyMessage: Gn,
      chatEmptyMessage: Kn,
      hybridEmptyMessage: er
    }
  ) : /* @__PURE__ */ re(ct, { children: [
    B.conversation.map((ue, Me) => {
      try {
        const lt = ue?.id || `${ue.role}-${Me}`;
        return /* @__PURE__ */ I(
          Xh,
          {
            role: ue.role,
            content: ue.content || "",
            colors: ce,
            styles: me,
            isLoading: Me === B.conversation.length - 1 && ue.role === "assistant" && B.chat.isTyping
          },
          lt
        );
      } catch (lt) {
        return console.error("Error rendering message:", lt, ue), null;
      }
    }),
    /* @__PURE__ */ I("div", { ref: j })
  ] }), Tl = () => C ? /* @__PURE__ */ re(
    "div",
    {
      className: "flex flex-col items-center justify-center text-center gap-4",
      style: { width: "100%" },
      children: [
        /* @__PURE__ */ I(
          "div",
          {
            className: `text-base ${me.theme === "dark" ? "text-gray-200" : "text-gray-800"}`,
            children: gl
          }
        ),
        /* @__PURE__ */ re("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ I(
            "button",
            {
              onClick: Al,
              className: "px-3 py-1.5 rounded-md",
              style: {
                backgroundColor: ce.ctaButtonColor,
                color: ce.ctaButtonTextColor
              },
              children: $e.startNewChat
            }
          ),
          /* @__PURE__ */ I(
            "button",
            {
              onClick: ir,
              className: `px-3 py-1.5 rounded-md ${me.theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-800"}`,
              children: $e.close
            }
          )
        ] })
      ]
    }
  ) : s === "chat" ? vt() : s === "hybrid" ? B.voice.isCallActive ? qt ? vt() : /* @__PURE__ */ I(
    Lt,
    {
      size: 150,
      connectionStatus: B.voice.connectionStatus,
      isCallActive: B.voice.isCallActive,
      isSpeaking: B.voice.isSpeaking,
      isTyping: B.chat.isTyping,
      volumeLevel: B.voice.volumeLevel,
      baseColor: ce.accentColor,
      colors: ce.accentColor
    }
  ) : vt() : s === "voice" && B.voice.isCallActive ? qt ? vt() : /* @__PURE__ */ I(
    Lt,
    {
      size: 150,
      connectionStatus: B.voice.connectionStatus,
      isCallActive: B.voice.isCallActive,
      isSpeaking: B.voice.isSpeaking,
      isTyping: B.chat.isTyping,
      volumeLevel: B.voice.volumeLevel,
      baseColor: ce.accentColor,
      colors: ce.accentColor
    }
  ) : /* @__PURE__ */ I(
    Gr,
    {
      mode: s,
      isCallActive: B.voice.isCallActive,
      theme: me.theme,
      voiceEmptyMessage: Jn,
      voiceActiveEmptyMessage: Gn,
      chatEmptyMessage: Kn,
      hybridEmptyMessage: er
    }
  ), Ml = () => C ? null : s === "voice" ? /* @__PURE__ */ I(
    Yh,
    {
      isCallActive: B.voice.isCallActive,
      connectionStatus: B.voice.connectionStatus,
      isAvailable: B.voice.isAvailable,
      isMuted: B.voice.isMuted,
      onToggleCall: Yt,
      onToggleMute: B.voice.toggleMute,
      startButtonText: ul,
      endButtonText: cl,
      colors: ce,
      labels: $e
    }
  ) : s === "chat" ? /* @__PURE__ */ I(
    Qh,
    {
      chatInput: Qe,
      isAvailable: B.chat.isAvailable,
      onInputChange: rr,
      onSendMessage: nr,
      colors: ce,
      styles: me,
      inputRef: $,
      placeholder: tr,
      labels: $e
    }
  ) : s === "hybrid" ? /* @__PURE__ */ I(
    Jh,
    {
      chatInput: Qe,
      isCallActive: B.voice.isCallActive,
      connectionStatus: B.voice.connectionStatus,
      isChatAvailable: B.chat.isAvailable,
      isVoiceAvailable: B.voice.isAvailable,
      isMuted: B.voice.isMuted,
      onInputChange: rr,
      onSendMessage: nr,
      onToggleCall: Yt,
      onToggleMute: B.voice.toggleMute,
      colors: ce,
      styles: me,
      inputRef: $,
      placeholder: tr,
      labels: $e
    }
  ) : null, Fl = () => Wt && !Ut ? /* @__PURE__ */ I(
    uo,
    {
      consentTitle: hl,
      consentContent: pl,
      onAccept: Cl,
      onCancel: vl,
      colors: ce,
      styles: me,
      radius: u,
      labels: $e
    }
  ) : /* @__PURE__ */ re("div", { style: xl(), children: [
    /* @__PURE__ */ I(
      wo,
      {
        mode: s,
        connectionStatus: B.voice.connectionStatus,
        isCallActive: B.voice.isCallActive,
        isSpeaking: B.voice.isSpeaking,
        isTyping: B.chat.isTyping,
        hasActiveConversation: B.conversation.length > 0,
        mainLabel: se,
        onClose: ir,
        onReset: Sl,
        onChatComplete: El,
        showEndChatButton: !C,
        colors: ce,
        styles: me,
        labels: $e
      }
    ),
    /* @__PURE__ */ I(
      "div",
      {
        className: "vapi-conversation-area",
        style: {
          ...kl(),
          ...wl()
        },
        children: Tl()
      }
    ),
    /* @__PURE__ */ I("div", { style: bl(), children: Ml() })
  ] });
  return /* @__PURE__ */ I("div", { className: "vapi-widget-wrapper", children: /* @__PURE__ */ I(
    "div",
    {
      style: {
        position: "fixed",
        zIndex: 9999,
        ...so[o]
      },
      children: yl ? Fl() : /* @__PURE__ */ I(
        co,
        {
          isCallActive: B.voice.isCallActive,
          connectionStatus: B.voice.connectionStatus,
          isSpeaking: B.voice.isSpeaking,
          isTyping: B.chat.isTyping,
          volumeLevel: B.voice.volumeLevel,
          onClick: Il,
          onToggleCall: Yt,
          mainLabel: se,
          ctaTitle: Ne,
          ctaSubtitle: Te,
          colors: ce,
          styles: me,
          mode: s
        }
      )
    }
  ) });
};
export {
  Wl as VapiChatClient,
  n0 as VapiWidget,
  Nl as areCallOptionsEqual,
  Et as clearStoredCall,
  Jl as createAssistantMessage,
  Ql as createUserMessage,
  Xl as extractContentFromPath,
  Rl as getStoredCallData,
  eo as handleStreamChunk,
  to as handleStreamComplete,
  Kl as handleStreamError,
  Gl as preallocateAssistantMessage,
  sr as resetAssistantMessageTracking,
  Dl as storeCallData,
  Ol as useVapiCall,
  no as useVapiChat,
  ro as useVapiWidget,
  Yl as validateChatInput
};
