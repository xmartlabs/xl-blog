import * as React from "react";
import { Link } from "gatsby";

import * as navMenuStyles from "./nav-menu.module.scss";
import { AppBar, Container, Toolbar, Button, IconButton, Typography, Hidden, Box, SwipeableDrawer, MenuItem } from "@mui/material";
import { HamburguerIcon } from "../icons/hamburguer-icon";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { StaticImage } from "gatsby-plugin-image";

const NavMenu = () => {
  const [drawerState, setDrawerState] = React.useState(false);

  const toggleDrawer = (state) => {
    setDrawerState(state ? state : !drawerState);
  };

  const handleClose = () => {
    setDrawerState(false);
  };

  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const menuElements = [
    {label: "Work", path:"/"},
    {label: "Services", path:"/" },
    {label: "Our Company", path:"/" },
    {label: "Community", path:"/" },
  ];

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link
            to="/"
            id="logo-xl">
            <StaticImage
              src="../../../static/images/logo.svg"
              alt="Xmartlabs"
              width={50}
              height={50}
              style={{ width: smDown ? '40px' : '50px', height: smDown ? '40px' : '50px' }}
            />
          </Link>
          <Hidden smDown>
            <Box sx={{ flexGrow: 1, display: 'flex' }}>
              {menuElements.map((element) => (
                <Link to={element.path} className='nav-item' key={element.label}>
                  <Typography variant="h6">
                    {element.label}
                  </Typography>
                </Link>
              ))}
            </Box>
            <Button variant="contained" color="primary">
              Get Started
            </Button>
          </Hidden>
          <Hidden mdUp>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'end' }}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={toggleDrawer}
              >
                <HamburguerIcon />
              </IconButton>
              <SwipeableDrawer
                anchor='top'
                open={drawerState}
                onClose={() => toggleDrawer(false)}
                onOpen={() => toggleDrawer(true)}
                disableScrollLock
              >
                {menuElements.map((element) => (
                  <MenuItem onClick={handleClose} key={element.label}>
                    <Link to={element.path} style={{ textDecoration: 'none' }}>
                      {element.label}
                    </Link>
                  </MenuItem>
                ))}
              </SwipeableDrawer>
            </Box>
          </Hidden>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export { NavMenu };
