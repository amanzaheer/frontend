import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
} from "@mui/icons-material";
import SearchBox from "./SearchBox";
import { useState } from "react";
import Image from "next/image";

const DataTable = ({
  heads,
  items,
  className,
  tableHeight,
  isLoading,
  totalRecords,
  startIndex,
  lastIndex,
  toNextPage,
  toPreviousPage,
  toFirstPage,
  toLastPage,
  nextPageDisabled,
  previousPageDisabled,
  tdClass,
  title,
  searchBox,
  actions,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <>
      <div className="flex items-center justify-between">
        {title && <h1 className="font-bold text-3xl capitalize">{title}</h1>}
        <div className="flex items-center justify-end gap-3">
          {searchBox && (
            <div className="relative w-fit">
              <SearchBox
                type="text"
                placeholder="Search..."
                className="border border-gray-300 rounded-md bg-white w-fit"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setSearchQuery("")}
                >
                  Clear
                </button>
              )}
            </div>
          )}
          {actions && actions}
        </div>
      </div>

      <div
        className={`rounded w-full bg-white shadow-md mt-5 p-3 ${className}`}
      >
        <div
          className={`overflow-y-scroll scroll-container ${
            totalRecords ? "h-[calc(100vh-235px)]" : "h-[calc(100vh-210px)]"
          } w-full ${tableHeight}`}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200 backdrop-blur-md sticky top-0 shadow-sm">
              <tr>
                {heads?.map((head, key) => (
                  <th key={key} scope="col" className="tableHead">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 h-full overflow-y-scroll">
              {items
                ?.filter((item) =>
                  Object.values(item).some((value) =>
                    String(value) // Convert to string
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                )
                .map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    {Object.values(item).map((value, key) => (
                      <td className="p-3" key={key}>
                        <div className={`text-sm whitespace-nowrap ${tdClass}`}>
                          {value}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
          {isLoading && (
            <div className="flex items-center justify-center py-10 w-full">
              <Image
                src="/img/loading.gif"
                height="15"
                width="200"
                className="w-16"
                alt=""
              />
            </div>
          )}
        </div>
      </div>
      {totalRecords && (
        <div className="flex flex-col md:flex-row items-center justify-between mt-3">
          <div className="hidden md:flex item-center">
            Total Records: {totalRecords}
          </div>
          {startIndex && (
            <div className="flex items-center justify-end gap-2">
              {startIndex} - {lastIndex} of {totalRecords}
              {toFirstPage && (
                <button
                  type="button"
                  className="pagination ml-5"
                  onClick={toFirstPage}
                  disabled={previousPageDisabled}
                >
                  <FirstPage />
                </button>
              )}
              {toPreviousPage && (
                <button
                  type="button"
                  className="pagination"
                  onClick={toPreviousPage}
                  disabled={previousPageDisabled}
                >
                  <KeyboardArrowLeft />
                </button>
              )}
              {toNextPage && (
                <button
                  type="button"
                  className="pagination"
                  onClick={toNextPage}
                  disabled={nextPageDisabled}
                >
                  <KeyboardArrowRight />
                </button>
              )}
              {toLastPage && (
                <button
                  type="button"
                  className="pagination"
                  onClick={toLastPage}
                  disabled={nextPageDisabled}
                >
                  <LastPage />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DataTable;
