import { useState } from "react";
import { Link } from "react-router-dom";

const platforms = [
  { id: "blinkit", label: "Blinkit", emoji: "🟡" },
  { id: "zepto", label: "Zepto", emoji: "🟣" },
  { id: "swiggy", label: "Swiggy Instamart", emoji: "🟠" },
  { id: "bigbasket", label: "BigBasket Now", emoji: "🟢" },
  { id: "dunzo", label: "Amazon Now", emoji: "🔵" },
  { id: "jiomart", label: "FreshToHome Express", emoji: "🔴" },
  { id: "flipkart", label: "Flipkart Minutes", emoji: "🟦" },
];

const cities = ["Hyderabad", "Bengaluru", "Mumbai", "Delhi", "Chennai", "Pune", "Kolkata", "Ahmedabad"];

const steps = ["Personal", "Work Details", "Payment"];

const weekDays = [
  { id: "mon", label: "Mon" },
  { id: "tue", label: "Tue" },
  { id: "wed", label: "Wed" },
  { id: "thu", label: "Thu" },
  { id: "fri", label: "Fri" },
  { id: "sat", label: "Sat" },
  { id: "sun", label: "Sun" },
];

const dailyHoursOptions = [
  { id: "lt4", label: "Less than 4 hours" },
  { id: "4to8", label: "4–8 hours" },
  { id: "8to12", label: "8–12 hours" },
  { id: "12plus", label: "12+ hours" },
];

const areaTypeOptions = [
  { id: "urban", label: "Urban" },
  { id: "semi-urban", label: "Semi-Urban" },
  { id: "high-traffic", label: "High Traffic Zone" },
];

const deliveryTypeOptions = [
  { id: "food", label: "Food" },
  { id: "grocery", label: "Grocery" },
  { id: "parcel", label: "Parcel" },  
];

