import { ChangeEvent, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import { useSnackbar } from "notistack";

import AccordionPanel from "src/components/AccordionPanel";
import { Upload, TextField } from "src/components/form";
import { getItemGoodsGuaranteesRequest } from "src/core/store/modules/goods-guarantee/selectors";
import { deleteGoodsGuaranteesRequestFile, uploadGoodsGuaranteesFile } from "src/core/store/modules/goods-guarantee/thunks";
import { AppDispatch } from "src/core/store";
import { t } from 'src/locale/i18n'
import { actions } from 'src/core/store'

import { TYPE_FLOW } from "../constants";

type Props = {
	typeFlow: TYPE_FLOW
}

export default function FlowAttachments({ typeFlow }: Props) {
	const dispatch = useDispatch<AppDispatch>()
	const { enqueueSnackbar } = useSnackbar()

	const item = useSelector(getItemGoodsGuaranteesRequest);

	const handleUpload = async  (event: ChangeEvent) => {
		const { files } = event.target as HTMLInputElement
		if (!item.id || !files)
			return

		const { meta } = await dispatch(uploadGoodsGuaranteesFile({
			goodsAndGuaranteesId: item.id,
			files
		}))

		if (meta.requestStatus === "rejected")
			enqueueSnackbar(t('uploadError'), { variant: 'error' })
	}

	const handleDelete = (file: any) => {
		if (file && file.id) {
			dispatch(deleteGoodsGuaranteesRequestFile(file.id));
		}
	};

	const initialValues = useMemo(() => {
		let files = item?.files ?? [];
		if (typeFlow !== TYPE_FLOW.INSURANCE)
			files = files.filter(({ isMainFile }: any) => isMainFile);

		return { files }
	}, [item, typeFlow])
	useEffect(() => () => dispatch(actions.goodsGuaranteesRequest.setEmail("")), [dispatch])

	return ( 
		<>
			<AccordionPanel title={t('form.attachments')}>
				<div className='row'>
					<Formik
						initialValues={initialValues}
						onSubmit={() => {}}
						enableReinitialize
					>
						<Form>
							<Upload
								fileNameLengthLimiter={true}
								id="flow-files-upload"
								multiple
								name="files"
								onUploadAfterChanges={handleUpload}
								onDelete={handleDelete}
							/>
						</Form>
					</Formik>
				</div>
			</AccordionPanel>
			<AccordionPanel title={"Enviar e-mails"}>
				<Formik
					initialValues={initialValues}
					onSubmit={() => {}}
					enableReinitialize
				>
					<Form>
						<TextField
							name="emails"
							label={"E-mails"}
							onChange={(e:any) => {dispatch(actions.goodsGuaranteesRequest.setEmail(e.target.value))}}
							helperText={t('goodsAndGuarantees:formFlow.emailsHelperText')}
						/>
					</Form>
				</Formik>
			</AccordionPanel>
		</>
	)
}
