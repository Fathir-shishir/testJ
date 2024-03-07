import { Fragment, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Global states
import { useSession } from "../../globalStates/session.state";

// MUI components
import { Drawer } from "@mui/material";

// MUI icons
import HomeIcon from "@mui/icons-material/Home";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; // for Book Out
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // for Book In
import DashboardIcon from '@mui/icons-material/Dashboard';
import JailIcon from "../../assets/images/jail.png"; 
import LockIcon from '@mui/icons-material/Lock';


// Components
import { LangContext } from "../../utils/context/LangContext";

// Images
import ProfileLogo from "../../images/profile-logo.svg";

const NavMenu = () => {
  const { t } = useContext(LangContext);
  const navigate = useNavigate();
  const useLoc = useLocation();
  const [sessionState, sessionAction] = useSession();

  const handleNavigation = (to) => {
    navigate(to);
    sessionAction.setVar("open", false);
  };

  const handleLogout = () => {
    axios.post(`http://localhost:8005/api/logout.php`, {}, { withCredentials: true })
    .then((res) => {
      if (res.data === true) {
        sessionAction.setVar("open", false);
        navigate("/login");
      } else {
        console.log("Logout failed: ", res.data);
      }
    }).catch((error) => {
      console.error("Logout error: ", error);
    });
};


  return (
    <Drawer
      anchor="left"
      open={sessionState.open}
      onClose={() => sessionAction.setVar("open", false)}
      PaperProps={{
        style: {
          height: "calc(100% - 64px)",
          top: 64,
          width: 350,
        },
      }}
      slotProps={{
        backdrop: {
          style: { top: 64, height: "calc(100vh - 4px)" },
        },
      }}
      sx={{ top: 64, height: "calc(100vh - 64px)" }}
    >
      <div className="bg-valeo-blue flex flex-col h-full items-center">
        <img alt="profil-logo" className="mt-10 mb-5" src={ProfileLogo} />
        <p className="font-semibold text-[#f7f5f5] text-3xl">
          {sessionState.name}
        </p>
        <p className="font-semibold text-gray-300 text-2xl mb-10 uppercase">
          {sessionState.apu}
        </p>
        <ul className="flex flex-col gap-2 h-full p-3 w-full">
          <li>
            <button
              className={`flex gap-3 items-center px-4 py-2 rounded transition-all w-full ${
                useLoc.pathname == "/home"
                  ? "bg-valeo-green drop-shadow hover:bg-valeo-green-hover text-[#494949]"
                  : "hover:bg-valeo-blue-hover text-[#f7f5f5]"
              }`}
              onClick={() => handleNavigation("/home")}
            >
              <div
                className={`flex h-7 items-center justify-center rounded w-7 ${
                  useLoc.pathname == "/home" ? "bg-valeo-blue" : ""
                }`}
              >
                <HomeIcon
                  sx={{
                    color: useLoc.pathname == "/home" ? "white" : "",
                    display: useLoc.pathname == "/home" ? "block" : "none",
                  }}
                />
                <HomeOutlinedIcon
                  sx={{
                    display: useLoc.pathname == "/home" ? "none" : "block",
                  }}
                />
              </div>
              <span className="font-semibold text-xl">
                {t("nav_menu.home")}
              </span>
            </button>
          </li>
          <li>
            <button
              className={`flex gap-3 items-center px-4 py-2 rounded transition-all w-full ${
                useLoc.pathname === "/jail"
                  ? "bg-valeo-green drop-shadow hover:bg-valeo-green-hover text-[#494949]"
                  : "hover:bg-valeo-blue-hover text-[#f7f5f5]"
              }`}
              onClick={() => handleNavigation("/jail")}
            >
              <div
                className={`flex h-7 items-center justify-center rounded w-7 ${
                  useLoc.pathname === "/jail" ? "bg-valeo-blue" : ""
                }`}
              >
                <img src={JailIcon} alt="Jail" style={{ width: '24px', height: '24px' }} />
              </div>
              <span className="font-semibold text-xl">
                {t("nav_menu.history")}
              </span>
            </button>
          </li>
          <li>
            <button
              className={`flex gap-3 items-center px-4 py-2 rounded transition-all w-full ${
                useLoc.pathname == "/bookedIn"
                  ? "bg-valeo-green drop-shadow hover:bg-valeo-green-hover text-[#494949]"
                  : "hover:bg-valeo-blue-hover text-[#f7f5f5]"
              }`}
              onClick={() => handleNavigation("/bookIn")}
            >
              <div
                className={`flex h-7 items-center justify-center rounded w-7 ${
                  useLoc.pathname == "/bookIn" ? "bg-valeo-blue" : ""
                }`}
              >
                <ArrowForwardIcon
                  sx={{
                    color: useLoc.pathname == "/bookIn" ? "white" : "",
                    display: useLoc.pathname == "/bookIn" ? "block" : "none",
                  }}
                />
                <ArrowForwardIcon
                  sx={{
                    display: useLoc.pathname == "/bookIn" ? "none" : "block",
                  }}
                />
              </div>
              <span className="font-semibold text-xl">
                {t("nav_menu.bookIn")}
              </span>
            </button>
          </li>
          
          <li>
            <button
              className={`flex gap-3 items-center px-4 py-2 rounded transition-all w-full ${
                useLoc.pathname == "/bookOut"
                  ? "bg-valeo-green drop-shadow hover:bg-valeo-green-hover text-[#494949]"
                  : "hover:bg-valeo-blue-hover text-[#f7f5f5]"
              }`}
              onClick={() => handleNavigation("/bookOut")}
            >
              <div
                className={`flex h-7 items-center justify-center rounded w-7 ${
                  useLoc.pathname == "/bookOut" ? "bg-valeo-blue" : ""
                }`}
              >
                <ArrowBackIcon
                  sx={{
                    color: useLoc.pathname == "/bookOut" ? "white" : "",
                    display: useLoc.pathname == "/bookOut" ? "block" : "none",
                  }}
                />
                <ArrowBackIcon
                  sx={{
                    display: useLoc.pathname == "/bookOut" ? "none" : "block",
                  }}
                />
              </div>
              <span className="font-semibold text-xl">
                {t("nav_menu.bookOut")}
              </span>
            </button>
          </li>
          
          <li>
            <button
              className={`flex gap-3 items-center px-4 py-2 rounded transition-all w-full ${
                useLoc.pathname == "/dashboard"
                  ? "bg-valeo-green drop-shadow hover:bg-valeo-green-hover text-[#494949]"
                  : "hover:bg-valeo-blue-hover text-[#f7f5f5]"
              }`}
              onClick={() => handleNavigation("/dashboard")}
            >
              <div
                className={`flex h-7 items-center justify-center rounded w-7 ${
                  useLoc.pathname == "/dashboard" ? "bg-valeo-blue" : ""
                }`}
              >
                <DashboardIcon
                  sx={{
                    color: useLoc.pathname == "/dashboard" ? "white" : "",
                    display: useLoc.pathname == "/dashboard" ? "block" : "none",
                  }}
                />
                <DashboardIcon
                  sx={{
                    display: useLoc.pathname == "/dashboard" ? "none" : "block",
                  }}
                />
              </div>
              <span className="font-semibold text-xl">
                {t("nav_menu.dashboard")}
              </span>
            </button>
          </li>
          <li className="mt-auto">
            <button
              className={`flex gap-3 hover:bg-[#708A99] items-center px-4 py-2 rounded text-[#f7f5f5] transition-all w-full `}
              onClick={() => handleLogout()}
            >
              <div
                className={`flex h-7 items-center justify-center rounded w-7 `}
              >
                <ExitToAppIcon />
              </div>
              <span className="font-semibold text-xl">
                {t("nav_menu.log_out")}
              </span>
            </button>
          </li>
        </ul>
      </div>
    </Drawer>
  );
};

export default NavMenu;