export default function Register() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    dob: "",
    aadhaar_file: null,
    pan_file: null,
    kyc_verified: false,
    selectedPlatforms: [],
    vehicleType: "",
    workingDays: [],
    dailyHours: "",
    areaType: "",
    deliveryType: [],
    experience: "1",
    upi: "",
    bank_ifsc: "",
    device_id: "",
    consent: false,
  });
  const [errors, setErrors] = useState({});
  const [bankName, setBankName] = useState("");
  const [ifscError, setIfscError] = useState("");

  const handleBankLookup = async (ifsc) => {
    const code = ifsc.toUpperCase();
    setForm((f) => ({ ...f, bank_ifsc: code }));
    
    if (code.length === 11) {
      try {
        const res = await fetch(`https://ifsc.razorpay.com/${code}`);
        if (res.ok) {
          const data = await res.json();
          setBankName(data.BANK || "Bank Verified");
          setIfscError("");
        } else {
          setBankName("");
          setIfscError("Invalid IFSC code");
        }
      } catch (err) {
        setBankName("");
        setIfscError("Could not verify IFSC");
      }
    } else {
      setBankName("");
      setIfscError("");
    }
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setForm((f) => ({ ...f, [field]: file }));
      setTimeout(() => {
        setForm((f) => ({ ...f, kyc_verified: true }));
      }, 700);
    }
  };

  const togglePlatform = (id) => {
    setForm((f) => ({
      ...f,
      selectedPlatforms: f.selectedPlatforms.includes(id)
        ? f.selectedPlatforms.filter((p) => p !== id)
        : [...f.selectedPlatforms, id],
    }));
  };

  const toggleWorkingDay = (id) => {
    setForm((f) => ({
      ...f,
      workingDays: f.workingDays.includes(id)
        ? f.workingDays.filter((d) => d !== id)
        : [...f.workingDays, id],
    }));
  };

  const toggleDeliveryType = (id) => {
    setForm((f) => ({
      ...f,
      deliveryType: f.deliveryType.includes(id)
        ? f.deliveryType.filter((d) => d !== id)
        : [...f.deliveryType, id],
    }));
  };

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.name.trim()) e.name = "Name is required";
      if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = "Enter a valid 10-digit mobile number";
      if (!form.city) e.city = "Please select your city";
      if (!form.dob) e.dob = "Date of birth is required";
    }
    if (step === 1) {
      if (form.selectedPlatforms.length === 0) e.platforms = "Select at least one platform";
      if (!form.vehicleType) e.vehicleType = "Please select a vehicle type";
      if (form.workingDays.length === 0) e.workingDays = "Select at least one working day";
      if (!form.dailyHours) e.dailyHours = "Please select your average daily hours";
      if (!form.areaType) e.areaType = "Please select an area type";
      if (form.deliveryType.length === 0) e.deliveryType = "Please select a delivery type";
    }
    if (step === 2) {
      if (!form.upi.trim()) e.upi = "UPI ID is required";
      if (!form.consent) e.consent = "You must accept the terms to proceed";
      if (ifscError && form.bank_ifsc.length > 0) e.bank_ifsc = ifscError;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) setStep((s) => s + 1); };
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = () => {
    if (validate()) {
      const capturedDeviceId = navigator.userAgent + "-" + Date.now();
      setForm((f) => ({ ...f, device_id: capturedDeviceId }));
      setStep(3);
    }
  };

  const vehicles = [
    { id: "bike", label: "Bike", icon: "🏍️" },
    { id: "cycle", label: "Cycle", icon: "🚲" },
    { id: "ebike", label: "E-Bike", icon: "⚡🚲" },
    { id: "van", label: "Van/Car", icon: "🚐" },
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              <span className="text-white text-xs font-bold">G</span>
            </div>
            <span className="font-semibold text-gray-900">BhimaAstra</span>
          </div>
          <Link to="/login" className="text-sm font-medium" style={{ color: '#7c3aed' }}>Login</Link>
        </div>
      </header>

      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 md:px-6 py-6">

        {/* Step Progress */}
        <div className="mb-8">
          <div className="flex items-center gap-0">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
                    style={{
                      background: i <= step ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : '#f3f4f6',
                      color: i <= step ? 'white' : '#9ca3af',
                      boxShadow: i === step ? '0 0 0 4px rgba(124,58,237,0.15)' : 'none',
                    }}
                  >
                    {i < step ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : i + 1}
                  </div>
                  <p className="text-xs mt-1 font-medium" style={{ color: i <= step ? '#7c3aed' : '#9ca3af' }}>{s}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 mb-4" style={{ background: i < step ? '#7c3aed' : '#f3f4f6' }}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 0 — Personal */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Personal Details</h2>
              <p className="text-sm text-gray-500 mt-1">We'll use this to set up your coverage profile</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Ravi Kumar"
                className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-900 outline-none transition ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                onFocus={(e) => { if (!errors.name) e.target.style.borderColor = '#7c3aed'; }}
                onBlur={(e) => { if (!errors.name) e.target.style.borderColor = '#e5e7eb'; }}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number <span className="text-red-500">*</span></label>
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-gray-200 rounded-l-xl bg-gray-50 text-gray-500 text-sm font-medium">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
                  placeholder="9876543210"
                  className={`flex-1 border rounded-r-xl px-4 py-3 text-sm text-gray-900 outline-none transition ${errors.phone ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  onFocus={(e) => { if (!errors.phone) e.target.style.borderColor = '#7c3aed'; }}
                  onBlur={(e) => { if (!errors.phone) e.target.style.borderColor = '#e5e7eb'; }}
                />
              </div>
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">City <span className="text-red-500">*</span></label>
              <select
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-900 outline-none transition bg-white ${errors.city ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                onFocus={(e) => { if (!errors.city) e.target.style.borderColor = '#7c3aed'; }}
                onBlur={(e) => { if (!errors.city) e.target.style.borderColor = '#e5e7eb'; }}
              >
                <option value="">Select your city</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="dob"
                required
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-900 outline-none transition ${errors.dob ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                onFocus={(e) => { if (!errors.dob) e.target.style.borderColor = '#7c3aed'; }}
                onBlur={(e) => { if (!errors.dob) e.target.style.borderColor = '#e5e7eb'; }}
              />
              {errors.dob && <p className="text-xs text-red-500 mt-1">{errors.dob}</p>}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-3">KYC Upload Section</h3>
              <div className="space-y-4">
                <div className="card shadow-sm border border-gray-200 rounded-xl p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Aadhaar Upload</label>
                  <input
                    type="file"
                    name="aadhaar_file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileUpload(e, 'aadhaar_file')}
                    className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 outline-none transition-all cursor-pointer"
                  />
                  {form.aadhaar_file && <p className="text-[10px] text-green-600 mt-2 font-medium">✓ File attached</p>}
                </div>
                
                <div className="card shadow-sm border border-gray-200 rounded-xl p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">PAN Upload</label>
                  <input
                    type="file"
                    name="pan_file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileUpload(e, 'pan_file')}
                    className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 outline-none transition-all cursor-pointer"
                  />
                  {form.pan_file && <p className="text-[10px] text-green-600 mt-2 font-medium">✓ File attached</p>}
                </div>

                {form.kyc_verified && (
                  <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 border border-green-100 mt-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    KYC Verified
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 1 — Work Details */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Work Details</h2>
              <p className="text-sm text-gray-500 mt-1">This helps our AI calculate your accurate risk profile</p>
            </div>

            {/* Platform Chips */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Platforms <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-2">
                {platforms.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlatform(p.id)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm font-medium text-left transition-colors"
                    style={
                      form.selectedPlatforms.includes(p.id)
                        ? { borderColor: '#7c3aed', background: '#f5f3ff', color: '#6d28d9' }
                        : { borderColor: '#e5e7eb', color: '#4b5563' }
                    }
                  >
                    <span>{p.emoji}</span>
                    <span className="truncate">{p.label}</span>
                    {form.selectedPlatforms.includes(p.id) && (
                      <svg className="w-4 h-4 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#7c3aed' }}>
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              {errors.platforms && <p className="text-xs text-red-500 mt-1">{errors.platforms}</p>}
            </div>

            {/* Vehicle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-4 gap-2">
                {vehicles.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setForm({ ...form, vehicleType: v.id })}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-colors"
                    style={
                      form.vehicleType === v.id
                        ? { borderColor: '#7c3aed', background: '#f5f3ff' }
                        : { borderColor: '#e5e7eb' }
                    }
                  >
                    <span className="text-xl">{v.icon}</span>
                    <span className="text-xs font-medium text-gray-700">{v.label}</span>
                  </button>
                ))}
              </div>
              {errors.vehicleType && <p className="text-xs text-red-500 mt-1">{errors.vehicleType}</p>}
            </div>

            {/* Working Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Working Days <span className="text-red-500">*</span></label>
              <div className="flex gap-1.5 flex-wrap">
                {weekDays.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleWorkingDay(d.id)}
                    className="px-3 py-2 rounded-xl border text-sm font-medium transition-colors"
                    style={
                      form.workingDays.includes(d.id)
                        ? { borderColor: '#7c3aed', background: '#f5f3ff', color: '#6d28d9' }
                        : { borderColor: '#e5e7eb', color: '#4b5563' }
                    }
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              {errors.workingDays && <p className="text-xs text-red-500 mt-1">{errors.workingDays}</p>}
            </div>

            {/* Average Daily Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Average Daily Hours <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-2">
                {dailyHoursOptions.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setForm({ ...form, dailyHours: o.id })}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm font-medium text-left transition-colors"
                    style={
                      form.dailyHours === o.id
                        ? { borderColor: '#7c3aed', background: '#f5f3ff', color: '#6d28d9' }
                        : { borderColor: '#e5e7eb', color: '#4b5563' }
                    }
                  >
                    <span className="truncate">{o.label}</span>
                    {form.dailyHours === o.id && (
                      <svg className="w-4 h-4 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#7c3aed' }}>
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              {errors.dailyHours && <p className="text-xs text-red-500 mt-1">{errors.dailyHours}</p>}
            </div>

            {/* Area Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Area Type <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-3 gap-2">
                {areaTypeOptions.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setForm({ ...form, areaType: o.id })}
                    className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium text-left transition-colors"
                    style={
                      form.areaType === o.id
                        ? { borderColor: '#7c3aed', background: '#f5f3ff', color: '#6d28d9' }
                        : { borderColor: '#e5e7eb', color: '#4b5563' }
                    }
                  >
                    <span className="truncate">{o.label}</span>
                    {form.areaType === o.id && (
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#7c3aed' }}>
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              {errors.areaType && <p className="text-xs text-red-500 mt-1">{errors.areaType}</p>}
            </div>

            {/* Delivery Type — multi-select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Type <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-4 gap-2">
                {deliveryTypeOptions.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => toggleDeliveryType(o.id)}
                    className="flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl border text-sm font-medium text-center transition-colors"
                    style={
                      form.deliveryType.includes(o.id)
                        ? { borderColor: '#7c3aed', background: '#f5f3ff', color: '#6d28d9' }
                        : { borderColor: '#e5e7eb', color: '#4b5563' }
                    }
                  >
                    <span>{o.label}</span>
                    {form.deliveryType.includes(o.id) && (
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#7c3aed' }}>
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              {errors.deliveryType && <p className="text-xs text-red-500 mt-1">{errors.deliveryType}</p>}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Years of Experience</label>
              <select
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white outline-none"
                onFocus={(e) => (e.target.style.borderColor = '#7c3aed')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
              >
                <option value="0">Less than 1 year</option>
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="3">3 years</option>
                <option value="5">4–5 years</option>
                <option value="7">6–9 years</option>
                <option value="9">9+ years</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 2 — Payment */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
              <p className="text-sm text-gray-500 mt-1">Payouts will be sent to your UPI ID within 2 hours of a trigger event</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">UPI ID <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="upi_id"
                value={form.upi}
                onChange={(e) => setForm({ ...form, upi: e.target.value })}
                placeholder="example@upi"
                className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-900 outline-none transition ${errors.upi ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                onFocus={(e) => { if (!errors.upi) e.target.style.borderColor = '#7c3aed'; }}
                onBlur={(e) => { if (!errors.upi) e.target.style.borderColor = '#e5e7eb'; }}
              />
              {errors.upi && <p className="text-xs text-red-500 mt-1">{errors.upi}</p>}
              <p className="text-xs text-gray-400 mt-1">E.g. 9876543210@ybl, name@oksbi, name@paytm</p>
            </div>

            <div className="card shadow-sm border border-gray-200 rounded-xl p-0 overflow-hidden">
              <div className="p-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bank IFSC <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="bank_ifsc"
                  value={form.bank_ifsc}
                  onChange={(e) => handleBankLookup(e.target.value)}
                  placeholder="e.g. SBIN0001234"
                  className={`w-full border rounded-xl px-4 py-3 text-sm uppercase text-gray-900 outline-none transition ${errors.bank_ifsc || ifscError ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  onFocus={(e) => { if (!ifscError) e.target.style.borderColor = '#7c3aed'; }}
                  onBlur={(e) => { if (!ifscError) e.target.style.borderColor = '#e5e7eb'; }}
                />
                {ifscError && <p className="text-xs text-red-500 mt-1.5 font-medium">{ifscError}</p>}
                {errors.bank_ifsc && !ifscError && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.bank_ifsc}</p>}
                {bankName && (
                  <p className="text-xs text-green-600 mt-2 font-semibold flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    {bankName}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl p-4" style={{ background: '#f5f3ff', border: '1px solid #ede9fe' }}>
              <p className="text-xs font-semibold mb-1" style={{ color: '#4c1d95' }}>🔒 Your UPI is safe</p>
              <p className="text-xs" style={{ color: '#6d28d9' }}>BhimaAstra only transfers money to your UPI ID. We never charge you automatically — you pay your premium manually each week.</p>
            </div>

            {/* Consent */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                className="mt-0.5 w-4 h-4 flex-shrink-0"
                style={{ accentColor: '#7c3aed' }}
              />
              <span className="text-sm text-gray-600">
                I agree to BhimaAstra's{" "}
                <a href="#" className="underline" style={{ color: '#7c3aed' }}>Terms of Service</a>{" "}
                and{" "}
                <a href="#" className="underline" style={{ color: '#7c3aed' }}>Privacy Policy</a>.
                I consent to IRDAI-compliant parametric insurance coverage.
              </span>
            </label>
            {errors.consent && <p className="text-xs text-red-500 -mt-2">{errors.consent}</p>}
          </div>
        )}

        {/* Success State */}
        {step === 3 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12 space-y-4">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Registration Complete!</h2>
            <p className="text-sm text-gray-500 max-w-xs">Our AI is calculating your risk profile. Your BhimaAstra account is ready.</p>
            <Link
              to="/onboarding"
              className="mt-4 text-white font-semibold px-8 py-3 rounded-xl text-sm transition-colors inline-block"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
            >
              View My Risk Score →
            </Link>
          </div>
        )}

        {/* Navigation */}
        {step < 3 && (
          <div className="mt-8 space-y-3">
            <button
              onClick={step < 2 ? handleNext : handleSubmit}
              className="w-full text-white font-semibold py-3.5 rounded-xl text-sm transition-colors"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
            >
              {step < 2 ? "Continue →" : "Create Account"}
            </button>
            {step > 0 && (
              <button
                onClick={handleBack}
                className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl text-sm font-medium transition-colors"
              >
                ← Back
              </button>
            )}
          </div>
        )}

        {/* Login Link */}
        {step === 0 && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="font-medium hover:underline" style={{ color: '#7c3aed' }}>Login</Link>
          </p>
        )}

      </div>
    </div>
  );
}