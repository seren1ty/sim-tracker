import React, { useState } from 'react';
import { NewDriver } from '@/types';

type AdminDataAddDriverProps = {
  onSave: (driver: NewDriver) => void;
  onCancel: () => void;
};

const AdminDataAddDriver = (props: AdminDataAddDriverProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onClickAddConfirm = () => {
    props.onSave({
      name: name,
      email: email,
    });

    setName('');
    setEmail('');
  };

  const onClickAddCancel = () => {
    props.onCancel();
  };

  return (
    <>
      <div className="data-box add driver">
        <input
          className="data-box-edit-input"
          type="text"
          value={name}
          onChange={onChangeName}
          placeholder="Name"
        />
        <input
          className="data-box-edit-input email"
          type="text"
          value={email}
          onChange={onChangeEmail}
          placeholder="Email"
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
    </>
  );
};

export default AdminDataAddDriver;
