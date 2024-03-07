import * as React from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import BancolombiaIcon from './/assets/logo.svg'
import { connectWallet, getCurrentWalletConnected } from "./utils/interact.jsx";
import { useEffect, useState, useContext } from "react";
import { AppContext } from './App';
import { useNavigate } from 'react-router-dom';
import { NavLink as ReactNav } from 'react-router-dom'


export function AppBarTop() {

    // Se ejecuta cada vez que se renderiza y verifica la conexion con la billetera
    useEffect(() => {
        async function fetchWallet() {
            const { address } = await getCurrentWalletConnected();
            setWallet(address)
            addWalletListener()
        }

        fetchWallet()

    }, []);  

    // Lo siguientes 3 ajustes se pueden editar
    // Paginas que se muestran en el menu
    const pages = ['Tickets'];
    // Titulo que se muestra cuando el tamaño de pantalla es de un computador
    const titulo = 'POC - CIRCLE'
    // Titulo que se muestra cuando el tamaño de pantalla es de un celular
    const tituloResumido = 'CIRCLE'
    // Link base de la pagina que debe ser igual al estipulado en App.jsx
    const linkBase = 'POC-Circle/'

    const navigate = useNavigate();
    const [walletAddress, setWallet] = useState("");
    const contextData = useContext(AppContext);
    const connectWalletPressed = async () => {
        const walletResponse = await connectWallet();
        contextData.severity("success")
        contextData.text(walletResponse.status)
        contextData.show(true);
        setWallet(walletResponse.address);

    };

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };


    const handleCloseNavMenu = (page) => {
        page = page.toLowerCase();
        page = page.replace(" ","")
        navigate(linkBase + page);
        setAnchorElNav(null);
    };

    function addWalletListener() {


        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    setWallet(accounts[0]);
                } else {
                    setWallet("");
                    contextData.severity("warning")
                    contextData.text("🦊 Connect to Metamask using the top right button.")
                    contextData.show(true);
                }
            });
        } else {
            contextData.severity("warning")
            contextData.text(true);
            contextData.show(
                <div>
                    🦊{" "}
                    <a target="_blank" rel="noopener noreferrer" href={`https://metamask.io/download.html`}>
                        Debes instalar Metamask en tu navegador
                    </a>
                </div>
            );
        }
    }

    return (
        <AppBar position="static" sx={{ borderRadius: 1 }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box component="img" src={BancolombiaIcon} alt="Logo de Bancolombia" sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, maxWidth: 40 }} />

                    <MenuItem onClick={() => handleCloseNavMenu("")} sx={{ display: { xs: 'none', md: 'flex' }}}>
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                                '&:hover': {bgcolor: 'white', color: 'black'},
                                borderRadius: 1
                            }}
                        >
                            {titulo}
                        </Typography>
                    </MenuItem>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={() => handleCloseNavMenu("")}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={() => handleCloseNavMenu(page)} autoFocus >
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    
                  <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        onClick={() => handleCloseNavMenu("")}
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        {tituloResumido}
                    </Typography>
                    <Box sx={{ flexGrow: 1, textAlign:'center', display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                            component={ReactNav}
                            to={linkBase+page.replace(" ","")}
                                key={page}
                                onClick={() => handleCloseNavMenu(page)}
                                sx={{mr: 1, my: 2, color: 'white', active:'true', display: 'block', '&:hover': {bgcolor: 'white', color: 'black'},'&.active': {bgcolor: 'white', color: 'black'}}}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0,  display: { xs: 'none', md: 'flex' }}}>
                        <Button variant="contained" id="walletButton" onClick={connectWalletPressed} color="yellow" sx={{ backgroundColor: 'FCDB25' }}>
                            {walletAddress.length > 0 ? (
                                "Conectado: " +
                                String(walletAddress).substring(0, 6) +
                                "..." +
                                String(walletAddress).substring(38)
                            ) : (
                                <span>Conectar Billetera</span>
                            )}
                        </Button>
                    </Box>

                    <Box sx={{ flexGrow: 0,  display: { xs: 'flex', md: 'none' }}}>
                        <Button variant="contained" id="walletButton" onClick={connectWalletPressed} color="yellow" sx={{ backgroundColor: 'FCDB25' }}>
                            {walletAddress.length > 0 ? (
                                "Conectado"
                            ) : (
                                <span>Conectar</span>
                            )}
                        </Button>
                    </Box>

                </Toolbar>
            </Container>
        </AppBar >
    )
}