import React, { useState } from 'react';
import { Group } from '@/types';

type AdminDataEditGroupProps = {
  group: Group;
  onSave: (group: Group) => void;
  onCancel: () => void;
};

const AdminDataEditGroup = (props: AdminDataEditGroupProps) => {
  const [name, setName] = useState(props.group.name);
  const [code, setCode] = useState(props.group.code);
  const [description, setDescription] = useState(props.group.description || '');

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const onChangeCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

  const onChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const onClickEditConfirm = () => {
    props.onSave({
      ...props.group,
      name: name,
      code: code,
      description: description,
      // Note: ownerId and driverIds are not editable from admin mode
    });
  };

  const onClickEditCancel = () => {
    props.onCancel();
  };

  return (
    <>
      <div className="data-box edit group">
        <input
          className="data-box-edit-input"
          type="text"
          value={name}
          onChange={onChangeName}
          placeholder="Name"
        />
        <input
          className="data-box-edit-input code"
          type="text"
          value={code}
          onChange={onChangeCode}
          placeholder="Code"
        />
        <input
          className="data-box-edit-input description"
          type="text"
          value={description}
          onChange={onChangeDescription}
          placeholder="Description"
        />
        <div
          className="data-box-edit-confirm"
          id="UpdateButton"
          onClick={onClickEditConfirm}
        >
          Update
        </div>
        <div
          className="data-box-edit-cancel"
          id="CancelButton"
          onClick={onClickEditCancel}
        >
          Cancel
        </div>
      </div>
    </>
  );
};

export default AdminDataEditGroup;
