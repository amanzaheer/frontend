import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function SearchBox({
  className,
  value,
  onChange,
  searchButton,
  error,
  loading,
  placeholder,
}) {
  return (
    <div
      className={`lg:max-w-2xl relative w-full z-10 backdrop-blur-sm lg:bg-white rounded-full lg:shadow ${className}`}
    >
      <div className="flex items-center justify-center gap-2">
        <div className="border lg:border-none flex items-center w-full appearance-none lg:px-3 rounded-full bg-white text-black py-2 flex-1">
          <MagnifyingGlassIcon className="w-5 text-primary hidden lg:block" />
          <input
            placeholder={placeholder}
            className="bg-transparent flex-1 w-full outline-none ml-5 lg:ml-3 py-1 lg:py-0 appearance-none"
            onChange={onChange}
            value={value}
          />
        </div>
        {searchButton && (
          <button
            title="search button"
            aria-label="search button"
            onClick={searchMe}
            className="btnPrimary rounded-full w-auto"
          >
            <span className="hidden lg:block">Search</span>
            <MagnifyingGlassIcon className="w-6 text-white lg:hidden" />
          </button>
        )}
      </div>
      <div className="absolute w-full flex items-center justify-center flex-col lg:items-start lg:pl-5">
        {error && (
          <p className=" bg-red-100 px-4 py-2 mt-3 rounded-md text-red-600 text-center">
            {error}
          </p>
        )}
        {loading && (
          <p className="bg-blue-50 text-primary px-4 py-2 mt-3 rounded-md mb-1 text-center">
            Looking for desired area...
          </p>
        )}
      </div>
    </div>
  );
}
