import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { BsSearch } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { searchData } from "../slices/searchSlice";

const Search = ({ obj }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.filterData.data);

  const [showform, setShowForm] = useState(false);
  const [input, setInput] = useState("");
  const [tempData, setTempData] = useState([]);

  const handleSearch = (e) => {
    setInput(e);
    let arr = [];
    if (e.length === 0) {
      dispatch(searchData([]));
    } else {
      obj.filter((item) => {
        console.log();
        if (item.username.toLowerCase().includes(e.toLowerCase())) {
          arr.push(item);
        }
        dispatch(searchData([...arr]));
      });
    }
  };
  console.log(data);
  //   console.log(input);
  return (
    <div className=" grow ">
      <div className="flex justify-end gap-x-2 items-center">
        {showform && (
          <div className="w-full">
            <input
              className="w-full border py-1 px-2 rounded"
              type="text"
              placeholder="Search..."
              value={input}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        )}
        <BsSearch
          onClick={() => setShowForm(!showform)}
          className="text-[24px] text-green-500  cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Search;
