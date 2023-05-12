import React, { useState } from 'react';
import { NewGroup } from '../../types';

type AdminDataAddGroupProps = {
  onSave: (group: NewGroup) => void;
  onCancel: () => void;
};

const AdminDataAddGroup = (props: AdminDataAddGroupProps) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [ownerId, setOwnerId] = useState('');

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const onChangeCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

  const onChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const onChangeOwnerId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOwnerId(event.target.value);
  };

  const onClickAddConfirm = () => {
    props.onSave({
      name: name,
      code: code,
      description: description,
      ownerId: ownerId,
    });

    setName('');
    setCode('');
    setDescription('');
    setOwnerId('');
  };

  const onClickAddCancel = () => {
    props.onCancel();
  };

  return (
    <React.Fragment>
      <div className="data-box add group">
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
        <input
          className="data-box-edit-input ownerId"
          type="input"
          value={ownerId}
          onChange={onChangeOwnerId}
          placeholder="OwnerId"
        />
        <div
          className="data-box-edit-confirm"
          id="SaveButton"
          onClick={onClickAddConfirm}
        >
          Save
        </div>
        <div
          className="data-box-edit-cancel"
          id="CancelButton"
          onClick={onClickAddCancel}
        >
          Cancel
        </div>
      </div>
    </React.Fragment>
  );
};

export default AdminDataAddGroup;
