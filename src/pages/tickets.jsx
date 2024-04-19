import * as React from 'react';
import { useEffect, useState, useContext } from "react";
import { checkNFT, getCurrentWalletConnected, postCard } from "../utils/interact.jsx";
import { Button, Box, Grid, CardActionArea, CardActions, Card, CardMedia, CardContent, Typography, Stack, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { AppContext } from '../App.jsx';

const Tickets = () => {



    const [data, setData] = useState([]);
    const [open, setOpen] = React.useState(false);
    //const [maxTickets, setMaxTickets] = React.useState(0);
    //const [ticketId, setTicketId] = React.useState(0);
    const [ticketPrice, setTicketPrice] = React.useState(0);
    const [cardNumber, setCardNumber] = React.useState(0);
    const [CVV, setCVV] = React.useState(0);
    const [expiryMonth, setExpiryMonth] = React.useState(0);
    const [expiryYear, setExpiryYear] = React.useState(0);
    const [fullName, setFullName] = React.useState(0);
    const [addressLine, setAddressLine] = React.useState(0);
    const [postalCode, setPostalCode] = React.useState(0);
    const [city, setCity] = React.useState(0);
    const [district, setDistrict] = React.useState(0);
    const [country, setCountry] = React.useState(0);
    const [phone, setPhone] = React.useState(0);
    const [email, setEmail] = React.useState(0);
    var contextData = useContext(AppContext);


    useEffect(() => {

        const onCheckPressed = async () => {

            const { status } = await checkNFT();
            const temp = await JSON.parse(status);
            setData(temp['ownedNfts'])

        };

        onCheckPressed()


    }, []);

    const getLocalDateTime = (date) => {
        return (date.getDate() + '/' +
            (date.getMonth() + 1) + '/' +
            date.getFullYear() + ' ' +
            date.getHours() + ':' +
            (date.getMinutes() < 10 ? '0' : '') + date.getMinutes())
    }

    const handleClickOpen = (pMaxTickets, pTicketID, pTicketPrice) => {
        //setMaxTickets(pMaxTickets)
        //setTicketId(pTicketID)
        setTicketPrice(pTicketPrice)
        //console.log(pMaxTickets, pTicketID, pTicketPrice)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handlepurchase = async () => {
        const { address } = await getCurrentWalletConnected()
        if (address !== undefined && address.length > 1) {
                let payLoad = {"price":ticketPrice, "cardNumer": cardNumber, "CVV": CVV, "expiryMonth": expiryMonth, "expiryYear": expiryYear, "fullName": fullName, "addressLine": addressLine, "postalCode": postalCode, "city": city, "district": district, "country": country, "phone": phone, "email": email }
                postCard(payLoad)
                const { severity, status } = { severity: 'success', status: 'Test' }
                contextData.severity(severity)
                contextData.text(status);
                contextData.show(true)

        }
        else {
            contextData.severity("warning")
            contextData.text("Conecta tu billeteta");
            contextData.show(true)
        }

        setOpen(false);
    };

    return (
        <Grid container justifyContent="center" maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', bgcolor: '#cfe8fc', minHeight: '80vh', borderRadius: 1, mt: 3, background: 'linear-gradient(to bottom, #F8F8F8, #FFFFFF)' }}>
            <Stack spacing={2} minWidth="90vw" justifyContent="center" alignItems="center">
                <Typography sx={{ mt: 3, typography: { xs: 'h5', sm: 'h5', md: 'h3', lg: 'h3' } }}>Eventos</Typography>
                <Box display="flex" alignItems="center">
                    <Grid container rowSpacing={1} maxWidth="xl" justifyContent="center" columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        {data?.map((nft) => (
                            <Grid item key={nft['tokenId']}>
                                <Card sx={{ maxWidth: 225, height: '100%' }}>
                                    <CardActionArea>
                                        <CardMedia

                                            component="img"
                                            image={nft['image']['cachedUrl']}
                                            alt="green iguana"
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {nft['title']}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" align="justify">
                                                {nft['description']}
                                            </Typography>
                                            <br></br>
                                            <Typography display='inline' fontWeight='bold'>Fecha: </Typography>
                                            <Typography display='inline' variant="body2" color="text.secondary" align="justify">
                                                {getLocalDateTime(new Date(nft['raw']['metadata']['date']))}
                                            </Typography>
                                            <br />
                                            <Typography display='inline' fontWeight='bold'>Precio: </Typography>
                                            <Typography display='inline' variant="body2" color="text.secondary" align="justify">
                                                {nft['raw']['metadata']['price'] + ' usd'}
                                            </Typography>
                                            <br />
                                            <Typography display='inline' fontWeight='bold'>Cantidad: </Typography>
                                            <Typography display='inline' variant="body2" color="text.secondary" align="justify">
                                                {nft['balance']}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions sx={{ justifyContent: "center", }}>
                                        <Button size="small" color="yellow" variant="contained" onClick={() => handleClickOpen(nft['balance'], nft['tokenId'], nft['raw']['metadata']['price'])}>
                                            Comprar
                                        </Button>
                                        <Dialog open={open} onClose={handleClose}>
                                            <DialogTitle>Compra de boletas</DialogTitle>
                                            <DialogContent>
                                                <Grid container >
                                                    <Grid item xs={5.5}>
                                                        <DialogContentText>
                                                            Numero de tarjeta
                                                        </DialogContentText>

                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            type="number"
                                                            fullWidth
                                                            variant="standard"
                                                            onChange={(event) => setCardNumber(event.target.value)}
                                                            InputProps={{
                                                                inputProps: {
                                                                    type: 'number',
                                                                },
                                                            }}
                                                        />
                                                        <DialogContentText>
                                                            Mes de expiración
                                                        </DialogContentText>

                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            type="number"
                                                            fullWidth
                                                            variant="standard"
                                                            onChange={(event) => setExpiryMonth(event.target.value)}
                                                            InputProps={{
                                                                inputProps: {
                                                                    type: 'number',
                                                                },
                                                            }}
                                                        />
                                                        <DialogContentText>
                                                            Nombre completo
                                                        </DialogContentText>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            fullWidth
                                                            variant="standard"
                                                            onChange={(event) => setFullName(event.target.value)}
                                                        />
                                                        <DialogContentText>
                                                            Código Postal
                                                        </DialogContentText>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            type="number"
                                                            fullWidth
                                                            variant="standard"
                                                            onChange={(event) => setPostalCode(event.target.value)}
                                                            InputProps={{
                                                                inputProps: {
                                                                    type: 'number',
                                                                },
                                                            }}
                                                        />
                                                        <DialogContentText>
                                                            Estado
                                                        </DialogContentText>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            fullWidth
                                                            variant="standard"
                                                            onChange={(event) => setDistrict(event.target.value)}
                                                        />
                                                        <DialogContentText>
                                                            Teléfono
                                                        </DialogContentText>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            fullWidth
                                                            variant="standard"
                                                            onChange={(event) => setPhone(event.target.value)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={1}></Grid>
                                                    <Grid item xs={5.5}>
                                                        <DialogContentText>
                                                            CVV
                                                        </DialogContentText>

                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            type="number"
                                                            fullWidth
                                                            variant="standard"
                                                            onChange={(event) => setCVV(event.target.value)}
                                                            InputProps={{
                                                                inputProps: {
                                                                    type: 'number',
                                                                },
                                                            }}
                                                        />
                                                        <DialogContentText>
                                                            Año de expiración
                                                        </DialogContentText>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            type="number"
                                                            fullWidth
                                                            variant="standard"
                                                            onChange={(event) => setExpiryYear(event.target.value)}
                                                            InputProps={{
                                                                inputProps: {
                                                                    type: 'number',
                                                                },
                                                            }}
                                                        />
                                                        <DialogContentText>
                                                            Dirección
                                                        </DialogContentText>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            fullWidth
                                                            variant="standard"
                                                            onChange={(event) => setAddressLine(event.target.value)}
                                                        />
                                                        <DialogContentText>
                                                            Ciudad
                                                        </DialogContentText>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            fullWidth
                                                            variant="standard"
                                                            onChange={(event) => setCity(event.target.value)}
                                                        />
                                                        <DialogContentText>
                                                            País
                                                        </DialogContentText>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            fullWidth
                                                            variant="standard"
                                                            onChange={(event) => setCountry(event.target.value)}
                                                        />
                                                        <DialogContentText>
                                                            Email
                                                        </DialogContentText>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            fullWidth
                                                            variant="standard"
                                                            onChange={(event) => setEmail(event.target.value)}
                                                        />
                                                    </Grid>
                                                </Grid>

                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleClose}>Cancelar</Button>
                                                <Button size="small" color="yellow" variant="contained" onClick={handlepurchase}>Comprar</Button>
                                            </DialogActions>

                                        </Dialog>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Stack>
        </Grid>
    )
}

export default Tickets;
