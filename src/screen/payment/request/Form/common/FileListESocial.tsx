import React from 'react';
import { useFormikContext } from 'formik';
import { TPayment } from 'src/core/models/payment'; // Ajuste o caminho de importação conforme necessário
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const FileListESocial: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<TPayment>();

  const handleDelete = (fileName: string) => {
    const newFilesEsocial = { ...values.filesEsocial };
    delete newFilesEsocial[fileName];
    setFieldValue('filesEsocial', newFilesEsocial);
  };

  return (
    <List>
      {values.filesEsocial && Object.keys(values.filesEsocial).map((fileName) => (
        <ListItem key={fileName}>
          <ListItemText primary={fileName} />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(fileName)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default FileListESocial;
