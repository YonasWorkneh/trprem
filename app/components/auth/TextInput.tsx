interface TextInputProps {
  id: string;
  label: string;
  type?: "text" | "email" | "tel";
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export default function TextInput({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
}: TextInputProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-normal text-gray-900 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
