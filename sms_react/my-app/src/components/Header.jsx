
import React from "react";

function Header({ pageTitle }) {
  return (
    <div className="bg-zinc-200 text-black shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">{pageTitle}</h1>
      
    </div>
  );
}

export default Header;
