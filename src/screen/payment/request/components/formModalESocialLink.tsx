import { useFormikContext } from 'formik';
import { Container, Grid, Checkbox } from '@material-ui/core';

import { TPaymentsToEsocialLink } from 'src/core/models/payment';
import { TextField } from 'src/components/form';
import { Submit } from 'src/components/button';
import { FormikContext } from "src/components/form";

const formModalESocialLink = () => {
	const { handleSubmit, setFieldValue, values } = useFormikContext<FormikContext>();

	const selectPaymentId = (checked: boolean | undefined, index: number, paymentId: number) => {
		setFieldValue(`eSocialList.${values?.lastChecked}.checked`, false);
		setFieldValue(`eSocialList.${index}.checked`, !checked);
		setFieldValue(`lastChecked`, index);
		setFieldValue(`eSocialLinkedPaymentId`, paymentId);
	};
		
	return (
		<>
			<Container style={{ overflowY: "scroll", height:240, width: '100%' }}>
					{
						values?.eSocialList?.map(({ paymentId, checked }: TPaymentsToEsocialLink, index: number) => 
							<Grid key={paymentId} spacing={2} style={{ marginBottom: 8, borderBottom: '1px solid #AAA' }} container>	
								<Grid item xs={2} md={1}>
									<Checkbox
										name={`eSocialList.${index}.checked`}
										onClick={() => selectPaymentId(checked, index, paymentId)}
										checked={checked}								
										style={{ marginTop: 6 }}
									/>
								</Grid>
								<Grid item xs={6} md={3}>
									<TextField
										type="text"
										label="Favorecido"
										readOnly
										name={`eSocialList.${index}.favored`}
									/>
								</Grid>
								<Grid item xs={4} md={2}>
									<TextField
										type="text"
										label="CPF"
										readOnly
										name={`eSocialList.${index}.cpf`}
									/>
								</Grid>
								<Grid item xs={6} md={2}>
									<TextField
										type="text"
										label="Parte contrária"
										readOnly
										name={`eSocialList.${index}.oppositeParty`}
									/>
								</Grid>
								<Grid item xs={3} md={2}>
									<TextField
										type="text"
										label="Pasta CTG"
										readOnly
										name={`eSocialList.${index}.folderNumber`}
									/>
								</Grid>
								<Grid item xs={3} md={2}>
									<TextField
										type="text"
										label="Valor"
										readOnly
										name={`eSocialList.${index}.judicialPaymentValue`}
									/>
								</Grid>
							</Grid>
						)
					}
			</Container>
			<Container style={{ height: 40, display: 'flex', marginTop: 16, justifyContent: 'flex-end' }}>
				<Submit text="Salvar" click={handleSubmit} />
			</Container> 
		</>
	);
};

export default formModalESocialLink;
