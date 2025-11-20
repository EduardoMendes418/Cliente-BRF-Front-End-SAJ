import { Button } from "@material-ui/core"
import { useHistory } from "react-router-dom"

type CancelButtonProps = {
    onClickCancel?: () => void
    label?: string
}

const CancelButton = ({ onClickCancel, label }: CancelButtonProps) => {
    const { location: { pathname }, ...history } = useHistory()

    return (
       <Button
			variant='outlined'
			onClick={() => {
				if(onClickCancel) {
					onClickCancel()
					return
				};
				history.push(pathname.replace(/\/[^/]+$/, ''))
			}}
		>
            {label ?? "Cancelar"}
        </Button>
    )
}

export default CancelButton