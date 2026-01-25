"use client";

interface CountryCode {
  code: string;
  dialCode: string;
  flag: string;
}

const countryCodes: CountryCode[] = [
  { code: "US", dialCode: "+1", flag: "🇺🇸" },
  { code: "GB", dialCode: "+44", flag: "🇬🇧" },
  { code: "CA", dialCode: "+1", flag: "🇨🇦" },
  { code: "AU", dialCode: "+61", flag: "🇦🇺" },
  { code: "DE", dialCode: "+49", flag: "🇩🇪" },
  { code: "FR", dialCode: "+33", flag: "🇫🇷" },
  { code: "IT", dialCode: "+39", flag: "🇮🇹" },
  { code: "ES", dialCode: "+34", flag: "🇪🇸" },
  {code:"ET",dialCode:"+251",flag:"🇪🇹"},
  { code: "NL", dialCode: "+31", flag: "🇳🇱" },
  { code: "BE", dialCode: "+32", flag: "🇧🇪" },
  { code: "CH", dialCode: "+41", flag: "🇨🇭" },
  { code: "AT", dialCode: "+43", flag: "🇦🇹" },
  { code: "SE", dialCode: "+46", flag: "🇸🇪" },
  { code: "NO", dialCode: "+47", flag: "🇳🇴" },
  { code: "DK", dialCode: "+45", flag: "🇩🇰" },
  { code: "FI", dialCode: "+358", flag: "🇫🇮" },
  { code: "PL", dialCode: "+48", flag: "🇵🇱" },
  { code: "CZ", dialCode: "+420", flag: "🇨🇿" },
  { code: "IE", dialCode: "+353", flag: "🇮🇪" },
  { code: "PT", dialCode: "+351", flag: "🇵🇹" },
  { code: "GR", dialCode: "+30", flag: "🇬🇷" },
  { code: "JP", dialCode: "+81", flag: "🇯🇵" },
  { code: "CN", dialCode: "+86", flag: "🇨🇳" },
  { code: "IN", dialCode: "+91", flag: "🇮🇳" },
  { code: "KR", dialCode: "+82", flag: "🇰🇷" },
  { code: "SG", dialCode: "+65", flag: "🇸🇬" },
  { code: "MY", dialCode: "+60", flag: "🇲🇾" },
  { code: "TH", dialCode: "+66", flag: "🇹🇭" },
  { code: "ID", dialCode: "+62", flag: "🇮🇩" },
  { code: "PH", dialCode: "+63", flag: "🇵🇭" },
  { code: "VN", dialCode: "+84", flag: "🇻🇳" },
  { code: "BR", dialCode: "+55", flag: "🇧🇷" },
  { code: "MX", dialCode: "+52", flag: "🇲🇽" },
  { code: "AR", dialCode: "+54", flag: "🇦🇷" },
  { code: "CL", dialCode: "+56", flag: "🇨🇱" },
  { code: "CO", dialCode: "+57", flag: "🇨🇴" },
  { code: "PE", dialCode: "+51", flag: "🇵🇪" },
  { code: "ZA", dialCode: "+27", flag: "🇿🇦" },
  { code: "EG", dialCode: "+20", flag: "🇪🇬" },
  { code: "NG", dialCode: "+234", flag: "🇳🇬" },
  { code: "KE", dialCode: "+254", flag: "🇰🇪" },
  { code: "AE", dialCode: "+971", flag: "🇦🇪" },
  { code: "SA", dialCode: "+966", flag: "🇸🇦" },
  { code: "IL", dialCode: "+972", flag: "🇮🇱" },
  { code: "TR", dialCode: "+90", flag: "🇹🇷" },
  { code: "RU", dialCode: "+7", flag: "🇷🇺" },
  { code: "UA", dialCode: "+380", flag: "🇺🇦" },
];

interface PhoneInputProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  countryCode: string;
  onValueChange: (value: string) => void;
  onCountryCodeChange: (code: string) => void;
  error?: string;
  required?: boolean;
}

export default function PhoneInput({
  id,
  label,
  placeholder,
  value,
  countryCode,
  onValueChange,
  onCountryCodeChange,
  error,
  required = false,
}: PhoneInputProps) {
  const selectedCountry = countryCodes.find((c) => c.dialCode === countryCode) || countryCodes[0];

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-normal text-gray-900 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex gap-2">
        <div className="relative">
          <select
            value={countryCode}
            onChange={(e) => onCountryCodeChange(e.target.value)}
            className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white pr-8 text-black"
          >
            {countryCodes.map((country) => (
              <option key={country.code} value={country.dialCode}>
                {country.flag} {country.dialCode}
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <path d="M3 4.5l3 3 3-3" />
            </svg>
          </div>
        </div>
        <input
          type="tel"
          id={id}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholder}
          className={`text-black flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      
    </div>
  );
}
