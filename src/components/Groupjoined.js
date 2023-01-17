import React from "react";

const Groupjoined = ({ groupMembers, deletFromGroup }) => {
  return (
    <div className="mt-5">
      <div className="divide-y">
        {groupMembers.map((gr, gid) => (
          <div className="flex items-center justify-between py-4">
            <div className="h-[40px] w-[40px] rounded-full shadow-lg">
              <img
                className="w-full rounded-full"
                src={gr.memberImage}
                alt="profile"
              />
            </div>

            <div className="pl-5">
              <h4 className="text-base font-semibold">{gr.memberName}</h4>
              {/* <span className="inline-block rounded-full bg-slate-100 px-3 text-[12px] text-greenLight">
                {gr.grouptags}
              </span> */}
            </div>
            <div className="flex grow justify-end">
              <button
                onClick={() => deletFromGroup(gr)}
                className="inline-block rounded-full bg-primary px-4 py-1 text-[12px] font-semibold text-white shadow-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Groupjoined;
