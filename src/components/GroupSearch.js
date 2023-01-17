import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { BsSearch } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { searchData } from "../slices/searchSlice";

const GroupSearch = ({ obj }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.filterData.data);

  const [showform, setShowForm] = useState(false);
  const [input, setInput] = useState("");

  const handleSearch = (e) => {
    if (obj.length > 0) {
      setInput(e);
      let arr = [];
      if (e.length === 0) {
        dispatch(searchData([]));
      } else {
        obj.filter((item) => {
          console.log();
          if (item.groupname.toLowerCase().includes(e.toLowerCase())) {
            arr.push(item);
          }
          dispatch(searchData([...arr]));
        });
      }
    }
  };
  console.log(obj);
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
          className="text-[24px] text-primary  cursor-pointer"
        />
      </div>
    </div>
  );
};

export default GroupSearch;
