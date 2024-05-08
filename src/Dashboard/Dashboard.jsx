import { ExpandLess, ExpandMore } from "@mui/icons-material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AppSettingsAltIcon from "@mui/icons-material/AppSettingsAlt";
import ApprovalIcon from "@mui/icons-material/Approval";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CommentIcon from "@mui/icons-material/Comment";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupsIcon from "@mui/icons-material/Groups";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MenuIcon from "@mui/icons-material/Menu";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import NoFoodIcon from "@mui/icons-material/NoFood";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import PostAddIcon from "@mui/icons-material/PostAdd";
import QuizIcon from "@mui/icons-material/Quiz";
import RemoveIcon from "@mui/icons-material/Remove";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import VideoSettingsIcon from "@mui/icons-material/VideoSettings";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import {
  Avatar,
  Button,
  Collapse,
  Grid,
  MenuItem,
  Modal,
  Paper,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import * as React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../../src/assets/logo.png";
import "../Dashboard/Dashboard.css";
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import avatar from "../assets/avtar.png";

const drawerWidth = 260;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "#8F00FF",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100%)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      borderRight: "none",
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      borderRight: "none",
    },
  }),
}));
const style = {
  position: "absolute",
  top: "25%",
  left: "87%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  marginTop: 7,
};

export default function Dashboard() {
  const Navigate = useNavigate();
  const router = useLocation();
  const [open, setOpen] = React.useState(false);
  const [openList, setOpenList] = React.useState(false);
  const [on, setOn] = React.useState(false);

  const [openMenu, setOpenMenu] = React.useState(false);
  const [list, setList] = React.useState(false);

  const [openProcessTransactions, setOpenProcessTransactions] =
    React.useState(false);

  const handleOn = () => {
    setOn(true);
  };
  const handleClose = () => {
    setOn(false);
  };

  const theme = useTheme();

  const location = useLocation();

  const handleDrawerOpen = () => {
    setOpen(!open);
    handleClickTransaction();
  };

  const handleClickMasters = () => {
    if (!open) {
      setOpen(true);
    }
    setOpenList(!openList);
    if (openProcessTransactions) {
      setOpenProcessTransactions(!openProcessTransactions);
    }
    handleClickTransaction();
  };

  const handleClickMenu = () => {
    if (!openMenu) {
      setOpenMenu(true);
    }
    setList(!list);
    if (openProcessTransactions) {
      setOpenProcessTransactions(!openProcessTransactions);
    }
    handleClickTransaction();
    if (!open) {
      setOpen(true);
    }
  };

  const handleClickTransaction = () => {
    setOpenProcessTransactions(!openProcessTransactions);
    if (openList) {
      setOpenList(!openList);
    } else if (list) {
      setList(!list);
    }
  };
  const menuId = "primary-search-account-menu";
  return (
    <Box sx={{ display: "flex", backgroundColor: "#F5F6FA" }}>
      <CssBaseline />
      <Modal open={on} onClose={handleClose}>
        <Paper elevation={10} sx={{ ...style, width: 300, bgcolor: "#EDE7F6" }}>
          <center>
            <Grid
              container
              item
              height={"100%"}
              width={"100%"}
              justifyContent={"center"}
              alignItems="center"
              position="relative"
            >
              <Avatar
                alt="Avatar"
                src={avatar}
                sx={{
                  width: 80,
                  height: 80,
                  position: "absolute",
                  top: "calc(28% - 50px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 1,
                }}
              />

              <Grid
                item
                height={100}
                width={"100%"}
                style={{
                  backgroundColor: "#8F00FF",
                  backgroundImage:
                    "linear-gradient(360deg, #647DEE 0%, #7F53AC 74%)",
                }}
              />

              <Paper
                style={{
                  width: "270px",
                  marginTop: -40,
                  borderRadius: 10,
                  position: "relative",
                  marginLeft: 15,
                  marginRight: 15,
                  zIndex: 0,
                }}
              >
                <Grid
                  paddingTop={7}
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                >
                  <MenuItem sx={{ fontSize: 13 }}>
                    <b>Name : {sessionStorage.getItem("userId") || "...."}</b>
                  </MenuItem>
                  <MenuItem sx={{ fontSize: 13, paddingTop: 0 }}>
                    <b>Mob :</b> +1234567890
                  </MenuItem>

                  <MenuItem sx={{ fontSize: 13, paddingTop: 0 }}>
                    <b>Username :</b>Admin@123
                  </MenuItem>

                  <MenuItem sx={{ fontSize: 13, paddingTop: 0 }}>
                    <b>Address :</b> Ahmednagar , Maharashtra
                  </MenuItem>
                </Grid>

                <Grid
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                  paddingBottom={2}
                >
                  <Button
                    onClick={() => {
                      Navigate("/");
                    }}
                    sx={{
                      borderRadius: 10,
                      backgroundColor: "#70b2d9",
                      backgroundImage:
                        "linear-gradient(180deg, #647DEE 0%, #7F53AC 180%)",
                      color: "white",
                      fontSize: 10,
                    }}
                  >
                    <b>Log Out</b>
                  </Button>
                </Grid>
              </Paper>
            </Grid>
          </center>
        </Paper>
      </Modal>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            textAlign={"center"}
            width={"100%"}
          >
            The Dream Mom
          </Typography>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleOn}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Grid
          style={{
            height: 90,
            backgroundColor: "white",
          }}
        >
          {" "}
          {/* <img
            src={images}
            alt="Logo"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: 10,
            }}
          /> */}
          <img
            src={logo}
            alt="logo"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              paddingTop: 10,
            }}
          />
        </Grid>
        <Grid
          sx={{
            width: "100%",
            maxWidth: 340,
            height: "100%",
            backgroundColor: "white",
            overflow: "hidden",
            "&:hover": {
              overflowY: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: "#888 transparent",
            },
          }}
        >
          <List
            sx={{
              width: "100%",
              maxWidth: 340,
              height: "100%",
              ...(open && {
                margin: "0 0",
              }),
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            <Link to="home" className="link_style">
              <ListItemButton
                onClick={handleClickTransaction}
                selected={location.pathname === "/dashboard/home"}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#8F00FF",
                    // m:0.5,
                    borderRadius: 1,
                    "& .MuiListItemIcon-root, & .MuiTypography-root": {
                      color: "#FFFFFF",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "32px", marginRight: "8px" }}>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </Link>
            <Link to="manage-user" className="link_style">
              <ListItemButton
                onClick={handleClickTransaction}
                selected={location.pathname === "/dashboard/manage-user"}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#8F00FF",
                    // m:0.5,
                    borderRadius: 1,
                    "& .MuiListItemIcon-root, & .MuiTypography-root": {
                      color: "#FFFFFF",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "32px", marginRight: "8px" }}>
                  <ManageAccountsIcon />
                </ListItemIcon>
                <ListItemText primary="Manage User" />
              </ListItemButton>
            </Link>
            <ListItemButton
              onClick={handleClickMasters}
              selected={location.pathname === "/manage-schedule"}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#8F00FF",
                  // m:0.5,
                  borderRadius: 1,
                  "& .MuiListItemIcon-root, & .MuiTypography-root": {
                    color: "#FFFFFF",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: "32px", marginRight: "8px" }}>
                <WorkHistoryIcon />
              </ListItemIcon>
              <ListItemText primary="Manage Schedule" />

              {openList ? (
                <ExpandLess style={{ marginLeft: "auto" }} />
              ) : (
                <ExpandMore style={{ marginLeft: "auto" }} />
              )}
            </ListItemButton>

            <Collapse in={openList} timeout="auto">
              <List component="div" disablePadding>
                <Link to="manage-schedule/diet" className="link_style">
                  <ListItemButton
                    selected={
                      router.pathname === "/dashboard/manage-schedule/diet"
                        ? true
                        : false
                    }
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "#8F00FF",
                        // m:0.5,
                        borderRadius: 1,
                        "& .MuiListItemIcon-root, & .MuiTypography-root": {
                          color: "#FFFFFF",
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ pl: 4 }}>
                      <RemoveIcon />
                    </ListItemIcon>
                    <ListItemText primary="Diet" sx={{ pl: 2 }} />
                  </ListItemButton>
                </Link>

                <Link to="manage-schedule/exercise" className="link_style">
                  <ListItemButton
                    selected={
                      router.pathname === "/dashboard/manage-schedule/exercise"
                        ? true
                        : false
                    }
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "#8F00FF",
                        // m:0.5,
                        borderRadius: 1,
                        "& .MuiListItemIcon-root, & .MuiTypography-root": {
                          color: "#FFFFFF",
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ pl: 4 }}>
                      <RemoveIcon />
                    </ListItemIcon>
                    <ListItemText primary="Exercise" sx={{ pl: 2 }} />
                  </ListItemButton>
                </Link>

                <Link to="manage-schedule/medical" className="link_style">
                  <ListItemButton
                    selected={
                      router.pathname === "/dashboard/manage-schedule/medical"
                        ? true
                        : false
                    }
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "#8F00FF",
                        // m:0.5,
                        borderRadius: 1,
                        "& .MuiListItemIcon-root, & .MuiTypography-root": {
                          color: "#FFFFFF",
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ pl: 4 }}>
                      <RemoveIcon />
                    </ListItemIcon>
                    <ListItemText primary="Medical Test" sx={{ pl: 2 }} />
                  </ListItemButton>
                </Link>

                <Link to="manage-schedule/medication" className="link_style">
                  <ListItemButton
                    selected={
                      router.pathname ===
                      "/dashboard/manage-schedule/medication"
                        ? true
                        : false
                    }
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "#8F00FF",
                        // m:0.5,
                        borderRadius: 1,
                        "& .MuiListItemIcon-root, & .MuiTypography-root": {
                          color: "#FFFFFF",
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ pl: 4 }}>
                      <RemoveIcon />
                    </ListItemIcon>
                    <ListItemText primary="Medications" sx={{ pl: 2 }} />
                  </ListItemButton>
                </Link>

                <Link to="manage-schedule/precaution" className="link_style">
                  <ListItemButton
                    selected={
                      router.pathname ===
                      "/dashboard/manage-schedule/precaution"
                        ? true
                        : false
                    }
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "#8F00FF",
                        // m:0.5,
                        borderRadius: 1,
                        "& .MuiListItemIcon-root, & .MuiTypography-root": {
                          color: "#FFFFFF",
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ pl: 4 }}>
                      <RemoveIcon />
                    </ListItemIcon>
                    <ListItemText primary="Precaution" sx={{ pl: 2 }} />
                  </ListItemButton>
                </Link>

                <Link to="manage-schedule/vaccination" className="link_style">
                  <ListItemButton
                    selected={
                      router.pathname ===
                      "/dashboard/manage-schedule/vaccination"
                        ? true
                        : false
                    }
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "#8F00FF",
                        // m:0.5,
                        borderRadius: 1,
                        "& .MuiListItemIcon-root, & .MuiTypography-root": {
                          color: "#FFFFFF",
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ pl: 4 }}>
                      <RemoveIcon />
                    </ListItemIcon>
                    <ListItemText primary="Vaccination" sx={{ pl: 2 }} />
                  </ListItemButton>
                </Link>
              </List>
            </Collapse>
            <ListItemButton
              onClick={handleClickMenu}
              selected={location.pathname === "/post-natal"}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#8F00FF",
                  // m:0.5,
                  borderRadius: 1,
                  "& .MuiListItemIcon-root, & .MuiTypography-root": {
                    color: "#FFFFFF",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: "32px", marginRight: "8px" }}>
                <ApprovalIcon />
              </ListItemIcon>
              <ListItemText primary="Post Natal" />

              {list ? (
                <ExpandLess style={{ marginLeft: "auto" }} />
              ) : (
                <ExpandMore style={{ marginLeft: "auto" }} />
              )}
            </ListItemButton>
            <Collapse in={list} timeout="auto">
              <List component="div" disablePadding>
                <Link to="post-natal/pndiet" className="link_style">
                  <ListItemButton
                    selected={
                      router.pathname === "/dashboard/post-natal/pndiet"
                        ? true
                        : false
                    }
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "#8F00FF",
                        // m:0.5,
                        borderRadius: 1,
                        "& .MuiListItemIcon-root, & .MuiTypography-root": {
                          color: "#FFFFFF",
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ pl: 4 }}>
                      <RemoveIcon />
                    </ListItemIcon>
                    <ListItemText primary="Diet" sx={{ pl: 2 }} />
                  </ListItemButton>
                </Link>

                <Link to="post-natal/pnexercise" className="link_style">
                  <ListItemButton
                    selected={
                      router.pathname === "/dashboard/post-natal/pnexercise"
                        ? true
                        : false
                    }
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "#8F00FF",
                        // m:0.5,
                        borderRadius: 1,
                        "& .MuiListItemIcon-root, & .MuiTypography-root": {
                          color: "#FFFFFF",
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ pl: 4 }}>
                      <RemoveIcon />
                    </ListItemIcon>
                    <ListItemText primary="Exercise" sx={{ pl: 2 }} />
                  </ListItemButton>
                </Link>

                <Link to="post-natal/pnprecaution" className="link_style">
                  <ListItemButton
                    selected={
                      router.pathname === "/dashboard/post-natal/pnprecaution"
                        ? true
                        : false
                    }
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "#8F00FF",
                        // m:0.5,
                        borderRadius: 1,
                        "& .MuiListItemIcon-root, & .MuiTypography-root": {
                          color: "#FFFFFF",
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ pl: 4 }}>
                      <RemoveIcon />
                    </ListItemIcon>
                    <ListItemText primary="Precautions" sx={{ pl: 2 }} />
                  </ListItemButton>
                </Link>

                <Link to="post-natal/pnmedication" className="link_style">
                  <ListItemButton
                    selected={
                      router.pathname === "/dashboard/post-natal/pnmedication"
                        ? true
                        : false
                    }
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "#8F00FF",
                        // m:0.5,
                        borderRadius: 1,
                        "& .MuiListItemIcon-root, & .MuiTypography-root": {
                          color: "#FFFFFF",
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ pl: 4 }}>
                      <RemoveIcon />
                    </ListItemIcon>
                    <ListItemText primary="Medications" sx={{ pl: 2 }} />
                  </ListItemButton>
                </Link>

                <Link to="post-natal/pnvaccination" className="link_style">
                  <ListItemButton
                    selected={
                      router.pathname === "/dashboard/post-natal/pnvaccination"
                        ? true
                        : false
                    }
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "#8F00FF",
                        // m:0.5,
                        borderRadius: 1,
                        "& .MuiListItemIcon-root, & .MuiTypography-root": {
                          color: "#FFFFFF",
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ pl: 4 }}>
                      <RemoveIcon />
                    </ListItemIcon>
                    <ListItemText primary="Vaccination" sx={{ pl: 2 }} />
                  </ListItemButton>
                </Link>
              </List>
            </Collapse>

            <Link to="plan-master" className="link_style">
              <ListItemButton
                onClick={handleClickTransaction}
                selected={location.pathname === "/dashboard/plan-master"}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#8F00FF",
                    // m:0.5,
                    borderRadius: 1,
                    "& .MuiListItemIcon-root, & .MuiTypography-root": {
                      color: "#FFFFFF",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "32px", marginRight: "8px" }}>
                  <MonitorHeartIcon />
                </ListItemIcon>
                <ListItemText primary="Plan Master" />
              </ListItemButton>
            </Link>

            <Link to="manage-assesment" className="link_style">
              <ListItemButton
                onClick={handleClickTransaction}
                selected={location.pathname === "/dashboard/manage-assesment"}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#8F00FF",
                    // m:0.5,
                    borderRadius: 1,
                    "& .MuiListItemIcon-root, & .MuiTypography-root": {
                      color: "#FFFFFF",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "32px", marginRight: "8px" }}>
                  <NoteAltIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Assestment" />
              </ListItemButton>
            </Link>

            <Link to="medical-condition" className="link_style">
              <ListItemButton
                onClick={handleClickTransaction}
                selected={location.pathname === "/dashboard/medical-condition"}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#8F00FF",
                    // m:0.5,
                    borderRadius: 1,
                    "& .MuiListItemIcon-root, & .MuiTypography-root": {
                      color: "#FFFFFF",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "32px", marginRight: "8px" }}>
                  <MonitorHeartIcon />
                </ListItemIcon>
                <ListItemText primary="Medical Condition" />
              </ListItemButton>
            </Link>
            <Link to="manage-avoid-food" className="link_style">
              <ListItemButton
                onClick={handleClickTransaction}
                selected={location.pathname === "/dashboard/manage-avoid-food"}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#8F00FF",
                    // m:0.5,
                    borderRadius: 1,
                    "& .MuiListItemIcon-root, & .MuiTypography-root": {
                      color: "#FFFFFF",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "32px", marginRight: "8px" }}>
                  <NoFoodIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Avoid Foods" />
              </ListItemButton>
            </Link>
            <Link to="manage-videos" className="link_style">
              <ListItemButton
                onClick={handleClickTransaction}
                selected={location.pathname === "/dashboard/manage-videos"}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#8F00FF",
                    // m:0.5,
                    borderRadius: 1,
                    "& .MuiListItemIcon-root, & .MuiTypography-root": {
                      color: "#FFFFFF",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "32px", marginRight: "8px" }}>
                  <VideoSettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Videos" />
              </ListItemButton>
            </Link>
            <Link to="manage-posts" className="link_style">
              <ListItemButton
                onClick={handleClickTransaction}
                selected={location.pathname === "/dashboard/manage-posts"}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#8F00FF",
                    // m:0.5,
                    borderRadius: 1,
                    "& .MuiListItemIcon-root, & .MuiTypography-root": {
                      color: "#FFFFFF",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "32px", marginRight: "8px" }}>
                  <PostAddIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Posts" />
              </ListItemButton>
            </Link>
            <Link to="manage-faq" className="link_style">
              <ListItemButton
                onClick={handleClickTransaction}
                selected={location.pathname === "/dashboard/manage-faq"}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#8F00FF",
                    // m:0.5,
                    borderRadius: 1,
                    "& .MuiListItemIcon-root, & .MuiTypography-root": {
                      color: "#FFFFFF",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "32px", marginRight: "8px" }}>
                  <QuizIcon />
                </ListItemIcon>
                <ListItemText primary="Manage FAQ's" />
              </ListItemButton>
            </Link>

            <Link to="manage-subscription" className="link_style">
              <ListItemButton
                onClick={handleClickTransaction}
                selected={
                  location.pathname === "/dashboard/manage-subscription"
                }
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#8F00FF",
                    // m:0.5,
                    borderRadius: 1,
                    "& .MuiListItemIcon-root, & .MuiTypography-root": {
                      color: "#FFFFFF",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "32px", marginRight: "8px" }}>
                  <SubscriptionsIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Subscription" />
              </ListItemButton>
            </Link>
            <Link to="manage-report" className="link_style">
              <ListItemButton
                onClick={handleClickTransaction}
                selected={location.pathname === "/dashboard/manage-report"}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#8F00FF",
                    // m:0.5,
                    borderRadius: 1,
                    "& .MuiListItemIcon-root, & .MuiTypography-root": {
                      color: "#FFFFFF",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "32px", marginRight: "8px" }}>
                  <NoteAddIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Report" />
              </ListItemButton>
            </Link>
            <Link to="manage-advertise" className="link_style">
              <ListItemButton
                onClick={handleClickTransaction}
                selected={location.pathname === "/dashboard/manage-advertise"}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#8F00FF",
                    // m:0.5,
                    borderRadius: 1,
                    "& .MuiListItemIcon-root, & .MuiTypography-root": {
                      color: "#FFFFFF",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "32px", marginRight: "8px" }}>
                  <AppSettingsAltIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Advertise" />
              </ListItemButton>
            </Link>
            <Link to="manage-blog" className="link_style">
              <ListItemButton
                onClick={handleClickTransaction}
                selected={location.pathname === "/dashboard/manage-blog"}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#8F00FF",
                    // m:0.5,
                    borderRadius: 1,
                    "& .MuiListItemIcon-root, & .MuiTypography-root": {
                      color: "#FFFFFF",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "32px", marginRight: "8px" }}>
                  <NewspaperIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Blog & letter" />
              </ListItemButton>
            </Link>
            <Link to="manage-expert" className="link_style">
              <ListItemButton
                onClick={handleClickTransaction}
                selected={location.pathname === "/dashboard/manage-expert"}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#8F00FF",
                    // m:0.5,
                    borderRadius: 1,
                    "& .MuiListItemIcon-root, & .MuiTypography-root": {
                      color: "#FFFFFF",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "32px", marginRight: "8px" }}>
                  <GroupsIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Expert ANS" />
              </ListItemButton>
            </Link>
            <Link to="manage-comments" className="link_style">
              <ListItemButton
                onClick={handleClickTransaction}
                selected={location.pathname === "/dashboard/manage-comments"}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#8F00FF",
                    // m:0.5,
                    borderRadius: 1,
                    "& .MuiListItemIcon-root, & .MuiTypography-root": {
                      color: "#FFFFFF",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "32px", marginRight: "8px" }}>
                  <CommentIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Comments" />
              </ListItemButton>
            </Link>
            <Link to="manage-doses" className="link_style">
              <ListItemButton
                onClick={handleClickTransaction}
                selected={location.pathname === "/dashboard/manage-doses"}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#8F00FF",
                    // m:0.5,
                    borderRadius: 1,
                    "& .MuiListItemIcon-root, & .MuiTypography-root": {
                      color: "#FFFFFF",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "32px", marginRight: "8px" }}>
                  <VaccinesIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Dosage" />
              </ListItemButton>
            </Link>
            <Link to="manage-tags" className="link_style">
              <ListItemButton
                onClick={handleClickTransaction}
                selected={location.pathname === "/dashboard/manage-tags"}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#8F00FF",
                    // m:0.5,
                    borderRadius: 1,
                    "& .MuiListItemIcon-root, & .MuiTypography-root": {
                      color: "#FFFFFF",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "32px", marginRight: "8px" }}>
                  <LocalOfferIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Tags" />
              </ListItemButton>
            </Link>
          </List>
        </Grid>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ...(open && { width: `calc(100% - ${drawerWidth}px)` }),

          ...(!open && {
            width: theme.spacing(7),
            [theme.breakpoints.up("sm")]: {
              width: theme.spacing(9),
            },
          }),
        }}
      >
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
