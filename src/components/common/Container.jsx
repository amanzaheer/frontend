export default function Container({ children, className }) {
  return (
    <div className={`flex flex-col items-center max-w-screen-xl ${className}`}>
      {children}
    </div>
  );
}
