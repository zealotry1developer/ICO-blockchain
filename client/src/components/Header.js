import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import GlobalContext from "../context/GlobalContext";
import NavbarMobile from "./NavbarMobile";
import { Tooltip } from "chart.js";


const Header = () => {
  const { provider, account, handleConnectWallet } = useContext(GlobalContext);

  const navigate = useNavigate();

  return (
    <div className="header">
      <div className="flex gap-2">
        <div
          className="font-poppins fsssont-bold text-[21px] hover:text-blue-400"
          onClick={() => navigate("/")}
        >
          ICO App
        </div>
      </div>
      <div 
        className="btn " 
        onClick={!provider ? handleConnectWallet : null}
        >
        {provider
          ? `${account.address.substring(
              0,
              6
            )}......${account.address.substring(36, 42)}`
          : "Connect"}
        
      </div>
      {/* <Button>

      </Button> */}
    </div>
  );
};

export default Header;
