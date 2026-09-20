import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useCart, useToast } from "../hooks";
import { useAuth } from "../context/AuthContext";
import { StepBar, Breadcrumb, Icons, Divider } from "../components/ui";
import { getApiUrl } from "../api/config";
const T = { border: "#EAE3D9", txt: "#23201D", muted: "#6E6A63", light: "#9C968D", sand: "#F4EFE6", cream: "#FAF7F2", teal: "#8192D4" };
const INIT_FORM = {
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "Maharashtra", pincode: "",
    payMethod: "upi",
    upiId: "", cardNum: "", cardExp: "", cardCvv: "", cardName: "",
    saveInfo: false, giftWrap: false, giftNote: "",
};
const STEPS = ["Delivery", "Payment", "Review"];
const STATES = ["Andhra Pradesh", "Assam", "Bihar", "Delhi", "Goa", "Gujarat", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"];
function Field({ label, field, type = "text", placeholder, form, errors, set, ...rest }) {
    return (<div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: T.light, letterSpacing: "1px", marginBottom: 6 }}>{label}</label>
      <input type={type} className={`field${errors[field] ? " error" : ""}`} value={String(form[field])} onChange={set(field)} placeholder={placeholder} {...rest}/>
      {errors[field] && <p style={{ fontSize: 11.5, color: "#e05252", marginTop: 5, fontWeight: 500 }}>{errors[field]}</p>}
    </div>);
}
export default function Checkout() {
    const navigate = useNavigate();
    const { items, subtotal, discount, promoCode, applyPromo, removePromo, clearCart, saveOrder } = useCart();
    const { addToast } = useToast();
    const { token } = useAuth();
    const [step, setStep] = useState(0);
    const [form, setForm] = useState(INIT_FORM);
    const [errors, setErrors] = useState({});
    const [inputCoupon, setInputCoupon] = useState("");
    const [couponError, setCouponError] = useState("");

    useEffect(() => {
        if (!promoCode) {
            const saved = localStorage.getItem("spinWonPrize");
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (parsed.code && parsed.code !== "TRY_AGAIN") {
                        applyPromo(parsed.code);
                    }
                } catch (e) {
                    // ignore
                }
            }
        }
    }, [promoCode, applyPromo]);

    const shipping = subtotal >= 999 ? 0 : 79;
    const giftCost = form.giftWrap ? 49 : 0;
    const total = Math.max(0, subtotal - discount + shipping + giftCost);
    const set = (field) => (e) => {
        const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setForm(f => ({ ...f, [field]: val }));
        setErrors(err => ({ ...err, [field]: undefined }));
    };
    const validateDelivery = () => {
        const e = {};
        if (!form.firstName.trim())
            e.firstName = "Required";
        if (!form.lastName.trim())
            e.lastName = "Required";
        if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
            e.email = "Invalid email";
        if (!form.phone.match(/^[0-9]{10}$/))
            e.phone = "10-digit number required";
        if (!form.address.trim())
            e.address = "Required";
        if (!form.city.trim())
            e.city = "Required";
        if (!form.pincode.match(/^[0-9]{6}$/))
            e.pincode = "6-digit PIN code required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };
    const validatePayment = () => {
        const e = {};
        if (form.payMethod === "upi" && !form.upiId.match(/^.+@.+$/))
            e.upiId = "Enter a valid UPI ID (e.g. name@upi)";
        if (form.payMethod === "card") {
            if (!form.cardNum.replace(/\s/g, "").match(/^\d{16}$/))
                e.cardNum = "Enter 16-digit card number";
            if (!form.cardExp.match(/^\d{2}\/\d{2}$/))
                e.cardExp = "Format: MM/YY";
            if (!form.cardCvv.match(/^\d{3,4}$/))
                e.cardCvv = "3–4 digit CVV";
            if (!form.cardName.trim())
                e.cardName = "Required";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const next = async () => {
        if (step === 0 && !validateDelivery())
            return;
        if (step === 1 && !validatePayment())
            return;
        if (step === 2) {
            if (isPlacingOrder)
                return;
            setIsPlacingOrder(true);
            const orderPayload = {
                items,
                subtotal,
                discount,
                shipping,
                giftCost,
                total,
                deliveryAddress: {
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email,
                    phone: form.phone,
                    address: form.address,
                    city: form.city,
                    state: form.state,
                    pincode: form.pincode,
                },
                payMethod: form.payMethod,
            };
            let finalOrder = null;
            try {
                const reqHeaders = { "Content-Type": "application/json" };
                if (token) reqHeaders["Authorization"] = `Bearer ${token}`;
                const res = await fetch(getApiUrl("/api/orders"), {
                    method: "POST",
                    headers: reqHeaders,
                    body: JSON.stringify(orderPayload),
                });
                if (res.ok) {
                    const data = await res.json();
                    finalOrder = data.order;
                }
            }
            catch (err) {
                console.error("Failed to post order to server:", err);
            }
            if (!finalOrder) {
                const orderId = `US-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
                finalOrder = {
                    id: orderId,
                    ...orderPayload,
                    status: "Processing",
                    date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
                };
            }
            saveOrder(finalOrder);
            clearCart();
            setIsPlacingOrder(false);
            navigate("/order-confirmation");
            return;
        }
        setStep(s => s + 1);
    };
    if (items.length === 0) {
        return (<div className="container" style={{ padding: "80px 32px", textAlign: "center" }}>
        <h2 className="font-display" style={{ fontSize: 32, marginBottom: 12 }}>No items to checkout</h2>
        <button className="btn btn-dark btn-lg" onClick={() => navigate("/shop")}>Continue Shopping</button>
      </div>);
    }
    return (<div style={{ background: T.cream, minHeight: "100vh" }}>
      <div className="container" style={{ padding: "32px 32px 80px" }}>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]}/>
        <h1 className="font-display" style={{ fontSize: 36, color: T.txt, marginBottom: 32 }}>Checkout</h1>

        {/* Step indicator */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "24px 32px", border: `1px solid ${T.border}`, marginBottom: 28 }}>
          <StepBar steps={STEPS} current={step}/>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start" }}>
          {/* ── Left: Form ─────────────────────────────────────── */}
          <div style={{ background: "#fff", borderRadius: 20, border: `1px solid ${T.border}`, padding: "32px" }}>

            {/* Step 0: Delivery */}
            {step === 0 && (<div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: T.txt, marginBottom: 24 }}>Delivery Information</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Field label="FIRST NAME" field="firstName" placeholder="Ritika" form={form} errors={errors} set={set}/>
                  <Field label="LAST NAME" field="lastName" placeholder="Sharma" form={form} errors={errors} set={set}/>
                  <Field label="EMAIL ADDRESS" field="email" type="email" placeholder="ritika@example.com" form={form} errors={errors} set={set}/>
                  <Field label="PHONE NUMBER" field="phone" type="tel" placeholder="9876543210" form={form} errors={errors} set={set}/>
                </div>

                <Divider margin={24}/>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: T.txt, marginBottom: 16 }}>Shipping Address</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <Field label="ADDRESS LINE" field="address" placeholder="Flat 4B, Orchid Heights, MG Road" form={form} errors={errors} set={set}/>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <Field label="CITY" field="city" placeholder="Mumbai" form={form} errors={errors} set={set}/>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: T.light, letterSpacing: "1px", marginBottom: 6 }}>STATE</label>
                      <select className="field" value={form.state} onChange={set("state")}>
                        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <Field label="PIN CODE" field="pincode" placeholder="400001" style={{ maxWidth: 200 }} form={form} errors={errors} set={set} maxLength={6}/>
                </div>

                <Divider margin={24}/>

                {/* Gift wrap */}
                <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                  <input type="checkbox" className="checkbox" checked={form.giftWrap} onChange={set("giftWrap")} style={{ marginTop: 2 }}/>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: T.txt }}>Add gift wrapping — ₹49</p>
                    <p style={{ fontSize: 12.5, color: T.light, marginTop: 2 }}>Beautiful eco kraft wrapping with a ribbon and handwritten note</p>
                  </div>
                </label>
                {form.giftWrap && (<div style={{ marginTop: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: T.light, letterSpacing: "1px", display: "block", marginBottom: 6 }}>GIFT NOTE (OPTIONAL)</label>
                    <textarea className="field" rows={3} placeholder="Write a personal message here…" value={form.giftNote} onChange={set("giftNote")} style={{ resize: "vertical" }}/>
                  </div>)}

                <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginTop: 14 }}>
                  <input type="checkbox" className="checkbox" checked={form.saveInfo} onChange={set("saveInfo")}/>
                  <p style={{ fontSize: 13.5, color: T.muted }}>Save my delivery information for faster checkout next time</p>
                </label>
              </div>)}

            {/* Step 1: Payment */}
            {step === 1 && (<div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: T.txt, marginBottom: 24 }}>Payment Method</h2>

                {/* Method selector */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                  {[
                { value: "upi", label: "UPI", sub: "Google Pay, PhonePe, BHIM, Paytm" },
                { value: "card", label: "Debit / Credit Card", sub: "Visa, Mastercard, RuPay" },
                { value: "wallet", label: "Wallet", sub: "Paytm, Amazon Pay, Mobikwik" },
                { value: "cod", label: "Cash on Delivery", sub: "Available on orders up to ₹2999" },
            ].map(m => (<label key={m.value} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 20px", borderRadius: 12, border: `1.5px solid ${form.payMethod === m.value ? "#1C1C1A" : T.border}`, cursor: "pointer", background: form.payMethod === m.value ? T.sand : "#fff", transition: "all 0.14s" }}>
                      <input type="radio" name="payMethod" value={m.value} checked={form.payMethod === m.value} onChange={set("payMethod")} style={{ marginTop: 2 }}/>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: T.txt }}>{m.label}</p>
                        <p style={{ fontSize: 12.5, color: T.light, marginTop: 2 }}>{m.sub}</p>
                      </div>
                    </label>))}
                </div>

                {/* UPI input */}
                {form.payMethod === "upi" && (<div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: T.light, letterSpacing: "1px", marginBottom: 6 }}>UPI ID</label>
                    <input className={`field${errors.upiId ? " error" : ""}`} value={form.upiId} onChange={set("upiId")} placeholder="yourname@upi"/>
                    {errors.upiId && <p style={{ fontSize: 11.5, color: "#e05252", marginTop: 5 }}>{errors.upiId}</p>}
                  </div>)}

                {/* Card inputs */}
                {form.payMethod === "card" && (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: T.light, letterSpacing: "1px", marginBottom: 6 }}>CARD NUMBER</label>
                      <input className={`field${errors.cardNum ? " error" : ""}`} value={form.cardNum} onChange={set("cardNum")} placeholder="1234 5678 9012 3456" maxLength={19}/>
                      {errors.cardNum && <p style={{ fontSize: 11.5, color: "#e05252", marginTop: 5 }}>{errors.cardNum}</p>}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: T.light, letterSpacing: "1px", marginBottom: 6 }}>EXPIRY DATE</label>
                        <input className={`field${errors.cardExp ? " error" : ""}`} value={form.cardExp} onChange={set("cardExp")} placeholder="MM/YY" maxLength={5}/>
                        {errors.cardExp && <p style={{ fontSize: 11.5, color: "#e05252", marginTop: 5 }}>{errors.cardExp}</p>}
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: T.light, letterSpacing: "1px", marginBottom: 6 }}>CVV</label>
                        <input className={`field${errors.cardCvv ? " error" : ""}`} value={form.cardCvv} onChange={set("cardCvv")} placeholder="•••" maxLength={4} type="password"/>
                        {errors.cardCvv && <p style={{ fontSize: 11.5, color: "#e05252", marginTop: 5 }}>{errors.cardCvv}</p>}
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: T.light, letterSpacing: "1px", marginBottom: 6 }}>CARDHOLDER NAME</label>
                      <input className={`field${errors.cardName ? " error" : ""}`} value={form.cardName} onChange={set("cardName")} placeholder="RITIKA SHARMA"/>
                      {errors.cardName && <p style={{ fontSize: 11.5, color: "#e05252", marginTop: 5 }}>{errors.cardName}</p>}
                    </div>
                  </div>)}

                {form.payMethod === "cod" && (<div style={{ background: "#FFF8E7", border: "1px solid #F59E0B30", borderRadius: 12, padding: "14px 18px" }}>
                    <p style={{ fontSize: 13.5, color: "#92400e", fontWeight: 600 }}>Cash on delivery available</p>
                    <p style={{ fontSize: 12.5, color: "#b45309", marginTop: 4 }}>Please have exact change ready. COD available on orders up to ₹2,999.</p>
                  </div>)}

                <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10, background: "#F0FDF8", borderRadius: 10, padding: "12px 16px" }}>
                  <Icons.Shield />
                  <p style={{ fontSize: 12.5, color: "#065f46", fontWeight: 500 }}>Your payment is secured with 256-bit SSL encryption. We never store your card details.</p>
                </div>
              </div>)}

            {/* Step 2: Review */}
            {step === 2 && (<div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: T.txt, marginBottom: 24 }}>Review Your Order</h2>

                {/* Delivery summary */}
                <div style={{ background: T.sand, borderRadius: 14, padding: "18px 20px", marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: T.txt }}>Delivery Address</p>
                    <button onClick={() => setStep(0)} style={{ fontSize: 12, color: T.teal, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Edit</button>
                  </div>
                  <p style={{ fontSize: 13.5, color: T.muted, lineHeight: 1.65 }}>
                    {form.firstName} {form.lastName}<br />
                    {form.address}<br />
                    {form.city}, {form.state} — {form.pincode}<br />
                    {form.email} · {form.phone}
                  </p>
                </div>

                {/* Payment summary */}
                <div style={{ background: T.sand, borderRadius: 14, padding: "18px 20px", marginBottom: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: T.txt }}>Payment Method</p>
                    <button onClick={() => setStep(1)} style={{ fontSize: 12, color: T.teal, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Edit</button>
                  </div>
                  <p style={{ fontSize: 13.5, color: T.muted }}>
                    {form.payMethod === "upi" ? `UPI — ${form.upiId}` :
                form.payMethod === "card" ? `Card ending in ${form.cardNum.slice(-4)}` :
                    form.payMethod === "wallet" ? "Wallet payment" : "Cash on Delivery"}
                  </p>
                </div>

                {/* Items */}
                <h3 style={{ fontSize: 15, fontWeight: 700, color: T.txt, marginBottom: 14 }}>Items ({items.length})</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {items.map(({ product: p, qty }) => (<div key={p.id} style={{ display: "flex", gap: 14, alignItems: "center" }}>
                      <img src={p.images[0]} alt={p.name} style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover", border: `1px solid ${T.border}`, flexShrink: 0 }}/>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13.5, fontWeight: 600, color: T.txt }}>{p.name}</p>
                        <p style={{ fontSize: 12, color: T.light }}>Qty: {qty}</p>
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: T.txt }}>&#8377;{(p.price * qty).toLocaleString("en-IN")}</p>
                    </div>))}
                </div>

                <div style={{ marginTop: 20, background: "#F0FDF8", borderRadius: 12, padding: "14px 18px" }}>
                  <p style={{ fontSize: 13, color: "#065f46", fontWeight: 600 }}>
                    Estimated delivery: {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                  </p>
                </div>
              </div>)}

            {/* Navigation buttons */}
            <div style={{ display: "flex", gap: 12, marginTop: 32, paddingTop: 24, borderTop: `1px solid ${T.border}` }}>
              {step > 0 && (<button className="btn btn-ghost btn-lg" onClick={() => setStep(s => s - 1)} style={{ gap: 7 }}>
                  <Icons.ChevronLeft /> Back
                </button>)}
              <button className="btn btn-dark btn-lg" onClick={next} style={{ flex: 1 }}>
                {step === 2 ? `Place Order — ₹${total.toLocaleString("en-IN")}` : "Continue"} <Icons.ArrowRight />
              </button>
            </div>
          </div>

          {/* ── Order summary sidebar ──────────────────────────── */}
          <div style={{ position: "sticky", top: 90 }}>
            <div style={{ background: "#fff", borderRadius: 20, border: `1px solid ${T.border}`, padding: "24px", marginBottom: 14 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: T.txt, marginBottom: 18 }}>Order Summary</h3>

              {/* Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
                {items.map(({ product: p, qty }) => (<div key={p.id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <img src={p.images[0]} alt={p.name} style={{ width: 52, height: 52, borderRadius: 10, objectFit: "cover", border: `1px solid ${T.border}` }}/>
                      <span style={{ position: "absolute", top: -7, right: -7, background: "#1C1C1A", color: "#fff", fontSize: 9, fontWeight: 800, borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>{qty}</span>
                    </div>
                    <p style={{ fontSize: 12.5, fontWeight: 500, color: T.txt, flex: 1, lineHeight: 1.35 }}>{p.name}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: T.txt, flexShrink: 0 }}>₹{(p.price * qty).toLocaleString("en-IN")}</p>
                  </div>))}
              </div>

              {/* Promo / Coupon Code Section */}
              <div style={{ margin: "16px 0" }}>
                {promoCode ? (
                  <div
                    style={{
                      background: "#F2F7F4",
                      border: "1px dashed #8192D4",
                      borderRadius: 12,
                      padding: "10px 14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#8192D4", letterSpacing: "0.5px" }}>COUPON APPLIED</span>
                      <p style={{ fontSize: 14, fontWeight: 800, color: T.txt }}>{promoCode} (-₹{discount.toLocaleString("en-IN")})</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        removePromo();
                        addToast("Coupon removed");
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#D9381E",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        type="text"
                        placeholder="Promo code (e.g. SPIN150)"
                        value={inputCoupon}
                        onChange={(e) => {
                          setInputCoupon(e.target.value);
                          setCouponError("");
                        }}
                        style={{
                          flex: 1,
                          padding: "9px 12px",
                          borderRadius: 10,
                          border: `1px solid ${T.border}`,
                          fontSize: 13,
                          textTransform: "uppercase",
                          outline: "none",
                          background: T.cream,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!inputCoupon.trim()) return;
                          const success = applyPromo(inputCoupon);
                          if (success) {
                            addToast(`🎉 Applied coupon ${inputCoupon.toUpperCase()}!`, "success");
                            setInputCoupon("");
                            setCouponError("");
                          } else {
                            setCouponError("Invalid promo code");
                          }
                        }}
                        style={{
                          background: T.teal,
                          color: "#FFFFFF",
                          border: "none",
                          borderRadius: 10,
                          padding: "9px 16px",
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && <p style={{ fontSize: 11.5, color: "#D9381E" }}>⚠️ {couponError}</p>}
                  </div>
                )}
              </div>

              <Divider margin={0}/>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "16px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13.5, color: T.muted }}>Subtotal</span>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: T.txt }}>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13.5, color: "#2E7D32", fontWeight: 600 }}>
                      Discount ({promoCode})
                    </span>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#2E7D32" }}>
                      -₹{discount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13.5, color: T.muted }}>Shipping</span>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: shipping === 0 ? "#1a7a56" : T.txt }}>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
                {form.giftWrap && (<div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13.5, color: T.muted }}>Gift wrapping</span>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: T.txt }}>₹{giftCost}</span>
                  </div>)}
              </div>

              <Divider margin={0}/>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 14 }}>
                <span style={{ fontSize: 14.5, fontWeight: 700, color: T.txt }}>Total</span>
                <span className="font-display" style={{ fontSize: 24, color: T.txt }}>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Trust */}
            <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${T.border}`, padding: "14px 18px", fontSize: 12.5, color: T.muted, display: "flex", flexDirection: "column", gap: 9 }}>
              {[
            { icon: <Icons.Shield />, t: "SSL encrypted checkout" },
            { icon: <Icons.Package />, t: "7-day easy returns" },
            { icon: <Icons.Truck />, t: "Delivered in 1–4 days" },
        ].map(f => (<div key={f.t} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <span style={{ color: T.teal }}>{f.icon}</span>
                  {f.t}
                </div>))}
            </div>
          </div>
        </div>
      </div>
    </div>);
}
