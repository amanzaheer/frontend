export default function FullContainer({ children, className }) {
  return (
    <div
      className={`w-full flex items-center justify-center flex-col bg-cover bg-center ${className}`}
    >
      {children}
    </div>
  );
}
