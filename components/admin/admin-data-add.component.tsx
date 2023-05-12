import React, { useState } from 'react';

type AdminDataAddProps = {
  onSave: (name: string) => void;
  onCancel: () => void;
};

const AdminDataAdd = (props: AdminDataAddProps) => {
  const [addItemName, setAddItemName] = useState('');

  const onChangeAddItemName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddItemName(event.target.value);
  };

  const onClickAddConfirm = () => {
    props.onSave(addItemName);

    setAddItemName('');
  };

  const onClickAddCancel = () => {
    props.onCancel();
  };

  return (
    <React.Fragment>
      <div className="data-box add">
        <input
          className="data-box-edit-input"
          type="text"
          value={addItemName}
          onChange={onChangeAddItemName}
          placeholder="Enter item name.."
        />
        <div className="data-box-edit-confirm" onClick={onClickAddConfirm}>
          Save
        </div>
        <div className="data-box-edit-cancel" onClick={onClickAddCancel}>
          Cancel
        </div>
      </div>
    </React.Fragment>
  );
};

export default AdminDataAdd;
