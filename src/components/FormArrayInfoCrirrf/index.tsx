import { Grid } from "@material-ui/core";
import { ReactNode, useState } from "react";
import { FormikContext } from "src/components/form";
import { useFormikContext } from "formik";
import { IconButton } from "@material-ui/core";
import { FieldArray, ArrayHelpers } from "formik";
import AccordionPanel from "../AccordionPanel";
import { Button } from "../button";
import DeleteIcon from "@material-ui/icons/Delete";
import { MainDiv } from "./styled";
import { useParams } from "react-router-dom";

type Props = {
	lable: string;
	name: string;
	lableChild: string;
	renderChildren: (index: number) => React.ReactElement;
	initialValues: any;
	slotBottomLeft?: ReactNode;
};
function findProperty(obj: any, path: string): any {
	const pathSplit = path.split(".");
	let currentProperty = obj;

	for (let i = 0; i < pathSplit.length; i++) {
		currentProperty = currentProperty[pathSplit[i]];
		if (currentProperty === undefined) {
			return undefined;
		}
	}

	return Array.isArray(currentProperty) === false ? [currentProperty] : currentProperty;
}

const FormArrayInfoCrirrf = ({
	lable,
	name,
	lableChild,
	renderChildren,
	initialValues,
	slotBottomLeft,
}: Props) => {

	const { values } = useFormikContext<FormikContext>();
	const [isClicked, setIsClicked] = useState<boolean>(false);
	const { id } = useParams<{ id: string }>();

	const isNew = id === "novo";

	return (
		<MainDiv>
			<FieldArray
				name={name}
				render={(arrayHelpers: ArrayHelpers) => {
					return (
						<AccordionPanel 
							title={lable} 
							startExpanded={false}
							ativateBorder
							slotTopRight={slotBottomLeft}
							slotTopRightPermission={"view"}
						>
							<Button
								color="primary"
								variant="contained"
								text={`Adicionar novo ${lableChild}`}
								onClick={() => {
									setIsClicked(true)
									arrayHelpers.push(initialValues);
								}}

							/>
							
							{findProperty(values, name)?.map((_: any, index: number) => {
	
								if (findProperty(values, name)[index]?.isDeleted) null
					
								return (
									
										values.generateLine === true || isClicked === true || isNew === false ? 
										<div key={`div${name}-${index}`} style={{display: findProperty(values, name)[index]?.isDeleted ? "none":"block"}}>
										<IconButton
											color="primary"
											style={{
												backgroundColor: "#cd0909",
												color: "white",
												position: "absolute",
												zIndex: 999,
												right: 0,
												transform: "translate(-70px, 4px) scale(.7)",
											}}
											onClick={() => {
												arrayHelpers.replace(index, {
													...findProperty(values, name)[index],
													isDeleted: true
												})
											}}
										>
											<DeleteIcon />
										</IconButton>
										<AccordionPanel
											title={`${lableChild} - ${index + 1}`}
											startExpanded={false}
											key={`${name}-${index}`}
											ativateBorder
										>
											<Grid item md={12} xs={12}></Grid>
											<MainDiv>
												<>
													<Grid container spacing={3}>
														{renderChildren(index)}
													</Grid>
												</>
											</MainDiv>
										</AccordionPanel>
									</div> : null
										
								);
							})}
						</AccordionPanel>
					);
				}}
			/>
		</MainDiv>
	);
};

export default FormArrayInfoCrirrf;

