import List from "./List";
import FavoredData from "./FavoredData";
import { Grid } from "@material-ui/core";
import { Button } from "@material-ui/core";

const Payment = ({
    pathname,
    id,
    setIsPaymentScreen,
}: {
    pathname: string;
    id: number;
    setIsPaymentScreen: (isPaymentScreen: boolean) => void;
}) => {
    return (
        <>
            <FavoredData id={id} />
            <List
                pathname={pathname}
                id={id}
                setIsPaymentScreen={setIsPaymentScreen}
            />
            <Grid
                container
                justifyContent="flex-end"
                className="margin-top-16"
                spacing={2}
            >
                <Grid item>
                    <Button
                        variant="outlined"
                        onClick={() => setIsPaymentScreen(false)}
                    >
                        Cancelar
                    </Button>
                </Grid>
            </Grid>
        </>
    );
};

export default Payment;
